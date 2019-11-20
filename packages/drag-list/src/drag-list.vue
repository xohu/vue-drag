<template>
    <v-touch class="v-drag-list-components" 
        :tag="tag" 
        :options="options" 
        :tap-options="tapOptions" 
        :pan-options="panOptions" 
        :pinch-options="pinchOptions" 
        :rotate-options="rotateOptions" 
        :swipe-options="swipeOptions" 
        :enabled="enabled"
        @panstart="start" 
        @panmove="move" 
        @panend="end"
    >
        <div class="v-drag-content">
            <slot></slot>
        </div>

        <div class="v-drag-right">
            <slot name="right" v-bind="{ closed, closedAll }"></slot>
        </div>
    </v-touch>
</template>

<script>
import drag from '@xohu/vue-drag/src/mixins/drag.js';
import { getCss } from '@xohu/vue-drag/src/utils/index.js';

export default {
    name: 'v-drag-list',
    props: {
        // 默认标签
        tag: {
            type: String,
            default: 'div'
        },
        // 阻尼系数
        damping: {
            type: Number,
            default: 0
        },
        // 打开的距离条件
        open: {
            type: Number,
            default: 10
        },
        // 关闭的距离条件
        close: {
            type: Number,
            default: 10
        },
        // 是否拉伸右侧区域
        draw: {
            type: Boolean,
            default: true
        },
        // 右侧拉伸最大值（默认不限制）
        drawMax: {
            type: Number,
            default: 0
        },
        // 是否每次只展开一个
        once: {
            type: Boolean,
            default: true
        },

        options: {
            type: Object,
            default: () => ({})
        },
        tapOptions: {
            type: Object,
            default: () => ({})
        },
        panOptions: {
            type: Object,
            default: () => ({ direction: 'horizontal' })
        },
        pinchOptions: {
            type: Object,
            default: () => ({})
        },
        rotateOptions: {
            type: Object,
            default: () => ({})
        },
        swipeOptions: {
            type: Object,
            default: () => ({})
        },

        enabled: {
            type: [Object, Boolean],
            default: true
        }
    },
    data() {
        return {
            configDrag: {
                dragL: null,    // 左侧容器
                drag: null,     // 内容容器
                dragR: null,    // 右侧容易
                startX: 0,      // 开始位置
                moveL: 0,       // 往左移动的距离
                moveR: 0,       // 往右移动的距离
                move: 0         // 往左右移动的距离（负数为左，正数为右）
            }
        } 
    },
    mixins: [drag],
    mounted() {
        const self = this;

        self.$nextTick(() => {
            self.dragList.push(self)
        })
    },
    methods: { 
        init() {
            const { configDrag, $ies, $el } = this;

            configDrag.drag = $el.querySelector('.v-drag-content');
            configDrag.dragR = $el.querySelector('.v-drag-right');

            if(!$el.dragRW) {
                $el.dragRW = parseInt(getCss(configDrag.dragR).width.replace(/px/g, '') || 0);
            }
        },
        start(e) {
            let { configDrag, init, getItem, $ies } = this;

            this.once && this.dragList.forEach(v => (v._uid != this._uid && v.closed()));

            configDrag.startX = e.srcEvent.clientX;
            configDrag.startX && (document.body.style.overflow = 'hidden', init());
        },
        move(e) {
            let { configDrag, damping, draw, drawMax, $el } = this;
            const { additionalEvent, srcEvent } = e;

            if(configDrag.startX) {
                if(additionalEvent == 'panleft') {
                    configDrag.moveR = 0;
                    configDrag.moveL = configDrag.startX - srcEvent.clientX;
                }

                if(additionalEvent == 'panright') {
                    configDrag.moveL = 0;
                    configDrag.moveR = srcEvent.clientX - configDrag.startX;
                }

                let distance = configDrag.move = srcEvent.clientX - configDrag.startX;
                let rightDistance = $el.dragRW + configDrag.move;
                if(damping) {
                    distance = distance / damping;
                    rightDistance = $el.dragRW + (configDrag.move / damping);
                }

                if($el.open) {
                    distance -= $el.dragRW;
                    rightDistance -= $el.dragRW;
                }

                configDrag.drag.classList.remove('transitionS');
                configDrag.drag.style.transform = `translate3d(${ distance }px, 0, 0)`;
                
                configDrag.dragR.classList.remove('transitionS');
                configDrag.dragR.style.transform = `translate3d(${ rightDistance >= 0 ? rightDistance : 0 }px, 0, 0)`;  // 不允许超过 drag-right 宽度
                
                if(rightDistance < 0 && draw) {
                    const distance = parseInt(rightDistance.toString().replace(/-/g, '')); 
                    (distance < drawMax || !drawMax) && (configDrag.dragR.style.width = `${ $el.dragRW + distance }px`);
                }
            }
        },
        end(e) {
            let { configDrag, checkStatus, open, close, $el } = this;

            if(configDrag.startX) {
                // 未打开，左移小于指定距离则关闭
                if(!$el.open && configDrag.moveL <= open) { checkStatus(false); return }

                // 未打开，左移大于指定距离则打开
                if(!$el.open && configDrag.moveL > open) { checkStatus(true); return }

                // 已打开，左移小于指定距离则回弹
                if($el.open && configDrag.moveL) { checkStatus(true); return }

                // 未打开，右移则关闭
                if(!$el.open && configDrag.moveR) { checkStatus(false); return }

                // 已打开，右移大于指定距离则关闭
                if($el.open && configDrag.moveR > close) { checkStatus(false); return }

                // 已打开，右移小于指定距离则回弹
                if($el.open && configDrag.moveR) { checkStatus(true); return }
            }
        },
        opend() {
            const { configDrag, checkStatus, init } = this;

            init();
            checkStatus(true);
        },
        closed() {
            const { configDrag, checkStatus, init } = this;

            init();
            checkStatus(false);
        },
        closedAll() {
            this.dragList.forEach(v => v.closed());
        },
        checkStatus(status) {
            let { configDrag, draw, $el } = this;
            let distanceX = 0, distanceRX = 0;

            $el.open = status;

            if($el.open) {
                distanceX = `-${ $el.dragRW }px`;
                distanceRX = 0;
            } else {
                distanceX = 0;
                distanceRX = '100%';
            }

            configDrag.drag.classList.add('transitionS');
            configDrag.dragR.classList.add('transitionS');

            configDrag.drag.style.transform = `translate3d(${ distanceX }, 0, 0)`;
            configDrag.dragR.style.transform = `translate3d(${ distanceRX }, 0, 0)`;

            draw && (configDrag.dragR.style.width = `${ $el.dragRW }px`);
            document.body.style.overflow = 'auto';
        },
        getNode(ele, name) {
            let el = null;

            (function recursive(ele, name) {
                if(RegExp(name, 'g').test(ele.className)) {
                    el = ele;
                    return;
                } else {
                    recursive(ele.offsetParent, name);
                }
            })(ele, name);

            return el;
        }
    }
}
</script>

<style lang="less">
    .v-drag-list-components {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        transform: translateZ(0);

        .v-drag-content {
            width: 100%;

            &.transitionS {
                transition: transform .3s;
            }
        }

        .v-drag-right {
            height: 100%;
            overflow: hidden;
            white-space: nowrap;
            transform: translate3d(100%, 0, 0);
            position: absolute;
            top: 0;
            right: 0;

            &.transitionS {
                transition: all .3s;
            }
        }
    }
</style>