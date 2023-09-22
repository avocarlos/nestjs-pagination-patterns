import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthRecordsController } from './health-records.controller';
import { HealthRecordEntity } from './health-record.entity';
import { HealthRecordsService } from './health-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([HealthRecordEntity])],
  providers: [HealthRecordsService],
  controllers: [HealthRecordsController],
})
export class HealthRecordsModule {}
