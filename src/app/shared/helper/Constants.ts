import { environment } from './../../../environments/environment'
export class Constants {
    static readonly MAX_SIZE = 10485760;
    static readonly staticFileBaseUrl = environment.staticFileBaseUrl;
    static readonly baseUrl = environment.baseUrl;
    static readonly ExcelHeaderLength = 9;
    static readonly adminBaseURL = environment.baseUrl + environment.adminUrl;
    static readonly farmBaseURL = environment.baseUrl + environment.farmUrl;
    static readonly scheduleManagement = environment.baseUrl + environment.scheduleManagement;
    static readonly droneImagesBaseURL = environment.baseUrl + environment.ImageUrl;
    static readonly farmReportBaseURL = environment.baseUrl + environment.farmReportUrl;
    static readonly farmBankingReportBaseURL = environment.baseUrl + environment.farmBankingReportUrl;
    static readonly authBaseURL = environment.baseUrl + environment.authUrl;
    static readonly metadataBaseURL = environment.baseUrl + environment.metadataUrl;
    static readonly alertConfgBaseURL = environment.baseUrl + environment.alertConfgUrl;
    static readonly alertBaseURL = environment.baseUrl + environment.alertUrl;
    static readonly clientDataBaseURL = environment.baseUrl +  environment.clientdataUrl;
    static readonly reportsBaseURL = environment.baseUrl +  environment.reportsUrl;
    static readonly reportsDataBaseURL = environment.baseUrl +  environment.reportsDataUrl;
    static readonly showLoader =  environment.showLoder;
    static readonly appName = "Agrilift Portal";
    static readonly moduleName = "Agrilift Intelligence Engine";
    static readonly screenName = "Home";
    static readonly totalPagesOnPagination = 10;
    static readonly defaultImage64 = "data:image/png;base64,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"
    static readonly defaultPlaceholder = "./../../../../../assets/images/default-logo.png";
    static readonly status = "Validation Status";
    static readonly Errors = "Errors";
    static readonly NewSiteID = -1;
    static readonly IntervalDataFetching = 120000;
    static readonly NgSelectItemLimit = 3;
    static readonly NgSelectItemLimitSM = 2;
    static readonly prefixAlertId = "aid_AG_";



    // Reports URLs

    // static readonly salmonellaLogReport = '/home/reports/salmonella-log-report';
    // static readonly coccidiaLogReport = '/home/reports/coccidia-log-report';
    // Following Agrilift Reports URL
    static readonly riskReport = '/home/farm-report/farm-report/';
    // ------------------------------------------------------------ 
    static readonly tableauReport = '/home/reports/tableau/tableau-dashboard';
    static readonly salmonellaLogReport = '/home/reports/log/salmonella-log';
    static readonly coccidiaLogReport = '/home/reports/log/coccidia-log';
    static readonly salmonellaTimelineReport = '';
    static readonly coccidiaTimelineReport = '/home/reports/timeline/coccidia-timeline';
    static readonly opgDashboardReport = '/home/reports/opg/opg-dashboard';
    static readonly mpnSalmonellaLogReport = '/home/reports/log/mpn-log';
    static readonly ExternalCoccidiaLog = '/home/reports/log/external-coccidia-log';
    static readonly WeatherReport = '/home/reports/weather-report';
    static readonly SitePerformance = '/home/reports/site-performance';
    static readonly SiteOpgCalDayDetail = '/home/reports/site-opg-cal-day-detail';
    static readonly Wireframe = '/home/reports/wireframe/wireframe';
    static readonly Enteric = '/home/reports/enteric-dashboard';
    static readonly ExternalsalmonellaLogReport = '/home/reports/log/external-salmonella-log';
    static readonly ExternalmpnSalmonellaLogReport = '/home/reports/log/external-mpn-salmonella-log';
    static readonly sitesLogReport = '/home/reports/log/sites-log';


    static readonly profile = '/home/admin/profile';
    static readonly FarmOverView = '/home/farm';
    static readonly FarmScoringurl = environment.baseUrl + environment.farmScoringUrl;
    static readonly invokeEvent = 'Harvest';

}
