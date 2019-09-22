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

//深拷贝
function DeepClone(obj){
    if(Array.isArray(obj)){
        let value=[]
        for(let i=0;i<obj.length;i++){
            value.push(DeepClone(obj[i]))
        }
        return value
    }else if(typeof obj==='object'&&obj!==null){
        let value={}
        for(let i in obj){
            value[i]=DeepClone(obj[i])
        }
        return value
    }else{
        return obj
    }
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
