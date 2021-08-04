// 组合继承：构造函数 + 原型对象

function Parent (name) {
    this.name = name
}
Parent.prototype.getName = function () {
    return this.name
}
function Child () {
    // 构造函数继承
    Parent.call(this, 'huohuo') // 既能避免实例之间共享一个原型实例，又能向父类构造方法传参
}
//原型链继承
Child.prototype = new Parent() // 父类的方法可以被子类通过原型拿到
Child.prototype.constructor = Child // 顺带绑定下 constructor (增强对象)

//测试
const child1 = new Child()
const child2 = new Child()
child1.name = 'foo'
console.log(child1.name)          // foo
console.log(child2.name)          // huohuo
child2.getName()                  // 'huohuo'