import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class Upload2Service {
  async mergeChunks(uploadId: string, outputPath: string) {
    const chunkDir = path.join('./uploads/chunks');
    const chunks = fs.readdirSync(chunkDir)
      .filter(f => f.startsWith(uploadId))
      .sort((a, b) => {
        const aIndex = parseInt(a.split('-')[1]);
        const bIndex = parseInt(b.split('-')[1]);
        return aIndex - bIndex;
      });

    const writeStream = fs.createWriteStream(outputPath);

    for (const chunk of chunks) {
      const chunkPath = path.join(chunkDir, chunk);
      const data = fs.readFileSync(chunkPath);
      writeStream.write(data);
      fs.unlinkSync(chunkPath); // 删除已合并的分片
    }

    writeStream.end();
  }
}