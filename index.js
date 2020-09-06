"use strict";

const Command = require("./command/Command");

class osudailyQuery {
    /**
     * @param {Object} params 
     * @param {String} params.apiKey osudaily apiKey，必要
     * @param {String} [params.host] osudaily网址，默认为"osudaily.net"
     * @param {String} [params.database] 数据库路径，默认为根目录下的osudaily-v1.db
     * @param {Array<String>} [params.prefixs] 指令前缀，必须为单个字符，默认为[?,？]
     * @param {String} [params.storagePath] 个人stat缓存路径，默认为根目录下的storage文件夹
     */
    constructor(params) {
        this.globalConstant = {};
        this.globalConstant.apiKey = params.apiKey || "";
        this.globalConstant.host = params.host || "osudaily.net";
        this.database = params.database || './Opsbot-v1.db';
        this.globalConstant.nedb = require('./database/nedb')(this.database);
        this.prefixs = params.prefixs || ["?", "？"];
        this.globalConstant.prefix = this.prefixs[0];
        this.globalConstant.storagePath = params.storagePath || './storage';
	}

    /**
     * 获得返回消息
	 * @param {Number} qqId
     * @param {String} message 输入的消息
     */
    async apply(qqId, message) {
        try {
            if (!message.length || message.length < 2) return "";
            if (this.prefixs.indexOf(message.substring(0, 1)) < 0) return "";
			let commandObject = new Command(qqId, message.substring(1).trim(), this.globalConstant);
			let reply = await commandObject.apply();
            return reply;
        } catch (ex) {
            console.log(ex);
            return "";
        }
    }
}


module.exports = osudailyQuery;
