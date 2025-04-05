var express = require("express");
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadPath = path.join(__dirname, `../upload2/`);
const filesPath = path.join(__dirname, `../files/`);

const MULTER_OPTIONS = {
  // dest上传文件的默认保存目录，并给保存的文件随机生成文件名
  // dest: "./upload2",
  // storage有两种存储方式：
  //    1、DiskStorage：存储在磁盘上，适合长期存储
  //    2、MemoryStorage：适合临时文件或者小文件上传，不需要持久化存储的场景
  // limits 对文件做限制（设置 limits 可以帮助保护你的站点抵御拒绝服务 (DoS) 攻击）
  // fileFilter设置一个函数用来限制文件上传
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const filePath = uploadPath + req.body.fileHash;
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      cb(null, filePath);
    },
    filename: (req, file, cb) => {
      cb(null, req.body.chunkHash);
    }
  })
};

router.post("/upload", multer(MULTER_OPTIONS).fields([{ name: "chunk" }]), (req, res, next) => {
  res.json("切片上传成功");
});

router.post("/mergeChunk", (req, res, next) => {
  const { fileHash, fileName } = req.body;
  const fileDir = uploadPath + fileHash;
  // 获取该文件目录下切片
  const chunkPaths = fs.readdirSync(fileDir);
  // 对所有切片文件进行排序
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
  // 创建一个可写流
  const writeStream = fs.createWriteStream(filesPath + fileName);
  // 遍历所有chunk进行写入
  chunkPaths.forEach((chunkPath) => {
    const chunk = fs.readFileSync(fileDir + "/" + chunkPath);
    writeStream.write(chunk);
  });
  writeStream.end(() => {
    console.log("合并完成");
    // 合并完成，删除切片目录 recursive: 递归删除； force：强制删除
    fs.rmSync(uploadPath + fileHash, { recursive: true, force: true });
  });
});

module.exports = router;
