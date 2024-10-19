import { SecurityContext } from '@angular/core';
import { Sanitizer } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'boldStr'
})
export class BoldStrPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  transform(value: string, filterStr): any {
    return this.sanitize(this.replace(value, filterStr));
  }

  //   private boldString(elem, find) {

  //   const regex = new RegExp(find, 'gi');
  //   const response = elem.replace(regex, str => `<b>${str}</b>`);
  //   return response;
  // }

  // private simpleString(str) {
  //   const re = new RegExp('<b>|</b>', 'gi');
  //   return str.replace(re, '');
  // }

  replace(str, filterStr) {
    // if(filterStr.trim() == '') {
    //   return str.replace(new RegExp('<b>|</b>', 'gi'), '');
    // } else {
    
    str =  (str || '').toString();
    let r = str.replace(new RegExp('<b>|</b>', 'gi'), '').replace(new RegExp(`${filterStr}`, 'gi'), str => `<b>${str == '' ? '&#8203' : str}</b>`);
    return r;
    // }
    // let regx = filterStr.trim() == '' ? new RegExp('<b>|</b>', 'gi') : new RegExp(`${filterStr}`, 'gi';
    // let b = str.replace(new RegExp(`${filterStr}`, 'gi'), str => `<b>${str}</b>`);
    // return b;
  }

  sanitize(str) {
    return this.sanitizer.sanitize(SecurityContext.HTML, (str||''));
  }

}
