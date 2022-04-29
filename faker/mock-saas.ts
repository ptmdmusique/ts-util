import { faker } from "@faker-js/faker";

export interface Address {
  street: string;
  suite: string | null;
  state: string;
  zip: string;
}

export interface UserBasicInfo {
  name: string;
  phoneNumber: string;
  email: string | null;
  address: Address | null;
}

const mockUser = (): UserBasicInfo => ({
  name: faker.name.findName(),
  phoneNumber: faker.phone.phoneNumber("+1#########"),
  email: faker.internet.email(),
  address: {
    street: faker.address.streetAddress(),
    suite: faker.address.secondaryAddress(),
    state: faker.address.state(),
    zip: faker.address.zipCode(),
  },
});

const userList: UserBasicInfo[] = [];
for (let index = 0; index < 10; index++) {
  userList.push(mockUser());
}
console.log(userList);

interface Service {
  name: string;
  alias: string;
  cost: number;
  tagList: string[];
  processTime: number;
  type: "nail";
  isTemplate: boolean;
  note: string;

  color: string;
  requiredAddOnServiceIdList: string[];
  possibleAddOnServiceIdList: string[];
}

const mockService = (): Service => {
  const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  const numTag = faker.datatype.number({ min: 0, max: 4 });
  const tagList: string[] = [];
  for (let index = 0; index < numTag; index++) {
    tagList.push(faker.commerce.productAdjective());
  }

  return {
    name: faker.commerce.productName(),
    alias: faker.commerce.productName(),
    cost: parseFloat(faker.commerce.price()),
    tagList,
    processTime: faker.datatype.number({ min: 1, max: 10 }),
    type: "nail",
    isTemplate: false,
    note: faker.lorem.paragraph(),

    color,
    requiredAddOnServiceIdList: [],
    possibleAddOnServiceIdList: [],
  };
};

const serviceList: Service[] = [];
for (let index = 0; index < 10; index++) {
  serviceList.push(mockService());
}
console.log(serviceList);
