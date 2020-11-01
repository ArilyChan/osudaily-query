"use strict";

const OsudailyApi = require("./ApiRequest");
const utils = require("./utils");
const UserMin = require("./objects/UserMin");
const UserFull = require("./objects/UserFull");
//const fs = require("fs");
//const path = require("path");

class getUserData {
    constructor(host, apiKey, params) {
        this.host = host;
        this.apiKey = apiKey;
        this.params = params;
        this.options = this.setOptions(params);
    }

    // 判断字符串是否为正整数
    checkInt(nubmer) {
        var re = /^\d+$/;
        return (re.test(nubmer));
    }
    setOptions(params) {
        let options = {};
        // 直接获取所有模式数据太大了，只按模式获取
        options.m = params.m;
        let u = params.u;
        if (!u) throw "玩家名为空";
        // 带引号强制字符串形式
        if ((u.length > 4) && (u.substring(0, 1) === "\"") && (u.substring(u.length - 1) === "\"")) {
            options.u = u.substring(1, u.length - 1);
            options.s = 1;
        }
        else if (this.checkInt(u)) {
            options.u = u;
            options.s = 0;
        }
        else {
            options.u = u;
            options.s = 1;
        }
        return options;
    }

    async getUserSimple() {
        delete this.options.m; // 全mod
        const user = await OsudailyApi.getUser(this.options, this.host, this.apiKey);
        if (user.error) throw user.error + "\n" + utils.apiObjectToString(this.options) + "\n可能该用户尚未注册osudaily.net账号";
        let userObject = new UserMin(user);
        return userObject;
    }

    async getUserFull() {
        const user = await OsudailyApi.getUserFull(this.options, this.host, this.apiKey);
        if (user.error) throw user.error + "\n" + utils.apiObjectToString(this.options) + "\n可能该用户尚未注册osudaily.net账号";
        let userObject = new UserFull(user);
        return userObject;
    }

    // TODO fs.writeFileSync也能报ENOENT？它不会创建的吗？

    /*
    loadUserFull(dirPath, userId) {
        try {
            let file = path.join(dirPath, this.params.m.toString(), userId.toString() + ".dat")
            let data = fs.readFileSync(file, 'utf8');
            return new UserFull(JSON.parse(data.toString()));
        }
        catch (ex) {
            return null;
        }
    }

    saveUserFull(dirPath, userObject) {
        try {
            let file = path.join(dirPath, this.params.m.toString(), userObject.osu_id.toString() + ".dat")
            fs.writeFileSync(file, userObject.toJson(), 'utf8');
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }
    */

    async showSumStat() {
        try {
            let user = await this.getUserSimple();
            return user.toString();
        }
        catch (ex) {
            return ex;
        }
    }

    async compareByDate() {
        try {
            let user = await this.getUserFull();
            return user.compareByDate(this.params.m, this.params.oldDate, this.params.newDate)
        }
        catch (ex) {
            return ex;
        }
    }

    async compareByDays() {
        try {
            let user = await this.getUserFull();
            return user.compareByDays(this.params.m, this.params.days, this.params.newDate)
        }
        catch (ex) {
            return ex;
        }
    }

    async getChart() {
        try {
            let user = await this.getUserFull();
            return user.getChartPoints(this.params.m, this.params.xtitle, this.params.ytitle);
        }
        catch (ex) {
            return ex;
        }
    }
}

module.exports = getUserData;