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
            get() {
                // 将watcher添加到订阅事件中 [watcher]
                Dep.target && dep.addSub(Dep.target);   
                return val;
            },
            set(newVal) {
                // 设置的值相同就不更改
                if(val === newVal) return;
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
function observeAssist(data) {
    // 传入数据非对象直接 return  防止递归溢出
    if (!data || typeof data !== 'object') return;
    return new Observe(data);
}

// 此时可以监听到每个数据的变化了 =》发布通知给订阅者
// 发布订阅模式：把要执行的函数统一存储在一个数组中管理（订阅），当达到某个执行条件时，循环这个数组并执行每一个成员（发布）
function Dep() {
    // 创建一个存放函数事件的数组 如 [fn1,fn2,fn3]
    this.subs = [];
};
// 订阅
Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
};
// 发布
Dep.prototype.notify = function () {
    this.subs.forEach(sub => sub.update());  // 通过Watcher这个类创建的实例，都拥有update方法
};




