import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { API_CALLEVENTGROUP_CODE, STATUS_CODE } from 'src/app/shared/helper/Enums';
import { CanopyCaverageService } from 'src/app/shared/services/common/canopy-caverage.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AccountService } from 'src/app/shared/services/common/account.service';

interface CanopyData {
    values: { numberOfDays: number; canopyPercentage: number, id: number }[];
}
@Component({
    selector: 'create-canopy-coverage',
    templateUrl: 'create-canopy.component.html',
    styleUrls: ['create-canopy.component.scss']
})

export class CreatecanopyComponent extends BaseFormComponent implements OnInit {
    canopyData: CanopyData = { values: [] };
    cropCatalogId: number;
    canopyCoverageList: Array<any>;
    isUpdated: boolean = false;
    days = [30,60,90,120,150,180,210,240,260,300];
    constructor(
        public popupController: PopupControllerService,
        protected translationPipe: TranslationConfigService,
        private formBuilder: UntypedFormBuilder,
        protected notification: NotificationServiceService,
        protected accountService: AccountService,
        protected canopySerice: CanopyCaverageService) {
        super(translationPipe, popupController, notification, accountService);

        this.canopyData.values = this.days.map(numberOfDays => ({ numberOfDays, canopyPercentage: null,lookupId : null,cropCatalogId :null, id : null }));

    }

    cropData: any;
    selectOptionData: any;
    cropDetail: UntypedFormGroup;

    ngOnInit() {
        this.getSelectCropData()
        this.getAllCanopyData()
        this.cropDetail = this.formBuilder.group({
            crop: [null, Validators.required],
        });
    }

    getSelectCropData() {
        this.canopySerice.getCropSelectData().subscribe((responseData) => {

            this.selectOptionData = responseData.dataObject;
            this.cropData = this.selectOptionData.lstcropType;

        });
    }

    getAllCanopyData() {
        this.canopySerice.getAllCanopyCoverageData(null).subscribe((responseData) => {
            this.canopyCoverageList = responseData.dataObject.canopyCoverageList || []
        });
    }

    checkInputValue(entry: any) {
        if (entry.canopyPercentage === 0) {
            entry.canopyPercentage = null;
        }
        if (entry.canopyPercentage < 0) {
            entry.canopyPercentage = 0;
        }
    }
    onChangeCropId(event) {
        
    }

    onsubmit() {
        
        if (this.cropDetail.invalid) {
            this.cropDetail.markAllAsTouched();
            return
        }
        if(this.canopyData.values.some(value => value.canopyPercentage < 0)){
            this.ProcessSaveFail("Input Values Cannot be Negative");
            return
        }
        if (this.isUpdated) {
            const data = this.canopyData.values.filter(item=>(item.canopyPercentage>0) || (item.id!==0));
            const filteredData = data.map(item=>({...item, cropCatalogId: this.cropDetail.controls.crop.value}))
            this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
            this.canopySerice.updateCanopyCoverage(filteredData).subscribe((response) => {
                if (response.statusCode === STATUS_CODE.SUCCESS) {

                    this.ProcessSaveSuccess(response);
                    this.popupController.updateResult(response.dataObject)

                }
                if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {

                    this.ProcessSaveFail(response);

                }

                this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
            })
        } else {
            this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
            const data = this.canopyData.values.map(month => ({ ...month, canopyPercentage: month.canopyPercentage, cropCatalogId: this.cropDetail.controls.crop.value }))

            const filteredData = data.filter(item=>item.canopyPercentage>0)
            this.canopySerice.addCanopyCoverage(filteredData).subscribe((response) => {

                if (response.statusCode === STATUS_CODE.SUCCESS) {

                    this.ProcessSaveSuccess(response);
                    this.popupController.updateResult(response.dataObject);

                }
                if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {

                    this.ProcessSaveFail(response);

                }

                this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
            });
        }

    }
    disableScroll(event: WheelEvent): void {
        event.preventDefault();
    }
}