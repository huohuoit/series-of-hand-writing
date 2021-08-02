Function.prototype.myApply  = function (context, arr) {
    // 如果 context 为 null/undefined，context 指向 window(或global)
    context = Object(context) || window; // 装箱操作将原始类型 context 包装成对象
    context.fn = this; // 通过 this 获取到调用 call 的函数，并给context 添加一个属性 fn
    let result;
    if(!arr) {
        result = context.fn; // 没有传数组参数的情况下
    } else {
        result = context.fn(...arr); // 将参数传入调用函数执行
    }
    delete context.fn; // 删除这个中间函数
    return result; // 返回调用函数后的返回值
}