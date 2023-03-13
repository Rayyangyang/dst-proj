import { DescItem } from '/@/components/Description/index';

interface schemaItem extends DescItem {
  slot?: any;
}

// 基本信息
export function schemaBasic(): schemaItem[] {
  return [
    {
      field: 'contractName',
      label: '合同名称',
    },
    {
      field: 'externalContractCode',
      label: '外部合同编码',
    },
    {
      field: 'statusName',
      label: '合同状态',
    },
    {
      field: 'validityDate',
      label: '合同有效期',
    },
    {
      field: 'signDate',
      label: '签订日期',
    },
    {
      field: 'typeName',
      label: '合同类别',
    },
    {
      field: 'contractCode',
      label: '合同编码',
    },
    {
      field: 'oldContractCode',
      label: '源合同编码',
    },
    {
      field: 'creatorName',
      label: '创建人',
    },
    {
      field: 'shopName',
      label: '归属门店',
    },
    {
      field: 'createTime',
      label: '创建时间',
    },
  ];
}

// 甲乙双方
export function schemaBothSides(): schemaItem[] {
  return [
    {
      field: 'partyAName',
      label: '甲方',
    },
    {
      field: 'partyBName',
      label: '乙方',
    },

    {
      field: 'partyAPhone',
      label: '电话',
    },
    {
      field: 'partyBPhone',
      label: '电话',
    },

    {
      field: 'partyAProvincesName',
      label: '省市区',
    },
    {
      field: 'partyBProvincesName',
      label: '省市区',
    },

    {
      field: 'partyAAddress',
      label: '详细地址',
    },
    {
      field: 'partyBAddress',
      label: '详细地址',
    },

    {
      field: 'partyAContact',
      label: '经办人',
    },
    {
      field: 'partyBContact',
      label: '经办人',
    },

    {
      field: 'partyAMobile',
      label: '手机号码',
    },
    {
      field: 'partyBMobile',
      label: '手机号码',
    },
  ];
}

// 发票条款
export function schemaDrawnClause(): schemaItem[] {
  return [
    {
      field: 'invoiceTypeName',
      label: '发票类型',
    },
    {
      field: 'taxRate',
      label: '税率',
    },
  ];
}

// 结算信息
export function schemaBillingInfo(): schemaItem[] {
  return [
    {
      field: 'billingCycleTypeName',
      label: '周期类型',
    },
    {
      field: 'billingCycle',
      label: '账款周期',
    },
    {
      field: 'billingDate',
      label: '账单出具日',
    },
    {
      field: 'invoiceDate',
      label: '账单开票日',
    },
    {
      field: 'receiptDateName',
      label: '最迟收款日',
    },
    {
      field: 'clearingFormName',
      label: '结算方式',
    },
  ];
}

// 附件
export function schemaAccessory(): schemaItem[] {
  return [
    {
      field: 'businessAttachments',
      label: '纸质合同',
      slot: 'businessAttachments',
    },
  ];
}

// 合同路线 列
export const TableColumn = [
  {
    title: '线路编码',
    dataIndex: 'routeCode',
    key: 'routeCode',
  },
  {
    title: '线路名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '外部线路编码',
    dataIndex: 'externalRouteCode',
    key: 'externalRouteCode',
  },
  {
    title: '运营城市',
    key: 'cityName',
    dataIndex: 'cityName',
  },
  {
    title: '出发地',
    key: 'startName',
    dataIndex: 'startName',
  },
  {
    title: '到达地',
    key: 'endName',
    dataIndex: 'endName',
  },
];
