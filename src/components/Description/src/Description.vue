<script lang="tsx">
  import type { DescriptionProps, DescInstance, DescItem } from './typing';
  import type { DescriptionsProps } from 'ant-design-vue/es/descriptions/index';
  import type { CSSProperties } from 'vue';
  import type { CollapseContainerOptions } from '/@/components/Container/index';
  import { defineComponent, computed, ref, unref, toRefs } from 'vue';
  import { get } from 'lodash-es';
  import { Descriptions } from 'ant-design-vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { isFunction } from '/@/utils/is';
  import { getSlot } from '/@/utils/helper/tsxHelper';
  import { useAttrs } from '/@/hooks/core/useAttrs';

  interface schemaItem extends DescItem {
    slot?: any;
    labelSlot?: any;
  }

  const props = {
    useCollapse: { type: Boolean, default: true },
    title: { type: String, default: '' },
    size: {
      type: String,
      validator: (v) => ['small', 'default', 'middle', undefined].includes(v),
      default: 'small',
    },
    bordered: { type: Boolean, default: true },
    column: {
      type: [Number, Object] as PropType<number | Recordable>,
      default: () => {
        return { xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 };
      },
    },
    collapseOptions: {
      type: Object as PropType<CollapseContainerOptions>,
      default: null,
    },
    schema: {
      type: Array as PropType<schemaItem[]>,
      default: () => [],
    },
    data: { type: Object },
  };

  export default defineComponent({
    name: 'Description',
    props,
    emits: ['register'],
    setup(props, { slots, emit }) {
      const propsRef = ref<Partial<DescriptionProps> | null>(null);

      const { prefixCls } = useDesign('description');
      const attrs = useAttrs();

      // Custom title component: get title
      const getMergeProps = computed(() => {
        return {
          ...props,
          ...(unref(propsRef) as Recordable),
        } as DescriptionProps;
      });

      const getProps = computed(() => {
        const opt = {
          ...unref(getMergeProps),
          title: undefined,
        };
        return opt as DescriptionProps;
      });

      /**
       * @description: Whether to setting title
       */
      const useWrapper = computed(() => !!unref(getMergeProps).title);

      /**
       * @description: Get configuration Collapse
       */
      const getCollapseOptions = computed((): CollapseContainerOptions => {
        return {
          // Cannot be expanded by default
          canExpand: false,
          ...unref(getProps).collapseOptions,
        };
      });

      const getDescriptionsProps = computed(() => {
        return { ...unref(attrs), ...unref(getProps) } as DescriptionsProps;
      });

      /**
       * @description:设置desc
       */
      function setDescProps(descProps: Partial<DescriptionProps>): void {
        // Keep the last setDrawerProps
        propsRef.value = { ...(unref(propsRef) as Recordable), ...descProps } as Recordable;
      }

      // Prevent line breaks
      function renderLabel({ label, labelMinWidth, labelStyle }: schemaItem) {
        if (!labelStyle && !labelMinWidth) {
          return label;
        }

        const labelStyles: CSSProperties = {
          ...labelStyle,
          minWidth: `${labelMinWidth}px `,
        };
        return <div style={labelStyles}>{label}</div>;
      }

      function renderItem() {
        const { schema, data } = unref(getProps);
        return unref(schema)
          .map((item: schemaItem) => {
            const { render, slot, field, span, show, contentMinWidth } = item;

            if (show && isFunction(show) && !show(data)) {
              return null;
            }

            const getContent = () => {
              const _data = unref(getProps)?.data;
              if (!_data) {
                return null;
              }
              const getField = get(_data, field);
              if (getField && !toRefs(_data).hasOwnProperty(field)) {
                return isFunction(render) ? render('', _data) : '';
              }
              return slot
                ? getSlot(slots, slot, unref(_data))
                : isFunction(render)
                ? render(getField, _data)
                : getField ?? '';
            };

            const width = contentMinWidth;
            return (
              <Descriptions.Item label={renderLabel(item)} key={field} span={span}>
                {() => {
                  if (!contentMinWidth) {
                    return getContent();
                  }
                  const style: CSSProperties = {
                    minWidth: `${width}px`,
                  };
                  return <div style={style}>{getContent()}</div>;
                }}
              </Descriptions.Item>
            );
          })
          .filter((item) => !!item);
      }

      const renderDesc = () => {
        return (
          <Descriptions class={`${prefixCls}`} {...(unref(getDescriptionsProps) as any)}>
            {renderItem()}
          </Descriptions>
        );
      };

      const renderContainer = () => {
        const content = props.useCollapse ? renderDesc() : <div>{renderDesc()}</div>;
        // Reduce the dom level
        if (!props.useCollapse) {
          return content;
        }

        const { canExpand, helpMessage } = unref(getCollapseOptions);
        const { title } = unref(getMergeProps);

        return (
          <CollapseContainer title={title} canExpan={canExpand} helpMessage={helpMessage}>
            {{
              default: () => content,
              action: () => getSlot(slots, 'action'),
              'custom-content': () => getSlot(slots, 'custom-content'),
            }}
          </CollapseContainer>
        );
      };

      const methods: DescInstance = {
        setDescProps,
      };

      emit('register', methods);
      return () => (unref(useWrapper) ? renderContainer() : renderDesc());
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-';

  .@{prefix-cls} {
    :deep(&collapse-container__header) {
      padding: 1.25rem;
      border-bottom: 1px solid #eee;
    }

    :deep(&basic-title) {
      font-size: 20px;
      font-weight: 500;
      color: #000000;
      line-height: 28px;
      padding-left: 0;
    }
  }

  :deep(.ant-descriptions-row) {
    td {
      padding-bottom: 16px;
    }
  }

  :deep(.collapse-transition) {
    padding: 20px;
  }

  :deep(.ant-descriptions-view) {
    table tbody > .ant-descriptions-row:last-child {
      .ant-descriptions-item {
        padding-bottom: 0 !important;
      }
    }
  }

  :deep(.ant-descriptions-item-container) {
    font-size: 14px;
    line-height: 20px;
    .ant-descriptions-item-label {
      width: 126px;
      color: #8795a4;
    }
    .ant-descriptions-item-content {
      color: #000000;
    }
  }

  :deep(.ant-image-img) {
    &.limit-img {
      width: 150px;
      height: 150px;
    }
  }
</style>
