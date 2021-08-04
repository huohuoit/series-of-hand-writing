// 构造函数继承

function Parent(name) {
    this.name = name
}
Parent.prototype.getName = function () {
    return this.name
}
function Child() {
    // 执行父类的构造函数，并修改 this 指向到子类, 使得父类中的属性能够赋到子类的 this 上
    Parent.call(this, 'huohuo') // 既能避免实例之间共享一个原型实例，又能向父类构造方法传参
}
const child1 = new Child()
console.log(child1.name) // huohuo
child1.getName() // 报错, 找不到getName(), 构造函数继承的方式继承不到父类原型上的方法
