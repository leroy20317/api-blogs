import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import UserService from './user/user.service';
import {UserDto} from "./user/user.dto";
import {createHash} from 'crypto'

@Injectable()
export class AuthService {
  constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService
  ) {
  }

  async validateUser({username, password}: UserDto): Promise<any> {
    const pass = createHash('sha256').update(password).digest('hex');
    const user = await this.userService.findOne({username, password: pass});
    if (user && user.password === pass) {
      const {password, ...result} = JSON.parse(JSON.stringify(user));
      return result;
    }
    return null;
  }

  async login(user: any): Promise<{ token: string }> {
    const payload = {username: user.username, sub: user._id};
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(user: UserDto): Promise<any> {
    return this.userService.create(user);
  }

}
