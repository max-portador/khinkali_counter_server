import {Module} from "@nestjs/common";
import {EventController} from "./event.controller";
import {EventService} from "./event.service";
import {MongooseModule} from "@nestjs/mongoose";
import {KhinkaliEvent, KhinkaliEventSchema} from "./schemas/event.schema";
import {FileService} from "../files/file.service";

@Module({
    imports: [
        MongooseModule.forFeature([{name: KhinkaliEvent.name, schema: KhinkaliEventSchema}])
    ],
    controllers: [EventController],
    providers: [EventService, FileService],
    })
export class EventModule {
    
}