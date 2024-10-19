import { Component, OnInit, Input, Output, OnChanges, Renderer2, EventEmitter, Type, ComponentFactoryResolver, ViewChild, ViewContainerRef, AfterContentInit, AfterViewInit, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { PopupControllerService } from '../../services/common/popup-controller.service'
import { Router } from '@angular/router'
import { skip } from 'rxjs/operators';
import { AccountService } from '../../services/common/account.service';
import { TranslationConfigService } from '../../services/common/translation-config.service';
@Component({
  selector: 'app-popup-component',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})

export class PopupComponent implements OnInit {
  @ViewChild('popupcontainer', { read: ViewContainerRef, static: false }) container: ViewContainerRef;
  showConfirmationFlag: boolean = false;
  confirmationMessage: any;

  constructor(public popupController: PopupControllerService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private router: Router,
    private accountService: AccountService,
    protected translationPipe: TranslationConfigService,) { }

  visible: boolean = false;
  left: String = null;

  //popupHeader: string = "";
  width: string = '';
  height = '';

  xsCenter = false;

  popupComponent: any
  showDialog: boolean
  components: Array<any> = []
  removeTabKeyListener: Function

  // Saving screen sizes to set width, left and height for modals
  respScreenSize: number;

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

  ngAfterContentInit() {

  }
  ngAfterViewInit() {
    this.popupController.isClosed().subscribe(() => {
      this.close()
    })
    this.popupController.getComponent().pipe(skip(1)).subscribe(component => {
      if (component) {
        this.SetModalSize(this.popupController.modalSize);
        if (!this.showDialog || !this.visible) {
          this.popupComponent = null;
          this.popupComponent = component;
          this.showDialog = true;
          this.visible = true

          this.addComponent(this.popupComponent);
        }

      }
    })
  }

  addComponent(componentClass: Type<any>) {
    this.onShow();
    try {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
      const component = this.container.createComponent(componentFactory);

      this.components.push(component);

    } catch (error) {
      console.error(error);
      this.close();
    }
  }

  close() {
    if (this.popupController.isSafeToClose) {
      this.showConfirmationFlag = false;
      // this.idToDelete = 0;
      this.visible = false;
      this.popupController.result.next(false);
      this.removeComponent(this.popupComponent);
      this.popupComponent = null;
      this.showDialog = false;
      this.width = '';
    } else {
      this.translationPipe.getTranslation('Confirm.ConfirmCloseOnUsaved', '').subscribe(response => {
        this.confirmationMessage = response;
      });
      this.showConfirmationFlag = true;
      // this.idToDelete = id;
    }

  }

  positiveDelete() {
    this.showConfirmationFlag = false;
    // this.idToDelete = 0;
    this.visible = false;
    this.popupController.result.next(false)
    this.removeComponent(this.popupComponent)
    this.popupComponent = null;
    this.showDialog = false;
    this.width = '';
    this.popupController.isSafeToClose = true;
  }

  onShow() {
  }
  removeComponent(componentClass: Type<any>) {

    const component = this.components.find((component) => component.instance instanceof componentClass);
    const componentIndex = this.components.indexOf(component);

    if (componentIndex !== -1) {
      this.container.clear(); //.remove(this.container.indexOf(component));
      this.components.splice(componentIndex, 1);
      this.onHide();
    }


  }

  onHide() {
    this.popupController.modalSize = null;
    this.removeTabKeyListener;
    this.removeTabKeyListener = null;
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
      case 'xl':
        
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
          this.SetModelDimensions('95', '15', '90');
        } else if (this.respScreenSize <= 1200) {
          this.SetModelDimensions('97', '15', '90');
        } else if (this.respScreenSize > 1200) {
          this.SetModelDimensions('97', '15', '90');
        }
        break
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
          this.SetModelDimensions('70', '15', '95');
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

}

