Description 详情组件

对 antv 的 Descriptions 组件进行封装

# Usage

example.vue

# useDescription

参考以上示例

const [register] = useDescription(Props);

# Props

温馨提醒

除以下参数外，官方文档内的 props 也都支持，具体可以参考 antv Description

属性              类型                                                                 默认值          可选值         说明
title            string                                                               -                -            标题
size             string                                                               small            -             大小
bordered         boolean                                                              true             -            是否展示边框
column           Number, Object { xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }         -              一行的           DescriptionItems 数量
useCollapse      boolean                                                              -               -            是否包裹 CollapseContainer 组件
collapseOptions  Object                                                               -               -            CollapseContainer 组件属性
schema           DescItem[]                                                           -               -             详情项配置，见下方 DescItem 配置
data             object                                                               -               -             数据源
isReactive       boolean                                                              true                          是否响应式，铺满全屏

# DescItem

属性          类型                               默认值       可选值      说明
field         string                               -           -        字段名
label         string | VNode | JSX.Element         -           -        标签名
labelMinWidth number                               -           -      label 最小宽度
contentMinWidth number                             -           -     content 最小宽度
labelStyle     any -                               -           -        label 样式
span         number                                -           -        和并列数量
show         (data)=>boolean                       -           -     动态判断当前组件是否显示
render         (val: string, data: any)=>          -           -     自定义渲染 content
VNode,undefined,Element,string,number
slot            custom-content （自定义内容），action （右上角操作栏）

注意：label支持jsx写法，内容区域可以使用slot,render方式实现
<img class="limit-img" /> 对于图片限制150px


