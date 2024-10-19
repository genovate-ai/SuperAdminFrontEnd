import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

  transform(value: any, decimalPlaces: number = 1): string {
    // Handle null and undefined values
    if (value === null || value === undefined) {
      return '';
    }

    // Check if the value is a number or can be converted to a number
    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      // If the value is not a number, return it as is (or handle it as needed)
      return value;
    }

    // Check if the number is an integer
    if (Number.isInteger(numberValue)) {
      return numberValue.toString();
    } else {
      return numberValue.toFixed(decimalPlaces);
    }
  }
}
