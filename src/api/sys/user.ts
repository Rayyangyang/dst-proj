import { defHttp, customHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
import { DST_OCC_BASE_SERVER } from '/@/assets/enums/server';

const baserUrl = '/0/dst-mgt-account-server';
const baseurlHZ = '/3/dst-ooc-base-server';

enum Api {
  Login = '/sso/apiLogin',
  Logout = '/sso/apiLogout',
  GetUserInfo = '/user/currentAccountUserInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  // 忘记密码
  SendForgetPwdCaptcha = '/user/sendForgotPwdCaptcha',
  UpdateForgetPwdCaptcha = '/user/forgotPwdUpdatePwd',

  // 修改手机号
  UpdatePhoneByCaptcha = '/user/updatePhoneByCaptcha',
  SendPhoneByCaptcha = '/user/sendUpdatePhoneCaptcha',

  // 修改密码
  UpdatePwdByOldPwd = '/user/updatePwdByOldPwd',

  // 令牌认证接口
  SSOAUTH = '/sso/auth',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'message') {
  return defHttp.post<LoginResultModel>(
    {
      url: baserUrl + Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>(
    { url: DST_OCC_BASE_SERVER + Api.GetUserInfo },
    { errorMessageMode: 'none' },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: baserUrl + Api.GetPermCode });
}

export function doLogout() {
  return defHttp.post({ url: baserUrl + Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: baserUrl + Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

// 忘记密码 发送短信
export function actionSendForgetPwdCaptcha(query?: any) {
  return customHttp.post({
    url: baserUrl + Api.SendForgetPwdCaptcha + '?' + query,
  });
}

// 忘记密码 提交表单
export function actionUpdateForgetPwdCaptcha(params?: any) {
  return customHttp.post(
    {
      url: baserUrl + Api.UpdateForgetPwdCaptcha,
      params,
    },
    {
      errorMessageMode: 'message',
    },
  );
}

// 修改手机号 提交表单
export function actionUpdatePhoneByCaptcha(params?: any) {
  return customHttp.post(
    {
      url: baseurlHZ + Api.UpdatePhoneByCaptcha,
      params,
    },
    {
      errorMessageMode: 'message',
    },
  );
}

// 修改手机号 发送验证码
export function actionSendPhoneCode(query?: any) {
  return defHttp.post({
    url: baseurlHZ + Api.SendPhoneByCaptcha + '?' + query,
  });
}

// 修改密码 发送验证码
export function actionUpdatePwdByOldPwd(data?: any) {
  return customHttp.post({
    url: baseurlHZ + Api.UpdatePwdByOldPwd,
    data,
  });
}

// 令牌认证接口 获取权限信息
export function actiongQuerySsoAuth() {
  return customHttp.post(
    {
      url: baserUrl + Api.SSOAUTH,
    },
    {
      errorMessageMode: 'none',
    },
  );
}

// 令牌认证接口 获取企业选择列表
export function actiongSsoGetCompanyListh() {
  return customHttp.get({
    url: baserUrl + '/sso/getCompanyList',
  });
}

// 令牌认证接口 给token选择企业
export function actiongSsoSelectCompany(companyId: any) {
  return customHttp.post({
    url: baserUrl + `/sso/selectCompany?companyId=${companyId}`,
  });
}

// 获取OEM基础配置信息（旨在左侧菜单logo,企业名称）
export function actiongOemBaseConfigDetail(params: any) {
  return customHttp.get({
    url: baserUrl + `/oemBaseConfig/detail`,
    params,
  });
}
