import { Component, OnInit, KeyValueDiffer, KeyValueDiffers, HostListener, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/shared/helper/Constants';
import { environment } from 'src/environments/environment';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { ScreenNameService } from 'src/app/shared/services/common/screen-name.service';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { AuthService } from 'src/app/shared/services/common/auth.service';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { ScreenVPermission } from 'src/app/shared/models/ScreenPermissionV.Model';
import { SCREEN_CODE } from 'src/app/shared/helper/Enums';
import { LayoutPermissionVM } from 'src/app/shared/models/LayoutPermissionV.Model';
import { filter } from 'rxjs/operators';
import { LasturlAccessed } from 'src/app/shared/services/common/urlAccessed.service';
import { ReportsVModel } from 'src/app/shared/models/reports/Reports.V.Model';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';



@Component({
  selector: 'app-layout-component',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  chosenLanguage = { thumbnail: './../../../../../assets/images/flag-icons/ancera-flag.png', language: 'en-US' };
  // languageCollapsed = true;
  // languages = [
  //   { thumbnail: './../../../../../assets/images/flag-icons/united-states-of-america.png', language: 'en-US', label: 'English - US' },
  //   { thumbnail: './../../../../../assets/images/flag-icons/saudi-arabia.png', language: 'ar-KSA', label: ' Arabic - KSA' },
  //   { thumbnail: './../../../../../assets/images/flag-icons/pakistan.png', language: 'fr', label: 'Urdu - PK' },
  //   { thumbnail: './../../../../../assets/images/flag-icons/france.png', language: 'ur-PK', label: 'French - FR' },
  //   { thumbnail: './../../../../../assets/images/flag-icons/ancera-flag.png', language: 'en-US', label: 'English - US' },
  // ];

  // rla;
  differ: KeyValueDiffer<string, any>;
  isShowFullMenu = false;
  isHomeGroupActive = true;
  isAdminGroupActive = false;
  isMetaDataGroupActive = false;
  isOpsGroupActive = false;
  isContactGroupActive = false;
  isHelpGroupActive = false;
  isClientGroupActive = false;
  isAnalysisReportGroupActive = false;
  isScheduleGroupActive = false;
  isPiperSoftwareGroupActive = false;
  isPiperSoftwareCollapsed = true;
  isAnalysisReportsCollapsed = true;
  isScheduleCollapsed = true;
  activeProfileSettings = false;
  isUserCollapsed = true;
  isMetaDataCollapsed = true;

  isClientCollapsed = true;
  isRoleCollapsed = true;
  isReportConfgCollapsed = true;
  // isViewReportCollapsed = true;
  isReportRoleCollapse = true;
  isAlertCollapsed = true;
  isBranchesCollapsed = true;
  isOrganogramCollapsed = true;
  isLeadCaptureCollapsed = true;
  appName = Constants.appName;
  moduleName = Constants.moduleName;
  screenName = Constants.screenName;
  languageOption = false;
  isLoggedIn = false;
  showNavbar = true;
  isfixed = false;
  NameOfUser = ''; // this is not the username of the user, this is concatination of user's first name and last name
  messageT: any;
  lstLng = []
  lngForm: UntypedFormGroup;
  value;
  selectedLanguage: any;

  layoutPermissionVMLcl: LayoutPermissionVM = {

    roleMGMTManageUsersMenu: false,
    roleMGMTManageOrganMenu: false,
    roleMGMTManageAccessMenu: false,
    roleMGMTManageRole: false,
    roleMGMTManageReportRole: false,
    roleMGMTManageComplexCyclingConfig: false,
    roleMGMTManageFlockRegistration: false,
    roleMGMTManagePiperScreen: false,
    roleMGMTManageAlertMenu: false,
    roleMGMTManageReportConfgtMenu: false,
    roleMGMTViewReportMenu: false,
    roleMGMTManageDataTemplateMenu: false,
    roleMGMTManageClientDTMapping: false,
    roleMGMTManageContactUs: false,
    roleMGMTManageHelp: false,
    roleMGMTSite: false,
    roleMGMTReport: false,
    roleMGMTHome: false,
    roleMGMTDataUpload: false,
    roleMGMTAnalysisDashboard: false,
    roleMGMTManageUserAgreement: false,
    roleMGMTManagePIPERSoftware: false,
    roleMGMTManageBarcode: false,
    roleMGMTManagePiperConfig: false,
    roleMGMTManagePoultryMenu: false,
    FarmManagement: false,
    UploadImage: false,
    roleMGMTSchedule: false,
    roleMGMTCanopy: false,
    roleMGMTPlantHeight: false,
    roleMGMTCropsPrice: false,
    roleMGMTAgroChemicals: false


  };

  isRoleMGMTMenuApplied = false;

  isReportDisplayed = false;
  message: string;
  closeSubscription: any;
  closeSubscription1: any;
  lastUrl: string;
  param: { report: string; id: number; };
  closeSubscription2: any;
  mobile: boolean;
  updateHeaderStyle: boolean;

  webAppVersion: string;

  
  // Changing screen from desktop to mobile when menu is locked #End

  @HostListener('window:orientationchange')
  onOrientationChange(): void {
    if (window.screen.width <= 1024) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  constructor(private urlAccessed: LasturlAccessed, private differs: KeyValueDiffers, protected translate: TranslationConfigService,
    public account: AccountService,
    protected auth: AuthService, protected router: Router, private screenNameService: ScreenNameService, private fb: UntypedFormBuilder,
    protected translationPipe: TranslationConfigService, protected popupController: PopupControllerService,
    private renderer: Renderer2
  ) {

    // translate.setDefaultLang('en-GB');
  
    this.differ = this.differs.find({}).create();
  }
  ngOnInit() {

    //this.screenPermission = this.IsAccessAllowed(this.screen);


    const session = this.auth.getSession();
    this.translate.setDefaultLang(session ? session.user.userLanguage : environment.default_lang);
    // this.resetForm();
    // this.lstLng = [
    //   {code:'en-GB',name: 'English(UK)'},
    //   {code:'en-US',name: 'English(US)'},
    //   {code:'ar-KSA', name: 'Arabic'},
    //   {code:'fr', name: 'French'},
    //   {code:'ko', name: 'Korean'},


    // ]
    // this.selectedLanguage = 'en-GB';
    if (window.screen.width <= 1024) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    this.screenNameService.currentScreen.subscribe(screen => this.screenName = screen);
    this.account.isLoggedIn.asObservable().subscribe(boolean => {
      this.isLoggedIn = boolean;
      this.router.events.pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((navEnd: NavigationEnd) => {
          const myURL = navEnd.urlAfterRedirects;
          if ((myURL.slice(0, 20) == '/auth/reset-password' || myURL.slice(0, 21) == '/auth/forgot-password') && this.isLoggedIn) {
            this.showNavbar = false;
          } else {
            this.showNavbar = true;
          }
          this.setHeader(myURL);
        });
    });
    this.NameOfUser = 'Temp User'; // this.account.user.firstName + '' + this.account.user.lastName;

    this.account.menulocked = this.isfixed;
    this.applyRoleMGMTOnMenu(false);

    this.closeSubscription = this.urlAccessed.previousURL.subscribe(
      url => this.lastUrl = url);
    this.closeSubscription1 = this.urlAccessed.paramURL.subscribe(
      param => this.param = param);


  }
  ngDoCheck() {
    const change = this.differ.diff(this.account);
    if (change) {
      this.applyRoleMGMTOnMenu(false);
    }
  }
  
  // chooseLanguage(language) {
  //   this.chosenLanguage = language;
  //   this.languageCollapsed = true;
  //   this.translate.setDefaultLang(language.language);
  // }


  // public onLanguageChange(loacle: string) {
  //
  //   //let s = this.selectedLanguage;
  // //  this.value= this.lngForm.get('languageItems').value;
  //   this.translate.changeLanguage(loacle);
  // }
  public onLanguageChange(value) {

    let s = this.selectedLanguage;
    this.value = this.lngForm.get('languageItems').value;
    this.translate.changeLanguage(this.value);
  }

  logout() {

    this.isRoleMGMTMenuApplied = false;
    this.isfixed = false;
    this.isShowFullMenu = false;
    this.auth.logout();
    this.translate.setDefaultLang(environment.default_lang);
    this.setHomeGroupActive();
    this.urlAccessed.makeHomeFalse();
  }

  closeAllTabs() {
    this.isUserCollapsed = true;
    this.isRoleCollapsed = true;
    this.isReportRoleCollapse = true;
    this.isReportConfgCollapsed = true;
    this.isAlertCollapsed = true;
    this.isMetaDataCollapsed = true;
    this.isAnalysisReportsCollapsed = true;
    this.isScheduleCollapsed = true;
    this.isPiperSoftwareCollapsed = true;
  }

  setHomeGroupActive() {
    this.urlAccessed.changeurl('/home');
    this.isContactGroupActive = false;
    this.isHomeGroupActive = true;
    this.isAdminGroupActive = false;
    this.isMetaDataGroupActive = false;
    this.isOpsGroupActive = false;
    this.isHelpGroupActive = false;
    this.isClientGroupActive = false;
    this.isAnalysisReportGroupActive = false;
    this.isPiperSoftwareGroupActive = false;

    this.translate.getTranslation('menu.AnceraIE', '').subscribe(response => {
      this.moduleName = response;
    });
    this.screenName = this.screenNameService.name.value;
  }

  setContactUsActive() {
    this.urlAccessed.changeurl('/home/admin/contactus');
    this.isContactGroupActive = true;
    this.isHomeGroupActive = false;
    this.isAdminGroupActive = false;
    this.isMetaDataGroupActive = false;
    this.isOpsGroupActive = false;
    this.isHelpGroupActive = false;
    this.isClientGroupActive = false;
    this.isAnalysisReportGroupActive = false;
    this.isPiperSoftwareGroupActive = false;

    this.translate.getTranslation('menu.AnceraIE', '').subscribe(response => {
      this.moduleName = response;
    });
    this.translate.getTranslation('menu.ContactUs', '').subscribe(response => {
      this.screenName = response;
    });

  }

  setHelpActive() {
    window.open(this.account.user.helpCenterURL, "_blank");

    // this.urlAccessed.changeurl('/home/admin/help');
    // this.isContactGroupActive = false;
    // this.isHomeGroupActive = false;
    // this.isAdminGroupActive = false;
    // this.isMetaDataGroupActive = false;
    // this.isOpsGroupActive = false;
    // this.isHelpGroupActive = true;
    // this.isClientGroupActive = false;
    // this.isAnalysisReportGroupActive = false;
    // this.isPiperSoftwareGroupActive = false;

    // this.translate.getTranslation('menu.AnceraIE', '').subscribe(response => {
    //   this.moduleName = response;
    // });
    // this.translate.getTranslation('menu.help', '').subscribe(response => {
    //   this.screenName = response;
    // });

  }
  closeMenuonMobile() {
    if (this.mobile) {
      this.isShowFullMenu = false;
    }
  }
  setAdminGroupActive() {
    this.updateHeaderStyle = false;
    this.isContactGroupActive = false;
    this.isHomeGroupActive = false;
    this.isAdminGroupActive = true;
    this.isMetaDataGroupActive = false;
    this.isOpsGroupActive = false;
    this.isHelpGroupActive = false;
    this.isClientGroupActive = false;
    this.isAnalysisReportGroupActive = false;
    this.isPiperSoftwareGroupActive = false;
    this.isScheduleGroupActive = false;
    this.translate.getTranslation('menu.Administration', '').subscribe(response => {
      this.moduleName = response;
    });
  }

  setMetadataGroupActive() {
    this.updateHeaderStyle = false;
    this.isContactGroupActive = false;
    this.isHomeGroupActive = false;
    this.isAdminGroupActive = false;
    this.isMetaDataGroupActive = true;
    this.isOpsGroupActive = false;
    this.isHelpGroupActive = false;
    this.isClientGroupActive = false;
    this.isAnalysisReportGroupActive = false;
    this.isPiperSoftwareGroupActive = false;
    this.isScheduleGroupActive = false;
    this.translate.getTranslation('menu.MetaData', '').subscribe(response => {
      this.moduleName = response;
    });
  }

  setMetadataGroupActiveV2() {
    this.updateHeaderStyle = true;
    this.isContactGroupActive = false;
    this.isHomeGroupActive = false;
    this.isAdminGroupActive = false;
    this.isMetaDataGroupActive = true;
    this.isOpsGroupActive = false;
    this.isHelpGroupActive = false;
    this.isClientGroupActive = false;
    this.isAnalysisReportGroupActive = false;
    this.isPiperSoftwareGroupActive = false;
    this.isScheduleGroupActive = false;
    this.translate.getTranslation('menu.managePoultry', '').subscribe(response => {
      this.moduleName = response;
    });
  }

  setClientGroupActive() {
    this.updateHeaderStyle = false;
    this.isContactGroupActive = false;
    this.isHomeGroupActive = false;
    this.isAdminGroupActive = false;
    this.isMetaDataGroupActive = true;
    this.isOpsGroupActive = false;
    this.isHelpGroupActive = false;
    this.isClientGroupActive = false;
    this.isAnalysisReportGroupActive = false;
    this.isPiperSoftwareGroupActive = false;
    this.isScheduleGroupActive = false;
    this.translate.getTranslation('menu.MetaData', '').subscribe(response => {
      this.moduleName = response;
    });
  }


  setAnalysisReportActive() {
    this.updateHeaderStyle = false;
    this.isContactGroupActive = false;
    this.isHomeGroupActive = false;
    this.isAdminGroupActive = false;
    this.isMetaDataGroupActive = false;
    this.isOpsGroupActive = false;
    this.isHelpGroupActive = false;
    this.isClientGroupActive = false;

    this.isAnalysisReportGroupActive = true;
    this.isPiperSoftwareGroupActive = false;
    this.isScheduleGroupActive = false;
    this.translate.getTranslation('menu.Reports', '').subscribe(response => {
      this.moduleName = response;
    });
  }
  setScheduleGroupActive() {
    this.updateHeaderStyle = false;
    this.isContactGroupActive = false;
    this.isHomeGroupActive = false;
    this.isAdminGroupActive = false;
    this.isMetaDataGroupActive = false;
    this.isOpsGroupActive = false;
    this.isHelpGroupActive = false;
    this.isClientGroupActive = false;

    this.isAnalysisReportGroupActive = false;
    this.isScheduleGroupActive = true;
    this.isPiperSoftwareGroupActive = false;

    this.translate.getTranslation('menu.Reports', '').subscribe(response => {
      this.moduleName = response;
    });
  }
  setUserProfileGroupActive() {
    this.updateHeaderStyle = false;
    this.isContactGroupActive = false;
    this.isHomeGroupActive = false;
    this.isAdminGroupActive = false;
    this.isMetaDataGroupActive = false;
    this.isOpsGroupActive = false;
    this.isHelpGroupActive = false;
    this.isClientGroupActive = false;

    this.isAnalysisReportGroupActive = false;
    this.isPiperSoftwareGroupActive = false;
    this.isScheduleGroupActive = false;
    this.translate.getTranslation('menu.profileSettings', '').subscribe(response => {
      this.moduleName = response;
    });
  }
  setPiperSoftwareGroupActive() {
    this.updateHeaderStyle = false;
    this.isContactGroupActive = false;
    this.isHomeGroupActive = false;
    this.isAdminGroupActive = false;
    this.isMetaDataGroupActive = false;
    this.isOpsGroupActive = false;
    this.isHelpGroupActive = false;
    this.isClientGroupActive = false;

    this.isAnalysisReportGroupActive = false;
    this.isPiperSoftwareGroupActive = true;
    this.isScheduleGroupActive = false;
    this.translate.getTranslation('menu.manageUserApp', '').subscribe(response => {
      this.moduleName = response;
    });
  }
  setAdminViewUserActive() {
    this.urlAccessed.changeurl('/home/admin/users');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.UserManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setAdminViewOrgActive() {
    this.urlAccessed.changeurl('/home/admin/organizations');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.OrganizationManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setAdminManageRolesActive() {
    this.urlAccessed.changeurl('/home/admin/roles');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.AccessManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setCanopyManageActive() {
    this.urlAccessed.changeurl('/home/admin/canopy');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.AccessManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setPlantHeightManageActive() {
    this.urlAccessed.changeurl('/home/admin/plant-height');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.AccessManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setPlantPriceManageActive() {
    this.urlAccessed.changeurl('/home/admin/crop-local-price');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.AccessManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setAgroChemicalsPriceManageActive() {
    this.urlAccessed.changeurl('/home/admin/agro-chemicals-price');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.AccessManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setAdminManageAlertsActive() {
    this.urlAccessed.changeurl('/home/admin/alerts');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.AlertManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setAdminManageReportConfgActive() {
    this.urlAccessed.changeurl('/home/admin/reportconfg');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.ReportConfg', '').subscribe(response => {
      this.screenName = response;
    });
  }

  setAdminManageReportRolesActive() {
    this.urlAccessed.changeurl('/home/admin/reportroles');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.ReportManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }

  setAdminManageComplexCyclingConfigActive() {
    this.urlAccessed.changeurl('/home/admin/complex-cycling-config');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.complexCyclingConfig', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setAdminManageFlockRegistation() {
    this.urlAccessed.changeurl('/home/admin/flock-registration');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.flockRegistration', '').subscribe(response => {
      this.screenName = response;
    });
  }

  setAdminManagePiperRolesActive() {
    this.urlAccessed.changeurl('/home/admin/piper');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.PiperManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }

  setAdminManageLicenseActive() {
    this.urlAccessed.changeurl('/home/admin/user-agreement');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.licenseManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }

  setAdminManageBarcodeActive() {
    this.urlAccessed.changeurl('/home/admin/barcode-generation');
    this.setAdminGroupActive();
    this.translate.getTranslation('menu.barcodeManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }

  setDataUploadFormatActive() {
    this.urlAccessed.changeurl('/home/metadata/dataformat');
    this.setMetadataGroupActive();
    this.translate.getTranslation('menu.DataUploadFormat', '').subscribe(response => {
      this.screenName = response;
    });
  }

  setPoultryMenagementActive() {
    this.urlAccessed.changeurl('/home/metadata/poultry');
    this.setMetadataGroupActiveV2();
    this.translate.getTranslation('menu.LoggingAndMang', '').subscribe(response => {
      this.screenName = response;
    });
  }

  setClientDataUploadActive() {
    this.urlAccessed.changeurl('/home/client/dataupload');
    this.setClientGroupActive();
    this.translate.getTranslation('menu.Dataupload', '').subscribe(response => {
      this.screenName = response;
    });
  }

  setAnalysisReportsActive() {
    this.urlAccessed.changeurl('/home/reports/analysisreports');
    this.setAnalysisReportActive();
    this.translate.getTranslation('menu.Dashboard', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setPiperSoftwareManagementActive() {
    this.urlAccessed.changeurl('/home/admin/piper-software-management');
    this.setPiperSoftwareGroupActive();
    this.translate.getTranslation('menu.piperSoftware', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setPiperManagementActive() {
    this.urlAccessed.changeurl('/home/admin/Farm-Management');
    this.setPiperSoftwareGroupActive();
    this.translate.getTranslation('menu.PiperManagement', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setPiperConfigurationActive() {
    this.urlAccessed.changeurl('/home/admin/piper-configuration');
    this.setPiperSoftwareGroupActive();
    this.translate.getTranslation('menu.piperConfiguration', '').subscribe(response => {
      this.screenName = response;
    });
  }

  setViewReportsActive() {
    this.urlAccessed.changeurl('/home/reports/explore');
    this.setAnalysisReportActive();
    this.translate.getTranslation('menu.Report', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setScheduleActive() {
    this.urlAccessed.changeurl('/home/reports/explore');
    this.setAnalysisReportActive();
    this.translate.getTranslation('menu.Report', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setPiperReportsActive() {
    this.urlAccessed.changeurl('/home/reports/viewreports');
    this.setAnalysisReportActive();
    this.translate.getTranslation('menu.PiperReport', '').subscribe(response => {
      this.screenName = response;
    });
  }
  setCoccidiaReportsActive() {
    this.setAnalysisReportActive();
  }
  setExternalCoccidiaReportsActive() {
    this.setAnalysisReportActive();
  }
  setCoccidiaTimelinesActive() {
    this.setAnalysisReportActive();
  }
  setSalmonellaReportsActive() {
    this.setAnalysisReportActive();
  }
  setExternalSalmonellaReportsActive() {
    this.setAnalysisReportActive();
  }
  setMPNSalmonellaReportsActive() {
    this.setAnalysisReportActive();
  }
  setExternalMPNSalmonellaReportsActive() {
    this.setAnalysisReportActive();
  }
  setLocalDashboardReportsActive() {
    this.setAnalysisReportActive();
  }
  setCoccidiaValidationsActive() {
    this.setAnalysisReportActive();
  }
  setSitesLogReportsActive() {
    this.setAnalysisReportActive();
  }
  setUserProfileActive() {
    this.setUserProfileGroupActive();
    this.screenName = '';
  }

  setOpsGroupActive() {
    this.isHomeGroupActive = false;
    this.isAdminGroupActive = false;
    this.isMetaDataGroupActive = false;
    this.isOpsGroupActive = true;
  }
  showMobileMenu() {
    // this.mobile = false;
    this.isShowFullMenu = true;
    if (this.isRoleMGMTMenuApplied === false) {

      this.applyRoleMGMTOnMenu(true);
    }
  }
  hideMobileMenu() {
    // this.mobile = true;
    this.isShowFullMenu = false;
  }
  showFullMenu() {
    this.isShowFullMenu = true;
    if (this.isRoleMGMTMenuApplied === false) {

      this.applyRoleMGMTOnMenu(true);
    }

  }

  hideFullMenu() {
    if (!this.isfixed) {
      this.isShowFullMenu = false;
    }
  }

  fixMenu() {
    this.isfixed = !this.isfixed;
    this.account.menulocked = this.isfixed;
  }

  private applyRoleMGMTOnMenu(stopPropogation: boolean) {
    if (stopPropogation === true) {

      this.isRoleMGMTMenuApplied = true;
    }

    if (this.isMenuViewable(SCREEN_CODE.ManageReports) === true) {

      this.layoutPermissionVMLcl.roleMGMTReport = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTReport = false;

    }
    if (this.isMenuViewable(SCREEN_CODE.ScheduleManagement) === true) {

      this.layoutPermissionVMLcl.roleMGMTSchedule = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTSchedule = false;

    }

    if (this.isMenuViewable(SCREEN_CODE.ManageUser) === true) {

      this.layoutPermissionVMLcl.roleMGMTManageUsersMenu = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageUsersMenu = false;

    }

    if (this.isMenuViewable(SCREEN_CODE.ManageOrganization) === true) {

      this.layoutPermissionVMLcl.roleMGMTManageOrganMenu = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageOrganMenu = false;

    }

    if (this.isMenuViewable(SCREEN_CODE.ManageSite) === true) {

      this.layoutPermissionVMLcl.roleMGMTSite = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTSite = false;

    }


    if (this.isMenuViewable(SCREEN_CODE.ManageRole) === true) {
      this.layoutPermissionVMLcl.roleMGMTManageRole = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageRole = false;
    }
    if (this.isMenuViewable(SCREEN_CODE.ManageComplexCyclingConfig) === true) {
      this.layoutPermissionVMLcl.roleMGMTManageComplexCyclingConfig = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageComplexCyclingConfig = false;
    }

    if (this.isMenuViewable(SCREEN_CODE.ManageFlockRegistration) === true) {
      this.layoutPermissionVMLcl.roleMGMTManageFlockRegistration = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageFlockRegistration = false;
    }
    if (this.isMenuViewable(SCREEN_CODE.ManagePiper) === true) {
      this.layoutPermissionVMLcl.roleMGMTManagePiperScreen = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManagePiperScreen = false;
    }
    if (this.isMenuViewable(SCREEN_CODE.ManageUserAgreement) === true) {
      this.layoutPermissionVMLcl.roleMGMTManageUserAgreement = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageUserAgreement = false;
    }
    if (this.isMenuViewable(SCREEN_CODE.ManageBarcode) === true) {
      this.layoutPermissionVMLcl.roleMGMTManageBarcode = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageBarcode = false;
    }
    if (this.isMenuViewable(SCREEN_CODE.ManageReportRole) === true) {

      this.layoutPermissionVMLcl.roleMGMTManageReportRole = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageReportRole = false;

    }
    if (this.isMenuViewable(SCREEN_CODE.ManageReportConfg) === true) {

      this.layoutPermissionVMLcl.roleMGMTManageReportConfgtMenu = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageReportConfgtMenu = false;

    }


    if (this.isMenuViewable(SCREEN_CODE.ManageAccessRight) === true) {

      this.layoutPermissionVMLcl.roleMGMTManageAccessMenu = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageAccessMenu = false;

    }

    if (this.isMenuViewable(SCREEN_CODE.ManageAlert) === true) {
      this.layoutPermissionVMLcl.roleMGMTManageAlertMenu = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageAlertMenu = false;
    }

    if (this.isMenuViewable(SCREEN_CODE.ManageDataTemplate) === true) {
      this.layoutPermissionVMLcl.roleMGMTManageDataTemplateMenu = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageDataTemplateMenu = false;

    }


    if (this.isMenuViewable(SCREEN_CODE.ManageClientMapping) === true) {

      this.layoutPermissionVMLcl.roleMGMTManageClientDTMapping = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageClientDTMapping = false;

    }

    if (this.isMenuViewable(SCREEN_CODE.ManageContactUs) === true) {

      this.layoutPermissionVMLcl.roleMGMTManageContactUs = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageContactUs = false;

    }

    if (this.isMenuViewable(SCREEN_CODE.ManageHelpUs) === true) {

      this.layoutPermissionVMLcl.roleMGMTManageHelp = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManageHelp = false;

    }

    if (this.isMenuViewable(SCREEN_CODE.ManageReportAnalysisDashboar) === true) {

      this.layoutPermissionVMLcl.roleMGMTAnalysisDashboard = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTAnalysisDashboard = false;

    }

    if (this.isMenuViewable(SCREEN_CODE.ManageDataUpload) === true) {

      this.layoutPermissionVMLcl.roleMGMTDataUpload = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTDataUpload = false;

    }

    if (this.isMenuViewable(SCREEN_CODE.ManagePiperSoftware) === true) {

      this.layoutPermissionVMLcl.roleMGMTManagePIPERSoftware = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManagePIPERSoftware = false;

    }

    if (this.isMenuViewable(SCREEN_CODE.ManageHome) === true) {

      this.layoutPermissionVMLcl.roleMGMTHome = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTHome = false;

    }

    if (this.isMenuViewable(SCREEN_CODE.PiperConfiguration) === true) {

      this.layoutPermissionVMLcl.roleMGMTManagePiperConfig = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManagePiperConfig = false;
    }

    if (this.isMenuViewable(SCREEN_CODE.ManagePoultry) === true) {

      this.layoutPermissionVMLcl.roleMGMTManagePoultryMenu = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTManagePoultryMenu = false;
    }

    if (this.isMenuViewable(SCREEN_CODE.FarmManagement) === true) {

      this.layoutPermissionVMLcl.FarmManagement = true;
    } else {
      this.layoutPermissionVMLcl.FarmManagement = false;
    }
    if (this.isMenuViewable(SCREEN_CODE.UploadImage) === true) {

      this.layoutPermissionVMLcl.UploadImage = true;
    } else {
      this.layoutPermissionVMLcl.UploadImage = false;
    }
    if (this.isMenuViewable(SCREEN_CODE.CanopyManagement) === true) {

      this.layoutPermissionVMLcl.roleMGMTCanopy = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTCanopy = false;
    }
    if (this.isMenuViewable(SCREEN_CODE.PlantHeightManagement) === true) {

      this.layoutPermissionVMLcl.roleMGMTPlantHeight = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTPlantHeight = false;
    }
    if (this.isMenuViewable(SCREEN_CODE.CropPriceManagement) === true) {
      this.layoutPermissionVMLcl.roleMGMTCropsPrice = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTCropsPrice = false;
    }
    if (this.isMenuViewable(SCREEN_CODE.AgroChemicalsPriceManagement) === true) {
      this.layoutPermissionVMLcl.roleMGMTAgroChemicals = true;
    } else {
      this.layoutPermissionVMLcl.roleMGMTAgroChemicals = false;
    }

  }


  private isMenuViewable(screen: SCREEN_CODE) {

    if (this.account.accessRights === null || this.account.accessRights === undefined) {
      return false;

    }

    const accessRightsFiltered: Array<ScreenVPermission> = this.account.accessRights.filter
      (p => p.screenId === screen.valueOf());
    let ScreenVPermissionLcl: ScreenVPermission;

    if (accessRightsFiltered !== null && accessRightsFiltered.length > 0) {
      ScreenVPermissionLcl = accessRightsFiltered[0];

      if (screen == SCREEN_CODE.ManageReports && ScreenVPermissionLcl.isViewAllow === false) {
        return false;
      } else if (ScreenVPermissionLcl.isCreateAllow === false && ScreenVPermissionLcl.isUpdateAllow === false
        && ScreenVPermissionLcl.isViewAllow === false) {

        return false;
      } else if ((ScreenVPermissionLcl.isCreateAllow === true || ScreenVPermissionLcl.isUpdateAllow === true || ScreenVPermissionLcl.isViewAllow === true)) {
        return true;
      } else {

        return true;
      }
    }

  }

  setHeader(myURL) {
    this.account.unsetProfileStatus();
    if (myURL === '/home/admin/users') {
      this.setAdminViewUserActive();
      return;
    } else if (myURL.substring(0, 32) === Constants.salmonellaLogReport) {
      this.setSalmonellaReportsActive();
      this.urlAccessed.changeurl(Constants.salmonellaLogReport);
      this.screenNameService.changeScreenName(this.urlAccessed.param.getValue().report);
      return;
    } else if (myURL.substring(0, 30) === Constants.coccidiaLogReport) {
      this.setCoccidiaReportsActive();
      this.urlAccessed.changeurl(Constants.coccidiaLogReport);
      this.screenNameService.changeScreenName(this.urlAccessed.param.getValue().report);
      return;
    } else if (myURL.substring(0, 39) === Constants.ExternalCoccidiaLog) {
      this.setExternalCoccidiaReportsActive();
      this.urlAccessed.changeurl(Constants.ExternalCoccidiaLog);
      return;
    } else if (myURL.substring(0, 40) === Constants.coccidiaTimelineReport) {
      this.setCoccidiaTimelinesActive();
      this.urlAccessed.changeurl(Constants.coccidiaTimelineReport);
      this.screenNameService.changeScreenName(this.urlAccessed.param.getValue().report);
      return;
    } else if (myURL.substring(0, 31) === Constants.opgDashboardReport) {
      this.setCoccidiaValidationsActive();
      this.urlAccessed.changeurl(Constants.opgDashboardReport);
      return;
    } else if (myURL.substring(0, 39) === Constants.tableauReport) {
      this.setAnalysisReportActive();
      this.urlAccessed.changeurl(Constants.tableauReport);
      return;
    } else if (myURL.substring(0, 25) === Constants.mpnSalmonellaLogReport) {
      this.setMPNSalmonellaReportsActive();
      this.urlAccessed.changeurl(Constants.mpnSalmonellaLogReport);
      return;
    } else if (myURL.substring(0, 33) === Constants.Wireframe) {
      this.setLocalDashboardReportsActive();
      this.urlAccessed.changeurl(Constants.Wireframe);
      this.screenNameService.changeScreenName(this.urlAccessed.param.getValue().report);
      return;
    } else if (myURL.substring(0, 41) === Constants.ExternalsalmonellaLogReport) {
      this.setExternalSalmonellaReportsActive();
      this.urlAccessed.changeurl(Constants.ExternalsalmonellaLogReport);
      return;
    } else if (myURL.substring(0, 45) === Constants.ExternalmpnSalmonellaLogReport) {
      this.setExternalMPNSalmonellaReportsActive();
      this.urlAccessed.changeurl(Constants.ExternalmpnSalmonellaLogReport);
      return;
    } else if (myURL.substring(0, 27) === Constants.sitesLogReport) {
      this.setSitesLogReportsActive();
      this.urlAccessed.changeurl(Constants.sitesLogReport);
      this.screenNameService.changeScreenName(this.urlAccessed.param.getValue().report);
      return;
    } else if (myURL === '/home/admin/organizations') {
      this.setAdminViewOrgActive();
      return;
    } else if (myURL === '/home/admin/roles') {
      this.setAdminManageRolesActive();
      return;
    } else if (myURL === '/home/admin/canopy') {
      this.setCanopyManageActive();
      return;
    } else if (myURL === '/home/admin/plant-height') {
      this.setPlantHeightManageActive();
      return;
    } else if (myURL === '/home/admin/agro-chemicals-price') {
      this.setAgroChemicalsPriceManageActive();
      return;
    }
    else if (myURL === '/home/admin/alerts') {
      this.setAdminManageAlertsActive();
      return;
    } else if (myURL === '/home/admin/reportconfg') {
      this.setAdminManageReportConfgActive();
      return;
    } else if (myURL === '/home/admin/reportroles') {
      this.setAdminManageReportRolesActive();
      return;
    } else if (myURL === '/home/admin/complex-cycling-config') {
      this.setAdminManageComplexCyclingConfigActive();
      return;
    } else if (myURL === '/home/admin/flock-registration') {
      this.setAdminManageFlockRegistation();
      return;
    } else if (myURL === '/home/admin/piper') {
      this.setPiperManagementActive();
      return;
    } else if (myURL === '/home/admin/user-agreement') {
      this.setAdminManageLicenseActive();
      return;
    } else if (myURL === '/home/admin/barcode-generation') {
      this.setAdminManageBarcodeActive();
      return;
    } else if (myURL === '/home/metadata/dataformat') {
      this.setDataUploadFormatActive();
      return;
    } else if (myURL == '/home/metadata/poultry') {
      this.setPoultryMenagementActive();
      return;
    }
    else if (myURL === '/home/client/dataupload') {
      this.setClientDataUploadActive();
      return;
    } else if (myURL === '/home/reports/analysisreports') {
      this.isReportDisplayed = false;
      this.setAnalysisReportsActive();
      return;
    } else if (myURL === '/home/reports/viewreports') {
      this.isReportDisplayed = true;
      this.setPiperReportsActive();
      return;
    } else if (myURL === '/home/admin/contactus') {
      this.setContactUsActive();
      return;
    } else if (myURL === '/home/admin/help') {
      this.setHelpActive();
      return;
    } else if (myURL === '/home/reports/explore') {
      this.setViewReportsActive();
      return;
    } else if (myURL === '/home/admin/profile') {
      this.setUserProfileActive();
      return;
    } else if (myURL === '/home/admin/piper-software-management') {
      this.setPiperSoftwareManagementActive();
      return;
    } else if (myURL === '/home/admin/piper-configuration') {
      this.setPiperConfigurationActive();
      return;
    }
    else if (myURL === '/home') {
      this.setHomeGroupActive();
      return;
    }
  }

  routeToProfileSettings() {
    this.setUserProfileActive();
    this.account.setProfileStatus();
  }

  isUserScreen() {
    if (!this.account.getProfileStatus()) {
      this.setHeader(this.lastUrl);
    }
    return !this.account.getProfileStatus();
  }
  isHomeScreen() {
    let retVal = true;
    this.translate.getTranslation('menu.Home', '').subscribe(response => {
      if (this.screenName == response) {
        retVal = false;
      }
    });
    return retVal;
  }
  ExitProfileMngmtScreen() {
    this.setHeader(this.lastUrl);
    this.account.unsetProfileStatus();
  }

  ngOnDestroy() {
    this.closeSubscription.unsubscribe();
    this.closeSubscription1.unsubscribe();
  }

  // resetForm() {
  //   this.lngForm = this.fb.group({
  //     languageItems: []
  //   });
  // }

}
