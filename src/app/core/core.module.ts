import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import SharedModule from '../shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CreateBoardModalComponent } from './components/create-board-modal/create-board-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, ModalComponent, CreateBoardModalComponent],
  imports: [CommonModule, SharedModule, AngularSvgIconModule, ReactiveFormsModule],
  exports: [HeaderComponent, FooterComponent, ModalComponent],
})
export default class CoreModule {}
