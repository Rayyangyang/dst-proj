<template>
  <div>
    <BasicTable :showIndexColumn="false" @register="registerTable" @change="handleTableChange">
      <template #form-customType="{ model, field }">
        <a-select ref="select" v-model:value="model[field]" allowClear placeholder="请选择">
          <a-select-option v-for="(item, index) in typeOptions" :key="index" :value="item.value">{{
            item.name
          }}</a-select-option>
        </a-select>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'type'"> {{ translateTypeName(record.type) }} </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getTableColumns, getFormConfig } from './tableData';
  import { actionsSyslogPage } from '/@/api/settings/log';
  import { getDictWithType } from '/@/api/common/dicts';
  import { Select } from 'ant-design-vue';

  interface TypeItem {
    name: string;
    value: string;
  }

  const ASelect = Select;
  const ASelectOption = Select.Option;

  const typeOptions = ref<Array<TypeItem>>([]);

  const listData = ref<Array<Recordable>>([]);

  const [registerTable, { getForm, setTableData, setLoading, getPaginationRef, setPagination }] =
    useTable({
      dataSource: listData,
      useSearchForm: true,
      columns: getTableColumns(),
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
      const paramsVo: any = {
        pageNum: current,
        pageSize,
        ...formVo,
      };

      if (formVo?.dateTime) {
        paramsVo.startTime = paramsVo.dateTime + ' 00:00:00';
        paramsVo.endTime = paramsVo.dateTime + ' 23:59:59';
      }

      setLoading(true);
      const data = await actionsSyslogPage(paramsVo);
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

  // 获取操作类型字典数据
  async function getDictData() {
    typeOptions.value = await getDictWithType(`sys_log_operation_type`);
  }

  // 根据id 翻译 操作类型名称
  const translateTypeName = (type: string) => {
    const findItem: TypeItem[] = unref(typeOptions).filter((item: TypeItem) => item.value === type);
    return findItem.length > 0 ? unref(findItem[0]).name : '';
  };

  onMounted(() => {
    getDictData();
    getList();
  });
</script>
