import faker from "faker";
import fs from "fs";

const mockStartIndex = {
  class: 4,
  student: 3,
  teacher: 2,
  questionSet: 3,
  quiz: 5,
  questionVersion: 6,
} as const;

const numToMock = {
  class: 10,
  student: 10,
  teacher: 10,
  questionSet: 20,
  quiz: 20,
  questionVersion: 20,
} as const;

// * --- Quiz
export const supportedSubjectList = [
  "math",
  "literature",
  "physics",
  "computerScience",
] as const;
export type SupportedSubject = typeof supportedSubjectList[number];

const questionTypeList = ["multipleChoice", "checkboxes"] as const;
type QuestionType = typeof questionTypeList[number];

interface CheckboxActualAnswerSchema {
  answerIdList: string[];
}

interface MultipleChoiceActualAnswerSchema {
  answerId: string | null;
}

type ActualAnswerSchema =
  | CheckboxActualAnswerSchema
  | MultipleChoiceActualAnswerSchema;

interface PossibleAnswerSchema {
  id: string;
  description: string;
}

interface BaseQuestionSchema {
  id: string;
  grade: number;
  description: string;
  type: QuestionType;
  possibleAnswerList: PossibleAnswerSchema[];
  actualAnswer: ActualAnswerSchema;
}

interface CheckboxQuestionSchema extends BaseQuestionSchema {
  type: "checkboxes";
  actualAnswer: CheckboxActualAnswerSchema;
}

interface MultipleChoiceQuestionSchema extends BaseQuestionSchema {
  type: "multipleChoice";
  actualAnswer: MultipleChoiceActualAnswerSchema;
}

type QuestionSchema = MultipleChoiceQuestionSchema | CheckboxQuestionSchema;

interface QuestionVersionSchema {
  id: string;
  version: number;
  questionList: QuestionSchema[];
}

export interface QuizBaseSchema {
  id: string;
  createdDate: string;
  lastModifiedDate: string;
  latestQuestionVersion: number;

  /** Used in the end of the year
   * or when the teacher doesn't want the student to see the quiz anymore
   * but still want to edit or something
   * */
  isHidden: boolean;

  teacherId: string;
  assignedClassIdList: string[];

  isClosed: boolean;
  doShuffleQuestion: boolean;
  doShowGrade: boolean;
  doShowCorrectAnswer: boolean;
  isGraded: boolean;

  description?: string;
  title: string;
  subject: SupportedSubject;
  deadline: string;
}

// * --- Users
interface SchoolClassCreate {
  id: string;
  fullName: string;
  expirationTime: string;
}

interface StudentAccount {
  id: string;
  fullName: string;
  classId: string;
}

interface TeacherAccount {
  id: string;
  fullName: string;
  subject: SupportedSubject;
  passkey: string;
}

// * --- Helpers
const getMockQuizId = (index: number) => `quiz-${index}-id` as const;
const getMockQuestionVersionId = (index: number) =>
  `question-version-${index}-id` as const;
const getMockQuestionId = (questionIndex: number, setIndex: number) =>
  `question-${setIndex}-${questionIndex}-id` as const;
const getMockQuestionAnswerId = (
  answerIndex: number,
  questionIndex: number,
  setIndex: number,
) => `set-${setIndex}-question-${questionIndex}-answer-${answerIndex}` as const;
const getMockClassId = (index: number) => `school-class-${index}-id` as const;
const getMockStudentId = (index: number) => `student-${index}-id` as const;
const getMockTeacherId = (index: number) => `teacher-${index}-id` as const;

// * --- School class
const mockClass = (index: number): SchoolClassCreate => {
  return {
    id: `getMockClassId(${index})`,
    fullName: faker.company.companyName(),
    expirationTime: faker.date.future().toISOString(),
  };
};

const classList: SchoolClassCreate[] = [];
const mockClassIdMap: Record<`class${number}Id`, `getMockClassId(${number})`> =
  {};
const mockClassInfoList: [`mockClassIdMap.class${number}Id`, string, string][] =
  [];

for (let index = mockStartIndex.class; index <= numToMock.class; index++) {
  const newClass = mockClass(index);
  classList.push(newClass);

  mockClassIdMap[`class${index}Id`] = `getMockClassId(${index})`;
  mockClassInfoList.push([
    `mockClassIdMap.class${index}Id`,
    newClass.fullName,
    newClass.expirationTime,
  ]);
}

// * --- Users
const mockStudentAccount = (index: number): StudentAccount => {
  return {
    id: getMockStudentId(index),
    fullName: faker.name.findName(),
    classId: faker.random.arrayElement(classList).id,
  };
};

const studentList: StudentAccount[] = [];
const mockStudentIdMap: Record<
  `student${number}Id`,
  `getMockStudentId(${number})`
