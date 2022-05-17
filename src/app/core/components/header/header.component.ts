import { OpenCreateBoardModalService } from '../create-board-modal/services/open-create-board-modal.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { UtilsService } from 'src/app/api/services/utils/utils.service';
import { TranslocoService } from '@ngneat/transloco';
import { LoaderService } from 'src/app/api/services/loader/loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isSticky: boolean = false;

  language = 'ENG';
    
  constructor(
    private router: Router,
    private readonly openCreateBoardModalService: OpenCreateBoardModalService,
    public loaderService: LoaderService,
    public utils: UtilsService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        if (localStorage.getItem('userToken')) {
          let decoded: { iat: number } = jwt_decode(localStorage.getItem('userToken') as string);
          let actualTimeInSeconds: number = Math.round(new Date().getTime() / 1000);
          let timeDelta = actualTimeInSeconds - decoded.iat;
          return timeDelta > 86400 ? localStorage.removeItem('userToken') : null;
        }
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset > 0;
  }

  public openCreateBoardModal() {
    this.openCreateBoardModalService.openCreateBoardDialog();
  }

  public logOut() {
    localStorage.clear();
    this.router.navigate(['/welcome']);
  }

  public toggleLanguage() {
    return this.translocoService.getActiveLang() == 'en'
      ? (this.translocoService.setActiveLang('ru'), (this.language = 'RUS'))
      : (this.translocoService.setActiveLang('en'), (this.language = 'ENG'));
  }
}
