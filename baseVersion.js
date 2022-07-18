// 练习1
class MyPromise {
  constructor(executor) {
    this.result = null; // Promise的结果值
    this.state = "pending"; // Promise的状态，初始为'pending'

    this.resolve = this.resolve.bind(this); // Promise中的resolve
    this.reject = this.reject.bind(this); // Promise中的reject

    try{
        // 使用try时因为，如果在executor中执行了throw error的操作的话，那么也会被当作reject处理
        executor(this.resolve, this.reject); // new class实例时，构造函数会立刻执行，并且会为传入的回调函数输入 resolve方法和 reject方法
    }catch (error){
        this.reject(error)
    }
  }

  // Promise的resolve方法
  resolve(value) {
    if (this.state === "pending") {
      this.state = "fulfilled"; // 执行resolve方法改变state的状态-并且后续不可变
      this.result = value; // 并设置传入的结果，改变Promise实例的结果
    }
  }

  // Promise的reject方法
  reject(reason) {
    if (this.state === "pending") {
      this.state = "rejected"; // 执行reject方法改变state的状态-并且后续不可变
      this.result = reason; // 并设置传入的结果，改变Promise实例的结果
    }
  }
}

const p1 = new MyPromise((resolve, reject) => {
  resolve(1);
});
console.log(p1);

const p2 = new MyPromise((resolve, reject) => {
  reject("失败");
});
console.log(p2);

const p3 = new MyPromise((resolve,reject)=>{
  throw '出错了'
})
console.log(p3)


/**
 * ----------------------------------  Promise的基本构成 -------------------------------------------------
 * 1. 首先构造一个MyPromise的类
 * 2. 初始化state，result，resolve，reject
 * 3. 定义resolve，reject方法（只有在pending状态下才能修改state状态，并且调用resolve 只能由 pending 变为 fulfilled 或者是调用reject 将 pending 变为 rejected）
 * 4. 同时，因为throw error会执行reject的相关操作，因此执行executor方式时需要使用try catch 包裹，以捕获到error
 */
