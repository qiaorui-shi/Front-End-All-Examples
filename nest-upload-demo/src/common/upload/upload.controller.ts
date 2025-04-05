import { Body, Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { UploadService } from "./upload.service";
// 单文件上传拦截器
import { FileInterceptor, FileFieldsInterceptor, AnyFilesInterceptor } from "@nestjs/platform-express";

@Controller("upload")
export class UploadController {
  constructor(private readonly UploadService: UploadService) {}
  // 单文件
  // storage有两种存储方式：diskStorage：存储到磁盘中，memoryStorage：存储到内存中
  @Post("upload1")
  @UseInterceptors(
    FileInterceptor("file1", {
      dest: "./upload",
      limits: { fileSize: 100 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        console.log("🚀 ~ AppController ~ file:", file);
        // 用来进行文件校验
        return callback(new Error("wenjian"), false);
      }
    })
  )
  uploadFile1(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log("🚀 ~ AppController ~ uploadFile ~ body:", body);
    console.log("🚀 ~ AppController ~ uploadFile ~ file:", file);
  }

  // 多个文件
  @Post("upload2")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "file1" }, { name: "file2" }], {
      dest: "./upload"
    })
  )
  uploadFile2(
    @UploadedFiles()
    file: Express.Multer.File[],
    @Body() body
  ) {
    console.log("🚀 ~ AppController ~ uploadFile ~ body:", body);
    console.log("🚀 ~ AppController ~ uploadFile ~ file:", file);
  }

  // 文件字段名未知
  @Post("upload3")
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: "./upload"
    })
  )
  uploadFile3(
    @UploadedFiles()
    file: Express.Multer.File[],
    @Body() body
  ) {
    console.log("🚀 ~ AppController ~ uploadFile ~ body:", body);
    console.log("🚀 ~ AppController ~ uploadFile ~ file:", file);
  }
}
