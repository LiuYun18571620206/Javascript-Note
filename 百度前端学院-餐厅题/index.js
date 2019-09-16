let Tongfu
class restaurant{
    static menu=[]
    static taskList=[]
    static i=0
    static searchIdle=function(v){
        //找到空闲的人
        if(Tongfu){
            let s
            switch(v){
                case 'waiter':
                    for(let i=0,length=Tongfu.list.length;i<length;i++){
                        if(Tongfu.list[i].waiterJob){
                            if(Tongfu.list[i].state){
                                return Tongfu.list[i]
                            }else{
                                s=Tongfu.list[i]
                            }
                        }
                    }
                    return s
                case 'chef':
                    for(let i=0,length=Tongfu.list.length;i<length;i++){
                        if(Tongfu.list[i].chefJob){
                            if(Tongfu.list[i].state){
                                return Tongfu.list[i]
                            }else{
                                s=Tongfu.list[i]
                            }
                        }
                    }
                    return s
                default:
                    return null
            }
        }else{
            console.error('您的餐厅还没建立')
        }
    }
    constructor(money,number,list){
        Object.defineProperty(this,'money',{
            set(n,o){
                document.querySelector('.monery').innerHTML=`餐厅现金:${n}`
                this._money=n
            },
            get(){
                return this._money
            }
        })
        this.money=money;
        this.number=number;
        this.list=list;
        customer.queue=new Array(number).fill('空闲')
        let customerIn=document.querySelector('.customerIn')
        for(let i=0;i<number;i++){
            let div=document.createElement('div')
            div.appendChild(document.createTextNode('空闲'))
            customerIn.appendChild(div)
        }
        Tongfu=this
        customer.randomGet(5000,3,10)
        
    }
    addChef(){
        this.addStaff(new chef('chef',2000))
    }
    addWaiter(){
        this.addStaff(new waiter('waiter',2000))
    }
    addStaff(obj){
        this.list.push(obj)
        obj.overJob({type:'mount'})
    }
    removeStaff(obj){
        let i=this.list.indexOf(obj)
        if(i!==-1){
            let target=this.list.splice(i,1)[0]
            target.overJob({type:'unmount'})
        }
    }
}
class staff{
    constructor(name,wage){
        this.name=name;
        this.wage=wage
        this.state=true
    }
    getNode(){
        if(this.waiterJob){
            return document.querySelector('.waiter').querySelectorAll('div')[this.id]
        }
        if(this.chefJob){
            return document.querySelector('.chef').querySelectorAll('div')[this.id]
        }
    }
    mount(){
        if(this.waiterJob){
            let node=document.createElement('div')
            let type=document.querySelector('.waiter')
            node.appendChild(document.createTextNode('服务员'))
            type.appendChild(node)
            this.id=[...type.querySelectorAll('div')].indexOf(node)
            return
        }
        if(this.chefJob){
            let type=document.querySelector('.chef')
            let p=document.createElement('p')
            p.appendChild(document.createTextNode('厨师'))
            let div=document.createElement('div')
            div.appendChild(p)
            type.appendChild(div)
            this.id=[...type.querySelectorAll('div')].indexOf(div)
            return
        }
    }
    unmount(){
            if(this.waiterJob){
                let type=document.querySelector('.waiter')
                let target=this.getNode()
                type.removeChild(target)
            }
            if(this.chefJob){
                let type=document.querySelector('.chef')
                let target=this.getNode()
                type.removeChild(target)
            }
    }
    overJob(obj){
        if(!this.state){
            setTimeout((v)=>{this.overJob(v)},500,obj)
            return 
        }
        switch(obj.type){
            case 'waiter':
                this.waiterJob(obj.value)
                break
            case 'chef':
                this.chefJob(obj.value)
                break
            case 'mount':
                this.mount()
                break
            case 'unmount':
                this.unmount()
                break
            default:
                alert('不存在这个任务')
        }
    }
}
class waiter extends staff{
    constructor(name,wage){
        super(name,wage)
    }
    waiterJob(v){
        //是数组则点单，是对象则上菜
        this.state=false
        if(Array.isArray(v)){
            //找到厨师,将菜单给它
            let chef=restaurant.searchIdle('chef')
            if(chef){
                new Promise((res,rej)=>{
                    this.getNode().style.top='0px'
                    setTimeout(res,500)
                }).then(()=>{
                    this.state=true
                    chef.overJob({
                        type:'chef',
                        value:v
                    })
                })
            }
        }else{
            //上菜
            let target=this.getNode()
            if(target.style.top==='68px'){
                new Promise((res,rej)=>{
                    target.style.top='0px'
                    setTimeout(res,500)
                }).then(()=>{
                    return new Promise((res,rej)=>{
                        target.style.top='68px'
                        setTimeout(res,500)
                    })
                }).then(()=>{
                    this.state=true
                    for(let i=0;i<v.customer.length;i++){
                        v.customer[i].eat({
                            name:v.name,
                            price:v.price
                        })
                    }
                })
            }else if(target.style.top==='0px'){
                new Promise((res,rej)=>{
                    target.style.top='68px'
                    setTimeout(res,500)
                }).then(()=>{
                    this.state=true
                    for(let i=0;i<v.customer.length;i++){
                        v.customer[i].eat({
                            name:v.name,
                            price:v.price
                        })
                    }
                })
            }
            
        }
    }
}
class chef extends staff{
    static kitchen=[]
    constructor(name,wage){
        super(name,wage)
        setTimeout(()=>{
            this.getNode().innerHTML=`<p>厨师</p><div>空闲</div>`
        },0)
    }
    kitchenState(){
        let arry=chef.kitchen.map((v)=>{
            return `<div class="dishWait">${v.name}</div>`
        })
        document.querySelector('.kitchen').innerHTML=arry.join('')
    }
    async chefJob(v){
        //将顾客菜单结构 存储到厨房中
        let customer=v.customer
        let arry=v.map((v,i)=>{
            return v.name
        })
        let kitchen=chef.kitchen
        while(v.length){
            let type=v.shift(),b=false
            for(let i=0,len=kitchen.length;i<len;i++){
                if(kitchen[i].name===type.name){
                    kitchen[i].customer.push(customer)
                    b=true
                    break
                }
            }
            if(b)continue
            kitchen.push(
                {
                    name:type.name,
                    cost:type.cost,
                    price:type.price,
                    time:type.time,
                    customer:[customer]
                }
            )
        }
        console.log(chef.kitchen)
        this.kitchenState()
        if(this.state){this.state=false;this.dg()}else{return}
    }
    async dg(){
        while(chef.kitchen.length){
            let v=chef.kitchen.shift()
            this.kitchenState()
            await   new Promise((res,rej)=>{
                this.getNode().innerHTML=`<p>厨师</p><div>在做${v.name}</div>`
                setTimeout(res,v.time)
            }).then(()=>{
                Tongfu.money-=(v.cost*v.customer.length)
                let waiter=restaurant.searchIdle('waiter')
                waiter.overJob({type:'waiter',value:v}
                )
            })
        }
        this.getNode().innerHTML=`<p>厨师</p><div>空闲</div>`
        this.state=true
    }
}
class dish{
    constructor(name,cost,price,time){
        this.name=name;
        this.cost=cost;
        this.price=price;
        this.time=time*1000;
        restaurant.menu.push(this)
    }
}
class customer{
    //等待的顾客队列
    static waitQueue=[]
    static  queue=[]
    constructor(){
        this.price=0
        this.eatQueue=[]
        this.state=true
        this.mount()
        this.order()
    }
    static randomGet(n,m,k){
        let a=new Array(m).fill('customer')
            this.waitQueue=[...customer.waitQueue,...a]
            if(this.waitQueue.length>k){
                this.waitQueue.length=k
            }
        if(this.ran){
            clearInterval(this.ran)
        }
        this.ran=setInterval(()=>{
            let a=new Array(m).fill('customer')
            this.waitQueue=[...customer.waitQueue,...a]
            if(this.waitQueue.length>k){
                this.waitQueue.length=k
            }
        },n)
    }
    static sittingDown(){
        for(let i=0,len=this.queue.length;i<len;i++){
            if(this.queue[i]==='空闲'){
                if(this.waitQueue.length){
                    this.waitQueue.shift()
                    new customer()
                }else{
                    return
                }
            }
        }
    }
    mount(){
        let i=customer.queue.indexOf('空闲')
        customer.queue.splice(i,1,this)
        this.getNode()
    }
    unmount(){
        this.getNode.innerHTML='空闲'
        let i=customer.queue.indexOf(this)
        customer.queue.splice(i,1,'空闲')
        customer.sittingDown()
    }
    getNode(){
        let i=customer.queue.indexOf(this)
        let children=document.querySelector('.customerIn').querySelectorAll('div')
        children=[...children]
        this.getNode=children[i]
    }
    order(){
        if(restaurant.menu.length){
            //从职员列表中找到一名服务员
            let i=Math.floor(Math.random()*(1-restaurant.menu.length)+restaurant.menu.length)
            let menu=[]
            menu.customer=this
            for(let t=0;t<i;t++){
                let ran=Math.floor(Math.random()*restaurant.menu.length)
                menu.push(restaurant.menu[ran])
            }
            //menu是顾客的菜单
            new Promise((resolve,reject)=>{
                this.getNode.innerHTML='在点菜'
                setTimeout(resolve,3000)
            }).then(()=>{
                let waiter=restaurant.searchIdle('waiter')
                this.getNode.innerHTML='customer'
                this.list=[...menu]
                waiter.overJob({
                    type:'waiter',
                    value:menu
                })  
            })
        }else{
            alert('您的菜单中还没有菜')
        }
    }
    eat(v){
        if(this.state){
            this.eatQueue.push(v)
            this.dg()
        }else{
            this.eatQueue.push(v)
        }
}
async dg(){
    this.state=false
        while(this.eatQueue.length){
            let v=this.eatQueue[0]
            await new Promise((res,rej)=>{
                this.getNode.innerHTML=`在吃${v.name}`
                setTimeout(res,1000)
            }).then(()=>{
                let i=this.list.indexOf(v)
                this.price+=v.price 
                this.list.splice(i,1)
                this.eatQueue.shift()
                if(!this.list.length){
                    Tongfu.money+=this.price
                    this.unmount()
                 }
            })
        }
    this.state=true
}
}

//start
new dish('黄焖鸡',6,10,1),new dish('手撕包菜',3,7,1),new dish('青椒肉丝',7,10,1),new dish('老谭酸菜',2,4,1),new dish('红烧牛肉',8,12,1),new dish('汉堡',10,15,1)
new restaurant(10000,10,[])
Tongfu.addStaff(new waiter('肖磊',2000));Tongfu.addStaff(new chef('张文达',2000))
customer.sittingDown()
document.querySelector('.addWaiter').addEventListener('click',Tongfu.addWaiter.bind(Tongfu))
document.querySelector('.addChef').addEventListener('click',Tongfu.addChef.bind(Tongfu))