const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('User_Contest').where({
      UserId:event.UserId,
      ContestId:event.ContestId,
      AuthorityType:"Love"
    }).remove()
  } catch (e) {
    console.error(e)
  }
}