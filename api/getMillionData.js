"use strict";

const OsudailyApi = require("./ApiRequest");
const utils = require("./utils");

class getMillionData {
    constructor(host, apiKey, osuId) {
        this.host = host;
        this.apiKey = apiKey;
        this.osuId = osuId;
    }

    async getUserMillionCounts() {
        let options = {};
        options.u = this.osuId;
        options.t = "c";
        const data = await OsudailyApi.getMillion(options, this.host, this.apiKey);
        if (data.error) throw data.error + "\n" + utils.apiObjectToString(this.options) + "\n可能该用户尚未注册osudaily.net账号";
        return "该用户（" + data.osu_id + "）在mania共有 " + data.count + " 个一百万成绩";
    }
}

module.exports = getMillionData;