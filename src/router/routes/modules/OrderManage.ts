import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const OrderManage: AppRouteModule = {
  path: '/orderManage',
  name: 'OrderManage',
  component: LAYOUT,
  meta: {
    orderNo: 600,
    title: '订单管理',
    permissionValue: 'ooc:order',
  },
  children: [
    {
      path: 'orderList',
      name: 'OrderList',
      component: () => import('/@/views/orderManage/OrderList.vue'),
      meta: {
        title: '订单列表',
        hideChildrenInMenu: true,
        permissionValue: 'ooc:order:list',
      },
      children: [
        {
          path: 'addNewOrder',
          name: 'AddNeworder',
          component: () => import('/@/views/orderManage/AddNewOrder/Index.vue'),
          meta: {
            title: '新增订单',
            hideMenu: true,
          },
        },
        {
          path: 'editNewOrder',
          name: 'EditNeworder',
          component: () => import('/@/views/orderManage/AddNewOrder/Index.vue'),
          meta: {
            title: '编辑订单',
            hideMenu: true,
          },
        },
        {
          path: 'orderInfo',
          name: 'OrderInfo',
          component: () => import('/@/views/orderManage/orderInfo/index.vue'),
          meta: {
            title: '订单详情',
            hideMenu: true,
          },
        },
        {
          path: 'export',
          name: 'ExportPage',
          component: () => import('/@/views/orderManage/export/index.vue'),
          meta: {
            title: '导出记录',
            hideMenu: true,
            permissionValue: 'ooc:order:list',
          },
        },
      ],
    },
  ],
};

export default OrderManage;
