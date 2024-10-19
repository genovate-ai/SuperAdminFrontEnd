import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterObjects',
  pure: false
})
export class FilterArrayOfObjectsPipe implements PipeTransform {

  transform(value: any, propName: string, filterString: string, arrLength = value.length): any {
    if (!value || (value.length === 0 || filterString === '' || filterString === null || filterString === undefined)) {
      if(value.length > 0 && filterString === '') {
        return value.slice(0, arrLength);
      } else {
        return value;
      }
    }
    const resultArray = [];
    const slicedArray = value.slice(0, arrLength);
    for (const item of slicedArray) {
      if ((item[propName] || '').toLowerCase().includes(filterString.toLowerCase())) {
        resultArray.push(item);
      }
    }
    return resultArray;
  }

}
