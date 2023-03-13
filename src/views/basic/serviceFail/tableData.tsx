import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { FormSchema } from '/@/components/Form/index';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const basicColumnsAction =  {
  width: 250,
  title: '操作',
  dataIndex: 'action',
  slots: { customRender: 'action' }
}

export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'bizIdName',
      width: 200,
    },
    {
      title: '失败类型',
      dataIndex: 'failTypeName',
      width: 150,
    },
    {
      title: '服务类型',
      dataIndex: 'serviceTypeName',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      width: 150,
      customRender: ({ record }) => {
        const status = record.status;
        const enable = ~~status === 1;
        const color = enable ? 'green' : 'red';
        const text = enable ? '启用' : '禁用';
        return h(Tag, { color: color }, () => text);
      },
    },
    {
      title: '创建人',
      dataIndex: 'creatorName',
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
    schemas: [
      {
        field: `failTypeName`,
        label: `失败类型`,
        component: 'Input',
        componentProps: {
          placeholder: '请输入失败类型',
        },
        colProps: {
          span: 8,
        },
      },
      {
        field: `serviceType`,
        label: `服务类型`,
        component: 'Select',
        slot: 'customType',
        colProps: {
          span: 8,
        },
      },
      {
        field: `status`,
        label: `状态`,
        component: 'Select',
        colProps: {
          span: 8,
        },
        componentProps: {
          options: [
            {
              label: '启用',
              value: 1,
            },
            {
              label: '禁用',
              value: 0,
            },
          ],
        },
      }
    ],
  };
}

// 新增类别表单配置
export function schemasCategoryAdd():FormSchema[]  {
  return [
    {
      field: 'serviceType',
      component: 'Select',
      slot: 'customType',
      label: '服务类型',
      colProps: {
        span: 24,
      },

      rules: [{ required: true,message:'请选择服务类型' }]
    },
    {
      field: 'failTypeName',
      component: 'Input',
      componentProps: {
        placeholder:'请输入',
        maxlength:50
      },
      label: '失败类型',
      colProps: {
        span: 24,
      },
      rules: [
        { required: true,message:'请输入失败类型'},
        { pattern:/^[\a-\z\A-\Z0-9\u4E00-\u9FA5]+$/gi,message:'请输入汉字，字母，数字',trigger:'blur' }
      ]
    },
    {
      field: 'status',
      component: 'Select',
      label: '状态',
      defaultValue: '1',
      componentProps: {
        options: [
          {
            label: '启用',
            value: '1',
          },
          {
            label: '禁用',
            value: '0',
          },
        ],
      },
      colProps: {
        span: 24,
      },
      rules: [{ required: true,message:'请选择状态' }]
    },
  ]
}