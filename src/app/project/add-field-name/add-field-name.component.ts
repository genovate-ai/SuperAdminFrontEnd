import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-field-name',
  templateUrl: './add-field-name.component.html',
  styleUrls: ['./add-field-name.component.scss']
})
export class AddFieldNameComponent implements OnInit {

  constructor() { }
  fieldNameForm: UntypedFormGroup;
  ngOnInit() {
    this.fieldNameForm = new UntypedFormGroup({
      fieldName: new UntypedFormControl(null)
      
    });
  }
  @Output() close = new EventEmitter<string>();
  onClose() {
    this.close.emit(null);
  }
  onSubmit(){

    this.close.emit(this.fieldNameForm.get("fieldName").value);
  }

}
