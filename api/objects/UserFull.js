"use strict";

const utils = require('../utils');

// 所有的 dateString 均为 2017-01-01 这种格式

class Line {
    constructor(lineData) {
        // 如果要确保能从数据库中正常读取数据，必须保证Line的结构和lineData的结构保持一致
        this.A = parseInt(lineData.A);
        this.S = parseInt(lineData.S);
        this.SS = parseInt(lineData.SS);
        this.accuracy = parseFloat(lineData.accuracy); // 99.134
        this.date = lineData.date; // "2020-09-05"
        this.level = parseFloat(lineData.level);
        this.playcount = parseInt(lineData.playcount);
        this.pp = parseInt(lineData.pp);
        this.rankcountry = parseInt(lineData.rankcountry);
        this.rankedscore = parseInt(lineData.rankedscore);
        this.rankworld = parseInt(lineData.rankworld);
        this.totalscore = parseInt(lineData.totalscore);
    }
}

class Mode {
    constructor(data) {
        // 如果要确保能从数据库中正常读取数据，必须保证Mode的结构和data的结构保持一致
        this.mode = data.mode;
        this.lines = data.lines.map((lineData) => new Line(lineData));
    }

    // 由于js计算精度问题，所有数值计算均需转换成整数再计算
    addCompareString(nowValue, oldValue, digits = 0) {
        const multiplier = Math.pow(10, digits);
        let delta = (nowValue * multiplier - oldValue * multiplier) / multiplier;
        if (delta > 0) return " \t ( +" + delta.toFixed(digits) + " )\n";
        else if (delta < 0) return " \t ( " + delta.toFixed(digits) + " )\n";
        else return "\n";
    }

    addCompareAcc(nowValue, oldValue, digits = 0) {
        const multiplier = Math.pow(10, digits);
        let delta = (nowValue * multiplier - oldValue * multiplier) / multiplier;
        if (delta > 0) return " \t ( +" + delta.toFixed(digits) + "% )\n";
        else if (delta < 0) return " \t ( " + delta.toFixed(digits) + "% )\n";
        else return "\n";
    }


    addCompareRankedScores(nowValue, oldValue) {
        let delta = nowValue - oldValue;
        if (delta > 0) return " \t ( +" + utils.format_number(delta) + " )\n";
        else if (delta < 0) return " \t ( " + utils.format_number(delta) + " )\n";
        else return "\n";
    }

    addCompareRank(nowValue, oldValue) {
        if (oldValue <= 0) return "\n"; // 原先没成绩
        let delta = nowValue - oldValue;
        if (delta > 0) return " \t ( ↓" + delta + " )\n";
        else if (delta < 0) return " \t ( ↑" + delta * -1 + " )\n";
        else return "\n";
    }

    /**
     * @param {Line} oldLine 旧stat
     * @param {Line} [thisLine] 新stat，默认为最新
     * @returns {String}
     */
    compare(oldLine, thisLine = this.lines[0]) {
        const dAccuracy = this.addCompareAcc(thisLine.accuracy, oldLine.accuracy, 2);
        const dPlaycount = this.addCompareString(thisLine.playcount, oldLine.playcount);
        const dLevel = this.addCompareString(thisLine.level, oldLine.level, 2);
        const dCountryRank = this.addCompareRank(thisLine.rankcountry, oldLine.rankcountry);
        const dRank = this.addCompareRank(thisLine.rankworld, oldLine.rankworld);
        const dPP = this.addCompareString(thisLine.pp, oldLine.pp);
        const dRankedScores = this.addCompareRankedScores(thisLine.rankedscore, oldLine.rankedscore);

        let output = "";
        output = output + "acc：" + thisLine.accuracy + "%" + dAccuracy;
        output = output + "等级：" + thisLine.level + dLevel;
        output = output + "pp：" + thisLine.pp + dPP;
        output = output + "全服排名：#" + thisLine.rankworld + dRank;
        output = output + "本地排名：" + thisLine.rankcountry + dCountryRank;
        output = output + "游玩次数：" + thisLine.playcount + dPlaycount;
        output = output + "rank总分：" + utils.format_number(thisLine.rankedscore) + dRankedScores;
        output = output + "\n";
        output = output + "对比：" + thisLine.date + " <-> " + oldLine.date;

        return output;
    }

    /**
     * @param {String} dateString 2017-01-01
     * @returns {Line}
     */
    getLineByDate(dateString) {
        let findLines = this.lines.filter(function (line) {
            return line.date === dateString;
        });
        if (findLines.length > 0) return findLines[0];
        //else return null;
        else throw "找不到 " + dateString + " 的数据";
    }

