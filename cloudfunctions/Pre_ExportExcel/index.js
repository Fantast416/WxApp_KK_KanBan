const cloud = require('wx-server-sdk')
const nodeExcel = require('excel-export');
const path = require('path'); 
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {

  var tableMap = {
    styleXmlFile:path.join(__dirname,"styles.xml"),
    name: Date.now()+"-export",
    cols: [],
    rows: [],
  }
  var tableHead = event.TableHead;
  //添加表头
  for(var i=0;i<tableHead.length;i++){
    tableMap.cols[tableMap.cols.length]={
      caption:tableHead[i],
      type:'string'
    }
  }
  //表体
  const tableList = event.TableList
  console.log("tableHead,tableList",tableHead,tableList);
  //添加每一行数据
  for(var i=0;i<tableList.length;i++){
    var temp=[];
    console.log("tableList[i]",tableList[i]);
    for(var j=0;j<tableHead.length;j++){
      console.log("tableHead[j]",tableHead[j]);
      var Head = tableHead[j]
      console.log("tableList[i].tableHead[j]",tableList[i][Head]);
      temp.push(tableList[i][Head])
    }
    tableMap.rows[tableMap.rows.length]=temp;
  }
  console.log("tableMap",tableMap);
  //保存excelResult到相应位置
  var excelResult = nodeExcel.execute(tableMap);
  var filePath = "outputExcels";
  var fileName = cloud.getWXContext().OPENID + "-" + Date.now()/1000 + '.xlsx';
  //图片上传到云存储
  return await cloud.uploadFile({
    cloudPath: path.join(filePath, fileName),
    fileContent: new Buffer(excelResult,'binary')
  }).then(res=>{
    console.log(res.fileID);
    return res;
  }).catch(err=>{

  });
}