//金额千分位格式化，如12000000.11转化为『12,000,000.11』
function commafy(num){
    if(!num){return num}
    let str,min,arry
    str=num.toString()
    arry=parseInt(str).toString().split('')
    arry.reverse()
    arry=arry.map((v,i)=>{
        if((i+1)%3===0){
            return ','+v 
        }
        return v
    })
    arry.reverse()
    if(str.indexOf('.')!==-1){
        min=str.substring(str.indexOf('.'),str.length)
        return `${arry.join('')}${min}`
    }
    return arry.join('')
}

//计算图片平均颜色值
function handleImgOnload(img){
        let canvas=document.createElement('canvas')         
        let image=img                                      
        canvas.width=image.width
        canvas.height=image.height
        let context=canvas.getContext("2d")
        //在canvas中将img绘制出来
        context.drawImage(image,0,0,canvas.width,canvas.height)
        //获取canvas中的像素信息
        let data=context.getImageData(0,0,image.width,image.height).data
        let [r,g,b]=[0,0,0];
        //竖向遍历
        for(let i=0;i<image.height;i++){
        //横向遍历
            for(let j=0;j<image.width;j++){
                r+=data[(i*j+j)*4]
                g+=data[(i*j+j)*4+1]
                b+=data[(i*j+j)*4+2]
            }
        }
        //除以图片的面积取平均值
        r=Math.floor(r/(image.height*image.width))
        g=Math.floor(g/(image.height*image.width))
        b=Math.floor(b/(image.height*image.width))
        return [r,g,b]
    }

//替换对象中的循环引用
function CircularReference(obj,cache=[]){
    cache.push(obj)
    for(let i of Object.keys(obj)){
        if(typeof obj[i]==='object'&&obj[i]!==null){
            if(cache.indexOf(obj[i])===-1){
                let caches=[...cache]
                CircularReference(obj[i],caches)
            }else{
                obj[i]='循环引用'
                return
            }
        }
    }
    return
}

//获取参数列表
function getHash(){
    let str=window.location.search,arry,obj={}
    str=str.substr(1)
    arry=str.split('&')
    arry=arry.map((v)=>{
        let value
        value=v.split('=')
        obj[value[0]]=value[1]
    })
    return obj
}

//将页面所有JPG替换为a
function repalceImg(){
    let old=[...document.querySelectorAll('img')]
    old=old.filter((v)=>{
        let str=v.src.substr(v.src.length-4)
        if(str==='.jpg'){
            return true
        }else{
            return false
        }
    })
    old.forEach((v)=>{
        let src=v.src,father=v.parentNode,a
        father.removeChild(v)
        a=document.createElement('a')
        a.href=src
        father.appendChild(a)
    })
}

//防抖函数
function debounce(fn,wait,...parameter){
    let timeout=null
    return function(){
        if(timeout!==null){
            clearTimeout(timeout)
        }
        timeout=setTimeout(fn,wait,...parameter)
    }
}

//节流函数
function throttle(fn,delay){
    let time=Date.now()
    return function(){
        if(Date.now()-time>=delay){
            fn()
            time=Date.now()
        }
    }
}

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

//简易Redux
function createStore(reducer){
    let state
    let listeners=[]
    const subscribe=(v)=>listeners.push(v)
    let getState=()=>state
    let dispatch=function(action){
        if(!action){
            action={type:null}
        }
        state=reducer(state,action)
        listeners.forEach((fn)=>{fn()})
    }
    dispatch()
    return {getState,dispatch,subscribe}
}

//Cookie操作
function setCookie(name,value,time){
        let t=new Date()
        t=new Date(t.getTime()+time).toUTCString()
        let expires='expires='+t
        document.cookie=`${name}=${value};${expires}`
}
function getCookie(name){
    let cookie=document.cookie
    cookie=cookie.split('; ')
    cookie=cookie.map((v)=>{
        return v.split('=')
    })
    for(let i=0,len=cookie.length;i<len;i++){
        if(cookie[i][0]===name){
            return cookie[i][1]
        }
    }
    return ''
}
function removeCookie(name){
    setCookie(name,'',-1000)
}

