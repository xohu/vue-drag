module.exports = new class Prototype {
    constructor (options) {

    }

    // 获取 css 样式
    getCss (elem, attr) {  
        if (typeof elem == 'string') elem = document.querySelector(elem);

        if (!elem) return;

        let val = null, reg = null;

        if ('getComputedStyle' in window){  
            val = attr ? window.getComputedStyle(elem, null)[attr] : window.getComputedStyle(elem, null);  
        } else {   //ie6~8不支持上面属性  
            //不兼容  
            if (attr === 'opacity'){  
                val = elem.currentStyle['filter'];   //'alpha(opacity=12,345)'  
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
}