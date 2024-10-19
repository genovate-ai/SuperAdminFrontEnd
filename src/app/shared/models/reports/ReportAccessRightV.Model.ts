export class ReportAccessRightVM {
    reportAccessRightID: number;
    reportRoleID: number;
    ieReportID: number;
    isViewAllow: boolean;
    setHome: boolean;
    ieHelperReportID: number;
    reportName: string;
    ieReportGroupID: number;
    displayName: string;
    description: string;
    isActive: boolean;
    isDeleted: boolean;
    ieReportConfigurationID: number;
    fieldAccess? = false;
    showAccessFields? = false;
    fieldReportRoleAccess? = [];
    fcSearchFieldAccess? = '';
    fcShowAllFields? = false;
    fcHiddenFieldsCnt? = 0;
}
