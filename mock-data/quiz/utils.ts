import {
  CheckboxActualAnswerSchema,
  MultipleChoiceActualAnswerSchema,
  QuestionSchema,
  SavedAnswerSchema,
} from "./types";

// ---
export const gradeSubmission = (
  savedAnswerList: SavedAnswerSchema[],
  questionList: QuestionSchema[],
): {
  questionId: `mockQuestionIdMap.set${number}Question${number}Id`;
  grade: number;
}[] => {
  /** <question id, SavedAnswerSchema> */
  const savedAnswerQuestionMap = savedAnswerList.reduce<
    Record<string, SavedAnswerSchema>
  >((accum, curValue) => {
    accum[curValue.questionId] = curValue;
    return accum;
  }, {});

  return questionList.reduce<
    {
      questionId: `mockQuestionIdMap.set${number}Question${number}Id`;
      grade: number;
    }[]
  >((accum, curQuestion) => {
    let totalGrade = 0;

    const questionType = curQuestion.type;
    const questionGrade = curQuestion.grade;
    const actualAnswer = curQuestion.actualAnswer;

    let gradePerChoice = questionGrade;
    switch (questionType) {
      case "multipleChoice":
        gradePerChoice = questionGrade;
        break;
      case "checkboxes":
        gradePerChoice =
          questionGrade /
          ((actualAnswer as CheckboxActualAnswerSchema).answerIdList.length ||
            1);
        break;
    }

    /**
     * Rules:
     * - For multiple choice, if the answer is correct, then the grade is the question's grade, else 0
     * - For checkboxes:
     * - - For each correct answer, total grade will be + by the gradePerChoice
     * - - For each incorrect answer, total grade will be - by the gradePerChoice
     */
    const savedAnswer = savedAnswerQuestionMap[curQuestion.id];
    if (savedAnswer?.type === questionType) {
      switch (savedAnswer.type) {
        case "multipleChoice":
          const multiChoiceAnswer =
            actualAnswer as MultipleChoiceActualAnswerSchema;
          const isCorrectMultiChoiceAnswer =
            savedAnswer.answerId === multiChoiceAnswer.answerId;

          totalGrade += isCorrectMultiChoiceAnswer ? gradePerChoice : 0;
          break;

        case "checkboxes":
          const checkboxAnswerIdList = (
            actualAnswer as CheckboxActualAnswerSchema
          ).answerIdList;

          savedAnswer.answerIdList.forEach((answerId) => {
            const isCorrectCheckboxAnswer =
              checkboxAnswerIdList.includes(answerId);

            totalGrade += gradePerChoice * (isCorrectCheckboxAnswer ? 1 : -1);
          });
          break;
      }
    }

    accum.push({
      questionId: curQuestion.id,
      grade: Math.max(0, totalGrade),
    });
    return accum;
  }, []);
};
