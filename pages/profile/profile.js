// pages/profile/profile.js

const app = getApp();

Page({
  data: {
    // 页面表单数据，初始化所有字段
    profile: {
      age: '',
      gender: '',
      marital_status: '',
      children_status: '',
      occupation: '',
      work_experience_years: '',
      education_level: '',
      graduated_university: '',
      major: '',
      income_range: '',
      asset_type_house: 0,
      asset_type_car: 0,
      asset_type_investment: 0,
      region_province: '',
      region_city: '',
      douyin_content_preference: '',
      douyin_interaction_frequency: '',
      salary: '',
      industry: ''
    },
    // 下拉选择框的选项
    genderOptions: ['男', '女'],
    maritalStatusOptions: ['已婚', '未婚', '离异', '丧偶'],
    childrenStatusOptions: ['有子女', '无子女'],
    educationOptions: ['高中', '大专', '本科', '硕士', '博士'],
    incomeOptions: ['<5k', '5k-10k', '10k-20k', '20k-30k', '>30k'],
    interactionOptions: ['经常互动', '偶尔互动', '很少互动']
  },

  onLoad() {
    // 检查用户是否已登录，如果没有，则跳转到登录页
    if (!app.globalData.userId) {
      tt.reLaunch({
        url: '/pages/login/login',
      });
    }
  },

  // Picker 组件值改变时触发
  onPickerChange(e) {
    const { name } = e.currentTarget.dataset;
    const index = e.detail.value;

    let selectedValue;
    if (name === 'gender') {
      selectedValue = this.data.genderOptions[index];
    } else if (name === 'marital_status') {
      selectedValue = this.data.maritalStatusOptions[index];
    } else if (name === 'children_status') {
      selectedValue = this.data.childrenStatusOptions[index];
    } else if (name === 'education_level') {
      selectedValue = this.data.educationOptions[index];
    } else if (name === 'income_range') {
      selectedValue = this.data.incomeOptions[index];
    } else if (name === 'douyin_interaction_frequency') {
      selectedValue = this.data.interactionOptions[index];
    }

    // 使用 this.setData() 更新页面数据
    this.setData({
      [`profile.${name}`]: selectedValue,
    });
  },

  // 表单提交事件
  submitProfile(e) {
    const formData = e.detail.value;
    const userId = app.globalData.userId;

    if (!userId) {
      tt.showToast({ title: '用户ID未找到，请重新登录', icon: 'none' });
      return;
    }

    // 1. 将表单数据与 picker 数据合并
    const requestData = {
      ...this.data.profile, // 使用this.data.profile确保picker的值被包含
      // 这里的formData只包含input和switch的值
      age: formData.age ? parseInt(formData.age, 10) : null,
      work_experience_years: formData.work_experience_years ? parseInt(formData.work_experience_years, 10) : null,
      asset_type_house: formData.asset_type_house ? 1 : 0,
      asset_type_car: formData.asset_type_car ? 1 : 0,
      asset_type_investment: formData.asset_type_investment ? 1 : 0
    };
    
    console.log('发送到后端的数据:', requestData);

    // 2. 调用更新用户资料 API
    tt.request({
      url: `${app.globalData.backendUrl}/user_profile/${userId}`,
      method: 'PUT',
      header: {
        'content-type': 'application/json',
      },
      data: requestData,
      success: (res) => {
        if (res.statusCode === 200) {
          tt.showToast({ title: '资料更新成功，开始预测...', icon: 'none' });
          this.predictCareer(userId);
        } else {
          tt.showToast({ title: res.data.message || '资料更新失败', icon: 'none' });
        }
      },
      fail: (res) => {
        console.error('更新资料请求失败', res);
        tt.showToast({ title: '网络请求失败', icon: 'none' });
      },
    });
  },

  // 调用职业预测API
  predictCareer(userId) {
    tt.request({
      url: `${app.globalData.backendUrl}/predict_career/${userId}`,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        if (res.statusCode === 200) {
          app.globalData.predictionResult = res.data;
          tt.navigateTo({
            url: '/pages/result/result',
          });
        } else {
          tt.showToast({ title: res.data.message || '预测失败', icon: 'none' });
        }
      },
      fail: (res) => {
        console.error('预测请求失败', res);
        tt.showToast({ title: '网络请求失败', icon: 'none' });
      },
    });
  }
});