/**
 * Mongodb公共文件，统一操作数据库
 */

const MongoClient = require('mongodb').MongoClient;
const util = require('./../../utils/util');
const url = "mongodb://127.0.0.1:27017/imooc_pay";

/**
 * 连接数据库
 * @params callback
          dbase 操作数据库的表
          db 关闭打开数据库
 */
function connect(callback) { 
  MongoClient.connect(url, function (err, db) { 
    if (err) throw err;
    let dbase = db.db('imooc_pay');
    callback(dbase,db)
  })
}

/**
 * 查询数据
 * @param data 查询的条件
 * @param table 要查询的表
 */
exports.query = function (data,table) { 
  return new Promise((resolve, reject) => { 
    connect(function (dbase, db) { 
      // 连接数据库，根据data条件，查询table中符合条件的数据，返回一个数组，查询错误抛出错误
      dbase.collection(table).find(data).toArray(function (err, res) { 
        if (err) throw err
        // 关闭数据库
        db.close()
        resolve(util.handleSuccess(res || []))
      })
    })
  })
}

/**
 * 插入数据
 * @param data 插入的数据
 * @param table 要操作的表
 */
exports.insert = function (data,table) { 
  return new Promise((resolve, reject) => { 
    connect(function (dbase, db) { 
      // 连接数据库，将data数据插入table中，返回一个数组，查询错误抛出错误
      dbase.collection(table).insertOne(data,function (err, res) { 
        if (err) throw err
        // 关闭数据库
        db.close()
        resolve(util.handleSuccess(res || []))
      })
    })
  })
}