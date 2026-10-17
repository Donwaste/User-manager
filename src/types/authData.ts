export interface Credentials {
  email: string;
  password: string;
  stayOn?: boolean;
}

export interface SignUpData extends Credentials {
  profession: string;
  rate?: number;
  completedMeetings?: number;
  name: string;
  sex: string;
  license: boolean;
  qualities: string[];
}
