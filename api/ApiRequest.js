"use strict";

const querystring = require('querystring');
const https = require('https');

class OsuApi {
    static apiRequest(options) {
        return new Promise((resolve, reject) => {
            const contents = querystring.stringify(options.data);
            const requestOptions = {
                host: options.host,
                port: 443,
                type: 'https',
                method: 'GET',
                path: '/api' + options.path + '?' + contents,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': contents.length
                }
            }
            let _data = '';

            console.log("发送请求：" + requestOptions.host + requestOptions.path);

            const req = https.request(requestOptions, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    _data += chunk;
                });
                res.on('end', function () {
                    resolve(_data);
                });
                res.on('error', function (e) {
                    console.dir('problem with request: ' + e.message);
                    reject(e)
                });
            });
            req.write(contents);
            req.end();
        })
    }

    static async apiCall(_path, _data, _host) {
        return await this.apiRequest({
            path: _path,
            data: _data,
            host: _host
        }).then(data => {
            try {
                if (!data) return { error: "获取数据失败" };
                return JSON.parse(data);
            }
            catch (ex) {
                console.log(ex);
                return { error: "获取数据失败" };
            }
        });
    }

    /**
     * Retrieve general user data, also with the possibility of retrieving all the collected data since the registration.
     * @param {Object} options
     * @param {String|Number} options.u user osu_id (or username is s is set to 1) (required)
     * @param {Number} [options.s] whether or not the u parameter is a string (0 = id, 1 = string). Optional, 0 by default.
     * @param {Number} [options.m] mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, all modes are returned by default.
     * @param {Number} [options.min] minimized. Optional, specifies whether you'll get the full history or just the latest data. Only the latest data is returned by default. Set it to 0 to get the full history.
     * @param {String} host osudaily.net (required)
     * @param {String} apiKey api key (required).
     */
    static async getUser(options, host, apiKey) {
        options.k = apiKey;
        const resp = await this.apiCall('/user', options, host);
        return resp;
    }

    /**
     * Retrieve general user data, also with the possibility of retrieving all the collected data since the registration.
     * @param {Object} options
     * @param {String|Number} options.u user osu_id (or username is s is set to 1) (required)
     * @param {Number} [options.s] whether or not the u parameter is a string (0 = id, 1 = string). Optional, 0 by default.
     * @param {Number} [options.m] mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, all modes are returned by default.
     * @param {String} host osudaily.net (required)
     * @param {String} apiKey api key (required).
     */
    static async getUserFull(options, host, apiKey) {
        options.min = 0;
        options.k = apiKey;
        const resp = await this.apiCall('/user', options, host);
        return resp;
    }

    /**
     * Retrieve general user data, also with the possibility of retrieving all the collected data since the registration.
     * @param {Object} options
     * @param {String} options.t type of data to return (required) See below
     * Parameters when t = "c" (Millions count for a specified user)
     * Parameters when t = "l" : (List of millions for a specified user)
     * Parameters when t = "t" (Top millions farmers)
     * @param {Number} options.u when t = "c" || t = "l", osu_id of the user (required).  when t = "t", The number of users in the leaderboard. Optional, set to 50 by default.
     * @param {String} host osudaily.net (required)
     * @param {String} apiKey api key (required).
     */
    static async getMillion(options, host, apiKey) {
        options.k = apiKey;
        const resp = await this.apiCall('/million', options, host);
        return resp;
    }

    /**
     * Retrieve general user data, also with the possibility of retrieving all the collected data since the registration.
     * @param {Object} options
     * @param {Number} [options.m] mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, 0 by default.
     * @param {Number} [options.t] Number of players to display from the first position. Optional, 50 by default. Range 1 - 100.
     * @param {String} host osudaily.net (required)
     * @param {String} apiKey api key (required).
     */
    static async getTop(options, host, apiKey) {
        options.k = apiKey;
        const resp = await this.apiCall('/top', options, host);
        return resp;
    }

}

module.exports = OsuApi;
