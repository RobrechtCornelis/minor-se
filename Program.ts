const Program = () => {

    console.log("Welkom Ramiro en Robrecht")

    var db : Database = initializeDatabase()
    /// Do something with database....
    //  Pak een tabel bijv. : db.Employees... blabla...
}

const initializeDatabase = function() : Database {
    let l_employees : Array<Employee> =  [
        {id: 1, name: "Robrecht", email: "robcornelis@gwnrob.nl", salary: 4000}, 
        {id: 2, name: "Nofit", email: "nofit@burgerking.com", salary: 500}, 
        {id: 3, name: "Ramiro", email: "ramiro@wechat.com", salary: 30000}]
    let l_tasks : Array<Task> = [
        {id: 1, title: "Burgers bakken", employeeId: 2}, 
        {id: 2, title: "Nieuwe Iphone namen verzinnen", employeeId: 3}, 
        {id: 3, title: "Plantdeskundige bij Sweco", employeeId: 1}]
    return {Employees: l_employees, Tasks: l_tasks }
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
    Employees: Array<Employee>
    Tasks: Array<Task>
}

Program()