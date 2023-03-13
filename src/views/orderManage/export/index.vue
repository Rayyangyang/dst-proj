<template>
  <div>
    <BasicTable :showIndexColumn="false" @register="registerTable" @change="handleTableChange">
      <template #form-customType="{ model, field }">
        <a-select ref="select" v-model:value="model[field]" allowClear placeholder="请选择">
          <a-select-option v-for="(item, index) in typeOptions" :key="index" :value="item.value">{{
            item.label
          }}</a-select-option>
        </a-select>
      </template>
      <template #idSlot="{ record }">
        <p @click="downLoadFile(record)" class="id-style">{{ record.fileName }}</p>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getTableColumns, getFormConfig } from './tableData';
  import { actionsSyslogPage } from '/@/api/settings/log';
  import { Select } from 'ant-design-vue';
  import { orderRecordListApi } from '/@/api/orderManage/orderManage';
  interface TypeItem {
    label: string;
    value: number;
  }

  const ASelect = Select;
  const ASelectOption = Select.Option;

  const typeOptions = ref<Array<TypeItem>>([
    {
      label: '待处理',
      value: 0,
    },
    {
      label: '处理中',
      value: 1,
    },
    {
      label: '处理完成',
      value: 2,
    },
    {
      label: '处理失败',
      value: 3,
    },
  ]);

  const listData = ref<Array<Recordable>>([]);

  const [registerTable, { getForm, setTableData, setLoading, getPaginationRef, setPagination }] =
    useTable({
      dataSource: listData,
      useSearchForm: true,
      columns: getTableColumns(),
      showIndexColumn: true,
      formConfig: {
        ...getFormConfig(),
        submitFunc: customSubmitFunc,
      },
    });

  async function getList() {
    try {
      // @ts-ignore
      const { current, pageSize } = getPaginationRef();
      const formVo = getForm().getFieldsValue();
      console.log(111, formVo);
      const paramsVo: any = {
        pageNum: current,
        pageSize,
        ...formVo,
      };

      setLoading(true);
      const data = await orderRecordListApi(paramsVo);
      console.log(9999, data);
      listData.value = data.list;

      setPagination({
        total: data.totalNum,
      });

      setTableData(listData.value as any);
    } finally {
      setLoading(false);
    }
  }

  async function customSubmitFunc() {
    setPagination({
      current: 1,
      pageSize: 10,
    });

    getList();
  }

  // 表格改变事件
  async function handleTableChange() {
    getList();
  }

  // 文件下载

  const downLoadFile = (val) => {
    window.open(val?.fileUrl);
  };

  onMounted(() => {
    getList();
  });
</script>
<style lang="less" scoped>
  .link {
    color: @primary-color;
    text-decoration: underline;
    cursor: pointer;
  }
  .id-style {
    border-bottom: 1px solid #19C280;
    color: #19C280;
    cursor: pointer;
    width: fit-content;
    letter-spacing: 1px;
  }
</style>
