import { Time } from '@angular/common'
import { ReportDataM } from './ReportData.Modal';
import { ReportAgregatedDataM } from './ReportAgregatedData.Modal';

export class ReportDataVM {

    lstReportData: Array<ReportDataM> = [];
    lstReportAgregatedData: Array<ReportAgregatedDataM> = [];
    lstChartData:Array<any>=[];
    lstInstrumentId: Array<any> = [];
    lstCartridgeId: Array<any> = [];
    lstPathogen: Array<any> = [];
    lstSampleId: Array<any> = [];
    lstLaneNum: Array<any> = [];
    lstVersion: Array<any> = [];
    lstCountOutcome: Array<any> = [];
    scanDateTime ?:any = '';
    lstSiteId: Array<any> = [];
    lstSampleMatrix: Array<any> = [];
    lstCutomerSampleId: Array<any> = [];
    lstMetadataRecieved: Array<any> = [];
    lstKitLot: Array<any> = [];
    lstMPNStatus: Array<any> = [];
    lstUserName: Array<any> = [];


}
