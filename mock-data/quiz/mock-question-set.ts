import faker from "faker";

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

const mockMultipleChoiceQuestion = (): MultipleChoiceQuestionSchema => {
  const numPossibleAnswer = faker.datatype.number({ min: 2, max: 4 });
  const possibleAnswerList: PossibleAnswerSchema[] = [];
  for (let index = 0; index < numPossibleAnswer; index++) {
    possibleAnswerList.push({
      id: faker.datatype.uuid(),
      description: faker.lorem.sentence(),
    });
  }

  const actualAnswer: MultipleChoiceActualAnswerSchema = {
    answerId: faker.random.arrayElement(possibleAnswerList).id,
  };

  return {
    id: faker.datatype.uuid(),
    grade: faker.datatype.number({ min: 1, max: 10 }),
    description: faker.lorem.sentence(),
    type: "multipleChoice",
    possibleAnswerList,
    actualAnswer,
  };
};

const mockCheckboxQuestion = (): CheckboxQuestionSchema => {
  const numPossibleAnswer = faker.datatype.number({ min: 2, max: 4 });
  const possibleAnswerList: PossibleAnswerSchema[] = [];
  for (let index = 0; index < numPossibleAnswer; index++) {
    possibleAnswerList.push({
      id: faker.datatype.uuid(),
      description: faker.lorem.sentence(),
    });
  }

  const actualAnswer: CheckboxActualAnswerSchema = {
    answerIdList: faker.random
      .arrayElements(possibleAnswerList, 1)
      .map((possibleAnswer) => possibleAnswer.id),
  };

  return {
    id: faker.datatype.uuid(),
    grade: faker.datatype.number({ min: 1, max: 10 }),
    description: faker.lorem.sentence(),
    type: "checkboxes",
    possibleAnswerList,
    actualAnswer,
  };
};

const mockQuestionSet = (): QuestionSchema[][] => {
  const numQuestion = faker.datatype.number({ min: 2, max: 4 });
  const questionList: QuestionSchema[] = [];
  for (let index = 0; index < numQuestion; index++) {
    questionList.push(
      faker.random.arrayElement([
        mockMultipleChoiceQuestion(),
        mockCheckboxQuestion(),
      ]),
    );
  }

  const numQuestionSet = faker.datatype.number({ min: 2, max: 4 });
  const questionSetList: QuestionSchema[][] = [];
  for (let index = 0; index < numQuestionSet; index++) {
    questionSetList.push(questionList);
  }

  return questionSetList;
};
