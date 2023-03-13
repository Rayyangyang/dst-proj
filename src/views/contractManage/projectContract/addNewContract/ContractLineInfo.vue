<template>
  <Card title="合同线路信息" :bordered="false" class="!mt-5">
    <Row :gutter="24" class="!mb-5">
      <Col :span="20" style="display: flex; align-items: center">
        <span style="width: 80px"> 线路名称 </span>
        <div>
          <Select
            v-model:value="line"
            showSearch
            label-in-value
            placeholder="请输入线路名称/线路编码"
            style="width: 60vw"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            :options="data"
            allowClear
            :maxlength="10"
            @search="onSearch"
            @select="selectLine"
          >
            <template v-if="fetching" #notFoundContent>
              <Spin size="small" />
            </template>
          </Select>
        </div>
      </Col>
      <Col :span="2">
        <Button
          type="primary"
          style="margin-left: 20px"
          @click="addLine"
          :disabled="tableData.length > 99"
          >添加</Button
        >
      </Col>
    </Row>

    <Table :columns="columns" :data-source="tableData" :pagination="false" :scroll="{ y: 400 }">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'action'">
          <Button type="primary" @click="del(index)">删除</Button>
        </template>
      </template>
    </Table>
  </Card>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, toRefs, watch } from 'vue';
  import { Card, Row, Col, Select, Table, Button, message, Spin } from 'ant-design-vue';
  import { debounce } from 'lodash-es';
  import { SearchLineListApi } from '/@/api/lineManageMent/lineManagement';

  const columns = [
    {
      title: '线路编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '线路名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '外部线路编码',
      dataIndex: 'custormRouteCode',
      key: 'custormRouteCode',
    },
    {
      title: '运营城市',
      key: 'city',
      dataIndex: 'city',
    },
    {
      title: '出发地',
      key: 'start',
      dataIndex: 'start',
    },
    {
      title: '到达地',
      key: 'arrive',
      dataIndex: 'arrive',
    },
    {
      title: '操作',
      key: 'action',
    },
  ];

  export default defineComponent({
    name: 'ContractLineInfo',
    components: {
      Card,
      Row,
      Col,
      Select,
      Table,
      Button,
      Spin,
    },
    props: {
      contractInfo: {
        default: () => {},
        type: Object,
      },
    },
    emits: ['changeRegisterArea'],
    setup(props) {
      const line = ref();
      const tableData = ref([]);
      const searchData = reactive({
        data: [],
        value: [],
        fetching: false,
      });

      watch(
        () => props.contractInfo,
        () => {
          tableData.value = props.contractInfo.value?.oocRouteInfoList.map((ele) => {
            return {
              id: ele.id,
              code: ele.routeCode,
              name: ele.name,
              custormRouteCode: ele.externalRouteCode,
              city: ele.cityName,
              start: `${ele.startingCityName}${ele.startingAddress}`,
              arrive: `${ele.destinationCityName}${ele.destinationAddress}`,
            };
          });
        },
        {
          deep: true,
        },
      );

      const onSearch = debounce(async (value) => {
        searchData.data = [];
        searchData.fetching = true;
        // if (value != '') {
        let data = await SearchLineListApi(value);
        searchData.data = data.map((ele) => {
          let name = `线路名称：${ele.name}  线路编码：${ele.routeCode}  出发地：${ele.startingCityName}${ele.startingAddress}  目的地：${ele.destinationCityName}${ele.destinationAddress} 创建人：${ele.creatorName}`;
          return { value: ele.id, label: name, ...ele };
        });
        searchData.fetching = false;
        // }
      }, 500);

      let curLineInfo = ref();
      const selectLine = async (val, options) => {
        console.log(18888, options);
        curLineInfo.value = options;
      };

      const addLine = () => {
        let obj = {
          id: curLineInfo.value.id,
          code: curLineInfo.value.routeCode,
          name: curLineInfo.value.name,
          custormRouteCode: curLineInfo.value.externalRouteCode,
          city: curLineInfo.value.cityName,
          start: `${curLineInfo.value.startingCityName}${curLineInfo.value.startingAddress}`,
          arrive: `${curLineInfo.value.destinationCityName}${curLineInfo.value.destinationAddress}`,
        };

        let arrCode = tableData.value.map((ele) => ele.code);

        if (arrCode.indexOf(obj.code) != -1) {
          message.error('不能添加重复线路');
          return;
        } else {
          tableData.value.push(obj);
        }
        line.value = undefined;
      };
      const del = (index) => {
        console.log(index);
        tableData.value.splice(index, 1);
      };
      return {
        line,
        columns,
        onSearch,
        selectLine,
        tableData,
        addLine,
        del,
        ...toRefs(searchData),
      };
    },
  });
</script>

<style scoped>
  .remark {
    margin-bottom: 0;
    color: #888;
  }
</style>
