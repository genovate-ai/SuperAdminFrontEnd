import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  HostListener,
  Type,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import { PopupControllerService } from 'src/app/shared/services/common/popup-controller.service';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-general-modal',
  templateUrl: './general-modal.component.html',
})
export class GeneralModalComponent implements OnInit, AfterViewInit {
  @ViewChild('popupcontainer', { read: ViewContainerRef, static: true })
  container: ViewContainerRef;
  showConfirmationFlag = false;
  confirmationMessage: any;

  visible = false;
  left = null;

  width = '';
  height = '';

  xsCenter = false;

  modalComponent: any;
  components: Array<any> = [];
  componentInstance: any;
  stepperList = [];
  stepperIndexVal = 0;

  // Saving screen sizes to set width, left and height for modals
  respScreenSize: number;

  constructor(
    public popupController: PopupControllerService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private accountService: AccountService,
    protected translationPipe: TranslationConfigService
  ) {}

  ngOnInit() {
    this.respScreenSize = window.innerWidth;
  }

  // Changing screen from desktop to mobile when menu is locked #Start
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.respScreenSize = event.target.innerWidth;
    this.SetModalSize(this.popupController.modalSize);
  }
  // Changing screen from desktop to mobile when menu is locked #End

  ngAfterViewInit() {
    this.popupController.isClosed().subscribe(() => {
      this.close();
    });
    
    this.popupController
      .getComponent()
      .pipe(skip(1))
      .subscribe((component) => {
    
        if (component) {
          this.SetModalSize(this.popupController.modalSize);

          if (!this.visible) {
            this.modalComponent = null;
            this.modalComponent = component;
            this.visible = true;

            this.addComponent(this.modalComponent);
          }
        }
      });
  }

  addComponent(componentClass: Type<any>) {
    
    try {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        componentClass
      );
      const component = this.container.createComponent(componentFactory);

      this.componentInstance = component.instance;
      this.stepperIndexVal = 0;
      this.stepperList = [];
      this.stepperList = this.componentInstance.stepperList || [];

      this.components.push(component);
    } catch (error) {
      console.error(error);
      this.close();
    }
  }

  close() {
    if (this.popupController.isSafeToClose) {
      this.showConfirmationFlag = false;

      this.visible = false;
      this.popupController.result.next(false);
      this.removeComponent(this.modalComponent);
      this.modalComponent = null;

      this.width = '';
      this.stepperList = [];
      this.componentInstance = null;
    } else {
      this.translationPipe
        .getTranslation('Confirm.ConfirmCloseOnUsaved', '')
        .subscribe((response) => {
          this.confirmationMessage = response;
        });
      this.showConfirmationFlag = true;
    }
  }

  positiveDelete() {
    this.showConfirmationFlag = false;

    this.visible = false;
    this.popupController.result.next(false);
    this.removeComponent(this.modalComponent);
    this.modalComponent = null;

    this.width = '';
    this.popupController.isSafeToClose = true;
  }

  removeComponent(componentClass: Type<any>) {
    
    const component = this.components.find(
      (component) => component.instance instanceof componentClass
    );
    const componentIndex = this.components.indexOf(component);

    if (componentIndex !== -1) {
      this.container.remove(this.container.indexOf(component));
      this.components.splice(componentIndex, 1);
      this.onHide();
    }
  }

  onHide() {
    this.popupController.modalSize = null;
  }

  // Getting Modal type (large,small) and settting the dimensions according to responsive screen size #Start
  SetModalSize(size: string) {
    switch (size) {
      case 'xs':
        this.xsCenter = true;
        break;
      default:
        this.xsCenter = false;
        break;
    }

    switch (size) {
      case 'lg':
        if (this.respScreenSize <= 320) {
          this.SetModelDimensions('85', '14', '93');
        } else if (this.respScreenSize <= 480) {
          this.SetModelDimensions('85', '14', '93');
        } else if (this.respScreenSize <= 576) {
          this.SetModelDimensions('86', '10', '92');
        } else if (this.respScreenSize <= 625) {
          this.SetModelDimensions('86', '10', '92');
        } else if (this.respScreenSize <= 767) {
          this.SetModelDimensions('75', '13', '91');
        } else if (this.respScreenSize <= 853) {
          this.SetModelDimensions('90', '7', '90');
        } else if (this.respScreenSize <= 992) {
          this.SetModelDimensions('80', '12', '90');
        } else if (this.respScreenSize <= 1200) {
          this.SetModelDimensions('70', '15', '85');
        } else if (this.respScreenSize > 1200) {
          this.SetModelDimensions('70', '15', '85');
        }

        break;
      case 'xs':
        if (this.respScreenSize <= 320) {
          this.SetModelDimensions('60', '25', '70');
        } else if (this.respScreenSize <= 480) {
          this.SetModelDimensions('66', '21', '55');
        } else if (this.respScreenSize >= 1200) {
          this.SetModelDimensions('21', '40', '58');
        } else if (this.respScreenSize >= 992) {
          this.SetModelDimensions('26', '36', '65');
        } else if (this.respScreenSize >= 768) {
          this.SetModelDimensions('34', '30', '60');
        } else if (this.respScreenSize >= 600) {
          this.SetModelDimensions('51', '25', '60');
        }
        break;
      case 'md':
        if (this.respScreenSize <= 320) {
          this.SetModelDimensions('80', '17', '94');
        } else if (this.respScreenSize <= 480) {
          // this.SetModelDimensions('80', '16', '91');
          this.SetModelDimensions('85', '13', '91');
        } else if (this.respScreenSize >= 1200) {
          this.SetModelDimensions('52', '31', '90');
        } else if (this.respScreenSize >= 992) {
          this.SetModelDimensions('50', '24', '92');
        } else if (this.respScreenSize >= 768) {
          this.SetModelDimensions('55', '27', '92');
        } else if (this.respScreenSize >= 600) {
          this.SetModelDimensions('62', '23', '92');
        } else if (this.respScreenSize >= 500) {
          this.SetModelDimensions('74', '18', '92');
        }
        break;
      case 'sm':
      default:
        if (this.respScreenSize <= 320) {
          this.SetModelDimensions('80', '17', '94');
        } else if (this.respScreenSize <= 480) {
          // this.SetModelDimensions('80', '16', '91');
          this.SetModelDimensions('85', '13', '91');
        } else if (this.respScreenSize >= 1200) {
          this.SetModelDimensions('42', '31', '90');
        } else if (this.respScreenSize >= 992) {
          this.SetModelDimensions('50', '24', '92');
        } else if (this.respScreenSize >= 768) {
          this.SetModelDimensions('55', '27', '92');
        } else if (this.respScreenSize >= 600) {
          this.SetModelDimensions('62', '23', '92');
        } else if (this.respScreenSize >= 500) {
          this.SetModelDimensions('74', '18', '92');
        }
        break;
    }
  }

  SetModelDimensions(width: string, left: string, height: string) {
    this.width = width;
    this.left = left;
    this.height = height;
  }
  // Getting Modal type (large,small) and settting the dimensions according to responsive screen size #End

  goNext() {
    
    // this.stepperIndexVal = this.stepperIndexVal + 1;
    if (this.stepperIndexVal < this.stepperList.length) {
      this.stepperStepClicked(this.stepperIndexVal + 1);
    } else {
      this.stepperIndexVal = this.stepperList.length - 1;
    }
  }

  goBack() {

    this.stepperIndexVal = this.stepperIndexVal - 1;
    if (this.stepperIndexVal >= 0) {
      this.setActiveStep();
    } else {
      this.stepperIndexVal = 0;
    }
  }
  goSave() {

    this.componentInstance.submit(this.componentInstance.form.value);
  }
  stepperStepClicked(stepIndex) {
    
    try {
      if (this.componentInstance.validateStepperNavigation(+stepIndex + 1)) {
        this.stepperIndexVal = stepIndex;
        this.setActiveStep();
      } else {
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  setActiveStep() {

    try {
      for (let i = 0; i < this.stepperList.length; i++) {
        this.stepperList[i] = false;
      }
      this.stepperList[this.stepperIndexVal] = true;

      this.componentInstance.showActiveStepOfStepper(this.stepperList);
    } catch (error) {
      console.error(error);
    }
  }
}
