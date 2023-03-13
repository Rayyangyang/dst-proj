<template>
  <div>
    <BasicTable :showIndexColumn="false" @register="registerTable" @change="handleTableChange">
      <template #form-customRemote="{ model, field }">
        <a-select
          v-model:value="model[field]"
          label-in-value
          placeholder="请输入门店名称"
          style="width: 100%"
          :filter-option="false"
          allowClear
          show-search
          :fieldNames="{ label: 'shopName', value: 'id' }"
          :not-found-content="fetching ? undefined : null"
          :options="companyData"
          @search="handleSearch"
        >
          <template v-if="fetching" #notFoundContent>
            <Spin size="small" />
          </template>
        </a-select>
      </template>

      <template #form-customStatus="{ model, field }">
        <a-select
          v-model:value="model[field]"
          placeholder="请选择"
          :options="statusData"
          :fieldNames="fieldNames"
          allowClear
        />
      </template>

      <template #form-customCity="{ model, field }">
        <a-select
          v-model:value="model[field]"
          placeholder="请选择"
          :options="cityData"
          :fieldNames="{ label: 'cityName', value: 'cityCode' }"
          allowClear
        />
      </template>

      <template #bodyCell="{ column }">
        <template v-if="column.key === 'type'"> {{ column.key }} </template>
      </template>

      <template #tableTitle v-if="hasPermission(outletManageEnum.OUTLET_ADD)">
        <a-button type="primary" @click="handleAdd()">新增门店</a-button>
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              ifShow: () => {
                return hasPermission(outletManageEnum.OUTLET_EDIT);
              },
            },
            {
              label: '确认',
              onClick: handleConfirm.bind(null, record),
              ifShow: () => {
                return record.status === 0 && hasPermission(outletManageEnum.OUTLET_STATUS_SWITCH);
              },
            },
            {
              label: '禁用',
              onClick: handleOperateStatus.bind(null, record),
              ifShow: () => {
                return record.status === 1 && hasPermission(outletManageEnum.OUTLET_STATUS_SWITCH);
              },
            },
            {
              label: '启用',
              onClick: handleOperateStatus.bind(null, record),
              ifShow: () => {
                return record.status === 2 && hasPermission(outletManageEnum.OUTLET_STATUS_SWITCH);
              },
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, createVNode } from 'vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getBasicColumns, getFormConfig, basicColumnsAction } from './tableData';
  import { outletManageEnum } from '/@/assets/permission/basic';

  import { Select, Modal, Spin } from 'ant-design-vue';
  import { debounce } from 'lodash-es';
  import { useRouter } from 'vue-router';

  import {
    actionQueryShopCity,
    actionShopPage,
    actionShopStatusChange,
    actionQueryShopList,
  } from '/@/api/basic/outlet';
  import { getDictWithType } from '/@/api/common/dicts';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';

  enum OperateEnums {
    ADD = 'add',
    EDIT = 'edit',
    CONFIRM = 'confirm',
    ENABLE = 'enable',
    DISABLE = 'disable',
  }

  enum ShopStatus {
    NEW = '0',
    ENABLE = '1',
    DISABLE = '2',
  }

  const fieldNames = {
    label: 'name',
    value: 'value',
  };

  const ASelect = Select;
  const ASelectOption = Select.Option;

  const fetching = ref<boolean>(false);
  const statusData = ref<Array<any>>([]); // 门店状态 数据
  const cityData = ref<Array<any>>([]); // 城市 数据

  let companyData = ref<Array<any>>([]); // 企业数据
  let listData = ref<Array<Recordable>>([]); // 列表 数据
  const { hasPermission } = usePermission();

  const { createMessage } = useMessage();

  const { push } = useRouter();
  const [registerTable, { getForm, setTableData, setLoading, getPaginationRef, setPagination }] =
    useTable({
      dataSource: listData,
      useSearchForm: true,
      columns: getBasicColumns(),
      showIndexColumn: true,
      formConfig: {
        ...getFormConfig(),
        submitFunc: customSubmitFunc,
      },
      actionColumn: basicColumnsAction,
    });

  async function getList() {
    try {
      // @ts-ignore
      const { current, pageSize } = getPaginationRef();
      const formVo = { ...getForm().getFieldsValue() };

      if (formVo?.startCreateTime || formVo?.endCreateTime) {
        formVo.startCreateTime = formVo.startCreateTime + ' 00:00:00';
        formVo.endCreateTime = formVo.endCreateTime + ' 23:59:59';
      }

      if (formVo.storeName) {
        formVo.shopName = formVo.storeName?.label || '';
      }

      const paramsVo: any = {
        pageNum: current,
        pageSize,
        ...formVo,
      };

      setLoading(true);
      const data = await actionShopPage(paramsVo);
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

  // 新增 门店
  const handleAdd = (): void => {
    push({
      path: '/basic-info/outlet/add',
    });
  };

  //  编辑 门店
  const handleEdit = (data?: any): void => {
    push({
      path: '/basic-info/outlet/add',
      query: {
        pageType: 'edit',
        id: data?.id,
      },
    });
  };

  // 确认
  const handleConfirm = (data?: any): void => {
    const { id, status } = data;
    Modal.confirm({
      title: '您确定要确认该门店信息吗？',
      icon: createVNode(ExclamationCircleOutlined),
      onOk() {
        actionShopStatusChange({
          id,
          status,
          afterStatus: ShopStatus.ENABLE,
        }).then((res) => {
          if (res.status) {
            createMessage.success('操作成功');
            getList();
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test',
    });
  };

  // 启用 / 停用
  const handleOperateStatus = (data?: any): void => {
    const { id, status } = data;

    const enable = status === Number(ShopStatus.ENABLE);

    Modal.confirm({
      title: `您确定要${enable ? '禁用' : '启用'}该门店信息吗？`,
      icon: createVNode(ExclamationCircleOutlined),
      onOk() {
        actionShopStatusChange({
          id,
          status,
          afterStatus: enable ? ShopStatus.DISABLE : ShopStatus.ENABLE,
        }).then((res) => {
          if (res.status) {
            createMessage.success('操作成功');
            getList();
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test',
    });
  };

  // 获取字典数据
  const handleDictData = async () => {
    statusData.value = await getDictWithType('shop_status');
  };

  // 获取字典数据
  const handleCityData = async () => {
    cityData.value = await actionQueryShopCity();
  };

  const handleSearch = debounce((value) => {
    actionQueryShopList({
      shopName: value,
    }).then((res) => {
      companyData.value = res;
    });
  });

  onMounted(() => {
    handleCityData();
    handleDictData();
    getList();
  });
</script>
