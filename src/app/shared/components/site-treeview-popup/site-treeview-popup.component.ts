import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TreeviewComponent, TreeviewConfig, TreeviewI18nDefault, TreeviewItem } from 'ngx-treeview';
import { API_CALLEVENTGROUP_CODE, SCREEN_CODE } from '../../helper/Enums';
import { SampleObject } from '../../helper/SampleObject';
import { SelectBox } from '../../models/SelectBox.Model';
import { AccountService } from '../../services/common/account.service';
import { NotificationServiceService } from '../../services/common/notification.service';
import { PopupControllerService } from '../../services/common/popup-controller.service';
import { TranslationConfigService } from '../../services/common/translation-config.service';
import { ManageOrganizationsService } from '../../services/manage-organizations/manage-organizations.service';
import { UserAccountService } from '../../services/user-account-services/user-account.service';
import { BaseFormComponent } from '../base-components/base-form.component';

@Component({
  selector: 'app-site-treeview-popup',
  templateUrl: './site-treeview-popup.component.html',
  styleUrls: ['./site-treeview-popup.component.scss']
})
export class SiteTreeviewPopupComponent extends BaseFormComponent implements OnInit {
  disableSave = false;
  showRequiredError = false;
  values = [];
  lstOrganizationsFiltered: Array<SelectBox> = [];
  showTreeComp = false;
  screen = SCREEN_CODE.HomeScreen;
  form: UntypedFormGroup;
  lstOrganizations: Array<SelectBox> = [];
  lstOrgType: Array<SelectBox> = [];
  lstSitesTree: any = [];
  itemsLst: any = [];
  itemsLst2: any = [];
  site;
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: true,
    maxHeight: 400
  });
  buttonClass = 'apl-btn btn-ok';
  @Input() leafNode = [];
  @Input() siteTagData: any = [];
  @Input() loadAllSites: any = [];
  @Input() restrictSingleSelection: any;
  @Input() loadData: any;
  @Input() orgnId: any;
  @Input() OrgType: any;
  @Input() lstSites: any;
  @Input() disableFields: any;
  @Input() loadTestSitesOnly: any;
  @Input() unselectParent: any;
  @Output() sitesSelected = new EventEmitter();
  @Output() orgnSelected = new EventEmitter();
  @Output() orgnTypeSelected = new EventEmitter();
  @Output() sendSiteTagData = new EventEmitter();
  siteTagData1: any[];
  selectedValueSite: any[];
  lstSitesFiltered: any[];
  selectedValueOrganization: any[];
  selectedValueOrgType: any[];
  showLengthError: boolean = false;
  fixDropdown: boolean = false;
  showErrorSites;
  lastValue: any;
  valSelec: number[];
  errorNoSitesAttached: boolean;



  constructor(
    protected manageOrganizationsService: ManageOrganizationsService,
    protected formBuilder: UntypedFormBuilder,
    protected notification: NotificationServiceService,
    protected popupController: PopupControllerService,
    protected translationPipe: TranslationConfigService,
    protected userAccountService: UserAccountService,
    protected accountService: AccountService
  ) {

    super(translationPipe, popupController, notification, accountService);

  }
  ngOnInit() {
    if (!this.restrictSingleSelection) {
      this.config = TreeviewConfig.create({
        hasAllCheckBox: false,
        hasFilter: false,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 400
      });
    }
    this.resetForm();
    this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
    this.manageOrganizationsService
      .loadTestSiteAssociationMetaData()
      .subscribe(response => {
        this.lstOrganizations = response.dataObject.lstOrganizationVM;
        this.lstOrgType = response.dataObject.lstOrganizationTypeVM;
        this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      });

    this.translationPipe
      .getTranslation("userAccount.sites", "")
      .subscribe((response) => {
        this.site = response;
      });
  }
  resetForm() {
    this.showLengthError = false;
    this.showRequiredError = false;
    this.selectedValueSite = [];
    this.values = [];
    this.lstSitesFiltered = [];
    this.itemsLst = [];
    this.selectedValueOrganization = [];
    this.selectedValueOrgType = [];
    this.form = this.formBuilder.group({
      fcOrganizationType: ['', [Validators.required]],
      fcOrganization: ['', [Validators.required]],
      fcSite: ['']
    });
  }
  selectedOrgType(orgnTypeId, reset: boolean) {

    if (reset) {
      this.values = [];
      this.lstSitesFiltered = [];
      this.itemsLst = [];
      this.itemsLst2 = [];
      this.selectedValueSite = [];
      this.form.controls['fcOrganization'].markAsUntouched();
    }
    this.lstOrganizationsFiltered = this.lstOrganizations.filter(
      rec => rec.tag === orgnTypeId);
    this.selectedValueOrganization = null;
    this.ClearSitesList();
  }
  ClearSitesList() {
    this.selectedValueSite = null;
    this.values = [];

  }
  onFilterChange(event) { }
  showTree1(item) {
    this.errorNoSitesAttached = false;
    this.itemsLst2 = [];
    this.lastValue = -1;
    this.siteTagData1 = this.siteTagData;
    let data = {
      "orgnTypeId": this.OrgType,
      "orgnId": this.orgnId,
      "siteId": this.lstSites
    };
    this.FillFCFromModal(data);
    if (this.restrictSingleSelection) {
      if (this.lstSites.length == 1) {
        this.showLengthError = false;
      }
      else {
        this.showLengthError = true;
      }
    }
    if (!this.restrictSingleSelection) {
      if (this.lstSites.length > 0) {
        this.showRequiredError = false;
      }
      else {
        this.showRequiredError = true;
      }
    }
    this.showTreeComp = true;
  }
  FillFCFromModal(data) {
    this.selectedOrgType(data.orgnTypeId, false);
    this.selectedValueOrgType = data.orgnTypeId;
    this.selectedValueOrganization = data.orgnId;
    this.selectedValueSite = data.siteId;
    this.values = data.siteId;
    this.LoadLocationTree(data.orgnId, false, data.siteId, false);
    this.form = this.formBuilder.group({
      fcOrganizationType: [data.orgnTypeId, [Validators.required]],
      fcOrganization: [data.orgnId, [Validators.required]],
      fcSite: [data.siteId],
    })
    if (this.disableFields) {
      this.form.disable();
    }
  }
  hideTree() {
    this.showTreeComp = false;
  }
  saveClientSites() {
    this.sitesSelected.emit(this.values);
    let index = -1;
    for(let i = 0; i < this.siteTagData1.length; i++){
      if(this.siteTagData1[i].siteId == -1){
        index = i;
      }
    }
    if (index > -1) {
      this.siteTagData1.splice(index, 1);
    }
    this.sendSiteTagData.emit(this.siteTagData1);
    this.orgnTypeSelected.emit(this.selectedValueOrgType);
    this.orgnSelected.emit(this.selectedValueOrganization);
    this.showTreeComp = false;
  }

  public LoadLocationTree(organId, setPlaceholderForSites, lsChecked, isClientData) {
    if (organId == null && !this.loadAllSites) {
      return;
    }
    if (this.loadAllSites) {
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      this.manageOrganizationsService
        .LoadAllSiteTreeRefDataTestingSites()
        .subscribe(response => {
          this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
          this.lstSitesTree = response.dataObject;
          this.itemsLst2 = [];          
          if(this.lstSitesTree.length != 0){
            this.formData(this.lstSitesTree, lsChecked, setPlaceholderForSites, isClientData);
            this.errorNoSitesAttached = false;
          }
          else{
            this.errorNoSitesAttached = true;
            this.showRequiredError = false;
          }
        });
      return;
    }
    if (!this.loadTestSitesOnly) {
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      this.manageOrganizationsService
        .LoadSiteTreeMetaData(organId)
        .subscribe(response => {
          this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
          this.lstSitesTree = response.dataObject;
          this.itemsLst2 = [];
          this.formData(this.lstSitesTree, lsChecked, setPlaceholderForSites, isClientData)
          this.itemsLst2;
        });
    }
    else {
      this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
      this.manageOrganizationsService
        .LoadSiteTreeRefDataTestingSites(organId)
        .subscribe(response => {
          this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
          this.lstSitesTree = response.dataObject;
          this.itemsLst2 = [];
          if(this.lstSitesTree.length != 0){
            this.formData(this.lstSitesTree, lsChecked, setPlaceholderForSites, isClientData);
            this.errorNoSitesAttached = false;
          }
          else{
            this.errorNoSitesAttached = true;
          }
        });
    }
  }

  formData(sitesTree, lsChecked, setPlaceholderForSites, isClientData) {
    const list: SampleObject[] = new Array<SampleObject>();
    this.fillDataRecursively(sitesTree, list);

    const treeViewItem: TreeviewItem = new TreeviewItem(list[0]);

    if (!setPlaceholderForSites) {
      if(this.loadAllSites){
        let allSitesSelected = { "selected": true };
        
        this.fillCheckedDataRecursivelyAllSites(treeViewItem.children, lsChecked, allSitesSelected);
        if (allSitesSelected.selected) {
          treeViewItem.checked = true;
        }else{
          treeViewItem.checked = false;
        }
      }
      else{
        for (const ob of lsChecked) {
          if (ob === treeViewItem.value) {
            treeViewItem.checked = true;
          }
        }
        this.fillCheckedDataRecursively(treeViewItem.children, lsChecked);
      }
    } else {
      treeViewItem.checked = false;
      this.fillDataRecursivelyChecked(treeViewItem.children)
    }
    this.itemsLst2 = [treeViewItem];
    if(this.leafNode && this.leafNode.length > 0){
      this.disableParentNodes(this.itemsLst2);
    }
    else{
      this.enableParentNodes(this.itemsLst2);
    }
  }

  fillCheckedDataRecursively(obj: any, list: any) {
    if (obj == null) {
      return;
    } else {
      for (const i of obj) {
        for (const ob of list) {
          if (ob === i.value) {
            i.checked = true; //////////////////////////// here 
          }
        }
        this.fillCheckedDataRecursively(i.children, list);
      }
    }
  }

  fillCheckedDataRecursivelyAllSites(obj: any, list: any, allSitesSelected) {
    if (obj == null) {
      return;
    } else {
      for (const i of obj) {
        let selection = false;
        for (const ob of list) {
          if (ob === i.value) {
            i.checked = true; //////////////////////////// here 
            selection = true;
          }
        }
        if(!selection){
          allSitesSelected.selected = false;
        }
        this.fillCheckedDataRecursivelyAllSites(i.children, list, allSitesSelected);
      }
    }
  }

  fillDataRecursivelyChecked(obj: any) {
    if (obj == null) {
      return;
    } else {
      for (const i of obj) {
        i.checked = false;  //Default checked or not
        this.fillDataRecursivelyChecked(i.children);
      }
    }
  }

  fillDataRecursively(obj: any, list: SampleObject[]) {
    if (obj == null) {
      return;
    }
    else {
      for (const i of obj) {
        const text = i.item.siteName;
        const value = i.item.siteId;

        const item1: SampleObject = new SampleObject();
        item1.text = text;
        item1.value = value;
        item1.checked = false;
        if (i.children.length > 0)
          item1.children = new Array<SampleObject>();
        list.push(item1);
        this.fillDataRecursively(i.children, item1.children);
      }
    }
  }

  calculateCheckedValues(obj: any, values: number[], siteTagData) {
    if (obj == null) {
      return;
    }
    else {
      for (const i of obj) {
        if (i.internalChecked) {
          values.push(i.value)
          siteTagData.push({ "siteId": i.value, "siteName": i.text })
        }
        this.calculateCheckedValues(i.internalChildren, values, siteTagData);
      }
    }
  }

  ValueChanged(value: number[]) {
    if (this.restrictSingleSelection) {
      if (value.length < 2) {
        this.showLengthError = false;
      }
      else {
        this.showLengthError = true;
      }
    }
    if (!this.restrictSingleSelection) {
      if (value.length > 0) {
        this.showRequiredError = false;
      }
      else {
        this.showRequiredError = true;
      }
    }
    TreeviewI18nDefault.prototype.getText = function (selection) {
      return 'Sites';
    };
    let _this = this;
    this.valSelec = value;
    // if (this.unselectParent) {
    //   // comment from here to proceed with parent nodes as well
    //   TreeviewComponent.prototype.onItemCheckedChange = function (item, checked) {
    //     // _this.disableParentNodes(this.filterItems);
    //     this.raiseSelectedChange();
    //   };
    //   // comment upto here to proceed with parent nodes as well
    // } else {
    //   TreeviewComponent.prototype.onItemCheckedChange = function (item, checked) {
    //     this.raiseSelectedChange();
    //   };
    // }
    TreeviewComponent.prototype.raiseSelectedChange = function () {
      this.generateSelection();
      const values: number[] = [];
      const items = this.items;
      _this.siteTagData1 = [];
      _this.calculateCheckedValues(items, values, _this.siteTagData1);
      
    const index = values.indexOf(-1);
    if (index > -1) {
      values.splice(index, 1);
    }
      this.selectedChange.emit(values);
    };

    const index = this.values.indexOf(-1);
    if (index > -1) {
      this.values.splice(index, 1);
    }
    this.values = value;
  }

  disableParentNodes(obj: any) {
    if (obj == null) {
      return obj;
    } else {
      if (!obj.length) {
        if(this.leafNode.includes(obj.value)){
          obj.disabled = false;
        }else{
          obj.disabled = true;
        }
        this.disableParentNodes(obj.internalChildren);
      }
      else {
        for (const ob of obj) {
          if(this.leafNode.includes(ob.value)){
            ob.disabled = false;
          }else{
            ob.disabled = true;
          }
          this.disableParentNodes(ob.internalChildren);
        }
      }
    }
  }
  enableParentNodes(obj){
    // if (obj == null) {
    //   return obj;
    // } else {
    //   if (!obj.length) {
    //     // if(this.leafNode.includes(obj.value)){
    //     //   obj.disabled = false;
    //     // }else{
    //     //   obj.disabled = true;
    //     // }
    //     obj.disabled = false;
    //     this.disableParentNodes(obj.internalChildren);
    //   }
    //   else {
    //     for (const ob of obj) {
    //       // if(this.leafNode.includes(ob.value)){
    //       //   ob.disabled = false;
    //       // }else{
    //       //   ob.disabled = true;
    //       // }
    //       ob.disabled = false;
    //       this.disableParentNodes(ob.internalChildren);
    //     }
    //   }
    // }

  }
}
