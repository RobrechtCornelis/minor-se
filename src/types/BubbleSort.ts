
export const bubbleSort = function<a, k extends keyof a>(list: a[], property: k) : a[] 
{ 
    var somethingChanged = true;
    // TODO: Ex3.1; while( ? )
    while(somethingChanged)
    {
      somethingChanged = false;
      for (var i = 0; i < list.length - 1; i++)
      {
        let test = list[i][property]
        if (list[i][property] > list[i + 1][property])
        {
          var temp = list[i + 1];
          // TODO: Ex3.2;
          list[i + 1] = list[i];
          list[i] = temp;
         
          somethingChanged = true;
        }
      }
    }
    return list 
  }
