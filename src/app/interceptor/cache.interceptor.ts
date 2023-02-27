import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../Service/cache.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private host: string = environment.host;

  constructor(private cacheService: CacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.method !== 'GET') {
      this.cacheService.clearCache();
      return next.handle(req);
    }

    if (req.url.includes(`${this.host}/utilisateur/resetPassword/`)) {
      return next.handle(req);
    }

    if (req.url.includes(`${this.host}/utilisateur/register`)) {
      return next.handle(req);
    }

    if (req.url.includes(`${this.host}/utilisateur/login`)) {
      return next.handle(req);
    }

    if (req.url.includes(`${this.host}/utilisateur/findByUsername/`)) {
      return next.handle(req);
    }

    const cachedResponse: HttpResponse<any> = this.cacheService.getCache(req.url);

    if (cachedResponse) {
      return of (cachedResponse);
    }

    return next.handle(req)
    .pipe(tap(event => {
      if (event instanceof HttpResponse) {
      this.cacheService.cacheRequest(req.url, event);
    }}));

  }
}
