// Class 类继承
class Father {
    constructor(surname) {
        this.surname = surname; // 类的属性声明用 this 即可
    }
    saySurname () {
        console.log('My surname is ' + this.surname); // 访问类的属性要用 this
    }
}
class Son extends Father { // 这样子类就继承了父类的属性和方法
    constructor(surname, firstname) {
        super(surname); // 通过调用 super 来调用父类的构造函数，并初始化父类的属性
        this.firstname = firstname; // 初始化一个子类属性
    }
    sayFirstname () {
        console.log('My firstname is ' + this.firstname);
    }
}
const cc = new Son('ai', 'huohuo');
cc.saySurname(); // My surname is ai
cc.sayFirstname(); // My firstname is huohuo