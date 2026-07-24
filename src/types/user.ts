import { ProfessionType } from "./profession";
import { QualityType } from "./quality";

export interface UserType {
  _id: string;
  name: string;
  email: string;
  profession: ProfessionType;
  qualities: QualityType[];
  completedMeetings: number;
  rate: number;
  bookmark: boolean;
  sex?: string;
}
