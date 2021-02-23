import {SetMetadata} from '@nestjs/common';

/**
 *
 * @param arg
 * 'never' 不做任何认证 | true 生成token 用于登录 | default 需要认证
 * @constructor
 */
export const NoAuth = (arg?: boolean | 'never'): any => SetMetadata('no-auth', arg);
