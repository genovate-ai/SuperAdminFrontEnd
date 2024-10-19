import { Component, OnInit, Input, Output, OnChanges, EventEmitter, ViewEncapsulation } from '@angular/core';
import { TreeviewItem, TreeviewConfig, TreeviewI18nDefault, TreeviewComponent } from 'ngx-treeview';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';

@Component({
  selector: 'app-general-treeview',
  templateUrl: './general-treeview.component.html',
  styleUrls: ['./general-treeview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralTreeviewComponent implements OnInit, OnChanges {

  @Input() textLabel = null;
  @Input() buttonClass = 'form-control form-control-inv';
  @Input() treeviewConfigLoading = null;
  @Input() bindLabel;
  @Input() bindValue;

  @Input() hasAllCheckBox = false;
  @Input() hasFilter = false;
  @Input() hasCollapseExpand = false;
  @Input() decoupleChildFromParent = true;
  @Input() maxHeight = 150;

  @Output() SelectedValues = new EventEmitter<any[]>();

  itemsList: TreeviewItem[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: this.hasAllCheckBox,
    hasFilter: this.hasFilter,
    hasCollapseExpand: this.hasCollapseExpand,
    decoupleChildFromParent: this.decoupleChildFromParent,
    maxHeight: this.maxHeight
  });

  isTreeviewFuncOverride = false;

  constructor(private translationPipe: TranslationConfigService) { }

  ngOnInit(): void {

    if (this.textLabel) {
      TreeviewI18nDefault.prototype.getText = (selection) => {
        return this.textLabel;
      };
    } else {
      this.itemsList = this.emptyTreeView();
    }
  }

  emptyTreeView(): TreeviewItem[] {
    return [];
  }

  getBooks(): TreeviewItem[] {
    const childrenCategory = new TreeviewItem({
      text: 'Children', value: 1, collapsed: true, children: [
        { text: 'Baby 3-5', value: 11 },
        { text: 'Baby 6-8', value: 12 },
        { text: 'Baby 9-12', value: 13 }
      ]
    });
    const itCategory = new TreeviewItem({
      text: 'IT', value: 9, children: [
        {
          text: 'Programming', value: 91, children: [{
            text: 'Frontend', value: 911, children: [
              { text: 'Angular 1', value: 9111 },
              { text: 'Angular 2', value: 9112 },
              { text: 'ReactJS', value: 9113, disabled: true },
              {text: 'Designing', value:9791, children: [
                { text: 'Internet', value: 92100 },
                { text: 'Security', value: 92200 }
              ]}
            ]
          }, {
            text: 'Backend', value: 912, children: [
              { text: 'C#', value: 9121 },
              { text: 'Java', value: 9122 },
              { text: 'Python', value: 9123, checked: false, disabled: true }
            ]
          }]
        },
        {
          text: 'Networking', value: 92, children: [
            { text: 'Internet', value: 921 },
            { text: 'Security', value: 922 }
          ]
        }
      ]
    });
    const teenCategory = new TreeviewItem({
      text: 'Teen', value: 2, collapsed: true, disabled: true, children: [
        { text: 'Adventure', value: 21 },
        { text: 'Science', value: 22 }
      ]
    });
    const othersCategory = new TreeviewItem({ text: 'Others', value: 3, checked: false, disabled: true });
    return [];
  }

  ValueChanged(value: number[]) {
    const _this = this;
    if (this.textLabel) {
    } else {
      TreeviewI18nDefault.prototype.getText = function(selection) {
        switch (selection.checkedItems.length) {
            case 0:
                // return 'Select options';
                return _this.sitesLabel(); ;
            case 1:
                if (value.length === 2) {
                  // return value.length + ' sites selected';
                  return value.length + ' ' + _this.sitesLabel();
                }
                return selection.checkedItems[0].text;
            default:            
              // return value.length + ' sites selected';
              return value.length + ' ' + _this.sitesLabel(); 
        }
      };
    }

    this.values = value;
    this.SelectedValues.emit(this.values);
  }

  ngOnChanges() {

    this.treeviewFuncOverriding();

    if (this.treeviewConfigLoading) {
      this.formData(this.treeviewConfigLoading.treeList, this.treeviewConfigLoading.checkedValuesList,
        this.treeviewConfigLoading.booleanIndicator);
    }

  }
  

  calculateCheckedValues(obj: any, values: number[]) {

    if (obj == null) {
      return;
    } else {
        for (const i of obj) {
          if (i.internalChecked) {
            values.push(i.value);
          }
          this.calculateCheckedValues(i.internalChildren, values);
        }
    }
  }

  formData(sitesTree, lsChecked, setPlaceholderForSites) {

    const list: SampleObject[] = new Array<SampleObject>();
    this.fillDataRecursively(sitesTree, list);

    const treeViewItem: TreeviewItem = new TreeviewItem(list[0]);

    if (!setPlaceholderForSites) {
      for (const ob of lsChecked) {
        if (ob === treeViewItem.value) {
          treeViewItem.checked = true;
        }
      }
      this.fillCheckedDataRecursively(treeViewItem.children, lsChecked)
    } else {
      treeViewItem.checked = true;
      this.fillDataRecursivelyChecked(treeViewItem.children)
    }
    this.itemsList = [treeViewItem];
  }

  fillDataRecursively(obj: any, list: SampleObject[]) {

    if (obj == null) {
      return;
    } else {
      for (const i of obj) {
        const text = i.item[this.bindLabel] || '';
        const value = i.item[this.bindValue] || -1;

        const item1: SampleObject = new SampleObject();
        item1.text = text;
        item1.value = value;
        item1.checked = false;
        if (i.children.length > 0) {
          item1.children = new Array<SampleObject>();
        }
        list.push(item1);
        this.fillDataRecursively(i.children, item1.children);
      }
    }
  }

  fillCheckedDataRecursively(obj: any, list: any) {
    if (obj == null) {
      return;
    } else {
      for (const i of obj) {
        for (const ob of list) {
          if (ob === i.value) {
            i.checked = true;
          }
        }
        this.fillCheckedDataRecursively(i.children, list);
      }
    }
  }

  fillDataRecursivelyChecked(obj: any) {

    if (obj == null) {
      return;
    } else {
      for (const i of obj) {
        i.checked = true;
        this.fillDataRecursivelyChecked(i.children);
      }
    }
  }

  treeviewFuncOverriding() {
    if (!this.isTreeviewFuncOverride) {
      const angularthis = this;
      TreeviewComponent.prototype.raiseSelectedChange = function() {

        this.generateSelection();

        const values: number[] = [];

        const items = this.items;
        angularthis.calculateCheckedValues(items, values);
        this.selectedChange.emit(values);
      };
      this.isTreeviewFuncOverride = true;
    }
  }
  sitesLabel() {
    const str = this.translationPipe.getTraslatedValue('userAccount','sites');
    return str;
  }

}


export class SampleObject {
  text: string;
  value: number;
  checked?: boolean;
  children: SampleObject[];
}
