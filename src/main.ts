import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5555;

async function start() {
  try {
    const app = await NestFactory.create(AppModule,
      {
        cors: {
          credentials: true,
          origin:true,
          allowedHeaders: 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
          methods: 'PUT,POST,GET,DELETE,OPTIONS',
        }
      });
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    await app.listen(PORT, () =>
      console.log(`Server started on port: ${PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
}

start();
