import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {EventService} from "./event.service";
import {FilesInterceptor} from "@nestjs/platform-express";
import {Express} from "express";
import {CreateEventDto} from "./dto/create-event.dto";
import {Types} from "mongoose";
import {v4} from 'uuid'
import {AtGuard} from "../common/guards/at.guard";
import { Public } from "../common/decorators";


@Controller("/events")
export class EventController{
    constructor(private eventService: EventService) {
    }

    @Post()
    @UseInterceptors(FilesInterceptor('image'))
    uploadFile(@UploadedFiles() files: Express.Multer.File[],
               @Body() dto: CreateEventDto){
        const image = files[0]
        const extention = image.originalname.split(".").pop()
        const imageName = v4() + '.' + extention

        return this.eventService.create(dto, image.buffer, imageName)
    }

    @Public()
    @Get()
    getAll(){
        return this.eventService.getAll()
    }

    @Put()
    @UseInterceptors(FilesInterceptor('image'))
    update(@UploadedFiles() files: Express.Multer.File[],
           @Body() dto: CreateEventDto, @Body() _id: Types.ObjectId){
        const image = files.length ? files[0] : null
        let imageName;
        if (image) {
            const extention = image.originalname.split(".").pop()
            imageName = v4() + '.' + extention
        }

        return this.eventService.update(dto, _id, image, imageName)
    }

    @Delete(':id')
    delete(@Param('id') id: Types.ObjectId) {
        return this.eventService.delete(id)
    }

}