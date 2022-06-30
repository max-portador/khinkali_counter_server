import {Injectable} from "@nestjs/common";
import {KhinkaliEvent} from "../event/schemas/event.schema";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class FileService{
    filepath = path.resolve(__dirname, '..', 'static')

    createIfNotExists(events: KhinkaliEvent[]): void{

        if (!fs.existsSync(this.filepath)) {
            fs.mkdirSync(this.filepath, { recursive: true})
        }

        events.forEach( e => {
            this.createFile(e.imageName, e.buffer)
        })
    }

    createFile(fileName: string, buffer: Buffer){
        const fullFileName = path.resolve(this.filepath, fileName)
        if (!fs.existsSync(fullFileName)) {
            fs.writeFileSync(fullFileName, buffer)
        }
    }

    deleteFile(fileName: string){
        try{
            const fullFileName = path.resolve(this.filepath, fileName)
            if (fs.existsSync(fullFileName)) {
                fs.unlinkSync(fullFileName)
            }
        }
        catch (e) {
            console.log(e, 'Error on file removing from filesystem')
        }
    }
}