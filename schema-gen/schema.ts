interface Student {
  id: string;
  name: string;
  age: number;
  isMale: boolean;
  quiz: Array<Quiz>;
}

interface Quiz {
  id: string;
  grade: number;
}

type ArrayStudent = Array<Student>;

// interface CustomStudent extends Omit<Student, "name"> {
//   teacherId: string;
// }
