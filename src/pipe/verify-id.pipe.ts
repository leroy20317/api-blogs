import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {mongoose} from '@typegoose/typegoose'

@Injectable()
export default class VerifyIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {
    const isObjectId = mongoose.Types.ObjectId.isValid(value)
    if (!isObjectId) {
      throw new BadRequestException(`参数id有误！`)
    }
    return value;
  }
}
