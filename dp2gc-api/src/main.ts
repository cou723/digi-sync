import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const port = Number(process.env.PORT) || 8000; // Cloud Run の要件。環境変数PORTで起動するように。
    await app.listen(port, '0.0.0.0');
}

bootstrap();
