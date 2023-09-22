import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListHealthRecordsDto } from './dto/list-health-records.dto';
import { HealthRecordEntity } from './health-record.entity';
import { Repository } from 'typeorm';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';

@Injectable()
export class HealthRecordsService {
  constructor(
    @InjectRepository(HealthRecordEntity)
    private readonly healthRecordsRepository: Repository<HealthRecordEntity>,
  ) {}

  async create(
    createHealthRecordDto: CreateHealthRecordDto,
  ): Promise<HealthRecordEntity> {
    const entity = await this.healthRecordsRepository.create(
      createHealthRecordDto,
    );

    return this.healthRecordsRepository.save(entity);
  }

  async listHealthRecords(listHealthRecordsDto: ListHealthRecordsDto): Promise<{
    healthRecords: HealthRecordEntity[];
    total: number;
    next: string | null;
    previous: string | null;
  }> {
    const query =
      this.healthRecordsRepository.createQueryBuilder('health_record');

    if (!listHealthRecordsDto.next && !listHealthRecordsDto.previous) {
      query.orderBy('health_record.created_at', 'DESC');
    }

    if (listHealthRecordsDto.next) {
      query
        .where(`health_record.id < :id`, {
          id: this.decode(listHealthRecordsDto.next),
        })
        .orderBy('health_record.created_at', 'DESC');
    }

    if (listHealthRecordsDto.previous) {
      query
        .where(`health_record.id > :id`, {
          id: this.decode(listHealthRecordsDto.previous),
        })
        .orderBy('health_record.created_at', 'ASC');
    }

    const healthRecords = await query
      .limit(Number(listHealthRecordsDto.limit) ?? 10)
      .getMany();

    const total = await this.healthRecordsRepository.count({ where: {} });

    const firstElement = healthRecords.at(0);
    const lastElement = healthRecords.at(-1);

    const usingCursor = Boolean(
      listHealthRecordsDto.previous || listHealthRecordsDto.next,
    );

    return {
      healthRecords: listHealthRecordsDto.previous
        ? healthRecords.reverse()
        : healthRecords,
      next: this.encode(lastElement?.id),
      previous: usingCursor ? this.encode(firstElement?.id) : null,
      total,
    };
  }

  private encode(value?: string | number | boolean): string | null {
    if (value) {
      return Buffer.from(String(value), 'utf-8').toString('base64');
    }

    return null;
  }

  private decode(value: string): string {
    return Buffer.from(value, 'base64').toString('utf-8');
  }
}
