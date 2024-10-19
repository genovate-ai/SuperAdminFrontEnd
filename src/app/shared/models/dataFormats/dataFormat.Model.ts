import {DataFormatDetails} from "./dataFormatDetails.Model"

export class DataFormat {
    dataFormName: string;
    dataFormDesc: string;
    isActive:number;
    createdOn: string;
    dataformId:number;
    lstDataFormatDetailsVM: Array <DataFormatDetails> = [];
}