// 寄生式组合继承

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
// 原型链继承
// 将`指向父类实例`改为`指向父类原型`
Child.prototype = Object.create(Parent.prototype) // 做浅拷贝，避免子类原型修改导致父类原型也被修改
Child.prototype.constructor = Child

// 测试
const child1 = new Child()
const child2 = new Child()
child1.name = 'foo'
console.log(child1.name)          // foo
console.log(child2.name)          // huohuo
child2.getName()                  // 'huohuo'



// 封装一下
function myInherit (child, parent) { // 接受两个参数：父子构造函数
    let prototype = Object.create(parent.prototype) // 创建父类原型的拷贝
    prototype.constructor = child // 解决重写原型导致的 constructor 丢失问题（增强对象）
    child.prototype = prototype // 将新对象赋值给子类原型
}

// 测试
function Parent (name) {
    this.name = name
}
Parent.prototype.getName = function () {
    return this.name
}
function Child () {
    Parent.call(this, 'huohuo')
}
myInherit(Child, Parent)
const child1 = new Child()
console.log(child1.name); // huohuo
