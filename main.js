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

//对对象执行深拷贝
