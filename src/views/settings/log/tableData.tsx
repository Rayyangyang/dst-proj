import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
    },
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      width: 150,
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      width: 150,
    },
    {
      title: '内容',
      dataIndex: 'content',
      width: 150,
    },
    {
      title: '动作名称',
      dataIndex: 'operateName',
      width: 150,
    },
    {
      title: '动作uri',
      dataIndex: 'operateUri',
      width: 150,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      width: 150,
    },
    {
      title: '操作人',
      dataIndex: 'creatorName',
      width: 150,
    },
    {
      title: '操作时间',
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
        field: `menuName`,
        label: `菜单名称`,
        component: 'Input',
        componentProps: {
          placeholder: '请输入菜单名称',
        },
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
      {
        field: `type`,
        label: `操作类型`,
        component: 'Select',
        slot: 'customType',
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
      {
        field: `creatorName`,
        label: `操作人`,
        component: 'Input',
        componentProps: {
          placeholder: '请输入操作人',
        },
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
      {
        field: `dateTime`,
        label: `操作时间`,
        component: 'DatePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
        },
        colProps: {
          xl: 8,
          xxl: 6,
        },
      },
    ],
  };
}
