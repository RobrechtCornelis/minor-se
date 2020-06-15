import { Student } from "./models/Student";
import { Teacher } from "./models/Teacher";
import { Course } from "./models/Course";
import { Grade } from "./models/Grade";
import { Database } from "./models/Database"
import { Query } from "./types/Type";
import { Fun } from "./types/Type";
//import { List } from "immutable";

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
            { id: 3, name: "Robrecht", surname: "Cornelis", grades: [l_grades[1], l_grades[2]]},
            { id: 2, name: "Nofit", surname: "Kartoredjo", grades: [l_grades[3], l_grades[4], l_grades[6]]},
            { id: 1, name: "Ramiro", surname: "Delgado", grades: [l_grades[0], l_grades[5]]}
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
        return { Students: l_students, Teachers: l_teachers, Courses: l_courses, Grades: l_grades}
    }

    var db: Database = initializeDatabase()

    //console.log(Query(db.Students).toArray())
    //console.log(Query(db.Grades).toArray())

    let studs = Query(db.Students).select("id").where("name", name => name != "Nofit").include("grades", q => q.select("courseId").where("courseId", n => n == 1)).toArray()
    console.log(studs)
    studs.forEach(element => console.log(element))
    
    // let res = studs[0]
    //console.log(res)
    //let grades = Query(db.Grades).select("grade").toArray()
   
    //let res = studs.concat({grades})

    
}
 Program()

