// pages/login/login.js
const app = getApp();

Page({
  data: {},

  // 登录按钮点击事件，调用后端API
  login(e) {
    const { username, password } = e.detail.value;

    if (!username || !password) {
      tt.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
      });
      return;
    }

    tt.request({
      url: `${app.globalData.backendUrl}/login`,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      data: {
        username,
        password,
      },
      success(res) {
        if (res.statusCode === 200) {
          tt.showToast({
            title: '登录成功',
            icon: 'success',
          });
          // 将用户ID保存到全局数据和本地缓存，用于后续请求
          app.globalData.userId = res.data.user_id;
          tt.setStorageSync('userId', res.data.user_id);

          // 登录成功后跳转到个人资料页面
          tt.reLaunch({
            url: '/pages/profile/profile',
          });
        } else {
          tt.showToast({
            title: res.data.message || '登录失败',
            icon: 'none',
          });
        }
      },
      fail(res) {
        console.error('登录请求失败', res);
        tt.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
      },
    });
  },

  // 跳转到注册页面的方法
  goToRegister() {
    tt.navigateTo({
      url: '/pages/register/register',
    });
  },
  // 新增抖音授权登录方法
  douyinLogin() {
    const page = this;
    tt.login({
      success(res) {
        if (res.code) {
          console.log("抖音登录成功，获取到 code:", res.code);
          // 将 code 发送给后端服务器
          tt.request({
            url: `${app.globalData.backendUrl}/douyin_login`,
            method: 'POST',
            header: {
              'content-type': 'application/json',
            },
            data: {
              code: res.code,
            },
            success(apiRes) {
              if (apiRes.statusCode === 200) {
                tt.showToast({ title: '抖音授权登录成功', icon: 'success' });
                // 将用户ID保存到全局数据和本地缓存
                app.globalData.userId = apiRes.data.user_id;
                tt.setStorageSync('userId', apiRes.data.user_id);
                // 登录成功后跳转
                tt.reLaunch({
                  url: '/pages/profile/profile',
                });
              } else {
                tt.showToast({ title: apiRes.data.message || '抖音授权登录失败', icon: 'none' });
              }
            },
            fail(err) {
              console.error('与后端通信失败', err);
              tt.showToast({ title: '网络请求失败', icon: 'none' });
            }
          });
        } else {
          tt.showToast({ title: '抖音登录失败', icon: 'none' });
        }
      },
      fail(res) {
        console.error("tt.login 调用失败", res);
      }
    });
  },
});