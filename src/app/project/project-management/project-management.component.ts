import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { API_CALLEVENTGROUP_CODE, ReportCode, SCREEN_CODE, STATUS_CODE } from 'src/app/shared/helper/Enums';
import { RequestVModel } from 'src/app/shared/models/RequestV.Model.ts';
import { LoadingNotificationService } from 'src/app/shared/services/common/loading-notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { FarmService } from 'src/app/shared/services/farm.service';
import { CreateProjectComponent } from '../create-project/create-project.component';
import * as mapboxgl from 'mapbox-gl';
import { SessionModel } from 'src/app/shared/models/Session.Model';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { FarmFilterModel } from 'src/app/shared/models/Project/FarmFilter.Model';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';


interface farm {
  id: number,
  farmName: string,
  ownerName: string,
  ownerPhoneNo: Array<string>,
  ownerEmail: string,
  province: string,
  district: string,
  tehsil: string,
  town: string,
  farmArea: string,
  longitude: number,
  latitude: number
}

interface farm {
  farmId: any,
  lat: any,
  lng: any
}

@Component({
  selector: 'app-farm-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.scss']
})
export class ProjectManagementComponent extends BaseFormComponent implements OnInit {
onaddFeature() {
throw new Error('Method not implemented.');
}
  popupList: any;

  showSortingFilter: boolean = false;
  header: string;
  isReportWindow = false
  lstReportGrpWithReports = []
  farmData = null;
  showModal = false;
  geojsonData: any; 
  isLoading: boolean = false;
  selectedImages:   string[] = [];
  constructor(private farmService: FarmService, protected translationPipe: TranslationConfigService, protected popupController: PopupControllerService,
  
    protected notification: NotificationServiceService,
    protected loadingNotification: LoadingNotificationService,
    protected accountService: AccountService,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private manageReportService: ManageReportService,
    protected router: Router) {
      super(
        translationPipe,
        popupController,
        notification,
        accountService,

    );
  }
  screen = SCREEN_CODE.FarmManagement;
  screen1 = SCREEN_CODE.EventManagement;
  screen2 = SCREEN_CODE.Explorer;
  screen3 = SCREEN_CODE.Report;
  screen4 = SCREEN_CODE.UploadGeoJson;
  mapbox: mapboxgl.Map = null;
  style = 'mapbox://styles/mapbox/streets-v11';
  search: string;
  SortName: string = "";
  sort: string = "desc";
  isfilter: any = false;
  lstFarms: any = false;
  searchFarm: farm[];
  tmpFamrs: farm[];
  selectedButton = {};
  showLstFram: boolean = false;
  isOpenPinLabel: boolean = false;
  session: SessionModel = this.getSession();
  lat: any;
  lng: any;
  NUM_Farms: any;
  clickedbutton: any;
  closeSubscription: any;
  selectFarm: any = null;
  cnfrmPopup: boolean = false;
  Unprocessed: boolean[] = [];
  InProcess: boolean[] = [];
  popupText: any;
  listPopup: any = [];
  popupText1: string;
  crntFarmId: any = null;
  crntFarmLat: any;
  crntFarmLng: any;
  popupFor: any = null;
  deleteId: any = null;
  processId: any = null;
  showEditDeletePopup: any = null;
  showPopup = false;
  showRegionFilter = false;
  lstTehsil = [];
  lstDistrict = [];
  filterfarmNamelist = [];
  filterfarmIdlist = [];
  selectedFarm : any;


  ngOnInit() {
    // MEMO: For Role Security
    debugger;
    

    this.showLoader();
    this.ongetALLFarms(null);
    this.closeSubscription = this.popupController.getResultOnClose().subscribe((result: any) => {

      if (result !== null && result !== false) {

        if (result.message === "create") {
          this.ongetALLFarms(null);

          //
          var farm = result.dataObject.farmName;
          this.crntFarmId = result.dataObject.id;
          this.crntFarmLat = result.dataObject.latitude;
          this.crntFarmLng = result.dataObject.longitude;

          this.popupController.updateResult(null);
          this.popupController.closePopup();
          this.popupText = "Farm is created successfully..."
          this.popupText1 = "Do you want to proceed with adding farm features for '" + farm + "' ?";
          this.popupFor = "addFeature";
          this.cnfrmPopup = true;

        }
        if (result.message === "update") {
          this.ongetALLFarms(null);
          this.popupController.updateResult(null);
          this.popupController.closePopup();
        }
      }
    });

  }

 
  getSession() {
    return JSON.parse(localStorage.getItem('session'));
  }
  onshowRegionFilter() {
    this.showRegionFilter = true;
  }
  onShowSortingFilter() {
    this.showSortingFilter = true;
  }
  
  onCloseEditPopup(event) {
    //
    this.showEditDeletePopup = 1000000;
  }
  onShowEditPopup(id) {
    debugger;
    this.showEditDeletePopup = id;
    this.showPopup = true;
  }


