import { UploadApiResult } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { getAppEnvConfig } from '/@/utils/env';

const { VITE_GLOB_API_URL } = getAppEnvConfig();
/**
 * @description: Upload interface
 */
export function uploadApi(params: UploadFileParams) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: '/oss/uploadFile',
      baseURL: VITE_GLOB_API_URL,
    },
    params,
  );
}
