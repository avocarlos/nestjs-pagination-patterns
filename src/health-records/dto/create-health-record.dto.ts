import {
  ExternalHealthRecordOrigin,
  ExternalHealthRecordProvider,
  ExternalHealthRecordResourceType,
} from '../health-record.entity';
import { z } from 'zod';

export const buildCreateHealthRecordsDto = z.object({
  origin: z.nativeEnum(ExternalHealthRecordOrigin).optional(),
  resourceType: z.nativeEnum(ExternalHealthRecordResourceType),
  source: z.nativeEnum(ExternalHealthRecordProvider),
  resourceId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type CreateHealthRecordDto = z.infer<typeof buildCreateHealthRecordsDto>;