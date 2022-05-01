import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import SharedModule from '../shared/shared.module';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslocoRootModule } from '../transloco-root.module';
import { metaReducers, reducers } from '../store/reducers';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthInterceptor } from '../api/interceptors/auth.interceptor';
import { UtilsService } from '../api/services/utils/utils.service';

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
  deps: [UtilsService],
};

@NgModule({
  declarations: [HeaderComponent, FooterComponent, ModalComponent, ErrorPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    TranslocoRootModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  exports: [HeaderComponent, FooterComponent, ModalComponent, ErrorPageComponent],
  providers: [INTERCEPTOR_PROVIDER],
})
export default class CoreModule {}
