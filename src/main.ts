import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  app.useGlobalPipes(new ValidationPipe())

  const option = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Crystud E-Test')
    .setDescription('Virtual testing environment')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, option)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}

bootstrap()
