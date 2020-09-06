"use strict";

const getUserData = require("../api/getUserData");
const utils = require('../api/utils');

// 绑定qq号和osuId
// 记录内容：
// qqId, osuId, defaultMode, _Id(db自带)

class UserInfo {
    constructor(host, apiKey) {
        this.host = host;
        this.apiKey = apiKey;
    }

    // 绑定qqId
    async bindUser(nedb, qqId, apiObject) {
        try {
            let userObject = await new getUserData(this.host, this.apiKey, apiObject).getUserSimple(nedb);
            // 如果找不到玩家会throw出来
            let osuId = parseInt(userObject.osu_id);
            let osuName = userObject.username;
            let defaultMode = (apiObject.m) ? parseInt(apiObject.m) : 0;
            let res = await nedb.find({ qqId: qqId });
            if (res.length <= 0) {
                await nedb.insert({ qqId, osuId, defaultMode });
            }
            else {
                await nedb.update({ qqId }, { $set: { osuId, defaultMode } });
            }
            let output = "绑定账号 " + osuName + " 成功，默认模式设置为 " + utils.getModeString(defaultMode);
            return output;
        }
        catch (ex) {
            return ex;
        }
    }


    // 设置默认模式
    async setMode(nedb, qqId, mode) {
        mode = parseInt(mode);
        let res = await nedb.find({ qqId: qqId });
        if (res.length > 0) {
            // 绑定过，更改原来的defaultMode
            await nedb.update({ qqId }, { $set: { defaultMode: mode } });
            return "您的默认游戏模式已设置为 " + utils.getModeString(mode);
        }
        else return "您还没有绑定任何账号";
    }

    // 获取绑定账号Id和mod
    async getUserOsuInfo(qqId, nedb) {
        let res = await nedb.find({ qqId });
        if (res.length > 0) {
            let defaultMode = res[0].defaultMode || 0;
            return { qqId: qqId, osuId: res[0].osuId, defaultMode: defaultMode };
        }
        else return { qqId: qqId, osuId: 0, defaultMode: 0 };
    }
}

module.exports = UserInfo;