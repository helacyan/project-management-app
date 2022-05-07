import { OpenCreateBoardModalService } from '../create-board-modal/services/open-create-board-modal.service';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UsersService } from 'src/app/api/services/users/users.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private usersService: UsersService,
    private readonly openCreateBoardModalService: OpenCreateBoardModalService
  ) {}

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

  openLoginPage() {
    this.router.navigate(['login']);
  }

  openRegistrationPage() {
    this.router.navigate(['register']);
  }

  public openCreateBoardModal() {
    this.openCreateBoardModalService.openCreateBoardDialog().forEach(res => console.log(res));
  }
}
