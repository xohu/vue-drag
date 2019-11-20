import Vtouch from 'vue-touch';
import DragList from './src/drag-list';

DragList.install = function(Vue) {
    Vue.use(Vtouch);
    Vue.component(DragList.name, DragList);
};

export default DragList;