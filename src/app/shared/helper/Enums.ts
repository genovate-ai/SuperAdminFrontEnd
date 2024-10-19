
export enum GENDER {
  GENDER_MALE = 'm',
  GENDER_FEMALE = 'f',
}
export enum STATUS_CODE {
  SUCCESS = '111',
  INVALID_SESSION = '112',
  INVALID_USER = '113',
  INVALID_CODE = '114',
  EXCEPTION = '115',
  CUSTOM_ERROR = '116',
  ALREADY_LOGOUT_ERROR = '117',
  SQL_EXCEPTION = '129',
  DIAPER_EXCEPTION = '130',
  DIVIDE_BY_ZERO_EXCEPTION = '131',
  OVERFLOW = '132',
  ARITHMATIC_EXCEPTION = '133',
  INDEX_OUT_OF_RANGE_EXCEPTION = '134',
  ARRAY_TYPE_MISMATCH_EXCEPTION = '135',
  INVALID_CAST_EXCEPTION = '136',
  NULL_REFERENCE_EXCEPTION = '137',
  OUT_OF_MEMORY_EXCEPTION = '138',
  TIMEOUT_EXCEPTION = '139',
  ARGUMENT_OUT_OF_EXCEPTION = '140',
  TIMEOUT_SQL_EXCEPTION = '141',
  CONTROLLER_EXCEPTION = '110'




}
export enum EVENT_CODE {
  UserLogin = 1,
  UserLogout = 2,
  CreateUser = 3,
  CreateOrganization = 4
}
export enum SCREEN_CODE {
  HomeScreen = 0,
  ManageUser = 1,
  ManageOrganization = 2,
  ManageSite = 3,
  ManageRole = 4,
  ManageAccessRight = 5,
  ManageDataTemplate = 6,
  ManageClientMapping = 7,
  ManageContactUs = 8,
  ManageHelpUs = 9,
  ManageReportAnalysisDashboar = 10,
  ManageDataUpload = 11,
  ManageHome = 12,
  ManageAlert = 13,
  ManageReportConfg = 14,
  ManageReportRole = 15,
  ManageReports = 16,
  ManagePiper = 17,
  ManageUserAgreement = 18,
  EntericDashboard = 19,
  ManagePiperSoftware = 20,
  InstallationRunValue = 21,
  ManageBarcode = 22,
  PiperConfiguration = 23,
  ManagePoultry = 24,
  ManageComplexCyclingConfig = 25,
  ManageFlockRegistration = 26,
  FarmManagement = 27,
  CropHealthReport = 33,
  EventManagement = 28,
  UploadImage = 29,
  RiskReport = 32,
  ScheduleManagement = 55,
  CanopyManagement = 59,
  PlantHeightManagement = 60,
  CropPriceManagement = 61,
  AgroChemicalsPriceManagement = 62,

  FarmAndCropBoundary = 63,
  Explorer = 64,
  Report = 65,
  EditAndAlignment = 67,
  UploadGeoJson=71,
  EngroAmazonApp = 72,
  EngroPlanId=73


}
export enum EVENTGROUP_CODE {
  VIEW = 1,
  INSERT = 2,
  UPDATE = 3,
  DELETE = 4,
  LOGIN = 6,
  LOGOUT = 7,
}

export enum API_CALLEVENTGROUP_CODE {

  REF_SELECTION_EVENT = 1,
  GRID_SELECTION_EVENT = 2,
  SAVE_EDIT_EVENT = 3,
  DELETE_EVENT = 4,
  SORTING_EVENT = 5
}

export enum BUTTON_LABELS {
  CREATE = "app.create",
  UPDATE = "app.update",
  CANCEL = "app.cancel",
  RESET = "app.reset",
  ADD = "app.add",
  SAVE = "app.save"
}
export enum ErrorMessages {
  SUCCESSMESSAGE = "Data Loaded Successfully",
  LOGIN = "Login Successful!",
  LOGOUT = "Logout Successful!",
  AUTHORIZATION = "You are not authorized to perform this task"


}


export enum MessagesCodes {
  MANDATORYREQUIRED = "messages.MandatoryFields"

}
export enum ConfirmationMessages {
  ConfirmDelete = "Confirm.Delete"
}
export enum OrganizationTypeEnum {

  Ancera = 1,
  Clients = 2,
  Partner = 3,
  Consumer = 4
}

export enum PiperAppEnum {

  UserApp = 702,
  ImprocSalmonella = 703,
  ImprocCoccidia = 704
}

export enum PathogenEnum {


  Salmonella = 703,
  Listeria = 705
}

export enum PathogenNameEnum {


  Salmonella = "Salmonella",
  Listeria = "Listeria"
}
export enum SoftwareTypeEnum {

  UserApp = 'userapp',
  ImprocSalmonella = 'salm',
  ImprocCoccidia = 'cocc'
}


export enum ColManageUserEnum {
  firstName = 'userFirstName',
  lastName = 'userLastName',
  cellPhoneNumber = 'userPhoneNo',
  email = 'userEmail',
  userId = 'userId',
  orgnTypeName = 'orgnTypeName',
  orgnName = 'orgnName',

}

export enum ColManageOrganizationsEnum {
  orgnName = 'orgnName',
  orgnId = 'orgnId',
  orgnPhoneNo = 'orgnPhoneNo',
  countryName = 'countryName',
  provinceName = 'provinceName',
  cityName = 'cityName'


}
export enum ColManageRolesEnum {
  roleName = 'userRoleName',
  roleDesc = 'userRoleDesc'
}
export enum ColManageAlertsEnum {
  alertUniqueId = 'alertUniqueId',
  CreatedDate = 'createdOn',
  dataSource = 'dataSource',
  alertVariable = 'alertVariable',
  alertCondition = 'alertCondition',
  alertDescription = 'alertDescription'
}
export enum ReportColManageRolesEnum {
  reportRoleName = 'reportRoleName',
  reportRoleDesc = 'reportRoleDesc'
}
export enum ColManageConfgReportEnum {

