import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core'
import { TranslationConfigService } from '../services/common/translation-config.service';

@Pipe({
  name: 'translation',pure:false
})
export class TranslationPipe implements PipeTransform {

  constructor(private cd: ChangeDetectorRef, private translate: TranslationConfigService) {

  }
  transform(value: any, args?: any): any {

    return this.translate.getTranslation(value, this.cd)
  }

}
