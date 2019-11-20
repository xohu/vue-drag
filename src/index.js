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
    version: '1.0.2',
    install,
    DragList
}