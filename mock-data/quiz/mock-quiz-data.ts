import faker from "faker";
import fs from "fs";
import {
  CheckboxActualAnswerSchema,
  CheckboxQuestionSchema,
  MultipleChoiceActualAnswerSchema,
  MultipleChoiceQuestionSchema,
  PossibleAnswerSchema,
  QuestionSchema,
  QuestionVersionSchema,
  QuizBaseSchema,
  SavedAnswerSchema,
  SchoolClassCreate,
  StudentAccount,
  StudentGrade,
  StudentGradeSchema,
  StudentSubmission,
  SupportedSubject,
  supportedSubjectList,
  TeacherAccount,
} from "./types";
import { gradeSubmission } from "./utils";

const mockStartIndex = {
  class: 4,
  student: 3,
  teacher: 2,
  questionSet: 3,
  quiz: 5,
} as const;

const numToMock = {
  class: 10,
  student: 10,
  teacher: 10,
  questionSet: 20,
  quiz: 20,
} as const;

// * --- School class
const mockClass = (index: number): SchoolClassCreate => {
  return {
    id: `mockClassIdMap.class${index}Id`,
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
    id: `studentMockIdMap.student${index}Id`,
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
  `[studentMockIdMap.student${number}Id]`,
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

  mockStudentListToCreate[`[studentMockIdMap.student${index}Id]`] = {
    classId: `mockClassIdMap.class${index}Id`,
    email: `test-${index}@student.com`,
    fullName: newStudent.fullName,
    password: "123456",
  };
}

const mockTeacherAccount = (index: number): TeacherAccount => {
  return {
    id: `teacherMockIdMap.teacher${index}Id`,
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
  `[teacherMockIdMap.teacher${number}Id]`,
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
  mockTeacherListToCreate[`[teacherMockIdMap.teacher${index}Id]`] = {
    subject: newTeacher.subject,
    email: `test-${index}@teacher.com`,
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
    id: `mockQuizIdMap.quiz${index}Id`,
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

const questionVersionList: Record<
  `[mockQuizIdMap.quiz${number}Id]`,
  QuestionVersionSchema[]
> = {};
const mockQuestionVersionIdMap: Record<
  `questionVersion${number}Id`,
  `getMockQuestionVersionId(${number})`
> = {};
for (let index = 0; index < baseQuizList.length; index++) {
  const quiz = baseQuizList[index];
  const quizIndex = mockStartIndex.quiz + index;
  const quizId = `[${quiz.id}]` as const;

  questionVersionList[quizId] = [];

  for (
    let version = 0;
    version < faker.datatype.number({ min: 2, max: 5 });
    version++
  ) {
    questionVersionList[quizId].push({
      id: `mockQuestionVersionIdMap.questionVersion${quizIndex}Id`,
      version: version,
      questionList: faker.random.arrayElement(mockQuestionSetList),
    });

    mockQuestionVersionIdMap[
      `questionVersion${index}Id`
    ] = `getMockQuestionVersionId(${index})`;
  }

  quiz.latestQuestionVersion = questionVersionList[quizId].length - 1;
}

const mockStudentSubmission: Record<
  `[studentMockIdMap.student${number}Id]`,
  StudentSubmission[]
> = {};
const mockStudentSubmissionIdMap: Record<
  `studentSubmission${number}Id`,
  `getMockStudentSubmissionId(${number})`
> = {};
for (let index = mockStartIndex.student; index <= numToMock.student; index++) {
  const studentId = `studentMockIdMap.student${index}Id` as const;
  const studentIdKey = `[${studentId}]` as const;
  const { classId } = mockStudentListToCreate[studentIdKey];

  let quizListForClass = baseQuizList.filter((quiz) =>
    quiz.assignedClassIdList.includes(classId),
  );

  mockStudentSubmission[studentIdKey] = [];

  for (
    let index = 0;
    index < faker.datatype.number({ min: 0, max: quizListForClass.length });
    index++
  ) {
    const mockQuiz = faker.random.arrayElement(quizListForClass);
    quizListForClass = quizListForClass.filter(
      (quiz) => quiz.id !== mockQuiz.id,
    );

    const quizIndex =
      baseQuizList.findIndex((quiz) => quiz.id === mockQuiz.id) +
      mockStartIndex.quiz;

    const questionVersion = questionVersionList[
      `[${mockQuiz.id}]` as const
    ].find(
      (questionVersion) =>
        questionVersion.version === mockQuiz.latestQuestionVersion,
    );

    mockStudentSubmission[studentIdKey].push({
      quizId: `mockQuizIdMap.quiz${quizIndex}Id`,
      version: mockQuiz.latestQuestionVersion,
      savedAnswerList: faker.random
        .arrayElements(questionVersion?.questionList ?? [])
        .map<SavedAnswerSchema>((question) => {
          switch (question.type) {
            case "checkboxes":
              return {
                questionId: question.id,
                type: question.type,
                answerIdList: faker.random
                  .arrayElements(question.possibleAnswerList)
                  .map((answer) => answer.id),
              };
            case "multipleChoice":
              return {
                questionId: question.id,
                type: question.type,
                answerId: faker.random.arrayElement(question.possibleAnswerList)
                  .id,
              };
          }
        }),
    });
  }
}

const mockStudentGradeSchema: Record<
  `[studentMockIdMap.student${number}Id]`,
  StudentGradeSchema[]
> = {};
for (let index = mockStartIndex.student; index <= numToMock.student; index++) {
  const studentId = `studentMockIdMap.student${index}Id` as const;
  const studentIdKey = `[${studentId}]` as const;

  const studentSubmissionList = mockStudentSubmission[studentIdKey];
  mockStudentGradeSchema[studentIdKey] = studentSubmissionList.map(
    (submission) => {
      const quiz = baseQuizList.find((quiz) => quiz.id === submission.quizId)!;
      const questionList =
        questionVersionList[`[${quiz.id}]` as const].find(
          (questionVersion) => questionVersion.version === submission.version,
        )?.questionList ?? [];

      const savedAnswerList = submission.savedAnswerList;

      const grade = gradeSubmission(savedAnswerList, questionList);

      return {
        quizId: submission.quizId,
        studentId,
        version: submission.version,

        gradeMap: grade.reduce<Record<string, StudentGrade>>(
          (acc, grade) => ({
            ...acc,
            [grade.questionId]: { autoGrade: grade.grade, manualGrade: null },
          }),
          {},
        ),
      };
    },
  );
}

// TODO: ~~mock student grade~~
// TODO: ~~mock student submission~~
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
  mockStudentSubmissionIdMap,
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
  mockStudentSubmission,
  mockStudentGradeSchema,
};

// write result to json
console.info("Writing to file");
fs.writeFileSync("./mock-quiz-data.json", JSON.stringify(outData, null, 2));
