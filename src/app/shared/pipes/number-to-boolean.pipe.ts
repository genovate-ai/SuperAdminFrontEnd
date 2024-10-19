import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToBoolean'
})
export class NumberToBooleanPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if(value=="0"){
      return "False";
    }else if(value=="1"){
      return "True";
    }
  }

}
