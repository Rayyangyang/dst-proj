<template>
  <MyForm :model="formState" name="basic" autocomplete="off" ref="enclosureRef" labelAlign="left">
    <Row :gutter="24">
      <Col :span="12">
        <FormItem
          label="纸质合同"
          :labelCol="{ span: 6 }"
          name="fileList"
          labelAlign="left"
          :rules="[{ required: true, message: '请上传纸质合同' }]"
        >
          <Upload
            v-model:file-list="formState.fileList"
            :action="uploadUrl"
            :before-upload="validatorUploadPdf"
            @change="fileChange"
          >
            <div v-if="formState.fileList && formState.fileList.length < 3">
              <Button style="margin-left: 12px">上传文件</Button>
            </div>
          </Upload>
        </FormItem>
      </Col>
    </Row>
  </MyForm>
  <p class="remark">要求：pdf格式，文件大小5M以内，最多上传3个文件。</p>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, onMounted } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { Card, Form, FormItem, Row, Col, Upload, Button } from 'ant-design-vue';

  import { validatorUploadPdf } from '/@/utils/validtor';
  import { useGlobSetting } from '/@/hooks/setting';
  interface FormState {
    fileList: Array<string>;
  }

  export default defineComponent({
    name: 'Enclosure',
    components: {
      [Card.name]: Card,
      MyForm: Form,
      FormItem,
      Row,
      Col,
      Upload,
      Button,
    },
    props: {
      contractInfo: {
        default: () => {},
        type: Object,
      },
    },
    emits: ['changeRegisterArea'],
    setup(props) {
      let formState: FormState = ref({
        fileList: [],
      });

      const enclosureRef = ref();
      onMounted(async () => {});
      const { uploadUrl } = useGlobSetting();

      const fileChange = ({ file, fileList }) => {
        console.log(122211, fileList);
        if (file.status == 'done') {
          let obj = {
            name: file.response.data.fileName,
            url: file.response.data.accessUrl,
            fileUrl: file.response.data.fileUrl,
          };
          formState.value.fileList.push(obj);
          formState.value.fileList.splice(formState.value.fileList.length - 2, 1);
        }
      };
      watch(
        () => props.contractInfo,
        () => {
          formState.value.fileList = props.contractInfo.value?.businessAttachments.map((ele) => {
            return {
              url: ele.fileUrl,
              name: ele.fileName,
              fileUrl: ele.fileUrl,
            };
          });
        },
        {
          deep: true,
        },
      );
      return {
        enclosureRef,
        formState,
        uploadUrl,
        fileChange,
        validatorUploadPdf,
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
