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
    const query =
      this.healthRecordsRepository.createQueryBuilder('health_record');

    query.where('source = :source', { source: listHealthRecordsDto.source });

    if (!listHealthRecordsDto.next && !listHealthRecordsDto.previous) {
      query.orderBy('health_record.created_at', 'DESC');
    }

    if (listHealthRecordsDto.next) {
      const [id, first] = listHealthRecordsDto.next;

      query
        .andWhere(`health_record.id ${Boolean(first) ? '<=' : '<'} :id`, {
          id,
        })
        .orderBy('health_record.created_at', 'DESC');
    }

    if (listHealthRecordsDto.previous) {
      const [id, last] = listHealthRecordsDto.previous;

      query
        .andWhere(`health_record.id ${Boolean(last) ? '>=' : '>'} :id`, {
          id,
        })
        .orderBy('health_record.created_at', 'ASC');
    }

    const results = await query
      .limit(Number(listHealthRecordsDto.limit) ?? 10)
      .getMany();

    const total = await this.healthRecordsRepository.countBy({
      source: listHealthRecordsDto.source,
    });

    const healthRecords = listHealthRecordsDto.previous
      ? results.reverse()
      : results;

    const firstElement = healthRecords.at(0);
    const lastElement = healthRecords.at(-1);

    if (!healthRecords.length) {
      return {
        healthRecords,
        next: listHealthRecordsDto.previous
          ? this.encodeCursor(listHealthRecordsDto.previous.at(0), true)
          : null,
        previous: listHealthRecordsDto.next
          ? this.encodeCursor(listHealthRecordsDto.next.at(0), true)
          : null,
        total,
      };
    }

    const cursor = listHealthRecordsDto.next || listHealthRecordsDto.previous;

    return {
      healthRecords,
      next: this.encodeCursor(lastElement?.id) ?? null,
      previous: !!cursor ? this.encodeCursor(firstElement?.id) : null,
      total,
    };
  }

  private encodeCursor(...args: unknown[]): string {
    return Buffer.from(args.join('|'), 'utf-8').toString('base64');
  }

  private decodeCursor(value: string = ''): string[] {
    return Buffer.from(value, 'base64').toString('utf-8').split('|');
  }
}
