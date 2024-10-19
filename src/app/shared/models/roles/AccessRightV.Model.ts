export class AccessRightVModel {

    roleAccessId: number;
    userRoleId: number;
    screenName: string;
    isCreateAllow: boolean;
    isUpdateAllow: boolean;
    isViewAllow: boolean;
    isActive: boolean;
    screenId: number;
    isCreateAble: boolean;
    isUpdateAble: boolean;
    isViewAble: boolean;

    isFieldAccessAllow?: boolean;
    adminRoleReportFieldsAcess? = [];
    fcSearchFieldAccess? = '';
    fcShowAllFields? = false;
    fcHiddenFieldsCnt? = 0;

}
