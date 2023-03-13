import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      slots: { customRender: 'idSlot' },
    },
    {
      title: '处理状态',
      dataIndex: 'statusName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `fileName`,
        label: `文件名称`,
        component: 'Input',
        componentProps: {
          placeholder: '请输入文件名称',
        },
        colProps: {
          span: 8,
        },
      },
      {
        field: `status`,
        label: `处理状态`,
        component: 'Select',
        slot: 'customType',
        colProps: {
          span: 8,
        },
      },
    ],
  };
}
