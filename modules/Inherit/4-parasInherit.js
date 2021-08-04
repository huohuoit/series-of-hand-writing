// 寄生式继承

function ParasInherit(obj) {
    const child = Object.create(obj) // 通过调用函数创建一个对象
    child.sayHi = function () { // 增强对象
        console.log('HelloHuohuo');
    }
    return child // 基于 obj 对象返回了一个新的对象 （具有 obj 的所有属性和方法）
}

// 测试
const person = {
    name: 'huohuo',
    data: ['3', '180', '50']
}
const inheritPerson = ParasInherit(person)
inheritPerson.sayHi() // HelloHuohuo