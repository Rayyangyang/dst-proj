import { isArray } from '/@/utils/is';

// 处理树形数据 返回空字段，不展示+
export function handleTreeData(data: any[]) {
  if (isArray(data)) {
    data.forEach((item) => {
      if (item.children && isArray(item.children) && item.children.length < 1) {
        item.children = undefined;
      } else {
        handleTreeData(item.children);
      }
    });
  }

  return data;
}
