import store from './store/index.js';

// 加载组件
import Count from './components/count.js';
import List from './components/list.js';
import Status from './components/status.js';

// 获取 DOM 元素
const formElement = document.querySelector('.js-form');
const inputElement = document.querySelector('#new-item-field');

// 向表单添加一个事件监听器并阻止它提交
formElement.addEventListener('submit', evt => {
    evt.preventDefault();

    // 获取文本框的值并修剪它两端的空格
    let value = inputElement.value.trim();

    // 检查下一步是否会有任何内容传递给 store
    if (value.length) {
        // 触发 addItem 这个 action 
        store.dispatch('addItem', value);
        inputElement.value = '';
        inputElement.focus();
    }
});

// 创建组件的新实例并调用它们的每个 render 方法，以便我们在页面上获得初始状态
const countInstance = new Count();
const listInstance = new List();
const statusInstance = new Status();

// 初始化渲染
countInstance.render();
listInstance.render();
statusInstance.render();
