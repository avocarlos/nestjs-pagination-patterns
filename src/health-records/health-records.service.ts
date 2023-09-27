import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListHealthRecordsDto } from './dto/list-health-records.dto';
import { HealthRecordEntity } from './health-record.entity';
import { Repository } from 'typeorm';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';

type ListHealthRecords = {
  healthRecords: HealthRecordEntity[];
  total: number;
  next: string | null;
  previous: string | null;
};

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

  async listHealthRecords(
    listHealthRecordsDto: ListHealthRecordsDto,
  ): Promise<ListHealthRecords> {
    const { previous, next, limit } = listHealthRecordsDto;

    const [results, total] =
      await this.getHealthRecordsAndCount(listHealthRecordsDto);
    console.log()
    return {
      healthRecords: results,
      next: this.encodeCursor(results.length ? results.at(-1)?.id : previous),
      previous: next || previous ? this.encodeCursor(
        results.length ? results.at(0)?.id : next,
      ): null,
      total,
    };
  }

  private async getHealthRecordsAndCount(
    listHealthRecordsDto: ListHealthRecordsDto,
  ): Promise<[HealthRecordEntity[], number]> {
    const { previous, next } = listHealthRecordsDto;
    const query =
      this.healthRecordsRepository.createQueryBuilder('health_record');

    query
      .where('source = :source', { source: listHealthRecordsDto.source })
      .orderBy('health_record.created_at', 'DESC')
      .limit(listHealthRecordsDto.limit);

    const total = await query.getCount();

    if (next) {
      query.andWhere('health_record.id < :id', {
        id: Number(next),
      });
    }

    if (previous) {
      query
        .andWhere('health_record.id > :id', {
          id: Number(previous),
        })
        .orderBy('health_record.created_at', 'ASC');
    }

    const results = await query.getMany();

    return [previous ? results.reverse() : results, total];
  }

  private encodeCursor(value?: string): string | null {
    if (!value) {
      return null;
    }
    return Buffer.from(String(value), 'utf-8').toString('base64');
  }
}
