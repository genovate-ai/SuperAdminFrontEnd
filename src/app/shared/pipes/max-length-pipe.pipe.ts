import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLengthPipe'
})
export class MaxLengthPipePipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {

    if(value.length>args[0]){
     
      value=value.slice(0,args[0])
      value=value.concat('...')
    }

    return value;
  }

}
