import { Student } from "src/models/Student";
import { Teacher } from "src/models/Teacher";
import { Course } from "src/models/Course";
import { Grade } from "src/models/Grade";
import { List } from "src/types/Type"

export interface Database {
    Students: List<Student>
    Teachers: List<Teacher>
    Courses: List<Course>
    Grades: List<Grade>
}