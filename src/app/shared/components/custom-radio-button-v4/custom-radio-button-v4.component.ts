import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslationConfigService } from '../../services/common/translation-config.service';

@Component({
  selector: 'app-custom-radio-button-v4',
  templateUrl: './custom-radio-button-v4.component.html',
  styleUrls: ['./custom-radio-button-v4.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: CustomRadioButtonV4Component, multi: true }
  ]
})
export class CustomRadioButtonV4Component implements OnInit, ControlValueAccessor {
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
  @Input() colorChange?: string;
  @Input() index?: string;


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
