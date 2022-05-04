import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsService } from '../services/utils/utils.service';

export class AuthInterceptor implements HttpInterceptor {
  constructor(private utils: UtilsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cloned = !(req.url.includes('signin') || req.url.includes('signup'))
      ? req.clone({
          setHeaders: { Authorization: 'Bearer' + ' ' + this.utils.getTokenFromStorage() },
        })
      : req.clone();
    return next.handle(cloned);
  }
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwODNlMTA1My04MTA1LTRjNjUtYTU2Mi04YjIxZmNjNGEzYzMiLCJsb2dpbiI6InVzZXIwMDEiLCJpYXQiOjE2NTE2NDMyMjd9.La9ful2aSMW1DbtZFVuQ8orx2fcdEDPxcrIOzton3mk
