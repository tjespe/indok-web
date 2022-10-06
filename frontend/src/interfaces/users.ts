import { Membership } from "./membership";
import { Organization } from "./organizations";

export type UserInfo = {
  id: string;
  feideEmail: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dateJoined: string;
  graduationYear: number;
  gradeYear: number;
  allergies: string;
  phoneNumber: string;
  firstLogin: boolean;
};

export type User = {
  organizations: Organization[];
  memberships: Membership[];
  events: Partial<Event>[];
} & UserInfo;
