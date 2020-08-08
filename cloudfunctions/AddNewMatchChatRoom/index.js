
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Match_ChatRoom').add({
      data: {
        MatchId: event.MatchId,
        ChatInfo:[],         //发送消息
        Sender:[],            //发送人Name
        SendTime:[],        //发送时间
        SenderUrl:[],  //发送人头像
        Status:[]
      },
      success: function (res) {
        console.log("success");
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}