import { defHttp } from '/@/utils/http/axios';

const baseUrl = '/3/dst-ooc-base-server';

// 日志 列表分页
export const actionsSyslogPage = (params?: any) => {
  return defHttp.post({
    url: baseUrl + '/syslog/page',
    params,
  });
};
