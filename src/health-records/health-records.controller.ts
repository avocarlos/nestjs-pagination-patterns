import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { HealthRecordsService } from './health-records.service';
import { ListHealthRecordsDto } from './dto/list-health-records.dto';
import { HealthRecordEntity } from './health-record.entity';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';

@Controller('health-records')
export class HealthRecordsController {
  constructor(private healthRecordsService: HealthRecordsService) {}

  @Get()
  async listHealthRecords(@Query() dto: ListHealthRecordsDto): Promise<{
    healthRecords: HealthRecordEntity[];
    total: number;
    next: string | null;
    previous: string | null;
  }> {
    if (dto.next && dto.previous) {
      throw new BadRequestException();
    }

    return this.healthRecordsService.listHealthRecords(dto);
  }

  @Post()
  async createHealthRecord(
    @Body() createHealthRecordDto: CreateHealthRecordDto,
  ): Promise<HealthRecordEntity> {
    return this.healthRecordsService.create(createHealthRecordDto);
  }
}
