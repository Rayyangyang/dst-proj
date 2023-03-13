<template>
  <div class="btn">
    <Button type="primary" class="mr-2" @click="add" :disabled="data.length > 9">添加</Button>
    <Button @click="delChecked">删除</Button>
  </div>

  <Table :row-selection="rowSelection" :columns="columns" :data-source="data" :pagination="false">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'cargoCode'">
        <span>
          货物系列
          <Tooltip placement="top" color="#fff">
            <template #title>
              <p style="color: #000">可代表货物的货架号或者货物商品的编码。</p>
            </template>
            <QuestionCircleOutlined style="margin-left: 10px; color: #19c280" />
          </Tooltip>
        </span>
      </template>
      <template
        v-if="
          ['cargoName', 'cargoNum', 'cargoWeight', 'cargoVolume', 'cargoMoney'].indexOf(
            column.dataIndex,
          ) != -1
        "
      >
        <span>
          <span style="color: red"> * </span>
          {{ column.title }}
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, text, record, index }">
      <div v-if="column.dataIndex == 'cargoName'">
        <Input
          v-model:value="data[index][column.dataIndex]"
          placeholder="货物名称"
          :maxlength="100"
          :class="data[index]?.cargoName == '' ? 'inp-error' : ''"
        />
        <p v-if="data[index]?.cargoName == ''" class="error-text">不能为空</p>
      </div>
      <div v-else-if="column.dataIndex == 'cargoCode'">
        <Input
          v-model:value="data[index][column.dataIndex]"
          placeholder="货物系列"
          :maxlength="100"
        />
      </div>
      <div v-else-if="column.dataIndex == 'cargoNum'">
        <InputNumber
          v-model:value="data[index][column.dataIndex]"
          :maxlength="3"
          placeholder="货物数量"
          min="0"
          :parser="limitNumber"
          :class="data[index]?.cargoNum == null ? 'inp-error' : ''"
        />
        <p v-if="data[index]?.cargoNum == null" class="error-text">不能为空</p>
      </div>
      <div v-else-if="column.dataIndex == 'cargoWeight'">
        <Input
          v-model:value="data[index][column.dataIndex]"
          :maxlength="6"
          placeholder="货物重量"
          min="0"
          :class="data[index]?.cargoWeight == null ? 'inp-error' : ''"
          @input="
            data[index].cargoWeight = data[index].cargoWeight
              .replace(/[^0-9.]/g, '')
              .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
          "
        />
        <p v-if="data[index]?.cargoWeight == null" class="error-text">不能为空</p>
      </div>
      <div v-else-if="column.dataIndex == 'cargoVolume'">
        <Input
          v-model:value="data[index][column.dataIndex]"
          :maxlength="6"
          placeholder="货物体积"
          min="0"
          @input="
            data[index].cargoVolume = data[index].cargoVolume
              .replace(/[^0-9.]/g, '')
              .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
          "
          :class="data[index]?.cargoVolume == null ? 'inp-error' : ''"
        />
        <p v-if="data[index]?.cargoVolume == null" class="error-text">不能为空</p>
      </div>
      <div v-else-if="column.dataIndex == 'cargoMoney'">
        <Input
          v-model:value="data[index][column.dataIndex]"
          :maxlength="100"
          placeholder="货物金额"
          :class="data[index]?.cargoMoney == '' ? 'inp-error' : ''"
          @input="
            data[index].cargoMoney = data[index].cargoMoney
              .replace(/[^0-9.]/g, '')
              .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
          "
        />
        <p v-if="data[index]?.cargoMoney == ''" class="error-text">不能为空</p>
      </div>
      <div v-else-if="column.dataIndex == 'cargoTaxMoney'">
        <Input
          v-model:value="data[index][column.dataIndex]"
          :maxlength="100"
          placeholder="含税金额"
        />
      </div>
      <div v-else-if="column.dataIndex == 'cargoNotTaxMoney'">
        <Input
          v-model:value="data[index][column.dataIndex]"
          :maxlength="100"
          placeholder="不含税金额"
        />
      </div>
      <div v-else-if="column.dataIndex == 'taxMoney'">
        <Input v-model:value="data[index][column.dataIndex]" :maxlength="100" placeholder="税金" />
      </div>
      <div v-else>
        <Input
          v-model:value="data[index][column.dataIndex]"
          :placeholder="columns[index + 1].title"
        />
      </div>
    </template>

    <template #summary>
      <SummaryRow>
        <SummaryCell style="width: 80px; text-align: center"> 合计 </SummaryCell>
        <SummaryCell> {{ null }}</SummaryCell>
        <SummaryCell> {{ null }}</SummaryCell>
        <SummaryCell> {{ totals.totalCargoNum }}</SummaryCell>
        <SummaryCell> {{ totals.totalCargoWeight }}</SummaryCell>
        <SummaryCell> {{ totals.totalCargoVolume }}</SummaryCell>
        <SummaryCell> {{ totals.totalCargoMoney }}</SummaryCell>
        <SummaryCell> {{ totals.totalCargoTaxMoney }}</SummaryCell>
        <SummaryCell> {{ totals.totalCargoNotTaxMoney }}</SummaryCell>
        <SummaryCell> {{ totals.totalTaxMoney }}</SummaryCell>
      </SummaryRow>
    </template>
  </Table>
