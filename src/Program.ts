import { Student } from "./models/Student";
import { Teacher } from "./models/Teacher";
import { Course } from "./models/Course";
import { Grade } from "./models/Grade";
import { Database } from "./models/Database"
import { List, Fun } from "./types/Type";

const Program = () => {
    const initializeDatabase = function() : Database {
        let l_grades: Grade[] = [
            { studentId: 3, courseId: 1, grade: 8 },
            { studentId: 1, courseId: 2, grade: 7},
            { studentId: 1, courseId: 2, grade: 9},
            { studentId: 2, courseId: 3, grade: 9},
            { studentId: 2, courseId: 1, grade: 7},
            { studentId: 3, courseId: 3, grade: 6},
            { studentId: 2, courseId: 3, grade: 9}
        ]

        let l_students: Student[] = [
            { id: 1, name: "Robrecht", surname: "Cornelis", grades: [l_grades[1], l_grades[2]]},
            { id: 2, name: "Nofit", surname: "Kartoredjo", grades: [l_grades[3], l_grades[4], l_grades[6]]},
            { id: 3, name: "Ramiro", surname: "Delgado", grades: [l_grades[0], l_grades[5]]}
        ]

        let l_courses: Course[] = [
            { id: 1, title: "Analyse", description: "Testen en SQL", teacherId: 3 },
            { id: 2, title: "Dev", description: "Functional Programming", teacherId: 2 },
            { id: 3, title: "SLC", description: "Slc stuff", teacherId: 1 }
        ]
        let l_teachers: Teacher[] = [
            { id: 1, name: "Lotte", surname: "Muilwijk", courseId: 3 },
            { id: 2, name: "Giuseppe", surname: "Maggiore", courseId: 2 },
            { id: 3, name: "Tanja", surname: "Ubert", courseId: 1 }
        ]
        return { Students: List(l_students), Teachers: List(l_teachers), Courses: List(l_courses), Grades: List(l_grades)}
    }

    var db: Database = initializeDatabase()

    //Misschien beter om de type van de tabellen meteen List te maken, dan schrijf je alleen: db.Employees of [1,2,3,4,5]
    const incr = Fun<number, number>(x => x + 1)
    const isEven = Fun<number, boolean>(x => x % 2 == 0)
    const isUneven = Fun<number, boolean>(x => x % 2 == 1)
    const negate = Fun<boolean, boolean>(x => !x)
    const incremented_array : List<number> =  List([1,2,3,4,5,6]).map(incr.then(incr))
    const incremented_uneven_array : List<number> =  List([1,2,3,4,5,6]).map(incr.then(incr)).where(isUneven)
    const double_where_incr : List<number> = 
     List([1,2,3,4,5,6]).map(incr.then(incr)).where(isUneven).map(incr).where(isEven)
    const student_names: List<string> = db.Students.map(Fun(student => student.name))
    const filtered_student_names: List<string> = 
      db.Students.map(Fun(student => student.name)).where(Fun(name => name == "Robrecht" || name == "Nofit"))
    const selection_surnames_name =
     db.Students.select("surname", "name")
    let lol = db.Students.select("grades")

    //console.log(incremented_array.content)
    //console.log(incremented_uneven_array.content)
    //console.log(student_names.content)
    //console.log(filtered_student_names.content)
    //console.log(double_where_incr.content)
    console.log(selection_surnames_name.content)
    //console.log(lol.content)
    /// Do something with database....
    //  Pak een tabel bijv. : db.Employees... blabla...
}
 Program()

