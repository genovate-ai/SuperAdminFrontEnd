import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "report-custom-selectbox",
  template: `
  <select name="{{ options?.name }}" id="{{ options?.id }}" class="{{ obj?.classNames }}" (change)="onSelected($event)">
    <ng-container *ngFor="let obj of options.option">
      <option value="{{ obj.value }}">{{ obj.label }}</option>
    </ng-container>
  </select>
  `
  // styleUrls: ["./custom-selectbox.component.scss"]
})
export class CustomSelectboxComponent implements OnInit {
  @Input() options: any;
  @Output() selected = new EventEmitter<any>();

  obj: any;
   constructor() {}

  ngOnInit() {}
  onSelected(event) {
  }
}
