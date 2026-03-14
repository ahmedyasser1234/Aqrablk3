import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { InternalTask } from './task.entity';
import { InternalMessage } from './internal-message.entity';
import { InternalNotification } from './notification.entity';
import { EmployeesService } from './employees.service';
import { TasksService } from './tasks.service';
import { InternalMessagesService } from './internal-messages.service';
import { InternalNotificationsService } from './notifications.service';
import { InternalDepartment } from './department.entity';
import { DepartmentsService } from './departments.service';
import { AdminSettings } from './admin-settings.entity';
import { AdminSettingsService } from './admin-settings.service';
import { InternalChatGroup } from './chat-group.entity';
import { ChatGroupsService } from './chat-groups.service';
import {
    InternalAuthController,
    EmployeesController,
    TasksController,
    InternalMessagesController,
    NotificationsController,
    DepartmentsController,
    ChatGroupsController,
} from './internal.controller';
import { InternalGateway } from './internal.gateway';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([
            Employee, InternalTask, InternalMessage, InternalNotification, InternalDepartment, AdminSettings, InternalChatGroup
        ])
    ],
    providers: [
        EmployeesService, TasksService, InternalMessagesService, InternalNotificationsService, DepartmentsService, AdminSettingsService, InternalGateway, ChatGroupsService
    ],
    controllers: [
        InternalAuthController, EmployeesController, TasksController, InternalMessagesController, NotificationsController, DepartmentsController, ChatGroupsController
    ],
    exports: [
        EmployeesService, TasksService, InternalMessagesService, InternalNotificationsService, DepartmentsService, AdminSettingsService, ChatGroupsService
    ],
})
export class InternalModule { }