</template>

<script setup lang="ts">
  import { ref, computed, defineExpose, defineProps, watch } from 'vue';
  import { Button, Card, Table, Form, Input, InputNumber, Tooltip } from 'ant-design-vue';
  import { toNumber, cloneDeep } from 'lodash-es';
  import { validateSendMoney, validateVolume } from '/@/utils/validtor';
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';

  const { Cell: SummaryCell, Row: SummaryRow } = Table.Summary;

  const columns = ref([
    {
      title: '货物名称',
      dataIndex: 'cargoName',
    },
    {
      title: '货物系列',
      dataIndex: 'cargoCode',
      key: 'cargoCode',
    },
    {
      title: '数量',
      dataIndex: 'cargoNum',
    },
    {
      title: '重量(kg)',
      dataIndex: 'cargoWeight',
    },
    {
      title: '体积(m³)',
      dataIndex: 'cargoVolume',
    },
    {
      title: '货物金额',
      dataIndex: 'cargoMoney',
    },
    {
      title: '含税金额',
      dataIndex: 'cargoTaxMoney',
    },
    {
      title: '不含税金额',
      dataIndex: 'cargoNotTaxMoney',
    },
    {
      title: '税金',
      dataIndex: 'taxMoney',
    },
  ]);
  const data = ref([]);

  const totals = computed(() => {
    let totalCargoWeight = 0;
    let totalCargoNum = 0;
    let totalCargoVolume = 0;
    let totalCargoMoney = 0;
    let totalCargoTaxMoney = 0;
    let totalCargoNotTaxMoney = 0;
    let totalTaxMoney = 0;
    data.value.forEach(
      ({
        cargoWeight,
        cargoNum,
        cargoVolume,
        cargoMoney,
        cargoTaxMoney,
        cargoNotTaxMoney,
        taxMoney,
      }) => {
        totalCargoWeight += cargoWeight ? toNumber(cargoWeight) : 0;
        totalCargoNum += cargoNum ? toNumber(cargoNum) : 0;
        totalCargoVolume += cargoVolume ? toNumber(cargoVolume) : 0;
        totalCargoMoney += cargoMoney ? toNumber(cargoMoney) : 0;
        totalCargoTaxMoney += cargoTaxMoney ? toNumber(cargoTaxMoney) : 0;
        totalCargoNotTaxMoney += cargoNotTaxMoney ? toNumber(cargoNotTaxMoney) : 0;
        totalTaxMoney += taxMoney ? toNumber(taxMoney) : 0;
      },
    );
    return {
      totalCargoWeight,
      totalCargoNum,
      totalCargoVolume,
      totalCargoMoney,
      totalCargoTaxMoney,
      totalCargoNotTaxMoney,
      totalTaxMoney,
    };
  });

  const delChecked = () => {
    let copyData = cloneDeep(data.value);

    data.value = copyData.filter((ele) => {
      return checkedList.value.indexOf(ele.key) == -1;
    });
  };
  const props = defineProps(['orderInfo']);

  watch(
    () => props.orderInfo,
    () => {
      console.log(9999, props.orderInfo.value.orderCargoList);
      data.value = props.orderInfo.value.orderCargoList;
    },
    {
      deep: true,
    },
  );

  let checkedList = ref();

  const rowSelection = {
    onChange: (selectedRowKeys: string[]) => {
      console.log(1888, selectedRowKeys);
      checkedList.value = selectedRowKeys;
    },
    getCheckboxProps: (record: DataType) => ({
      name: record.name,
    }),
  };

  const limitNumber = (value) => {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/\./g, '') : 0;
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/\./g, '') : 0;
    } else {
      return 0;
    }
  };

  const add = () => {
    let baseData = {
      cargoName: '',
      cargoCode: '',
      cargoWeight: null,
      cargoNum: null,
      cargoVolume: null,
      cargoMoney: '',
      cargoTaxMoney: '',
      cargoNotTaxMoney: '',
      taxMoney: '',
      key: new Date().getTime(),
    };

    data.value.push(baseData);
  };

  // 货物copy
  let copyDataValidate = ref([]);

  let calcGoodsInfo = () => {
    console.log(999);
    copyDataValidate.value = [...data.value];
  };

  defineExpose({
    data,
    calcGoodsInfo,
  });
</script>

<style scoped lang="less">
  .btn {
    margin-bottom: 16px;
  }
  .inp-error {
    border-color: #ed6f6f;
  }
  .error-text {
    margin: 0px;
    color: #ed6f6f;
    position: absolute;
  }

  :deep(.ant-table-tbody > tr > td) {
    padding-bottom: 30px !important;
  }
</style>
