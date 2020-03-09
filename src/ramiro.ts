import {Student} from "./models/Student";
import { CustomArray } from "./types/Type";

let StudentOne: Student = ({
    id: 1,
    name: 'Ramiro',    
    surname: 'Delgado',
    grades: [{
        studentId: 1,
        grade: 3,
        courseId: 5
    },{
        studentId: 1,
        grade: 2,
        courseId: 2}
    ],
});


type car = {Merk:string, Price:number}
type gps = {Merk:string,Price:number}
type carGps = car & gps
type carToSellWithGps = {kind: "carToSellWithGps"} & carGps
type carToSellWithOutGps = {kind: "carToSellWithOutGps"}


type Person = {Name:string, Surname: string, age: number}

type ConvertTO<T,v> = Pick<T,{[k in keyof T] : v extends k ? k : never }[keyof T]>

type x = ConvertTO<Person,"asdas">


type onlyNumber<T> = {
    [k in keyof T] : T[k] extends number ? k : never}
type a = onlyNumber<Person>["Name"]

type Html = {}
type Func<a,b> = (_:a) => b
type customPages =
{
    home : {
        name : string,
        value: number,
        text: string
    },
    aboutus: {
        name: string,
        text: string
    }
}
type PagesWithValue<Pages,v> = Pick<Pages, { [p in keyof Pages]: v extends keyof Pages[p] ? p : never }[keyof Pages]>

type YYY = PagesWithValue<customPages,"value">
type Renderer<Page> = Func<Page, Html>
type Renderers<Pages> = {
    [p in keyof PagesWithValue<Pages,"value">] : Renderer<Pages[p]>
}
type xxx = Renderers<customPages>