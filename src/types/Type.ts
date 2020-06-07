
let repeat =  <a>(f: Fun<a,a>, n:number) : Fun<a,a> =>
    n <=0 ? id<a>() : f.then(repeat(f, n - 1))  

let repeatUntil =  <a>(f: Fun<a,a>, predicate: Fun<a, boolean>) : Fun<a, a> =>
    Fun((x:a) => predicate.f(x) ? id<a>().f(x) : f.then(repeatUntil(f, predicate)).f(x))

let id = <a>() : Fun<a,a> => Fun(x=> x)

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


// container with two generics, one with immutable information and the one for select (subset)
 // Query<T, C>
 // new Query<Student, {}>().select("Name", "Surname") -> Query<Student, {Name:string, Surname:string}>
 // new Query<Student, {}>().select("Name", "Surname").Include(grades, (g:Query<Grade, {}>>) => g.Select("..."))-> Query<Student, {Name:string, Surname:string, Grades:{...}}>

export type Query<T, C> = {  // C is always current
    template: T[]
    current: (keyof T)[]
    toArray: () => C[]
    select: <k extends keyof C>(...keys : k[]) =>  Query<T, Subset<C,k>>  // & keyof C
     where: <k extends keyof T>(key: k, predicate: Fun<T[k], boolean>) => Query<T, C>
    // orderby: (attribute: NumberStringPropertyNames<T>, order?: keyof Comperator<T>) => Query<T, C, k>  
    // include: (attribute: ArrayPropertyNames<T>) => Query<T,C>  
}
type ConvertTo<T, v> = Omit<T, {[k in keyof T] : v extends k ? k: never }[keyof T] >  
type Subset<T, v> = ConvertTo<T, v> 

export const Query = function<T>(array: T[]) : Query<T, T>{ // new Query<Student, {}>().select("Name", "Surname") -> Query<Student, {Name:string, Surname:string}>
    return {
        template: array,
        current: [],
        toArray: function(this: Query<T, T>) : T[] {
            let new_array : T[] = []   
            this.current.length == 0 ? new_array = this.template :
            this.template.forEach(element => {  
                let new_element = {} as T; 
                this.current.forEach(key => new_element[key] = element[key]  )       
                new_array.push(new_element)
            })  
            return new_array   
        },
		select: function<k extends keyof T>(this: Query<T,T>, ...keys: k[] ) : Query<T, Subset<T,k> > {    //& { [P in k]: T[k] }
             keys.forEach(key => this.current.push(key))
            return this
        },
        where: function <k extends keyof T>(this: Query<T,T>, key: k, predicate: Fun<T[k], boolean>) : Query<T,T> {
            let filtered_list: T[] = []
            this.template.forEach(element => {
                if (predicate.f(element[key])) {
                    filtered_list.push(element)
                }
            })
            return {...this, template: filtered_list}
        },
        // orderby: function(this: Query<T, T, k>, attribute: NumberStringPropertyNames<T>, order: keyof Comperator<T> = "ASC"): Query<T,T,k> {
        //     var sortedQuery = bubbleSort(this.content, attribute)
        //     if(order == 'ASC') 
        //         return Query(sortedQuery)
        //     return Query(sortedQuery.reverse())
        // },
        // include: function<C>(this: Query<T, C>, attribute: ArrayPropertyNames<T>): Query<T, C> {
        //     // attribute = 'grades'
        //     // [Grade, Grade, Grade]
        //     this.content.forEach(student => console.log(student))  // not finish
        //     return Query(filtered_list, {})
        // },
    }
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

type NumberStringPropertyNames<T> = { [K in keyof T]: T[K] extends number |string ? K : never }[keyof T];
type ArrayPropertyNames<T> = { [K in keyof T]: T[K] extends any[] ? K : never }[keyof T]; // "grades" = K  Grade[]  Student > grades > Grade[]  Student[key] = value type
