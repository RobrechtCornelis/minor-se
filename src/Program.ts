import { Student } from "./models/Student.js";
import { Teacher } from "./models/Teacher.js";
import { Course } from "./models/Course.js";
import { Grade } from "./models/Grade.js";
import { CustomArray, Fun } from "./types/Type.js";

const Program = () => {

    var db: Database = initializeDatabase()

    //Misschien beter om de type van de tabellen meteen CustomArray te maken, dan schrijf je alleen: db.Employees of [1,2,3,4,5]
    const incr = Fun<number, number>(x => x + 1)
    const incremented_array : CustomArray<number> =  CustomArray([1,2,3,4,5,6]).map(incr.then(incr))
    const student_names: CustomArray<string> = db.Students.map(Fun(student => student.name))
    const selection_surnames_name = db.Students.select("surname", "name")
    let lol = db.Students.select("grades")

    console.log(incremented_array.content)
    console.log(student_names.content)
    console.log(selection_surnames_name.content)
    console.log(lol.content)
    /// Do something with database....
    //  Pak een tabel bijv. : db.Employees... blabla...
}

const initializeDatabase = function (): Database {

    let l_grades: Grade[] = [
        { studentId: 3, courseId: 1, grade: 8 },
        { studentId: 1, courseId: 2, grade: 7},
        { studentId: 1, courseId: 2, grade: 9},
        { studentId: 2, courseId: 3, grade: 9},
        { studentId: 2, courseId: 1, grade: 7},
        { studentId: 3, courseId: 3, grade: 6},
        { studentId: 2, courseId: 3, grade: 9}]

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
    return { Students: CustomArray(l_students), Teachers: CustomArray(l_teachers), Courses: CustomArray(l_courses), Grades: CustomArray(l_grades)}
}

interface Database {
    Students: CustomArray<Student>
    Teachers: CustomArray<Teacher>
    Courses: CustomArray<Course>
    Grades: CustomArray<Grade>
}

 Program()

