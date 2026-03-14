import { Controller, Request, Post, UseGuards, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req) {
        console.log(`Login attempt for username: ${req.username}`);
        const user = await this.authService.validateUser(req.username, req.password);
        if (!user) {
            console.log(`Login failed for username: ${req.username}`);
            throw new UnauthorizedException();
        }
        return this.authService.login(user);
    }
}
