<template>
  <MyForm :model="formState" name="basic" autocomplete="off" ref="addressInfoRef" labelAlign="left">
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="发货地"
          :labelCol="{ span: 6 }"
          name="sendAddress"
          labelAlign="left"
          :rules="[{ required: true, message: '请输入发货地' }]"
        >
          <div class="address-content" :class="isEdit ? 'disabledStyle' : ''">
            <p
              v-if="formState.sendAddress.value == ''"
              @click="handleOpenAddress('sendAddress')"
              style="color: #bbb"
              >发货地详细地址</p
            >
            <p @click="handleOpenAddress('sendAddress')" v-else>{{
              formState.sendAddress.label
            }}</p>
            <ContactsOutlined
              v-if="!isEdit"
              style="font-size: 16px; cursor: pointer"
              @click="showAddressBook('sendAddress')"
            />
          </div>
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="收货地"
          name="receiveAddress"
          labelAlign="left"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, message: '请输入收货地' }]"
        >
          <div class="address-content" :class="isEdit ? 'disabledStyle' : ''">
            <p
              v-if="formState.receiveAddress.value == ''"
              @click="handleOpenAddress('receiveAddress')"
              style="color: #bbb"
              >收货地详细地址</p
            >
            <p @click="handleOpenAddress('receiveAddress')">{{ formState.receiveAddress.label }}</p>
            <ContactsOutlined
              v-if="!isEdit"
              style="font-size: 16px; cursor: pointer"
              @click="showAddressBook('receiveAddress')"
            />
          </div>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="发货人姓名"
          name="sendName"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, validator: validatorChinese }]"
        >
          <Input v-model:value="formState.sendName" :maxlength="5" placeholder="请输入发货人姓名" />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, validator: validatorChinese }]"
          label="收货人姓名"
          name="receiveName"
        >
          <Input
            v-model:value="formState.receiveName"
            :maxlength="5"
            placeholder="请输入收货人姓名"
          />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="发货人电话"
          name="sendPhone"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, validator: validatorPhoneNum2 }]"
        >
          <Input
            v-model:value="formState.sendPhone"
            :maxlength="12"
            placeholder="请输入发货人电话"
          />
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem
          label="收货人电话"
          name="receivePhone"
          labelAlign="left"
          :labelCol="{ span: 6 }"
          :rules="[{ required: true, validator: validatorPhoneNum2 }]"
        >
          <Input
            v-model:value="formState.receivePhone"
            :maxlength="12"
            placeholder="请输入收货人电话"
          />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="24" v-if="!isEdit">
      <Col :span="12">
        <FormItem label="" name="sendChecked" :labelCol="{ span: 6 }">
          <Checkbox v-model:checked="formState.sendChecked"> 保存到地址簿 </Checkbox>
        </FormItem>
      </Col>
      <Col :span="12">
        <FormItem label="" name="receiveChecked" labelAlign="left" :labelCol="{ span: 6 }">
          <Checkbox v-model:checked="formState.receiveChecked"> 保存到地址簿 </Checkbox>
        </FormItem>
      </Col>
    </Row>
  </MyForm>

  <!-- 地图弹框 -->
  <MapModal @register="registerMap" @setAddressInfo="handleAddressInfo" />

  <!-- 地址簿弹框 -->
  <Modal v-model:visible="addressBookVisible" title="地址簿" width="70%" :zIndex="1000">
    <div>
      <Table
        :columns="columns"
        :data-source="addressBookData"
        :row-selection="rowSelection"
        :pagination="false"
        type="radio"
      >
        <template #headerCell="{ column }">
          <template></template>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'addressInfo'">
            <p style="font-weight: bold">{{ record.address }}</p>
            <p>{{ record.name }}&nbsp;&nbsp;{{ record.phone }}</p>
          </template>
          <template v-if="column.key === 'action'">
            <Button type="primary" style="margin-right: 10px" @click="editAddresBook(record)"
              >编辑</Button
            >
            <Button danger @click="delAddressBook(record)">删除</Button>
          </template>
        </template>
      </Table>
    </div>

    <template #footer>
      <Button type="dashed" style="color: #19c280; border-color: #19c280" @click="addNewAddres"
        >新增地址</Button
      >
      <Button @click="addressBookVisible = false">取消</Button>
      <Button type="primary" @click="confirmAddress">确定</Button>
    </template>
  </Modal>

  <!-- 新增地址簿 -->
  <Modal
    v-model:visible="addAddressBookVisible"
    :title="addressBookTitle"
    @ok="confirmAddNewBook"
    @cancel="
      () => {
        addressBookState = {
          city: '',
          area: '',
          address: '',
          name: '',
          phone: '',
          houseNumber: '',
          longitude: '',
          latitude: '',
          addresInfo: '',
        };
      }
    "
    width="40%"
    :zIndex="1001"
  >
    <MyForm
      :model="addressBookState"
      name="addresBook"
      style="margin: 20px"
      :label-col="labelCol"
      ref="addresBookRef"
    >
      <FormItem label="姓名" name="name" :rules="[{ required: true, validator: validatorChinese }]">
        <Input
          placeholder="请输入联系人姓名"
          v-model:value="addressBookState.name"
          :maxlength="10"
        />
      </FormItem>

      <FormItem
        label="电话"
        name="phone"
        :rules="[{ required: true, validator: validatorPhoneNum2 }]"
      >
        <Input
          placeholder="请输入电话"
          v-model:value="addressBookState.phone"
          :maxlength="12"
          @input="addressBookState.phone = addressBookState.phone.replace(/[^\d]/gi, '')"
        />
      </FormItem>

      <FormItem label="地址" name="addresInfo" :rules="[{ required: true, message: '请选择地址' }]">
        <Input
          placeholder="请选择"
          @click="handleOpenAddress('addAddresBook')"
          v-model:value="addressBookState.address"
        />
      </FormItem>

      <FormItem label="门牌楼层" name="houseNumber">
        <Input
          placeholder="门牌/楼层信息"
          v-model:value="addressBookState.houseNumber"
          :maxlength="50"
        />
      </FormItem>
    </MyForm>
  </Modal>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, watch } from 'vue';
  import {
    Card,
    Form,
    FormItem,
    Row,
    Col,
    Input,
    Modal,
    Table,
    Button,
    Checkbox,
    message,
  } from 'ant-design-vue';
  import type { FormInstance } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import MapModal from '/@/components/Map/index.vue';
  import { validatorPhoneNum2, validatorChinese } from '/@/utils/validtor';
  import { ContactsOutlined } from '@ant-design/icons-vue';
  import { useOrderStore } from '/@/store/modules/order';
  import {
    getAddressListApi,
    addAddressListApi,
    delAddressBookApi,
    editAddressListApi,
  } from '/@/api/orderManage/orderManage';
  import { useRoute } from 'vue-router';

  import { toNumber } from 'lodash';
  interface FormState {
    sendAddress: Object;
    receiveAddress: Object;
    sendPhone: String;
    receivePhone: String;
    sendName: String;
    receiveName: String;
    receiveChecked: Boolean;
    sendChecked: Boolean;
  }

  const columns = [
    {
      title: '地址',
      key: 'addressInfo',
      dataIndex: 'addressInfo',
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
    },
  ];

  export default defineComponent({
    name: 'AddressInfo',
    components: {
      [Card.name]: Card,
      MyForm: Form,
      FormItem,
      Row,
      Col,
      Input,
      Modal,
      Button,
      MapModal,
      Table,
      Checkbox,
      ContactsOutlined,
    },
    props: {
      orderInfo: {
        default: () => {},
        type: Object,
      },
    },
    emits: ['changeRegisterArea'],
    setup(props) {
      let formState = ref<FormState>({
        sendAddress: {
          value: '',
          label: '',
          sendCityCode: '',
        },
        receiveAddress: {
          value: '',
          label: '',
          receiveCityCode: '',
        },
        sendPhone: '',
        receivePhone: '',
        sendName: '',
        receiveName: '',
        receiveChecked: false,
        sendChecked: false,
      });
      const orderStore = useOrderStore();
      let route = useRoute();
      let isEdit = ref(false);

      watch(
        () => orderStore.sendAddresInfo,
        () => {
          console.log(1111, orderStore.sendAddresInfo);
          formState.value.sendAddress.value = `${orderStore.sendAddresInfo.longitude}, ${orderStore.sendAddresInfo.latitude}`;
          formState.value.sendAddress.label = orderStore.sendAddresInfo.address;
          formState.value.sendAddress.sendCityCode = orderStore.sendAddresInfo.sendCityCode;
        },
        {
          deep: true,
        },
      );
      watch(
        () => orderStore.receiveAddresInfo,
        () => {
          console.log(1111, orderStore.receiveAddresInfo);
          formState.value.receiveAddress.value = `${orderStore.receiveAddresInfo?.longitude}, ${orderStore.receiveAddresInfo?.latitude}`;
          formState.value.receiveAddress.label = orderStore.receiveAddresInfo.address;
          formState.value.receiveAddress.receiveCityCode =
            orderStore.receiveAddresInfo.receiveCityCode;
        },
        {
          deep: true,
        },
      );

      let addressBookData = ref([]);

      let getAddressList = async () => {
        addressBookData.value = await getAddressListApi();
        for (let prop of addressBookData.value) {
          prop.addressInfo = prop;
          prop.key = prop.id;
        }
      };

      let curSelectAddressBook = ref();

      const rowSelection: TableProps['rowSelection'] = {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          curSelectAddressBook.value = selectedRows;
        },
        getCheckboxProps: (record: DataType) => ({
          name: record.name,
        }),
      };
      const addressBookVisible = ref(false);

      const addressInfoRef = ref<FormInstance>();

      const showAddressBook = async (val) => {
        curClickAddress.value = val;
        await getAddressList();
        addressBookVisible.value = true;
      };
      onMounted(async () => {
        if (route.query?.orderId) {
          isEdit.value = true;
        }
      });

      const addresBookRef = ref();

      const handleAddressInfo = (data?: any) => {
        console.log(199, data);

        if (curClickAddress.value == 'sendAddress') {
          formState.value.sendAddress.label = data.label;
          formState.value.sendAddress.value = data.value;
          formState.value.sendAddress.sendCityCode = data.cityCode;
        }
        if (curClickAddress.value == 'receiveAddress') {
          formState.value.receiveAddress.label = data.label;
          formState.value.receiveAddress.value = data.value;
          formState.value.receiveAddress.receiveCityCode = data.cityCode;
        }

        if (curClickAddress.value == 'addAddresBook') {
          addressBookState.value.addresInfo = data;
          addressBookState.value.address = data.label;
          addressBookState.value.area = data.adcode;
          addressBookState.value.city = data.cityCode;
        }

        // console.log('handleAddressInfo', data);
        // state.formState.shopAddress = data?.label || '';
        // state.formState.location = data?.value || '';
        // state.formState.cityCode = data?.cityCode || '';

        // if (state.formState?.location) {
        //   unref(formRef as any).clearValidate('shopAddress');
        // }
      };

      const confirmAddress = () => {
        console.log(1999, curSelectAddressBook);
        if (curClickAddress.value == 'sendAddress') {
          formState.value.sendAddress.value = `${curSelectAddressBook.value[0].longitude}, ${curSelectAddressBook.value[0].latitude}`;
          formState.value.sendAddress.label = curSelectAddressBook.value[0].address;
          formState.value.sendName = curSelectAddressBook.value[0].name;
          formState.value.sendPhone = curSelectAddressBook.value[0].phone;
          formState.value.sendAddress.sendCityCode = curSelectAddressBook.value[0].city;
        }
        if (curClickAddress.value == 'receiveAddress') {
          formState.value.receiveAddress.value = `${curSelectAddressBook.value[0].longitude}, ${curSelectAddressBook.value[0].latitude}`;
          formState.value.receiveAddress.label = curSelectAddressBook.value[0].address;
          formState.value.receiveName = curSelectAddressBook.value[0].name;
          formState.value.receivePhone = curSelectAddressBook.value[0].phone;
          formState.value.receiveAddress.receiveCityCode = curSelectAddressBook.value[0].city;
        }

        addressBookVisible.value = false;
      };

      const [registerMap, { openModal: hanleOpenMap }] = useModal();

      let curClickAddress = ref();

      const handleOpenAddress = (val) => {
        if (isEdit.value) {
          return;
        }
        console.log('val', val, formState.value, addressBookState.value.address);
        // 判断val
        curClickAddress.value = val;
        let address = '';
        if (val == 'sendAddress') {
          curLocation.value = formState.value.sendAddress?.value;
          address = formState.value.sendAddress?.label || '';
          console.log(1888, curLocation);
        }
        if (val == 'receiveAddress') {
          curLocation.value = formState.value.receiveAddress?.value;
          address = formState.value.receiveAddress?.label || '';
        }

        if (val === 'addAddresBook') {
          address = addressBookState.value?.address || '';
        }

        console.log(1999, curLocation, address);

        hanleOpenMap(true, {
          location: curLocation.value?.toString().indexOf(',') ? curLocation.value?.toString() : '', // 由于这边并不是经纬度拼接的,。而是地址，所以判断，防止地图组件报错
          address,
        });
      };

      const addAddressBookVisible = ref(false);
      let isEditBook = ref(false);
      const addNewAddres = () => {
        addressBookTitle.value = '新增地址簿';
        addAddressBookVisible.value = true;
        isEditBook.value = false;
      };

      const addressBookState = ref({
        city: '',
        area: '',
        address: '',
        name: '',
        phone: '',
        houseNumber: '',
        longitude: '',
        latitude: '',
        addresInfo: '',
      });

      const confirmAddNewBook = () => {
        Promise.all([addresBookRef.value.validate()]).then(async () => {
          let subObj = {
            city: addressBookState.value.city,
            area: addressBookState.value.area,
            address: addressBookState.value.address,
            name: addressBookState.value.name,
            phone: addressBookState.value.phone,
            houseNumber: addressBookState.value.houseNumber,
            longitude: addressBookState.value.addresInfo?.value?.split(',')[0],
            latitude: addressBookState.value.addresInfo?.value?.split(',')[1],
          };

          if (isEditBook.value) {
            await editAddressListApi({
              ...subObj,
              id: curEditBookId.value,
            });
            message.success('地址簿修改成功');
          } else {
            await addAddressListApi(subObj);
            message.success('地址簿添加成功');
          }
          addAddressBookVisible.value = false;
          await getAddressList();
        });
      };

      const addressBookTitle = ref('新增地址簿');

      let curLocation = ref();
      let curEditBookId = ref();
      const editAddresBook = (record) => {
        addressBookTitle.value = '编辑地址簿';
        addAddressBookVisible.value = true;
        curEditBookId.value = record.id;
        isEditBook.value = true;
        console.log(1888, record);
        addressBookState.value = {
          name: record.name,
          phone: record.phone,
          houseNumber: record.houseNumber,
          address: record.address,
          city: record.city,
          area: record.area,
          addresInfo: {
            value: `${record.longitude}, ${record.latitude}`,
            label: record.address,
            cityCode: record.city,
            adcode: record.area,
          },
        };
        curLocation.value = `${record.longitude}, ${record.latitude}`;
      };

      const delAddressBook = async (val) => {
        await delAddressBookApi(val.id);
        await getAddressList();
      };

      watch(
        () => props.orderInfo,
        () => {
          console.log(9999, props.orderInfo.value.orderAddress);
          formState.value.sendAddress = {
            value: props.orderInfo.value.orderAddress.sendAddress,
            label: props.orderInfo.value.orderAddress.sendAddress,
            sendCityCode: props.orderInfo.value.orderAddress.sendCityCode,
          };
          formState.value.receiveAddress = {
            value: props.orderInfo.value.orderAddress.receiveAddress,
            label: props.orderInfo.value.orderAddress.receiveAddress,
            receiveCityCode: props.orderInfo.value.orderAddress.receiveCityCode,
          };
          formState.value.sendPhone = props.orderInfo.value.orderAddress.sendPhone;
          formState.value.receivePhone = props.orderInfo.value.orderAddress.receivePhone;
          formState.value.sendName = props.orderInfo.value.orderAddress.sendName;
          formState.value.receiveName = props.orderInfo.value.orderAddress.receiveName;
          formState.value.sendChecked =
            props.orderInfo.value.orderAddress.sendSaveFlag == 0 ? false : true;
          formState.value.receiveChecked =
            props.orderInfo.value.orderAddress.receiveSaveFlag == 0 ? false : true;
        },
        {
          deep: true,
        },
      );

      return {
        formState,
        addressInfoRef,
        validatorPhoneNum2,
        validatorChinese,
        handleAddressInfo,
        registerMap,
        handleOpenAddress,
        addressBookVisible,
        showAddressBook,
        columns,
        addressBookData,
        rowSelection,
        addAddressBookVisible,
        addNewAddres,
        addressBookState,
        confirmAddNewBook,
        editAddresBook,
        labelCol: { style: { width: '80px' } },
        addresBookRef,
        delAddressBook,
        addressBookTitle,
        confirmAddress,
        isEdit,
      };
    },
  });
</script>

<style scoped lang="less">
  .address-content {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    padding: 4px 10px;
    justify-content: space-between;
    height: 30px;
    p {
      height: 100%;
      width: 100%;
      margin: 0px;
      margin-right: 10px;
    }
  }
  :deep(.ant-table-thead) {
    display: none;
  }

  .disabledStyle {
    background-color: #f5f5f5;
  }
</style>
