import { bubbleSort } from "./BubbleSort.js"

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


// T wordt nooit gemanipuleerd en standaard doorgegeven, zodat alle methods behalve select en include toegang hebben tot alle properties
// C wordt alleen bij select en include gemanipuleerd en bij andere methoden niet.
export type Query<T, C> = {   // Bij de functie zijn T en C in het begin hetzelfde <Student,Student>. bij select wordt C een Subset >>>> <Student, Subset<Student,key>
    // template draagt de originele data van een entiteit 
    template: T[]
    // current: current draagt keys van T die worden geselecteerd via de select of include methode
    current: (keyof T)[]
    // toArray: end-point functie wat de chain beeindigt en een array teruggeeft op basis van de operaties uitgevoerd op een query
    toArray: () => T[]
    // bij select methode wordt C van Query<T,C> gemanipuleerd, en draagt informatie over gefilterde ATTRIBUTEN (Subset) die zijn gefilterd door de select method.
    select: <k extends keyof C>(key: k, ...keys : k[]) =>  Query<T, Subset<C,k>>    
    // bij where methode verandert de inhoud van template T[], maar de structuur van T blijft hetzelfde, omdat slechts de RESULTATEN worden gefilterd.
    where: <k extends NoneArrayPropertyNames<T>>(key:k, predicate: Fun<T[k], boolean>) => Query<T, C> 
    // bij orderby methode wordt alleen de inhoud van template, door elkaar geschud, de structuur van T en C blijven hetzelfde.
    orderby: (attribute: NumberStringPropertyNames<T>, order?: keyof Comperator<T>) => Query<T, C>  
    // bij include methode worden alleen keys geaccepteerd waarvan de value type in type array is. 
    // De nested type van de geselecteerde array-attribuut wordt gebruikt om een nieuwe Query te maken, namelijk: Query<NestedType<T[K]>, NestedType<T[K]>>
    // en de lambda functie 'q' wordt hierop uitgevoerd
    include: <K extends ArrayPropertyNames<T> & keyof C, P extends keyof NestedType<C[K]>>(
        record: K,
        q: (_: Query<NestedType<T[K]>,NestedType<C[K]>>) => Query<NestedType<T[K]>, Pick<NestedType<C[K]>,P>>
    ) =>
    Query<T, Subset<C,K> >
     
}


export type NestedType<T> = T extends Array<infer U> ? U : never;


// Volgens Mohamed's suggestie: Subset geeft een set terug van alle attributen die je NIET hebt gekozen, dit is het resultaat van Omit
// Zo krijg je bij elke nieuwe select een optie van attributen die je nog niet eerder hebt geselecteerd.
type Subset<T, v> = Omit<T, {[k in keyof T] : v extends k ? k: never }[keyof T] >  

export const Query = function<T>(array: T[]) : Query<T, T>{ 
    return {   // De Query functie wordt alleen gebruikt voor het initieren van een query, in het begin en niet bij de return statement van de methoden. 
        template: array,
        current: [],
        // Als er geen select is gedaan (current.length == 0), dan is de new_array gelijk aan de template (originele data)
        // Als er wel een select is, dan kijkt het naar de opgeslagen keys in current en maakt een new_array op basis van de geselecteerde keys.
        toArray: function(this: Query<T, T>) : T[] {
            let new_array : T[] = []   
            this.current.length == 0 ? new_array = this.template :
            this.template.forEach(element => {  
                let new_element = {} as T;         
                this.current.forEach(key => new_element[key] = element[key])
                new_array.push(new_element)
            })
            return new_array   
        },
        // Meerdere selects geven meerdere nested Subset... Na 3 selects krijg je... Subset<Subset<Subset<Student, key>>>,
        // en dus een steeds minder keuzes aan attributen om uit te kiezen
		select: function<k extends keyof T>(this: Query<T,T>,key: k, ...keys: k[]) : Query<T, Subset<T,k> > {  
             this.current.push(key)
             keys.forEach(key => this.current.push(key))
            return this
        },
        where: function <k extends NoneArrayPropertyNames<T>>(this: Query<T,T>, key: k, predicate: Fun<T[k], boolean>) : Query<T,T> {
            let filtered_list: T[] = []
            this.template.forEach(element => {
                if (predicate.f(element[key])) {
                    filtered_list.push(element)
                }
            })
            return {...this, template: filtered_list}
        },
        orderby: function(this: Query<T, T>, attribute: NumberStringPropertyNames<T>, order: keyof Comperator<T> = "ASC"): Query<T,T> {
            var sortedQuery = bubbleSort(this.template, attribute)
            if(order == 'ASC') 
                return {...this, template: sortedQuery}   // Gebruik niet de Query-functie zelf om een nieuwe array terug te geven, gebruik rest parameter in object en pas een property aan
            return {...this, template: sortedQuery.reverse()} 
        },
        include: function <K extends ArrayPropertyNames<T>, P extends keyof NestedType<T[K]>>(
            record: K,
            q: (_: Query<NestedType<T[K]>,NestedType<T[K]>>) => Query<NestedType<T[K]>, Pick<NestedType<T[K]>, P>>
        ):
            Query<T, Subset<T,K>> { 
                this.current.push(record)
                                     //student
                this.template.map(element => {
                    var grade : NestedType<T[K]>[] = element[record]  // Grade[] per student
                    var queried_array = q(Query<NestedType<T[K]>>(grade)).toArray()
                    element[record] = queried_array as T[K]
                });
                return this   
        },        
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

type NumberStringPropertyNames<T> = { [K in keyof T]: T[K] extends number |string ? K : never }[keyof T];
type ArrayPropertyNames<T> = { [K in keyof T]: T[K] extends any[] ? K : never }[keyof T];
type NoneArrayPropertyNames<T> = { [K in keyof T]: T[K] extends any[] ? never : K }[keyof T];
    // "grades" = K  Grade[]  Student > grades > Grade[]  Student[key] = value type

    
