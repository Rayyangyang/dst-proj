<template>
  <PageWrapper class="high-form" :isReactive="false">
    <a-card :bordered="false">
      <MyForm :model="formState" name="basic" autocomplete="off" ref="lineRef" labelAlign="left">
        <Row :gutter="24">
          <Col :span="12">
            <FormItem
              label="线路名称"
              :labelCol="{ span: 4 }"
              name="name"
              labelAlign="left"
              :rules="[{ required: true, message: '请输入线路名称' }]"
            >
              <Input v-model:value="formState.name" placeholder="请输入" :maxlength="100" />
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem
              label="外部线路编码"
              name="externalRouteCode"
              labelAlign="left"
              :labelCol="{ span: 6 }"
            >
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
              :rules="[{ required: true, message: '请选择出发地' }]"
            >
              <!-- <Cascader
                :field-names="{ label: 'name', value: 'code' }"
                v-model:value="formState.startingAddressCode"
                :options="areas"
                @change="selectStartAdress"
                placeholder="请选择省市"
              /> -->

              <Select
                v-model:value="formState.startingAddressCode"
                showSearch
                label-in-value
                placeholder="请选择"
                style="width: 100%"
                :filter-option="false"
                :not-found-content="fetching ? undefined : null"
                :options="data"
                allowClear
                :maxlength="10"
                @search="onSearchStart"
                @change="selectStartCity"
              >
                <template v-if="fetching" #notFoundContent>
                  <Spin size="small" />
                </template>
              </Select>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem :labelCol="{ span: 6 }" label="详细地址" name="startingAddress	">
              <Input
                v-model:value="formState.startingAddress"
                placeholder="请输入"
                :maxlength="100"
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
              :rules="[{ required: true, message: '请选择目的地' }]"
            >
              <!-- <Cascader
                :field-names="{ label: 'name', value: 'code' }"
                v-model:value="formState.destinationAddressCode"
                :options="areas"
                @change="selectEndAdress"
                placeholder="请选择省市"
              /> -->

              <Select
                v-model:value="formState.destinationAddressCode"
                showSearch
                label-in-value
                placeholder="请选择"
                style="width: 100%"
                :filter-option="false"
                :not-found-content="endFetching ? undefined : null"
                :options="endData"
                allowClear
                :maxlength="10"
                @search="onSearchEnd"
                @change="selectEndCity"
              >
                <template v-if="endFetching" #notFoundContent>
                  <Spin size="small" />
                </template>
              </Select>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="详细地址" name="destinationAddress" :labelCol="{ span: 6 }">
              <Input
                v-model:value="formState.destinationAddress"
                placeholder="请输入"
                :maxlength="100"
              />
            </FormItem>
          </Col>
        </Row>
      </MyForm>
      <div class="add-btn">
        <Button type="primary" @click="addNewLine" :disabled="lines.length > 49">添加</Button>
      </div>
    </a-card>
    <a-card>
      <Table :columns="columns" :data-source="lines" :pagination="false" :scroll="{ y: 400 }">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'action'">
            <Button type="primary" @click="removeLine(index)">删除</Button>
          </template>
        </template>
      </Table>
      <div class="sub-btn">
        <Button type="primary" class="mt-5" @click="sbumit">提交</Button>
      </div>
    </a-card>
  </PageWrapper>
</template>

