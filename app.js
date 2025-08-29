//app,js
App({
  // globalData: 全局数据，可在所有页面中访问
  globalData: {
    // 后端服务器的基础URL
    // 在本地开发时，请使用你的局域网IP地址，而不是127.0.0.1
    // 开发者工具可能无法访问127.0.0.1
    // 例如：'http://192.168.1.100:5000'
    backendUrl: 'http://115.190.137.9:5000',
    userId: null, // 存储登录后的用户ID
    // 还可以存储其他需要全局共享的数据，例如token
  },

  // onLaunch: 小程序初始化完成时（全局只触发一次）
  onLaunch(options) {
    console.log('小程序启动');
    // 在这里可以进行一些初始化的工作，例如检查登录状态
    const userId = tt.getStorageSync('userId');
    if (userId) {
      this.globalData.userId = userId;
      console.log('从本地缓存中恢复用户ID:', userId);
    }
  },

  // onShow: 小程序前台显示时
  onShow(options) {
    console.log('小程序显示');
  },

  // onHide: 小程序后台隐藏时
  onHide() {
    console.log('小程序隐藏');
  },

  // onError: 小程序发生脚本错误或 API 调用失败时
  onError(msg) {
    console.error('小程序发生错误:', msg);
  }
});