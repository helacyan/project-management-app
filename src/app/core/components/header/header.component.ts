import { OpenCreateBoardModalService } from '../create-board-modal/services/open-create-board-modal.service';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  isSticky: boolean = false;

  constructor(private router: Router, private readonly openCreateBoardModalService: OpenCreateBoardModalService) {}

  ngOnInit(): void {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        if (localStorage.getItem('userInfo')) {
          let decoded: { iat: number } = jwt_decode(localStorage.getItem('userInfo') as string);
          let actualTimeInSeconds: number = Math.round(new Date().getTime() / 1000);
          let timeDelta = actualTimeInSeconds - decoded.iat;
          return timeDelta > 86400 ? localStorage.removeItem('userInfo') : null;
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public openCreateBoardModal() {
    const subscription = this.openCreateBoardModalService.openCreateBoardDialog().subscribe(res => console.log(res));
    this.subscriptions.push(subscription);
  }
}
