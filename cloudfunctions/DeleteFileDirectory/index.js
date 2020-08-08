const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  const FileId = event.FileId
  const result = await cloud.deleteFile({
    fileList: FileId,
  })
  return result.fileList
}
