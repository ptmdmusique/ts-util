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
