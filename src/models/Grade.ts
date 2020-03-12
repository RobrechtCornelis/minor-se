import { Course } from "./Course";
import { Student } from "./Student";

export interface Grade{

    studentId: Student["id"]
    courseId: Course["id"]   
    grade:number 
}