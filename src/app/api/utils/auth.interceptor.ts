import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';

export class AuthInterceptor implements HttpInterceptor {
  constructor(private utils: UtilsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let cloned;
    cloned = !(req.url.includes('signin') || req.url.includes('signup'))
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${this.utils.getTokenFromStorage()}` },
        })
      : req.clone();
    return next.handle(cloned);
  }
}
