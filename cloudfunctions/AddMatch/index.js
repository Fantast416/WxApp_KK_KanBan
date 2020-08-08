
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Match_Info').add({
      data: {
        //--------------共用信息
        ContestId: event.ContestId,
        MatchId:event.MatchId,
        MatchName:event.MatchName,
        MatchPlace:event.MatchPlace,
        RefereeId:[],
        RefereeName:[],
        Time:[], //设置为-1则将0置入数组，设置为0则将当时时间置入数组，设置为1则将1置入数组，设置为2则记录当前时间。
        Status:-1,  //-1为即将进行，0为正在进行，1为已经结束,2为暂停
        //大小球专属信息
        TeamAName:event.TeamAName,
        TeamBName:event.TeamBName,
        TeamAScore:0,  //默认小球比赛中，此为大分
        TeamBScore:0,
        TeamASmallScore:[],  //默认小球比赛中此为小分，在大球比赛中无用
        TeamBSmallScore:[],
        TeamACurrentSmallScore:0, //默认小球比赛中此为当前小分，在大球比赛中无用
        TeamBCurrentSmallScore:0, 
        TeamASupport:0,
        TeamBSupport:0,
        TeamAMemberId:[],
        TeamBMemberId:[],
        //单人积分赛专属信息  暂时仅提供信息发布的功能,而非裁判打分
        MemberSupport:[], //支持数
        MemberId:[],  //成员名
        MemberScore:[], //分数
        CurrentMemberId:""
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