//Vue2.x双向绑定理论实现
function model(obj1,obj2,attribute){
    //attribute是要绑定的字符串属性
    let value=obj1[attribute]?obj1[attribute]:null;
    if(!value)return
    Object.defineProperties(obj1,{
        [attribute]:{
            get(){
                return value
            },
            set(newValue,oldValue){
                value=newValue
            }
        }
    })
    Object.defineProperties(obj2,{
        [attribute]:{
            get(){
                return value
            },
            set(newValue,oldValue){
                value=newValue
            }
        }
    })
}
//setTimeout模拟setInterval
function SetInterval(fn,num,...cc){
        function setInterval(){
                fn(...cc)
                setTimeout(setInterval,num,...cc)
        }
       setTimeout(setInterval,num)
}

//手写一个拖拽.js   拖拽基于窗口移动
function Drag(dom,maxHeight,maxWidth,minHeight=0,minWidth=0){
        let DragPlay=false
        let left=0
        let top=0
        dom.style.position='absolute'
        dom.style.left=minWidth+'px'
        dom.style.top=minHeight+'px'
        function DomDragPlay(e){
                DragPlay=true
                left=e.screenX
                top=e.screenY
        }
        function bodyDragMouseMove(e){
                if(!DragPlay)return
                let NowLeft=e.screenX
                let NowTop=e.screenY
                left=parseInt(dom.style.left)+NowLeft-left
                top=parseInt(dom.style.top)+NowTop-top
                if(left>maxWidth){
                        left=maxWidth
                }
                if(top>maxHeight){
                        top=maxHeight
                }
                if(top<minHeight){
                        top=minHeight
                }
                if(left<minWidth){
                        left=minWidth
                }
                dom.style.left=left+'px'
                dom.style.top=top+'px'
                left=NowLeft
                top=NowTop
        }
        function bodyDragMouseUp(e){
                DragPlay=false
        }
        dom.addEventListener('mousedown',DomDragPlay)
        document.addEventListener('mousemove',bodyDragMouseMove)
        document.addEventListener('mouseup',bodyDragMouseUp)
        return function(){
                dom.removeEventListener('mousedown',DomDragPlay)
                document.removeEventListener('mousemove',bodyDragMouseMove)
                document.removeEventListener('mouseup',bodyDragMouseUp)
        }
}

//实现一个基本的Event Bus
function EventBus(){
        let obj={}
        let listener=[]
        obj.emit=function(...cc){
                return listener.map(v=>v(...cc))
        }
        obj.getFN=function(fn){
                if(Object.prototype.toString.call(fn)==='[object Function]'){
                        listener.push(fn)
                }
        }
        return obj
}

//手写实现Object.create
Object.prototype.NEWcreate=function(proto){
        return Object.setPrototypeOf({},proto)
}

//继承的几种方法 假设有构造函数A要继承构造函数B
function protoExtend(a,b){
        //原型继承
        return Object.setPrototypeOf(new a,new b)
}
function A(B){
        //借用构造函数
        B.call(this)
}
function AB(A,B){
        //组合继承
        let obj=new A
        let prototype=B.prototype
        B.call(obj)
        A.prototype.__proto__=prototype
        return obj
}

//intanceOf实现
function instanceOf(A,B){
        let proto=Object.getPrototypeOf(A)
        while(proto!==null){
                if(proto.constructor===B){
                        return true
                }
                proto=Object.getPrototypeOf(proto)
        }
        return false
}

//柯里化与反柯里化
function curring(fn){
        let list=[]
        let klh=(...cc)=>{
                if(cc.length!==0){
                        list.push(...cc)
                        return klh
                }
                else{
                        return fn(...list)
                }
        }
        return klh
}
Function.prototype.uncurring=function(){
        return (obj,...cc)=>{
                return this.call(obj,...cc)
        }
}

//手写一个new操作符
function NEW(fn){
        let obj={}
        let fnObj=fn.call(obj)
        if(Object.prototype.toString.call(fnObj)==='[object Object]'){
                return fnObj
        }
        return Object.setPrototypeOf(obj,fn.prototype)
}
