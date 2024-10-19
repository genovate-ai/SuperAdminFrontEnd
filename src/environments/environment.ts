// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  staticFileBaseUrl: 'https://localhost:44365/',
  //staticFileBaseUrl: 'http://ec2-174-129-78-214.compute-1.amazonaws.com:8082/',

  baseUrl :'https://localhost:44365/api/',

  //baseUrl: 'http://ec2-54-226-193-213.compute-1.amazonaws.com:8087/api/',






  urlToGetIp: 'https://jsonip.com?format=json',


  adminUrl: 'admin/',
  farmUrl: 'Project/',
  ImageUrl: 'DroneImages/',
  farmReportUrl: 'FarmReport/',
  farmBankingReportUrl: 'BankingReport/',
  metadataUrl: 'metadata/',
  alertConfgUrl: 'alertconfiguration/',
  scheduleManagement: 'scheduleManagement/',
  alertUrl: 'alert/',
  authUrl: 'Admin/',
  clientdataUrl: 'client/',
  reportsUrl: 'report/',
  reportsDataUrl: 'reportdata/',
  showLoder: true,
  mobileView: 'enable',
  lang_option: false, //flag for multi language option for user
  default_lang: 'en-GB',
  // google_analytics: 'G-NMX4PJ2F1K'
  //google_analytics: 'G-P6LKN1MW7C',
  google_analytics: 'G-6225ZNPWKC',
  firebase: {
    apiKey: 'AAAAiKpfJXQ:APA91bFAjs81wO3T-wjGyTsxLU7JKGfBkXKgOChvOCiaX4BKBv13DGSfWvKUxYMnyJVPKS5SbepKlg9Z_c4ax9UwjmN076Eym3HsJvkz-zxsScDJwxzvPDdKZlGiyM_URriBuE2B4Sch',
    projectId: 'agrilift-enduser-qa',
    messagingSenderId: '586973914484',
    appId: '1:586973914484:web:ba34af29de9e50bccaf821'
  },
  farmScoringUrl : 'AssessmentTemplate/calculateFarmScore'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
