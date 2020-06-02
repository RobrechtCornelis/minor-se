import { Student } from "./Student";
import { Teacher } from "./Teacher";
import { Course } from "./Course";
import { Grade } from "./Grade";
import { List } from "../types/Type";


export interface Database {
    Students: List<Student>
    Teachers: List<Teacher>
    Courses: List<Course>
    Grades: List<Grade>
}