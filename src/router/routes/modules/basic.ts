import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const BasicInfo: AppRouteModule = {
  path: '/basic-info',
  name: 'BasicInfo',
  component: LAYOUT,
  meta: {
    orderNo: 1,
    title: '基础信息',
    permissionValue: 'ooc:basic',
  },
  children: [
    {
      path: 'outlet',
      name: 'BasicOutletPage',
      component: () => import('/@/views/basic/outlet/index.vue'),
      meta: {
        title: '门店管理',
        hideChildrenInMenu: true,
        permissionValue: 'ooc:basic:shop',
      },
      children: [
        {
          path: 'add',
          name: 'BasicOutletAdd',
          component: () => import('/@/views/basic/outlet/add.vue'),
          meta: {
            title: '门店新增',
            hideMenu: true,
          },
        },
      ],
    },

    {
      path: 'service-category',
      name: 'BasicServiceCategory',
      component: () => import('/@/views/basic/serviceCategory/index.vue'),
      meta: {
        title: '服务类别管理',
        permissionValue: 'ooc:basic:serviceCategory',
      },
    },
    {
      path: 'service-fail',
      name: 'BasicServiceFail',
      component: () => import('/@/views/basic/serviceFail/index.vue'),
      meta: {
        title: '服务失败类型',
        permissionValue: 'ooc:basic:serviceFailType',
      },
    },
  ],
};

export default BasicInfo;
