// 创建构造函数 MVVM（基于 Vue2.0）
function Mvvm (options = {}) {  // ES6传值优化处理 赋初始值options = {} 相当于options = options || {}
    // 模仿 Vue 将属性挂载一下
    this.$options = options;
    // 简单代理一下
    let data = this._data = this.$options.data;
    // 数据代理：遍历data数据进行数据代理到this上，实现属性访问 vm.xxx = vm._data.xxx
    // Object.keys(data).forEach((key) => _proxy(key));    // 将data转化为数组，然后遍历调用_proxy方法
    // 改为使用 for in 
    for (let key in data) {
        this._proxy(key)
    };

    // 数据劫持
    var dep = Observe(data);

    // 初始化computed,将this指向实例
    // initComputed.call(this);
    // 编译    
    new Compile(options.el, this);
    if (typeof options.mounted != 'undefined') {
        // 所有事情处理好后执行mounted钩子函数
        options.mounted.call(this); // 这就实现了mounted钩子函数
    }

    console.log('mounted');
    dep.notify();
    this.initMounted = true


};
Mvvm.prototype._proxy = function (key) {
    let that = this;
    // 通过 Object.defineProperty 的 get和set 进行数据劫持
    Object.defineProperty(that, key, {
        enumerable: true,
        configurable: false,
        get () {
            return that._data[key];
        },
        set (newVal) {
            that._data[key] = newVal;
        }
    });
};

function initComputed () {
    let vm = this;
    let computed = this.$options.computed;  // 从options上拿到computed属性   {sum: ƒ, noop: ƒ}
    if (typeof computed != 'undefined') {
        // 得到的都是对象的key可以通过Object.keys转化为数组
        Object.keys(computed).forEach(key => {  // key就是sum,noop
            Object.defineProperty(vm, key, {
                // 这里判断是computed里的key是对象还是函数
                // 如果是函数直接就会调get方法
                // 如果是对象的话，手动调一下get方法即可
                // 如： sum() {return this.a + this.b;},他们获取a和b的值就会调用get方法
                // 所以不需要new Watcher去监听变化了
                get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
                set () { }
            });
        });
    }
}

// 创建构造函数 Observe
function Observe (data) {
    let dep = new Dep();
    // 数据劫持：给对象属性添加 get set
    for (let key in data) {
        let val = data[key];
        // 深度递归 =》深度劫持
        observeAssist(val);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get () {
                // 将watcher添加到订阅事件中 [watcher]
                Dep.target && dep.addSub(Dep.target);
                return val;
            },
            set (newVal) {
                // 设置的值相同就不更改
                if (val === newVal) return;
                // 更新新值
                val = newVal;
                // vue中不能新增不存在的属性  设置的新属性newVal需要再定义一下（此时该属性没有 get set）
                observeAssist(newVal);
                // 让所有watcher的update方法执行
                dep.notify();
            }
        });
    }
    return dep;
};
// 方便递归调用
function observeAssist (data) {
    // 传入数据非对象直接 return  防止递归溢出
    if (!data || typeof data !== 'object') return;
    return new Observe(data);
}

// 此时可以监听到每个数据的变化了 =》发布通知给订阅者
// 发布订阅模式：把要执行的函数统一存储在一个数组中管理，当达到某个执行条件时，循环这个数组并执行每一个成员
function Dep () {
    // 创建一个存放函数事件的数组
    this.subs = [];
};
Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
};
Dep.prototype.notify = function () {
    this.subs.forEach(sub => sub.update());  // 通过Watcher这个类创建的实例，都拥有update方法
};

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

            if (node.nodeType === 3 && reg.test(txt)) {  // 即是文本节点又有大括号的情况{{}}
                function replaceTxt () {
                    node.textContent = txt.replace(reg, (matched, placeholder) => {
                        console.log(placeholder);   // 匹配到的分组 如：song, album.name, singer...
                        vm.initMounted || new Watcher(vm, placeholder, replaceTxt);   // 监听变化，进行匹配替换内容

                        return placeholder.split('.').reduce((val, key) => {
                            return val[key];
                        }, vm);
                    });
                };
                // 替换
                replaceTxt();
            }

            if (node.nodeType === 1) {  // 元素节点
                let nodeAttr = node.attributes; // 获取dom上的所有属性,是个类数组
                Array.from(nodeAttr).forEach(attr => {
                    let name = attr.name;   // v-model  type
                    let exp = attr.value;   // c        text
                    if (name.includes('v-')) {
                        node.value = vm[exp];   // this.c 为 2
                    }
                    // 监听变化
                    new Watcher(vm, exp, function (newVal) {
                        node.value = newVal;   // 当watcher触发时会自动将内容放进输入框中
                    });

                    node.addEventListener('input', e => {
                        let newVal = e.target.value;
                        // 相当于给this.c赋了一个新值
                        // 而值的改变会调用set，set中又会调用notify，notify中调用watcher的update方法实现了更新
                        vm[exp] = newVal;
                    });
                });
            }

            // 如果还有子节点，继续递归replace
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

// 监听函数  
function Watcher (vm, exp, fn) {
    // 将 fn 放到实例上
    this.fn = fn;
    this.vm = vm;
    this.exp = exp;
    // 添加一个事件  先定义一个属性
    Dep.target = this;
    let arr = exp.split('.');
    let val = vm;
    arr.forEach(key => {
        val = val[key];
    });
    Dep.target = null;
}
Watcher.prototype.update = function () {
    // notify的时候值已经更改了
    // 再通过vm, exp来获取新的值
    let arr = this.exp.split('.');
    let val = this.vm;
    arr.forEach(key => {
        val = val[key];   // 通过get获取到新的值
    });
    this.fn(val);   // 将每次拿到的新值去替换{{}}的内容即可
}



