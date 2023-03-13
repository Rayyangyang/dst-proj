import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '角色名称',
      dataIndex: 'name',
      resizable: false,
      width:250
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      resizable: false,
    },
    {
      title: '级别',
      dataIndex: 'levelName',
      resizable: false,
    },
    {
      title: '角色描述',
      dataIndex: 'remarks',
      resizable: false,
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `name`,
        label: `角色名称`,
        component: 'Input',
        componentProps: {
          placeholder: '请输入角色名称',
          maxlength: 100,
        },
        colProps: {
          span: 8,
        },
      },
    ],
  };
}
