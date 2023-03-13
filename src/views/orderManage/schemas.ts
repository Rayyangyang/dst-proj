export const getSchemas = (statusDict, serviceTypes) => {
  return [
    {
      field: 'orderCode',
      component: 'Input',
      label: '订单号',
      colProps: {
        xl: 8,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入订单号',
        maxlength: 100,
      },
    },
    {
      field: 'status',
      component: 'Select',
      label: '订单状态',
      componentProps: {
        options: statusDict,
        fieldNames: { label: 'name', value: 'value' },
      },
      colProps: {
        xl: 8,
        xxl: 6,
      },
    },
    {
      field: `receiveName`,
      label: '收货人姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入收货人姓名',
        maxlength: 5,
      },
      colProps: {
        xl: 8,
        xxl: 6,
      },
    },
    {
      field: 'receivePhone',
      component: 'Input',
      label: '收货人电话',
      colProps: {
        xl: 8,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入收货人电话',
        maxlength: 12,
      },
    },
    {
      field: 'shopName',
      component: 'Select',
      label: '门店名称',
      slot: 'remoteSearch',
      colProps: {
        xl: 8,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入门店名称',
        maxlength: 100,
      },
    },
    {
      field: 'routeName',
      component: 'Input',
      label: '线路名称',
      slot: 'remoteSearchRoute',
      colProps: {
        xl: 8,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入线路名称',
        maxlength: 100,
      },
    },
    {
      field: 'serviceType',
      component: 'Select',
      label: '服务类型',
      colProps: {
        xl: 8,
        xxl: 6,
      },
      componentProps: {
        options: serviceTypes,
        placeholder: '请输入服务类型',
        fieldNames: { label: 'name', value: 'value' },
      },
    },
    {
      field: 'serviceCategoryId',
      component: 'Input',
      label: '服务类别',
      slot: 'remoteSearchServiceCategory',
      colProps: {
        xl: 8,
        xxl: 6,
      },
      componentProps: {
        placeholder: '请输入服务类别',
        maxlength: 100,
      },
    },
    {
      field: 'startTime',
      component: 'RangePicker',
      label: '发车时间',
      colProps: {
        xl: 8,
        xxl: 6,
      },
    },
    {
      field: 'endTime',
      component: 'RangePicker',
      label: '送达时间',
      colProps: {
        xl: 8,
        xxl: 6,
      },
    },
    {
      field: 'createTime',
      component: 'RangePicker',
      label: '创建时间',
      colProps: {
        xl: 8,
        xxl: 6,
      },
    },
  ];
};
