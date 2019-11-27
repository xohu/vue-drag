// 获取 css 样式
export const getCss = (elem, attr) => {  
    if (typeof elem == 'string') elem = document.querySelector(elem);

    if (!elem) return;

    let val = null, reg = null;

    if ('getComputedStyle' in window) {  
        val = attr ? window.getComputedStyle(elem, null)[attr] : window.getComputedStyle(elem, null);  
    } else {   // ie6~8不支持上面属性  
        // 不兼容  
        if (attr === 'opacity'){  
            val = elem.currentStyle['filter'];   // 'alpha(opacity=12,345)'  
            reg = /^alphaopacity=(\d+(?:\.\d+)?)opacity=(\d+(?:\.\d+)?)$/i;  
            val = reg.test(val)?reg.exec(val)[1]/100:1;  
        } else {  
            val = attr ? elem.currentStyle[attr] : elem.currentStyle;  
        }  
    }  
    
    // reg = /^(-?\d+(\.\d)?)(px|pt|em|rem)?$/i;  
    // return reg.test(val) ? parseFloat(val) : val;   
    // val = JSON.parse(JSON.stringify(val).replace(/(px|pt|em|rem)/ig, '')); // 过滤单位

    const offset = elem => {
        var docElem, win, box = { top: 0, left: 0 }, doc = elem && elem.ownerDocument;
        if (!doc) return;

        docElem = doc.documentElement;

        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if (typeof elem.getBoundingClientRect !== "undefined") {
            box = elem.getBoundingClientRect();
        }

        win = () => (doc != null && doc == doc.window) ? doc : doc.nodeType === 9 ? doc.defaultView || doc.parentWindow : false;
        
        return {
            top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
            left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
        };
    }

    if(!attr) val.Offset = offset(elem);

    return val;
}

// touch 事件监听方法
export const eventUtil = new class Prototype {
    constructor (options) {
        this.options = { ...options };
    }

    addHandler (element, type, handler) {
        if (element.addEventListener)
            element.addEventListener(type, handler, false);
        else if (element.attachEvent) element.attachEvent(`on${ type }`, handler);
        else element[`on${ type }`] = handler;
    }

    removeHandler (element, type, handler) {
        if (element.removeEventListener)
            element.removeEventListener(type, handler, false);
        else if (element.detachEvent) element.detachEvent(`on${ type }`, handler);
        else element[`on${ type }`] = handler;
    }

    listenTouch (element, options) {
        const opt = { start: () => {}, move: () => {}, end: () => {}, ...options };
        const self = this;
        let startX = 0, startY = 0, isFirst = true;

        ['touchstart', 'touchmove', 'touchend'].forEach(v => self.addHandler(element, v, handleEvent));
        
        function handleEvent (event) {
            switch (event.type) {
                case 'touchstart':
                    startX = event.changedTouches[0].pageX;
                    startY = event.changedTouches[0].pageY;
                    opt.start(event);
                break;

                case 'touchend':
                    isFirst = true;
                    opt.end(event);
                break;
                    
                case 'touchmove':
                    if (isFirst) {
                        isFirst = false;
                        // 滑动时的 X Y
                        var endX = event.changedTouches[0].pageX;
                        var endY = event.changedTouches[0].pageY;
                        // 滑动距离
                        var distanceX = endX - startX, distanceXABS = Math.abs(distanceX);
                        var distanceY = endY - startY, distanceYABS = Math.abs(distanceY);

                        // 滑动方向
                        if (distanceXABS > distanceYABS && distanceX > 0){
                            opt.move(event, 'right');
                        } else if (distanceXABS > distanceYABS && distanceX < 0){
                            opt.move(event, 'left');
                        } else if (distanceXABS < distanceYABS && distanceY < 0){
                            opt.move(event, 'up');
                        } else if (distanceXABS < distanceYABS && distanceY > 0){
                            opt.move(event, 'down');
                        } else {
                            // console.log('未滑动');
                        }
                    }
                break;
            }
        }
    }
}