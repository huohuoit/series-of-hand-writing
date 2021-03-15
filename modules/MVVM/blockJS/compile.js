// 数据劫持和数据代理实现后，开始编译
// 创建 Compile 构造函数
function Compile (el, vm) {
    // 将 el 挂载到实例上方便调用
    vm.$el = document.querySelector(el);
    // 在 el 范围里将内容（元素）附加到空白的文档片段（文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流，增加性能）
    let fragment = document.createDocumentFragment();
    let child;
    while (child = vm.$el.firstChild) {
        // 将 el 中的内容放入内存（fragment）中
        fragment.appendChild(child);
    };
    // 对 el 里的内容进行替换
    function replace (frag) {
        // 利用 Array.from() 从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例
        Array.from(frag.childNodes).forEach(node => {
            let txt = node.textContent;
            let reg = /\{\{(.*?)\}\}/g;  // 正则匹配{{}}
            // 节点类型 node.nodeType：
            //      值为 1：元素节点（<p>、<div>等）
            //      值为 3：Element 或者 Attr 中实际的  text（文本）
            if (node.nodeType === 3 && reg.test(txt)) {  // 即是 文本节点 又有 大括号{{}} 的情况
                function replaceTxt () {
                    node.textContent = txt.replace(reg, (matched, placeholder) => {
                        console.log('placeholder', placeholder);   // 匹配到的分组 word
                        vm.initMounted || new Watcher(vm, placeholder, replaceTxt);   // 监听变化，进行匹配替换内容
                        // 将String对象（placeholder）分割成子字符串数组
                        return placeholder.split('.').reduce((val, key) => {  // 用 reduce 为数组每个元素依次执行一次回调函数
                            return val[key];
                        }, vm);
                    });
                };
                // 替换
                replaceTxt();
            }
            // 双向数据绑定
            if (node.nodeType === 1) {  // 元素节点
                let nodeAttr = node.attributes; // 获取dom上的所有属性，是个类数组
                Array.from(nodeAttr).forEach(attr => {
                    let name = attr.name;   // v-model  type
                    let exp = attr.value;   // word     text
                    if (name.includes('v-')) {
                        node.value = vm[exp];   // this.word 为 'Hello World!'
                    }
                    // 监听变化
                    new Watcher(vm, exp, function (newVal) {
                        node.value = newVal;   // 当watcher触发时会自动将内容放进输入框中
                    });

                    node.addEventListener('input', e => {
                        let newVal = e.target.value;
                        // 相当于给 this.word 赋了一个新值
                        // 而值的改变会调用 set，set 中又会调用 notify，notify 中调用 watcher 的 update 方法实现了更新
                        vm[exp] = newVal;
                    });
                });
            }

            // 如果还有子节点，继续递归 replace
            if (node.childNodes && node.childNodes.length) {
                replace(node);
            }
        });
    }
    // 替换内容
    replace(fragment);

    // 再将文档片段放入 el
    vm.$el.appendChild(fragment);
}