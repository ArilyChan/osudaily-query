"use strict";

const utils = require('../utils');

class Mode {
    constructor(modeData) {
        this.A = parseInt(modeData.A);
        this.S = parseInt(modeData.S);
        this.SS = parseInt(modeData.SS);
        this.accuracy = parseFloat(modeData.accuracy); // 99.134
        this.level = parseFloat(modeData.level);
        this.mode = parseInt(modeData.mode);
        this.playcount = parseInt(modeData.playcount);
        this.pp = parseInt(modeData.pp);
        this.rankcountry = parseInt(modeData.rankcountry);
        this.rankedscore = parseInt(modeData.rankedscore);
        this.rankworld = parseInt(modeData.rankworld);
        this.totalscore = parseInt(modeData.totalscore);
    }

    toString() {
        let output = "";
        output = output + "模式：" + utils.getModeString(this.mode) + "\n";
        output = output + "PP：" + this.pp + "\n";
        output = output + "ACC：" + this.accuracy + "%\n";
        output = output + "本地排名：#" + this.rankcountry + "\n";
        output = output + "全球排名：#" + this.rankworld + "\n";
        output = output + "游玩次数：" + this.playcount + "\n";
        output = output + "Rank总分：" + utils.format_number(this.rankedscore) + "\n";
        output = output + "等级：" + this.level + "\n";
        output = output + "SS：" + this.SS + "\n";
        output = output + "S：" + this.S + "\n";
        output = output + "A：" + this.A + "\n";
        return output;
    }
}

class UserMin {
    constructor(data) {
        // this.id = parseInt(data.id);
        this.osu_id = parseInt(data.osu_id);
        this.username = data.username;
        this.country = parseInt(data.country);
        this.last_update = data.last_update;
        this.modes = [];
        this.modes[0] = new Mode(data.modes[0]);
        this.modes[1] = new Mode(data.modes[1]);
        this.modes[2] = new Mode(data.modes[2]);
        this.modes[3] = new Mode(data.modes[3]);
        this.sumA = this.modes[0].A + this.modes[1].A + this.modes[2].A + this.modes[3].A;
        this.sumS = this.modes[0].S + this.modes[1].S + this.modes[2].S + this.modes[3].S;
        this.sumSS = this.modes[0].SS + this.modes[1].SS + this.modes[2].SS + this.modes[3].SS;
        this.sumPP = this.modes[0].pp + this.modes[1].pp + this.modes[2].pp + this.modes[3].pp;
        this.sumPlaycount = this.modes[0].playcount + this.modes[1].playcount + this.modes[2].playcount + this.modes[3].playcount;
        this.sumRankedscore = this.modes[0].rankedscore + this.modes[1].rankedscore + this.modes[2].rankedscore + this.modes[3].rankedscore;
    }

    toString() {
        let output = "";
        output = output + "玩家 " + this.username + " 的四模式统计：\n";
        output = output + "id：" + this.osu_id + "\n";
        output = output + "A：" + this.sumA + "\n";
        output = output + "S：" + this.sumS + "\n";
        output = output + "SS：" + this.sumSS + "\n";
        output = output + "PP：" + this.sumPP + "\n";
        output = output + "游玩次数：" + this.sumPlaycount + "\n";
        output = output + "Rank总分：" + utils.format_number(this.sumRankedscore) + "\n";
        output = output + "\n";
        output = output + "更新时间：" + this.last_update + "\n";
        return output;
    }

    /**
     * @param {0|1|2|3} mode 
     */
    toModeString(mode) {
        let output = "";
        output = output + "玩家 " + this.username + " 的" + utils.getModeString(mode) + "模式统计：\n";
        output = output + "id：" + this.osu_id + "\n";
        output = output + this.modes[mode].toString();
        output = output + "\n";
        output = output + "更新时间：" + this.last_update + "\n";
        return output;
    }

}

module.exports = UserMin;