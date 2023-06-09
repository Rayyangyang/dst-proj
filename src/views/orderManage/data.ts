export const showItemList = [
  {
    value: '门店名称',
    key: 'shopName',
  },
  {
    value: '服务类型',
    key: 'serviceType',
  },
  {
    value: '服务类别',
    key: 'serviceCategoryId',
  },
  {
    value: '合同名称',
    key: 'contractName',
  },
  {
    value: '线路名称',
    key: 'routeName',
  },
  {
    value: '货物总重量',
    key: 'cargoWeight',
  },
  {
    value: '货物总体积',
    key: 'cargoVolume',
  },
  {
    value: '发货城市',
    key: 'sendCityName',
  },
  {
    value: '货物总金额',
    key: 'cargoMoney',
  },
  {
    value: '含税金额',
    key: 'cargoTaxMoney',
  },
  {
    value: '不含税金额',
    key: 'cargoNotTaxMoney',
  },
  {
    value: '税金',
    key: 'taxMoney',
  },
  {
    value: '发货地址',
    key: 'orderSendAddress',
  },
  {
    value: '收货地址',
    key: 'orderReceiveAddress',
  },
  {
    value: '收货人姓名',
    key: 'receiveName',
  },
  {
    value: '收货人电话',
    key: 'receivePhone',
  },
  {
    value: '发车时间',
    key: 'startTime',
  },
  {
    value: '送达时间',
    key: 'endTime',
  },
  {
    value: '签收时间',
    key: '',
  },
  {
    value: '运单号',
    key: '1',
  },
  {
    value: '车牌号',
    key: 'carNumber',
  },
  {
    value: '司机姓名',
    key: '2',
  },
  {
    value: '司机电话',
    key: '3',
  },
  {
    value: '外部订单号',
    key: 'externalOrderCode',
  },
  {
    value: '创建时间',
    key: 'createTime',
  },
];

export const Columns = [
  {
    title: '订单号',
    dataIndex: 'orderCode',
    selfKey: 'orderCode',
    resizable: true,
    slots: { customRender: 'idSlot' },
    align: 'left',
    fixed: 'left',
    type: 'basemenu',
    width: 200,
  },
  {
    title: '订单状态',
    dataIndex: 'statusName',
    selfKey: 'status',
    resizable: true,
    align: 'left',
    fixed: 'left',
    type: 'basemenu',
    width: 100,
  },
  {
    title: '门店名称',
    dataIndex: 'shopName',
    selfKey: 'shopName',
    resizable: true,
    align: 'left',
    width: 200,
  },
  {
    title: '服务类型',
    resizable: true,
    align: 'left',
    dataIndex: 'serviceTypeName',
    selfKey: 'serviceType',
    width: 150,
  },
  {
    title: '服务类别',
    resizable: true,
    align: 'left',
    width: 100,
    dataIndex: 'serviceCategoryName',
    selfKey: 'serviceCategoryId',
  },
  {
    title: '合同名称',
    align: 'left',
    resizable: true,
    dataIndex: 'contractName',
    selfKey: 'contractName',
    width: 150,
  },
  {
    title: '线路名称',
    resizable: true,
    align: 'left',
    dataIndex: 'routeName',
    selfKey: 'routeName',
    width: 150,
  },
  {
    title: '货物总重量',
    align: 'left',
    resizable: true,
    dataIndex: 'cargoWeight',
    selfKey: 'cargoWeight',
    width: 150,
  },
  {
    title: '货物总体积',
    align: 'left',
    resizable: true,
    dataIndex: 'cargoVolume',
    selfKey: 'cargoVolume',
    width: 150,
  },
  {
    title: '发货城市',
    align: 'left',
    resizable: true,
    dataIndex: 'sendCityName',
    selfKey: 'sendCityName',
    width: 150,
  },

  {
    title: '货物总金额',
    align: 'left',
    resizable: true,
    dataIndex: 'cargoMoney',
    selfKey: 'cargoMoney',
    width: 150,
  },
  {
    title: '含税金额',
    align: 'left',
    resizable: true,
    dataIndex: 'cargoTaxMoney',
    selfKey: 'cargoTaxMoney',
    width: 150,
  },
  {
    title: '不含税金额',
    align: 'left',
    resizable: true,
    dataIndex: 'cargoNotTaxMoney',
    selfKey: 'cargoNotTaxMoney',
    width: 150,
  },
  {
    title: '税金',
    align: 'left',
    resizable: true,
    dataIndex: 'taxMoney',
    selfKey: 'taxMoney',
    width: 150,
  },
  {
    title: '发货地址',
    align: 'left',
    resizable: true,
    dataIndex: 'orderSendAddress',
    selfKey: 'orderSendAddress',
    width: 150,
  },
  {
    title: '收货地址',
    align: 'left',
    resizable: true,
    dataIndex: 'orderReceiveAddress',
    selfKey: 'orderReceiveAddress',
    width: 150,
  },
  {
    title: '收货人姓名',
    align: 'left',
    resizable: true,
    dataIndex: 'receiveName',
    selfKey: 'receiveName',
    width: 150,
  },
  {
    title: '收货人电话',
    align: 'left',
    resizable: true,
    dataIndex: 'receivePhone',
    selfKey: 'receivePhone',
    width: 150,
  },
  {
    title: '发车时间',
    align: 'left',
    resizable: true,
    dataIndex: 'startTime',
    selfKey: 'startTime',
    width: 150,
  },
  {
    title: '送达时间',
    align: 'left',
    resizable: true,
    dataIndex: 'endTime',
    selfKey: 'endTime',
    width: 150,
  },
  {
    title: '外部订单号',
    align: 'left',
    resizable: true,
    dataIndex: 'externalOrderCode',
    selfKey: 'externalOrderCode',
    width: 150,
  },
  {
    title: '创建时间',
    align: 'left',
    resizable: true,
    dataIndex: 'createTime',
    selfKey: 'createTime',
    width: 150,
  },
];
