import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "absNumber",
})
export class AbsNumberPipe implements PipeTransform {
  transform(value: any): any {
    // Handle null and undefined values
    if (value === null || value === undefined) {
      return "";
    }

    // Check if the value is a number or can be converted to a number
    const numberValue = Number(value);

    if (isNaN(numberValue)) {
      // If the value is not a number, return it as is (or handle it as needed)
      return value;
    }
    return Math.abs(numberValue);
    
  }
}
