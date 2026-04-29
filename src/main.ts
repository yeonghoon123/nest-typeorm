import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Swagger 문서 설정 (빌더 패턴)
  const config = new DocumentBuilder()
    .setTitle('My API Document')           // 문서 제목
    .setDescription('내 프로젝트 API 명세서입니다.') // 문서 설명
    .setVersion('1.0')                     // API 버전
    .addBearerAuth()                       // (선택) JWT 토큰 인증 기능 추가
    .build();

  // 2. Swagger 문서 객체 생성
  const document = SwaggerModule.createDocument(app, config);

  // 3. Swagger UI 화면 세팅 (경로, 앱 객체, 문서 객체)
  // 첫 번째 인자 'api-docs'는 접속할 URL 경로를 의미합니다. (ex: localhost:3000/api-docs)
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
