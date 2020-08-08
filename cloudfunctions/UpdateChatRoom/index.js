const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Match_ChatRoom').doc(event.RecordId).update({
      data: {
        ChatInfo: event.ChatInfo,         //发送消息
        Sender: event.Sender,            //发送人Name
        SendTime: event.SendTime,        //发送时间
        SenderUrl: event.SenderUrl,  //发送人头像
        Status:event.Status
      },
      success: function (res) {
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}