    /**
     * @param {Number} days
     * @param {String} [newDateString] 2017-01-01，默认为最新日期
     * @returns {Line} oldLine
     */
    getLineByDays(days, newDateString = this.lines[0].date) {
        let newDate = new Date(newDateString);
        let oldDate = new Date(newDate.setDate(newDate.getDate() - days));

        let year = oldDate.getFullYear().toString();
        let month = (oldDate.getMonth() + 1).toString();
        if (month.length === 1) month = "0" + month;
        let day = oldDate.getDate().toString();
        if (day.length === 1) day = "0" + day;

        let oldDateString = year + "-" + month + "-" + day;
        return this.getLineByDate(oldDateString);
    }

    /**
     * 与指定日期比较
     * @param {String} oldDateString 2017-01-01
     * @param {String} [newDateString] 2018-01-01
     * @returns {String}
     */
    compareByDate(oldDateString, newDateString) {
        const oldLine = this.getLineByDate(oldDateString);
        if (newDateString) {
            const newLine = this.getLineByDate(newDateString);
            return this.compare(oldLine, newLine);
        }
        else {
            return this.compare(oldLine);
        }
    }

    /**
     * 与指定天数前比较
     * @param {Number} days
     * @param {String} [newDateString] 2018-01-01
     * @returns {String}
     */
    compareByDays(days, newDateString) {
        const oldLine = this.getLineByDays(days, newDateString);
        if (newDateString) {
            const newLine = this.getLineByDate(newDateString);
            return this.compare(oldLine, newLine);
        }
        else {
            return this.compare(oldLine);
        }
    }

    /**
     * 获取绘制折线图所用的点
     * @param {String} xName x轴属性
     * @param {String} yName y轴属性
     */
    getChartPoints(xName, yName) {
        const keys = ["A", "S", "SS", "accuracy", "date", "playcount", "pp", "rankcountry", "rankedscore", "rankworld", "totalscore"];
        if (xName === yName) throw "x轴与y轴数据不能相同";
        if (keys.indexOf(xName) < 0) throw "不支持的X轴数据";
        if (keys.indexOf(yName) < 0) throw "不支持的y轴数据";
        return this.lines.map((line) => {
            return { x: line[xName], y: line[yName] }
        });
    }

}

class UserFull {
    constructor(data) {
        // 如果要确保能从数据库中正常读取数据，必须保证UserFull的结构和data的结构保持一致
        // 存储数据 storage = this.toJson()
        // 恢复数据 new UserFull(JSON.parse(storage))

        // this.id = parseInt(data.id);
        this.osu_id = parseInt(data.osu_id);
        this.username = data.username;
        this.country = parseInt(data.country);
        this.last_update = new Date(data.last_update);
        /*
        this.modes = [];
        this.modes[0] = new Mode(data.modes[0]);
        this.modes[1] = new Mode(data.modes[1]);
        this.modes[2] = new Mode(data.modes[2]);
        this.modes[3] = new Mode(data.modes[3]);
        */
        this.modes = {};
        if (data.modes[0]) this.modes[0] = new Mode(data.modes[0]);
        if (data.modes[1]) this.modes[1] = new Mode(data.modes[1]);
        if (data.modes[2]) this.modes[2] = new Mode(data.modes[2]);
        if (data.modes[3]) this.modes[3] = new Mode(data.modes[3]);
    }

    /**
     * 与指定日期比较
     * @param {0|1|2|3} mode 
     * @param {String} oldDateString 2017-01-01
     * @param {String} [newDateString] 2018-01-01
     * @returns {String}
     */
    compareByDate(mode, oldDateString, newDateString) {
        try {
            return this.modes[mode].compareByDate(oldDateString, newDateString);
        }
        catch (ex) {
            return ex;
        }
    }

    /**
     * 与指定天数前比较
     * @param {0|1|2|3} mode
     * @param {Number} days
     * @param {String} [newDateString] 2018-01-01
     * @returns {String}
     */
    compareByDays(mode, days, newDateString) {
        try {
            return this.modes[mode].compareByDays(days, newDateString);
        }
        catch (ex) {
            return ex;
        }
    }

    /**
     * 获取绘制折线图所用的点
     * @param {0|1|2|3} mode
     * @param {String} xName x轴属性
     * @param {String} yName y轴属性
     */
    getChartPoints(mode, xName, yName) {
        try {
            const points = this.modes[mode].getChartPoints(xName, yName);
            console.log(points);
            // TODO
            return "该功能尚未完成，敬请期待";
        }
        catch (ex) {
            return ex;
        }
    }

    toJson() {
        return JSON.stringify(this);
    }

    getDateString() {
        return this.last_update.toDateString();
    }

}

module.exports = UserFull;