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
import { EmployeesService } from './employees.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
    namespace: 'internal',
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class InternalGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('InternalGateway');

    // Track connected employees by their ID
    private connectedEmployees = new Map<number, string>(); // empId -> socketId
    private superadminOnline = false;
    private chairmanOnline = false;

    constructor(
        private employeesService: EmployeesService,
        private usersService: UsersService
    ) { }

    afterInit(server: Server) {
        this.logger.log('Internal Gateway Initialized');
    }

    async handleConnection(client: Socket) {
        const empId = Number(client.handshake.query.empId);
        if (!isNaN(empId)) {
            this.connectedEmployees.set(empId, client.id);
            
            if (empId === 0) {
                this.superadminOnline = true;
                this.logger.log('Superadmin (ID 0) connected');
            } else if (empId === -1) {
                this.chairmanOnline = true;
                this.logger.log('Chairman (ID -1) connected');
            } else {
                await this.employeesService.setStatus(empId, 'online');
                // Check if this employee is an Admin
                const emp = await this.employeesService.findById(empId);
                if (emp && emp.role === 'Admin') {
                    this.superadminOnline = true;
                }
                this.logger.log(`Employee ${empId} connected: ${client.id}`);
            }
            this.broadcastStatus();
        }
    }

    async handleDisconnect(client: Socket) {
        const empId = Number(client.handshake.query.empId);
        if (!isNaN(empId)) {
            this.connectedEmployees.delete(empId);
            
            if (empId === 0) {
                const admin = await this.usersService.findOne('ahmed');
                if (admin) {
                    await this.usersService.update(admin.id, { lastSeen: new Date() });
                }
                this.logger.log('Superadmin (ID 0) disconnected');
            } else if (empId === -1) {
                this.chairmanOnline = false;
                this.logger.log('Chairman (ID -1) disconnected');
            } else {
                await this.employeesService.setStatus(empId, 'offline');
                this.logger.log(`Employee ${empId} disconnected: ${client.id}`);
            }
            
            this.superadminOnline = await this.checkIfAnyAdminConnected();
            this.broadcastStatus();
        }
    }

    private async checkIfAnyAdminConnected(): Promise<boolean> {
        // Check if ID 0 is in the map
        if (this.connectedEmployees.has(0)) return true;

        // Check map for anyone with role 'Admin'
        for (const [id, socketId] of this.connectedEmployees.entries()) {
            if (id === 0) continue;
            const emp = await this.employeesService.findById(id);
            if (emp && emp.role === 'Admin') return true;
        }
        
        return false; 
    }

    private broadcastStatus() {
        this.server.emit('statusUpdate', {
            onlineCount: this.connectedEmployees.size + (this.superadminOnline ? 1 : 0),
            superadminOnline: this.superadminOnline,
            chairmanOnline: this.chairmanOnline,
            onlineEmployeeIds: Array.from(this.connectedEmployees.keys()),
        });
    }

    @SubscribeMessage('newMessage')
    handleNewMessage(client: Socket, payload: any) {
        // Broadcast to all internal users
        this.server.emit('messageReceived', payload);
    }

    @SubscribeMessage('markRead')
    handleMarkRead(client: Socket, payload: { userId: number; peerId: number | 'general' }) {
        this.logger.log(`Messages marked as read by ${payload.userId} for peer ${payload.peerId}`);
        // Notify others that messages were read so they can update UI checkmarks
        this.server.emit('messagesRead', payload);
    }
}
