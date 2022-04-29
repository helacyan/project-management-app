import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import SharedModule from '../shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, ModalComponent],
  imports: [CommonModule, SharedModule, AngularSvgIconModule],
  exports: [HeaderComponent, FooterComponent, ModalComponent],
})
export default class CoreModule {}
