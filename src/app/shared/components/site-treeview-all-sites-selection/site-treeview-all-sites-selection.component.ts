import { Component, EventEmitter, Host, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TreeviewComponent, TreeviewConfig, TreeviewI18n, TreeviewEventParser, TreeviewI18nDefault, TreeviewItem } from 'ngx-treeview';
import { SampleObject } from 'src/app/generic-ui-components/components/general-treeview/general-treeview.component';
import { SCREEN_CODE } from '../../helper/Enums';
import { SelectBox } from '../../models/SelectBox.Model';
import { NotificationServiceService } from '../../services/common/notification.service';
import { TranslationConfigService } from '../../services/common/translation-config.service';
import { ManageOrganizationsService } from '../../services/manage-organizations/manage-organizations.service';

@Component({
  selector: 'app-site-treeview-all-sites-selection',
  templateUrl: './site-treeview-all-sites-selection.component.html',
  styleUrls: ['./site-treeview-all-sites-selection.component.scss']
})
export class SiteTreeviewAllSitesSelectionComponent extends TreeviewComponent implements OnInit {
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
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  buttonClass = 'apl-btn btn-ok';
  @Input() userSites: any;
  @Input() siteDetails: any;
  @Input() testingSites: any;
  @Input() allTestingSites: any;
  @Input() allCollectionSites: any;
  @Input() allExtraSites: any;
  @Input() clientSites: any;
  @Input() isPiperUser: any;
  @Input() siteTagData: any = [];
  @Input() disableBtn: any[];
  @Input() lstSites: any;
  @Input() disableFields: any;
  @Input() selectOrgnSite = false;
  @Input() organId = 0;
  @Output() sitesSelected = new EventEmitter();
  @Output() sendSiteTagData = new EventEmitter();
  @Output() removeSites = new EventEmitter();
  @Output() hideSitesTree = new EventEmitter();
  siteTagData1: any[];
  selectedValueSite: any[];
  lstSitesFiltered: any[];
  selectedValueOrgType: any[];
  showLengthError: boolean = false;
  fixDropdown: boolean = false;
  showErrorSites;
  lastValue: any;
  valSelec: number[];


  dataLoaded = false;
  constructor(
    @Host() @Self() @Optional()
    i18n: TreeviewI18n,
    defaultConfig: TreeviewConfig,
    eventParser: TreeviewEventParser,
    protected notification: NotificationServiceService,

    protected manageOrganizationsService: ManageOrganizationsService,
    // protected formBuilder: FormBuilder,
    protected translationPipe: TranslationConfigService
  ) {

    super(i18n, defaultConfig, eventParser);
    // this.overrideTreeView();
    TreeviewI18nDefault.prototype.getText = function (selection) {
      return this.site;
    };
    let _this = this;
    // TreeviewComponent.prototype.onItemCheckedChange = function (item, checked) {
    //   this.raiseSelectedChange();
    // };
    TreeviewComponent.prototype.raiseSelectedChange = function () {
      this.generateSelection();
      const values: number[] = [];
      const items = this.items;
      _this.siteTagData1 = [];
      _this.calculateCheckedValues(items, values, _this.siteTagData1);
      // var values = this.eventParser.getSelectedChange(this);

      this.selectedChange.emit(values);
    };
  }

  ngOnInit() {
    this.resetForm();
    this.translationPipe
      .getTranslation("userAccount.sites", "")
      .subscribe((response) => {
        this.site = response;
      });
    this.showTree1(null);
  }
  resetForm() {
    this.showLengthError = false;
    this.showRequiredError = false;
    this.selectedValueSite = [];
    this.values = [];
    this.lstSitesFiltered = [];
    this.itemsLst = [];
    this.selectedValueOrgType = [];
  }

  onFilterChange(event) { }

  showTree1(item) {
    this.siteDetails
    if (this.disableBtn) {
      return;
    }
    this.lastValue = -1;
    this.siteTagData1 = this.siteTagData;
    let data = {
      "siteId": this.lstSites
    };
    this.FillFCFromModal(data);
    // if (this.lstSites.length > 0) {
    //   this.showRequiredError = false;
    // }
    // else {
    //   this.showRequiredError = true;
    // }
  }
  FillFCFromModal(data) {
    this.selectedValueSite = data.siteId;
    this.values = data.siteId;
    this.LoadLocationTree(data.siteId);
    if (this.disableFields) {
      this.form.disable();
    }
  }
  hideTree() {
    this.showTreeComp = false;
    this.hideSitesTree.emit(true);
  }
  saveClientSites() {
    
    for (let i = 0; i < this.siteTagData1.length; i++) {
      if (this.allExtraSites.includes(this.siteTagData1[i].siteId)) {
        this.siteTagData1.splice(i, 1);
        i--;
      }
    }
    for (let i = 0; i < this.values.length; i++) {
      if (this.allExtraSites.includes(this.values[i])) {
        this.values.splice(i, 1);
        i--;
      }
    }
    this.sitesSelected.emit(this.values);
    this.sendSiteTagData.emit(this.siteTagData1);
    this.showTreeComp = false;
  }

