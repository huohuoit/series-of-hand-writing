// 监听函数  数据更新 => 视图更新
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
        // 取值时会自动调用 get 
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