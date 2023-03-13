<template>
  <div class="staff-add-manage">
    <PageWrapper class="high-form">
      <PageCard :bordered="false">
        <a-form
          ref="formRef"
          :model="formState"
          name="basic"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          labelAlign="left"
          :rules="formRules"
        >
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="账号名称" name="accountName">
                <a-input
                  v-model:value="formState.accountName"
                  placeholder="请输入昵称/花名/姓名"
                  maxlength="100"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="登录手机号" name="phone">
                <a-input
                  v-model:value="formState.phone"
                  placeholder="请输入手机号"
                  maxlength="11"
                  :disabled="!isAdd"
                  @input="formState.phone = formState.phone.replace(/[^\d]/gi, '')"
                  @keydown="checkNumberInput($event)"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="入职时间" name="entryTime">
                <a-date-picker v-model:value="formState.entryTime" :format="dateFormat" />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="在职状态">
                <a-select
                  v-model:value="formState.positionStatus"
                  :options="positionStatusData"
                  placeholder="请选择"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="职务" name="position">
                <a-input
                  v-model:value="formState.position"
                  placeholder="请输入职务名称"
                  maxlength="100"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="归属门店" name="shopInfo">
                <a-select
                  v-model:value="formState.shopInfo"
                  label-in-value
                  placeholder="请选择归属门店"
                  style="width: 100%"
                  :filter-option="false"
                  allowClear
                  show-search
                  :field-names="{ label: 'shopName', value: 'id' }"
                  :not-found-content="fetching ? undefined : null"
                  :options="shopData"
                  @change="handleShopChange"
                  @search="handleShopSearch"
                >
                  <template v-if="fetching" #notFoundContent>
                    <a-spin size="small" />
                  </template>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="学历">
                <a-select
                  :field-names="{ label: 'name', value: 'value' }"
                  v-model:value="formState.educationType"
                  :options="educationData"
                  placeholder="请选择"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="居住地">
                <a-input v-model:value="formState.residenceAddr" placeholder="请输入地址">
                  <template #addonAfter>
                    <environment-outlined @click="handleOpenAddress" />
                  </template>
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="姓名">
                <a-input
                  v-model:value="formState.userName"
                  placeholder="请输入中文姓名"
                  maxlength="10"
                  @input="formState.userName = formState.userName.replace(/[^\u4E00-\u9FA5]/g, '')"
                  @keypress="checkChineseInput($event)"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="性别">
                <a-select v-model:value="formState.sex" :options="sexData" placeholder="请选择" />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="身份证号">
                <a-input
                  v-model:value="formState.idCard"
                  placeholder="请输入身份证号"
                  maxlength="18"
                  @blur="handleIdCard"
                  @input="formState.idCard = formState.idCard.replace(/[\W]/gi, '')"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="出生日期">
                <a-input v-model:value="formState.birthTime" disabled />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="身份证正面">
                <div class="upload-wrapper">
                  <a-upload
                    v-model:file-list="formState.portraitFaceUrl"
                    list-type="picture-card"
                    :action="uploadUrl"
                    :before-upload="validatorUploadImg"
                    @preview="handlePreview"
                  >
                    <div v-if="formState.portraitFaceUrl && formState.portraitFaceUrl.length < 1">
                      <plus-outlined />
                      <div style="margin-top: 8px">上传文件</div>
                    </div>
                  </a-upload>

                  <div class="upload-info-style">
                    <p>1、图片格式：jpg,jpeg,bmp,gif,png</p>
                    <p>2、不限制文件大小</p>
                    <p>3、最多上传1个文件</p>
                  </div>
                </div>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="身份证反面">
                <div class="upload-wrapper">
                  <a-upload
                    v-model:file-list="formState.emblemFaceUrl"
                    list-type="picture-card"
                    :action="uploadUrl"
                    :before-upload="validatorUploadImg"
                    @preview="handlePreview"
                  >
                    <div v-if="formState.emblemFaceUrl && formState.emblemFaceUrl.length < 1">
                      <plus-outlined />
                      <div style="margin-top: 8px">上传文件</div>
                    </div>
                  </a-upload>
                  <div class="upload-info-style">
                    <p>1、图片格式：jpg,jpeg,bmp,gif,png</p>
                    <p>2、不限制文件大小</p>
                    <p>3、最多上传1个文件</p>
                  </div>
                </div>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="合同开始日期">
                <a-date-picker v-model:value="formState.contractStartTime" :format="dateFormat" />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="合同开始结束">
                <a-date-picker v-model:value="formState.contractEndTime" :format="dateFormat" />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="紧急联系人姓名">
                <a-input
                  v-model:value="formState.emergencyContactName"
                  placeholder="请输入中文姓名"
                  @input="
                    formState.emergencyContactName = formState.emergencyContactName.replace(
                      /[^\u4E00-\u9FA5]/g,
                      '',
                    )
                  "
                  @keypress="checkChineseInput($event)"
                  maxlength="10"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="紧急联系人电话">
                <a-input
                  v-model:value="formState.emergencyContactPhone"
                  placeholder="请输入手机号"
                  maxlength="11"
                  @input="
                    formState.emergencyContactPhone = formState.emergencyContactPhone.replace(
                      /[^\d]/gi,
                      '',
                    )
                  "
                  @keydown="checkNumberInput($event)"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="邮箱">
                <a-input v-model:value="formState.email" placeholder="请输入邮箱" maxlength="50" />
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

      <a-modal
        :visible="previewVisible"
        :title="previewTitle"
        :footer="null"
        @cancel="handleClosePreview"
      >
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, unref, toRefs, onMounted, computed } from 'vue';
  import { Input, Form, Row, Col, Card, Select, DatePicker, Upload, Modal } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import type { Rule } from 'ant-design-vue/es/form';
  import type { FormInstance, UploadProps } from 'ant-design-vue';
  import { EnvironmentOutlined } from '@ant-design/icons-vue';
  import { checkNumberInput, checkChineseInput } from '/@/utils/input';
  import { getDictWithType } from '/@/api/common/dicts';
  import { debounce, cloneDeep } from 'lodash-es';
  import { useRoute, useRouter } from 'vue-router';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    actionUserAddOrEdit,
    actionGetOocUserInfo,
    actionQueryShopList,
  } from '/@/api/settings/staff';
  import { useGlobSetting } from '/@/hooks/setting';
  import { validatorUploadImg } from '/@/utils/validtor';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { useMultipleTabStore } from '/@/store/modules/multipleTab';
  import { calcBornTime } from '/@/utils/calcBornTime';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useUserStore } from '/@/store/modules/user';

  import MapModal from '/@/components/Map/index.vue';
  import dayjs from 'dayjs';

  function getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  interface State {
    fetching: boolean;
    formState: any;
    shopData: any[];
    educationData: any[];
    sexData: any[];
    positionStatusData: any[];
    previewImage: string;
    previewTitle: string;
    previewVisible: boolean;
    [PropName: string]: any;
  }

  export default defineComponent({
    name: 'StaffAddManage',
    components: {
      [Input.name]: Input,
      [Input.TextArea.name]: Input.TextArea,
      [Form.name]: Form,
      [Form.Item.name]: Form.Item,
      [Row.name]: Row,
      [Col.name]: Col,
      [Card.name]: Card,
      [Select.name]: Select,
      [Select.Option.name]: Select.Option,
      [DatePicker.name]: DatePicker,
      [Upload.name]: Upload,
      [Modal.name]: Modal,
      PageWrapper,
      EnvironmentOutlined,
      MapModal,
      PlusOutlined,
    },
    setup() {
      const { createMessage } = useMessage();
      const router = useRouter();
      const route = useRoute();
      const { uploadUrl } = useGlobSetting();
      const { closeCurrent, setTitle } = useTabs();
      const tabStore = useMultipleTabStore();
      const userStore = useUserStore();

      const formRef = ref<FormInstance>();
      const dateFormat = 'YYYY-MM-DD';

      const state: State = reactive({
        fetching: false,
        formState: {
          accountName: '',
          phone: '',
          entryTime: '',
          positionStatus: 1,
          position: '',
          shopId: '',
          shopName: '',
          shopInfo: undefined,
          educationType: undefined,
          residenceAddr: '',
          userName: '',
          sex: undefined,
          idCard: '',
          birthTime: '',
          contractStartTime: '',
          contractEndTime: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          location: '', // 经纬度信息
          residenceAddrLongitude: '', // 居住地经度
          residenceAddrLatitude: '', // 居住地纬度
          emblemFaceUrl: [],
          portraitFaceUrl: [],
          email: '',
          remarks: '',
        },
        positionStatusData: [
          { label: '在职', value: 1 },
          { label: '离职', value: 0 },
        ],
        educationData: [],
        shopData: [],
        sexData: [
          {
            value: 0,
            label: '男',
          },
          {
            value: 1,
            label: '女',
          },
        ],
        previewImage: '',
        previewTitle: '',
        previewVisible: false,
        currentId: '',
      });

      const formRules: Record<string, Rule[]> = {
        accountName: [
          { required: true, whitespace: true, message: '请输入账号名称', trigger: 'blur' },
        ],
        phone: [
          { required: true, whitespace: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/g, message: '请输入正确的手机号', trigger: 'blur' },
        ],
        entryTime: [{ required: true, message: '请选择入职时间', trigger: 'change' }],
        position: [
          { required: true, whitespace: true, message: '请输入职务名称', trigger: 'blur' },
        ],
        shopInfo: [{ required: true, message: '请选择归属门店', trigger: 'change' }],
      };

      const [registerMap, { openModal: hanleOpenMap }] = useModal();

      const isAdd = computed(() => (route as any)?.query?.pageType !== 'edit');

      // 打开地图
      const handleOpenAddress = () => {
        hanleOpenMap(true, { a: 1 });
      };

      const handleCancel = () => {
        closeCurrent();
        router.push({
          name: 'SettingsStaff',
        });
      };

      // 关闭图片预览
      const handleClosePreview = () => {
        state.previewVisible = false;
        state.previewTitle = '';
      };

      // 提交接口数据
      const handleSave = async () => {
        let dataVo = cloneDeep(state.formState);

        // 处理时间
        dataVo?.entryTime && (dataVo.entryTime = dayjs(dataVo?.entryTime).format(dateFormat));

        if (dataVo?.contractStartTime && dataVo?.contractEndTime) {
          if (
            dayjs(dataVo?.contractEndTime).valueOf() < dayjs(dataVo?.contractStartTime).valueOf()
          ) {
            createMessage.warning('合同结束时间，必须在开始时间之后');
            return;
          }
        }

        if (dataVo.emergencyContactPhone && !/^1\d{10}$/gi.test(dataVo.emergencyContactPhone)) {
          createMessage.warning('请输入正确的紧急联系人手机号');
          return;
        }

        if (state.currentId) {
          dataVo.id = state.currentId;
        }

        // 身份证 照片，格式转换为string
        if (dataVo.portraitFaceUrl.length > 0) {
          dataVo.portraitFaceUrl =
            dataVo.portraitFaceUrl[0]?.response?.data.fileUrl ||
            dataVo.portraitFaceUrl[0]?.url ||
            '';
        } else {
          dataVo.portraitFaceUrl = '';
        }

        if (dataVo.emblemFaceUrl.length > 0) {
          dataVo.emblemFaceUrl =
            dataVo.emblemFaceUrl[0]?.response?.data.fileUrl || dataVo.emblemFaceUrl[0]?.url || '';
        } else {
          dataVo.emblemFaceUrl = '';
        }

        const { status } = await actionUserAddOrEdit(isAdd.value ? 'add' : 'update', dataVo);
        if (status) {
          createMessage.success('操作成功');
          closeCurrent();

          router.push({
            path: '/settings/staff',
          });
        }
      };

      const handleSubmit = () => {
        console.log('handleSubmit', state.formState);

        unref(formRef as any)
          .validate()
          .then((res) => {
            if (res.phone) {
              handleSave();
            }
          });
      };

      // 预览文件
      const handlePreview = async (file: UploadProps['fileList'][number]) => {
        if (!file.url && !file.preview) {
          file.preview = (await getBase64(file.originFileObj)) as string;
        }
        state.previewImage = file.url || file.preview;
        state.previewVisible = true;
        state.previewTitle = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
      };

      // 处理地址信息
      const handleAddressInfo = (data?: any) => {
        state.formState.residenceAddr = data?.label || '';
        state.formState.location = data?.value || '';

        if (data.value) {
          let _location = data.value.split(',');
          state.formState.residenceAddrLongitude = _location[0];
          state.formState.residenceAddrLatitude = _location[1];
        }
      };

      // 获取归属网点数据，默认回显
      const getOutletData = async () => {
        const userInfo = userStore.userInfo;

        if (userInfo && userInfo.id && userInfo.shopId) {
          state.formState.shopId = userInfo?.shopId;
          state.formState.shopName = userInfo?.shopName;
          state.formState.shopInfo = userInfo?.shopName || '';
        }
      };

      // 重置数据
      const InitData = () => {
        state.formState = {
          accountName: '',
          phone: '',
          entryTime: '',
          positionStatus: 1,
          position: '',
          shopId: '',
          shopName: '',
          shopInfo: undefined,
          educationType: undefined,
          residenceAddr: '',
          userName: '',
          sex: undefined,
          idCard: '',
          birthTime: '',
          contractStartTime: '',
          contractEndTime: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          location: '', // 经纬度信息
          residenceAddrLongitude: '', // 居住地经度
          residenceAddrLatitude: '', // 居住地纬度
          emblemFaceUrl: [],
          portraitFaceUrl: [],
          email: '',
          remarks: '',
        };

        if (isAdd.value) {
          unref(formRef as any).resetFields();
        }
      };

      // 获取字典数据
      const handleDictData = async () => {
        state.educationData = await getDictWithType('education_type');
      };

      const handleShopSearch = debounce((value) => {
        actionQueryShopList({
          shopName: value,
          status: 1,
        }).then((res) => {
          state.shopData = res;
        });
      });

      // 选中门店
      const handleShopChange = (data: any) => {
        state.formState.shopId = data?.value;
        state.formState.shopName = data?.label;
        state.formState.shopInfo = data?.label || '';

        console.log('data', data, state.formState);
      };

      const handleIdCard = () => {
        console.log('state.formState.idCard', state.formState.idCard);
        if (state.formState.idCard == '') {
          state.formState.birthTime = '';
        } else {
          state.formState.birthTime = calcBornTime(state.formState.idCard, 1);
          console.log(state.formState.birthTime, 'state.formState.birthTime');
        }
      };

      // 获取详情信息
      const handleQueryDetail = async () => {
        state.currentId = (route as any)?.query?.id;
        setTitle(state.currentId ? '编辑员工' : '新增员工');

        if (state.currentId) {
          const { status, data } = await actionGetOocUserInfo({
            accountId: state.currentId,
          });

          if (status) {
            data.entryTime = data?.entryTime ? dayjs(data?.entryTime) : '';
            data.contractStartTime = data?.contractStartTime ? dayjs(data?.contractStartTime) : '';
            data.contractEndTime = data?.contractEndTime ? dayjs(data?.contractEndTime) : '';
            data.emblemFaceUrl = data.emblemFaceUrl ? [{ url: data.emblemFaceUrl }] : [];
            data.portraitFaceUrl = data.portraitFaceUrl ? [{ url: data.portraitFaceUrl }] : [];
            data.educationType = data.educationType ? data.educationType : undefined;

            data.shopInfo = data.shopName;

            state.formState = data;
            if (data.shopName) {
              await handleShopSearch(data.shopName);

              if (state.shopData.length > 0) {
                handleShopChange({
                  ...state.shopData[0],
                  value: state.shopData[0].id,
                });
              }
            }

            console.log('formState', data, state.formState);
          }
        }
      };

      onMounted(() => {
        InitData();
        handleDictData();
        handleQueryDetail();
        if (unref(isAdd)) {
          getOutletData();
        }
      });

      return {
        ...toRefs(state),
        dateFormat,
        formRules,
        formRef,
        isAdd,
        uploadUrl,
        registerMap,
        hanleOpenMap,
        handleOpenAddress,
        handleCancel,
        handleClosePreview,
        handleSubmit,
        checkNumberInput,
        checkChineseInput,
        handleDictData,
        handleShopSearch,
        handleAddressInfo,
        handleShopChange,
        handleQueryDetail,
        InitData,
        validatorUploadImg,
        handlePreview,
        handleIdCard,
        getOutletData,
      };
    },
  });
</script>

<style lang="less" scoped>
  .upload-wrapper {
    display: flex;
  }
  :deep(.ant-upload-picture-card-wrapper) {
    width: auto;
    margin-right: 1rem;
  }
  .upload-info-style {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    color: #999;
    p {
      margin-bottom: 2px;
    }
  }
</style>
