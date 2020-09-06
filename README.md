# osudaily-query

## 使用方法
[osudaily api](https://github.com/Adrriii/osudaily-api/wiki)

### 安装
```sh
npm install ArilyChan/osudaily-query
```

### 使用
```javascript
const osudailyQuery = require("osudaily-query");
let oq = new osudailyQuery({
    apiKey: "把你的apiKey放这里", // osudaily Api
    // 以下都可省略
    database: "./osudaily-v1.db", // 数据库路径，默认为根目录下的osudaily-v1.db
    prefixs: ["?", "？"], // 指令前缀，必须为单个字符，默认为["?", "？"]
})

let reply = await oq.apply(
    userId, // qqId
    message // 指令
    );
```

### 指令
详细指令说明可以输入odhelp查看
