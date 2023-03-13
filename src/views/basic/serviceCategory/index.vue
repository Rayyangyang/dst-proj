<template>
  <div>
    <BasicTable :showIndexColumn="false" @register="registerTable" @change="handleTableChange">
      <template #form-customType="{ model, field }">
        <a-select
          ref="select"
          v-model:value="model[field]"
          allowClear
          placeholder="请选择"
          :fieldNames="fieldNames"
          :options="serviceTypeData"
        />
      </template>

      <template #bodyCell="{ column }">
        <template v-if="column.key === 'type'"> {{ column.key }} </template>
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              ifShow: () => {
                return hasPermission(ServiceCategoryManageEnum.ServiceCategory_EDIT);
              },
            },
            {
              label: '删除',
              onClick: handleDelete.bind(null, record),
              ifShow: () => {
                return hasPermission(ServiceCategoryManageEnum.ServiceCategory_DELETE);
              },
            },
          ]"
        />
      </template>

      <template #tableTitle v-if="hasPermission(ServiceCategoryManageEnum.ServiceCategory_ADD)">
        <a-button type="primary" @click="handleAdd">新增</a-button>
      </template>
    </BasicTable>

    <CategoryAdd @register="registerCategory" @on-refresh="getList" />
  </div>
</template>

<script lang="ts">
  import { onMounted, defineComponent, reactive, toRefs, createVNode } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';

  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

  import { Select, Modal, Button } from 'ant-design-vue';

  import { getTableColumns, getFormConfig, basicColumnsAction } from './tableData';

  import CategoryAdd from './add.vue';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getDictWithType } from '/@/api/common/dicts';
  import { actionServiceCategoryPage, actionServiceCategoryDelete } from '/@/api/basic/service';
  import { ServiceCategoryManageEnum } from '/@/assets/permission/basic';

  export default defineComponent({
    components: {
      BasicTable,
      TableAction,
      [Select.name]: Select,
      [Button.name]: Button,
      CategoryAdd,
    },
    setup() {
      const state = reactive({
        serviceTypeData: [],
        statusData: [],
        listData: [],
        fieldNames: {
          label: 'name',
          value: 'value',
        },
      });

      const { createMessage } = useMessage();
      const { hasPermission } = usePermission();
      const [registerCategory, { openModal }] = useModal();
      const [
        registerTable,
        { getForm, setTableData, setLoading, getPaginationRef, setPagination },
      ] = useTable({
        dataSource: state.listData,
        useSearchForm: true,
        showIndexColumn: true,
        columns: getTableColumns(),
        actionColumn: basicColumnsAction,
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

          setLoading(true);
          const { status, data } = await actionServiceCategoryPage(paramsVo);

          if (status) {
            state.listData = data.list;

            setPagination({
              total: data.totalNum,
            });

            setTableData(state.listData as any);
          }
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

      // 新增
      const handleAdd = () => {
        openModal(true, {
          type: 'add',
          typeData: state.serviceTypeData || [],
        });
      };

      // 编辑
      const handleEdit = (data: any) => {
        openModal(true, {
          type: 'edit',
          data,
          typeData: state.serviceTypeData || [],
        });
      };

      // 删除
      const handleDelete = (data: any) => {
        Modal.confirm({
          title: '您确定要删除吗？',
          icon: createVNode(ExclamationCircleOutlined),
          onOk() {
            actionServiceCategoryDelete(data?.id).then((res) => {
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
        state.serviceTypeData = await getDictWithType('service_type');
      };

      onMounted(() => {
        getList();
        handleDictData();
      });

      return {
        ...toRefs(state),
        registerTable,
        registerCategory,
        getList,
        customSubmitFunc,
        handleTableChange,
        handleAdd,
        handleEdit,
        handleDelete,
        handleDictData,
        ServiceCategoryManageEnum,
        hasPermission,
      };
    },
  });
</script>
