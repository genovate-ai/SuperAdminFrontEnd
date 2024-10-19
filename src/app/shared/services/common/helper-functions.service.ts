import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperFunctionsServiceService {

  constructor() { }

  getBackendDateFormatFromNgbDatePicker({ day, month, year }) {

    return year + "-" + month + "-" + day
  }

  getNgbDatePickerFormatFromBackendFormat(dateString) {
    var date = new Date(dateString)
    return { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() }
  }
}
