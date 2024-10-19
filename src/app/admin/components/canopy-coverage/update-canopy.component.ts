import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { API_CALLEVENTGROUP_CODE, STATUS_CODE } from 'src/app/shared/helper/Enums';
import { CanopyCaverageService } from 'src/app/shared/services/common/canopy-caverage.service';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { BaseFormComponent } from 'src/app/shared/components/base-components/base-form.component';
import { NotificationServiceService } from 'src/app/shared/services/common/notification.service';
import { AccountService } from 'src/app/shared/services/common/account.service';

interface CanopyData {
    values: { id?: number, cropCatalogId: number, lookupId: number; canopyPercentage: number }[];
}

@Component({
    selector: 'update-canopy',
    templateUrl: 'create-canopy.component.html',
    styleUrls: ['create-canopy.component.scss']
})

export class UpdateCanopyComponent extends BaseFormComponent implements OnInit {
    canopyData: CanopyData = { values: [] };
    cropCatalogId: number;
    constructor(
        public popupController: PopupControllerService,
        protected translationPipe: TranslationConfigService,
        private formBuilder: UntypedFormBuilder,
        protected notification: NotificationServiceService,
        protected accountService: AccountService,
        private route: ActivatedRoute,
        protected canopySerice: CanopyCaverageService) {
        super(translationPipe, popupController, notification, accountService);
    }

    cropData: any;
    selectOptionData: any;
    cropDetail: UntypedFormGroup;
    cropId: any

    ngOnInit() {
        
        this.getSelectCropData()
        this.cropDetail = this.formBuilder.group({
            crop: [null, Validators.required],
        });
        if (this.route.snapshot.paramMap.get('id')) {
            this.cropId = this.route.snapshot.paramMap.get('id');
        } else {
            this.cropId = this.popupController.getParams() as string;
        }

    }

    checkInputValue(entry: any) {
        if (entry.canopyPercentage < 0) {
            entry.canopyPercentage = 0;
        }
        entry.canopyPercentage = entry.canopyPercentage
    }
    getSelectCropData() {
        this.canopySerice.getCropSelectData().subscribe((responseData) => {

            this.selectOptionData = responseData.dataObject;
            this.cropData = this.selectOptionData.lstcropType;

        });
    }
    onChangeCropId(event) {
        
    }

    onsubmit() {

        
        if (this.cropDetail.invalid) {
            this.cropDetail.markAllAsTouched();
            return
        }
        const data = this.canopyData.values.filter(item=>(item.canopyPercentage>0) || (item.id!==0));
        const filteredData = data.map(item=>({...item, cropCatalogId: this.cropDetail.controls.crop.value}))
        this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
        this.canopySerice.updateCanopyCoverage(filteredData).subscribe((response) => {
            if (response.statusCode === STATUS_CODE.SUCCESS) {

                this.ProcessSaveSuccess(response);
                this.popupController.updateResult(response.dataObject);

            }
            if (response.statusCode === STATUS_CODE.CUSTOM_ERROR) {

                this.ProcessSaveFail(response);

            }

            this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.SAVE_EDIT_EVENT);
        })
        
    }
    disableScroll(event: WheelEvent): void {
        event.preventDefault();
      }
}