import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { STATUS_CODE } from 'src/app/shared/helper/Enums';
import { AlertModel, AlertType, HeaderType } from 'src/app/shared/models/Alert.Model';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { ShareReportFieldsService } from 'src/app/shared/services/common/share-report-fields.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { ManageReportService } from 'src/app/shared/services/manage-report-services/manage-report.service';

@Component({
  selector: 'app-admin-user-preference-fields',
  templateUrl: './admin-user-preference-fields.component.html',
  styleUrls: ['./admin-user-preference-fields.component.scss']
})
export class AdminUserPreferenceFieldsComponent implements OnInit {

  reportyId: any;
  lstDefault = [];
  lstUser = [];
  lstReportFields = [];
  optionsSort: any;
  boolParam = false;

  @Output() shareData = new EventEmitter<any[]>();



  constructor(
    private notificationService: NotificationServiceService,
    private shareReportFields: ShareReportFieldsService,
    private translationService: TranslationConfigService,
    private popupController: PopupControllerService,
    private route: ActivatedRoute,
    private manageReportService: ManageReportService) { }

  ngOnInit() {

    this.popupController.setConfirmationV2(true);
    this.notificationService.loading = true;
    if (this.route.snapshot.paramMap.get('id')) {
      this.reportyId = this.route.snapshot.paramMap.get('id');
      // this.manageReportService.getReportFieldsOfUser(+this.reportyId).subscribe(response => {
      //   this.lstReportFields = response.dataObject;
      //   this.notificationService.loading = false;
      // });
    } else {
      let obj: any = this.popupController.getParams();
      this.reportyId = obj.reportTypeId;
      this.lstDefault = obj.lstDefault;
      if(obj.boolParam) {
        this.boolParam = obj.boolParam;
      }
      // this.lstReportFields = obj.lstUser;

    }

    this.initializeOptionsSort();

    this.manageReportService.getFieldReportAccessAdminUser(+this.reportyId, this.boolParam).subscribe(response => {
      this.lstReportFields = response.dataObject;
      this.notificationService.loading = false;
    });

  }

  saveFieldsOfUsers() {

    this.lstReportFields.forEach((element,i) => {
      element.fieldOrder = (i + 1);
    });

    this.popupController.isSafeToClose = true;
    this.notificationService.loading = true;
    this.manageReportService.saveReportFieldsOfAdminUser(this.lstReportFields).subscribe(response => {
      if (response.statusCode === STATUS_CODE.SUCCESS) {
        let str = this.translationService.getTraslatedValue("reportRole","adminColumnOrder");
        const alert: AlertModel = { type: AlertType.SUCCESS, message: str, header: HeaderType.SUCCESS };
        this.notificationService.showNotification(alert);

      }
      if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {

        const alertEr: AlertModel = { type: AlertType.DANGER, message: response.message, header: HeaderType.ERROR };
        this.notificationService.showNotification(alertEr);

      }
      this.notificationService.loading = false;
      this.shareReportFields.setReportFieldsArr(response.dataObject);
      // this.popupController.updateParams(this.lstReportFields);
      // this.shareData.emit(response.dataObject);
      this.popupController.closePopup();
    });

  }

  onFieldSelectionChange(event, i) {
    this.lstReportFields[i].isViewAllow = event.target.checked;
    this.popupController.isSafeToClose = false;
  }

  initializeOptionsSort() {
    this.optionsSort = {
      handle: '.drag-handle',
      group: {
        name: 'userReportFields',
        revertClone: true,
      },
      fallbackOnBody: true,
      swapThreshold: 1,
      disabled: false,
      animation: 150,
      onUpdate: (evt) => {

        this.popupController.isSafeToClose = false;
        this.lstReportFields[evt.oldIndex].fieldOrder = evt.newIndex;


      },
    };

  }

  resetToDefault() {

    this.popupController.isSafeToClose = false;
    let tempArr = this.lstDefault.slice();
    tempArr.forEach(o => {
      this.lstReportFields.forEach(o2 => {
        if(o.fieldName.trim() === o2.fieldName.trim()) {
          o.source = o2.source;
          o.screenId = o2.screenId;
        }
      })
    });
    this.lstReportFields = tempArr;
    // this.lstReportFields = this.lstDefault.slice();
  }

  ngOnDestroy() {
    this.popupController.setConfirmationV2(false);
  }

}

