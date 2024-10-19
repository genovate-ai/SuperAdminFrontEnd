import { Injectable } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslationConfigService {

  // pipe: TranslatePipe
  constructor(private translate: TranslateService) {

    // translate.onDefaultLangChange.subscribe(() => {
    // })
    // this.translate.use(environment.default_lang)
    // this.setDefaultLang(environment.default_lang)


  }
  getDateFormatKey()
  {
    //  
    // const timeZoneFormat=this.account.user.userTimeZone;
    // const timeZone="timeZone"+timeZoneFormat;
    // return timeZone;
    return 'dateFormat.dateFormat';
  }


  setDefaultLang(lang) {
    this.translate.setDefaultLang(lang)
    this.translate.use(lang)
    // environment.default_lang=lang
   }
  getBrowserCultureLang() {
    return this.translate.getBrowserCultureLang()
  }

  getTranslation(value, cd) {
    return this.translate.get(value);
  }

  changeLanguage(locale: string) {
    this.translate.use(locale);
  }
  getTraslatedValue(key, prop) {
    const currentLang = this.translate.currentLang;
    const returnValue = this.translate.translations[currentLang][key][prop];
    if (returnValue === undefined) {
      return '';
      // return this.translate.translations.en_merch[str];
    } else {
      return returnValue;
    }
  }
}
