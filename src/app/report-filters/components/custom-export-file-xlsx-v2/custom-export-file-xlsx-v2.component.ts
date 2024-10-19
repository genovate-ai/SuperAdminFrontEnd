import { Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { SCREEN_CODE, API_CALLEVENTGROUP_CODE } from 'src/app/shared/helper/Enums';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { DataFormatDetails } from 'src/app/shared/models/dataFormats/dataFormatDetails.Model';
import { CustomExportFileComponent } from '../custom-export-file/custom-export-file.component';


@Component({
  selector: 'app-custom-export-file-xlsx-v2',
  templateUrl: './custom-export-file-xlsx-v2.component.html',
  styleUrls: ['./custom-export-file-xlsx-v2.component.scss']
})
export class CustomExportFileComponentXLSXv2 extends BaseFormComponent implements OnInit {

  @Output() generateMetadataTemplate = new EventEmitter();
  @Output() generateCSV = new EventEmitter();
  @Output() generateAuditCSV = new EventEmitter();
  @Output() exportXLSX = new EventEmitter();
  @ViewChild(CustomExportFileComponent, { static: true }) private _child: CustomExportFileComponent;
  @Input() tableId = 'table';
  @Input() fileName = 'download';
  @Input() jsonFormat = false;
  @Input() configID = 17;
  @Input() chartFilter: boolean = false;
  @Input() auditTrail: boolean = false;
  @Input() template: boolean = true;
  @Input() latestVersion: boolean = false;
  @Input() report = 'coccidia';
  @Input() showTemplate: boolean = true;
  showList = false;
  file_name_metadata = "hello";
  showDataformatList = false;
  lstDataFormatDetailsVM: Array<DataFormatDetails> = [];
  dataFormats: any = [];
  lengthDataformat: any;
  constructor(
    private _eref: ElementRef,
    protected translationPipe: TranslationConfigService,
    protected popupController: PopupControllerService,
    protected notification: NotificationServiceService,
    protected accountService: AccountService) {
    super(translationPipe, popupController, notification, accountService);
  }

  ngOnInit() {
    // if (this.template) {
    //   this.manageDataFormatService
    //     .GetDataFormatMetaDataByID(+this.configID)
    //     .subscribe(response => {
    //       this.dataFormats = response.dataObject;
    //     });
    // } else {
      this.dataFormats = [];
    // }
  }
  manageList() {
    this.showList = !this.showList;
    if (!this.showList) {
      this.showDataformatList = false;
    }
  }
  manageDataformatList() {
    this.showDataformatList = !this.showDataformatList;
  }
  exportFile(dataFormId, dataFormName) {
    this.showList = false;
    this.showDataformatList = false;
    if (this.jsonFormat) {
      this.exportXLSX.emit(true);
    } else {
      const d = new Date();
      this.file_name_metadata = dataFormName;
    }
    this.objectToXLSX(this.dataFormats);

  }

  getText(col) {
    const escaped = ('' + col.innerText).replace(/"/g, '\\"');
    return `"${escaped}"`;
  }

  private downloadXLSXFile(data, fileName) {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, fileName + '.xlsx');
  }

  private objectToXLSX(dataFormats) {
    this.showList = false;
    this.showDataformatList = false;
    this.generateMetadataTemplate.emit(dataFormats);

  }
  exportCSV() {

    this.showList = false;
    this.showDataformatList = false;
    this.generateCSV.emit();


  }
  exportAuditCSV() {
    this.generateAuditCSV.emit();
    this.showList = false;
    this.showDataformatList = false;
  }
  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.showList = false;
      this.showDataformatList = false;
    }
  }
}

