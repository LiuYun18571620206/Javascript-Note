//原生call、apply、bind实现
Function.prototype.myCall=function(context,...c){
    if(typeof this!=='function'){
        throw TypeError("调用该函数的上下文对象不是函数")
    }
    if(!this.prototype){
        //判断是否为箭头函数
        return this()
    }
    context=context||window
    arry=c||[]
    let fn=this,sym=Symbol('fn')
    try{
        context[sym]=fn
        return context[sym](...arry)
    }finally{
        delete context
    }
}

Function.prototype.myApply=function(context,arry){
    if(typeof this!=='function'){
        throw TypeError("调用该函数的上下文对象不是函数")
    }
    if(!this.prototype){
        //判断是否为箭头函数
        return this()
    }
    context=context||window
    Array.isArray(arry)?void 0:arry=[]
    let fn=this,sym=Symbol('fn')
    try{
        context[sym]=fn
        return context[sym](...arry)
    }finally{
        delete context[sym]
    }
}

Function.prototype.myBind=function(context,...c){
    if(typeof this!=='function'){
        throw TypeError("调用该函数的上下文对象不是函数")
    }
    context=context||window
    let fn=this
    let nop=function(...s){
        if(Reflect.getPrototypeOf(this)===nop.prototype){
            //判断是否为new操作
            this.prototype=fn.prototype
        }
        return fn.myCall(context,...c,...s)
    }
    return nop
}
