import { Description, DescItem, useDescription } from '/@/components/Description/index';
interface schemaItem extends DescItem {
  slot?: any;
}

export function schemaBasic(): schemaItem[] {
  return [
    {
      field: 'id',
      label: 'ID',
    },
    {
      field: 'entryTime',
      label: '入职时间',
    },
    {
      field: 'shopName',
      label: '归属门店',
    },
    {
      field: 'position',
      label: '职务',
    },
    {
      field: 'companyName',
      label: '公司名称',
    },
  ];
}

export function schemaPermission(): schemaItem[] {
  return [
    {
      field: 'roleName',
      label: '角色',
    },
    {
      field: 'dataPermission',
      label: '数据权限',
    },
  ];
}
