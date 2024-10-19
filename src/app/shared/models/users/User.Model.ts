import { GENDER } from '../../helper/Enums';

export class UserModel {

    userId: string;
    username: string;
    userImage: string;
    firstName: string;
    lastName: string;
    email: string;
    isStaff: boolean;
    isActive: boolean;
    doj: Date;
    gender: GENDER;
    dob: Date;
    cnic: string;
    cellCountryCode: string;
    cellNo: string;
    currentAddress: string;
    permanentAddress: string;
    employeeCode: string;
    phoneNo: string;
    phoneCountryCode: string;
    branchId: string;
    lstRoles: [];
    photoThumbnail?: string;
    designation?: string;
    userRoles: string;
    myClients: string;
    isSuperTenant?: boolean;
    isSuperUser?:boolean;
}