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

    // 编译
    new Compile(options.el, this);

    if (typeof options.mounted != 'undefined') {
        // 所有事情处理好后执行mounted钩子函数
        options.mounted.call(this); // 这就实现了mounted钩子函数
    }
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