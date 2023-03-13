export const Columns = [
  {
    title: '序号',
    dataIndex: 'order',
    fixed: 'left',
    resizable: true,
    align: 'left',
    width: 50,
  },
  {
    title: '线路编码',
    dataIndex: 'routeCode',
    slots: { customRender: 'idSlot' },
    resizable: true,
    align: 'left',
    width: 200,
  },
  {
    title: '线路名称',
    resizable: true,
    align: 'left',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '外部线路编码',
    resizable: true,
    align: 'left',
    width: 100,
    dataIndex: 'externalRouteCode',
  },
  {
    title: '运营城市',
    align: 'left',
    resizable: true,
    dataIndex: 'startingCityName',
    width: 150,
  },
  {
    title: '出发地',
    resizable: true,
    align: 'left',
    dataIndex: 'roleName',
    width: 150,
  },
  {
    title: '到达地',
    align: 'left',
    resizable: true,
    dataIndex: 'arriveName',
    width: 150,
  },
  {
    title: '创建人',
    align: 'left',
    resizable: true,
    dataIndex: 'creatorName',
    width: 150,
  },
  {
    title: '创建日期',
    align: 'left',
    resizable: true,
    dataIndex: 'createTime',
    width: 150,
  },
];
export const Schemas = [
  {
    field: 'name',
    component: 'Input',
    label: '线路名称',
    colProps: {
      xl: 8,
      xxl: 6,
    },
    componentProps: {
      maxlength: 100,
      placeholder: '请输入线路名称',
    },
  },
  {
    field: 'routeCode',
    component: 'Input',
    label: '线路编码',
    componentProps: {
      maxlength: 100,
      placeholder: '请输入线路编码',
    },
    colProps: {
      xl: 8,
      xxl: 6,
    },
  },
  {
    field: `city`,
    label: '运营城市',
    component: 'Select',
    slot: 'remoteSearch',
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
