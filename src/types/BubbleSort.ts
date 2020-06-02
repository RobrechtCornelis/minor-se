import { List, Comperator } from "./Type";


export const bubbleSort = function<a, k extends keyof a>(list: List<a>, property: k) : List<a> 
{ 
    // Student: id, grades,  . Student is a  en k is id, grade, email
    var somethingChanged = true;
    // TODO: Ex3.1; while( ? )
    while(somethingChanged)
    {
      somethingChanged = false;
      for (var i = 0; i < list.content.length - 1; i++)
      {
        let test = list.content[i][property]
        if (list.content[i][property] > list.content[i + 1][property])
        {
          var temp = list.content[i + 1];
          // TODO: Ex3.2;
          list.content[i + 1] = list.content[i];
          list.content[i] = temp;
         
          somethingChanged = true;
        }
      }
    }
    return list 
  }
