import DragList from '../packages/drag-list/index.js';
const pkg = require('@xohu/vue-drag/package');

const components = [
    DragList
];

const install = function(Vue) {
    components.forEach(v => Vue.use(v));
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    version: pkg.version,
    install,
    DragList
}