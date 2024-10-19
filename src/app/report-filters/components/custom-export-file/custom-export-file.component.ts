import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-custom-export-file',
  templateUrl: './custom-export-file.component.html',
  styleUrls: ['./custom-export-file.component.scss']
})
export class CustomExportFileComponent implements OnInit {

  @Output() exportCSV = new EventEmitter();

  @Input() tableId = 'table';
  @Input() fileName = 'download';
  @Input() jsonFormat = false;
  constructor() { }

  ngOnInit() {
  }

  exportFile() {
    if (this.jsonFormat) {
      this.exportCSV.emit(true);
    } else {
      const d = new Date();
      const _fileName = this.fileName + ' - ' + d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) +
                       ('0' + d.getDate()).slice(-2) + '_' + ('0' + d.getHours()).slice(-2) + '' + ('0' + d.getMinutes()).slice(-2);
      const csvRowsData = this.objectToCSV(this.tableId);
      this.downloadCSVFile(csvRowsData.join('\n'), `${_fileName}`);

    }
  }

  private objectToCSV(table) {

    const csv = [];
    const rows = document.querySelectorAll(`#${table} tr`);

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < rows.length; i++) {
      const row = [];
      const cols = rows[i].querySelectorAll('td, th');

      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < cols.length; j++) {
        row.push(this.getText(cols[j]));
      }

      csv.push(row.join(','));
    }

    return csv;

  }

  private getText(col) {
    const escaped = ('' + col.innerText).replace(/"/g, '\\"');
    return `"${escaped}"`;
  }

  private downloadCSVFile(data, fileName) {
    // tslint:disable-next-line: no-shadowed-variable
    const blob = new Blob([data], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidded', '');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName + '.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
