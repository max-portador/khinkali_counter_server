import {Module} from '@nestjs/common';
import {EventModule} from "./event/event.module";
import {MongooseModule} from "@nestjs/mongoose";
import {ServeStaticModule} from "@nestjs/serve-static";
import { resolve } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AtGuard } from "./common/guards";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({ rootPath: resolve(__dirname, 'static'), }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    EventModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers:[
    {
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ]


})
export class AppModule {}
