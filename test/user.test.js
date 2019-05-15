const assert = require('assert')
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateEmailChange = require('../validation/email_change');

describe('#REGISTER', () => {
  it('Test validateRegisterInput Function 測試錯誤回覆一致 ', () => {
    data = {}
    data.name = 'w';
    data.email = 'wucuienhsun01gmail.com';
    data.password = '123456'
    data.password2 = '13456'
    let errorMsg = {
      errors: {
        name: 'Name must be between 2 and 30 characters',
        email: 'Email is invalid',
        password2: 'Passwords must match'
      },
      isValid: false
    }
    assert.deepEqual(validateRegisterInput(data), errorMsg, '測試錯誤回覆一致')

  })
  it('Test validateRegisterInput Function  測試輸入正確後的正確回覆', () => {
    data1 = {}

    data1.name = 'wu';
    data1.email = 'wucuienhsun01@gmail.com';
    data1.password = '123456'
    data1.password2 = '123456'
    let successMsg = {
      errors: {},
      isValid: true
    }
    assert.deepEqual(validateRegisterInput(data1), successMsg, '測試輸入正確後的正確回覆')
  })
  it('Test validateRegisterInput Function  測試名稱長度信箱為空', () => {
    data2 = {}

    data2.name = 'wjdwjdwejdiwjdlwejkdlwejdlwedjlwdjkewldjklwdlewdu';
    data2.email = 'asdasd';
    data2.password = '123456'
    data2.password2 = '123456'
    let error2Msg = {
      errors: {
        email: 'Email is invalid',
        name: 'Name must be between 2 and 30 characters'
      },
      isValid: false
    }
    assert.deepEqual(validateRegisterInput(data2), error2Msg, '測試名稱長度信箱為空')
  })
  it('Test validateRegisterInput Function  測試錯誤回覆一致', () => {
    data3 = {}

    data3.name = 'wjdwjdwejdiwjdlwejkdlwejdlwedjlwdjkewldjklwdlewdu';
    data3.email = 'asdasd';
    data3.password = ''
    data3.password2 = '123456+NaN'
    let error3Msg = {
      errors: {
        email: 'Email is invalid',
        name: 'Name must be between 2 and 30 characters',
        password: 'Password must be at least 6 characters',
        password2: 'Passwords must match'
      },
      isValid: false
    }
    assert.deepEqual(validateRegisterInput(data3), error3Msg, '測試錯誤回覆一致')
  })
})
describe('#LOGIN', () => {
  it('Test validateLoginInput Function 測試輸入正確後的正確回覆', () => {
    data = {}
    data.email = 'wucuienhsun01@gmail.com';
    data.password = '123456'
    let succMsg = {
      errors: {},
      isValid: true
    }
    assert.deepEqual(validateLoginInput(data), succMsg, '測試輸入正確後的正確回覆')
  })
  it('Test validateLoginInput Function 測試未輸入email', () => {
    data = {}
    data.email = '';
    data.password = '123456'
    let succMsg = {
      errors: { email: 'Email field is required' },
      isValid: false
    }
    assert.deepEqual(validateLoginInput(data), succMsg, '測試未輸入email')
  })

  it('Test validateLoginInput Function 測試未輸入email Password', () => {
    data = {}
    data.email = '';
    data.password = ''
    let succMsg = {
      errors: { email: 'Email field is required' },
      isValid: false
    }
    assert.deepEqual(validateLoginInput(data), succMsg, '測試未輸入email Password')
  })

  it('Test validateLoginInput Function 測試輸入不合法email', () => {
    data = {}
    data.email = 'weioqjoifjo';
    data.password = '123456'
    let succMsg = {
      errors: { email: '信箱格式錯誤' },
      isValid: false
    }
    assert.deepEqual(validateLoginInput(data), succMsg, '測試輸入不合法email ')
    data1 = {}
    data1.email = 'weioqjoifjo@gmail.c';
    data1.password = '123456'
    let succMsg1 = {
      errors: { email: '信箱格式錯誤' },
      isValid: false
    }
    assert.deepEqual(validateLoginInput(data1), succMsg1, '測試輸入不合法email ')
  })
})


describe('#EMAILCHANGE', () => {
  it('Test validateEmailChange Function 測試輸入正確後的正確回覆', () => {
    data = {}

    data.email = 'wucuienhsun01@gmail.com';
    let succMsg = {
      errors: {},
      isValid: true
    }
    assert.deepEqual(validateEmailChange(data), succMsg, '測試輸入正確後的正確回覆')
  })
  it('Test validateEmailChange Function 測試沒有輸入email錯誤', () => {
    data = {}
    data.email = '';
    let succMsg = {
      errors: { email: 'Email field is required' },
      isValid: false
    }
    assert.deepEqual(validateEmailChange(data), succMsg, '測試沒有輸入email錯誤')
  })
})