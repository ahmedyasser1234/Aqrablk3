import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UnauthorizedException, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EmployeesService } from './employees.service';
import { TasksService } from './tasks.service';
import { InternalMessagesService } from './internal-messages.service';
import { InternalNotificationsService } from './notifications.service';
import { DepartmentsService } from './departments.service';
import { AdminSettingsService } from './admin-settings.service';
import { ChatGroupsService } from './chat-groups.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'internal_secret_2024';

function signToken(payload: object): string {
    return (jwt as any).sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

// ============================================
// AUTH
// ============================================
@Controller('internal/auth')
export class InternalAuthController {
    constructor(
        private employeesService: EmployeesService,
        private adminSettingsService: AdminSettingsService
    ) { }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        if (body.username === 'admin') {
            const adminData = await this.adminSettingsService.getSettings();
            const isMatch = await bcrypt.compare(body.password, adminData.password);
            if (!isMatch) throw new UnauthorizedException('بيانات خاطئة أو الحساب معطل');

            const token = signToken({ id: 0, name: adminData.name, role: 'Admin', username: 'admin' });
            return { token, user: { id: 0, name: adminData.name, avatar: adminData.avatar, role: 'Admin', username: 'admin' } };
        }
        
        if (body.username === 'chairman') {
            const chairmanData = await this.adminSettingsService.getChairmanSettings();
            const isMatch = await bcrypt.compare(body.password, chairmanData.password);
            if (!isMatch) throw new UnauthorizedException('بيانات خاطئة أو الحساب معطل');

            const token = signToken({ id: -1, name: chairmanData.name, role: 'Chairman', username: 'chairman' });
            return { token, user: { id: -1, name: chairmanData.name, avatar: chairmanData.avatar, role: 'Chairman', username: 'chairman' } };
        }

        const emp = await this.employeesService.validate(body.username, body.password);
        if (!emp) throw new UnauthorizedException('بيانات خاطئة أو الحساب معطل');
        const token = signToken({ id: emp.id, name: emp.name, role: emp.role, username: emp.username, department: emp.department });
        await this.employeesService.setStatus(emp.id, 'online');
        return { token, user: { ...emp, role: emp.role } };
    }

    @Post('logout')
    async logout(@Body() body: { employeeId: number }) {
        if (body.employeeId > 0) {
            await this.employeesService.setStatus(body.employeeId, 'offline');
        }
        return { success: true };
    }

    @Post('change-password')
    async changePassword(@Body() body: { employeeId: number; oldPass: string; newPass: string }) {
        if (body.employeeId === 0) {
            const adminData = await this.adminSettingsService.getSettings();
            const isMatch = await bcrypt.compare(body.oldPass, adminData.password);
            if (!isMatch) throw new UnauthorizedException('كلمة المرور القديمة غير صحيحة');
            
            const hashed = await bcrypt.hash(body.newPass, 10);
            await this.adminSettingsService.updatePassword(hashed);
            return { success: true };
        }
        if (body.employeeId === -1) {
            const chairmanData = await this.adminSettingsService.getChairmanSettings();
            const isMatch = await bcrypt.compare(body.oldPass, chairmanData.password);
            if (!isMatch) throw new UnauthorizedException('كلمة المرور القديمة غير صحيحة');
            
            const hashed = await bcrypt.hash(body.newPass, 10);
            await this.adminSettingsService.updateChairmanPassword(hashed);
            return { success: true };
        }
        const success = await this.employeesService.changePassword(body.employeeId, body.oldPass, body.newPass);
        if (!success) throw new UnauthorizedException('كلمة المرور القديمة غير صحيحة');
        return { success: true };
    }

    @Get('admin-profile')
    async getAdminProfile(@Query('role') role?: string) {
        if (role === 'Chairman') {
            const settings = await this.adminSettingsService.getChairmanSettings();
            return { name: settings.name, avatar: settings.avatar };
        }
        const settings = await this.adminSettingsService.getSettings();
        return { name: settings.name, avatar: settings.avatar };
    }

    @Patch('admin-profile')
    async updateAdminProfile(@Body() body: { name?: string; avatar?: string; role?: string }) {
        if (body.role === 'Chairman') {
            const settings = await this.adminSettingsService.updateChairmanProfile(body.name, body.avatar);
            return { name: settings.name, avatar: settings.avatar };
        }
        const settings = await this.adminSettingsService.updateProfile(body.name, body.avatar);
        return { name: settings.name, avatar: settings.avatar };
    }
}

// ============================================
// EMPLOYEES
// ============================================
@Controller('internal/employees')
export class EmployeesController {
    constructor(private employeesService: EmployeesService) { }

    @Get()
    findAll() {
        return this.employeesService.findAll();
    }

    @Post()
    create(@Body() body: any) {
        return this.employeesService.create(body);
    }

    @Patch(':id/profile')
    updateProfile(@Param('id') id: string, @Body() body: { name?: string; avatar?: string }) {
        return this.employeesService.updateProfile(Number(id), body);
    }

