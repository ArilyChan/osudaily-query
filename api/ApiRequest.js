"use strict";

const querystring = require('querystring');
const fetch = require('node-fetch')

class OsuApi {
    static async apiCall(_path, _data, _host) {
        try {
            const contents = querystring.stringify(_data);
            const url = "https://" + _host + "/api" + _path + '?' + contents;
            return await fetch(url).then(res => res.json());
        }
        catch (ex) {
            return "获取数据失败";
        }
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
