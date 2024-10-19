import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-farm-filter',
  templateUrl: './farm-filter.component.html',
  styleUrls: ['./farm-filter.component.scss']
})
export class FarmFilterComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() Filterinput: any;
  filter: UntypedFormGroup;
  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {
    this.filter = this.formBuilder.group({
      Orderby: [null],
    });
    if(this.Filterinput != null)
    if(this.Filterinput.Orderby != null)
    this.filter.controls.Orderby.setValue(this.Filterinput.Orderby);
    
  }

  onClose(){
    this.close.emit();
  }

}
