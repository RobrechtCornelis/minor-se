import {Student} from "./models/student"

let StudentOne: Student = ({
    Name: 'Ramiro',    
    Surname: 'Delgado',
    Grades: [{
        Grade: 3,
        CourseId: 5
    },
    {
        Grade: 1,
        CourseId: 2
    }
    ],
});

console.log(StudentOne)