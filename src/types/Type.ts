
let repeat =  function<a>(f: Fun<a,a>, n:number) : Fun<a,a> {
    if(n <= 0){
        return id()
    }
    else{             
        return f.then(repeat(f, n - 1))
    }
}

let repeatUntil =  function<a>(f: Fun<a,a>, predicate: Fun<a, boolean>) : Fun<a, a> {
    let g =
    (x:a) => {
        if(predicate.f(x)){
            return id<a>().f(x)       
        }
        else{
            return f.then(repeatUntil(f, predicate)).f(x)
        }
    }
    return Fun(g)
}



export type Fun<a,b> = {
    f: (i:a) => b,
    then: <c>(g: Fun<b, c>) => Fun<a, c> ,
    repeat: () => Fun<number, Fun<a,a>>,
    repeatUntil: () => Fun<Fun<a,boolean>, Fun<a,a>>
}

export let Fun = function<a,b>(f: (_:a) => b) : Fun<a,b> {
    return {
        f:f, 
        then: function<c>(this: Fun<a,b>, g: Fun<b, c>) : Fun<a, c> {
            return Fun(a => g.f(this.f(a)))
        },
        repeat: function(this: Fun<a,a>) : Fun<number, Fun<a, a>> {
            return Fun(x => repeat(this, x))
        },
        repeatUntil: function(this: Fun<a, a>): Fun<Fun<a, boolean>, Fun<a, a>> {
            return Fun(predicate => repeatUntil(this, predicate))
          }
    }
}

let id = function<a>() : Fun<a,a> { return Fun(x => x) }

export type CustomArray<a> = {
    content: a[]
	map: <b>(f: Fun<a,b>) => CustomArray<b> 
	select: <k extends keyof a>(...keys : k[]) =>  CustomArray<Subset<a, k>>
}
// CustomArray<[x extends keyof Extract<keyof a, k> : a[x]]>
type ConvertTo<T, v> = Pick<T, {[k in keyof T] : v extends k ? k: never }[keyof T] >
type Subset<T, v> = ConvertTo<T, v >

export const CustomArray = function<a>(array: a[]) : CustomArray<a>{
    return {
        content: array,
        map: function<b>(f: Fun<a,b>) : CustomArray<b>{
            let new_array : b[] = []
            for(var i = 0; i < array.length; i++) {
                new_array[i] = f.f(array[i])
            }
            return CustomArray(new_array) 
		} ,  //Extract<keyof a, k>
		select: function<k extends keyof a>(this: CustomArray<a>, ...keys: k[]) : CustomArray<Subset<a, k>> { 
            let new_array : Subset<a, k>[] = []       
            this.content.forEach(element => {  
                let new_element = {} as a; 
                keys.forEach(key => new_element[key] = element[key])       
                new_array.push(new_element)
            } )     
            return CustomArray(new_array)
        }
    }
}