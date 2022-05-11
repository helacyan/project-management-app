import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import SharedModule from '../shared/shared.module';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../api/interceptors/auth.interceptor';
import { UtilsService } from '../api/services/utils/utils.service';
import { AuthGuardService } from '../auth/guards/auth-guard.service';
import { ToastService } from '../api/services/auth/toast.service';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { environment } from 'src/environments/environment';
import { metaReducers, reducers } from '../store/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { CreateBoardModalComponent } from './components/create-board-modal/create-board-modal.component';
import { HighlightFooterLinkDirective } from './directives/highlight-footer-link.directive';

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
  deps: [UtilsService, ToastService],
};

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ModalComponent,
    ErrorPageComponent,
    CreateBoardModalComponent,
    WelcomePageComponent,
    HighlightFooterLinkDirective,
  ],
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    ToastrModule.forRoot(),
  ],
  exports: [HeaderComponent, FooterComponent, ModalComponent, ErrorPageComponent, CreateBoardModalComponent],
  providers: [INTERCEPTOR_PROVIDER, AuthGuardService],
})
export default class CoreModule {}
