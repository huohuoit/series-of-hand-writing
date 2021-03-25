import PubSub from '../lib/pubsub.js';

export default class Store {
    constructor(params) {
        let self = this;

        // 添加一些默认对象来保存actions, mutations and state
        self.actions = {};
        self.mutations = {};
        self.state = {};

        // 在 actions 和 mutations 期间设置的状态枚举
        self.status = 'resting';

        // 将我们的 PubSub 模块附加为一个' events '元素
        self.events = new PubSub();

        // 在传入的params对象中查找可能已传入的 actions 和 mutations 
        if (params.hasOwnProperty('actions')) {
            self.actions = params.actions;
        }

        if (params.hasOwnProperty('mutations')) {
            self.mutations = params.mutations;
        }

        // Store 对象跟踪变化（使用 Proxy 代理）
        self.state = new Proxy((params.state || {}), {
            set: function (state, key, value) {

                // 按照我们通常的方式设置值
                state[key] = value;

                // 跟踪到控制台。这将根据相关的操作分组
                console.log(`stateChange: ${key}: ${value}`);

                // 发布正在侦听的组件的更改事件
                self.events.publish('stateChange', self.state);

                // 如果用户直接设置了一个值，就告诉他们一点
                if (self.status !== 'mutation') {
                    console.warn(`You should use a mutation to set ${key}`);
                }

                // 为下一次操作重置状态做准备
                self.status = 'resting';

                return true;
            }
        });
    }

    // 调用 actions 的 dispatch 方法
    dispatch (actionKey, payload) {

        let self = this;

        // 查找 actions
        if (typeof self.actions[actionKey] !== 'function') {
            console.error(`Action "${actionKey} doesn't exist.`);
            return false;
        }

        // 创建一个控制台组，其中包含来自代理的日志等等
        console.groupCollapsed(`ACTION: ${actionKey}`);

        // actions 存在，设置状态
        self.status = 'action';

        // 调用 actions
        self.actions[actionKey](self, payload);

        // Close our console group to keep things nice and neat
        console.groupEnd();

        return true;
    }

    // 调用 mutation 的 commit 方法
    commit (mutationKey, payload) {
        let self = this;

        // 在尝试运行它之前，运行一个快速检查，看看这个突变是否确实存在
        if (typeof self.mutations[mutationKey] !== 'function') {
            console.log(`Mutation "${mutationKey}" doesn't exist`);
            return false;
        }

        // mutation 存在，设置状态
        self.status = 'mutation';

        // 调用 mutation 并从其返回值获得新状态
        let newState = self.mutations[mutationKey](self.state, payload);

         // 将新状态与现有状态合并
        self.state = Object.assign(self.state, newState);

        return true;
    }
}
