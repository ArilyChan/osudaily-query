"use strict";

const UserInfo = require("../user/UserInfo");
const getUserData = require("../api/getUserData");
const getMillionData = require("../api/getMillionData");
const utils = require("./utils");

class Command {
    /**
     * @param {Number} qqId 发送者Id
     * @param {String} message 消息
     * @param {Object} globalConstant 
     * @param {String} globalConstant.apiKey osudaily apiKey
     * @param {String} globalConstant.host osudaily网址
     * @param {String} globalConstant.prefix prefix
     * @param {String} globalConstant.storagePath 
     * @param {import("./database/nedb")} globalConstant.nedb 数据库
     */
    constructor(qqId, message, globalConstant) {
        this.qqId = qqId;
        /** @type {String} */
        this.message = (message) ? message.trim().replace(/&#(x)?(\w+);/g, function ($, $1, $2) {
            return String.fromCharCode(parseInt($2, $1 ? 16 : 10));
        }) : "";
        this.commandString = "";
        this.argString = "";
        this.userInfo = { qqId: qqId, osuId: 0, defaultMode: 0 };
        this.globalConstant = globalConstant;
    }

    /**
     * 拆出指令和参数
     * @param {RegExp} commandReg 
     * @returns {Boolean} 消息是否符合指令形式
     */
    cutCommand() {
        const mr = /^([a-zA-Z]+)/i.exec(this.message);
        if (mr === null) return false;
        else {
            this.commandString = mr[1].toLowerCase();
            this.argString = this.message.substring(this.commandString.length).trim();
            return true;
        }
    }

    async getUserInfo() {
        this.userInfo = await new UserInfo(this.globalConstant.host, this.globalConstant.apiKey).getUserOsuInfo(this.qqId, this.globalConstant.nedb);
    }

    async bind() {
        let args = this.argString.split(" ");
        let options = {};
        options.u = args[0];
        options.m = (args[1]) ? utils.getMode(args[1]) : 0;
        return await new UserInfo(this.globalConstant.host, this.globalConstant.apiKey).bindUser(this.globalConstant.nedb, this.qqId, options);
    }

    async setMode() {
        let args = this.argString.split(" ");
        let mode = (args[0]) ? utils.getMode(args[0]) : 0;
        return await new UserInfo(this.globalConstant.host, this.globalConstant.apiKey).setMode(this.globalConstant.nedb, this.qqId, mode);
    }

    async showSumStat(isMe) {
        let args = this.argString.split(" ");
        let options = {};
        if (isMe) {
            await this.getUserInfo();
            options.u = this.userInfo.osuId;
            if (!options.u) return "请先使用setid绑定osu账号再使用me后缀指令";
        }
        else {
            if (args.length > 0 && args[0]) options.u = args[0];
            else return "请指定玩家";
        }
        return await new getUserData(this.globalConstant.host, this.globalConstant.apiKey, options).showSumStat();
    }

    async showMillionCount(isMe) {
        let args = this.argString.split(" ");
        let userId;
        if (isMe) {
            await this.getUserInfo();
            userId = this.userInfo.osuId;
            if (!userId) return "请先使用setid绑定osu账号再使用me后缀指令";
        }
        else {
            if (args.length > 0 && args[0]) userId = args[0];
            else return "请指定玩家ID";
        }
        return await new getMillionData(this.globalConstant.host, this.globalConstant.apiKey, userId).getUserMillionCounts();
    }

    async showCompareDate(isMe) {
        let args = this.argString.split(" ");
        let options = {};
        if (isMe) {
            await this.getUserInfo();
            options.u = this.userInfo.osuId;
            options.m = this.userInfo.defaultMode;
            options.oldDate = args[0];
            options.newDate = args[1];
            if (!options.u) return "请先使用setid绑定osu账号再使用me后缀指令";
            if (args.length <1) return "请先查看odhelp";
        }
        else {
            options.u = args[0];
            options.m = utils.getMode(args[1]);
            options.oldDate = args[2];
            options.newDate = args[3];
            if (!options.u) return "请指定玩家ID";
            if (args.length <3) return "请先查看odhelp";
        }
        return await new getUserData(this.globalConstant.host, this.globalConstant.apiKey, options).compareByDate(this.globalConstant.storagePath);
    }

    async showCompareDays(isMe) {
        let args = this.argString.split(" ");
        let options = {};
        if (isMe) {
            await this.getUserInfo();
            options.u = this.userInfo.osuId;
            options.m = this.userInfo.defaultMode;
            options.days = parseInt(args[0]);
            options.newDate = args[1];
            if (!options.u) return "请先使用setid绑定osu账号再使用me后缀指令";
            if (args.length <1) return "请先查看odhelp";
        }
        else {
            options.u = args[0];
            options.m = utils.getMode(args[1]);
            options.days = parseInt(args[2]);
            options.newDate = args[3];
            if (!options.u) return "请指定玩家ID";
            if (args.length <3) return "请先查看odhelp";
        }
        return await new getUserData(this.globalConstant.host, this.globalConstant.apiKey, options).compareByDays(this.globalConstant.storagePath);
    }

    async apply() {
        try {
            if (!this.cutCommand()) return "";
            else if (this.commandString === "odhelp") {
                let help = "";
                help += "osudaily 查询\n";
                help += "您可能需要先注册osudaily.net账号才能使用以下功能\n";
                help += "数据量可能会很大，发出指令后请耐心等待\n";
                help += this.globalConstant.prefix + "odsetid [osuId] (mode) 绑定osu账号\n";
                help += this.globalConstant.prefix + "odmode [mode] 设置默认模式\n";
                help += this.globalConstant.prefix + "odstat(me) (osuId) 显示四模式统计数据\n";
                help += this.globalConstant.prefix + "oddate(me) (osuId) (mode) [旧日期 2017-01-01] (新日期 2018-01-01) 对比日期查询\n";
                help += this.globalConstant.prefix + "oddays(me) (osuId) (mode) [天数] (新日期 2018-01-01) 对比天数查询\n";
                help += this.globalConstant.prefix + "odmill(me) (osuId) mania百万成绩数量查询\n";

                return help;
            }
            else if (this.commandString === "odsetid") return await this.bind();
            else if (this.commandString === "odmode") return await this.setMode();
            else if (this.commandString === "odstat") return await this.showSumStat(false);
            else if (this.commandString === "odstatme") return await this.showSumStat(true);
            else if (this.commandString === "oddate") return await this.showCompareDate(false);
            else if (this.commandString === "oddateme") return await this.showCompareDate(true);
            else if (this.commandString === "oddays") return await this.showCompareDays(false);
            else if (this.commandString === "oddaysme") return await this.showCompareDays(true);
            else if (this.commandString === "odmill") return await this.showMillionCount(false);
            else if (this.commandString === "odmillme") return await this.showMillionCount(true);

            return "";
        }
        catch (ex) {
            return ex;
        }
    }

}

module.exports = Command;