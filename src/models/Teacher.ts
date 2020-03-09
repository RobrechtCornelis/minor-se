import { Course } from "./Course";

export interface Teacher {

    id: number
    name:string
    surname:string
    courseId: Course["id"]
}

