import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {KhinkaliEvent, KhinkaliEventDocument} from "./schemas/event.schema";
import {CreateEventDto} from "./dto/create-event.dto";
import {FileService} from "../files/file.service";
import {Model, Types} from "mongoose";


@Injectable()
export class EventService{

    constructor(@InjectModel(KhinkaliEvent.name) private khinkaliEventModel:  Model<KhinkaliEventDocument>,
                private readonly fileService: FileService) {}

    async create(dto: CreateEventDto, buffer: Buffer, imageName: string): Promise<EventWithoutBuffer>{
        const event = await this.khinkaliEventModel.create({
            ...dto, buffer, imageName
        })

        return {
            date: event.date,
            amount: event.amount,
            imageName: event.imageName,
        }
    }

    async getAll():Promise<EventWithId[]>{
        const events = await this.khinkaliEventModel.find().sort('date')
        this.fileService.createIfNotExists(events)
        return events.map( event => ({
            _id: event._id,
            date: event.date,
            amount: event.amount,
            imageName: event.imageName,
        }))
    }

    async update(dto: CreateEventDto, _id: Types.ObjectId, image: Express.Multer.File, imageName: string){

        const event = await this.khinkaliEventModel.findById(_id)
        if (event) {
            if (image) {
                this.fileService.deleteFile(event.imageName)
                event.imageName = imageName
                this.fileService.createFile(imageName, image.buffer)
            }

            event.date = dto.date
            event.amount = dto.amount

            await event.save()
            return event
        }
        throw new HttpException("Не удалось найти в базе данных", HttpStatus.NO_CONTENT);
    }

    async delete(id: Types.ObjectId): Promise<Types.ObjectId> {
        const event = await this.khinkaliEventModel.findByIdAndDelete(id)
        if (event){
            this.fileService.deleteFile(event.imageName)
        }
        return event?._id
    }
}

export type EventWithoutBuffer = {
    date: Date,
    amount: number,
    imageName: string
}

export type EventWithId = EventWithoutBuffer & {_id: Types.ObjectId}