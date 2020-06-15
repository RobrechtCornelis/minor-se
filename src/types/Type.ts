import { bubbleSort } from "./BubbleSort"

let repeat =  <a>(f: Fun<a,a>, n:number) : Fun<a,a> =>
    n <=0 ? id<a>() : f.then(repeat(f, n - 1))  

let repeatUntil =  <a>(f: Fun<a,a>, predicate: Fun<a, boolean>) : Fun<a, a> =>
    Fun((x:a) => predicate.f(x) ? id<a>().f(x) : f.then(repeatUntil(f, predicate)).f(x))

let id = <a>() : Fun<a,a> => Fun(x=> x)

type NumberStringPropertyNames<T> = { [K in keyof T]: T[K] extends number |string ? K : never }[keyof T];
type ArrayPropertyNames<T> = { [K in keyof T]: T[K] extends any[] ? K : never }[keyof T]; // "grades" = K  Grade[]  Student > grades > Grade[]  Student[key] = value type

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

export type Comperator<T> = {
    ASC: Fun<T, boolean>
    DESC: Fun<T, boolean>
}

export const Comperator = <T>(comparer: T): Comperator<T> => ({
    ASC: Fun<T, boolean>(x => x <= comparer),
    DESC: Fun<T, boolean>(x => comparer <= x)
})

export type stringAndNumber = number|string


// Suggesties van Mohamed (onderstaande 4 regels)
// container with two generics, one with immutable information and the one for select (subset)
 // Query<T, C>
 // new Query<Student, {}>().select("Name", "Surname") -> Query<Student, {Name:string, Surname:string}>
 // new Query<Student, {}>().select("Name", "Surname").Include(grades, (g:Query<Grade, {}>>) => g.Select("..."))-> Query<Student, {Name:string, Surname:string, Grades:{...}}>


// T wordt nooit gemanipuleerd en standaard doorgegeven, zodat alle methods behalve select en include toegang hebben tot alle properties
// C wordt alleen bij select en include gemanipuleerd en bij andere methoden niet.
export type Query<T, C> = {   // Bij de functie zijn T en C in het begin hetzelfde <Student,Student>. bij select wordt C een Subset >>>> <Student, Subset<Student,key>
    // template draagt de originele data van een entiteit 
    template: T[]
    // current: current draagt keys van T die worden geselecteerd via de select of include methode
    current: (keyof T)[]
    // toArray: end-point functie wat de chain beeindigt en de query verandert naar een array om uitgelezen te kunnen worden.
    toArray: () => C[]
    // bij select method wordt C gemanipuleerd, en draagt informatie over gefilterde ATTRIBUTEN (Subset) die zijn gefilterd door de select method.
    select: <k extends keyof C>(...keys : k[]) =>  Query<T, Subset<C,k>>    
    // bij where method verandert de inhoud van template T[], maar T zelf wordt niet gemanipuleerd, omdat hier RESULTATEN worden gefilterd, maar de structuur van T blijft hetzelfde.
    where: <k extends keyof T>(key: k, predicate: Fun<T[k], boolean>) => Query<T, C> 
    // bij where method worden C en T niet gemanipuleerd, maar slechts doorgegeven. Where' verandert de template T, omdat hier RESULTATEN worden gefilterd en niet ATTRIBUTEN.
    orderby: (attribute: NumberStringPropertyNames<T>, order?: keyof Comperator<T>) => Query<T, C>
    
    include: <k extends ArrayPropertyNames<C>>(attribute: k, f: (q2: Query<ArrayExtractor<C, k>, ArrayExtractor<C, k>>) => Query<ArrayExtractor<C, k>, ArrayExtractor<C, k>>) => Query<T,Subset<C,k>>  
}

type ArrayExtractor<C, k extends keyof C> =  {[K in k] : C[K] extends (infer U)[] ? U : never }[k]

// Volgens Mohammed's suggestie: Subset geeft een set terug van alle attributen die je NIET hebt gekozen, dit is het resultaat van Omit
// Zo krijg je bij elke nieuwe select een optie van attributen die je nog niet eerder hebt geselecteerd.
type ConvertTo<T, v> = Omit<T, {[k in keyof T] : v extends k ? k: never }[keyof T] >  
type Subset<T, v> = ConvertTo<T, v>   // Zelfde als ConvertTo<T, v>

export const Query = function<T>(array: T[]) : Query<T, T>{ // new Query<Student, Student>().select("Name", "Surname") -> Query<Student, Pick<{Name:string, Surname:string}>>
    return {   // De Query functie wordt alleen gebruikt voor het initieren van een query, in het begin en niet als return functie bij de methoden. 
        template: array,
        current: [],
        // Als er geen select is gedaan (current.length == 0), dan is de new_array gelijk aan de template (originele data)
        // Als er wel een select is, dan kijkt het naar de opgeslagen keys in current en maakt een new_array op basis van de geselecteerde keys.
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
        // Meerdere selects geven meerdere nested Subset... Na 3 selects krijg je... Subset<Subset<Subset<Student, key>>>,
        // en dus een steeds minder keuzes aan attributen om uit te kiezen
		select: function<k extends keyof T>(this: Query<T,T>, ...keys: k[] ) : Query<T, Subset<T,k> > {  
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
        orderby: function(this: Query<T, T>, attribute: NumberStringPropertyNames<T>, order: keyof Comperator<T> = "ASC"): Query<T,T> {
            var sortedQuery = bubbleSort(this.template, attribute)
            if(order == 'ASC') 
                return {...this, template: sortedQuery}   // Gebruik niet de Query-functie zelf om een nieuwe array terug te geven, gebruik rest parameter in object en pas een property aan
            return {...this, template: sortedQuery.reverse()} 
        },
        include: function<k extends ArrayPropertyNames<T>>(this: Query<T, T>, attribute: k, f: (q2: Query<ArrayExtractor<T, k>, ArrayExtractor<T, k>>) => Query<ArrayExtractor<T, k>, ArrayExtractor<T, k>>) : Query<T, T> {
        //     // attribute = 'grades'
        //     // [Grade, Grade, Grade]
            let t2 = Query(this.template).select(attribute)
            // this.current = this.current.concat(t2.current)
            //console.log(t2)
            //this.current.forEach(student => Query(this.template).select(""))
            //t2.current.forEach(grade => console.log(grade))

            return {...this, current: this.current.concat(t2.current)}
        },
    }

}
