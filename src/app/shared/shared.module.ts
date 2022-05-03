import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ReactiveFormsModule } from '@angular/forms';

const MATERIAL_MODULES = [MatSlideToggleModule, MatButtonModule, MatIconModule, MatDialogModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, AngularSvgIconModule.forRoot(), ...MATERIAL_MODULES],
  exports: [CommonModule, HttpClientModule, ...MATERIAL_MODULES],
})
export default class SharedModule {}
