import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import SharedModule from '../shared/shared.module';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoRootModule } from '../transloco-root.module';
import { AuthInterceptor } from '../api/interceptors/auth.interceptor';
import { UtilsService } from '../api/services/utils/utils.service';
import { AuthGuardService } from '../auth/guards/auth-guard.service';
import { ToastService } from '../api/services/auth/toast.service';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { state } from '../store/reducers';
import { CreateBoardModalComponent } from './components/create-board-modal/create-board-modal.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
  deps: [UtilsService, ToastService],
};

@NgModule({
  declarations: [HeaderComponent, FooterComponent, ModalComponent, ErrorPageComponent, CreateBoardModalComponent, WelcomePageComponent],
  imports: [
    CommonModule,
    SharedModule,
    AngularSvgIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoRootModule,
    StoreModule.forRoot(state, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  exports: [HeaderComponent, FooterComponent, ModalComponent, ErrorPageComponent, CreateBoardModalComponent],
  providers: [INTERCEPTOR_PROVIDER, AuthGuardService],
})
export default class CoreModule {}
