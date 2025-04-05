import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, Body } from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { Upload2Service } from './upload2.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

const uploadFiledir = path.join('./files/');
const uploadChunkDir = path.join('./uploads/');

@Controller('upload2')
export class Upload2Controller {
    constructor(private readonly upload2Service: Upload2Service) { }

    @Post('chunk')
    @UseInterceptors(AnyFilesInterceptor({
        storage: diskStorage({
            destination: (req, file, cb) => {
                const filePath = uploadChunkDir + req.body.fileHash;
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath);
                }
                cb(null, filePath);
            },
            filename: (req, file, cb) => {
                const { chunkHash } = req.body;
                cb(null, chunkHash);
            }
        })
    }))
    async uploadChunk(@UploadedFiles() file: Express.Multer.File[], @Body() body: any) {
        const { fileHash, chunkHash } = body
        return {
            message: '切片上传成功',
            fileHash: fileHash,
            chunkIndex: chunkHash
        };
    }

    @Post('merge')
    async mergeChunks(@Body() body: { fileHash: string, filename: string }) {
        const { fileHash, filename } = body;
        const outputPath = path.join('./uploads', filename);

        await this.upload2Service.mergeChunks(fileHash, outputPath);

        return {
            message: 'File merged successfully',
            filename
        };
    }
}