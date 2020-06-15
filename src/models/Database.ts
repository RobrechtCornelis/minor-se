import { Student } from "./Student";
import { Teacher } from "./Teacher";
import { Course } from "./Course";
import { Grade } from "./Grade";


export interface Database {
    Students: Student[]
    Teachers: Teacher[]
    Courses: Course[]
    Grades: Grade[]
}