
/*
查询示例：
const ApiSqlite = require("./src/js/ApiSqlite");
const db = new ApiSqlite("./src/data/api_db.db");

db.query("select * from hs_routes").then((result)=>{
	console.log(result)
})

*/
const fs = require('fs')
const initSqlJs = require('sql.js')

export default class ApiSqlite{
    db = null
    sqlitePath = ""

    constructor(sqlite_path) {
        this.sqlitePath = sqlite_path;
    }

    // 初始化sql连接
    async init_link() {
        // 1. 异步加载sqlite驱动
        const SQL = await initSqlJs();
        // 创建sqlite连接实例
        const fileBuffer = fs.readFileSync(this.sqlitePath);
        this.db = new SQL.Database(fileBuffer);
    }


    /**
     db.create_table(
             `
             CREATE TABLE IF NOT EXISTS users (
             id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
             name TEXT NOT NULL,
             age INTEGER NOT NULL
             )
             `
     ).then((result)=>{
        console.log(result)
     })
     * @param sql 新建表结构sql
     */
    create_table(sql) {
        return new Promise(async (resolve, reject) => {
            try{
                // 保证连接对象存在
                if(!this.db) await this.init_link();

                // 执行新建表结构
                this.db.exec(sql);

                // 数据同步到sqlite文件
                this.writeSqlite();

                resolve({code:200,msg:'ok'})
            }catch (e) {
                reject(e)
            }
        })
    }

    /**
     db.add(
     "INSERT INTO hs_routes(method, url, response) VALUES (?, ?,?)",
     ["post", "/user", "123"]
     ).then((result)=>{
                console.log(result) // {code:200,msg:lastInsertedId}
            })
     * @param sql
     * @param sqlArgs
     */
    add(sql, sqlArgs = []) {
        return new Promise(async (resolve, reject) => {
            try{
                // 保证连接对象存在
                if(!this.db) await this.init_link();

                // 执行
                this.db.run(sql, sqlArgs)

                // 数据同步到sqlite文件
                this.writeSqlite();

                resolve({code:200,msg: 'ok'})
            }catch (e) {
                console.error("数据库操作失败:", e);
                reject(e)
            }
        })
    }


    /**
     db.add_more(
        "table_name",
         [
             { name: "Let's Go", email: "alice@example.com" },
             { name: "Bob", email: "bob@example.com" },
             { name: "Charlie", email: "charlie@example.com" }
         ]
     ).then((result)=>{
        console.log(result)
     })
     * @param table_name
     * @param data
     */
    add_more(table_name, data = []) {
        return new Promise(async (resolve, reject) => {
            try{
                // 保证连接对象存在
                if(!this.db) await this.init_link();

                // 构建批量INSERT语句
                let field_str = Object.keys(data[0]).join(',');
                const batchInsertQuery = data.map(json_data => {
                    let sql_val_str = ""
                    for (const json_data_key in json_data) {
                        if(Number.isInteger(json_data[json_data_key])){
                            sql_val_str +=  json_data[json_data_key] + ","
                        }else{
                            sql_val_str +=  '"' + json_data[json_data_key].replace(/(["'])/g, '\\$1') +'",'
                        }

                    }
                    sql_val_str = sql_val_str.slice(0, -1);
                    return `INSERT INTO ${table_name}(${field_str}) VALUES(${sql_val_str});`
                }).join('');

                // 执行sql
                this.db.run(batchInsertQuery);

                // 数据同步到sqlite文件
                this.writeSqlite();

                resolve({code:200,msg:'ok'})
            }catch (e) {
                reject(e)
            }
        })
    }

    /**
     db.delete(
     "DELETE FROM hs_routes WHERE id=?",
     [7]
     ).then((result)=>{
            console.log(result)
        })
     * @param sql
     * @param sqlArgs
     */
    delete(sql,sqlArgs = [] ){
        return new Promise(async (resolve, reject) => {
            try{
                // 保证连接对象存在
                if(!this.db) await this.init_link();

                // 执行
                this.db.run(sql, sqlArgs)

                // 数据同步到sqlite文件
                this.writeSqlite();

                resolve({code:200,msg:'ok'})
            }catch (e) {
                reject(e)
            }
        })
    }

    /**
     db.delete(
        "DELETE FROM hs_routes"
     [7]
     ).then((result)=>{
        console.log(result)
     })
     * @param sql
     */
    clear(sql){
        return new Promise(async (resolve, reject) => {
            try{
                // 保证连接对象存在
                if(!this.db) await this.init_link();

                this.db.run(sql); // 执行sql

                // 数据同步到sqlite文件
                this.writeSqlite();

                resolve({code:200,msg:'ok'})
            }catch (e) {
                reject(e)
            }
        })
    }


    /**
     db.update(
     "UPDATE hs_routes SET response=? WHERE id=?",
     ["999",1]
     ).then((result)=>{
            console.log(result)
         })
     * @param sql
     * @param sqlArgs
     */
    update(sql,sqlArgs = [] ){
        return new Promise(async (resolve, reject) => {
            try{
                // 保证连接对象存在
                if(!this.db) await this.init_link();

                // 执行
                this.db.run(sql, sqlArgs); // 执行sql

                // 数据同步到sqlite文件
                this.writeSqlite();

                resolve({code:200,msg:'ok'})
            }catch (e) {
                reject(e)
            }
        })
    }

    /**
     db.query("select* from hs_routes").then((result)=>{
            console.log(result)
         })

     * @param sql
     * @param sqlArgs
     */
    query( sql ,sqlArgs = [] ){
        return new Promise(async (resolve, reject) => {
            try{
                // 保证连接对象存在
                if(!this.db) await this.init_link();

                // 执行sql
                const query_stmt = this.db.prepare(sql);
                query_stmt.bind(sqlArgs); //绑定值
                const result = [];
                while(query_stmt.step()) { // 遍历每行值
                    const row = query_stmt.getAsObject();
                    result.push(row)
                }

                // 释放语句使用的内存
                query_stmt.free();

                // 响应获取到的数据
                resolve({code:200,msg:result})
            }catch(e){
                reject(e)
            }

        })
    }

    /**
     * 内存数据同步到sqlite文件
     */
    writeSqlite(){
        const data = this.db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(this.sqlitePath, buffer);
    }

}