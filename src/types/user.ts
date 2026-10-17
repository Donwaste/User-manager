export interface UserType {
  _id: string;
  name: string;
  email: string;
  profession: string;
  qualities: string[];
  completedMeetings: number;
  rate: number;
  sex: string;
  bookmarks?: Record<string, boolean>;
  license: boolean;
}
