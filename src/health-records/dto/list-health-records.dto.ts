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

export const buildListHealthRecordsDto = z.object({
  source: z.nativeEnum(ExternalHealthRecordProvider),
  resourceType: z.nativeEnum(ExternalHealthRecordResourceType).optional(),
  limit: z.coerce.number().optional().default(10),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  next: z
    .string()
    .refine(isBase64)
    .transform((value) =>
      Buffer.from(value, 'base64').toString('utf-8'),
    )
    .optional(),
  previous: z
    .string()
    .refine(isBase64)
    .transform((value) =>
      Buffer.from(value, 'base64').toString('utf-8'),
    )
    .optional(),
});

export type ListHealthRecordsDto = z.infer<typeof buildListHealthRecordsDto>;