> = {};
const mockStudentListToCreate: Record<
  `studentMockIdMap.student${number}Id`,
  {
    classId: `mockClassIdMap.class${number}Id`;
    email: string;
    fullName: string;
    password: "123456";
  }
> = {};

for (let index = mockStartIndex.student; index <= numToMock.student; index++) {
  const newStudent = mockStudentAccount(index);
  studentList.push(newStudent);
  mockStudentIdMap[`student${index}Id`] = `getMockStudentId(${index})`;

  mockStudentListToCreate[`studentMockIdMap.student${index}Id`] = {
    classId: `mockClassIdMap.class${index}Id`,
    email: faker.internet.email(),
    fullName: newStudent.fullName,
    password: "123456",
  };
}

const mockTeacherAccount = (index: number): TeacherAccount => {
  return {
    id: `getMockTeacherId(${index})`,
    fullName: faker.name.findName(),
    subject: faker.random.arrayElement(supportedSubjectList),
    passkey: faker.datatype.uuid(),
  };
};

const teacherList: TeacherAccount[] = [];
const mockTeacherIdMap: Record<
  `teacher${number}Id`,
  `getMockTeacherId(${number})`
> = {};
const mockTeacherListToCreate: Record<
  `teacherMockIdMap.teacher${number}Id`,
  {
    subject: SupportedSubject;
    email: string;
    fullName: string;
    password: "123456";
    passkey: string;
  }
> = {};
const mockPasskeyList: string[] = [];

for (let index = mockStartIndex.student; index <= numToMock.teacher; index++) {
  const newTeacher = mockTeacherAccount(index);
  teacherList.push(newTeacher);

  mockTeacherIdMap[`teacher${index}Id`] = `getMockTeacherId(${index})`;
  mockPasskeyList.push(newTeacher.passkey);
  mockTeacherListToCreate[`teacherMockIdMap.teacher${index}Id`] = {
    subject: newTeacher.subject,
    email: faker.internet.email(),
    fullName: newTeacher.fullName,
    password: "123456",
    passkey: `getMockPasskeyList()[${mockPasskeyList.length - 1}]`,
  };
}

// * --- Question
const mockQuestionAnswerIdMap: Record<
  `set${number}Question${number}Answer${number}`,
  `getMockQuestionAnswerId(${number}, ${number}, ${number})`
> = {};
const mockMultipleChoiceQuestion = (
  questionIndex: number,
  setIndex: number,
): MultipleChoiceQuestionSchema => {
  const numPossibleAnswer = faker.datatype.number({ min: 2, max: 4 });
  const possibleAnswerList: PossibleAnswerSchema[] = [];
  for (let index = 1; index <= numPossibleAnswer; index++) {
    possibleAnswerList.push({
      id: `mockQuestionAnswerIdMap.set${setIndex}Question${questionIndex}Answer${index}`,
      description: faker.lorem.sentence(),
    });

    mockQuestionAnswerIdMap[
      `set${setIndex}Question${questionIndex}Answer${index}`
    ] = `getMockQuestionAnswerId(${index}, ${questionIndex}, ${setIndex})`;
  }

  const actualAnswer: MultipleChoiceActualAnswerSchema = {
    answerId: faker.random.arrayElement(possibleAnswerList).id,
  };

  return {
    id: `mockQuestionIdMap.set${setIndex}Question${questionIndex}Id`,
    grade: faker.datatype.number({ min: 1, max: 10 }),
    description: faker.lorem.sentence(),
    type: "multipleChoice",
    possibleAnswerList,
    actualAnswer,
  };
};

const mockCheckboxQuestion = (
  questionIndex: number,
  setIndex: number,
): CheckboxQuestionSchema => {
  const numPossibleAnswer = faker.datatype.number({ min: 2, max: 4 });
  const possibleAnswerList: PossibleAnswerSchema[] = [];
  for (let index = 1; index <= numPossibleAnswer; index++) {
    possibleAnswerList.push({
      id: `mockQuestionAnswerIdMap.set${setIndex}Question${questionIndex}Answer${index}`,
      description: faker.lorem.sentence(),
    });

    mockQuestionAnswerIdMap[
      `set${setIndex}Question${questionIndex}Answer${index}`
    ] = `getMockQuestionAnswerId(${index}, ${questionIndex}, ${setIndex})`;
  }

  const actualAnswer: CheckboxActualAnswerSchema = {
    answerIdList: faker.random
      .arrayElements(possibleAnswerList, 1)
      .map((possibleAnswer) => possibleAnswer.id),
  };

  return {
    id: `mockQuestionIdMap.set${setIndex}Question${questionIndex}Id`,
    grade: faker.datatype.number({ min: 1, max: 10 }),
    description: faker.lorem.sentence(),
    type: "checkboxes",
    possibleAnswerList,
    actualAnswer,
  };
};

