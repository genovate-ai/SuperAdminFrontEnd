import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SCREEN_CODE } from '../../helper/Enums';
import { AccountService } from '../../services/common/account.service';
import { LoadingNotificationService } from '../../services/common/loading-notification.service';
import { NotificationServiceService } from '../../services/common/notification.service';
import { PopupControllerService } from '../../services/common/popup-controller.service';
import { TranslationConfigService } from '../../services/common/translation-config.service';
import { BaseFormComponent } from '../base-components/base-form.component';

@Component({
  selector: 'app-viewedit-popup',
  templateUrl: './viewedit-popup.component.html',
  styleUrls: ['./viewedit-popup.component.scss']
})
export class VieweditPopupComponent extends BaseFormComponent implements OnInit {

  screen = SCREEN_CODE.FarmManagement;
  constructor(private router: Router, protected translationPipe: TranslationConfigService, protected popupController: PopupControllerService,
    protected loadingNotification: LoadingNotificationService,
    protected notification: NotificationServiceService,
    protected accountService: AccountService) {
    super(
      translationPipe,
      popupController,
      notification,
      accountService,

    );
  }

  ngOnInit() {
    console.log(this.isLastDataCell, 'if it is last data cell or not');
    
  }
  @Input() popupScreen: any;
  @Input() isLastDataCell: any = false;
  @Input() isHarvest: boolean;
  @Input() isRedraw: boolean = true;
  @Input() isExplorer: boolean = false;
  @Input() isReprot: boolean = false;
  @Input() status: number;
  @Input() flightTypeId: number;
  @Input() isEdit = true;
  @Input() isDelete = true;
  @Input() isEditBoundary = false;
  @Output() close1 = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() editBoundary = new EventEmitter<any>();
  @Output() delete = new EventEmitter<void>();
  @Output() history = new EventEmitter<void>();
  @Output() report = new EventEmitter<void>();
  @Output() process = new EventEmitter<void>();
  @Output() redraw = new EventEmitter<void>();
  @Output() cloud = new EventEmitter<void>();
  @Output() edge = new EventEmitter<void>();
  @Output() viewImage = new EventEmitter<void>();
  @Output() addCrops = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();
  @Output() detail = new EventEmitter<void>();
  @Output() resultDelete = new EventEmitter<void>();
  @Output() dataDelete = new EventEmitter<void>();
  @Output() weather = new EventEmitter<void>();
  @Output() showDetail = new EventEmitter<void>();
  @Output() start = new EventEmitter<void>();
  @Output() notApprove = new EventEmitter<void>();
  @Output() timeline = new EventEmitter<void>();
  @Output() approve = new EventEmitter<void>();
  update(str, event = null) {
    if (str == "Edit") {
      this.edit.emit();
    }
    if (str == "Edit Boundary") {
      this.editBoundary.emit();
    }
    else if (str == "Crop History") {
      this.history.emit(event);
    }
    else if (str == "Report") {
      this.report.emit();
    }
    else if (str == "process") {
      this.process.emit();
    }
    else if (str == "redraw") {
      this.redraw.emit();
    }
    else if (str == "cloud") {
      this.cloud.emit();
    }
    else if (str == "edge") {
      this.edge.emit();
    }
    else if (str == "viewImage") {
      this.viewImage.emit();
    }
    else if (str == "addCrops") {
      this.addCrops.emit();
    }
    else if (str == "download") {
      this.download.emit()
    }
    else if (str == "detail") {
      this.detail.emit()
    }
    else if (str == "dataDelete") {
      this.dataDelete.emit()
    }
    else if (str == "resultDelete") {
      this.resultDelete.emit()
    }
    else if (str == "weather") {
      this.weather.emit()
    }
    else if (str == 'farm timeline') {
      this.timeline.emit();
    } else if (str == 'delete') {
      this.delete.emit();
    }
    else if (str == "showDetail") {
      this.showDetail.emit()
    }
    else if (str == "notApprove") {
      this.notApprove.emit()
    }
    else if (str == "approve") {
      this.approve.emit()
    }
    else if (str == "start") {
      this.start.emit()
    }
    else if (str == 'delete') {
      this.delete.emit();
    }
  }
  onClose() {
    this.close1.emit();
  }
}
