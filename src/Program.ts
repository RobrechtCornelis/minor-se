import {Student} from "./models/Student.js";
import { CustomArray, Fun } from "./types/Type.js";

let StudentOne: Student = ({
    Name: 'Ramiro',    
    Surname: 'Delgado',
    Grades: [{
        Grade: 3,
        CourseId: 5
    },
    {
        Grade: 1,
        CourseId: 2
    }
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

const Program = () => {

    var db : Database = initializeDatabase()

    //Misschien beter om de type van de tabellen meteen CustomArray te maken, dan schrijf je alleen: db.Employees of [1,2,3,4,5]
    //const incremented_array : CustomArray<number> =  CustomArray([1,2,3,4,5,6]).map(incr.then(incr))
    const employee_names : CustomArray<string> =  db.Employees.map(Fun(employee => employee.name)) 
    const selection_salary_name  = db.Employees.select("id", "name")

    //console.log(incremented_array.content)
    console.log(employee_names.content)
    console.log(selection_salary_name.content)
    /// Do something with database....
    //  Pak een tabel bijv. : db.Employees... blabla...
 }

const initializeDatabase = function() : Database {
    let l_employees : Employee[] =  [
        {id: 1, name: "Robrecht", email: "robcornelis@gwnrob.nl", salary: 4000}, 
        {id: 2, name: "Nofit", email: "nofit@burgerking.com", salary: 500}, 
        {id: 3, name: "Ramiro", email: "ramiro@wechat.com", salary: 30000}]
    let l_tasks :Task[] = [
        {id: 1, title: "Burgers bakken", employeeId: 2}, 
        {id: 2, title: "Nieuwe Iphone namen verzinnen", employeeId: 3}, 
        {id: 3, title: "Plantdeskundige bij Sweco", employeeId: 1}]
    return {Employees: CustomArray(l_employees), Tasks: CustomArray(l_tasks) }
 }

 interface Employee {
    id: number,
    name: string,
    email: string,
    salary: number,
}

interface Task {
    id: number,
    title: string,
    employeeId: Employee["id"]
}

interface Database {
    Employees: CustomArray<Employee>
    Tasks: CustomArray<Task>
}

Program()