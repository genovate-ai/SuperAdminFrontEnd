import { alertMainDetal } from './alertMainDetailV.Model';

export class alertMain{
alertConfigID :number;
alertRunningNumber: number;
stringBasedSettings: boolean;
alertUniqueId: string;
orgnId: number;
copyFromAlertId: number;
autoDeactivationRefId: number; 
autoDeactivationModuleId: number; 
alertName: string;
alertDescription: string;
alertCondition: string;
createdByUserId: number; 
alertConfigMainDetail: alertMainDetal;
lstAlertConfgSiteIds: Array<number>;
alertConfigStringBasedSettings: any;
isActive: boolean;
isDeleted:boolean;
alertRunningId: any;
alertVariableStr?: string;
}