import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ExternalHealthRecordResourceType {
  // Health Gorilla
  ENCOUNTER = 'Encounter',
  CARE_PLAN = 'CarePlan',
  PROCEDURE = 'Procedure',
  CONDITION = 'Condition',
  MEDICATION_STATEMENT = 'MedicationStatement',

  // Bcbs Tn
  STATE_TN = 'StateTn',
  FRONT_DOOR = 'FrontDoor',
  CITY_OF_MEMPHIS_TN = 'CityOfMemphisTn',
  GRANGES = 'Granges',
  DIOCESE_OF_NASHVILLE = 'DioceseOfNashville',
  NEMAK = 'Nemak',
  CARLEX_GLASS_AMERICA = 'CarlexGlassAmerica',
  SUMMIT_MEDICAL_GROUP = 'SummitMedicalGroup',
  BCBS_TN_EMPLOYER = 'BcbsTnEmployerAccount',

  STATE_TN_CLIENT_ID = '595',
  FRONT_DOOR_CLIENT_ID = '716',
  CITY_OF_MEMPHIS_TN_CLIENT_ID = '800',
  GRANGES_CLIENT_ID = '911',
  DIOCESE_OF_NASHVILLE_CLIENT_ID = '897',
  NEMAK_CLIENT_ID = '904',
  CARLEX_GLASS_AMERICA_CLIENT_ID = '967',
  SUMMIT_MEDICAL_GROUP_CLIENT_ID = '861',
  BCBS_TN_EMPLOYER_CLIENT_ID = '889',

  // Bcbs AL
  LOWES = 'Lowes',

  // Application Questionnaire
  CHRONIC = 'Chronic',

  // Member Predictions
  MESSAGE_PREDICTION = 'MessagePrediction',

  // User Demographics
  USER = 'User',
}

export enum ExternalHealthRecordOrigin {
  SUPPLEMENTAL = 'SUPPLEMENTAL',
}

export enum ExternalHealthRecordProvider {
  HEALTH_GORILLA = 'Health Gorilla',
  BCBS_TN = 'BCBS TN',
  AQ = 'AQ',
  MEMBER_PREDICTIONS = 'MEMBER_PREDICTIONS',
  USER_DEMOGRAPHIC = 'USER_DEMOGRAPHIC',
  BCBS_AL = 'BCBS_AL',
}

@Entity({ name: 'health_records' })
export class HealthRecordEntity {
  @PrimaryGeneratedColumn('increment')
  readonly id: string;

  @Column({ name: 'source', type: 'text' })
  readonly source: ExternalHealthRecordProvider;

  @Column({ name: 'resource_type', type: 'text' })
  readonly resourceType: ExternalHealthRecordResourceType;

  /**
   * resource_id refers to a record in another table
   * this is non-relational due to domain-specific nature of this and other inter-operating microservices
   * currently represents record in: health_gorilla_record_log,
   */
  @Column({ name: 'resource_id', type: 'uuid' })
  readonly resourceId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  readonly userId: string;

  @Column({ name: 'origin', type: 'text', nullable: true })
  readonly origin?: ExternalHealthRecordOrigin;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  readonly createdAt: Date;
}
