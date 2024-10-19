import { Component, HostListener, NgZone, Renderer2 } from '@angular/core';
import { NotificationServiceService } from './shared/services/common/notification.service';
import { AuthService } from './shared/services/common/auth.service';
import { environment } from './../environments/environment';
import { TranslationConfigService } from './shared/services/common/translation-config.service';
import { AccountService } from 'src/app/shared/services/common/account.service';
import { LasturlAccessed } from './shared/services/common/urlAccessed.service';
import { ManageReportService } from './shared/services/manage-report-services/manage-report.service';
import { BaseFormComponent } from './shared/components/base-components/base-form.component';
import { PopupControllerService } from './shared/services/common/popup-controller.service';
import { ScreenNameService } from './shared/services/common/screen-name.service';
import { filter, map } from 'rxjs/operators';
import { SessionModel } from './shared/models/Session.Model';
import { NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';


declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Agrilift';
  mobileView = true;
  mobNoti = true;
  getData: boolean = true;

  constructor(
    private account: AccountService,
    private authService: AuthService,
    private router: Router, 
    protected auth: AuthService,
    private titleService: Title,
    private renderer: Renderer2) {

  }

  async ngOnInit() {

    let chk = environment.mobileView;
    if (chk === "enable") {
      this.mobileView = false;
      this.mobNoti = false;
    }

    window.addEventListener('storage', (event) => {
      if (event.key === 'logged_in') {
        this.authService.logout_tab();
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const titleProp = this.getTitle(this.router.routerState, this.router.routerState.root).join(' | ');
        const title = titleProp + ' | Agrilift Portal';
        this.titleService.setTitle(title);
        if (this.authService.isLoggedIn()) {
          let session: SessionModel = this.getSession();
          if (session) {
            gtag('set', {
              'page_path': event.urlAfterRedirects,
              'user_id': session.user.userId,
            });
            gtag('set', 'user_properties', {
              'userId': session.user.userId,
              'agriliftUserName': session.user.userFirstName // + ' ' +  session.user.userLastName
            })
          }
        } else {
          gtag('set', {
            'page_path': event.urlAfterRedirects,
          });
        }
        gtag('config', environment.google_analytics);
      }
    });

  }
  getTitle(state, parent) {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  returnStatus() {
    return this.account.menulocked;
  }
  ngOnDestroy() {
  }
  getSession() {
    return JSON.parse(localStorage.getItem('session'));
  }
  sidebarToggled = false;

  

  // Toggle sidebar
  toggleSidebar() {
    this.sidebarToggled = !this.sidebarToggled;
    if (this.sidebarToggled) {
      this.renderer.addClass(document.body, 'sidebar-toggled');
      this.collapseAllMenus();
    } else {
      this.renderer.removeClass(document.body, 'sidebar-toggled');
    }
  }

  // Collapse all menus
  collapseAllMenus() {
    const elements = document.querySelectorAll('.sidebar .collapse');
    elements.forEach(el => {
      (el as HTMLElement).classList.remove('show');
    });
  }

  // Close menus when window is resized below 768px
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;

    if (width < 768) {
      this.collapseAllMenus();
    }

    if (width < 480 && !this.sidebarToggled) {
      this.toggleSidebar();
    }
  }

  // Scroll-to-top button appears on scroll
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 100) {
      (scrollButton as HTMLElement).classList.add('show');
    } else {
      (scrollButton as HTMLElement).classList.remove('show');
    }
  }

  // Smooth scroll to top
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  logout() {
    this.auth.logout();  
  }
}
