import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PasswordChange } from '../Model/password-change';
import { Utilisateur } from '../Model/utilisateur';
import { AccountService } from '../Service/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profilePicture: File;
  profilePictureChange: boolean;
  private subscriptions: Subscription[] = [];
  utilisateur: Utilisateur = new Utilisateur;
  userpicture: string;
  username: string;
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    // if (this.accountService && this.accountService.userPicture) {
    this.userpicture = this.accountService.userPicture;
    this.getUserInfo(this.accountService.loggInUsername);
    console.log(this.accountService.loggInUsername)
    this.username = this.accountService.loggInUsername;
    // }
    // this.userpicture = this.accountService?.userPicture;
  }
  getUserInfo(username: string): void {
    this.subscriptions.push(
      this.accountService.getUserInformation(username).subscribe(
        (response: Utilisateur) => {
          this.utilisateur = response;
          console.log(response)
          console.log(this.utilisateur)
        },
        error => {
          console.log(error);
          this.utilisateur = null;
        }
      ));
  }

  onProfilePictureSelected(event: any): void {
    console.log(event);
    this.profilePicture = event.target.files[0] as File;
    console.log(this.profilePicture);
    this.profilePictureChange = true;
  }

  onUpdateUser(updatedUser: Utilisateur): void {
    this.subscriptions.push(
      this.accountService.updateUser(updatedUser).subscribe(
        response => {
          console.log(response);

        },
        error => {
          console.log(error);
          Swal.fire({
            icon: 'info',
            title: 'echec',
            text: 'La mise à jour du profile a échoué, essayer encore ...',
            timer: 5000,
          });
        }
      )
    );
  }
  ChangerProfilePhoto() {
    if (this.profilePictureChange) {
      this.accountService.uploadeUserProfilePicture(this.profilePicture);
    }
  }


  // Changer mots de passe
  onChangePassword(passwordChange: PasswordChange) {
    console.log(passwordChange);
    // const element: HTMLElement = document.getElementById(
    //   'changePasswordDismiss'
    // ) as HTMLElement;
    // element.click();
    // this.loadingService.isLoading.next(true);
    this.subscriptions.push(
      this.accountService.changePassword(passwordChange).subscribe(
        response => {
          console.log(response);
          // this.loadingService.isLoading.next(false);
          // this.alertService.presentToast(
          //   'Mots de passe modifier avec succès',
          //   "success"
          // );
        },
        error => {
          console.log(error);
          // this.loadingService.isLoading.next(false);
          const errorMsg: string = error.error;
          this.showErrorMessage(errorMsg);
        }
      )
    );

  }
  private showErrorMessage(errorMessage: string): void {
    if (errorMessage === 'Mots de passe ne correpondent pas') {
      // this.alertService.presentToast(
      //   'Mots ne corresponde pas, essayer encore.',
      //   "danger"
      // );
    } else if (errorMessage === 'Mot de passe actuel incorrect') {
      // this.alertService.presentToast(
      //   'Le mots de passe actuel incorrecte, essayer encore.',
      //   "danger"
      // );
    } else {
      // this.alertService.presentToast(
      //   'Le changement de mots de passe a echoué, essayer encore.',
      //   "danger"
      // );
    }
  }
}
