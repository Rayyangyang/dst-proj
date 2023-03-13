import { customHttp } from '/@/utils/http/axios';

const baseUrl = '/0/dst-mgt-account-server';

// 根据企业Id查询企业信息
export const actionsCompanyFind = (params?: any) => {
  return customHttp.get({
    url: baseUrl + '/company/find',
    params,
  });
};
