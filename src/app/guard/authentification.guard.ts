import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertType } from '../Model/alert-type.enum';
import { AccountService } from '../Service/account.service';
import { AlertService } from '../Service/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationGuard implements CanActivate {
  constructor(private accountService: AccountService, private alertService: AlertService,
    private router: Router) {}

canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
return this.isLoggedIn(state.url);
}

private isLoggedIn(url: string): boolean {
if (this.accountService.isLoggedIn) {
return true;
}
this.accountService.redirectUrl = url;
this.router.navigate(['/login']);
this.alertService.showAlert('You must be logged in to access this page', AlertType.DANGER);
return false;
}
  
}
