import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form/index';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const basicColumnsAction = {
  width: 300,
  title: '操作',
  dataIndex: 'action',
  slots: { customRender: 'action' },
};

export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
    },
    {
      title: '账号名称',
      dataIndex: 'accountName',
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      width: 150,
    },
    {
      title: '登录手机号',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: '员工状态',
      dataIndex: 'positionStatus',
      width: 150,
      customRender: ({ record }) => {
        const status = record.positionStatus;
        const enable = ~~status === 1;
        const color = enable ? 'green' : 'red';
        const text = enable ? '在职' : '离职';
        return h(Tag, { color: color }, () => text);
      },
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      width: 150,
    },
    {
      title: '归属门店',
      dataIndex: 'shopName',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    labelAlign: 'left',
    schemas: [
      {
        field: `accountName`,
        label: `账号名称`,
        component: 'Input',
        componentProps: {
          placeholder: '请输入账号名称',
          maxlength: 100,
        },
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
      {
        field: `phone`,
        label: `登录手机号`,
        component: 'Input',
        slot: 'customMobile',
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
      {
        field: `positionStatus`,
        label: `员工状态`,
        component: 'Select',
        componentProps: {
          options: [
            {
              label: '在职',
              value: '1',
            },
            {
              label: '离职',
              value: '0',
            },
          ],
        },
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
      {
        field: 'shopName',
        component: 'Input',
        label: '归属门店',
        slot: 'remoteSearch',
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
    ],
  };
}

// 新增类别表单配置
export const schemasCategoryAdd: FormSchema[] = [
  {
    field: 'type',
    component: 'Select',
    slot: 'customSlot',
    label: '服务类型',
    colProps: {
      span: 24,
    },
    rules: [{ required: true, message: '请选择服务类型' }],
  },
  {
    field: 'name',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    label: '失败类型',
    colProps: {
      span: 24,
    },
    rules: [{ required: true, whitespace: true, message: '请输入失败类型' }],
  },
  {
    field: 'status',
    component: 'Select',
    label: '状态',
    componentProps: {
      options: [
        {
          label: '启用',
          value: '1',
          key: '1',
        },
        {
          label: '禁用',
          value: '0',
          key: '0',
        },
      ],
    },
    colProps: {
      span: 24,
    },
    rules: [{ required: true, message: '请选择状态' }],
  },
];
