const cloud = require('wx-server-sdk')
cloud.init({
  env:"wxice-saksi"
})
var xlsx = require('node-xlsx');
const db = cloud.database()

exports.main = async(event, context) => {
  //1,通过fileID下载云存储里的excel文件
  const res = await cloud.downloadFile({
    fileID: event.fileId,
  })
  const buffer = res.fileContent
  const tasks = [] //用来存储所有的添加数据操作
  //2,解析excel文件里的数据
  var sheets = xlsx.parse(buffer); //获取到所有sheets
  return sheets
}
