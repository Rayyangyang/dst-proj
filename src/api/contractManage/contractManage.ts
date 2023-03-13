import { defHttp } from '/@/utils/http/axios';

enum Api {
  ContractList = '/3/dst-ooc-contract-server/contract/page',
  NewContract = '/3/dst-ooc-contract-server/contract/insert',
  ContractInfo = '/3/dst-ooc-contract-server/contract/find',
  BusinessInfo = '/0/dst-mgt-account-server/company/find',
  UploadContract = '/3/dst-ooc-contract-server/contract/update',
  findBusiness = '/0/dst-mgt-account-server/company/findCompanyName',
  FindShop = '/3/dst-ooc-base-server/shop/permission/list',
  UpdateContractTime = '/3/dst-ooc-contract-server/contract/updateDate',
  FindContractName = '/3/dst-ooc-contract-server/contract/findByName',
}

/**
 * @description: 合同列表
 */

export function getContractListApi(params: BusinessUserListParams) {
  return defHttp.post({
    url: Api.ContractList,
    params,
  });
}

/**
 * @description: 合同名称
 */

export function getContractNameApi(name, contractId) {
  return defHttp.get({
    url: `${Api.FindContractName}?name=${name}&shopId=${contractId}&status=1`,
  });
}

/**
 * @description: 根据id 获取企业信息
 */
export function getBusinessInfoApi(companyId) {
  return defHttp.get({
    url: `${Api.BusinessInfo}?companyId=${companyId}`,
  });
}


/**
 * @description: 根据id 获取合同信息
 */
 export function getContractInfoApi(contractId) {
  return defHttp.get({
    url: `${Api.ContractInfo}?contractId=${contractId}`,
  });
}

/**
 * @description: 查询企业
 */
export function findBusinessApi(companyName) {
  return defHttp.get({
    url: `${Api.findBusiness}?companyName=${companyName}`,
  });
}

/**
 * @description: 查询门店
 */
export function getShopInfo(shopName: string) {
  return defHttp.get({
    url: `${Api.FindShop}?shopName=${shopName}`,
  });
}

/**
 * @description: 新增合同
 */
export function addNewContractApi(params: any) {
  return defHttp.post({
    url: Api.NewContract,
    params,
  });
}
/**
 * @description: 更新企业
 */
export function uploadContractApi(params: NewBusinessApi) {
  return defHttp.post({
    url: Api.UploadContract,
    params,
  });
}
/**
 * @description: 更新企业
 */
export function uploadContractTimeApi(params) {
  return defHttp.post({
    url: Api.UpdateContractTime,
    params,
  });
}
