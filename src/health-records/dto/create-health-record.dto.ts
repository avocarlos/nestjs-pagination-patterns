import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import {
  ExternalHealthRecordOrigin,
  ExternalHealthRecordProvider,
  ExternalHealthRecordResourceType,
} from '../health-record.entity';

export class CreateHealthRecordDto {
  @IsUUID()
  resourceId: string;

  @IsUUID()
  userId: string;

  @IsEnum(ExternalHealthRecordProvider)
  source: ExternalHealthRecordProvider;

  @IsEnum(ExternalHealthRecordResourceType)
  resourceType: ExternalHealthRecordResourceType;

  @IsEnum(ExternalHealthRecordOrigin)
  @IsOptional()
  origin?: ExternalHealthRecordOrigin;
}
