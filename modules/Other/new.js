function myNew (constrc, ...args) {
    const obj = {};    // 1. 创建一个空对象
    obj.__proto__ = constrc.prototype;    // 2. 将obj的__proto__属性指向构造函数的原型对象
    let res = constrc.apply(obj, args);    // 3. 将构造函数constrc执行的上下文this指向obj，并执行 
    return res instanceof Object ? res : obj;    // 4. 确保返回一个对象
}

function myNew (constrc, ...args) {
    let obj = Object.create(constrc.prototype);  // 以构造函数的prototype属性为原型，创建新对象
    let res = constrc.apply(obj, args);    // 将构造函数constrc执行的上下文this指向obj，并执行 
    return res instanceof Object ? res : obj;    // 确保返回一个对象
}