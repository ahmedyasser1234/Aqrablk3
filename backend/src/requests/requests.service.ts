import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRequest } from './request.entity';
import { ChatGateway } from '../chat/chat.gateway';
import * as nodemailer from 'nodemailer';

@Injectable()
export class RequestsService {
    private transporter;

    constructor(
        @InjectRepository(ServiceRequest)
        private requestRepository: Repository<ServiceRequest>,
        @Inject(forwardRef(() => ChatGateway))
        private chatGateway: ChatGateway,
    ) {
        // Initialize Email Transporter
        // TODO: Retrieve these from environment variables
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to your email provider
            auth: {
                user: 'aqrablkmedia@gmail.com', // TODO: REPLACE THIS
                pass: 'your-app-password'       // TODO: REPLACE THIS
            }
        });
    }

    async create(data: Partial<ServiceRequest>) {
        const request = this.requestRepository.create(data);
        const saved = await this.requestRepository.save(request);

        // Notify admins via websocket
        const pendingCount = await this.countPending();
        this.chatGateway.server.emit('requestsUpdate', { pendingCount, newRequest: saved });

        // Notify via Email (Fire and forget)
        this.sendEmailNotification(saved).catch(err => console.error('Failed to send email:', err.message));

        return saved;
    }

    private async sendEmailNotification(request: ServiceRequest) {
        // Email Template
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-w: 600px; margin: auto;">
                <h2 style="color: #3b82f6;">New Service Request 🚀</h2>
                <p><strong>Service:</strong> ${request.service}</p>
                <p><strong>Client:</strong> ${request.name}</p>
                <p><strong>Phone:</strong> ${request.phone}</p>
                <p><strong>Email:</strong> ${request.email || 'N/A'}</p>
                <hr style="border: 0; border-top: 1px solid #eee;"/>
                <p><strong>Details:</strong><br/>${request.description || 'No details provided'}</p>
                <br/>
                <a href="https://aqrablkmedia.com/dashboard/requests" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a>
            </div>
        `;

        try {
            await this.transporter.sendMail({
                from: '"Aqrab Notifications" <noreply@aqrablkmedia.com>',
                to: 'aqrablkmedia@gmail.com', // TODO: REPLACE WITH ADMIN EMAIL
                subject: `🔔 New Request: ${request.service} from ${request.name}`,
                html: htmlContent
            });
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    countPending() {
        return this.requestRepository.count({ where: { status: 'pending' } });
    }

    findAll() {
        return this.requestRepository.find({ order: { createdAt: 'DESC' } });
    }

    async updateStatus(id: number, status: string, handledBy?: string) {
        await this.requestRepository.update(id, { status, handledBy });

        // Notify admins to update badges
        const pendingCount = await this.countPending();
        this.chatGateway.server.emit('requestsUpdate', { pendingCount });

        return this.requestRepository.findOneBy({ id });
    }

    async delete(id: number) {
        await this.requestRepository.delete(id);

        // Notify admins to update badges
        const pendingCount = await this.countPending();
        this.chatGateway.server.emit('requestsUpdate', { pendingCount });

        return { deleted: true };
    }
}
