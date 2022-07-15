import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

const PORT = process.env.PORT || 5555;

async function start() {
  try{
    const app = await NestFactory.create(AppModule, {cors: true});
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

  }
  catch (e) {
    console.log(e)
  }

}
start();
