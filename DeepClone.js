//分发克隆程序
function DistributeCloneHandlers(obj){
    let str=Object.prototype.toString.call(obj)
    switch(str){
        case '[object Function]':
            return FunctionClone(obj)
        case '[object Object]':
            return ObjectClone(obj)
        case '[object Set]':
            return SetClone(obj)
        case '[object WeakSet]':
            return obj
        case '[object WeakMap]':
            return obj
        case '[object Map]':
            return MapClone(obj)
        case '[object Array]':
            return ArrayClone(obj)
        case '[object RegExp]':
            return RegExpClone(obj)
        case '[object Date]':
            return DateClone(obj)
        case '[object HTMLAnchorElement]':
            return HTMLClone(obj)
        default:
            throw TypeError('类型错误')
    }
}

//保存克隆后的对象 {oldObject <-> newObject}
let oldNewObject=new Map()

//记录不克隆的对象
let nonClone=new Set()

//用于记录暂没有新对象的旧对象
let sym=Symbol('z')

//设置避开哪些对象,true为要Clone,false为不Clone
let Options={
    setting:{
    Html:true,
    Array:true,
    Function:false,
    Object:true,
    WeakMap:true,
    WeakSet:true,
    Set:true,
    Map:true,
    RegExp:true,
    Date:true
    },
    ignore:[]
}

//深度遍历优先检查循环引用
function DeepClone(obj,options){
    if(options){
        OptionsSet(options)
    }
    if((typeof obj!=='object'&&typeof obj!=='function')||obj===null){
        return obj
    }
    if(oldNewObject.has(obj)){
        return oldNewObject.get(obj)
    }
    return DistributeCloneHandlers(obj)
}

function OptionsSet(options){
    Options.setting={...Options['setting'],...options['setting']}
    if(Array.isArray(options.ignore)){
        Options.ignore=options.ignore.filter((v)=>{
            if((typeof v==='object'&&v!==null)||typeof v==='function'){
                return true
            }
            return false
        })
    }
    console.log(Options)
    nonClone.clear()
    options.ignore.forEach((v)=>{
        nonClone.add(v)
    })
}

function FunctionClone(fn){
    //克隆一个函数
    if(!Options.setting.fn||nonClone.has(fn)){
        return fn
    }
    let newFN=function(...c){
        return fn.call(this,...c)
    }
    oldNewObject.set(fn,newFN)
    return newFN
}

function ObjectClone(obj){
    if(!Options.setting.Object||nonClone.has(obj)){
        return obj
    }
    let proto=Reflect.getPrototypeOf(obj),newObj={}
    oldNewObject.set(obj,newObj)
    if(proto!==Object.prototype){
        //运行到这里代表不是字面量声明对象
        Reflect.setPrototypeOf(newObj,proto)
    }
    let Property=[...Object.keys(obj),...Object.getOwnPropertySymbols(obj)]
    Property.forEach((v)=>{
        newObj[v]=DeepClone(obj[v])
    })
    return newObj
}

function ArrayClone(arry){
    if(!Options.setting.Array||nonClone.has(arry)){
        return arry
    }
    let newArray=[]
    oldNewObject.set(arry,newArray)
    let Property=[...Object.keys(arry),...Object.getOwnPropertySymbols(arry)]
    Property.forEach((v)=>{
        newArray[v]=DeepClone(arry[v])
    })
    return newArray
}

function RegExpClone(reg){
    if(!Options.setting.RegExp||nonClone.has(reg)){
        return reg
    }
    let newReg=new RegExp(reg)
    oldNewObject.set(reg,newReg)
    return newReg
}

function DateClone(date){
    if(!Options.setting.Date||nonClone.has(date)){
        return date
    }
    let newDate=new Date(date.getTime())
    oldNewObject.set(date,newDate)
    return newDate
}

function HTMLClone(html){
    if(!Options.setting.Html||nonClone.has(html)){
        return html
    }
    let newElement=html.cloneNode(true)
    oldNewObject.set(html,newElement)
    return newElement
}

function SetClone(set){
    if(!Options.setting.Set||nonClone.has(set)){
        return set
    }
    let Property=[...Object.keys(set),...Object.getOwnPropertySymbols(set)];
    let newSet=new Set()
    oldNewObject.set(set,newSet)
    set.forEach((v)=>{
        newSet.add(DeepClone(v))
    })
    Property.forEach((v)=>{
        newSet[v]=DeepClone(set[v])
    })
    return newSet
}

function MapClone(map){
    if(!Options.setting.Map||nonClone.has(map)){
        return map
    }
    let Property=[...Object.keys(map),...Object.getOwnPropertySymbols(map)]
    let newMap=new Map()
    oldNewObject.set(map,newMap)
    Property.forEach((v)=>{
        newMap[v]=DeepClone(mapp[v])
    })
    map.forEach((v,i)=>{
        newMap.set(DeepClone(i),DeepClone(v))
    })
    return newMap
}

let a={a:1,b:{},c:new RegExp(/123/),d:new Date,e:new Set(),f:new Map(),g:[],h:function(){console.log(1)}}
a.e.add(a.b)
a.f.set(a.c,a.e)
let b=DeepClone(a,{ignore:[a.g]})
console.log(b);console.log(a.a===b.a,a.b===b.b,a.c===b.c,a.d===b.d,a.e===b.e,a.f===b.f,a.g===b.g,a.h===b.h)
