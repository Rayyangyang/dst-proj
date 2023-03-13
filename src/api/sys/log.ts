import { defHttp } from '/@/utils/http/axios';

// 日志 列表分页
export const actionsSyslogPage = (params?: any) => {
  return defHttp.post({
    url: '/syslog/page',
    params,
  });
};
