import { DescItem } from '/@/components/Description/index';

interface schemaItem extends DescItem{
  slot?:any
}

export const basicSchema: schemaItem[] = [
  {
    field: 'id',
    label: 'ID',
  },
  {
    field: 'position',
    label: '职务',
  },
  {
    field: 'entryTime',
    label: '入职时间',
  },
  {
    field: 'educationTypeName',
    label: '学历',
  },
  {
    field: 'contractStartTime',
    label: '合同开始时间',
  },
  {
    field:'shopName',
    label: '归属门店',
  },
  {
    field: 'contractEndTime',
    label: '合同结束时间',
  },
  {
    field: 'emergencyContactName',
    label: '紧急联系人姓名',
  },
  {
    field: 'residenceAddr',
    label: '居住地',
  },
  {
    field: 'emergencyContactPhone',
    label: '紧急联系人电话',
  },
  {
    field: 'creatorName',
    label: '创建人',
  },
  {
    field: 'email',
    label: '邮箱',
  },
  {
    field: 'createTime',
    label: '创建时间',
  },
  {
    field: 'remarks',
    label: '备注',
  },
  
];

export const identitySchema: schemaItem[] = [
  {
    field: 'userName',
    label: '姓名',
  },
  {
    field: 'sexName',
    label: '性别',
  },
  {
    field: 'idCard',
    label: '身份证号'
  },
  {
    field: 'birthTime',
    label: '出生日期',
  },
  {
    field: 'portraitFaceUrl',
    label: '身份证正面',
    slot:'identityFront'
  },
  {
    field: 'emblemFaceUrl',
    label: '身份证反面',
    slot:'identityBack'
  },
]

export const permissionSchema: DescItem[] = [
  {
    field: 'roleName',
    label: '角色',
  },
  {
    field: 'dataPermission',
    label: '数据权限',
  },
]