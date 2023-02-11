import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Put,
    Request,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ApiBearerAuth, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {UsersService} from "./users.service";

import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {UpdatePasswordDto} from "./user.dto";
import {Exclude} from "class-transformer";
import {User} from '@prisma/client'
export class RenderUser{
    @Exclude()
    password: string
    constructor(partial: Partial<User>) {
        Object.assign(this, partial)
    }
}
@ApiTags('user')
@Controller('user')
@ApiBearerAuth('access-token')
export class UsersController {
    constructor(
                private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('me')
    public async me(@Request() req) {
        return new RenderUser(req.user);
    }
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Put('update/password')
    public async updatePassword(@Request() req, @Body()
        updatePasswordDto: UpdatePasswordDto) {
        await this.usersService
            .updatePassword(updatePasswordDto, req.user.id);
        return {
            message: "password_update_success"
        };
    }

}