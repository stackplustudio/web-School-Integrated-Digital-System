import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 Tambahkan blok konfigurasi CORS ini
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'https://web-school-integrated-digital-syste.vercel.app',
      'https://sids.stackplustudio.com' // Masukkan custom domain Anda juga
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Pastikan port menggunakan environment variable dari Railway
  await app.listen(process.env.PORT || 3001);
}
bootstrap();