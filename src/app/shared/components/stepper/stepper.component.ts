import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { delay } from 'q';
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

  arraySize: number;
  isActiveClasses: boolean[] = [];
  @Output() clickStepEvent = new EventEmitter<string>();
  @Input() stepNames: string[];
  @Input() darkTheme: boolean = false;
  @Input() isValid: boolean = false;
  @Input() activeStep:any;
  
  isBack = false;
  widthPercent = 100;
  constructor() { }

  ngOnInit() {
    this.initializeList();
  }
ngOnChanges(): void {
  //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //Add '${implements OnChanges}' to the class.
  this.listClick(this.activeStep)
  
}
  listClick(clickedStep) {
    this.clickStepEvent.emit(clickedStep);

    if (this.isValid) {
      for (let i = 0; i < this.arraySize; i++) {
        if (i < clickedStep) {
          this.isActiveClasses[i] = true;
        }
        else {
          this.isActiveClasses[i] = false;
        }
      }
    }
  }

  initializeList() {
    this.arraySize = this.stepNames.length;
    this.widthPercent = this.widthPercent / this.arraySize;
    this.isActiveClasses.push(true);
    for (let i = 1; i < this.arraySize; i++) {
      this.isActiveClasses.push(false);
    }
  }
}
