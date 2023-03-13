<template>
  <div>
    <BasicTable @register="registerTable" @change="handleTableChange">
      <template #tableTitle>
        <Button
          type="primary"
          @click="toAddNewPage"
          v-if="hasPermission(contractManageEnum.CONTRACT_ADD)"
          >新增合同</Button
        >
      </template>
      <template #identityTag="{ record }">
        <Tag
          v-for="ele in record.identityTag"
          style="margin: 4px"
          :color="ele.color"
          :key="ele.color"
          >{{ ele.text }}</Tag
        >
      </template>

      <template #idSlot="{ record }">
        <p @click="toInfo(record)" class="id-style">{{ record.contractCode }}</p>
      </template>

      <!-- 远程搜索 -->
      <template #form-remoteSearch="{ model, field }">
        <Select
          v-model:value="model[field]"
          showSearch
          label-in-value
          placeholder="请选择"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          :options="data"
          allowClear
          :maxlength="10"
          @search="onSearch"
        >
          <template v-if="fetching" #notFoundContent>
            <Spin size="small" />
          </template>
        </Select>
      </template>
      <!-- 操作按钮 -->
      <template #action="{ record, column }">
        <TableAction :actions="createActions(record, column)" />
      </template>
    </BasicTable>

    <Modal
      title="合同期限变更"
      v-model:visible="showContractTimeVisible"
      @ok="confirmResetPass"
      @cancel="closeResetPass"
    >
      <div class="contract-change-style">
        <div class="front-time">
          <p> 变更前期限 </p>
          <RangePicker v-model:value="contractChangeFrontTime" disabled />
        </div>
        <div class="back-time">
          <p>
            <span style="color: #ff4d4f">*</span>
            变更后期限
          </p>
          <RangePicker v-model:value="contractChangeBackTime" />
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
  import { ref, onMounted, reactive, toRefs, watch } from 'vue';
  import { defineComponent } from 'vue';
  import {
    BasicTable,
    useTable,
    EditRecordRow,
    ActionItem,
    TableAction,
    FormProps,
  } from '/@/components/Table';
  import { BasicColumn } from '/@/components/Table/src/types/table';
  import { contractManageEnum } from '/@/assets/permission/contractManage';
  import { Button, Modal, Tag, Select, message, RangePicker, Spin } from 'ant-design-vue';
  import { useDebounceFn } from '@vueuse/core';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import { Dayjs } from 'dayjs';
  import { getDictWithType } from '/@/api/common/dicts';
  import {
    getShopInfo,
    uploadContractTimeApi,
    getContractListApi,
  } from '/@/api/contractManage/contractManage';
  import { debounce } from 'lodash-es';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useReloadPage } from '/@/store/modules/reloadPage';

  const Columns: BasicColumn[] = [
    {
      title: '序号',
      dataIndex: 'order',
      fixed: 'left',
      resizable: true,
      align: 'left',
      width: 50,
    },
    {
      title: '合同编码',
      dataIndex: 'contractCode',
      resizable: true,
      slots: { customRender: 'idSlot' },
      align: 'left',
      width: 200,
    },
    {
      title: '合同名称',
      resizable: true,
      align: 'left',
      dataIndex: 'contractName',
      width: 150,
    },
    {
      title: '外部合同编码',
      resizable: true,
      align: 'left',
      width: 100,
      dataIndex: 'externalContractCode',
    },
    {
      title: '合同状态',
      align: 'left',
      resizable: true,
      dataIndex: 'statusName',
      width: 150,
    },
    {
      title: '归属门店',
      resizable: true,
      align: 'left',
      dataIndex: 'shopName',
      width: 150,
    },
    {
      title: '合同类别',
      align: 'left',
      resizable: true,
      dataIndex: 'typeName',
      width: 150,
    },
    {
      title: '创建人',
      align: 'left',
      resizable: true,
      dataIndex: 'creatorName',
      width: 150,
    },
    {
      title: '创建时间',
      align: 'left',
      resizable: true,
      dataIndex: 'createTime',
      width: 150,
    },
  ] as BasicColumn[];

  type RangeValue = [Dayjs, Dayjs];

  export default defineComponent({
    name: 'ProjectContract',
    components: {
      BasicTable,
      Button,
      TableAction,
      Modal,
      Tag,
      Select,
      RangePicker,
      Spin,
    },
    setup() {
      let contractChangeFrontTime = ref<RangeValue>([]);
      let contractChangeBackTime = ref<RangeValue>([]);
      let contractStatusDict = ref();
      let contractTypesDict = ref();
      const searchData = reactive({
        data: [],
        value: [],
        fetching: false,
      });
      const positionStatusList = ref();
      let searchParams = reactive({
        startTime: '',
        endTime: '',
        contractCode: '',
        contractType: '',
        shopId: '',
        contractStatus: '',
      });
      const { hasPermission } = usePermission();
      const formConfig: Partial<FormProps> = {
        labelWidth: 100,
        labelAlign: 'left',
        submitFunc: async () => {
          await console.log(getForm().getFieldsValue());
          searchParams = {
            ...searchParams,
            contractCode: getForm().getFieldsValue()?.contractCode,
            startTime:
              getForm().getFieldsValue().createTime &&
              dayjs(getForm().getFieldsValue().createTime[0]).format('YYYY-MM-DD') +
                ' ' +
                '00:00:00',
            endTime:
              getForm().getFieldsValue().createTime &&
              dayjs(getForm().getFieldsValue().createTime[1]).format('YYYY-MM-DD') +
                ' ' +
                '23:59:59',
            contractType: getForm().getFieldsValue()?.contractType,
            shopId: getForm().getFieldsValue()?.shopId?.value,
            contractStatus: getForm().getFieldsValue()?.contractStatus,
          };
          await getContractList();
        },
        schemas: [
          {
            field: 'contractCode',
            component: 'Input',
            label: '合同编码',
            colProps: {
              xl: 8,
              xxl: 6,
            },
            componentProps: {
              placeholder: '请输入合同编码',
              maxlength: 100,
            },
          },
          {
            field: 'contractStatus',
            component: 'Select',
            label: '合同状态',
            componentProps: {
              options: contractStatusDict,
              fieldNames: { label: 'name', value: 'value' },
            },
            colProps: {
              xl: 8,
              xxl: 6,
            },
          },
          {
            field: `contractType`,
            label: '合同类别',
            component: 'Select',
            componentProps: {
              options: contractTypesDict,
              fieldNames: { label: 'name', value: 'value' },
            },
            colProps: {
              xl: 8,
              xxl: 6,
            },
          },
          {
            field: 'shopId',
            component: 'Select',
            label: '归属门店',
            slot: 'remoteSearch',
            colProps: {
              xl: 8,
              xxl: 6,
            },
          },
          {
            field: 'createTime',
            component: 'RangePicker',
            label: '创建时间',
            colProps: {
              xl: 8,
              xxl: 6,
            },
          },
        ],
      };
      let showPassValidate = ref(false);
      const data = ref();
      const [registerTable, { getForm, setLoading, getPaginationRef, setPagination }] = useTable({
        // api: demoListApi,
        dataSource: data,
        columns: Columns,
        useSearchForm: true,
        formConfig: formConfig,
        showIndexColumn: false,
        rowKey: 'id',
        actionColumn: {
          width: 200,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });
      function handleTableChange() {
        getContractList();
      }
      let resetPassValue = ref<string>('');

      onMounted(async () => {
        // 字典信息
        contractStatusDict.value = await getDictWithType('contract_status');
        contractTypesDict.value = await getDictWithType('contract_type');
        console.log(999, contractStatusDict);
        await getContractList();
      });

      const getContractList = async () => {
        // @ts-ignore
        const { current, pageSize } = getPaginationRef();
        setLoading(true);

        const userList = await getContractListApi({
          ...searchParams,
          pageNum: current,
          pageSize,
        });

        setLoading(false);
        const { list, totalNum } = userList;
        list.forEach((ele, i) => {
          ele.order = i + 1;
        });

        data.value = list;
        console.log(11111, data);

        setPagination({
          total: totalNum,
        });
      };

      const router = useRouter();
      let resetPassvisible = ref<boolean>(false);
      const closeResetPass = () => {
        resetPassValue.value = '';
      };
      const confirmResetPass = async () => {
        if (!contractChangeBackTime?.value[0]) {
          message.error('期限不能为空');
          return;
        }

        let params = {
          id: curContractId.value,
          validityStartDate: dayjs(contractChangeBackTime?.value[0]).format('YYYY-MM-DD'),
          validityEndDate: dayjs(contractChangeBackTime?.value[1]).format('YYYY-MM-DD'),
        };
        await uploadContractTimeApi(params);
        message.success('更新成功');
        showContractTimeVisible.value = false;

        contractChangeBackTime.value = [];
        await getContractList();
      };

      function toAddNewPage() {
        router.push({
          name: 'AddNewContract',
        });
        console.log(getForm().getFieldsValue());
      }

      const onSearch = debounce(async (value) => {
        searchData.data = [];
        searchData.fetching = true;
        if (value != '') {
          let data = await getShopInfo(value);
          searchData.data = data.map((ele) => {
            return { value: ele.id, label: ele.shopName };
          });
          searchData.fetching = false;
        }
      }, 500);

      // 未生效 已生效 --> 编辑         --> 0 1
      // 已失效        --> 合同期限变更 --> 2
      // 已生效 已失效 --> 续签合同     --> 1 2

      function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
        return [
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record, column),
            ifShow: () => {
              return (
                (record.status == 0 || record.status == 1) &&
                hasPermission(contractManageEnum.CONTRACT_EDIT)
              );
            },
          },
          {
            label: '合同期限变更',
            onClick: handleContractTime.bind(null, record, column),
            ifShow: () => {
              return record.status == 2 && hasPermission(contractManageEnum.CONTRACT_UPDATE_DATE);
            },
          },
          {
            label: '续签合同',
            onClick: handleRenewal.bind(null, record, column),
            ifShow: () => {
              return (
                (record.status == 1 || record.status == 2) &&
                hasPermission(contractManageEnum.CONTRACT_RENEW)
              );
            },
          },
        ];
      }

      let showContractTimeVisible = ref<boolean>(false);
      let curContractId = ref();
      const handleContractTime = (record) => {
        curContractId.value = record.id;
        contractChangeFrontTime.value = [
          dayjs(record.validityStartDate),
          dayjs(record.validityEndDate),
        ];
        showContractTimeVisible.value = true;
      };

      const userTypeVisible = ref<boolean>(false);
      function handleEdit(record) {
        let renewal = '';
        let contractCode = '';
        if (record.type == 1) {
          renewal = 'renewal';
          contractCode = record.contractCode;
        }
        router.push({
          name: 'EditNewContract',
          query: {
            contractId: record.id,
            edit: 'edit',
            renewal,
            contractCode,
          },
        });
      }

      function handleRenewal(record) {
        router.push({
          name: 'RenewalContract',
          query: {
            contractId: record.id,
            renewal: 'renewal',
            contractCode: record.contractCode,
          },
        });
      }

      function toInfo(val) {
        router.push({
          name: 'ContractInfo',
          query: {
            contractId: val.id,
          },
        });
      }

      let reloadPage = useReloadPage();

      watch(
        () => reloadPage.contractPageReload,
        async () => {
          await getContractList();
        },
      );

      return {
        registerTable,
        toAddNewPage,
        onSearch: useDebounceFn(onSearch, 300),
        createActions,
        confirmResetPass,
        toInfo,
        userTypeVisible,
        resetPassValue,
        resetPassvisible,
        handleTableChange,
        positionStatusList,
        closeResetPass,
        showPassValidate,
        showContractTimeVisible,
        contractChangeFrontTime,
        contractChangeBackTime,
        ...toRefs(searchData),
        usePermission,
        contractManageEnum,
        hasPermission,
      };
    },
  });
</script>

<style lang="less" scoped>
  .id-style {
    border-bottom: 1px solid #19c280;
    color: #19c280;
    cursor: pointer;
    width: fit-content;
    letter-spacing: 1px;
  }
  .pass-valid {
    margin-left: 100px;
    color: #ed6f6f;
  }
  .error-valid {
    border-color: #ed6f6f;
  }
  .contract-change-style {
    display: flex;
    padding: 20px 20px 5px;
    flex-direction: column;
    justify-content: center;
    > div {
      margin: 10px 0;
      display: flex;
      align-items: center;
      > p {
        width: 100px;
        text-align: left;
        margin-bottom: 0;
      }
    }
  }
</style>
