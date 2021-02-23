import {Module} from '@nestjs/common';
import BackupController from './controller';
import BackupService from './service'

@Module({
  controllers: [BackupController],
  providers: [BackupService]
})
export default class BackupModule {
}
