/*
This is a custom form control component. It has four inputs that are mentioned below. It supports only 
two options.

@Input() label1: This is the label of the first option 
@Input() value1: This is the value of the first option 
@Input() label2:  This is the label of the second option
@Input() value2: This is the value of the second option

label1 would be assigned to value1 if value1 is not defined and vice versa
similarly, label 2 will be assigned to value2 if value2 is not defined and viceversa


IMPORTANT NOTE: If the values of the labels are boolean. Please send true or false in string;
*/


import { Component, OnInit, Input, Output } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debug } from 'util';
import { TranslationConfigService } from 'src/app/shared/services/common/translation-config.service';

@Component({
  selector: 'app-custom-radio-button',
  templateUrl: './custom-radio-button.component.html',
  styleUrls: ['./custom.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: CustomRadioButtonComponent, multi: true }
  ]
})
export class CustomRadioButtonComponent implements OnInit, ControlValueAccessor {

  onChangeFunction: (value: string) => void;

  writeValue(value: any): void {
    // throw new Error("Method not implemented.");

    
    if (value === 'true') {
      value = "true"
      this.isValueTrue = true;
    } else if (value === 'false') {
      value = "false"
      this.isValueTrue = false;
    } else if (value === null || value === undefined) {
      value = this.value1
    }
    value = '' + value
    this.selectedValue = value
    this.selectLabel(this.selectedValue)
    // this.onChangeFunction(value)
  }
  registerOnChange(fn: any): void {
    // throw new Error("Method not implemented.");
    // 
    this.onChangeFunction = fn
  }
  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {

    this.disabled = isDisabled
  }



  constructor(private translationPipe: TranslationConfigService) { }

  saveChanges;

  @Input() label1: string
  @Input() value1: string
  @Input() label2: string
  @Input() value2: string

  selectedValue: string;
  selectedLabel: string;
  disabled: boolean;
  isValueTrue: boolean = true;
  ngOnInit() {

    this.translationPipe
    .getTranslation("errorMessages.invalidInputs", "")
    .subscribe((response) => {
      this.saveChanges = response;
    });
    if ((!this.label1 && !this.value1) || (!this.label2 && !this.value2)) {
      var error: Error = { name: this.saveChanges, message: this.saveChanges }
      console.error(error)
    }
    if (!this.value1) {
      this.value1 = this.label1;
    }
    if (!this.value2) {
      this.value2 = this.label2
    }
    if (!this.label1) {
      this.label1 = this.value1
    }
    if (!this.label2) {
      this.label2 = this.value2
    }
    this.selectedValue = this.value1
    this.selectLabel(this.selectedValue)
   
  }

  selectLabel(value) {
    if (value == this.value1) {
      this.selectedLabel = this.label1
    }
    if (value == this.value2) {
      this.selectedLabel = this.label2
    }
  }
  toggleCheck() {
    this.isValueTrue = !this.isValueTrue;
    if (this.selectedValue == this.value1) {
      this.selectedValue = this.value2;
    }
    else {
      this.selectedValue == this.value2
      this.selectedValue = this.value1
    }
    this.onChangeFunction(this.selectedValue)
    // this.selectedLabel=this.selectedValue
    this.selectLabel(this.selectedValue)
  }
}
