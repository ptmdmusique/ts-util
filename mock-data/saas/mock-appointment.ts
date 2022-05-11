import { faker } from "@faker-js/faker";

interface AppointmentDto {
  timeOffset: number;
  note: string;
}

const timeOffset = 8.64e7; // 2 days

const mockAppointment = (): AppointmentDto => {
  const curTimeOffset = faker.datatype.number({
    min: -timeOffset,
    max: timeOffset,
  });

  return {
    timeOffset: curTimeOffset,
    note: faker.lorem.sentence(),
  };
};

const numToMock = 30;
const appointmentList: AppointmentDto[] = [];
for (let index = 0; index < numToMock; index++) {
  appointmentList.push(mockAppointment());
}

// Write to file
import fs from "fs";
fs.writeFileSync(
  "./mock-appointment.json",
  JSON.stringify(appointmentList, null, 2),
  "utf8",
);
