<template>
  <div class="outlet-add-manage">
    <PageWrapper class="high-form">
      <PageCard>
        <a-form
          ref="formRef"
          :model="formState"
          name="basic"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          labelAlign="left"
          autocomplete="off"
          :rules="formRules"
        >
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="门店名称" name="shopName">
                <a-input
                  v-model:value="formState.shopName"
                  placeholder="请输入门店名称"
                  maxlength="100"
                  :disabled="!isCanName"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="门店电话" name="shopPhone">
                <a-input
                  v-model:value="formState.shopPhone"
                  placeholder="请输入手机号"
                  maxlength="12"
                  @input="formState.shopPhone = formState.shopPhone.replace(/[^\d]/gi, '')"
                  @keydown="checkNumberInput($event)"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="门店地址" name="shopAddress">
                <a-input
                  v-model:value="formState.shopAddress"
                  placeholder="请输入地址"
                  :disabled="true"
                >
                  <template #addonAfter>
                    <environment-outlined @click="handleOpenAddress" />
                  </template>
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="关联仓库">
                <a-select
                  v-model:value="formState.wareHouseId"
                  :options="warehouseData"
                  :fieldNames="fieldNames"
                  placeholder="请选择"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="店长姓名" name="ownerName">
                <a-input
                  v-model:value="formState.ownerName"
                  placeholder="请输入姓名"
                  maxlength="10"
                  @input="
                    formState.ownerName = formState.ownerName.replace(/[^\u4E00-\u9FA5]/g, '')
                  "
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="店长手机号" name="ownerPhone">
                <a-input
                  v-model:value="formState.ownerPhone"
                  placeholder="请输入手机号"
                  maxlength="11"
                  @input="formState.ownerPhone = formState.ownerPhone.replace(/[^\d]/gi, '')"
                  @keydown="checkNumberInput($event)"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="备注">
                <a-textarea
                  v-model:value="formState.remarks"
                  placeholder="请输入备注(200字以内)"
                  :maxlength="200"
                  :auto-size="{ minRows: 2, maxRows: 5 }"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </PageCard>

      <template #rightFooter>
        <a-button class="mr-4" @click="handleCancel"> 取消 </a-button>
        <a-button type="primary" @click="handleSubmit"> 提交 </a-button>
      </template>

      <MapModal @register="registerMap" @setAddressInfo="handleAddressInfo" />
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, unref, onMounted, computed, toRefs } from 'vue';
  import { Input, Form, Row, Col, Select } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import type { Rule } from 'ant-design-vue/es/form';
  import type { FormInstance } from 'ant-design-vue';
  import { EnvironmentOutlined } from '@ant-design/icons-vue';

  import MapModal from '/@/components/Map/index.vue';

  import { checkNumberInput } from '/@/utils/input';

  import { getDictWithType } from '/@/api/common/dicts';
  import { actionShopAddOrEdit, actionShopDetail } from '/@/api/basic/outlet';

  import { useRoute, useRouter } from 'vue-router';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useTabs } from '/@/hooks/web/useTabs';

  interface Warehouse {
    value: string;
    label: string;
  }

  interface State {
    formState: any;
    currentId: string | number;
  }

  export default defineComponent({
    components: {
      [Input.name]: Input,
      [Input.TextArea.name]: Input.TextArea,
      [Form.name]: Form,
      [Form.Item.name]: Form.Item,
      [Row.name]: Row,
      [Col.name]: Col,
      [Select.name]: Select,
      PageWrapper,
      EnvironmentOutlined,
      MapModal,
    },
    setup() {
      const formRef = ref<FormInstance>();
      const state: State = reactive({
        formState: {
          shopName: '',
          shopCode: '',
          shopPhone: '',
          wareHouseId: undefined,
          ownerName: '',
          ownerPhone: '',
          shopAddress: '',
          remarks: '',
          location: '',
          cityCode: '',
          adcode: '',
          status: '',
        },
        currentId: '',
      });

      const fieldNames = ref({
        label: 'name',
        value: 'value',
      });

      const warehouseData = ref<Array<Warehouse>>([]);
      const { createMessage } = useMessage();
      const { closeCurrent, setTitle } = useTabs();
      const router = useRouter();
      const route = useRoute();

      const formRules: Record<string, Rule[]> = {
        shopName: [
          { required: true, whitespace: true, message: '请输入门店名称', trigger: 'blur' },
        ],
        shopPhone: [
          { required: true, whitespace: true, message: '请输入手机号', trigger: 'blur' },
          { min: 7, message: '请输入正确联系号码', trigger: 'blur' },
        ],
        ownerName: [{ pattern: /^[\u4E00-\u9FA5]+$/gi, message: '请输入汉字', trigger: 'blur' }],
        ownerPhone: [{ pattern: /^1\d{10}$/g, message: '请输入正确的手机号', trigger: 'blur' }],
        shopAddress: [
          { required: true, whitespace: true, message: '请选择地址', trigger: ['blur', 'change'] },
        ],
      };

      const [registerMap, { openModal: hanleOpenMap }] = useModal();

      const isAdd = computed(() => (route as any)?.query?.pageType !== 'edit');
      const isCanName = computed(() => state.formState.status == 0 || !state.formState.status); // 禁用启用状态编辑，不可编辑门店名称

      // 打开地图
      const handleOpenAddress = () => {
        console.log('handleAddress');
        hanleOpenMap(true, {
          location: state.formState.location,
          address: state.formState.shopAddress,
        });
      };

      const handleCancel = () => {
        closeCurrent();
        router.push({
          path: '/basic-info/outlet',
        });
      };

      const handleSubmit = async () => {
        unref(formRef as any)
          .validate()
          .then(async (res) => {
            if (res?.shopPhone) {
              let dataVo = { ...state.formState };
              if (dataVo?.location) {
                let locationArr = dataVo?.location.split(',');
                dataVo.longitude = locationArr[0];
                dataVo.latitude = locationArr[1];
              }
              dataVo.detailAddress = dataVo.shopAddress;
              dataVo.adcode && (dataVo.area = dataVo.adcode);

              if (state.currentId) {
                dataVo.id = state.currentId;
              }

              const { status } = await actionShopAddOrEdit(isAdd.value ? 'add' : 'edit', dataVo);

              if (status) {
                createMessage.success('操作成功');
                closeCurrent();
                router.push({
                  path: '/basic-info/outlet',
                });
              }
            }
          });
      };

      // 处理地址信息
      const handleAddressInfo = (data?: any) => {
        console.log('handleAddressInfo', data);
        state.formState.shopAddress = data?.label || '';
        state.formState.location = data?.value || '';
        state.formState.cityCode = data?.cityCode || '';
        state.formState.adcode = data?.adcode || '';

        if (state.formState?.location) {
          unref(formRef as any).clearValidate('shopAddress');
        }
      };

      // 获取字典数据
      const handleDictData = async () => {
        warehouseData.value = await getDictWithType('ware_house');
      };

      // 获取详情信息
      const handleQueryDetail = async () => {
        console.log('currentId.value', state.currentId, (route as any).query);

        state.currentId = (route as any)?.query?.id;
        setTitle(state.currentId ? '编辑门店' : '新增门店');

        if (state.currentId) {
          const { status, data } = await actionShopDetail({
            id: state.currentId,
          });

          if (status) {
            state.formState = {
              shopName: data?.shopName || '',
              shopCode: data?.shopCode || '',
              shopPhone: data?.shopPhone || '',
              wareHouseId: data?.wareHouseId || undefined,
              ownerName: data?.ownerName || '',
              ownerPhone: data?.ownerPhone || '',
              shopAddress: data?.shopAddress || data?.detailAddress || '',
              remarks: data?.remarks || '',
              location: `${data?.longitude},${data?.latitude}`,
              cityCode: data?.cityCode || '',
              adcode: data?.area || data?.adcode || '',
              status: data?.status,
            };
          }
        }
      };

      onMounted(() => {
        handleDictData();
        handleQueryDetail();
      });

      return {
        formRef,
        ...toRefs(state),
        formRules,
        warehouseData,
        fieldNames,
        isAdd,
        isCanName,
        registerMap,
        hanleOpenMap,
        handleOpenAddress,
        handleCancel,
        handleSubmit,
        handleAddressInfo,
        checkNumberInput,
        handleQueryDetail,
      };
    },
  });
</script>
<style lang="less" scoped>
  .outlet-add-manage {
    flex: 1;
  }
</style>
