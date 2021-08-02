const selfCall = function (context, ...args) {
    let func = this
    context || (context = window)
    if (typeof func !== 'function') throw new TypeError('this is not function')
    let caller = Symbol('caller')
    context[caller] = func
    let res = context[caller](...args)
    delete context[caller]
    return res
}


Function.prototype.selfCall || (Object.defineProperty(Function.prototype, 'selfCall', {
    value: selfCall,
    enumerable: false,
    configurable: true,
    writable: true
}))

let example2 = { a: 1 }
func.selfCall(example2)
console.log(example2)

Function.prototype.myCall = function (context) {
    // 如果 context 为 null/undefined，context 指向 window(或global)
    context = Object(context) || window; // 装箱操作将原始类型 context 包装成对象
    context.fn = this; // 通过 this 获取到调用 call 的函数，并给context 添加一个属性 fn
    let args = [];
     // 将 arguments 对象（类数组）转为数组
    for (let i = 1, len = arguments.length; i < len; i++) {
        args.push(arguments[i]); // 取出第二个到最后一个参数
    }
    let result = context.fn(...args); // 将参数传入调用函数执行
    delete context.fn; // 删除这个中间函数
    return result; // 返回调用函数后的返回值
}

