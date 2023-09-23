import {
  IsDate,
  IsEnum,
  IsOptional,
  IsNumberString,
  IsBase64,
  isBase64,
} from 'class-validator';
import {
  ExternalHealthRecordProvider,
  ExternalHealthRecordResourceType,
} from '../health-record.entity';
import { z } from 'zod';

export const createListHealthRecordsDto = z.object({
  source: z.nativeEnum(ExternalHealthRecordProvider),
  resourceType: z.nativeEnum(ExternalHealthRecordResourceType).optional(),
  limit: z.number().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  next: z
    .string()
    .refine(isBase64)
    .transform((value) =>
      Buffer.from(value, 'base64').toString('utf-8').split('|'),
    )
    .optional(),
  previous: z
    .string()
    .refine(isBase64)
    .transform((value) =>
      Buffer.from(value, 'base64').toString('utf-8').split('|'),
    )
    .optional(),
});

// export class ListHealthRecordsDto {
//   @IsEnum(ExternalHealthRecordProvider)
//   source: ExternalHealthRecordProvider;

//   @IsOptional()
//   @IsEnum(ExternalHealthRecordResourceType)
//   resourceType?: ExternalHealthRecordResourceType;

//   @IsOptional()
//   @IsNumberString()
//   limit?: number;

//   @IsDate()
//   @IsOptional()
//   startDate?: Date;

//   @IsDate()
//   @IsOptional()
//   endDate?: Date;

//   @IsBase64()
//   @IsOptional()
//   next?: string;

//   @IsBase64()
//   @IsOptional()
//   previous?: string;
// }

export type ListHealthRecordsDto = z.infer<typeof createListHealthRecordsDto>;
