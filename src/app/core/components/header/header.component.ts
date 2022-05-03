import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OpenCreateBoardModalService } from '../create-board-modal/services/open-create-board-modal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router, private readonly openCreateBoardModalService: OpenCreateBoardModalService) {}

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
