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
  host: {
  '(document:click)': 'onClick($event)',
  },
  selector: 'app-custom-export-file-xlsx',
  templateUrl: './custom-export-file-xlsx.component.html',
  styleUrls: ['./custom-export-file-xlsx.component.scss']
})
export class CustomExportFileComponentXLSX extends BaseFormComponent implements OnInit {

  @Output() generateMetadataTemplate = new EventEmitter();
  @Output() generateCSV = new EventEmitter();
  @Output() generateAuditCSV = new EventEmitter();
  @Output() exportXLSX = new EventEmitter();
  @ViewChild(CustomExportFileComponent, { static: true } ) private _child: CustomExportFileComponent;
  @Input() tableId = 'table';
  @Input() fileName = 'download';
  @Input() jsonFormat = false;
  @Input() configID = -1;
  @Input() chartFilter:boolean = false;
  @Input() auditTrail:boolean = false;
  @Input() latestVersion:boolean = false;
  @Input() report = 'coccidia';
  @Input() showTemplate:boolean = true;
  showList = false;
  file_name_metadata = "hello";
  showDataformatList = false;
  lstDataFormatDetailsVM: Array<DataFormatDetails> = [];
  dataFormats: any;
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
    // this.manageDataFormatService
    //   .GetDataFormatsByID(+this.configID)
    //   .subscribe(response => {
    //     this.dataFormats = response.dataObject;

    //   });
  }
  manageList(){
    this.showList = !this.showList;
    if(!this.showList){
      this.showDataformatList = false;
    }
  }
  manageDataformatList(){
    this.showDataformatList = !this.showDataformatList;
  }
  exportFile(dataFormId, dataFormName) {

    if (this.jsonFormat) {
      this.exportXLSX.emit(true);
    } else {
      const d = new Date();
      this.file_name_metadata = dataFormName;
    }
    this.objectToXLSX(this.tableId, dataFormId);

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

  private objectToXLSX(table, dataFormId) {
    //
    // if(this.generateMetadataTemplate.observers.length>0 && this.chartFilter == false){
    //
      this.generateMetadataTemplate.emit();
    // }
    // else {

    // this.showLoader(SCREEN_CODE.ManageReports, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
    // this.manageDataFormatService
    //   .GetDataFormatMetaDataByID(dataFormId)
    //   .subscribe(response => {
    //     this.lstDataFormatDetailsVM = response.dataObject.lstDataFormatDetailsVM;
    //     this.hideLoader(SCREEN_CODE.ManageReports, API_CALLEVENTGROUP_CODE.GRID_SELECTION_EVENT);
    //
    //     let xlsxDataFormat: Array<Array<string>> = [];
    //     const rows = document.querySelectorAll(`#${table} tr`);
    //     // Insert Header of DataFormat
    //     const header: Array<string> = [];
    //     const colsToExport: Array<string> = [];
    //     const colsToExportXLSX: Array<string> = [];
    //     for (let i = 0; i < this.lstDataFormatDetailsVM.length; i++) {
    //       header.push(this.lstDataFormatDetailsVM[i].dataFormColName);
    //       if (this.lstDataFormatDetailsVM[i].exportMapperColName) {
    //
    //         if(this.lstDataFormatDetailsVM[i].exportMapperColName.toLocaleLowerCase() === 'lab sample id' && this.report == 'coccidia') {
    //           this.lstDataFormatDetailsVM[i].exportMapperColName = 'SAMPLE ID';
    //         }
    //         colsToExport.push(this.lstDataFormatDetailsVM[i].exportMapperColName);
    //         colsToExportXLSX.push(this.lstDataFormatDetailsVM[i].dataFormColName);
    //       }
    //     }
    //     xlsxDataFormat.push(header);
    //     const colsToExportIndexes: Array<number> = [];
    //     // getting Index Numbers of columns to be saved
    //     const cols = rows[0].querySelectorAll('td, th');
    //     for (let j = 0; j < colsToExport.length; j++) {
    //       for (let i = 0; i < cols.length; i++) {
    //         let arr = this.getText(cols[i]);
    //         arr = arr.slice(1, arr.length - 1);
    //         if (colsToExport[j] == arr) {
    //           colsToExportIndexes.push(i);
    //           break;
    //         }
    //       }
    //     }

    //     const indexToPutData: Array<number> = [];
    //     // getting Index Numbers of columns on which data is to be saved
    //     for (let i = 0; i < colsToExportXLSX.length; i++) {
    //       for (let j = 0; j < header.length; j++) {
    //         if (colsToExportXLSX[i] == header[j]) {
    //           indexToPutData.push(j);
    //           break;
    //         }
    //       }
    //     }

    //     // tslint:disable-next-line: prefer-for-ofx
    //     for (let i = 1; i < rows.length; i++) {
    //       const row: Array<string> = [];
    //       const cols = rows[i].querySelectorAll('td, th');

    //       for (let k = 0; k < colsToExportIndexes.length; k++) {
    //         let arr = this.getText(cols[colsToExportIndexes[k]]);
    //         row[indexToPutData[k]] = arr.slice(1, arr.length - 1);
    //       }
    //       xlsxDataFormat.push(row);
    //     }

    //     this.downloadXLSXFile(xlsxDataFormat, `${this.file_name_metadata}`);
    //   });
    // }
  }
  exportCSV(){

    // if(this.generateCSV.observers.length >0 && this.chartFilter == false){

      this.generateCSV.emit();
    // }
    // else{
    //   this._child.exportFile();
    // }


  }
  exportAuditCSV(){
    this.generateAuditCSV.emit();
  }
  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)){
      this.showList = false;
      this.showDataformatList = false;
    }
   }
}
