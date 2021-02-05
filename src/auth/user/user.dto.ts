import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UserDto {

  @ApiProperty({description: 'username'})
  @IsNotEmpty({message: 'username不能为空！'})
  username: string

  @ApiProperty({description: 'password'})
  @IsNotEmpty({message: 'password不能为空！'})
  password: string

}

export class RegisterDto {

  @ApiProperty({description: 'username'})
  @IsNotEmpty({message: 'username不能为空！'})
  username: string

  @ApiProperty({description: 'password'})
  @IsNotEmpty({message: 'password不能为空！'})
  password: string

  @ApiProperty({description: 'passwords'})
  @IsNotEmpty({message: 'passwords不能为空！'})
  passwords: string
}