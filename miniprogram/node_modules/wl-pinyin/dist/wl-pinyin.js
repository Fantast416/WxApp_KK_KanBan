"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pinyin_dict_notone_1 = __importDefault(require("./dict/pinyin_dict_notone"));
var pinyin_dict_firstletter_1 = __importDefault(require("./dict/pinyin_dict_firstletter"));
// 处理拼音字典
var dictNotone = {};
for (var i in pinyin_dict_notone_1.default) {
    var temp = pinyin_dict_notone_1.default[i];
    for (var j = 0, len = temp.length; j < len; j++) {
        if (!dictNotone[temp[j]])
            dictNotone[temp[j]] = i;
    }
}
exports.default = {
    /**
     * 根据汉字获取拼音，如果不是汉字直接返回原字符
     * @param chinese 要转换的汉字
     * @param splitter 分隔字符，默认用空格分隔
     */
    getPinyin: function (chinese, splitter) {
        if (splitter === void 0) { splitter = " "; }
        if (!chinese || /^ +$/g.test(chinese))
            return "";
        var result = [];
        var noChinese = "";
        for (var i = 0, len = chinese.length; i < len; i++) {
            var temp = chinese.charAt(i), pinyin = dictNotone[temp];
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
    getFirstLetter: function (str) {
        if (!str || /^ +$/g.test(str))
            return "";
        var result = [];
        for (var i = 0; i < str.length; i++) {
            var unicode = str.charCodeAt(i);
            var ch = str.charAt(i);
            if (unicode >= 19968 && unicode <= 40869) {
                ch = pinyin_dict_firstletter_1.default.charAt(unicode - 19968);
            }
            result.push(ch);
        }
        return result.join(""); // 如果不用管多音字，直接将数组拼接成字符串
    }
};
