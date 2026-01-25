import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat_message.entity';

interface ChatMessageObj {
    sender: string;
    text: string;
    time: Date;
}

interface ChatSession {
    visitorId: string;
    socketId: string;
    name: string;
    unread: number;
}

@WebSocketGateway({
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
    },
    allowEIO3: true,
})
export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    private sessions = new Map<string, ChatSession>();
    private adminConnected = false;

    constructor(
        @InjectRepository(ChatMessage)
        private readonly messageRepository: Repository<ChatMessage>,
    ) { }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);

        if (client.handshake.query.role === 'admin') {
            this.adminConnected = false;
            this.server.emit('adminStatus', { online: false });
        }
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);

        if (client.handshake.query.role === 'admin') {
            this.adminConnected = true;
            this.server.emit('adminStatus', { online: true });
            client.emit('activeSessions', this.getFormattedSessions());
        } else {
            client.emit('adminStatus', { online: this.adminConnected });
        }
    }

    @SubscribeMessage('joinChat')
    async handleJoinChat(client: Socket, payload: { name: string; visitorId: string }) {
        const { visitorId, name } = payload;

        const session: ChatSession = {
            visitorId,
            socketId: client.id,
            name: name || 'Visitor',
            unread: 0
        };
        this.sessions.set(visitorId, session);

        const history = await this.messageRepository.find({
            where: { visitorId },
            order: { timestamp: 'ASC' },
        });

        client.emit('chatHistory', history);

        if (history.length === 0 && !this.adminConnected) {
            setTimeout(async () => {
                const botText = 'مرحباً بك في أقربلك ميديا! 👋\nأنا المساعد الآلي. كيف يمكنني مساعدتك؟ (اكتب "خدمات" أو "مساعدة")';
                await this.saveAndSendMessage(client, visitorId, 'bot', botText);
            }, 1000);
        }

        this.broadcastSessions();
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: { text: string; visitorId: string }) {
        const { text, visitorId } = payload;
        let session = this.sessions.get(visitorId);

        if (!session) {
            session = { visitorId, socketId: client.id, name: 'Returning Visitor', unread: 0 };
            this.sessions.set(visitorId, session);
        }

        session.unread += 1;
        const msg = await this.saveMessage(visitorId, 'user', text);

        this.server.emit('receiveAdminMessage', { ...msg, sessionId: visitorId });
        this.broadcastSessions();

        if (!this.adminConnected) {
            this.handleBotReply(client, visitorId, text);
        }

        client.emit('receiveMessage', msg);
    }

    @SubscribeMessage('adminReply')
    async handleAdminReply(client: Socket, payload: { visitorId: string; text: string }) {
        const { visitorId, text } = payload;
        const session = this.sessions.get(visitorId);

        const msg = await this.saveMessage(visitorId, 'admin', text);

        if (session) {
            session.unread = 0;
            this.server.to(session.socketId).emit('receiveMessage', msg);
        }

        this.broadcastSessions();
    }

    @SubscribeMessage('adminGetHistory')
    async handleAdminGetHistory(client: Socket, payload: { visitorId: string }) {
        const history = await this.messageRepository.find({
            where: { visitorId: payload.visitorId },
            order: { timestamp: 'ASC' },
        });

        // Auto reset unread when opening history
        const session = this.sessions.get(payload.visitorId);
        if (session) {
            session.unread = 0;
            this.broadcastSessions();
        }

        client.emit('chatHistory', history);
    }

    @SubscribeMessage('markAsRead')
    async handleMarkAsRead(client: Socket, payload: { visitorId: string }) {
        const session = this.sessions.get(payload.visitorId);
        if (session) {
            session.unread = 0;
            this.broadcastSessions();
        }
    }

    @SubscribeMessage('clearChat')
    async handleClearChat(client: Socket, payload: { visitorId: string }) {
        await this.messageRepository.delete({ visitorId: payload.visitorId });
        const session = this.sessions.get(payload.visitorId);
        if (session) {
            session.unread = 0;
            this.server.to(session.socketId).emit('chatHistory', []);
        }
        this.sessions.delete(payload.visitorId);
        this.broadcastSessions();
    }

    private async saveMessage(visitorId: string, sender: string, text: string) {
        const message = this.messageRepository.create({ visitorId, sender, text });
        return this.messageRepository.save(message);
    }

    private async saveAndSendMessage(client: Socket, visitorId: string, sender: string, text: string) {
        const msg = await this.saveMessage(visitorId, sender, text);
        client.emit('receiveMessage', msg);
    }

    private handleBotReply(client: Socket, visitorId: string, text: string) {
        setTimeout(async () => {
            if (this.adminConnected) return;

            let replyText = '';
            const lowerText = text.toLowerCase();

            if (lowerText.includes('خدمات') || lowerText.includes('service')) {
                replyText = 'نقدم خدمات متكاملة:\n1. موشن جرافيك\n2. مونتاج\n3. تصوير\n4. تصميم ومواقع\nللمزيد، تصفح قائمة "خدماتنا" في الموقع.';
            } else if (lowerText.includes('سعر') || lowerText.includes('price') || lowerText.includes('تكلفة')) {
                replyText = 'الأسعار تعتمد على نوع المشروع وتفاصيله. يمكنك حجز استشارة مجانية من صفحة "تواصل معنا" أو ترك رقم هاتفك هنا للتواصل.';
            } else if (lowerText.includes('سلام') || lowerText.includes('hello') || lowerText.includes('مرحبا') || lowerText.includes('هلا')) {
                replyText = 'أهلاً بك! 🌹\nأنا المساعد الآلي. كيف يمكنني مساعدتك اليوم؟';
            } else if (lowerText.includes('مساعدة') || lowerText.includes('مساعده')) {
                replyText = 'أكيد! إحنا هنا عشان نساعدك.\nممكن تقولي إيه الخدمة اللي بتدور عليها بالتحديد؟';
            } else {
                replyText = 'شكراً لتواصلك. سيقوم أحد ممثلي الخدمة بالرد عليك قريباً.\nفي الوقت الحالي، يمكنك سؤالي عن "الخدمات" أو "الأسعار".';
            }

            const session = this.sessions.get(visitorId);
            if (session) {
                await this.saveAndSendMessage(client, visitorId, 'bot', replyText);
                this.broadcastSessions();
            }
        }, 1500);
    }

    private broadcastSessions() {
        this.server.emit('activeSessions', this.getFormattedSessions());
    }

    private getFormattedSessions() {
        return Array.from(this.sessions.values()).map(s => ({
            id: s.visitorId,
            name: s.name,
            unread: s.unread,
        }));
    }
}
