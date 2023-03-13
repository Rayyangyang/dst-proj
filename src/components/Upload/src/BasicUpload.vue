<template>
  <div class="upload-manage">
    <a-upload
      :accept="getStringAccept"
      :multiple="multiple"
      :customRequest="customRequest"
      :before-upload="beforeUpload"
      list-type="picture-card"
      :file-list="fileList"
      :disabled="disabled"
      class="upload-modal-toolbar__btn"
      @change="handleChange"
      @preview="handlePreview"
      @remove="handleRemove"
    >
      <template v-if="fileList.length < maxNumber">
        <loading-outlined v-if="loading" />
        <plus-outlined v-else />
        <!-- <div class="ant-upload-text">Upload</div> -->
      </template>
    </a-upload>

    <slot name="tip"></slot>

    <imgPreviewModal ref="ImgPreview" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, reactive, ref, unref, onMounted, watch } from 'vue';

  import { Upload } from 'ant-design-vue';
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';

  import { basicProps } from './props';
  import { checkImgType } from './helper';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { buildUUID } from '/@/utils/uuid';
  import { useUploadType } from './useUpload';
  import { uploadApi } from '/@/api/common/upload';
  import ImgPreviewModal from '/@/components/ImgPreviewModal/index.vue';
  import { isArray } from '/@/utils/is';

  interface State {
    fileList: any[];
    loading: boolean;
  }

  export default defineComponent({
    name: 'BasicUpload',
    components: {
      [Upload.name]: Upload,
      LoadingOutlined,
      PlusOutlined,
      ImgPreviewModal,
    },
    props: {
      ...basicProps,
    },
    emits: ['change', 'delete', 'preview-delete', 'update:value'],

    setup(props, { emit, attrs }) {
      const ImgPreview = ref<any>(null);
      const state: State = reactive({
        fileList: [],
        loading: false,
      });
      const { createMessage } = useMessage();
      const { accept, helpText, maxNumber, maxSize } = toRefs(props);
      const { getStringAccept } = useUploadType({
        acceptRef: accept,
        helpTextRef: helpText,
        maxNumberRef: maxNumber,
        maxSizeRef: maxSize,
      });

      // 上传前校验
      async function beforeUpload(file: File) {
        const { size, name } = file;
        const { maxSize } = props;

        // 设置最大值，则判断
        if (maxSize && file.size / 1024 / 1024 >= maxSize) {
          createMessage.error(`只能上传不超过${maxSize}MB的文件!`);
          return false;
        }

        if (unref(getStringAccept).indexOf(file.type) === -1) {
          createMessage.error(`只允许上传后缀为jpg,jpeg,png的文件`);
          return false;
        }

        const commonItem = {
          uuid: buildUUID(),
          file,
          size,
          name,
          percent: 0,
          type: name.split('.').pop(),
        };

        // TODO 限制
        console.log('checkImgType', checkImgType(file), commonItem);
        return true;
      }

      async function customRequest(options: any) {
        state.loading = true;
        try {
          const result = await uploadApi(
            options,
            function onUploadProgress(progressEvent: ProgressEvent) {
              const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            },
          );
          const { data, status } = result.data;
          if (status) {
            state.fileList = [
              ...state.fileList,
              {
                url: data.accessUrl,
              },
            ];
          }
        } finally {
          state.loading = false;
        }
      }

      async function handleChange(e) {
        console.log('handleChange', e, state.fileList);
      }

      async function handlePreview(data: any) {
        (unref(ImgPreview) as any)?.handleOpen({
          title: data?.name || '预览图片',
          url: data?.url || '',
        });
      }

      async function handleRemove(data: any) {
        let url = data?.url || '';
        const filterData = state.fileList.filter((item) => item.url !== url);

        state.fileList = [...filterData];
      }

      watch(
        () => state.fileList,
        (newVal, preVal) => {
          if (isArray(unref(newVal)) && unref(newVal).length === 0 && unref(preVal).length === 0) {
            return;
          }
          emit('change', newVal);
        },
      );

      watch(
        () => props.fileValue,
        () => {
          const { fileValue } = props;
          state.fileList = fileValue || [];
        },
      );

      onMounted(() => {});

      return {
        ...toRefs(state),
        ImgPreview,
        beforeUpload,
        getStringAccept,
        customRequest,
        handleChange,
        handlePreview,
        handleRemove,
      };
    },
  });
</script>
<style lang="less" scoped>
  :deep(.ant-upload) {
    flex-direction: column;
  }
</style>
