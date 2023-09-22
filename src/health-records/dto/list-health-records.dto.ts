import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsNumberString,
} from 'class-validator';
import {
  ExternalHealthRecordProvider,
  ExternalHealthRecordResourceType,
} from '../health-record.entity';

export class ListHealthRecordsDto {
  @IsEnum(ExternalHealthRecordProvider)
  source: ExternalHealthRecordProvider;

  @IsOptional()
  @IsEnum(ExternalHealthRecordResourceType)
  resourceType?: ExternalHealthRecordResourceType;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsString()
  @IsOptional()
  next?: string;

  @IsString()
  @IsOptional()
  previous?: string;
}