  reporGrp = 'IEReportGroupID',
  report = 'IEReportID',
  rprtDsplyName = 'displayName',
  rprtDsc = 'description'

}
export enum ColManageComplexCocciIntervention {
  complexName = 'complexName',
  vaccineName = 'vaccineName',
  feedProgramName = 'feedProgramName'
}
export enum ColManagePiperFormatEnum {
  pipername = 'piperName',
  piperUser = 'piperUser',
  currentpiperUser = 'currentpiperUser',
  coccUser = 'coccUser',
  currentcoccUser = 'currentcoccUser',
  salmUser = 'salmUser',
  currentsalmUser = 'currentsalmUser',
  piperUserUpdate = 'piperUserUpdate',
  salmUserUpdate = 'salmUserUpdate',
  coccUserUpdate = 'coccUserUpdate',
  disAPIVersion = 'disAPIVersion',
  APISupportStatus = 'APISupportStatus'
}
export enum ColManageDataFormatEnum {
  dataFormatName = 'dataFormName',
  dataFormatDesc = 'dataFormDesc',
  createdOn = 'createdOn'
}
export enum ColTypeEnum {
  DateTime = '100',
  String = '101',
  Number = '102',
  Time = '103',
  Integer = '104'
}
export enum ExcelFileHeader {
  dataFormColName = 'Name',
  dataFormColType = 'Type',
  dataFormDfltValue = 'Default Values',
  dataFormColLength = 'Length',
  dataFormIsMandatory = 'Mandatory',
  stringValue = 'Allowed Values',
  minValue = 'Minimum Value',
  maxValue = 'Maximum Value'
}

export enum SiteTypeID {
  Integrator = 9,
  Region = 10,
  CorporateOffice = 5,
  Farms = 6,
  Houses = 7,
  ProcessingPlants = 8,
  FeedMill = 11,
  Hatchery = 12,
  Laboratory = 13,
  Default = 14,
  Rehang = 15,
  BirdWash = 16,
  BirdRinse = 17,
  Chiller = 18,
  WingDip = 19,
  SubLab = 20,
  SubRegion = 21
}

export enum ReportCode {
  IsTableauReport = 'tableauReport',
  RiskReport = '0001',
  SoilTestMap = '0002',
  PortfolioReport = '0003',
  LandPreparationReport = '0004',
  PlantHealthReport = '0005',
  EmergenceReport = '0006',
  SalmonellaLog = '0456',
  CoccidiaLog = '0002',
  SalmonellaTimeline = '0003',
  CoccidiaTimeline = '0004',
  OPGDashboard = '0005',
  MPNSalmonellaLog = '0006',
  ExternalCoccidiaLog = '0007',
  ExternalSalmonellaLog = '0008',
  Wireframe = '0009',
  ExternalMPNSalmonellaLog = '0010',
  EntericDashboard = '0011',
  SitesLog = '0012',

}

export enum SubReportCode {
  LocalDashboard_Opg_Cal_Day_Detail = 1,
  LocalDashboard_Site_Performance = 2,
  LocalDashboard_Weather_Site = 3,

}

export enum DatSource {
  PIPERLog = 201,
  FarmPerformance = 202,
  Weather = 203
}
export enum AlertMode {
  Threshold = 301,
  Aggregate = 302,
  Absence = 303,
  stringBased = 304,
  Startswith = 801,
  Contains = 802,
  Endswith = 803,
  EqualsTo = 804
}
export enum NotificationFreq {
  custom = 404
}
export enum AggregateAlertMode {
  MovingAverage = 251,
  StdDeviation = 252
}
export enum ThresholdCondions {
  GreaterThan = 501,
  LessThan = 502,
  Between = 503
}
export enum delayFactor {
  Days = 551,
  Weeks = 552,
  Months = 553
}
export enum aggregateCondition {
  GreaterThan = 351,
  GreaterThanEqualTo = 353,
  LessThan = 352
}
export enum interventionType {
  treatment = '751',
  feed = '750'
}
export enum CocciInterventionVaccineEnum {
  VACCINE = 1,
  ADMINISTRATION_METHOD = 2,
  MANUFACTURER = 3,
  TARGET_PATHOGEN = 4
}
export enum CocciInterventionFeedProgramEnum {
  FEED_PROGRAM = 1,
  DRUG_NAME_ONE = 2,
  DRUG_CLASS_ONE = 3,
  MANUFACTURER_ONE = 4,
  DRUG_NAME_TWO = 5,
  DRUG_CLASS_TWO = 6,
  MANUFACTURER_TWO = 7,
  DRUG_NAME_THREE = 8,
  DRUG_CLASS_THREE = 9,
  MANUFACTURER_THREE = 10,

}

export enum DataTemplateEnum {
  SITE_UPLOAD = 39
}

export enum WatercourseType {
  watercourse = 16751,
  tubewell = 16752,
  storageTank = 16753,
}

export enum LandscapeFeatureType {
  tree = 16801,
  pole = 16802,
  shrub = 16803,
  heap = 16804,
  shadow = 16805
}

export enum LandPrepReportType {
  laserLevelling = 16701,
  cropRidges = 16702,
  cropIrrigation = 16703,
  cropCompaction = 16704,
  cropFieldDimension = 16705,
  waterChannels = 16706,
  landscapeFeature = 16707
}

export enum FlightPurpose {
  postHarvest = 1,
  laserLevelling = 2,
  landPreparation = 3,
  germination = 4,
  cropMonitoring = 5

}