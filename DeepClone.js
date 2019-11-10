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
