// pages/result/result.js

const app = getApp();

Page({
  data: {
    predictionResult: null,
  },

  onLoad() {
    // 检查全局数据中是否有预测结果
    if (app.globalData.predictionResult) {
      this.setData({
        predictionResult: app.globalData.predictionResult,
      });
    }
  },

  // 返回个人资料页面的方法
  goToProfile() {
    tt.reLaunch({
      url: '/pages/profile/profile',
    });
  }
});
