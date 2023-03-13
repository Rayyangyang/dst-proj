<template>
  <BasicModal
    @register="registerModal"
    :title="modalTitle"
    :canFullscreen="false"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #customType="{ model, field }">
        <a-select
          :options="typeData"
          v-model:value="model[field]"
          allowClear
          :disabled="modalType === 'edit'"
          :fieldNames="fieldNames"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed, toRefs, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemasCategoryAdd } from './tableData';
  import { Select } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { actionServiceFailAddOrEdit } from '/@/api/basic/service';

  const props = {};

  interface DictType {
    name: string;
    value: string;
  }

  export default defineComponent({
    components: { BasicModal, BasicForm, [Select.name]: Select },
    props,
    emits: ['on-refresh'],
    setup(props, { emit }) {
      const state = reactive({
        modalType: '',
        id: '',
        typeData: [],
        fieldNames: {
          label: 'name',
          value: 'value',
        },
      });

      const { createMessage } = useMessage();
      const [registerModal, { closeModal, changeOkLoading }] = useModalInner((propsData: any) => {
        const { type, data, typeData } = propsData;
        state.modalType = type;
        state.typeData = typeData;

        resetFields();

        handleSetDefault();
        changeOkLoading(false);

        if (type === 'edit' && data) {
          state.id = data?.id || '';

          setFieldsValue({
            serviceType: String(data?.serviceType) || '',
            failTypeName: data?.failTypeName || '',
            status: String(data?.status) || '',
          });
        }
      });

      const [registerForm, { validate, resetFields, setFieldsValue, getFieldsValue }] = useForm({
        schemas: schemasCategoryAdd(),
        labelWidth: 120,
        showActionButtonGroup: false,
        autoSubmitOnEnter: true,
      });

      const modalTitle = computed(() => (state.modalType === 'add' ? '新增' : '编辑'));

      const handleSubmit = async () => {
        validate().then(async (data) => {
          if (data.failTypeName) {
            try {
              changeOkLoading(true);

              let dataVo = getFieldsValue();
              state.id && (dataVo.id = state.id);

              const { status } = await actionServiceFailAddOrEdit(state.modalType, dataVo);

              if (status) {
                createMessage.success('操作成功');
                emit('on-refresh');
                closeModal();
              }
            } finally {
              changeOkLoading(false);
            }
          }
        });
      };

      // 新增默认类型 配送
      const handleSetDefault = () => {
        let findItem: any = state.typeData.find((item: DictType) => item.name === '配送');

        if (findItem && findItem.value && state.modalType === 'add') {
          setFieldsValue({
            serviceType: String(findItem.value) || '',
          });
        }
      };

      return {
        ...toRefs(state),
        modalTitle,
        registerModal,
        registerForm,
        closeModal,
        handleSubmit,
        handleSetDefault,
      };
    },
  });
</script>
