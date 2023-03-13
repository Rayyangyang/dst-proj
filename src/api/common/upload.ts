import { defHttp } from '/@/utils/http/axios';

enum Api {
  UploadFile = '/oss/uploadFile',
}
/**
 * 文件上传
 */

export function uploadFileApi(file) {
  console.log(112222, file)
  return defHttp.post({
    url: Api.UploadFile,
    file,
  });
}
