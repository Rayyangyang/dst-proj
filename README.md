## Documentation

[Document](https://vvbin.cn/doc-next/)

## Preparation

- [node](http://nodejs.org/) and [git](https://git-scm.com/) - Project development environment
- [Vite](https://vitejs.dev/) - Familiar with vite features
- [Vue3](https://v3.vuejs.org/) - Familiar with Vue basic syntax
- [TypeScript](https://www.typescriptlang.org/) - Familiar with the basic syntax of `TypeScript`
- [Es6+](http://es6.ruanyifeng.com/) - Familiar with es6 basic syntax
- [Vue-Router-Next](https://next.router.vuejs.org/) - Familiar with the basic use of vue-router
- [Ant-Design-Vue](https://2x.antdv.com/docs/vue/introduce-cn/) - ui basic use

## 目录结构

.
├── build                       # 打包脚本相关
│   ├── config                      # 配置文件
│   ├── generate                    # 生成器
│   ├── script                      # 脚本
│   └── vite                        # vite配置
├── mock                        # mock文件夹
├── public                      # 公共静态资源目录
├── src                         # 主目录
│   ├── api                         # 接口文件
│   ├── assets                      # 资源文件
│   │   ├── enums                   # 枚举/常量
│   │   ├── icons                   # icon sprite 图标文件夹
│   │   ├── styles                  # 样式文件
│   │   ├── images                  # 项目存放图片的文件夹
│   │   └── svg                     # 项目存放svg图片的文件夹
│   ├── components               # 公共组件
│   ├── directives               # 指令
│   ├── hooks                    # hook
│   │   ├── component                # 组件相关hook
│   │   ├── core                     # 基础hook
│   │   ├── event                    # 事件相关hook
│   │   ├── setting                  # 配置相关hook
│   │   └── web                      # web相关hook
│   ├── layouts                  # 布局文件
│   │   ├── default                  # 默认布局
│   │   └── page                     # 页面布局
│   ├── logics                   # 逻辑
│   ├── main.ts                  # 主入口
│   ├── router                   # 路由配置
│   ├── settings                 # 项目配置
│   │   ├── componentSetting.ts      # 组件配置
│   │   ├── designSetting.ts         # 样式配置
│   │   ├── encryptionSetting.ts     # 加密配置
│   │   ├── localeSetting.ts         # 多语言配置
│   │   ├── projectSetting.ts        # 项目配置
│   │   └── siteSetting.ts           # 站点配置
│   ├── store                   # 数据仓库
│   ├── utils                   # 工具类
│   └── views                   # 页面
├── test                        # 测试
├── types                       # 类型文件
├── vite.config.ts              # vite配置文件
└── windi.config.ts             # windcss配置文件