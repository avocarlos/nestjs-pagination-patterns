import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthRecordsModule } from './health-records/health-records.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        schema: 'hrs',
        synchronize: true,
        autoLoadEntities: true,
        logging: 'all',
      }),
    }),
    HealthRecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
