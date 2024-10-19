

export class imageCoordinate{
    lat:number;
    lng:number;
}

export class ImageModel {
    imageCoordinate:imageCoordinate;
    imageName:string;
    folderS3Bucket:string;
    farmId?:number;
    uploadDateTime:Date;
    uploadImages?:number;
    drone:string;
    camera:string;
    flightDate:Date;
    flightHeight:number;
    imagesType:number;
    base64textString: string;
    KeyName: string;
    ImageMetadata:string;
}