import { Pipe, PipeTransform, Sanitizer, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'boldStrSpChar'
})
export class BoldStrSpCharPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  transform(value: string, filterStr, disabled = false): any {
    if(disabled) {
      return value;
    }
    return this.sanitize(this.replace(value, filterStr));
  }


  replace(str, filterStr) {

    str =  (str || '').toString();
    return str.replace(new RegExp('<b>|</b>', 'gi'), '').replace(new RegExp(this.escapeRegExp((filterStr || '')), 'gi'), str => `<b>${str == '' ? '&#8203' : str}</b>`);

  }

  sanitize(str) {
    return this.sanitizer.sanitize(SecurityContext.HTML, str);
  }

  escapeRegExp(text) {
    return text.replace(/[-+[\]{}()*+?.,\\^$|#]/g, '\\$&');
  }

}
