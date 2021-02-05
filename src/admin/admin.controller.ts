import {BadRequestException, Body, Controller, Get, Post, Request} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {RegisterDto, UserDto} from "../auth/user/user.dto";
import InfoService from "./info/service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {NoAuth} from "../auth/customize.decorator";
import {createHash} from "crypto";
import {Result} from "../utils/util";

@ApiBearerAuth()
@ApiTags('后台/用户相关')
@Controller('admin')
export class AdminController {
  constructor(
      private readonly infoService: InfoService,
      private readonly authService: AuthService
  ) {
  }

  @NoAuth('never')
  @Post('user/register')
  async register(@Body() body: RegisterDto): Promise<Result> {
    const {username, password, passwords} = body;

    if (password !== passwords) {
      throw new BadRequestException('两次密码不一致！')
    }
    const pass = createHash('sha256').update(password).digest('hex');
    await this.authService.register({username, password: pass});
    return {
      status: 'success',
      message: '注册成功！'
    }
  }

  @NoAuth(true)
  @Post('user/login')
  async login(@Body() body: UserDto, @Request() req: any): Promise<Result> {
    const {token} = await this.authService.login(req.user);
    return {
      status: 'success',
      body: {
        token
      }
    }
  }

  @NoAuth()
  @Get('user/info')
  async info(@Request() req: any): Promise<Result> {
    const userInfo = await this.infoService.find()
    console.log('userInfo', userInfo)
    if (userInfo) {
      return {
        status: 'success',
        body: {
          name: userInfo.admin.name,
          avatar: userInfo.admin.avatar,
          upload_type: userInfo.admin.upload_type,
        }
      };
    }
    return {
      status: 'error',
      message: '请先填写页面相关信息！'
    }
  }
}
