
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Contest_Info').add({
      data: {
        ContestId: event.ContestId,
        FileId: event.FileId
      },
      success: function (res) {
        console.log("good");
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}