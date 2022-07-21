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
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(this.result); // 循环取出失败的回调数组中的第一个函数，传入原因并执行函数
      }
    }
  }

  // then方法需要接收两个函数onFulfilled, onRejected
  then(onFulfilled, onRejected) {
    // 确保then接收到的两个参数一定要是函数, 如果只是一个单一的值，则这个值会被转变成 (val)=>val 的形式
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    //   then函数的返回值 变成一个Promise对象
    var thenPromise = new MyPromise((res, rej) => {
      const resolvePromise = (cb) => {
        try {
          const x = cb(this.result);

          if (x === thenPromise) {
            throw new Error("不能返回自身");
          }

          if (x instanceof MyPromise) {
            // 如果返回值是Promise
            // 如果返回值是promise对象，返回值为成功，新promise就是成功
            // 如果返回值是promise对象，返回值为失败，新promise就是失败
            // 谁知道返回的promise是失败成功？只有then知道
            x.then(res, rej);
          } else {
             // 非Promise就直接成功
            res(x);
          }
        } catch (err) {
          rej(err);
          throw new Error(err);
        }
      };

      //  执行then的时候需要查看当前state状态是否为 fulfilled | rejected
      if (this.state === "fulfilled") {
        resolvePromise(this.result); // 传入成功的结果
      } else if (this.state === "rejected") {
        resolvePromise(this.result); // 传入失败的原因
      } else if (this.state === "pending") {
        // 如果状态为待定状态的话，那么就保存两个回调
        this.onFulfilledCallbacks.push(resolvePromise.bind(this));
        this.onRejectedCallbacks.push(resolvePromise.bind(this));
      }
    });

    return thenPromise;
  }
}

const p1 = new Promise((res,rej)=>{
    res(1)
}).then((res)=>1)

