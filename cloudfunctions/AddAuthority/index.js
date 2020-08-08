const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Identification').add({
      data: {
        ContestId: event.ContestId,
        IdentifyCode: event.IdentifyCode,
        AuthorityType: event.AuthorityType
      }
    });
  } catch (e) {
    console.error(e);
  }
}