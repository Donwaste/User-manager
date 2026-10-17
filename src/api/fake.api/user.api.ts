import { professionsObject as professions } from "./professions.api";
import { UserType } from "../../types";

const qualities = {
  tedious: "67rdca3eeb7f6fgeed471198",
  strange: "67rdca3eeb7f6fgeed471100",
  buller: "67rdca3eeb7f6fgeed4711012",
  alcoholic: "67rdca3eeb7f6fgeed471101",
  handsome: "67rdca3eeb7f6fgeed471102",
  uncertain: "67rdca3eeb7f6fgeed471103",
};

const users: UserType[] = [
  {
    _id: "67rdca3eeb7f6fgeed471815",
    name: "John Dorian",
    email: "Jony7351@tw.com",
    profession: professions.doctor._id,
    qualities: [qualities.tedious, qualities.uncertain, qualities.strange],
    completedMeetings: 36,
    rate: 2.5,
    sex: "male",
    license: true,
  },
  {
    _id: "67rdca3eeb7f6fgeed471816",
    name: "Allen Reid",
    email: "AllenReid@tw.com",
    profession: professions.doctor._id,
    qualities: [qualities.buller, qualities.handsome, qualities.alcoholic],
    completedMeetings: 15,
    rate: 2.5,
    sex: "male",
    license: true,
  },
  {
    _id: "67rdca3eeb7f6fgeed471817",
    name: "Bob Kelso",
    email: "BobKelso@tw.com",
    profession: professions.doctor._id,
    qualities: [qualities.buller],
    completedMeetings: 247,
    rate: 3.5,
    sex: "male",
    license: true,
  },
  {
    _id: "67rdca3eeb7f6fgeed471818",
    name: "Rachel Green",
    email: "RachelGreen@tw.com",
    profession: professions.waiter._id,
    qualities: [qualities.uncertain],
    completedMeetings: 148,
    rate: 3.5,
    sex: "female",
    license: true,
  },
  {
    _id: "67rdca3eeb7f6fgeed471819",
    name: "Sheldon Cooper",
    email: "SheldonCooper@tw.com",
    profession: professions.physics._id,
    qualities: [qualities.strange, qualities.tedious],
    completedMeetings: 37,
    rate: 4.6,
    sex: "male",
    license: true,
  },
  {
    _id: "67rdca3eeb7f6fgeed471820",
    name: "Leonard Hofstetter",
    email: "LeonardHofstetter@tw.com",
    profession: professions.physics._id,
    qualities: [qualities.strange, qualities.uncertain],
    completedMeetings: 147,
    rate: 3.5,
    sex: "male",
    license: true,
  },
  {
    _id: "67rdca3eeb7f6fgeed471821",
    name: "Howard Wolowitz",
    email: "HowardWolowitz@tw.com",
    profession: professions.engineer._id,
    qualities: [qualities.strange, qualities.tedious],
    completedMeetings: 72,
    rate: 3.5,
    sex: "male",
    license: true,
  },
  {
    _id: "67rdca3eeb7f6fgeed471822",
    name: "Nicola Tesla",
    email: "NicolaTesla@tw.com",
    profession: professions.engineer._id,
    qualities: [qualities.handsome],
    completedMeetings: 72,
    rate: 5,
    sex: "male",
    license: true,
  },
  {
    _id: "67rdca3eeb7f6fgeed471823",
    name: "Monica Geller",
    email: "MonicaGeller@tw.com",
    profession: professions.cook._id,
    qualities: [qualities.strange, qualities.uncertain],
    completedMeetings: 17,
    rate: 4.5,
    sex: "female",
    license: true,
  },
  {
    _id: "67rdca3eeb7f6fgeed471824",
    name: "Ratatouille",
    email: "Ratatouille@tw.com",
    profession: professions.cook._id,
    qualities: [qualities.handsome, qualities.buller],
    completedMeetings: 17,
    rate: 4.5,
    sex: "male",
    license: true,
  },
  {
    _id: "67rdca3eeb7f6fgeed47181f",
    name: "Joey Tribbiani",
    email: "JoeyTribbiani@tw.com",
    profession: professions.actor._id,
    qualities: [qualities.uncertain, qualities.strange],
    completedMeetings: 434,
    rate: 3.5,
    sex: "male",
    license: true,
  },
  {
    _id: "67rdca3eeb7f6fgeed47181r",
    name: "Brad Pitt",
    email: "BradPitt@tw.com",
    profession: professions.actor._id,
    qualities: [qualities.handsome],
    completedMeetings: 434,
    rate: 5,
    sex: "male",
    license: true,
  },
];

if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(users));
}

const getUsers = (): UserType[] => {
  const raw = localStorage.getItem("users");
  return raw ? JSON.parse(raw) : [];
};

const fetchAll = (): Promise<UserType[]> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(getUsers());
    }, 500);
  });

const update = (id: string, data: Partial<UserType>): Promise<UserType> =>
  new Promise((resolve) => {
    const currentUsers = getUsers();
    const userIndex = currentUsers.findIndex((u) => u._id === id);
    currentUsers[userIndex] = { ...currentUsers[userIndex], ...data };
    localStorage.setItem("users", JSON.stringify(currentUsers));
    resolve(currentUsers[userIndex]);
  });

const getById = (id: string): Promise<UserType | undefined> =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(getUsers().find((user) => user._id === id));
    }, 500);
  });

export default {
  fetchAll,
  getById,
  update,
};
