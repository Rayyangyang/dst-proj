PageWrapper
用于包裹页面组件

# Usage

example.vue

# Props

属性                  类型          默认值       说明
title               string           -       pageHeader title
dense                                       是否缩小主体区域 false 为 true 将会取消 padding/margin
content             string           -      pageHeader Content 内容
contentStyle        object           -      主体区域样式
contentClass        string           -      主体区域 class
contentBackground   boolean          -      主体区域背景
contentFullHeight   boolean        false    主体区域是否占满整个屏幕高度
fixedHeight         boolean        false    固定主体区域高度

# Slots

pageHeader 的 slot 都支持

名称 说明
leftFooter PageFooter 左侧区域
rightFooter PageFooter 右侧区域
headerContent pageHeader 主体内容
default 主体区域

# PageFooter

用于页面底部工具栏

# Slots
名称 说明
left 左侧区域
right 右侧区域
