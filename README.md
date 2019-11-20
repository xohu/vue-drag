# @xohu/vue-drag

> vue 的 vue-drag 插件

- **安装**

  ```
  cnpm install @xohu/vue-drag -S
  ```

## drag-list 插件
### 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ------ | ------ | ------ | ------ | ------ |
| tag | 默认标签 | string | — | div |
| damping | 阻尼系数 | string | — | 0 |
| open | 打开的距离条件 | number | — | 10 |
| close | 关闭的距离条件 | number | — | 10 |
| draw | 是否拉伸右侧区域 | boolean | true / false | true |
| drawMax | 右侧拉伸最大值（默认不限制） | number | — | 0 |
| once | 是否每次只展开一个 | boolean | true / false | true |

## 使用

``` js
<v-drag-list>
    <div>内容</div>

    <div slot="right" slot-scope="{ closed, closedAll }">
        右侧
    </div>
</v-drag-list>
```