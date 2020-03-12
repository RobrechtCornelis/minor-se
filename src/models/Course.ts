import { Teacher } from "./Teacher";

export interface Course{
    
    id: number
    title: string
    description: string
    teacherId: Teacher["id"]
}