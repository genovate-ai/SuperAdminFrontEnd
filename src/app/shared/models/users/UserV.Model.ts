import { FormGroup } from '@angular/forms';


export class UserVModel {



    userId: number;
    userFirstName: string;
    userLastName: string;
    userPhoneCodeId: number;
    userPhoneNo: string;
    userWrkPhoneCodeId: number;
    userWrkPhoneNo: string;
    EmailId: string;
    userOrgnTypeId: number;
    orgnName: string;
    userOrgnId: number;
    userOrgnSiteId = 0 ;
    userPrimaryContact: boolean;
    isActive: boolean;
    userLanguage?: string;
    userTimeZone?: string;
    userDateFormat?: string;


    lstRoleIDS: Array<number> = [];
    lstReportRoleIDS: Array<number> = [];
    lstOrganizationIDS: Array<number> = [];
    userDesignation = ' ';
    isForDISAPI: boolean;
    lstSiteIDS: Array<number> = [];
    lstPiperIDS: Array<number> = [];
    lstEulaIDS: Array<number> = [];
    isPiperUser: boolean;
    orgSites: any;
    lstEulasWithStatus? = [];
    lstUserSitesAssn? = [];
    lstTestSitesIDS? = [];
    regionName? = '' ;
    timeZoneCountry? = '' ;
    timeZoneId? = '' ;
    dateFormatId? = '' ;
    lstClientIDS?;
    helpCenterURL?;
    versions?;
    roleCategoryId?;
    roleCategoryName?;
    siteAdministrator?:any = 'false';
    tehsilId?: Array<number> = [];
    isSuperTenant?: boolean = false;
    isSuperUser?:boolean = false;
    lstTehsilIDS?: Array<number> = [];
}
