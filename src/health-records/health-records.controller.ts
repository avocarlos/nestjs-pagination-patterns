import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { HealthRecordsService } from './health-records.service';
import {
  ListHealthRecordsDto,
  createListHealthRecordsDto,
} from './dto/list-health-records.dto';
import { HealthRecordEntity } from './health-record.entity';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('health-records')
export class HealthRecordsController {
  constructor(private healthRecordsService: HealthRecordsService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(createListHealthRecordsDto))
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

  private encodeCursor(...args: unknown[]): string {
    return Buffer.from(args.join('|'), 'utf-8').toString('base64');
  }

  private decodeCursor(value: string = ''): string[] {
    return Buffer.from(value, 'base64').toString('utf-8').split('|');
  }
}
