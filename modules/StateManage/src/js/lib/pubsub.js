// 发布订阅模式
export default class PubSub {
    constructor() {
        this.events = {};   // 用于保存具名事件
    }
    subscribe (event, callback) {

        let self = this;
// events 集合中没有已匹配的事件，则使用空数组创建（以便之后不用做类型检查）
        if (!self.events.hasOwnProperty(event)) {
            self.events[event] = [];
        }

        // 将回调添加到集合中
        return self.events[event].push(callback);
    }
// 发布方法（通知订阅）
    publish (event, data = {}) {
        let self = this;

        // events 集合中是否存在传入事件，没有则返回空数组
        if (!self.events.hasOwnProperty(event)) {
            return [];
        }
// 存在传入事件，则遍历每个回调并传数据
        return self.events[event].map(callback => callback(data));
    }
}