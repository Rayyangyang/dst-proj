import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const basicColumnsAction = {
  width: 250,
  title: '操作',
  dataIndex: 'action',
  slots: { customRender: 'action' },
};

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '门店名称',
      dataIndex: 'shopName',
      width: 200,
    },
    {
      width: 100,
      title: '门店状态',
      dataIndex: 'statusName',
      customRender: ({ record }) => {
        const statusName = record.statusName;

        const color = statusName === '新纪录' ? 'default' : statusName === '启用' ? 'green' : 'red';

        const text = statusName;
        return h(Tag, { color: color }, () => text);
      },
    },
    {
      width: 100,
      title: '门店编码',
      dataIndex: 'shopCode',
    },
    {
      width: 100,
      title: '店长',
      dataIndex: 'ownerName',
    },
    {
      width: 140,
      title: '店长手机号',
      dataIndex: 'ownerPhone',
    },
    {
      width: 140,
      title: '门店电话',
      dataIndex: 'shopPhone',
    },
    {
      width: 100,
      title: '所在城市',
      dataIndex: 'cityName',
    },
    {
      width: 200,
      title: '门店地址',
      dataIndex: 'address',
    },
    {
      width: 160,
      title: '备注',
      dataIndex: 'remarks',
    },
    {
      width: 140,
      title: '创建人',
      dataIndex: 'creatorName',
    },
    {
      width: 140,
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    labelAlign: 'left',
    schemas: [
      {
        field: `storeName`,
        label: `门店名称`,
        component: 'Select',
        slot: 'customRemote',
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
      {
        field: `shopCode`,
        label: `门店编码`,
        component: 'Input',
        componentProps: {
          placeholder: '请输入门店编码',
          maxxlength: 100,
        },
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
      {
        field: `status`,
        label: `门店状态`,
        component: 'Select',
        slot: 'customStatus',
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
      {
        field: `cityCode`,
        label: `所在城市`,
        component: 'Select',
        slot: 'customCity',
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
      {
        field: 'datetime',
        label: '创建时间',
        component: 'RangePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
          placeholder: ['开始时间', '结束时间'],
        },
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
    ],
    fieldMapToTime: [['datetime', ['startCreateTime', 'endCreateTime'], 'YYYY-MM-DD']],
  };
}
