import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    // 1. ConfigModule 설정(.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/${process.env.NODE_ENV || 'development'}.env`
    }),

    // 2. 비동기 TypeORM 설정
    TypeOrmModule.forRootAsync({
      inject: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: config.get<string>('DB_TYPE') as 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),

        // 엔티티를 배열에 일일이 넣지 않아도 forFeature로 등록된 엔티티를 자동 로드
        autoLoadEntities: true,

        // Entity 클래스와 DB 스키마를 자동 일치시킴 (개발환경에서만 사용할것!)
        synchronize: config.get('NODE_ENV') === 'develpoment',
      }),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
