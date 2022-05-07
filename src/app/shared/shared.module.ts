import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

const MATERIAL_MODULES = [MatSlideToggleModule, MatButtonModule, MatIconModule, MatDialogModule, MatInputModule];

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, AngularSvgIconModule.forRoot(), ReactiveFormsModule, ...MATERIAL_MODULES],
  exports: [CommonModule, HttpClientModule, AngularSvgIconModule, ReactiveFormsModule, ...MATERIAL_MODULES],
})
export default class SharedModule {}
