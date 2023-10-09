const os = require('os');
// const path = require('path');
const multer = require('multer');
// const checkDiskSpace = require('check-disk-space').default
// const LIMIT_BYTES = 200 * 1024 * 1024; // 200MB for file, 100MB for video

module.exports.dynamicStorageMiddleware = async function (req, res, next) {
  // 判断请求类型
  if (!req.is('multipart/form-data')) {
    return next();
  }

  const freeMemoryInBytes = os.freemem();
  // const freeDiskSpace = (await checkDiskSpace('/tmp')).free; // 获取/tmp/uploads的可用磁盘空间
  let storage;
  // let isDiskStorage = false;

  // if (freeMemoryInBytes < LIMIT_BYTES && freeDiskSpace < LIMIT_BYTES) {
  //   return res.status(400).send('Server storage is insufficient for the file upload.');

  // } else if (freeMemoryInBytes < LIMIT_BYTES) {
  // if (freeMemoryInBytes < LIMIT_BYTES) {
    // isDiskStorage = true;
    // storage = multer.diskStorage({
    //   destination: function (req, file, cb) {
    //     cb(null, '/tmp'); // 指定文件保存路径
    //   },
    //   filename: function (req, file, cb) {
    //     const baseName = path.basename(file.fieldname, path.extname(file.fieldname)); // 获取不包含扩展名的文件名
    //     cb(null, baseName + '-' + Date.now() + path.extname(file.originalname)); // 生成新的文件名并附加原始扩展名
    //   }
    // });
  // } else {
    storage = multer.memoryStorage();
  // }

  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      // if (isDiskStorage && file.size > freeDiskSpace) {
      //   cb(new Error('File size exceeds available disk space.'));
      // } else if (!isDiskStorage && file.size > freeMemoryInBytes) {
      if (file.size > freeMemoryInBytes) {
        cb(new Error('File size exceeds available memory.'));
      } else {
        cb(null, true);
      }
    }
  }).any(); // 使用 .any() 来接受所有传递过来的数据

  upload(req, res, function (err) {
    if (err) {
      return res.status(400).send(err.message);
    }
    next();
  });
}