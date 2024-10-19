import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralTreeviewComponent } from './components/general-treeview/general-treeview.component';
import { TreeviewModule } from 'ngx-treeview';
import { GeneralModalComponent } from './components/general-modal/general-modal.component';
import { CreateUserComponent } from '../admin/components/users/create-user.component';
import { SharedModule } from '../shared/shared.module';
import { AncInputBoxComponent } from './components/anc-input-box/anc-input-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuggestionSelectBoxComponent } from './components/suggestion-select-box/suggestion-select-box.component';
import { DateSelectBoxComponent } from './components/date-select-box/date-select-box.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { HierarchySelectBoxComponent } from './components/hierarchy-select-box/hierarchy-select-box.component';
import { HierarchySelectBoxV2Component } from './components/hierarchy-select-box-v2/hierarchy-select-box-v2.component';
import { AncNumberBoxComponent } from './components/anc-number-box/anc-number-box.component';
import { ManageProfileComponent } from './components/user-profile/manage-profile.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatePickerIconComponent } from './components/date-picker-icon/date-picker-icon.component';



@NgModule({
  declarations: [GeneralTreeviewComponent, GeneralModalComponent, AncInputBoxComponent, SuggestionSelectBoxComponent, DateSelectBoxComponent,
                HierarchySelectBoxComponent,HierarchySelectBoxV2Component, AncNumberBoxComponent,ManageProfileComponent,DatePickerIconComponent],
  imports: [
    CommonModule,
    TreeviewModule.forRoot(),
    SharedModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    DpDatePickerModule,
  ],
  exports: [
    GeneralTreeviewComponent,
    GeneralModalComponent,
    AncInputBoxComponent,
    SuggestionSelectBoxComponent,
    DateSelectBoxComponent,
    HierarchySelectBoxComponent,
    HierarchySelectBoxV2Component,
    AncNumberBoxComponent,
    ManageProfileComponent,
    DatePickerIconComponent
  ]
})
export class GenericUiComponentsModule { }
