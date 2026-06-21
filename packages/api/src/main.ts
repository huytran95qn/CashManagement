import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
		methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	});

	app.setGlobalPrefix('api/v1');

	app.useGlobalPipes(
		new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
	);

	const config = new DocumentBuilder()
		.setTitle('Cash Management API')
		.setDescription('API documentation for the Cash Management backend')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);

	const port = process.env.PORT ?? 3000;
	await app.listen(port);
	console.log(`Application running on http://localhost:${port}/api/v1`);
	console.log(`Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();
