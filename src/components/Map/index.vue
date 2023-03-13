<template>
  <div>
    <BasicModal
      @register="register"
      title="选择地址"
      okText="提交"
      width="758px"
      :canFullscreen="false"
      centered
      @ok="handleOk"
      :z-index="1000"
    >
      <div class="mb-4">
        <a-select
          v-model:value="searchValue"
          placeholder="请输入详细地址"
          style="width: 100%"
          show-search
          label-in-value
          :filter-option="false"
          :show-arrow="false"
          :not-found-content="fetching ? undefined : null"
          :options="addressData"
          @search="handleSearch"
          @change="handleChange"
        >
          <template v-if="fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </div>
      <div ref="wrapRef" :style="{ height, width }"></div>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick, unref, toRefs, reactive } from 'vue';
  import { useScript } from '/@/hooks/web/useScript';
  import { BasicModal, useModalInner } from '/@/components/Modal';

  import { message, Select, Spin } from 'ant-design-vue';

  import axios from 'axios';
  import { getAreaCity } from '/@/api/common/dicts';

  interface State {
    addressData: any[];
    fetching: boolean;
    searchValue: any;
    currentAddressInfo: any;
  }

  let timeout: any;
  let currentValue = '';
  const mapKey = `4e4c8706ad7f1d468011d7b1d2340bf2`;
  const provinceDirectly = ['北京市', '天津市', '上海市', '重庆市'];

  function fetch(value: string, callback: any) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;

    function fake() {
      axios
        .request({
          url: `https://restapi.amap.com/v3/assistant/inputtips?s=rsv3&key=${mapKey}&keywords=${value}`,
          method: 'GET',
        })
        .then((result: any) => {
          let data = result?.data?.tips || [];
          let _addressData: any[] = [];

          if (currentValue === value) {
            data.forEach((item) => {
              _addressData.push({
                ...item,
                label: item.district + item.name,
                value: item.location,
              });
            });
          }

          callback(_addressData);
        });
    }

    timeout = setTimeout(fake, 300);
  }

  const A_MAP_URL = `https://webapi.amap.com/maps?v=2.0&key=${mapKey}&plugin=AMap.Geocoder`;

  export default defineComponent({
    name: 'AMap',
    components: {
      BasicModal,
      [Select.name]: Select,
      [Select.Option.name]: Select.Option,
      [Spin.name]: Spin,
    },
    props: {
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: '520px',
      },
    },
    emit: ['setLocalInfo', 'setAddressInfo'],
    setup(props, { emit }) {
      const wrapRef = ref<HTMLDivElement | null>(null);
      const GDMap = ref<any>(null);
      const GDgeoCoder = ref<any>(null);
      const { toPromise } = useScript({ src: A_MAP_URL });

      const state: State = reactive({
        addressData: [],
        fetching: false,
        searchValue: undefined,
        currentAddressInfo: null,
      });

      const initData = () => {
        state.searchValue = undefined;
      };

      const [register, { closeModal, changeOkLoading, changeLoading }] = useModalInner(
        async (data?: any) => {
          changeLoading(true);
          initData();
          await initMap();
          changeLoading(false);

          // 回显地图，标记
          if (data?.location) {
            let laitudeInfo = data?.location?.split(',') || [0, 0];
            handleAddMapPoint({
              lng: laitudeInfo[0],
              lat: laitudeInfo[1],
            });
          }

          // 回显地图，搜索地址
          if (data?.address && data?.location) {
            state.currentAddressInfo = { label: data?.address, value: data?.location };
            state.addressData = [state.currentAddressInfo];
            state.searchValue = data?.location || '';
          }
        },
      );

      const handleSearch = (val: string) => {
        state.fetching = true;
        fetch(val, (d: any[]) => {
          state.fetching = false;
          state.addressData = d;
        });
      };

      const handleChange = (val: any) => {
        state.searchValue = val?.value || '';
        state.currentAddressInfo = val;
        state.currentAddressInfo.adcode = val?.option?.adcode || '';

        fetch(val, (d: any[]) => (state.addressData = d));
        let laitudeInfo = val?.key?.split(',') || [0, 0];
        handleAddMapPoint({
          lng: laitudeInfo[0],
          lat: laitudeInfo[1],
        });
      };

      async function initMap() {
        await toPromise();
        await nextTick();
        const wrapEl = unref(wrapRef);
        if (!wrapEl) return;
        const AMap = (window as any).AMap;
        const geoCoder = new AMap.Geocoder();
        GDgeoCoder.value = geoCoder;

        let map = new AMap.Map(wrapEl, {
          zoom: 13,
          viewMode: '3D',
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量
          offset: [10, 20],
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          position: 'RB',
        });

        GDMap.value = map;

        map.on('click', (e) => {
          const location = {
            lng: e.lnglat.lng,
            lat: e.lnglat.lat,
          };

          state.searchValue = undefined;
          handleAddMapPoint(location);

          geoCoder.getAddress([e.lnglat.getLng(), e.lnglat.getLat()], (status, result) => {
            if (status === 'complete' && result.regeocode) {
              state.currentAddressInfo = {
                label: result?.regeocode?.formattedAddress || '',
                value: `${location.lng},${location.lat}`,
                cityCode: result?.regeocode?.addressComponent?.citycode || '',
                adcode: result?.regeocode?.addressComponent?.adcode || '',
              };

              // 点击地图，搜索栏回显
              if (state.currentAddressInfo?.label) {
                state.addressData = [state.currentAddressInfo];
                state.searchValue = state.currentAddressInfo?.value || '';
              }

              if (result?.regeocode?.addressComponent?.city) {
                handleQueryCityCode(result?.regeocode?.addressComponent?.city);
              }
            }
          });
        });
      }

      // 根据城市名获取城市code(由于高德地图，解析code，唯独城市code有问题)
      const handleQueryCityCode = async (cityName) => {
        const { status, data } = await getAreaCity({
          cityName,
        });

        if (status) {
          state.currentAddressInfo.cityCode =
            data && Array.isArray(data) && data.length > 0 ? data[0].code : '';
        }
      };

      // 弹框确定
      const handleOk = () => {
        if (!state?.currentAddressInfo?.value) {
          message.warning('请选择地址');
          return;
        }

        let addressInfo = { ...state.currentAddressInfo };
        let locationInfo = addressInfo?.value?.split(',');

        if (state.currentAddressInfo?.cityCode && state.currentAddressInfo?.adcode) {
          emit('setAddressInfo', state.currentAddressInfo);

          changeOkLoading(false);
          closeModal();
        } else {
          changeOkLoading(true);

          GDgeoCoder.value.getAddress([locationInfo[0], locationInfo[1]], (status, result) => {
            changeOkLoading(false);

            if (status === 'complete' && result.regeocode) {
              let province = result?.regeocode?.addressComponent?.province || '';
              let city = result?.regeocode?.addressComponent?.city || '';
              let _city =
                Array.isArray(city) || provinceDirectly.includes(province) ? province : city;
              state.currentAddressInfo.adcode = result?.regeocode?.addressComponent?.adcode || '';

              if (_city) {
                handleQueryCityCode(_city).then(() => {
                  emit('setAddressInfo', state.currentAddressInfo);

                  changeOkLoading(false);
                  closeModal();
                });
              } else {
                emit('setAddressInfo', state.currentAddressInfo);

                changeOkLoading(false);
                closeModal();
              }
            }
          });
        }
      };

      const handleAddMapPoint = (data?: any) => {
        // 清除所有覆盖物
        GDMap.value.clearMap();
        // 添加当前点位到地图上
        let m = new (window as any).AMap.Marker({
          position: [data.lng, data.lat],
        });

        GDMap.value.add(m);
        // 根据覆盖物调整地图内容
        GDMap.value.setFitView();
      };

      return {
        ...toRefs(state),
        wrapRef,
        GDMap,
        GDgeoCoder,
        register,
        closeModal,
        handleSearch,
        handleChange,
        handleAddMapPoint,
        handleOk,
        initData,
      };
    },
  });
</script>
