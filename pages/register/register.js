const app = getApp();

Page({
  data: {},

  // 注册按钮点击事件，调用后端API
  register(e) {
    const { username, password } = e.detail.value;

    if (!username || !password) {
      tt.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
      });
      return;
    }

    tt.request({
      url: `${app.globalData.backendUrl}/register`,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      data: {
        username,
        password,
      },
      success(res) {
        if (res.statusCode === 201) {
          tt.showToast({
            title: '注册成功',
            icon: 'success',
          });
          // 注册成功后跳转到登录页面
          tt.navigateTo({
            url: '/pages/login/login',
          });
        } else {
          tt.showToast({
            title: res.data.message || '注册失败',
            icon: 'none',
          });
        }
      },
      fail(res) {
        console.error('注册请求失败', res);
        tt.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
      },
    });
  },

  // 跳转到登录页面的方法
  goToLogin() {
    tt.navigateTo({
      url: '/pages/login/login',
    });
  },
});
