import Component from '../lib/component.js';
import store from '../store/index.js';

export default class List extends Component {

    // 将 Store 实例传递给继承的 Component 父类
    constructor() {
        super({
            store,
            element: document.querySelector('.js-items')
        });
    }
// 每次触发 Pub/Sub 的 stateChange 事件时都会调用的这个 render 方法
    render () {
        let self = this;
// 没有项目的通知提示
        if (store.state.items.length === 0) {
            self.element.innerHTML = `<p class="no-items">You've done nothing yet 😢</p>`;
            return;
        }
// 遍历生成项目列表
        self.element.innerHTML = `
            <ul class="app__items">
                ${store.state.items.map(item => {
            return `
                        <li>${item}<button aria-label="Delete this item">×</button></li>
                    `
        }).join('')}
            </ul>
        `;

        // 按钮事件
        self.element.querySelectorAll('button').forEach((button, index) => {
            button.addEventListener('click', () => {
                store.dispatch('clearItem', { index });
            });
        });
    }
};
