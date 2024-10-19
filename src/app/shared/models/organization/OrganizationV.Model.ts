import { Binary } from 'selenium-webdriver/firefox';

export class OrganizationVModel {

    orgnId: number;
    orgnName: string;
    orgnEmail: string;
    orgnMaxUsers: number;
    orgnPhoneNo: string;
    orgnCtryPhoneCodeId: number;
    orgnTypeId: number;
    orgnLogo: string;
    orgnUniqueNumber: string;
    isActive: boolean;
    lstRoleIDS?: Array<number> = [];
    lstReportRoleIDS?: Array<number> = [];
    lstUserRoleVM?: Array<number> = [];
    lstReportRoleVM?: Array<number> = [];
    lstEulaIDS: Array<number> = [];

}
