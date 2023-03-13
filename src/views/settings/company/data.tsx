import { Description, DescItem, useDescription } from '/@/components/Description/index';
interface schemaItem extends DescItem {
  slot?: any;
}

export function schemaCompany(): schemaItem[] {
  return [
    {
      field: 'businessLicenseUrl',
      label: '工商营业执照',
      slot: 'businessLicense',
    },
    {
      field: 'companyLogo',
      label: '企业logo',
      slot: 'logo',
    },
    {
      field: 'name',
      label: '企业名称',
    },
    {
      field: 'id',
      label: '企业ID',
    },
    {
      field: 'registerTime',
      label: '成立时间',
    },
    {
      field: 'enterpriseCreditCode',
      label: '统一社会信用代码',
    },
    {
      field: 'provinceName',
      label: '注册地省市区',
      slot: 'province',
    },
    {
      field: 'aaumTypeName',
      label: '企业类型',
    },
    {
      field: 'detailedAddress',
      label: '注册详细地址',
    },
    {
      field: 'businessDeadline',
      label: '营业期限至',
      slot: 'businessDeadline',
    },
    {
      field: 'createTime',
      label: '创建时间',
    },
  ];
}

export function schemaLegalPerson(): schemaItem[] {
  return [
    {
      field: 'portraitFaceUrl',
      label: (
              <div>
                <div>法人身份证</div>
                <div>（人像面）</div>
              </div>
            ),
      slot: 'portraitFace',
    },
    {
      field: 'emblemFaceUrl',
      label: (
              <div>
                <div>法人身份证</div>
                <div>（国徽面）</div>
              </div>
            ),
      slot: 'emblemFace',
    },
    {
      field: 'legalPerson',
      label: '姓名',
    },
    {
      field: 'nation',
      label: '民族',
    },
    {
      field: 'nationalityName',
      label: '国籍',
    },
    {
      field: 'birthTime',
      label: '出生年月日',
    },
    {
      field: 'identityValidityEndTime',
      label: '证件有效期',
      slot: 'identityValidityEndTime',
    },
    {
      field: 'issuingAuthority',
      label: '证件签发机关',
    },
    {
      field: 'identityCard',
      label: '身份证号',
    },
    {
      field: 'identityAddr',
      label: '住址',
    },
  ];
}
