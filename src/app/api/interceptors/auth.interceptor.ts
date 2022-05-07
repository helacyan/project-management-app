import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastService } from '../services/auth/toast.service';
import { UtilsService } from '../services/utils/utils.service';

export class AuthInterceptor implements HttpInterceptor {
  constructor(private utils: UtilsService, private toast: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cloned =
      !(req.url.includes('signin') || req.url.includes('signup')) && req.url.includes('warm-ravine')
        ? req.clone({
            setHeaders: { Authorization: 'Bearer' + ' ' + this.utils.getTokenFromStorage() },
          })
        : req.clone();
    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toast.showToasterError(error.error.message);
        return throwError(() => 'Something went wrong');
      })
    );
  }
}
