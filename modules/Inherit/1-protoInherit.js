// 原型链继承

// 父类
function Parent() {
    this.name = 'huohuo'
}
// 在父类原型上添加方法
Parent.prototype.getName = function () {
    return this.name
}
// 子类
function Child() { }

// 继承 Parent
Child.prototype = new Parent() // 让子类的原型对象指向父类实例, 这样一来在Child实例中找不到的属性和方法就会到原型对象(父类实例)上寻找
// 解决重写原型导致的 constructor 丢失问题（增强对象）
Child.prototype.constructor = Child // 根据原型链的规则，顺便绑定一下constructor, 这一步不影响继承, 只是在用到constructor时会需要
// 创建一个实例化对象
const child = new Child() // 然后 Child实例 就能访问到父类及其原型上的 name属性 和 getName方法
child.name          // 'huohuo'
child.getName()     // 'huohuo'
