var express = require("express");
var router = express.Router();
// multer是一个专门处理文件的中间件 适用于multipart/form-data格式的请求,一般用于post和put
const multer = require("multer");

const upload = multer({
  dest: "./upload"
});

// 单文件
router.post("/upload1", upload.single("file"), (req, res, next) => {
  res.send();
});

// 多文件
router.post("/upload2", upload.fields([{ name: "file1" }, { name: "file2" }]), (req, res, next) => {
  res.send();
});

// 未知字段名文件 不常用
router.post("/upload3", upload.any(), (req, res, next) => {
  res.send();
});

// 捕获错误
router.use((err, res, req, next) => {
  console.log(err);
});

module.exports = router;