  ongetALLFarms(data: any) {

    let model;
    if (data != null) {
      model = data;
    } else {
      model = { Province: null, District: null, Tehsil: null, orgnId: null };
    }
    this.farmService.getAllFarms(model)
      .subscribe((responseData) => {

        this.lstFarms = responseData.dataObject;
        debugger;
        this.tmpFamrs = this.lstFarms;
        for (var i = 0; i < this.lstFarms.length; i++) {
          this.filterfarmNamelist.push(this.lstFarms[i].projectName);
          this.filterfarmIdlist.push(this.lstFarms[i].projectId);
        }
        if (responseData.dataObject.length <= 0) {
          this.hideLoader(); 
          return
        }
        this.hideLoader();     

      });
  }
  oncnfrmPopup() {
    this.cnfrmPopup = true;
  }

  options = this.filterfarmNamelist;
  searchedOptions = [];

  onSeachDropdownValue($event) {
    debugger;
    this.lstFarms = this.tmpFamrs;
    const value = $event.target.value;
    this.searchedOptions = this.options.filter(option => option.toLowerCase().includes(value.toLowerCase()));
    if (this.searchedOptions.length > 0) {
      this.isfilter = true;

      this.searchFarm = this.lstFarms.filter((obj) => {
        return obj.projectName.toLowerCase().includes(value.toLowerCase());
      });
      this.lstFarms = this.searchFarm
      this.popupList = this.lstFarms.slice();
      if (this.lstFarms.length != 0) {
        this.selectFarm = this.lstFarms[0].projectId
      }
    }

  }

  onSelectDropdownValue(option) {
    this.lstFarms = this.searchFarm
    this.popupList = this.lstFarms.slice();
    if (this.lstFarms.length != 0) {
      this.selectFarm = this.lstFarms[0].id
    }
  }


  CreateFarm() {

    let header = 'Create Project';

    this.popupController.parameters = null;
    this.popupController.updateModalSize('lg');
    this.popupController.popupHeader = header;
    this.popupController.updateComponent(CreateProjectComponent);

  }
  
  
  oncloseRegionFilter() {
    this.showRegionFilter = false;
  }
  oncloseSortingFilter() {
    this.showSortingFilter = false;
  }
  onMapReady(map: any) {

    map.setMapTypeId('satellite');
  }
  onclosePopup() {
    this.cnfrmPopup = false;
  }
  ngOnDestroy() {
    this.closeSubscription.unsubscribe();
  }
  onDeleteFarm(id: any, FarmName) {
    debugger;
    this.showEditDeletePopup = 100000;
    this.deleteId = id;
    this.popupText1 = "";
    this.popupText = "Are you sure you want to delete " + FarmName + " along with its details?"

    this.popupFor = "Delete";
    this.cnfrmPopup = true;

  }

  setFarmEventsPage(Farm: any) {


    this.router.navigateByUrl('/home/farm/farm-event', { state: { list: Farm } });

  }

  onEditFarm(farm: any) {
    debugger;
    const requestPayload: RequestVModel = {
      Id: farm.projectId
    }
    this.showLoader();
    this.farmService.GetProjectDetail(requestPayload).subscribe((response) => {
      console.log('Farm created successfully!');
      this.showEditDeletePopup = 1000000;
    let header = 'Update Project';

    let updateFarm = response.dataObject;
    this.popupController.parameters = updateFarm;
    this.popupController.updateModalSize('lg');
    this.popupController.popupHeader = header;
    this.popupController.updateComponent(CreateProjectComponent);
    this.hideLoader();
    });
    
  }
  ondelete() {
    this.cnfrmPopup = false;
    const farm: RequestVModel = {
      Id: this.deleteId
    }
    this.showLoader();
    this.farmService.deleteFarm(farm)
      .subscribe((responseData) => {

        if (responseData.statusCode === STATUS_CODE.SUCCESS) {

          this.loadingNotification.ProcessSaveSuccess("Farm is Deleted");
        }
        if (responseData.statusCode === STATUS_CODE.CUSTOM_ERROR) {
          this.hideLoader()
        }
       this.hideLoader();
      });
  }
  onshowFarmonMap(lat: any, lng: any, id: any, index) {
    debugger;
    this.selectFarm = id;
    this.selectedFarm = null;
    this.selectedImages = [];
    const farm: RequestVModel = {
      Id: id
    }
    this.loadingNotification.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.farmService.GetProjectDetail(farm)
      .subscribe((responseData) => {

        if (responseData.statusCode === STATUS_CODE.SUCCESS) {

          this.selectedFarm = responseData.dataObject;
          this.selectedFarm[0].projectImagesList.forEach((image, index) => {
            this.selectedImages.push(image.image);
        
        });
        }
        if (responseData.statusCode === STATUS_CODE.CUSTOM_ERROR) {
          this.loadingNotification.ProcessSaveFail("Error Occured");
        }
        this.loadingNotification.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT)
      });
   
  }
  showLoader() {
    this.isLoading = true;
  }

  hideLoader() {
    this.isLoading = false;
  }
}
