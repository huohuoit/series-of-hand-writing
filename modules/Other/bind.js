
Function.prototype.myBind = function (context) {
    if (typeof this !== 'function') { // 如果调用的 bind 不是函数，就报错
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }
    let args = Array.prototype.slice.call(arguments, 1), // 获取 bind 函数从第二个参数到最后一个参数
        that = this,
        fNOP = function () {}, // 使用一个空函数，帮助修改原型
        fBound = function () {
            // 这个时候的arguments是指bind返回的函数传入的参数
            let bindArgs = Array.prototype.slice.call(arguments);
            // this instanceof fBound === true 时,说明返回的 fBound 被当做 new 的构造函数调⽤ 
            // 获取调⽤时(fBound)的传参, bind返回的函数⼊参往往是这么传递的 
            return that.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
        };
    // 维护原型关系 
    if (this.prototype) {
        // fNOP 函数的原型没有 prototype 属性
        fNOP.prototype = this.prototype;
    }
    // 使 fBound.prototype 是 fNOP 的实例 
    // 因此，返回的 fBound 若作为 new 的构造函数,new ⽣成的新对象作为 this 传⼊ fBound, 新对象的__proto__就是 fNOP的实例 
    fBound.prototype = new fNOP();
    return fBound;
};


Function.prototype.myBind = function (context) {

    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () { };

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}