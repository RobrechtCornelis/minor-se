
export type Fun<a,b> = {
    f: (i:a) => b,
    then: <c>(g: Fun<b, c>) => Fun<a, c> ,
    repeat: () => Fun<number, Fun<a,a>>,
    repeatUntil: () => Fun<Fun<a,boolean>, Fun<a,a>>
}

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

export interface CustomArray<a> {
    content: a[]
    map: <b>(f: Fun<a,b>) => CustomArray<b> 
}

export const CustomArray = function<a>(array: a[]) : CustomArray<a>{
    return {
        content: array,
        map: function<b>(f: Fun<a,b>) : CustomArray<b>{
            let new_array : b[] = []
            for(var i = 0; i < array.length; i++) {
                new_array[i] = f.f(array[i])
            }
            return CustomArray(new_array) 
        } 
    }
}


	static IEnumerable<U> Map<T, U>(this IEnumerable<T> table, Func<T, U> transformer){
		
		U[] new_result = new U[table.Count()];
		for(int i = 0; i < table.Count(); i++){
			
			new_result[i] = transformer(table.ElementAt(i));
		}
		return new_result;
	}

	static IEnumerable<T> Filter<T>(this IEnumerable<T> table, Func<T, bool> condition){
		
		List<T> new_result = new List<T>();
		for(int i = 0;  i < table.Count(); i++){
			
			if(condition(table.elementAt(i)))
			{
				new_result.Add(table.elementAt(i))
			}
		}
		return new_result;	
	}

	static U Reduce<T, U>(this IEnumerable<T> table, U init,  Func<U, T, U> reducer){
		
		U acc = init;
		for(int i = 0; i < table.Count(), i++)
		{
			acc = reducer(acc, table.elementAt(i));
		}
		return acc;
	}


	static IEnumerable<Tuple<T1, T2>> Join<T1, T2>(
	IEnumerable<T1> left,
	IEnumerable<T2> right,
	Func<T1, T2, bool> condition)
	{	
		return left.Reduce<T1, List<Tuple<T1,T2>>>
			(new List<Tuple<T1, T2>>(),
			(joinedTable, leftrow) => {
				
				var leftcombination = right.Reduce<T2, List<Tuple<T1, T2>>
				(new List<Tuple<T1, T2>>(),
					(rowcombinations, rightrow) => {
						if(condition(leftrow, rightrow)){
							rowcombinations.Add(new Tuple<T1,T2>(leftrow, rightrow))
						}
						return rowcombinations;
					}
				)
				joinedTable.AddRange(leftcombination);
				return joinedTable;		
			};
			);

	}
}
