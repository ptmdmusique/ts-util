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

export interface CheckboxActualAnswerSchema {
  answerIdList: string[];
}

export interface MultipleChoiceActualAnswerSchema {
  answerId: string | null;
}

type ActualAnswerSchema =
  | CheckboxActualAnswerSchema
  | MultipleChoiceActualAnswerSchema;

export interface PossibleAnswerSchema {
  id: string;
  description: string;
}

export interface BaseQuestionSchema {
  id: `mockQuestionIdMap.set${number}Question${number}Id`;
  grade: number;
  description: string;
  type: QuestionType;
  possibleAnswerList: PossibleAnswerSchema[];
  actualAnswer: ActualAnswerSchema;
}

export interface CheckboxQuestionSchema extends BaseQuestionSchema {
  type: "checkboxes";
  actualAnswer: CheckboxActualAnswerSchema;
}

export interface MultipleChoiceQuestionSchema extends BaseQuestionSchema {
  type: "multipleChoice";
  actualAnswer: MultipleChoiceActualAnswerSchema;
}

export type QuestionSchema =
  | MultipleChoiceQuestionSchema
  | CheckboxQuestionSchema;

export interface QuestionVersionSchema {
  id: string;
  version: number;
  questionList: QuestionSchema[];
}

export interface MockQuestionVersionSchema {
  id: string;
  version: number;
  questionList: `...mockQuestionSetList[${number}]`[];
}

export interface QuizBaseSchema {
  id: `mockQuizIdMap.quiz${number}Id`;
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

// * --- Saved answers
export interface BaseSavedAnswer {
  questionId: string;
  type: QuestionType;
}

export interface MultipleChoiceSavedAnswerSchema extends BaseSavedAnswer {
  type: "multipleChoice";
  answerId: string;
}

export interface CheckboxSavedAnswerSchema extends BaseSavedAnswer {
  type: "checkboxes";
  answerIdList: string[];
}

export type SavedAnswerSchema =
  | CheckboxSavedAnswerSchema
  | MultipleChoiceSavedAnswerSchema;

export interface StudentSubmission {
  quizId: string;
  version: number;
  savedAnswerList: SavedAnswerSchema[];
}

// * --- Grade
export interface StudentGrade {
  /**
* Graded automatically by BE
*
// ! Manual grade should override auto grade if available
* */
  autoGrade: number | null;
  /** Graded by teacher */
  manualGrade: number | null;
}

export interface StudentGradeSchema {
  quizId: string;
  studentId: string;
  version: number;

  /** <question's id, StudentGrade> */
  gradeMap: Record<
    `[mockQuestionIdMap.set${number}Question${number}Id]`,
    StudentGrade
  > | null;
}

// * --- Users
export interface SchoolClassCreate {
  id: `mockClassIdMap.class${number}Id`;
  fullName: string;
  expirationTime: string;
}

export interface StudentAccount {
  id: `studentMockIdMap.student${number}Id`;
  fullName: string;
  classId: SchoolClassCreate["id"];
}

export interface TeacherAccount {
  id: `teacherMockIdMap.teacher${number}Id`;
  fullName: string;
  subject: SupportedSubject;
  passkey: string;
}
