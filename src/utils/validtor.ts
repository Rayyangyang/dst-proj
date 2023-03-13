import type { Rule } from 'ant-design-vue/es/form';
import type { UploadProps } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
const { createMessage } = useMessage();
import { Upload } from 'ant-design-vue';
/**
 * 身份证号码验证
 */

export const validatorIdCard = (_rule: Rule, idcard: number) => {
  const _IDRe18 =
    /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/;
  const _IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;
  if (idcard == '') {
    return Promise.resolve();
  }
  if (!(_IDRe18.test(idcard) || _IDre15.test(idcard))) {
    return Promise.reject('格式错误');
  }
  return Promise.resolve();
};

/**
 * 文件上传
 */
export const validatorUploadImg: UploadProps['beforeUpload'] = (file) => {
  const fileTypes: string[] = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp', 'image/gif'];
  // 验证格式
  if (fileTypes.indexOf(file.type) == -1) {
    createMessage.error('文件格式错误');
    return Upload.LIST_IGNORE;
  }

  // 验证文件大小
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    createMessage.error('文件过大');
    return Upload.LIST_IGNORE;
  }
};

// pdf 上传
export const validatorUploadPdf: UploadProps['beforeUpload'] = (file) => {
  const fileTypes: string[] = ['application/pdf'];
  // 验证格式
  if (fileTypes.indexOf(file.type) == -1) {
    createMessage.error('文件格式错误');
    return Upload.LIST_IGNORE;
  }

  // 验证文件大小
  const isLt10M = file.size / 1024 / 1024 < 5;
  if (!isLt10M) {
    createMessage.error('文件过大');
    return Upload.LIST_IGNORE;
  }
};
// excel 上传
export const validatorUploadExcel: UploadProps['beforeUpload'] = (file) => {
  // 验证文件大小
  const isLt10M = file.size / 1024 / 1024 < 5;
  if (!isLt10M) {
    createMessage.error('文件过大');
    return Upload.LIST_IGNORE;
  }
};

/**
 * 文件上传
 */
export const validatorUploadImgOnlyPng: UploadProps['beforeUpload'] = (file) => {
  const fileTypes: string[] = ['image/png'];
  // 验证格式
  if (fileTypes.indexOf(file.type) == -1) {
    createMessage.error('文件格式错误');
    return Upload.LIST_IGNORE;
  }

  // 验证文件大小
  const isLt10M = file.size / 1024 / 1024 < 2;
  if (!isLt10M) {
    createMessage.error('文件过大');
    return Upload.LIST_IGNORE;
  }
};

// 汉字验证长度小于100
export const validatorChineseWord = (_rule: Rule, val: number) => {
  let text = '';
  switch (_rule.field) {
    case 'legalPerson':
      text = '请输入姓名';
      break;
    case 'name':
      text = '请输入企业名称';
      break;
    case 'nation':
      text = '请输入民族';
      break;
    case 'identityAddr':
      text = '请输入住址';
      break;
    case 'username':
      text = '请输入姓名';
      break;
    case 'emergencyContactName':
      text = '请输入紧急联系人姓名';
      break;
    default:
      break;
  }

  const reg = /^[\u4E00-\u9FA5]+$/;
  if (val == '') {
    return Promise.reject(text);
  }
  if (!reg.test(val)) {
    return Promise.reject('格式不符合要求');
  }
  return Promise.resolve();
};

// 汉字校验
export const validatorChinese = (_rule: Rule, val: number) => {
  let text = '';
  switch (_rule.field) {
    case 'send':
      text = '请输入发货人姓名';
      break;
    case 'receive':
      text = '请输入收货人姓名';
      break;
    case 'name':
      text = '请输入姓名';
      break;
    default:
      break;
  }
  const reg = /^[\u4E00-\u9FA5]+$/;
  if (val == '') {
    return Promise.reject(text);
  }
  if (!reg.test(val)) {
    return Promise.reject('格式不符合要求');
  }
  return Promise.resolve();
};

// 字母数字 长度18
export const validatorNumberAndEng = (_rule: Rule, val: number) => {
  const reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
  if (val == '') {
    return Promise.reject('请输入统一社会信用代码');
  }
  if (!reg.test(val) || val.length < 18) {
    return Promise.reject('格式不符合要求');
  }
  return Promise.resolve();
};

// 手机号验证
export const validatorPhoneNum = (_rule: Rule, val: number) => {
  const reg = /^[1][0-9]{10}$/;
  if (val == '') {
    return Promise.reject('请输入手机号');
  }
  if (!reg.test(val)) {
    return Promise.reject('格式不符合要求');
  }
  return Promise.resolve();
};

// 电话号码验证 (6-12)
export const validatorPhoneNum1 = (_rule: Rule, val: number) => {
  if (val == '') {
    return Promise.reject('请输入手机号');
  }

  if (val.length < 6) {
    return Promise.reject('格式不符合要求');
  }
  return Promise.resolve();
};

// 电话号码验证(7-12)
export const validatorPhoneNum2 = (_rule: Rule, val: number) => {
  let text = '';
  switch (_rule.field) {
    case 'sendPhone':
      text = '请输入发货人电话';
      break;
    case 'receivePhone':
      text = '请输入收货人电话';
      break;
    case 'phone':
      text = '请输入电话';
      break;
    default:
      break;
  }
  if (val == '') {
    return Promise.reject(text);
  }

  if (val.length < 7) {
    return Promise.reject('格式不符合要求');
  }
  return Promise.resolve();
};
// 银行对公账号验证
export const validateBankAcc = (_rule: Rule, val: number) => {
  const reg = /^[0-9]*$/;
  if (val == '') {
    return Promise.reject('请输入银行对公账号');
  }
  if (!reg.test(val) || val.length < 16) {
    return Promise.reject('格式不符合要求');
  }
  return Promise.resolve();
};
// 验证邮箱
export const validatorEmail = (_rule: Rule, val: number) => {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (val == '') {
    return Promise.reject('请输入邮箱');
  }
  if (!reg.test(val) || val.length < 16) {
    return Promise.reject('格式不符合要求');
  }
  return Promise.resolve();
};

// 验证两位小数
export const validateSendMoney = (_rule: Rule, val: number) => {
  const reg = new RegExp(/^(([1-9]\d*)|\d)(\.\d{1,2})?$/, 'g');
  if (isNaN(val)) {
    if (_rule.field == 'cargoVolume') {
      return Promise.resolve();
    }
    if (_rule.field == 'freight') {
      return Promise.reject('请输入运费');
    }
    if (_rule.field == 'cargoWeight') {
      return Promise.reject('请输入货物重量');
    }
  }

  if (!reg.test(val)) {
    return Promise.reject('格式不符合要求');
  }
  return Promise.resolve();
};

// 验证货物体积
export const validateVolume = (_rule: Rule, val: number) => {
  console.log(999, val)
  const reg = new RegExp(/^(([1-9]\d*)|\d)(\.\d{1,2})?$/, 'g');
  if (!val) {
    return Promise.resolve();
  }

  if (!reg.test(val)) {
    return Promise.reject('格式不符合要求');
  }
  return Promise.resolve();
};
