import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslocoRootModule } from '../transloco-root.module';

const MATERIAL_MODULES = [
  MatSlideToggleModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatCardModule,
  MatCheckboxModule,
];

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TranslocoRootModule,
    ...MATERIAL_MODULES,
  ],
  exports: [
    HttpClientModule,
    AngularSvgIconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoRootModule,
    ...MATERIAL_MODULES,
  ],
})
export default class SharedModule {}