<script lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { defineComponent, ref, onMounted, toRefs, reactive } from 'vue';
  import {
    Card,
    Form,
    FormItem,
    Row,
    Col,
    Cascader,
    Input,
    Button,
    Table,
    message,
    Select,
  } from 'ant-design-vue';
  import type { UploadProps, FormInstance, CascaderProps } from 'ant-design-vue';
  import { getAreaProCityTreeApi } from '/@/api/common/dicts';
  import { addNewlinesApi, getLineCityApi } from '/@/api/lineManageMent/lineManagement';
  import { useRouter } from 'vue-router';
  import { cloneDeep, debounce } from 'lodash-es';
  import { useReloadPage } from '/@/store/modules/reloadPage';

  const columns = [
    {
      title: '线路名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '外部线路编码',
      dataIndex: 'externalRouteCode',
      key: 'externalRouteCode',
    },
    {
      title: '运营城市',
      key: 'cityName',
      dataIndex: 'cityName',
    },
    {
      title: '出发地',
      key: 'start',
      dataIndex: 'start',
    },
    {
      title: '目的地',
      key: 'arrive',
      dataIndex: 'arrive',
    },
    {
      title: '操作',
      key: 'action',
    },
  ];

  export default defineComponent({
    name: 'AddNewLineTemp',
    components: {
      [Card.name]: Card,
      PageWrapper,
      MyForm: Form,
      FormItem,
      Row,
      Col,
      Cascader,
      Table,
      Input,
      Button,
      Select,
    },
    setup() {
      let formState = ref({
        name: '',
        externalRouteCode: '',
        startingAddressCode: undefined, //出发地code
        startOption: '',
        endOption: '',
        destinationAddressCode: undefined, //目的地code
        startingAddress: '',
        destinationAddress: '',
      });
      const reloadPage = useReloadPage();

      const router = useRouter();
      let lines = ref<string[]>([]);
      let curLine = ref<string[]>();
      const lineRef = ref<FormInstance>();

      let areas = ref();
      onMounted(async () => {
        areas.value = (await getAreaProCityTreeApi())[0].children;
      });

      const addNewLine = () => {
        console.log(123, formState);
        Promise.all([lineRef.value?.validate()]).then(async () => {
          let copyFormState = cloneDeep(formState.value);

          let obj = {
            name: copyFormState.name,
            externalRouteCode: copyFormState?.externalRouteCode,
            start: `${copyFormState.startingAddressCode}${copyFormState.startingAddress}`,
            arrive: `${copyFormState.destinationAddressCode}${copyFormState.destinationAddress}`,
            cityName: copyFormState.startOption.cityCodeName,
            city: copyFormState.startOption.cityCode,
            startingProvince: copyFormState.startOption.pcode,
            startingCity: copyFormState.startOption.cityCode,
            destinationProvince: copyFormState.endOption.pcode,
            destinationCity: copyFormState.endOption.cityCode,
            startingAddress: copyFormState.startingAddress,
            destinationAddress: copyFormState.destinationAddress,
          };
          lines.value.push(cloneDeep(obj));
          // 清空formState
          formState.value = {
            name: '',
            externalRouteCode: '',
            startingAddressCode: '', //出发地code
            destinationAddressCode: '', //目的地code
            startingAddress: '',
            destinationAddress: '',
          };
        });
      };

      const removeLine = (index) => {
        lines.value.splice(index, 1);
      };

      const sbumit = async () => {
        // let subData = {
        //   name: formState.value.name,
        //   externalRouteCode: formState.value.externalRouteCode,
        //   startingAddress: formState.value.startingAddress,
        //   destinationAddress: formState.value.startingAddress,
        // };
        if (lines.value.length == 0) {
          message.error('未添加任何线路');
          return;
        }

        let subData = [];
        for (let prop of lines.value) {
          let obj = {
            name: prop.name,
            externalRouteCode: prop.externalRouteCode,
            startingAddress: prop.startingAddress,
            destinationAddress: prop.destinationAddress,
            city: prop.city,
            startingProvince: prop.startingProvince,
            startingCity: prop.startingCity,
            startingArea: prop.startingArea,
            destinationProvince: prop.destinationProvince,
            destinationCity: prop.destinationCity,
            destinationArea: prop.destinationArea,
          };
          subData.push(obj);
        }

        console.log(888899, subData);

        await addNewlinesApi(subData);

        message.success('新增成功');
        router.push({
          name: 'LineManagement',
        });
        reloadPage.setLinePageReload();
      };

      let startName = ref();
      let startCity = ref();
      let endName = ref();
      const selectStartAdress = (val, options) => {
        startCity.value = options[1].name;
        startName.value = `${options[1].name}`;
      };
      const selectEndAdress = (val, options) => {
        endName.value = `${options[1].name}`;
      };

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
        formState.value.destinationAddressCode = `${val.option.option.pname}/${val.option.option.cityCodeName}`;
      };

      return {
        formState,
        onSearchStart,
        ...toRefs(searchStartData),
        ...toRefs(searchEndData),
        onSearchEnd,
        selectEndCity,
        areas,
        columns,
        lines,
        lineRef,
        addNewLine,
        removeLine,
        sbumit,
        selectEndAdress,
        selectStartAdress,
        selectStartCity,
      };
    },
  });
</script>

<style scoped>
  .add-btn {
    width: 100%;
    text-align: right;
  }
</style>
