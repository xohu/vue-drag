import DragList from '../packages/drag-list/index.js';

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
    version: '2.12.0',
    install,
    DragList
}