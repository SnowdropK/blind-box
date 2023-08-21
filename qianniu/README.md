
#### 目录说明

```md

├── assets                          # 静态资源目录，勿修改目录名称，勿删（本地静态资源只能放在该目录下，否则引用不生效）
├── pages                           # 源码目录
│    ├── extend                     # 三方可扩展的页面，完全自定义页面
│    │   ├── home                   
│    │   │   ├── components
│    │   │   ├── SectionBlank.jsx
│    │   │   └── index.less
│    └── official                   # 基于官方页面进行的扩展页面，勿修改目录名称，勿删
│        ├── subDetail-isv          # 官方提供的区块，勿修改名称，勿删
│        └── subHome-isv            # 官方提供的区块，勿修改名称，勿删
├── utils                           # 公共文件
├── app.js                          # 项目应用级的SPI的服务实现，勿修改文件名称，勿删
├── app.json                        # 项目应用配置，勿修改文件名称，勿删
├── mini.project.json               # 项目构建配置，勿修改文件名称，勿删
├── package.json
├── README.md
```

#### 前端技术栈
- react17 + fusion组件库
- react 和 fusion 组件库已内置，直接 import 即可，无需再通过 npm 安装

#### 开发约束
为了安全和管控等因素，请遵循如下要求
- **所有本地静态资源**统一放在项目根目录下的assets文件夹，否则引用不生效
- 开发者在 app.json 声明 tabBar 的 path 对应 pages 页面需要以如下方式实现,且**页面文件必须 default 导出**（非组件，组件不作要求）。
  - 这么做的目的是官方需要感知SectionBlank的存在
  - 有以下两种实现方式
  ```
  - 上级目录
    - SectionBlank(页面目录，名称只能是SectionBlank)
      - index.jsx(文件名称前缀只能是index，具体实现需default导出)
  -------------------- 分割线 --------------------
  - 上级目录
    - xxx(页面目录，自定义名称)
      - SectionBlank.jsx(文件名称前缀只能是SectionBlank，具体实现需default导出)
  ```

#### 如何看模拟器的错误信息（非常重要）
- **模拟器**的错误信息目前不会出现在IDE控制面板里，请务必学会如何调起模拟器页面的 DevTools 调试面板，这将大大提升开发者排查问题的效率
- 具体操作指南TODO

#### 常见疑惑点
- 对项目文件进行操作变动后，模拟器界面为空白或者没反应，建议点击【重新编译】按钮

#### app.json解释

##### tabBar定义
```
  "tabBar": [
    {
      "title": "首页",
      "route": "/myCustomHome",
      "name": "myCustomHome",
      "components": [
        {
          "name": "SectionBlank",
          "path": "pages/extend/home/SectionBlank"
        }
      ]
    }]
```
- title 对应页面标题
- route 对应页面路由
- name 对应页面的唯一key值
- - components 对应页面的需要实现区块的集合
- - - name 对应区块的唯一key值 如果是官方指定的话需要跟官方文档中保持一致，如果完全自定义的话写成 SectionBlank 即可
- - - path 对应页面，path对应路径必须在app.json指定，否则会出错





#### 静态资源
- 基于安全考虑，静态资源只能放置在项目assets目录下，且只能通过绝对路径的方式引入