const mockQuestionIdMap: Record<
  `set${number}Question${number}Id`,
  `getMockQuestionId(${number}, ${number})`
> = {};
const getMockQuestionSetList = (): QuestionSchema[][] => {
  const createQuestionList = (setIndex: number) => {
    const numQuestion = faker.datatype.number({ min: 2, max: 4 });
    const questionList: QuestionSchema[] = [];
    for (let index = 1; index <= numQuestion; index++) {
      const choice = faker.random.arrayElement([
        "multipleChoice",
        "checkboxes",
      ]);

      questionList.push(
        choice === "multipleChoice"
          ? mockMultipleChoiceQuestion(index, setIndex)
          : mockCheckboxQuestion(index, setIndex),
      );

      mockQuestionIdMap[
        `set${setIndex}Question${index}Id`
      ] = `getMockQuestionId(${index}, ${setIndex})`;
    }

    return questionList;
  };

  const questionSetList: QuestionSchema[][] = [];
  for (
    let index = mockStartIndex.questionSet;
    index <= numToMock.questionSet;
    index++
  ) {
    questionSetList.push(createQuestionList(index));
  }

  return questionSetList;
};
const mockQuestionSetList = getMockQuestionSetList();

// * --- Quiz
const mockBaseQuiz = (index: number): QuizBaseSchema => {
  const teacher = faker.random.arrayElement(teacherList);
  return {
    id: `getMockQuizId(${index})`,
    createdDate: faker.date.past().toISOString(),
    lastModifiedDate: faker.date.past().toISOString(),
    latestQuestionVersion: faker.datatype.number({ min: 1, max: 10 }),
    isHidden: faker.datatype.boolean(),
    teacherId: teacher.id,
    assignedClassIdList: faker.random
      .arrayElements(classList, 1)
      .map((schoolClass) => schoolClass.id),

    isClosed: faker.datatype.boolean(),
    doShuffleQuestion: faker.datatype.boolean(),
    doShowGrade: faker.datatype.boolean(),
    doShowCorrectAnswer: faker.datatype.boolean(),
    isGraded: faker.datatype.boolean(),
    description: faker.lorem.sentence(),
    title: faker.lorem.sentence(),
    subject: teacher.subject,
    deadline: faker.date.future().toISOString(),
  };
};

const baseQuizList: QuizBaseSchema[] = [];
const mockQuizIdMap: Record<`quiz${number}Id`, `getMockQuizId(${number})`> = {};
for (let index = mockStartIndex.quiz; index <= numToMock.quiz; index++) {
  baseQuizList.push(mockBaseQuiz(index));
  mockQuizIdMap[`quiz${index}Id`] = `getMockQuizId(${index})`;
}

type QuizId = string;
type QuestionVersionList = Record<QuizId, QuestionVersionSchema[]>;
const questionVersionList: QuestionVersionList = {};
const mockQuestionVersionIdMap: Record<
  `questionVersion${number}Id`,
  `getMockQuestionVersionId(${number})`
> = {};
for (
  let index = mockStartIndex.questionVersion;
  index <= numToMock.questionVersion;
  index++
) {
  const quizId = faker.random.arrayElement(baseQuizList).id;
  if (!questionVersionList[quizId]) {
    questionVersionList[quizId] = [];
  }

  questionVersionList[quizId].push({
    id: `getMockQuestionVersionId(${index})`,
    version: faker.datatype.number({ min: 1, max: 10 }),
    questionList: faker.random.arrayElement(mockQuestionSetList),
  });

  mockQuestionVersionIdMap[
    `questionVersion${index}Id`
  ] = `getMockQuestionVersionId(${index})`;
}

// TODO: mock student submission
// TODO: mock student grade
// TODO: fix ~~question version id~~ and ~~quizId assignment~~
// TODO: fix ~~baseQuizList id~~, ~~teacherId~~, ~~assignedClassIdList~~ assignment

const outData = {
  // ---
  mockClassIdMap,
  mockStudentIdMap,
  mockTeacherIdMap,
  mockQuestionAnswerIdMap,
  mockQuestionIdMap,
  mockQuizIdMap,
  mockQuestionVersionIdMap,
  break1: {},

  // ---
  studentList,
  teacherList,
  classList,
  baseQuizList,
  questionVersionList,
  break2: {},

  // ---
  mockQuestionSetList,
  mockClassInfoList,
  mockStudentListToCreate,
  mockTeacherListToCreate,
  mockPasskeyList,
};

// write result to json
fs.writeFileSync("./mock-quiz-data.json", JSON.stringify(outData, null, 2));
