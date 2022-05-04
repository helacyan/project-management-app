import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UtilsService } from '../services/utils/utils.service';

export class AuthInterceptor implements HttpInterceptor {
  constructor(private utils: UtilsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cloned = !(req.url.includes('signin') || req.url.includes('signup'))
      ? req.clone({
          setHeaders: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkMDI2MDBlNy0xZjg0LTRmNTctOWExNS1iYzAzZTRhNDRhNmYiLCJsb2dpbiI6InVzZXIwMDEiLCJpYXQiOjE2NTE2OTExNzF9.rJf_jYEu7Ump3wUmc-9iWzNR5uCj9oPSj257jUFhaxQ',
          },
        })
      : req.clone();
    return next.handle(cloned);
  }
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwODNlMTA1My04MTA1LTRjNjUtYTU2Mi04YjIxZmNjNGEzYzMiLCJsb2dpbiI6InVzZXIwMDEiLCJpYXQiOjE2NTE2ODkzMjl9.7wo_LJhB-M2ZavOwjo4APyqWFk_fozhdhVQ2R7hIQXM
