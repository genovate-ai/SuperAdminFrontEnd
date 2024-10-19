export class ErrorModel{
    errorId:number;
    errorName:string  ;
    errorRow:string;
    dataFormColName: string;
    showColNameError = 0;
    dataFormColTypeId: string;
    showColTypeError = 0;
    dataFormDfltValue: string;
    showDfltValueError = 0;
    dataFormColLength: string;
    showCollengthError = 0;
    dataFormIsMandatory: string;
    showIsMandatoryError = 0;
    minValue : number;
    maxValue : number;
    stringValue: string;
    minValueError = 0;
    maxValueError = 0;
    stringValueError = 0;
}