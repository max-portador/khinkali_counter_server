import {Module} from '@nestjs/common';
import {EventModule} from "./event/event.module";
import {MongooseModule} from "@nestjs/mongoose";
import {ServeStaticModule} from "@nestjs/serve-static";
import { resolve } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: resolve(__dirname, 'static'), }),
    MongooseModule.forRoot('mongodb+srv://hotdog:hotgirl@cluster0.rn7ft.mongodb.net/?retryWrites=true&w=majority'),
    EventModule,
    UserModule,
    AuthModule,
  ],

})
export class AppModule {}
