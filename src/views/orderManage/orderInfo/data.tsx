import { DescItem } from '/@/components/Description/index';

interface schemaItem extends DescItem {
  slot?: any;
}

// 基本信息
export function schemaBasic(): schemaItem[] {
  return [
    {
      field: 'orderCode',
      label: '订单号',
    },
    {
      field: 'orderStatusName',
      label: '订单状态',
    },
    {
      field: 'serviceTypeName',
      label: '服务类型',
    },
    {
      field: 'sendCityName',
      label: '发货城市',
    },
    {
      field: 'serviceCategoryName',
      label: '服务类别',
    },
    {
      field: 'shopName',
      label: '门店名称',
    },
    {
      field: 'externalOrderCode',
      label: '外部订单号',
    },
    {
      field: 'wareHouseName',
      label: '仓库名称',
    },
    {
      field: 'externalBarcode',
      label: '外部条码号',
    },
    {
      field: 'contractName',
      label: '合同名称',
    },
    {
      field: 'startTime',
      label: '发车时间',
    },
    {
      field: 'contractCode',
      label: '合同编码',
    },
    {
      field: 'endTime',
      label: '送达时间',
    },
    {
      field: 'routeName',
      label: '线路名称',
    },
    {
      field: 'creatorName',
      label: '创建人',
    },
    {
      field: 'routeCode',
      label: '线路编码',
    },
    {
      field: 'createTime',
      label: '创建时间',
    },
    {
      field: 'cancelTime',
      label: '取消时间',
    },
    {
      field: 'cancelRemark',
      label: '取消原因',
    },
    {
      field: 'signForTime',
      label: '签收时间',
    },
  ];
}

// 地址信息
export function schemaAddress(): schemaItem[] {
  return [
    {
      field: 'sendName',
      label: '发货人',
    },
    {
      field: 'receiveName',
      label: '收货人',
    },

    {
      field: 'sendPhone',
      label: '发货人电话',
    },
    {
      field: 'receivePhone',
      label: '收货人电话',
    },

    {
      field: 'sendAddress',
      label: '发货地址',
    },
    {
      field: 'receiveAddress',
      label: '收货地址',
    },
  ];
}

// 额外需求
export function schemaExtra(): schemaItem[] {
  return [
    {
      field: 'caragCompanyName',
      label: '指定承运商',
    },
    {
      field: 'spotNum',
      label: '串点数',
    },

    {
      field: 'kilometreNum',
      label: '公里数',
    },
    {
      field: 'freight',
      label: '运费',
    },

    {
      field: 'receiptFor',
      label: '回单要求',
      slot: 'customReceipt',
    },
  ];
}

// 配送/安装信息
export function schemaLogistic(): schemaItem[] {
  return [
    {
      field: 'caragCompanyName',
      label: '承运企业',
    },
    {
      field: 'carBrandNumber',
      label: '车牌号',
    },

    {
      field: 'branchName',
      label: '网点名称',
    },
    {
      field: 'carModelName',
      label: '车型',
    },

    {
      field: 'truckDuration',
      label: '装车时长',
    },
    {
      field: 'workerName',
      label: '师傅姓名',
    },
    {
      field: 'serveDuration',
      label: '服务时长',
    },

    {
      field: 'workerPhone',
      label: '师傅电话',
    },
    {
      field: 'remark',
      label: '异常报备',
    },
  ];
}

// 货物信息 列
export const TableColumn = [
  {
    title: '货物名称',
    dataIndex: 'cargoName',
  },
  {
    title: '货物系列',
    dataIndex: 'cargoCode',
  },
  {
    title: '数量',
    dataIndex: 'cargoNum',
  },
  {
    title: '重量(kg)',
    dataIndex: 'cargoWeight',
  },
  {
    title: '体积(m³)',
    dataIndex: 'cargoVolume',
  },
  {
    title: '货物金额',
    dataIndex: 'cargoMoney',
  },
  {
    title: '含税金额',
    dataIndex: 'cargoTaxMoney',
  },
  {
    title: '不含税金额',
    dataIndex: 'cargoNotTaxMoney',
  },
  {
    title: '税金',
    dataIndex: 'taxMoney',
  },
];
