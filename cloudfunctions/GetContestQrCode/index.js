const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.get({
      path: 'pages/'+event.type +'/ContestLevel2/ContestLevel2?ContestId='+event.ContestId,
      width: 430
    })
    return await cloud.uploadFile({
      cloudPath: event.ContestId + '/qrcode.jpg',
      fileContent: result.buffer,
    })
  } catch (err) {
    console.log(err)
    return err
  }
}