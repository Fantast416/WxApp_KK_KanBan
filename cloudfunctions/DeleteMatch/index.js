const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('Match_Info').where({
      MatchId:event.MatchId
    }).remove()
  } catch (e) {
    console.error(e)
  }
}