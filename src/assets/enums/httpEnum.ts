/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = '200',
  ERROR = 1,
  TIMEOUT = '401',
  TYPE = 'success',
}

/**
 * @description: Request result code
 */
export enum ResultCodeEnum {
  TOKEN_FAIL = '1021',
  TOKEN_FAIL_COMPANY = '1023', // 多企业
  TOKEN_NULL = '1000', // 令牌为空
  TOKEN_OOFLINE = '1022',
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
