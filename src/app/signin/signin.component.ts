import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AlertType } from '../Model/alert-type.enum';
import { Utilisateur } from '../Model/utilisateur';
import { AccountService } from '../Service/account.service';
import { AlertService } from '../Service/alert.service';
import { LoadingService } from '../Service/loading.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit{

  private subscriptions: Subscription[] = [];
  public isForgetpass=false;
  form :any
  constructor(
    private router: Router,
    private accountService: AccountService,
    private alerteService: AlertService,
    private loadingService:LoadingService
  ) {}

  ngOnInit() {
    if (this.accountService.isLoggedIn()) {
      if (this.accountService.redirectUrl) {
        this.router.navigateByUrl(this.accountService.redirectUrl);
      } else {
        this.router.navigateByUrl('/dashboard');
      }
    } else {
      this.router.navigateByUrl('/signin');
    }
  }

  onLogin(utilisateur: Utilisateur): void {
    // this.loadingService.isLoading.next(true);
    console.log(utilisateur);
    this.subscriptions.push(
      this.accountService.login(utilisateur).subscribe(
        response => {
          const token: string|any = response.headers.get('Authorization');
          this.accountService.saveToken(token);
          if (this.accountService.redirectUrl) {
            this.router.navigateByUrl(this.accountService.redirectUrl);
          } else {
            this.router.navigateByUrl('/dashboard');
          }
          // this.loadingService.isLoading.next(false);
        },
        error => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Email ou mots de passe incorrectes. Veuillez réessayer avec un autre...',
            timer: 2000,
          });
          this.loadingService.isLoading.next(false);
          this.alerteService.showAlert('Email ou mots de passe incorrecte',AlertType.DANGER)
        }
      )
    );
  }

  onResetpassword(form:any): void {
    this.loadingService.isLoading.next(true);
    console.log(form.email);
    const email: string = form.email;
    this.subscriptions.push(
      this.accountService.resetPassword(email).subscribe(
        response => {
          console.log(response);
          this.loadingService.isLoading.next(false);
          this.alerteService.showAlert(
            "Un nouveau mots vous a été envoyé.",
            AlertType.SUCCESS
          );
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          const errorMsg = error.error;
          if (errorMsg === 'email non trouvé') {
            this.alerteService.showAlert(
              "Cet email n'existe pas verifié encore.",
              AlertType.DANGER
            );
          }
          if (errorMsg !== 'email non trouvé') {
            this.alerteService.showAlert(
              "Une erreur est survenue verifié essayer encore.",
              AlertType.DANGER
            );
          }
          this.loadingService.isLoading.next(false);
        }
      )
    );
  }


}
