// 引入 Store 用于检查 props 属性
import Store from '../store/store.js';

// 构造一个供其他组件类使用的基础组件类（父类）  <---- 典型的面向对象编程思想
export default class Component {
    constructor(props = {}) {
        let self = this;
// 看看是否有 render 方法，并创建空方法看是否出错
        this.render = this.render || function () { };

        // 检查 Store 类实例（可以使用它的属性和方法）
        if (props.store instanceof Store) {
            // 订阅全局 stateChange 事件 => 响应式对象
            props.store.events.subscribe('stateChange', () => self.render());
        }
        // 存储HTML元素以附加呈现
        if (props.hasOwnProperty('element')) {
            this.element = props.element;
        }
    }
}
