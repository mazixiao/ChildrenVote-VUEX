module.exports = {
    apiUrl:
    {
        // 汤
        // dev: 'http://10.0.38.49:2147/Tran.aspx?',


        // 测试
        dev: 'http://bdlyapi.yinchtv.com/Tran.aspx?',
        test: 'http://bdlyapi.yinchtv.com/Tran.aspx?',
        prod: 'http://bdlyapi.yinchtv.com/Tran.aspx?',

    },
    originUrl: {
        dev: 'http://localhost:8080/',

        // 测试
        test: 'http://bdlyh5.yinchtv.com/',
        //   正式
        prod: 'http://bdlyh5.yinchtv.com/',
    },
    qiniu: {


        // 测试
        // bucketHost: 'http://clouddn.yinchtv.com/',

        // 正式
        // bucketHost: 'http://qiniucdn.yinchtv.com/',

    },
}



// 前台
// bdlyh5.yinchtv.com

// 接口
// bdlyapi.yinchtv.com

// 后台
// bdlyweb.yinchtv.com