import dictNotoneOrigin from "./dict/pinyin_dict_notone";
import dictFirstletter from "./dict/pinyin_dict_firstletter";

// 处理拼音字典
const dictNotone: Record<string, string> = {};
for(var i in dictNotoneOrigin) {
    var temp = dictNotoneOrigin[i];
    for(var j=0, len=temp.length; j<len; j++) {
        if(!dictNotone[temp[j]]) dictNotone[temp[j]] = i;
    }
}

export default {
    /**
     * 根据汉字获取拼音，如果不是汉字直接返回原字符
     * @param chinese 要转换的汉字
     * @param splitter 分隔字符，默认用空格分隔
     */
    getPinyin: function (chinese: string, splitter: string = " ") {
        if (!chinese || /^ +$/g.test(chinese)) return "";
        var result: string[] = [];

        var noChinese = "";
        for (var i = 0, len = chinese.length; i < len; i++) {
            var temp = chinese.charAt(i),
                pinyin = dictNotone[temp];
            if (pinyin) { //插入拼音
                //空格，把noChinese作为一个词插入
                noChinese && (result.push(noChinese), noChinese = "");
                result.push(pinyin);
            }
            else if (!temp || /^ +$/g.test(temp)) {
                //空格，插入之前的非中文字符
                noChinese && (result.push(noChinese), noChinese = "");
            }
            else {
                //非空格，关联到noChinese中
                noChinese += temp;
            }
        }

        if (noChinese) {
            result.push(noChinese);
            noChinese = "";
        }
        return result.join(splitter);
    },
    /**
     * 获取汉字的拼音首字母
     * @param str 汉字字符串，如果遇到非汉字则原样返回
     */
    getFirstLetter: function (str: string) {
        if (!str || /^ +$/g.test(str)) return "";

        var result: string[] = [];
        for (var i = 0; i < str.length; i++) {
            var unicode = str.charCodeAt(i);
            var ch = str.charAt(i);
            if (unicode >= 19968 && unicode <= 40869) {
                ch = dictFirstletter.charAt(unicode - 19968);
            }
            result.push(ch);
        }
        return result.join(""); // 如果不用管多音字，直接将数组拼接成字符串
    }
};