  public LoadLocationTree(lsChecked) {
    // this.showLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);

    this.notification.loading = true;
    this.manageOrganizationsService
      .LoadAllSystemSitesRefData(this.organId)
      .subscribe(response => {
        
        // this.hideLoader(this.screen, API_CALLEVENTGROUP_CODE.REF_SELECTION_EVENT);
        this.lstSitesTree = response.dataObject;
        this.itemsLst2 = [];
        this.formData(this.lstSitesTree, lsChecked, 'none');
        this.showTreeComp = true;

        this.dataLoaded = true;

        this.notification.loading = false;
      });
  }

  fillCheckedDataRecursivelyAllSites(obj: TreeviewItem[], list: any, allSitesSelected, recheckAll) {
    if (obj == null) {
      return;
    } else {
      for (const i of obj) {
        let selection = false;
        if (recheckAll == 'none') {
          if (list.includes(i.value)) {
            i.checked = true;
            selection = true;
          }
        }
        else if (recheckAll == 'testing') {
          if (this.values.includes(i.value) || list.includes(i.value)) {
            i.checked = true;
            selection = true;
          }
        }
        else if (recheckAll == 'collection') {
          if (this.values.includes(i.value) || list.includes(i.value)) {
            i.checked = true;
            selection = true;
          }
        }

        if (!selection) {
          allSitesSelected.selected = false;
        }
        this.fillCheckedDataRecursivelyAllSites(i.children, list, allSitesSelected, recheckAll);
      }
    }
  }

  formData(sitesTree, lsChecked, recheckAll) {

    const list: SampleObject[] = new Array<SampleObject>();
    this.fillDataRecursively(sitesTree, list);
    const treeViewItem: TreeviewItem = new TreeviewItem(list[0]);
    let allSitesSelected = { "selected": true };
    this.fillCheckedDataRecursivelyAllSites(treeViewItem.children, lsChecked, allSitesSelected, recheckAll);
    if (allSitesSelected.selected) {
      treeViewItem.checked = true;
    } else {
      treeViewItem.checked = false;
    }
    // treeViewItem.correctChecked();
    // this.getCorrectChecked([treeViewItem]);
    this.markParentRecursively(treeViewItem);
    this.itemsLst2 = [treeViewItem];
  }

  //   getCorrectChecked (treeview) {
  //     var checked = null;
  //     if (treeview.internalChildren! = null) {
  //         for (var _i = 0, _a = treeview.internalChildren; _i < _a.length; _i++) {
  //             var child = _a[_i];
  //             child.internalChecked = this.getCorrectChecked(treeview.child);
  //             if (checked === null) {
  //                 checked = child.internalChecked;
  //             }
  //             else if (checked !== child.internalChecked) {
  //                 checked = undefined;
  //                 // break;
  //             }
  //         }
  //     }
  //     else {
  //         checked = treeview.item.checked;
  //     }
  //     return checked;
  // };

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
  removeOrgn(id) {
    this.removeSites.emit(id);
  }
  ValueChanged(value: number[]) {
    // if (value.length > 0) {
    //   this.showRequiredError = false;
    // }
    // else {
    //   this.showRequiredError = true;
    // }
    this.values = value;
  }
  SelectAllCollection() {
    this.formData(this.lstSitesTree, this.allCollectionSites, 'collection');
  }
  selectAllTestSites() {
    this.formData(this.lstSitesTree, this.allTestingSites, 'testing');
  }
  markParentRecursively(item) {
    let allChildrenSelected: boolean = true;
    if (!item.children || item.children.length === 0) {
      return;
    } else {
      for (const i of item.children) {
        if (i.children && i.children.length > 0) {
          this.markParentRecursively(i);
          if (!i.checked) {
            allChildrenSelected = false;
          }
        } else {
          if (!i.checked) {
            allChildrenSelected = false;
          }
        }
      }
    }
    item.checked = allChildrenSelected;
  }
}
