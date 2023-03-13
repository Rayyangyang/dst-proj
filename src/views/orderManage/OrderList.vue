<template>
  <div>
    <BasicTable
      @register="registerTable"
      @change="handleTableChange"
      :rowSelection="{ type: 'checkbox', selectedRowKeys: checkedKeys, onChange: onSelectChange }"
    >
      <template #tableTitle>
        <Button
          type="primary"
          @click="toAddNewPage"
          class="mr-3"
          v-if="hasPermission(orderManageEnum.ORDER_ADD)"
          >新增订单</Button
        >
        <Button
          type="primary"
          @click="orderSign"
          class="mr-3 dst-btn-bg-green"
          v-if="hasPermission(orderManageEnum.ORDER_SIGNIN)"
          >签收</Button
        >
        <Button
          type="primary"
          @click="cnacelOrder"
          class="mr-3 dst-btn-bg-green"
          v-if="hasPermission(orderManageEnum.ORDER_CANCEL)"
          >取消订单</Button
        >
        <Button
          type="primary"
          @click="exportIn"
          class="mr-3 dst-btn-bg-green"
          v-if="hasPermission(orderManageEnum.ORDER_IMPORT)"
          >导入</Button
        >
        <Button
          type="primary"
          @click="exportOrder"
          class="mr-3 dst-btn-bg-green"
          v-if="hasPermission(orderManageEnum.ORDER_EXPORT)"
          >导出</Button
        >
      </template>
      <template #toolbar>
        <Popover placement="bottomRight" v-model:visible="visiblePopover">
          <template #content>
            <div style="display: flex; flex-direction: column; justify-content: center">
              <Checkbox
                v-model:checked="filterChecked[ele.key]"
                v-for="ele in filterList"
                :key="ele"
                >{{ ele.value }}</Checkbox
              >

              <Button style="margin-top: 10px" type="primary" @click="confirmFilter">确定</Button>
            </div>
          </template>
          <img
            src="../../assets/images/table/filter.png"
            alt=""
            style="height: 20px; cursor: pointer"
          />
        </Popover>
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
        <p
          @click="toInfo(record)"
          :class="[hasPermission(orderManageEnum.ORDER_DETAIL) ? 'id-style' : '']"
          >{{ record.orderCode }}</p
        >
      </template>

      <!-- 远程搜索 -->
      <!-- 门店名称 -->
      <template #form-remoteSearch="{ model, field }">
        <Select
          v-model:value="model[field]"
          showSearch
          label-in-value
          placeholder="请选择"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="searchData.fetching ? undefined : null"
          :options="searchData.data"
          allowClear
          :maxlength="10"
          @search="onSearch"
          @select="selectShop"
        >
          <template v-if="searchData.fetching" #notFoundContent>
            <Spin size="small" />
          </template>
        </Select>
      </template>
      <!-- 线路搜索 -->
      <template #form-remoteSearchRoute="{ model, field }">
        <Select
          v-model:value="model[field]"
          showSearch
          label-in-value
          placeholder="请选择"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="searchRouteData.searchRouteFetching ? undefined : null"
          :options="searchRouteData.searchRouteData"
          allowClear
          :maxlength="10"
          @search="onSearchRoute"
          @select="selectRoute"
        >
          <template v-if="searchRouteData.searchRouteData.searchRouteFetching" #notFoundContent>
            <Spin size="small" />
          </template>
        </Select>
      </template>
      <!-- 服务类别搜索 -->
      <template #form-remoteSearchServiceCategory="{ model, field }">
        <Select
          v-model:value="model[field]"
          showSearch
          label-in-value
          placeholder="请选择"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="searchCategoryData.serviceCategoryFetching ? undefined : null"
          :options="searchCategoryData.serviceCategoryData"
          allowClear
          :maxlength="10"
          @search="onSearchServiceCategory"
        >
          <template v-if="searchCategoryData.serviceCategoryFetching" #notFoundContent>
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
      title="取消订单"
      v-model:visible="cancelOrderVisible"
      @ok="cancelOrderConfirm"
      @cancel="
        () => {
          cancelOrderVisible = false;
          cancelOrderValue = '';
        }
      "
    >
      <div class="contract-change-style">
        <div class="front-time">
          <p> 取消原因 </p>
          <a-textarea
            v-model:value="cancelOrderValue"
            placeholder="请输入取消原因(100字以内)"
            :auto-size="{ minRows: 2, maxRows: 5 }"
            :maxlength="100"
          />
        </div>
      </div>
    </Modal>
    <Modal
      title="签收订单"
      v-model:visible="signOrderVisible"
      @ok="confirmSign"
      @cancel="signOrderVisible = false"
    >
      <div class="contract-change-style">
        <p> 您确定要签收订单吗？ </p>
      </div>
    </Modal>
    <Modal
      title="导入"
      v-model:visible="exportVisibel"
      @cancel="
        () => {
          exportVisibel = false;
          fileList = [];
        }
      "
    >
      <div style="padding: 20px">
        <Upload
          :file-list="fileList"
          :before-upload="beforeUpload"
          @remove="handleRemove"
          accept=".xls, .xlsx"
        >
          <Button :disabled="fileList.length == 1">上传文件 </Button>
        </Upload>
        <div style="margin-top: 20px">
          <span style="margin-right: 10px">模板下载</span>
          <span @click="downloadTemp" style="color: #0099ff; cursor: pointer">下载实例模板</span>
        </div>
        <p style="margin-top: 20px">备注：文件格式必须用模板格式，1000条以内，文件5M以内</p>
      </div>

      <template #footer>
        <div>
          <Button
            @click="
              () => {
                exportVisibel = false;
                fileList = [];
              }
            "
            >取消</Button
          >
          <Button type="primary" @click="confirmExportFile" :loading="isUpload">确定</Button>
        </div>
      </template>
    </Modal>
    <Modal title="导入结果" v-model:visible="exportResVisibel">
      <div style="padding: 20px; display: flex">
        <p style="margin-right: 10px">处理结果</p>
        <div>
          <p
            >上传订单数共：<span>{{ uploadResInfo.total }}条</span></p
          >
          <p
            >成功订单数：<span>{{ uploadResInfo.succeedNum }}条</span></p
          >
          <p
            >失败订单数：<span>{{ uploadResInfo.failNum }}条</span></p
          >
        </div>
      </div>

      <template #footer>
        <div>
          <Button type="primary" @click="downloadFail" v-if="uploadResInfo.failNum != 0"
            >下载失败订单</Button
          >
          <Button type="primary" @click="exportResVisibel = false">完成</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, reactive, watch } from 'vue';
  import {
    BasicTable,
    useTable,
    EditRecordRow,
    ActionItem,
    TableAction,
    FormProps,
  } from '/@/components/Table';
  import { BasicColumn } from '/@/components/Table/src/types/table';
  import { orderManageEnum } from '/@/assets/permission/orderManage';
  import {
    Button,
    Modal,
    Tag,
    Select,
    message,
    Spin,
    Upload,
    Popover,
    Checkbox,
  } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import {
    getOrderListApi,
    searchServiceCategoryApi,
    importOrderTempApi,
    orderSignApi,
    exportOrderApi,
    getOrderListItem,
    editOrderListItem,
    cancelOrderApi,
  } from '/@/api/orderManage/orderManage';
  import { getDictWithType } from '/@/api/common/dicts';
  import { getShopInfo } from '/@/api/contractManage/contractManage';
  import { debounce, toNumber } from 'lodash-es';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { SearchLineListApi } from '/@/api/lineManageMent/lineManagement';
  import { showItemList, Columns } from './data';
  import { getAppEnvConfig } from '/@/utils/env';
  import { getSchemas } from './schemas';
  import { useReloadPage } from '/@/store/modules/reloadPage';

  const { VITE_GLOB_API_URL } = getAppEnvConfig();

  let statusDict = ref();
  let serviceTypes = ref();
  const filterChecked = ref({});
  const fileList = ref([]);
  const searchData = reactive({
    data: [],
    value: [],
    fetching: false,
  });
  let searchParams = reactive({
    orderCode: '',
    status: '',
    shopId: '',
    routeId: '',
    serviceCategoryId: '',
    serviceType: '',
    departTime: '',
    deliveryTime: '',
    receiveName: '',
    receivePhone: '',
    startTime: '',
    endTime: '',
    routeName: '',
  });
  const { hasPermission } = usePermission();
  const formConfig: Partial<FormProps> = {
    labelWidth: 100,
    labelAlign: 'left',
    submitFunc: async () => {
      searchParams = {
        ...searchParams,
        departStartTime:
          getForm().getFieldsValue().startTime &&
          dayjs(getForm().getFieldsValue().startTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00',
        departEndTime:
          getForm().getFieldsValue().startTime &&
          dayjs(getForm().getFieldsValue().startTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:00',
        deliveryStartTime:
          getForm().getFieldsValue().endTime &&
          dayjs(getForm().getFieldsValue().endTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00',
        deliveryEndTime:
          getForm().getFieldsValue().endTime &&
          dayjs(getForm().getFieldsValue().endTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:00',
        startTime:
          getForm().getFieldsValue().createTime &&
          dayjs(getForm().getFieldsValue().createTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00',
        endTime:
          getForm().getFieldsValue().createTime &&
          dayjs(getForm().getFieldsValue().createTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:59',
        departTime:
          getForm().getFieldsValue().departTime &&
          dayjs(getForm().getFieldsValue().departTime).format('YYYY-MM-DD HH:mm'),
        deliveryTime:
          getForm().getFieldsValue().deliveryTime &&
          dayjs(getForm().getFieldsValue().deliveryTime).format('YYYY-MM-DD HH:mm'),
        orderCode: getForm().getFieldsValue().orderCode,
        receiveName: getForm().getFieldsValue().receiveName,
        status: getForm().getFieldsValue().status,
        receivePhone: getForm().getFieldsValue().receivePhone,
        routeName: getForm().getFieldsValue()?.routeName?.label,
        serviceCategoryId: getForm().getFieldsValue()?.serviceCategoryId?.value,
        shopId: getForm().getFieldsValue()?.shopName?.value,
        routeId: curRouteId.value,
        serviceType: getForm().getFieldsValue()?.serviceType,
      };

      await getOrderList();
    },
    schemas: getSchemas(statusDict, serviceTypes) as [],
  };
  const data = ref();
  const visiblePopover = ref(false);

  const confirmFilter = async () => {
    let filters = [];
    for (let prop in filterChecked.value) {
      if (filterChecked.value[prop]) {
        filters.push(prop);
      }
    }

    createColumns(filters);
    let params = {
      module: 1,
      fieldNames: filters,
    };
    await editOrderListItem(params);
    visiblePopover.value = false;
  };
  const filterColumns = ref(Columns);
  const createColumns = async (columnKey) => {
    if (columnKey.length == 0) {
      filterColumns.value = Columns;
    } else {
      filterColumns.value = Columns.filter((ele) => {
        if (ele.type == 'basemenu') {
          return true;
        } else {
          return columnKey.includes(ele.selfKey);
        }
      });
    }
    let obj = {};
    for (let prop of columnKey) {
      obj[prop] = true;
    }
    filterChecked.value = obj;
  };

  const [registerTable, { getForm, setLoading, getPaginationRef, setPagination }] = useTable({
    // api: demoListApi,
    dataSource: data,
    columns: filterColumns,
    useSearchForm: true,
    formConfig: formConfig,
    showIndexColumn: false,
    rowKey: 'id',
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleTableChange() {
    getOrderList();
  }
  const filterList = ref(showItemList);

  onMounted(async () => {
    // 字典信息
    statusDict.value = await getDictWithType('order_status');
    serviceTypes.value = await getDictWithType('service_type');

    // 获取当前用户的列表展示字段
    let res = await getOrderListItem();
    createColumns(res.map((ele) => ele.fieldName));
    await getOrderList();
  });

  const getOrderList = async () => {
    // @ts-ignore
    const { current, pageSize } = getPaginationRef();
    setLoading(true);

    const userList = await getOrderListApi({
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
    setPagination({
      total: toNumber(totalNum),
    });
  };

  const router = useRouter();

  function toAddNewPage() {
    router.push({
      name: 'AddNeworder',
    });
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

  const searchRouteData = reactive({
    searchRouteData: [],
    searchRouteValue: [],
    searchRouteFetching: false,
  });
  const onSearchRoute = debounce(async (value) => {
    searchRouteData.searchRouteData = [];
    searchRouteData.searchRouteFetching = true;
    if (value != '') {
      let data = await SearchLineListApi(value);
      searchRouteData.searchRouteData = data.map((ele) => {
        return { value: ele.id, label: ele.name };
      });
      searchRouteData.searchRouteFetching = false;
    }
  }, 500);

  const searchCategoryData = reactive({
    serviceCategoryData: [],
    serviceCategoryValue: [],
    serviceCategoryFetching: false,
  });
  const onSearchServiceCategory = debounce(async (value) => {
    if (!getForm().getFieldsValue().serviceType) {
      message.error('请先选择服务类型');
      return;
    } else {
      searchCategoryData.serviceCategoryData = [];
      searchCategoryData.serviceCategoryFetching = true;
      if (value != '') {
        let data = await searchServiceCategoryApi({
          serviceType: toNumber(getForm().getFieldsValue().serviceType),
          categoryName: value,
        });
        searchCategoryData.serviceCategoryData = data.map((ele) => {
          return { value: ele.id, label: ele.categoryName };
        });
        searchCategoryData.serviceCategoryFetching = false;
      }
    }
  }, 500);

  function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record, column),
        ifShow: () => {
          // 没权限
          if (!hasPermission(orderManageEnum.ORDER_EDIT)) {
            return false;
          } else if ([7, 8, 9].indexOf(record.status) != -1) {
            // 根据订单状态显示
            return false;
          } else {
            return true;
          }
        },
      },
    ];
  }

  function handleEdit(record) {
    router.push({
      name: 'EditNeworder',
      query: {
        orderId: record.id,
      },
    });
  }

  function toInfo(val) {
    if (hasPermission(orderManageEnum.ORDER_DETAIL)) {
      router.push({
        name: 'OrderInfo',
        query: {
          orderId: val.id,
        },
      });
    }
  }

  // 导入
  let exportVisibel = ref(false);
  const exportIn = () => {
    exportVisibel.value = true;
  };
  let uploadResInfo = ref();
  let isUpload = ref(false);
  const confirmExportFile = async () => {
    if (fileList.value.length == 0) {
      message.error('请先选择模板');
      return;
    }
    const formData = new FormData();
    formData.append('file', fileList.value[0]);
    isUpload.value = true;
    try {
      let res = await importOrderTempApi(formData);
      message.success('加载完成');
      exportVisibel.value = false;
      uploadResInfo.value = res;
      exportResVisibel.value = true;
      fileList.value = [];
      await getOrderList();
      isUpload.value = false;
    } catch (error) {
      isUpload.value = false;
    }
  };

  const downloadTemp = () => {
    window.open(
      `${VITE_GLOB_API_URL}/saas-apis/0/dst-mgt-account-server/import/template/download?id=1`,
    );
  };
  const checkedKeys = ref();
  const orderSign = () => {
    signOrderVisible.value = true;
  };
  const signOrderVisible = ref(false);
  const confirmSign = async () => {
    if (!checkedKeys.value) {
      message.error('请先选择订单');
      signOrderVisible.value = false;
      return;
    }
    await orderSignApi({
      ids: checkedKeys.value,
    });
    await getOrderList();
    message.success('签收成功');
    signOrderVisible.value = false;
  };
  const onSelectChange = (selectedRowKeys) => {
    checkedKeys.value = selectedRowKeys;
  };
  const beforeUpload = (file) => {
    // 设置最大值，则判断
    if (file.size / 1024 / 1024 >= 5) {
      message.error(`只能上传不超过5MB的文件!`);
      return false;
    }
    fileList.value = [file];
    return false;
  };
  const handleRemove = (file) => {
    const index = fileList.value.indexOf(file);
    console.log(123, fileList);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
  };

  const exportOrder = async () => {
    await exportOrderApi(searchParams);
    message.success('导出成功，请到导出记录下载');
  };

  let cancelOrderVisible = ref(false);
  const cnacelOrder = () => {
    cancelOrderVisible.value = true;
  };

  let cancelOrderValue = ref();

  const cancelOrderConfirm = async () => {
    if (!checkedKeys.value) {
      message.error('请先选择订单');
      cancelOrderVisible.value = false;
      return;
    }

    await cancelOrderApi({
      ids: checkedKeys.value,
      cancelReason: cancelOrderValue.value,
    });
    message.success('取消成功');
    await getOrderList();
    cancelOrderValue.value = '';
    cancelOrderVisible.value = false;
  };
  let curShopId = ref();
  const selectShop = (val) => {
    curShopId.value = val.value;
  };
  let curRouteId = ref();
  const selectRoute = (val) => {
    curRouteId.value = val.value;
  };

  const exportResVisibel = ref(false);
  const downloadFail = () => {
    window.open(uploadResInfo.value.fileUrl);
  };

  let reloadPage = useReloadPage();

  watch(
    () => reloadPage.orderListPageReload,
    async () => {
      await getOrderList();
    },
  );
</script>

<style lang="less" scoped>
  .id-style {
    border-bottom: 1px solid #19c280;
    color: #19c280;
    cursor: pointer;
    width: fit-content;
    letter-spacing: 1px;
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
  :deep(.ant-checkbox-wrapper) {
    margin-left: 0;
  }
</style>
