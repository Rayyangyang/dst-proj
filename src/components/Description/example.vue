<template>
  <div class="p-4">
    <Description
      title="基础示例"
      :collapseOptions="{ helpMessage: 'help me' }"
      :column="2"
      :bordered="false"
      :data="mockData"
      :schema="schema"
    >
      <template #custom-slot> 自定义插槽 </template>
    </Description>

    <Description
      title="基础示例-表格"
      :collapseOptions="{ helpMessage: 'help me' }"
      :bordered="false"
    >
      <template #action> 共 {{ []?.length }} 家 </template>
      <template #custom-content>
        <Table :columns="TableColumn" :data-source="[]" :pagination="false" />
      </template>
    </Description>

    <Description @register="register" class="mt-4" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Alert } from 'ant-design-vue';
  import { Description, DescItem, useDescription } from '/@/components/Description/index';

  const mockData: any = {
    username: 'test',
    nickName: 'VB',
    age: 123,
    phone: '15695909xxx',
    email: '190848757@qq.com',
    addr: '厦门市思明区',
    sex: '男',
    certy: '3504256199xxxxxxxxx',
    tag: 'orange',
    slot: 'do you try',
  };

  const schema: DescItem[] = [
    {
      field: 'username',
      label: '用户名',
    },
    {
      field: 'phone',
      label: '联系电话',
    },
    {
      field: 'email',
      label: '邮箱',
    },
    {
      field: 'addr',
      label: '地址',
    },
    {
      field: 'nickName',
      label: '昵称',
      render: (curVal, data) => {
        return `${data.username}-${curVal}`;
      },
    },
    {
      field: 'addr',
      label: '自定义slot',
      slot: 'custom-slot',
    },
  ];

  const TableColumn: any[] = [
    {
      title: '企业名称',
      dataIndex: 'routeCode',
      key: 'routeCode',
    },
    {
      title: '归属关系',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '运营状态',
      dataIndex: 'externalRouteCode',
      key: 'externalRouteCode',
    },
    {
      title: '合作开始时间',
      key: 'cityName',
      dataIndex: 'cityName',
    },
    {
      title: '合作结束时间',
      key: 'startName',
      dataIndex: 'startName',
    },
  ];

  export default defineComponent({
    components: { Description, Alert },
    setup() {
      const [register] = useDescription({
        title: 'useDescription',
        data: mockData,
        schema: schema,
        bordered: false,
        column: 2,
      });
      return { mockData, schema, register, TableColumn };
    },
  });
</script>
