// 练习2
class MyPromise {
  constructor(executor) {
    this.result = null; // Promise的结果值
    this.state = "pending"; // Promise的状态，初始为'pending'
    this.onFulfilledCallbacks = []; // 用以存储成功时的回调函数
    this.onRejectedCallbacks = []; // 用以存储失败时的回调函数

    this.resolve = this.resolve.bind(this); // Promise中的resolve
    this.reject = this.reject.bind(this); // Promise中的reject

    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  // Promise的resolve方法
  resolve(value) {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.result = value;

      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(this.result); // 循环取出成功的回调数组中的第一个函数，传入结果并执行函数
      }
    }
  }

  // Promise的reject方法
  reject(reason) {
    if (this.state === "pending") {
      this.state = "rejected";
      this.result = reason;
      while(this.onRejectedCallbacks.length){
        this.onRejectedCallbacks.shift()(this.result); // 循环取出失败的回调数组中的第一个函数，传入原因并执行函数
      }
    }
  }

  // then方法需要接收两个函数onFulfilled, onRejected
  then(onFulfilled, onRejected) {
    // 确保then接收到的两个参数一定要是函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    //  执行then的时候需要查看当前state状态是否为 fulfilled | rejected
    if (this.state === "fulfilled") {
      onFulfilled(this.result); // 传入成功的结果
    } else if (this.state === "rejected") {
      onRejected(this.result); // 传入失败的原因
    } else if (this.state === "pending") {
      // 如果状态为待定状态的话，那么就保存两个回调
      this.onFulfilledCallbacks.push(onFulfilled.bind(this));
      this.onRejectedCallbacks.push(onRejected.bind(this));
    }
  }
}

const p1 = new MyPromise((resolve, reject) => {
  resolve("成功");
}).then(
  (res) => console.log(res),
  (err) => console.log(err)
);

const p2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    // resolve("成功");
    reject('失败')
  }, 2000);
}).then(
  (res) => console.log(res),
  (err) => console.log(err)
);

// 如果是在setTimeout等异步方法中调用resolve和reject那么，then方法没法延迟执行，但有办法可以延迟执行then中的回调函数，也就是利用数组，分别存储成功
// 和失败的回调，当定时器结束之后，再调用回调函数。

// todo 实现then 和 定时器（异步操作）