    @Patch(':id/toggle-status')
    toggleStatus(@Param('id') id: string) {
        return this.employeesService.toggleActive(Number(id));
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.employeesService.remove(Number(id));
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
            }
        })
    }))
    uploadFile(@UploadedFile() file: any, @Req() req: Request) {
        const protocol = req.protocol;
        const host = req.get('host');
        return { url: `${protocol}://${host}/uploads/${file.filename}` };
    }
}

// ============================================
// TASKS
// ============================================
@Controller('internal/tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    findAll() {
        return this.tasksService.findAll();
    }

    @Get('my/:employeeId')
    findMine(@Param('employeeId') id: string, @Query('dept') dept?: string) {
        return this.tasksService.findByEmployee(Number(id), dept);
    }

    @Post()
    create(@Body() body: any) {
        return this.tasksService.create(body);
    }

    @Patch(':id/accept')
    accept(@Param('id') id: string, @Body() body: { employeeId?: number }) {
        return this.tasksService.accept(Number(id), body?.employeeId);
    }

    @Patch(':id/complete')
    complete(@Param('id') id: string) {
        return this.tasksService.complete(Number(id));
    }

    @Patch(':id/verify')
    verify(@Param('id') id: string) {
        return this.tasksService.verify(Number(id));
    }

    @Patch(':id/pause')
    pause(@Param('id') id: string) {
        return this.tasksService.pause(Number(id));
    }

    @Patch(':id/resume')
    resume(@Param('id') id: string) {
        return this.tasksService.resume(Number(id));
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.tasksService.update(Number(id), body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.tasksService.delete(Number(id));
    }
}

// ============================================
// MESSAGES
// ============================================
@Controller('internal/messages')
export class InternalMessagesController {
    constructor(private messagesService: InternalMessagesService) { }

    @Get('general')
    getGeneral() {
        return this.messagesService.getGeneral();
    }

    @Get('dm/:user1/:user2')
    getDM(@Param('user1') u1: string, @Param('user2') u2: string) {
        return this.messagesService.getDM(Number(u1), Number(u2));
    }

    @Get('dept/:name')
    getDept(@Param('name') name: string) {
        return this.messagesService.getDeptMessages(name);
    }

    @Get('group/:groupId')
    getGroup(@Param('groupId') groupId: string) {
        return this.messagesService.getGroupMessages(Number(groupId));
    }

    @Post()
    send(@Body() body: any) {
        return this.messagesService.send(body);
    }

    @Post('read')
    markMessagesRead(@Body() body: { userId: number; peerId: number | 'general' | string }) {
        return this.messagesService.markAsRead(Number(body.userId), body.peerId);
    }

    @Delete('clear')
    clearChat(@Body() body: { userId: number; peerId: number | 'general' | string }) {
        return this.messagesService.clearChat(Number(body.userId), body.peerId);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.messagesService.deleteMessage(Number(id));
    }
}

// ============================================
// NOTIFICATIONS
// ============================================
@Controller('internal/notifications')
export class NotificationsController {
    constructor(private notifService: InternalNotificationsService) { }

    @Get(':userId')
    findAll(@Param('userId') id: string) {
        return this.notifService.findAllForUser(Number(id));
    }

    @Get(':userId/unread')
    getUnreadCount(@Param('userId') id: string) {
        return this.notifService.getUnreadCount(Number(id));
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.notifService.markAsRead(Number(id));
    }

    @Post(':userId/read-all')
    markAllAsRead(@Param('userId') id: string) {
        return this.notifService.markAllAsRead(Number(id));
    }

    @Post(':userId/read-by-link')
    markAsReadByLink(@Param('userId') id: string, @Body() body: { link: string }) {
        return this.notifService.markAsReadByLink(Number(id), body.link);
    }

    @Post('test/:userId')
    test(@Param('userId') id: string) {
        return this.notifService.createTestNotification(Number(id));
    }
}

// ============================================
// DEPARTMENTS
// ============================================
@Controller('internal/departments')
export class DepartmentsController {
    constructor(private deptService: DepartmentsService) { }

    @Get()
    findAll() {
        return this.deptService.findAll();
    }

    @Post()
    create(@Body() body: any) {
        return this.deptService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.deptService.update(Number(id), body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.deptService.delete(Number(id));
    }
}

// ============================================
// CHAT GROUPS
// ============================================
@Controller('internal/chat-groups')
export class ChatGroupsController {
    constructor(private groupsService: ChatGroupsService) { }

    @Get('user/:userId')
    getGroupsForUser(@Param('userId') id: string) {
        return this.groupsService.getGroupsForUser(Number(id));
    }

    @Post()
    createGroup(@Body() body: { name: string, adminId: number, memberIds: number[] }) {
        return this.groupsService.createGroup(body.name, Number(body.adminId), body.memberIds);
    }

    @Delete(':id/:adminId')
    deleteGroup(@Param('id') id: string, @Param('adminId') adminId: string) {
        return this.groupsService.deleteGroup(Number(id), Number(adminId));
    }
}
