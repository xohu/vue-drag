### 效果演示
[DEMO 地址](https://xohu.github.io/vue-drag/dist/#/drag/draglist "demo")（可使用 chrome 手机模式预览）

# @xohu/vue-drag

> vue 的 vue-drag 插件

**安装**

  ``` js
  cnpm install @xohu/vue-drag -S

  import VDrag from '@xohu/vue-drag'
  or
  import VDrag from '@xohu/vue-drag/packages/drag-list'

  Vue.use(VDrag)
  ```

## drag-list 插件
### Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | ------ | ------ | ------ | ------ |
| tag | 标签名 | string | — | div |
| damping | 阻尼系数 | string | — | 0 |
| open | 打开的距离条件 | number | — | 10 |
| close | 关闭的距离条件 | number | — | 10 |
| draw | 是否拉伸右侧区域 | boolean | true / false | true |
| drawMax | 右侧拉伸最大值（默认不限制） | number | — | 0 |
| once | 是否每次只展开一个 | boolean | true / false | true |

### Methods

| 事件名 | 说明 | 参数 |
| ------ | ------ | ------ |
| opend | 打开内容 | — |
| closed | 关闭内容 | — |
| closedAll | 关闭所有内容 | — |

### Events

| 事件名 | 说明 | 参数 |
| ------ | ------ | ------ |
| opend | 打开后回调 | this（组件实例） |
| moved | 移动中回调 | this（组件实例） |
| closed | 关闭后回调 | this（组件实例） |

### Scoped Slot

| name | 说明 | 参数 |
| ------ | ------ | ------ |
| — | 主体内容 | this（组件实例） |
| right | 右侧滑块内容 | this（组件实例） |

## 使用

``` js
<v-drag-list>
    <div>内容</div>

    <div slot="right" slot-scope="{ closed, closedAll }">
        右侧
    </div>
</v-drag-list>
```

## 演示图
![image](https://thumbnail0.baidupcs.com/thumbnail/174682b0399eda63a6c208e6c3f32d32?fid=3734421602-250528-1066024967816462&time=1574254800&rt=sh&sign=FDTAER-DCb740ccc5511e5e8fedcff06b081203-8vd%2FgdQZaW36TETygruBp0v%2BqQ8%3D&expires=8h&chkv=0&chkbd=0&chkpc=&dp-logid=7511624944755872677&dp-callid=0&size=c710_u400&quality=100&vuk=-&ft=video)