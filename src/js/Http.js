let node_url = require('url')
let node_qs = require('querystring')
/**
 纯 nodejs 环境 http客户端
 使用示例
    import Http from "@/js/Http"
     new Http({
         url:'http://127.0.0.1:8421/test?address=shanghai', //自定义参数：请求网址
         method:'get', // 请求方式，不区分大小写，默认值： 'GET'
         params:{}, //自定义参数：url请求参数,该参数会拼接在url后面
         data:{}, //自定义参数：post请求参数,get请求时，该参数会被忽略
         // 发送请求头
         headers:{
         'Content-Type':'application/json'
         }
     }).go().then(data => {
        console.log('Received data:', data);
     }).catch(err => {
        console.error('Error:', err);
     });
 */

export default class Http {
    // node http模块
    node_http = null

    // 默认http基本参数
    default_http_option={
        url:'http://127.0.0.1', //自定义参数：请求网址
        method:'get', // 请求方式，不区分大小写，默认值： 'GET'
        params:{}, //自定义参数：url请求参数,该参数会拼接在url后面
        data:{}, //自定义参数：post请求参数,get请求时，该参数会被忽略
        // 发送请求头
        headers:{
            'Content-Type':'application/json'
        }
    }

    // 实际http请求基本参数
    http_option={}

    // 响应对象
    response = null

    constructor(config = {}) {
        // 合并配置项
        this.http_option = {
            ...this.default_http_option,
            ...config
        }
        // 规范化http请求配置项
        const parsedUrl = new node_url.URL(this.http_option.url) // 解析url
        this.http_option.host = parsedUrl.hostname
        if(parsedUrl.port !== ""){
            this.http_option.port = parsedUrl.port
        }
        this.http_option.path = parsedUrl.pathname + parsedUrl.search
        this.http_option.method = this.http_option.method.toUpperCase()
        if(this.http_option.method === 'POST' && Object.keys(this.http_option.data).length>0){ // data处理
            this.http_option['headers']['Content-Length'] = Buffer.byteLength(JSON.stringify(this.http_option.data))
        }
        if(Object.keys(this.http_option.params).length>0){ // params处理
            const query_str =  node_qs.stringify(this.http_option.params) // json转化为query字符串
            this.http_option['path'] = this.http_option.path + (query_str?'&' + query_str:"")
        }

        // 加载http模块
        if(parsedUrl.protocol === "http:"){
            this.node_http = require('http')
        }else{
            this.node_http = require('https')
        }
    }

    // 开始请求
    go(){
        return new Promise((resolve, reject) => {
            this.response = this.node_http.request(this.http_option, res => {
                let list = [];

                //接收数据流
                res.on('data', chunk => {
                    list.push(chunk);
                });

                //数据接收完成
                res.on('end', () => {
                    resolve(Buffer.concat(list).toString()); // 在这里“返回”数据
                });

                // 监听错误
                res.on('error', (err) => {
                    reject(err); // 如果有错误，可以在这里“返回”错误
                });
            });

            // 发送data
            this.send_data()

            // 监听错误
            this.listen_error(reject)

            //  关闭请求
            this.close()
        });
    }

    //发送请求体数据
    send_data(){
        if(Object.keys(this.http_option.data).length>0){
            this.response.write(JSON.stringify(this.http_option.data));
        }
    }

    // 监听错误
    listen_error(reject){
        this.response.on('error', function(error) {
            reject(error); // 如果有错误，可以在这里“返回”错误
        });
    }

    // 关闭请求
    close(){
        this.response.end();
    }


}

