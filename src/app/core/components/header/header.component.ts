import { OpenCreateBoardModalService } from '../create-board-modal/services/open-create-board-modal.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { LoaderService } from 'src/app/api/services/loader/loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isSticky: boolean = false;

  constructor(
    private router: Router,
    private readonly openCreateBoardModalService: OpenCreateBoardModalService,
    public loaderService: LoaderService
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

  openLoginPage() {
    this.router.navigate(['login']);
  }

  openRegistrationPage() {
    this.router.navigate(['signup']);
  }

  public redirectToMainPage(): void {
    this.router.navigate(['']);
  }

  public openCreateBoardModal() {
    this.openCreateBoardModalService.openCreateBoardDialog();
  }
}
