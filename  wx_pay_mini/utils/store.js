/**
 * Storage通用存储文件定义
 */
const STORAGE_KEY = 'imooc-pay';
module.exports = {
  /**
   * 存储数据
   * 
   * @param {*} key 
   * @param {*} value
   * @param {*} module_name 模块名称
   * {userInfo : { userId: 123, userName: 'jack' }}
   */
  setItem(key, value,module_name) { 
    if (module_name) {
      let module_name_info = this.getItem(module_name);
      module_name_info[key] = value
      wx.setStorageSync(module_name, module_name_info);
    } else { 
      wx.setStorageSync(key, value);
    }
  },
  /**
   * 获取数据
   *
   * @param {*} key
   * @param {*} module_name 模块名称
   */
  getItem(key,module_name) { 
    if (module_name) {
      // 获取模块对象
      let val = this.getItem(module_name)
      // 如果有对应的key，取值
      if (val) return val[key]
      return ''
    } else { 
      return wx.getStorageSync(key);
    }
  },
  /**
   * 清除指定数据 或 清除所有数据
   *
   * @param {*} key 删除对应key值数据
   */
  clear(key) { 
    name?wx.removeStorageSync(key):wx.clearStorageSync();
  },
  /**
   * 获取系统信息
   *
   * @returns
   */
  getSystemInfo() { 
    return wx.getSystemInfoSync()
  }
}