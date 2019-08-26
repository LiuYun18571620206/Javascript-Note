//将浮点数点左边的数每三位添加一个逗号，如12000000.11转化为『12,000,000.11』
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
