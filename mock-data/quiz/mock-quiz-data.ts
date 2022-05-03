import faker from "faker";
import fs from "fs";

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
const getMockSchoolClassId = (index: number) =>
  `school-class-${index}-id` as const;
const getMockStudentId = (index: number) => `student-${index}-id` as const;
const getMockTeacherId = (index: number) => `teacher-${index}-id` as const;

// * --- Users
const mockSchoolClass = (index: number): SchoolClassCreate => {
  return {
    id: getMockSchoolClassId(index),
    fullName: faker.company.companyName(),
    expirationTime: faker.date.future().toISOString(),
  };
};

const schoolClassList: SchoolClassCreate[] = [];
const mockSchooClassIdMap: Record<
  `schoolClass${number}Id`,
  `getMockSchoolClassId(${number})`
> = {};
for (let index = 2; index < 10; index++) {
  schoolClassList.push(mockSchoolClass(index));
  mockSchooClassIdMap[
    `schoolClass${index}Id`
  ] = `getMockSchoolClassId(${index})`;
}

const mockStudentAccount = (index: number): StudentAccount => {
  return {
    id: getMockStudentId(index),
    fullName: faker.name.findName(),
    classId: faker.random.arrayElement(schoolClassList).id,
  };
};

const studentList: StudentAccount[] = [];
const mockStudentIdMap: Record<
  `student${number}Id`,
  `getMockStudentId(${number})`
> = {};
for (let index = 3; index < 11; index++) {
  studentList.push(mockStudentAccount(index));
  mockStudentIdMap[`student${index}Id`] = `getMockStudentId(${index})`;
}

const mockTeacherAccount = (index: number): TeacherAccount => {
  return {
    id: getMockTeacherId(index),
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
for (let index = 2; index < 11; index++) {
  teacherList.push(mockTeacherAccount(index));
  mockTeacherIdMap[`teacher${index}Id`] = `getMockTeacherId(${index})`;
}

// * --- Question
const mockQuestionAnswerIdMap: Record<
  `question${number}Answer${number}Id`,
  `getMockQuestionAnswerId(${number}, ${number}, ${number})`
> = {};
const mockMultipleChoiceQuestion = (
  questionIndex: number,
  setIndex: number,
): MultipleChoiceQuestionSchema => {
  const numPossibleAnswer = faker.datatype.number({ min: 2, max: 4 });
  const possibleAnswerList: PossibleAnswerSchema[] = [];
  for (let index = 0; index < numPossibleAnswer; index++) {
    possibleAnswerList.push({
      id: getMockQuestionAnswerId(index, questionIndex, setIndex),
      description: faker.lorem.sentence(),
    });

    mockQuestionAnswerIdMap[
      `question${questionIndex}Answer${index}Id`
    ] = `getMockQuestionAnswerId(${index}, ${questionIndex}, ${setIndex})`;
  }

  const actualAnswer: MultipleChoiceActualAnswerSchema = {
    answerId: faker.random.arrayElement(possibleAnswerList).id,
  };

  return {
    id: getMockQuestionId(questionIndex, setIndex),
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
  for (let index = 0; index < numPossibleAnswer; index++) {
    possibleAnswerList.push({
      id: getMockQuestionAnswerId(index, questionIndex, setIndex),
      description: faker.lorem.sentence(),
    });

    mockQuestionAnswerIdMap[
      `question${questionIndex}Answer${index}Id`
    ] = `getMockQuestionAnswerId(${index}, ${questionIndex}, ${setIndex})`;
  }

  const actualAnswer: CheckboxActualAnswerSchema = {
    answerIdList: faker.random
      .arrayElements(possibleAnswerList, 1)
      .map((possibleAnswer) => possibleAnswer.id),
  };

  return {
    id: getMockQuestionId(questionIndex, setIndex),
    grade: faker.datatype.number({ min: 1, max: 10 }),
    description: faker.lorem.sentence(),
    type: "checkboxes",
    possibleAnswerList,
    actualAnswer,
  };
};

const mockQuestionIdMap: Record<
  `question${number}Id`,
  `getMockQuestionId(${number}, ${number})`
> = {};
const mockQuestionSetList = (): QuestionSchema[][] => {
  const createQuestionList = (setIndex: number) => {
    const numQuestion = faker.datatype.number({ min: 2, max: 4 });
    const questionList: QuestionSchema[] = [];
    for (let index = 0; index < numQuestion; index++) {
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
        `question${index}Id`
      ] = `getMockQuestionId(${index}, ${setIndex})`;
    }

    return questionList;
  };

  const questionSetList: QuestionSchema[][] = [];
  for (let index = 3; index < 21; index++) {
    questionSetList.push(createQuestionList(index));
  }

  return questionSetList;
};

const questionSetList = mockQuestionSetList();

// * --- Quiz
const mockBaseQuiz = (index: number): QuizBaseSchema => {
  const teacher = faker.random.arrayElement(teacherList);
  return {
    id: getMockQuizId(index),
    createdDate: faker.date.past().toISOString(),
    lastModifiedDate: faker.date.past().toISOString(),
    latestQuestionVersion: faker.datatype.number({ min: 1, max: 10 }),
    isHidden: faker.datatype.boolean(),
    teacherId: teacher.id,
    assignedClassIdList: faker.random
      .arrayElements(schoolClassList, 1)
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
for (let index = 5; index < 15; index++) {
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
for (let index = 6; index < 16; index++) {
  const quizId = faker.random.arrayElement(baseQuizList).id;
  if (!questionVersionList[quizId]) {
    questionVersionList[quizId] = [];
  }

  questionVersionList[quizId].push({
    id: getMockQuestionVersionId(index),
    version: faker.datatype.number({ min: 1, max: 10 }),
    questionList: faker.random.arrayElement(questionSetList),
  });

  mockQuestionVersionIdMap[
    `questionVersion${index}Id`
  ] = `getMockQuestionVersionId(${index})`;
}

const outData = {
  // ---
  mockSchooClassIdMap,
  mockStudentIdMap,
  mockTeacherIdMap,
  mockQuestionAnswerIdMap,
  mockQuestionIdMap,
  mockQuizIdMap,
  mockQuestionVersionIdMap,

  // ---
  studentList,
  teacherList,
  schoolClassList,
  baseQuizList,
  questionSetList,
  questionVersionList,
};

// write result to json
fs.writeFileSync("./mock-quiz-data.json", JSON.stringify(outData, null, 2));
