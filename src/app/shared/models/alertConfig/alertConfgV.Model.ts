import { AlertCofgDetails } from './alertCofgDetailsV.Model';

export class AlertConfiguration {
    alertType: string;
    alertConfigurationID : number;
    alertTypeID : number;
    alertDescription : string;
    w2CellThreshold:number;
    improcID:number;
    alertInterfaceType : string;
    lstAlertConfgDetail : Array<AlertCofgDetails>;
    lstAlertConfgUsersIds : Array<number>;
    lstAlertInterfaceIds : Array<number>;
    lstPiperIds : Array<number>;
    isActive: boolean;
    isDeleted: boolean;
    lstAlertConfgOrgnTypeIds: Array<number>;
    lstAlertConfgOrgnIds: Array<number>;
    lstAlertConfgSiteIds: Array<number>;
}