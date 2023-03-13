<template>
  <div>
    <BasicTable @register="registerTable" @change="handleTableChange">
      <template #tableTitle v-if="hasPermission(routeManageEnum.ROUTE_ADD)">
        <Button type="primary" @click="toAddNewPage">新增线路</Button>
        <Button type="primary" class="ml-3" @click="exportIn">导入</Button>
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
        <p>{{ record.routeCode }}</p>
      </template>

      <!-- 远程搜索 -->
      <template #form-remoteSearch="{ model, field }">
        <Select
          v-model:value="model[field]"
          showSearch
          label-in-value
          placeholder="请输入城市"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="searchData.fetching ? undefined : null"
          :options="searchData.data"
          allowClear
          :maxlength="10"
          @search="onSearch"
        >
          <template v-if="searchData.fetching" #notFoundContent>
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
      title="编辑线路"
      v-model:visible="showEditVisible"
      @ok="confirmLineEdit"
      @cancel="showEditVisible = false"
      width="80%"
    >
      <div class="contract-change-style">
        <MyForm
          :model="formState"
          name="basic"
          autocomplete="off"
          ref="editLineRef"
          labelAlign="left"
        >
          <Row :gutter="24">
            <Col :span="12">
              <FormItem
                label="线路名称"
                :labelCol="{ span: 4 }"
                name="name"
                :rules="[
                  {
                    required: true,
                    message: '请输入线路名称',
                  },
                ]"
              >
                <Input v-model:value="formState.name" placeholder="请输入" :maxlength="100" />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem label="外部线路编码" name="externalRouteCode" :labelCol="{ span: 6 }">
                <Input
                  v-model:value="formState.externalRouteCode"
                  :maxlength="100"
                  placeholder="请输入外部线路编码"
                />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="24">
            <Col :span="12">
              <FormItem
                label="出发地"
                name="startingAddressCode"
                :labelCol="{ span: 4 }"
                :rules="[
                  {
                    required: true,
                    message: '请输入出发地',
                  },
                ]"
              >
                <!-- <Cascader
                  :field-names="{ label: 'name', value: 'code' }"
                  v-model:value="formState.startingAddressCode"
                  :options="areas"
                  placeholder="请选择省市"
                /> -->

                <Select
                  v-model:value="formState.startingAddressCode"
                  showSearch
                  label-in-value
                  placeholder="请选择"
                  style="width: 100%"
                  :filter-option="false"
                  :not-found-content="searchStartData.fetching ? undefined : null"
                  :options="searchStartData.data"
                  allowClear
                  :maxlength="10"
                  @search="onSearchStart"
                  @change="selectStartCity"
                >
                  <template v-if="searchStartData.fetching" #notFoundContent>
                    <Spin size="small" />
                  </template>
                </Select>
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :labelCol="{ span: 6 }" label="详细地址" name="startingAddress">
                <Input
                  v-model:value="formState.startingAddress"
                  :maxlength="100"
                  placeholder="请输入详细地址"
                />
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="24">
            <Col :span="12">
              <FormItem
                label="目的地"
                name="destinationAddressCode"
                :labelCol="{ span: 4 }"
                :rules="[
                  {
                    required: true,
                    message: '请输入目的地',
                  },
                ]"
              >
                <!-- <Cascader
                  :field-names="{ label: 'name', value: 'code' }"
                  v-model:value="formState.destinationAddressCode"
                  :options="areas"
                  placeholder="请选择省市"
                /> -->

                <Select
                  v-model:value="formState.destinationAddressCode"
                  showSearch
                  label-in-value
                  placeholder="请选择"
                  style="width: 100%"
                  :filter-option="false"
                  :not-found-content="searchEndData.endFetching ? undefined : null"
                  :options="searchEndData.endData"
                  allowClear
                  :maxlength="10"
                  @search="onSearchEnd"
                  @change="selectEndCity"
                >
                  <template v-if="searchEndData.endFetching" #notFoundContent>
                    <Spin size="small" />
                  </template>
                </Select>
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem label="详细地址" name="destinationAddress" :labelCol="{ span: 6 }">
                <Input
                  v-model:value="formState.destinationAddress"
                  :maxlength="100"
                  placeholder="请输入详细地址"
                />
              </FormItem>
            </Col>
          </Row>
        </MyForm>
      </div>
    </Modal>

    <Modal
      title="删除"
      v-model:visible="showDelVisible"
      @ok="confirmResetPass"
      @cancel="closeResetPass"
      :width="220"
    >
      <p class="del-modal"
        ><info-circle-outlined style="color: #f90; margin-right: 10px" />您确定要删除吗？</p
      >
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
            >上传线路数共：<span>{{ uploadResInfo.total }}条</span></p
          >
          <p
            >成功线路数：<span>{{ uploadResInfo.succeedNum }}条</span></p
          >
          <p
            >失败线路数：<span>{{ uploadResInfo.failNum }}条</span></p
          >
        </div>
      </div>

      <template #footer>
        <div>
          <Button type="primary" @click="downloadFail" v-if="uploadResInfo.failNum != 0"
            >下载失败线路</Button
          >
          <Button type="primary" @click="exportResVisibel = false">完成</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, reactive, watch } from 'vue';
  import { getAreaProCityTreeApi } from '/@/api/common/dicts';
  import {
    BasicTable,
    useTable,
    EditRecordRow,
    ActionItem,
    TableAction,
    FormProps,
  } from '/@/components/Table';
  import { BasicColumn } from '/@/components/Table/src/types/table';
  import {
    Button,
    Modal,
    Tag,
    Select,
    message,
    Input,
    Row,
    Col,
    Form as MyForm,
    FormItem,
    Cascader,
    Upload,
    Spin,
  } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { debounce } from 'lodash-es';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { routeManageEnum } from '/@/assets/permission/contractManage';
  import dayjs from 'dayjs';
  import { getAppEnvConfig } from '/@/utils/env';

  import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import {
    getLineListApi,
    getCityApi,
    delLine,
    uploadLineApi,
    importLineTempApi,
    getLineCityApi,
  } from '/@/api/lineManageMent/lineManagement';
  import { Columns, Schemas } from './data';
  import { useReloadPage } from '/@/store/modules/reloadPage';

  const { hasPermission } = usePermission();

  // 导入
  const { VITE_GLOB_API_URL } = getAppEnvConfig();

  const downloadTemp = () => {
    window.open(
      `${VITE_GLOB_API_URL}/saas-apis/0/dst-mgt-account-server/import/template/download?id=9`,
    );
  };
  const downloadFail = () => {
    window.open(uploadResInfo.value.fileUrl);
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
  const fileList = ref([]);
  const exportResVisibel = ref(false);
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
      let res = await importLineTempApi(formData);
      message.success('加载完成');
      exportVisibel.value = false;
      uploadResInfo.value = res;
      exportResVisibel.value = true;
      fileList.value = [];
      isUpload.value = false;
    } catch (error) {
      isUpload.value = false;
    }
    await getLinesList();
  };

  let formState = ref({
    name: '',
    externalRouteCode: '',
    startingAddressCode: '', //出发地code
    startOption: '',
    endOption: '',
    destinationAddressCode: '', //目的地code
    startingAddress: '',
    destinationAddress: '',
  });
  let searchParams = reactive({
    name: '',
    routeCode: '',
    startTime: '',
    endTime: '',
    city: '',
  });
  const formConfig: Partial<FormProps> = {
    labelWidth: 100,
    labelAlign: 'left',
    submitFunc: async () => {
      await console.log(getForm().getFieldsValue());
      searchParams = {
        ...searchParams,
        name: getForm().getFieldsValue().name,
        routeCode: getForm().getFieldsValue().routeCode,
        startTime:
          getForm().getFieldsValue()?.createTime &&
          dayjs(getForm().getFieldsValue()?.createTime[0]).format('YYYY-MM-DD') + ' ' + '00:00:00',
        endTime:
          getForm().getFieldsValue()?.createTime &&
          dayjs(getForm().getFieldsValue()?.createTime[1]).format('YYYY-MM-DD') + ' ' + '23:59:59',
        city: getForm().getFieldsValue()?.city && getForm().getFieldsValue()?.city?.value,
      };
      await getLinesList();
    },
    schemas: Schemas,
  };

  const data = ref();
  const [registerTable, { getForm, setLoading, getPaginationRef, setPagination }] = useTable({
    dataSource: data,
    columns: Columns,
    useSearchForm: true,
    formConfig: formConfig,
    showIndexColumn: false,
    rowKey: 'id',
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleTableChange() {
    getLinesList();
  }

  let resetPassValue = ref<string>('');

  let areas = ref();
  onMounted(async () => {
    await getLinesList();
    areas.value = (await getAreaProCityTreeApi())[0].children;
  });

  const getLinesList = async () => {
    // @ts-ignore
    const { current, pageSize } = getPaginationRef();

    setLoading(true);
    const userList = await getLineListApi({
      ...searchParams,
      pageNum: current,
      pageSize,
    });
    setLoading(false);
    const { list, totalNum } = userList;
    list.forEach((ele, i) => {
      ele.order = i + 1;
      ele.roleName = `${ele.startingCityName} ${ele.startingAreaName} ${ele.startingAddress}`;
      ele.arriveName = `${ele.destinationCityName} ${ele.destinationAreaName} ${ele.destinationAddress}`;
    });

    data.value = list;

    setPagination({
      total: totalNum,
    });
  };

  const router = useRouter();
  const closeResetPass = () => {
    resetPassValue.value = '';
  };
  const confirmResetPass = async () => {
    await delLine(curDelLineId.value);
    message.success('删除成功');
    showDelVisible.value = false;
    await getLinesList();
  };

  function toAddNewPage() {
    router.push({
      name: 'AddNewLine',
    });
    console.log(getForm().getFieldsValue());
  }
  const searchData = reactive({
    data: [],
    value: [],
    fetching: false,
  });
  const onSearch = debounce(async (value) => {
    searchData.data = [];
    searchData.fetching = true;
    if (value != '') {
      let data = await getCityApi(value);
      searchData.data = data.map((ele) => {
        return { value: ele.code, label: ele.name };
      });
      searchData.fetching = false;
    }
  }, 500);

  function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record, column),
        ifShow: () => {
          return hasPermission(routeManageEnum.ROUTE_EDIT);
        },
      },
      {
        label: '删除',
        color: 'error',
        onClick: handleUserType.bind(null, record, column),
        ifShow: () => {
          return hasPermission(routeManageEnum.ROUTE_DELETE);
        },
      },
    ];
  }
  let editLineRef = ref();
  const confirmLineEdit = async () => {
    console.log(111999, formState);
    Promise.all([editLineRef.value?.validate()]).then(async () => {
      let subObj = {
        id: editId.value,
        name: formState.value.name,
        externalRouteCode: formState.value.externalRouteCode,
        city: formState.value.startOption.cityCode,
        startingProvince: formState.value.startOption.pcode,
        startingCity: formState.value.startOption.cityCode,
        destinationProvince: formState.value.endOption.pcode,
        destinationCity: formState.value.endOption.cityCode,
        startingAddress: formState.value.startingAddress,
        destinationAddress: formState.value.destinationAddress,
      };

      await uploadLineApi(subObj);
      message.success('更新成功');
      showEditVisible.value = false;
      await getLinesList();
    });
  };

  let showEditVisible = ref<boolean>(false);
  let editId = ref();
  function handleEdit(record) {
    console.log(12399, record);
    editId.value = record.id;
    formState.value = {
      name: record.name,
      externalRouteCode: record.externalRouteCode,
      startingAddressCode: `${record.startingProvinceName}/${record.startingCityName}`, //出发地code
      destinationAddressCode: `${record.destinationProvinceName}/${record.destinationCityName}`, //目的地code
      startOption: {
        cityCode: record.startingCity,
        cityCodeName: record.startingCityName,
        pcode: record.startingProvince,
        pname: record.startingProvinceName,
      },
      endOption: {
        cityCode: record.destinationCity,
        cityCodeName: record.destinationCityName,
        pcode: record.destinationProvince,
        pname: record.destinationProvinceName,
      },
      startingAddress: record.startingAddress,
      destinationAddress: record.destinationAddress,
    };

    showEditVisible.value = true;
  }
  let showDelVisible = ref<boolean>(false);
  let curDelLineId = ref();
  function handleUserType(record) {
    curDelLineId.value = record.id;
    showDelVisible.value = true;
  }

  // 远程搜索城市
  const searchStartData = reactive({
    data: [],
    value: [],
    fetching: false,
  });
  const onSearchStart = debounce(async (value) => {
    searchStartData.data = [];
    searchStartData.fetching = true;
    if (value != '') {
      let data = await getLineCityApi(value);
      searchStartData.data = data.map((ele) => {
        return { value: ele.cityCode, label: ele.cityCodeName, option: ele };
      });
      searchStartData.fetching = false;
    }
  }, 500);

  const selectStartCity = (val) => {
    console.log(199, val);
    formState.value.startOption = val.option.option;
    formState.value.startingAddressCode = `${val.option.option.pname}/${val.option.option.cityCodeName}`;
  };

  const searchEndData = reactive({
    endData: [],
    endValue: [],
    endFetching: false,
  });
  const onSearchEnd = debounce(async (value) => {
    searchEndData.endData = [];
    searchEndData.endFetching = true;
    if (value != '') {
      let data = await getLineCityApi(value);
      searchEndData.endData = data.map((ele) => {
        return { value: ele.cityCode, label: ele.cityCodeName, option: ele };
      });
      searchEndData.endFetching = false;
    }
  }, 500);

  const selectEndCity = (val) => {
    formState.value.endOption = val.option.option;
    console.log(12, formState.value.endOption);
    formState.value.destinationAddressCode = `${val.option.option.pname}/${val.option.option.cityCodeName}`;
  };

  let reloadPage = useReloadPage();

  watch(
    () => reloadPage.linePageReload,
    async () => {
      await getLinesList();
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
  .pass-valid {
    margin-left: 100px;
    color: #ed6f6f;
  }
  .error-valid {
    border-color: #ed6f6f;
  }
  .contract-change-style {
    padding: 20px 20px 5px;
  }
  .del-modal {
    padding: 20px;
    margin-bottom: 0;
  }
</style>
