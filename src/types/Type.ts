import { bubbleSort } from "./BubbleSort"

let repeat =  <a>(f: Fun<a,a>, n:number) : Fun<a,a> =>
    n <=0 ? id<a>() : f.then(repeat(f, n - 1))  

let repeatUntil =  <a>(f: Fun<a,a>, predicate: Fun<a, boolean>) : Fun<a, a> =>
    Fun((x:a) => predicate.f(x) ? id<a>().f(x) : f.then(repeatUntil(f, predicate)).f(x))

let id = <a>() : Fun<a,a> => id<a>()

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


export type List<a> = {
    content: a[]
	map: <b>(f: Fun<a,b>) => List<b> 
    select: <k extends keyof a>(...keys : k[]) =>  List<Subset<a, k>>
    where: (this: List<a>, predicate: Fun<a, boolean>) => List<a>
    orderby: (attribute: NumberStringPropertyNames<a>, order?: keyof Comperator<a>) => List<a>  
}

export type Comperator<T> = {
    ASC: Fun<T, boolean>
    DESC: Fun<T, boolean>
}

export const Comperator = <T>(comparer: T): Comperator<T> => ({
    ASC: Fun<T, boolean>(x => x <= comparer),
    DESC: Fun<T, boolean>(x => comparer <= x)
})

export type stringAndNumber = number|string
// List<[x extends keyof Extract<keyof a, k> : a[x]]>
type ConvertTo<T, v> = Pick<T, {[k in keyof T] : v extends k ? k: never }[keyof T] >
type Subset<T, v> = ConvertTo<T, v >

export const List = function<a>(array: a[]) : List<a>{
    return {
        content: array,
        map: function<b>(f: Fun<a,b>) : List<b>{

            let new_array : b[] = []
            for(var i = 0; i < array.length; i++) {
                new_array[i] = f.f(array[i])
            }
            return List(new_array) 
		} ,  //Extract<keyof a, k>
		select: function<k extends keyof a>(this: List<a>, ...keys: k[]) : List<Subset<a, k>> { 
            let new_array : Subset<a, k>[] = []       
            this.content.forEach(element => {  
                let new_element = {} as a; 
                keys.forEach(key => new_element[key] = element[key])       
                new_array.push(new_element)
            } )     
            return List(new_array)
        },
        where: function(this: List<a>, predicate: Fun<a, boolean>) : List<a> {
            let filtered_list: a[] = []
            this.content.forEach(element => {
                if (predicate.f(element)) {
                    filtered_list.push(element)
                }
            })
            return List(filtered_list)
        },
        orderby: function (this: List<a>, attribute: NumberStringPropertyNames<a>, order: keyof Comperator<a> = "ASC"): List<a> {
            var sortedList = bubbleSort(this, attribute)
            if(order == 'ASC') 
                return sortedList
            return List(sortedList.content.reverse())
        },
    }
}

type NumberStringPropertyNames<T> = { [K in keyof T]: T[K] extends number |string ? K : never }[keyof T];