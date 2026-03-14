import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalTask } from './task.entity';
import { InternalMessagesService } from './internal-messages.service';
import { InternalNotificationsService } from './notifications.service';
import { EmployeesService } from './employees.service';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(InternalTask)
        private tasksRepo: Repository<InternalTask>,
        @Inject(forwardRef(() => InternalMessagesService))
        private messagesService: InternalMessagesService,
        private notifService: InternalNotificationsService,
        private employeesService: EmployeesService,
    ) { }

    async findAll(): Promise<InternalTask[]> {
        return this.tasksRepo.find({ order: { createdAt: 'DESC' } });
    }

    async findByEmployee(employeeId: number, department?: string): Promise<InternalTask[]> {
        const personal = await this.tasksRepo.find({ where: { assignedTo: employeeId }, order: { createdAt: 'DESC' } });
        
        // Also include open dept tasks (no assignedTo) from employee's department
        if (department) {
            const openDeptTasks = await this.tasksRepo
                .createQueryBuilder('task')
                .where('task.department = :dept', { dept: department })
                .andWhere('task.assignedTo IS NULL')
                .andWhere('task.status = :status', { status: 'pending' })
                .orderBy('task.createdAt', 'DESC')
                .getMany();
            // Merge, avoiding duplicates
            const allIds = new Set(personal.map(t => t.id));
            for (const t of openDeptTasks) {
                if (!allIds.has(t.id)) personal.push(t);
            }
        }
        
        return personal.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    async create(data: Partial<InternalTask>): Promise<InternalTask> {
        // If startTime is in the future, set status to 'scheduled'
        if (data.startTime && new Date(data.startTime) > new Date()) {
            data.status = 'scheduled';
        }
        
        const task = await this.tasksRepo.save(data);

        // If it's a self-task (created by the employee for themselves), auto-start it
        if (task.assignedTo && task.creatorId === task.assignedTo) {
            task.status = 'in-progress';
            task.acceptedAt = new Date().toISOString();
            await this.tasksRepo.save(task);
        }

        // Auto-send a message to the employee OR department channel
        if (task.assignedTo) {
            const isSelfTask = task.creatorId === task.assignedTo;
            const senderId = task.creatorId || 0;
            const senderName = task.creatorName || (senderId === 0 ? 'المدير (إشعار نظام)' : 'موظف');
            
            // If self-task, message goes to Manager (0), otherwise to the employee
            const receiverId = isSelfTask ? 0 : task.assignedTo;
            const messageText = isSelfTask 
                ? `قام الموظف ${task.creatorName || ''} بفتح مهمة ذاتية لنفسه: ${task.title}`
                : `تم إسناد مهمة جديدة إليك: ${task.title}`;

            await this.messagesService.send({
                senderId: senderId,
                senderName: senderName,
                receiverId: receiverId,
                channel: 'dm',
                taskId: task.id,
                text: messageText
            }).catch(e => console.error('Failed to send auto-message', e));

            console.log(`Creating new task notification for user ${receiverId}`);
            await this.notifService.create({
                userId: receiverId,
                type: 'task',
                title: 'مهمة جديدة',
                message: messageText,
                link: isSelfTask ? 'dashboard' : 'tasks',
            }).catch(e => console.error('Failed to create notification', e));
        } else if (task.department) {
            const senderId = task.creatorId || 0;
            const senderName = task.creatorName || (senderId === 0 ? 'المدير (إشعار نظام)' : 'موظف');
            
            await this.messagesService.send({
                senderId: senderId,
                senderName: senderName,
                channel: 'dept',
                deptName: task.department,
                taskId: task.id,
                text: `مهمة جديدة للقسم: ${task.title}`
            }).catch(e => console.error('Failed to send department auto-message', e));
        }

        return task;
    }

    async update(id: number, data: Partial<InternalTask>): Promise<InternalTask | null> {
        await this.tasksRepo.update(id, data);
        return this.tasksRepo.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.tasksRepo.delete(id);
    }

    async accept(id: number, employeeId?: number): Promise<InternalTask | null> {
        // Find the task first to check if it's unassigned (open dept task)
        const existingTask = await this.tasksRepo.findOne({ where: { id } });
        const updateData: Partial<InternalTask> = { status: 'in-progress', acceptedAt: new Date().toISOString() };
        
        // If it's an open (unassigned) task and someone is claiming it, assign it
        if (!existingTask?.assignedTo && employeeId) {
            updateData.assignedTo = employeeId;
        }
        
        await this.tasksRepo.update(id, updateData);
        const task = await this.tasksRepo.findOne({ where: { id } });
        if (task && employeeId) {
            const employee = await this.employeesService.findById(employeeId);
            const empName = employee?.name || 'موظف';
            
            // Auto-send chat message
            if (task.department && !existingTask?.assignedTo) {
                // Was an open department task
                await this.messagesService.send({
                    senderId: 0,
                    senderName: 'المدير (إشعار نظام)',
                    channel: 'dept',
                    deptName: task.department,
                    taskId: task.id,
                    text: `مهمة جديدة للقسم: ${task.title} (تم استلام المهمة من قبل ${empName})`
                }).catch(() => { });
            } else {
                // Personal task
                await this.messagesService.send({
                    senderId: 0,
                    senderName: 'المدير (إشعار نظام)',
                    receiverId: task.assignedTo,
                    channel: 'dm',
                    taskId: task.id,
                    text: `تم استلام المهمة: ${task.title} من قبل ${empName}`
                }).catch(() => { });
            }

            console.log(`Creating task acceptance notification for Admin (0)`);
            // Notify Manager (Admin ID 0)
            await this.notifService.create({
                userId: 0,
                type: 'task',
                title: 'بدء تنفيذ مهمة',
                message: `بدأ الموظف العمل على المهمة: ${task.title}`,
                link: 'dashboard',
            }).catch(() => { });
        }
        return task;
    }

    async complete(id: number): Promise<InternalTask | null> {
        const nowStr = new Date().toISOString();
        await this.tasksRepo.update(id, { status: 'completed', completedAt: nowStr });
        const task = await this.tasksRepo.findOne({ where: { id } });
        
        if (task) {
            // Reward / Delay Logic
            if (task.assignedTo && task.deadline) {
                const employee = await this.employeesService.findById(task.assignedTo);
                if (employee) {
                    const completionTime = new Date(nowStr).getTime();
                    const deadlineTime = new Date(task.deadline).getTime();
                    const diffMinutes = Math.floor((deadlineTime - completionTime) / 60000);

                    let { points, delayDebtMinutes } = employee;

                    if (diffMinutes > 0) {
                        // Completed early
                        if (delayDebtMinutes > 0) {
                            // Pay off debt first
                            const reduction = Math.min(delayDebtMinutes, diffMinutes);
                            delayDebtMinutes -= reduction;
                            console.log(`Employee ${employee.name} reduced delay debt by ${reduction}m. Remaining: ${delayDebtMinutes}m`);
                        } else {
                            // No debt, give reward point
                            points += 1;
                            console.log(`Employee ${employee.name} earned 1 point for early completion!`);
                        }
                    } else if (diffMinutes < 0) {
                        // Completed late
                        const delay = Math.abs(diffMinutes);
                        delayDebtMinutes += delay;
                        console.log(`Employee ${employee.name} added ${delay}m to delay debt. Total: ${delayDebtMinutes}m`);
                    }

                    await this.employeesService.updateRewardStats(employee.id, points, delayDebtMinutes);
                }
            }

            console.log(`Creating task completion notification for Admin (0)`);
            // Notify Manager (Admin ID 0)
            await this.notifService.create({
                userId: 0,
                type: 'task',
                title: 'اكتملت مهمة',
                message: `قام الموظف بتسليم المهمة: ${task.title}`,
                link: `chat/${task.assignedTo}`,
            }).catch(e => console.error('Failed to create notification', e));
        }
        return task;
    }

    async verify(id: number): Promise<InternalTask | null> {
        await this.tasksRepo.update(id, { status: 'verified', verifiedAt: new Date().toISOString() });
        const task = await this.tasksRepo.findOne({ where: { id } });
        if (task) {
            console.log(`Creating task verification notification for user ${task.assignedTo}`);
            // Notify Employee
            await this.notifService.create({
                userId: task.assignedTo,
                type: 'task',
                title: 'تم استلام المهمة',
                message: `تم تأكيد استلام مهمتك: ${task.title} من قبل المدير`,
                link: 'tasks',
            }).catch(e => console.error('Failed to create notification', e));
        }
        return task;
    }

    async pause(id: number): Promise<InternalTask | null> {
        const task = await this.tasksRepo.findOne({ where: { id } });
        if (!task || task.isPaused || task.status === 'completed') {
            return task;
        }

        await this.tasksRepo.update(id, { 
            isPaused: true, 
            lastPausedAt: new Date().toISOString() 
        });
        
        const updatedTask = await this.tasksRepo.findOne({ where: { id } });
        
        if (updatedTask && updatedTask.assignedTo) {
             await this.notifService.create({
                userId: updatedTask.assignedTo,
                type: 'task',
                title: 'إيقاف المهمة مؤقتاً',
                message: `تم إيقاف المهمة مؤقتاً: ${updatedTask.title} من قبل المدير`,
                link: 'tasks',
            }).catch(e => console.error('Failed to create notification', e));
        }

        return updatedTask;
    }

    async resume(id: number): Promise<InternalTask | null> {
        const task = await this.tasksRepo.findOne({ where: { id } });
        if (!task || !task.isPaused || task.status === 'completed') {
            return task;
        }

        let additionalPausedMinutes = 0;
        if (task.lastPausedAt) {
            const pausedAtTime = new Date(task.lastPausedAt).getTime();
            const nowTime = new Date().getTime();
            additionalPausedMinutes = Math.floor((nowTime - pausedAtTime) / 60000);
        }

        await this.tasksRepo.update(id, { 
            isPaused: false,
            lastPausedAt: null as any,
            totalPausedMinutes: task.totalPausedMinutes + additionalPausedMinutes
        });

        const updatedTask = await this.tasksRepo.findOne({ where: { id } });

        if (updatedTask && updatedTask.assignedTo) {
             await this.notifService.create({
                userId: updatedTask.assignedTo,
                type: 'task',
                title: 'استئناف المهمة',
                message: `تم استئناف المهمة: ${updatedTask.title} من قبل المدير`,
                link: 'tasks',
            }).catch(e => console.error('Failed to create notification', e));
        }

        return updatedTask;
    }
}
