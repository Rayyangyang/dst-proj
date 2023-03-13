import { defHttp } from '/@/utils/http/axios';

enum Api {
  SearchServiceCategory = '/3/dst-ooc-base-server/service/category/list',
  addressList = '/0/dst-mgt-account-server/addressBook/page',
  addAddressBook = '/0/dst-mgt-account-server/addressBook/addAddrBook',
  delAddressBook = '/0/dst-mgt-account-server/addressBook/deleted',
  ShopInfo = '/3/dst-ooc-base-server/shop/detail',
  OrderList = '/3/dst-ooc-contract-server/order/page',
  CaragTree = '/0/dst-mgt-account-server/carag/getCaragTree',
  OrderInfo = '/3/dst-ooc-contract-server/order/detail',
  AddOrder = '/3/dst-ooc-contract-server/order/add',
  orderTemp = '/0/dst-mgt-account-server/import/template/download',
  importOrderTemp = '/3/dst-ooc-contract-server/import/order',
  orderSign = '/3/dst-ooc-contract-server/order/signIn',
  exportOrder = '/3/dst-ooc-contract-server/order/page',
  orderListItem = '/3/dst-ooc-base-server/fieldShow/getList',
  editOrderListItem = '/3/dst-ooc-base-server/fieldShow/insert',
  cancelOrder = '/3/dst-ooc-contract-server/order/cancel',
  editOrder = '/3/dst-ooc-contract-server/order/edit',
  exportOrderRecordList = '/3/dst-ooc-base-server/exportRecord/page',
  editAddressBook = '/0/dst-mgt-account-server/addressBook/edit',
}

/**
 * @description: 服务类别
 */

export function searchServiceCategoryApi(params: any) {
  return defHttp.get({
    url: Api.SearchServiceCategory,
    params,
  });
}

/**
 * @description: 地址簿list
 */
export function getAddressListApi(params?: any) {
  return defHttp.get({
    url: Api.addressList,
    params,
  });
}

/**
 * @description: 地址簿新增
 */
export function addAddressListApi(params?: any) {
  return defHttp.post({
    url: Api.addAddressBook,
    params,
  });
}
/**
 * @description: 地址簿编辑
 */
export function editAddressListApi(params?: any) {
  return defHttp.post({
    url: Api.editAddressBook,
    params,
  });
}

/**
 * @description: 删除簿新增
 */
export function delAddressBookApi(params: any) {
  console.log('params', params)
  return defHttp.post({
    url: `${Api.delAddressBook}?id=${params}`,
  });
}

/**
 * @description: 查询门店详情
 */
export function getShopInfoApi(params: any) {
  return defHttp.get({
    url: `${Api.ShopInfo}?id=${params}`,
  });
}
/**
 * @description: 门店列表
 */
export function getOrderListApi(params: any) {
  return defHttp.post({
    url: Api.OrderList,
    params
  });
}
/**
 * @description: 承运商 
 */
export function getCaragTreeApi() {
  return defHttp.get({
    url: Api.CaragTree,
  });
}

/**
 * @description: 订单详情 
 */
export function getOrderInfoApi(id) {
  return defHttp.get({
    url: `${Api.OrderInfo}?id=${id}`,
  });
}
/**
 * @description: 新增订单
 */
export function addNewOrderApi(params) {
  return defHttp.post({
    url: Api.AddOrder,
    params,
  });
}
/**
 * @description: 订单模板下载 
 */
export function downOrderTempApi() {
  return defHttp.get({
    url: `${Api.orderTemp}?id=1`,
  });
}
/**
 * @description: 订单模板导入
 */
export function importOrderTempApi(params) {
  return defHttp.post({
    url: Api.importOrderTemp,
    params,
  });
}
/**
 * @description: 订单签收
 */
export function orderSignApi(params) {
  return defHttp.post({
    url: Api.orderSign,
    params,
  });
}
/**
 * @description: 订单导出
 */
export function exportOrderApi(params) {
  return defHttp.post({
    url: `${Api.exportOrder}?export=true`,
    params
  });
}
/**
 * @description: 订单列表字段
 */
export function getOrderListItem() {
  return defHttp.get({
    url: `${Api.orderListItem}?module=1`,
  });
}
/**
 * @description: 修改订单列表字段
 */
export function editOrderListItem(params) {
  return defHttp.post({
    url: Api.editOrderListItem,
    params,
  });
}
/**
 * @description: 取消订单
 */
export function cancelOrderApi(params) {
  return defHttp.post({
    url: Api.cancelOrder,
    params,
  });
}
/**
 * @description: 编辑订单
 */
export function editOrderApi(params) {
  return defHttp.post({
    url: Api.editOrder,
    params,
  });
}
/**
 * @description: 订单导出记录
 */
export function orderRecordListApi(params) {
  return defHttp.post({
    url: Api.exportOrderRecordList,
    params,
  });
}
