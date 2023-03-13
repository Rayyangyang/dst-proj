<template>
  <MyForm :model="formState" name="basic" autocomplete="off" ref="basicInfoRef" labelAlign="left">
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="门店名称"
          :labelCol="{ span: 6 }"
          name="shopId"
          labelAlign="left"
          :rules="[{ required: true, message: '请输入门店名称' }]"
        >
          <Select
            v-model:value="formState.shopId"
            showSearch
            label-in-value
            placeholder="请输入门店名称"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            :options="data"
            allowClear
            :maxlength="100"
            @select="selectShop"
            @search="onSearch"
            :disabled="isEdit"
          >
            <template v-if="fetching" #notFoundContent>
              <Spin size="small" />
            </template>
          </Select>
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem label="仓库名称" name="wareHouseId" labelAlign="left" :labelCol="{ span: 6 }">
          <Select
            v-model:value="formState.wareHouseId"
            showSearch
            label-in-value
            placeholder="请输入仓库名称"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            :options="data"
            allowClear
            :maxlength="100"
            @search="onSearch"
          >
            <template v-if="fetching" #notFoundContent>
              <Spin size="small" />
            </template>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem label="合同名称" name="contractId" :labelCol="{ span: 6 }">
          <Select
            v-model:value="contractName"
            showSearch
            label-in-value
            placeholder="请输入合同名称"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="contractFetching ? undefined : null"
            :options="contractData"
            allowClear
            :maxlength="100"
            @search="onSearchContractData"
            @change="getContractId"
          >
            <template v-if="contractFetching" #notFoundContent>
              <Spin size="small" />
            </template>
          </Select>
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem :labelCol="{ span: 6 }" label="线路名称" name="routeId">
          <Select
            v-model:value="formState.routeId"
            showSearch
            label-in-value
            placeholder="请输入线路名称"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="lineFetching ? undefined : null"
            :options="lineData"
            allowClear
            :maxlength="100"
            @search="onSearchLineData"
          >
            <template v-if="lineFetching" #notFoundContent>
              <Spin size="small" />
            </template>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="服务类型"
          name="serviceType"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请选择服务类型' }]"
        >
          <Select
            :options="serviceTypes"
            v-model:value="formState.serviceType"
            :field-names="{ label: 'name', value: 'value' }"
            placeholder="请选择服务类型"
          />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="服务类别"
          name="serviceCategoryId"
          labelAlign="left"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请选择服务类别' }]"
        >
          <Select
            :options="serviceCategories"
            v-model:value="formState.serviceCategoryId"
            placeholder="请选择服务类别"
            @change="getServiceCategoryName"
          />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="发车时间"
          name="startTime"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, validator: calcTime1 }]"
        >
          <DatePicker
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            v-model:value="formState.startTime"
            style="width: 100%"
            :disabled="isEdit"
            @change="triggerEndTime"
          />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="送达时间"
          name="endTime"
          labelAlign="left"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, validator: calcTime2 }]"
        >
          <DatePicker
            :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm"
            v-model:value="formState.endTime"
            :disabled="isEdit"
            style="width: 100%"
            @change="triggerStartTime"
          />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem label="外部订单号" name="externalOrderCode" :labelCol="{ span: 6 }">
          <div style="display: flex; align-items: center; position: relative">
            <Input
              v-model:value="formState.externalOrderCode"
              :maxlength="100"
              placeholder="请输入外部订单号"
            />
            <Tooltip placement="top" color="#fff">
              <template #title>
                <p style="color: #000">
                  非一手货源或三方的的订单号，便于单据核对，以及后期对账；
                </p>
              </template>
              <QuestionCircleOutlined
                style="margin-left: 10px; color: #19c280; position: absolute; right: -20px;"
              />
            </Tooltip>
          </div>
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="外部条码号"
          name="externalBarcode"
          labelAlign="left"
          :labelCol="{ span: 6 }"
        >
          <Input
            v-model:value="formState.externalBarcode"
            :maxlength="100"
            placeholder="请输入外部条码号"
          />
        </FormItem>
      </Col>
    </Row>
  </MyForm>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, onMounted, toRefs, watch } from 'vue';
  import {
    Card,
    Form,
    FormItem,
    Row,
    Col,
    Select,
    DatePicker,
    Input,
    Spin,
    message,
    Tooltip,
  } from 'ant-design-vue';
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';

  import { debounce, toNumber } from 'lodash-es';
  import { useOrderStore } from '/@/store/modules/order';
  import { SearchLineListApi } from '/@/api/lineManageMent/lineManagement';
  import { getContractNameApi, getShopInfo } from '/@/api/contractManage/contractManage';
  import { searchServiceCategoryApi, getShopInfoApi } from '/@/api/orderManage/orderManage';
  import dayjs from 'dayjs';
  import { useRoute } from 'vue-router';
  import { getDictWithType } from '/@/api/common/dicts';
  interface FormState {
    shopId: String | undefined;
    shopName: String;
    wareHouseId: String | undefined;
    contractId: String | undefined;
    routeId: String | undefined;
    serviceType: String | undefined;
    serviceCategoryId: String | undefined;
    serviceCategoryName: String;
    startTime: String;
    endTime: String;
    externalOrderCode: String;
    externalBarcode: String;
  }

  export default defineComponent({
    name: 'OrderBasic',
    components: {
      [Card.name]: Card,
      MyForm: Form,
      FormItem,
      Row,
      Col,
      Select,
      DatePicker,
      Input,
      Spin,
      Tooltip,
      QuestionCircleOutlined,
    },
    props: {
      orderInfo: {
        default: () => {},
        type: Object,
      },
    },
    setup(props) {
      let formState = ref<FormState>({
        shopId: undefined,
        shopName: '',
        wareHouseId: undefined,
        contractId: undefined,
        routeId: undefined,
        serviceType: '1',
        serviceCategoryId: undefined,
        serviceCategoryName: '',
        startTime: '',
        endTime: '',
        externalOrderCode: '',
        externalBarcode: '',
      });

      let serviceTypes = ref();
      let route = useRoute();
      let isEdit = ref(false);
      onMounted(async () => {
        let res = await getDictWithType('service_type');
        console.log(4444, res);
        serviceTypes.value = res;
        if (route.query?.orderId) {
          isEdit.value = true;
        }
      });

      watch(
        () => formState.value.shopId,
        async () => {
          if (!formState.value.routeId) {
            let res = await getShopInfoApi(formState.value?.shopId?.value);
            orderStore.setAddressInfo({
              address: res.shopAddress,
              longitude: res.longitude,
              latitude: res.latitude,
              sendCityCode: res.cityCode,
            });
            orderStore.setreceiveAddressInfo({
              address: '',
              longitude: '',
              latitude: '',
              receiveCityCode: '',
            });
          }
        },
      );

      watch(
        () => formState.value.routeId,
        async () => {
          let info = formState.value?.routeId?.option?.info;
          console.log(29999, info);
          if (!!info) {
            let startAddress = `${info.startingProvinceName}${info.startingCityName}${info.startingAreaName}${info.startingAddress}`;
            let endAddress = `${info.destinationProvinceName}${info.destinationCityName}${info.destinationAreaName}${info.destinationAddress}`;
            orderStore.setAddressInfo({
              address: startAddress,
              sendCityCode: info.startingCity,
            });
            orderStore.setreceiveAddressInfo({
              address: endAddress,
              receiveCityCode: info.destinationCity,
            });
          }
        },
      );

      const orderStore = useOrderStore();

      const basicInfoRef = ref<FormInstance>();
      onMounted(async () => {});

      const searchData = reactive({
        data: [],
        value: [],
        fetching: false,
      });
      const onSearch = debounce(async (value) => {
        searchData.data = [];
        searchData.fetching = true;
        if (value != '') {
          let data = await getShopInfo(value);
          searchData.data = data.map((ele) => {
            return { value: ele.id, label: ele.shopName };
          });
          console.log(19999, searchData);
          searchData.fetching = false;
        }
      }, 500);

      const searchLineData = reactive({
        lineData: [],
        lineFetching: false,
      });

      const onSearchLineData = debounce(async (value) => {
        if (!formState.value.contractId) {
          message.error('请先选择合同');
          return;
        } else {
          searchLineData.lineData = [];
          searchLineData.lineFetching = true;
          if (value != '') {
            let data = await SearchLineListApi(value, formState.value.contractId.value);
            console.log(1111, data);
            searchLineData.lineData = data.map((ele) => {
              return { value: ele.id, label: `${ele.name} ${ele.routeCode}`, info: ele };
            });
            searchLineData.lineFetching = false;
          }
        }
      }, 500);

      const searchContractData = reactive({
        contractData: [],
        contractFetching: false,
      });

      const onSearchContractData = debounce(async (value) => {
        if (!formState.value.shopId) {
          message.error('请先选择门店');
          return;
        } else {
          searchContractData.contractData = [];
          searchContractData.contractFetching = true;
          if (value != '') {
            let data = await getContractNameApi(value, formState.value.shopId.value);
            searchContractData.contractData = data.map((ele) => {
              return {
                value: ele.id,
                label: `${ele.contractName} ${ele.contractCode}`,
                showLabel: ele.contractName,
              };
            });
            searchContractData.contractFetching = false;
          }
        }
      }, 500);

      const selectShop = (val) => {
        formState.value.shopName = val.label;
      };

      // 编辑
      watch(
        () => props.orderInfo,
        () => {
          console.log(9999, props.orderInfo.value.orderBaseInfo);
          formState.value.shopId = {
            key: props.orderInfo.value.orderBaseInfo?.shopId,
            value: props.orderInfo.value.orderBaseInfo?.shopId,
            label: props.orderInfo.value.orderBaseInfo?.shopName,
          };
          formState.value.contractId = {
            key: props.orderInfo.value.orderBaseInfo?.contractId,
            value: props.orderInfo.value.orderBaseInfo?.contractId,
            label: props.orderInfo.value.orderBaseInfo?.contractName,
          };
          contractName.value = `${props.orderInfo.value.orderBaseInfo?.contractName}`;
          formState.value.routeId = {
            key: props.orderInfo.value.orderBaseInfo?.routeId,
            value: props.orderInfo.value.orderBaseInfo?.routeId,
            label: props.orderInfo.value.orderBaseInfo?.routeName,
          };
          formState.value.serviceType = `${props.orderInfo.value.orderBaseInfo?.serviceType}`;

          formState.value.serviceCategoryId = `${props.orderInfo.value.orderBaseInfo?.serviceCategoryId}`;
          formState.value.serviceCategoryName = `${props.orderInfo.value.orderBaseInfo?.serviceCategoryName}`;

          formState.value.startTime = dayjs(props.orderInfo.value.orderBaseInfo?.startTime);
          formState.value.endTime = dayjs(props.orderInfo.value.orderBaseInfo?.endTime);
          formState.value.externalOrderCode =
            props.orderInfo.value.orderBaseInfo?.externalOrderCode;
          formState.value.externalBarcode = props.orderInfo.value.orderBaseInfo?.externalBarcode;
        },
        {
          deep: true,
        },
      );

      const triggerStartTime = () => {
        basicInfoRef.value.validateFields(['startTime']);
      };

      const triggerEndTime = () => {
        basicInfoRef.value.validateFields(['endTime']);
      };

      const calcTime1 = () => {
        let startTime = dayjs(formState.value.startTime).valueOf();
        let endTime = dayjs(formState.value.endTime).valueOf();
        if (!startTime) {
          return Promise.reject('请选择发车时间');
        }
        if (startTime && endTime) {
          if (startTime > endTime) {
            return Promise.reject('发车时间应在送达时间之前');
          }
        }
        return Promise.resolve();
      };
      const calcTime2 = () => {
        let startTime = dayjs(formState.value.startTime).valueOf();
        let endTime = dayjs(formState.value.endTime).valueOf();

        if (!endTime) {
          return Promise.reject('请选择送达时间');
        }
        if (startTime && endTime) {
          if (startTime > endTime) {
            return Promise.reject('送达时间应在发车时间之后');
          }
        }
        return Promise.resolve();
      };

      let contractName = ref();
      const getContractId = (val) => {
        contractName.value = val.option.showLabel;
        formState.value.contractId = val;
      };

      // 服务类别
      let serviceCategories = ref([]);
      watch(
        () => formState.value.serviceType,
        async () => {
          let data = await searchServiceCategoryApi({
            serviceType: toNumber(formState.value.serviceType),
            categoryName: '',
          });
          serviceCategories.value = data.map((ele) => {
            return { value: ele.id, label: ele.categoryName };
          });
          console.log(199, serviceCategories);
        },
        {
          immediate: true,
        },
      );

      const getServiceCategoryName = (val) => {
        for (let prop of serviceCategories.value) {
          if (prop.value == val) {
            formState.value.serviceCategoryName = prop.label;
          }
        }
      };

      return {
        formState,
        basicInfoRef,
        ...toRefs(searchData),
        onSearch,
        ...toRefs(searchLineData),
        onSearchLineData,
        ...toRefs(searchContractData),
        onSearchContractData,
        serviceTypes,
        selectShop,
        calcTime1,
        calcTime2,
        triggerStartTime,
        triggerEndTime,
        isEdit,
        getContractId,
        getServiceCategoryName,
        contractName,
        serviceCategories,
      };
    },
  });
</script>

<style scoped></style>
