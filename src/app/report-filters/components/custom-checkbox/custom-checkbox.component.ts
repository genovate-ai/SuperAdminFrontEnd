import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { tree } from 'd3';

@Component({
  selector: 'report-custom-checkbox',
  template: `<div class="custom-control custom-checkbox">
                <input type="checkbox" [(ngModel)]="options.checked" (change)="onToggle()" class="custom-control-input" id="{{options.id}}">
                <label class="custom-control-label" for="{{options.id}}"><span class="bar mr-2 {{options.spanClass}}" ></span>{{options.label}}</label>
              </div>`,
  encapsulation: ViewEncapsulation.None
})
export class CustomCheckboxComponent implements OnInit {

  @Input() options: any;
  @Input() selectedValues: string[];
  @Output() toggle = new EventEmitter<any>();


  constructor() {}
  ngOnInit() {}

  onToggle() {
    const checkedOptions = this.options;     
    this.toggle.emit(true);
  }
}