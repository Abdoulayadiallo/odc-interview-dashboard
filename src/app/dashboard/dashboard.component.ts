import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  Subscription,
} from 'rxjs';
import { Entretien } from '../Model/entretien';
import { Entretienresponse } from '../Model/entretienresponse';
import { Postulantresponse } from '../Model/postulantresponse';
import { Utilisateur } from '../Model/utilisateur';
import { AccountService } from '../Service/account.service';
import { EntretienService } from '../Service/entretien.service';
import { PostulantService } from '../Service/postulant.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  entretienPicture: File;
  private subscriptions: Subscription[] = [];
  utilisateur: Utilisateur;
  userpicture: string;
  entretienNombre: number = 0;
  juryNombre: number;
  postulantNombre: number;
  MasculinNombre: number;
  FemininNombre: number;

  //Entretien Variable
  entretien: Entretien = new Entretien();
  entretienUpdate: Entretien = new Entretien()
  entretienResponse!: Entretienresponse;
  entretienId: number;
  postulantState$!: Observable<{
    appState: string;
    appData?: Entretien;
    error?: HttpErrorResponse;
  }>;

  private currentPageSubject = new BehaviorSubject<number>(0);
  responseSubject = new BehaviorSubject<Entretienresponse>(
    this.entretienResponse
  );
  currentPage$ = this.currentPageSubject.asObservable();

  entretienState$!: Observable<{
    appState: string;
    appData?: Entretienresponse;
    error?: HttpErrorResponse;
  }>;
  profilePictureChange: boolean;

  constructor(
    private accountService: AccountService,
    private postulantService: PostulantService,
    private entretienService: EntretienService
  ) {}

  ngOnInit(): void {
    this.userpicture = this.accountService.userPicture;
    if (this.accountService.loggInUsername) {
      const username = this.accountService.loggInUsername;
      if (username) {
        this.getUserInfo(username);
      }
    }

    //Postulant Nombre
    this.getAllPostulantNombre();
    //Entretien Nombre
    this.getAllEntretienNombre();
    //Jury Nombre
    this.getAlljuryNombre();
    //Postulant Par Genre
    this.getPostulantPargenre('M');
    this.getPostulantPargenre('F');

    //---------------Entretien Liste----------------------------
    this.entretienState$ = this.entretienService.getAllEntretien().pipe(
      map((response: Entretienresponse) => {
        // this.loadingService.loadingOff();
        this.responseSubject.next(response);
        this.currentPageSubject.next(response.pageNo);
        console.log(response);
        return { appState: 'APP_LOADED', appData: response };
      }),
      startWith({
        appState: 'APP_LOADED',
        appData: this.responseSubject.value,
      }),
      catchError((error: HttpErrorResponse) => {
        // this.loadingService.loadingOff();
        return of({ appState: 'APP_ERROR', error });
      })
    );
    //----------------- Fin Entretien Liste------------
  }
  //Naviguer entre page entretien
  gotToPage(
    keyword: string = '',
    pageNo: number = 0,
    pageSize: number = 10,
    sortBy: string = '',
    sortDir: string = ''
  ): void {
    // this.loadingService.loadingOn();
    this.entretienState$ = this.entretienService
      .getAllEntretien(keyword, pageNo, pageSize, sortBy, sortDir)
      .pipe(
        map((response: Entretienresponse) => {
          // this.loadingService.loadingOff();
          this.responseSubject.next(response);
          this.currentPageSubject.next(pageNo);
          console.log(response);

          return { appState: 'APP_LOADED', appData: response };
        }),
        startWith({
          appState: 'APP_LOADED',
          appData: this.responseSubject.value,
        }),
        catchError((error: HttpErrorResponse) => {
          // this.loadingService.loadingOff();
          return of({ appState: 'APP_ERROR', error });
        })
      );
  }
  goToNextOrPreviousPage(direction: string, name?: string): void {
    this.gotToPage(
      name,
      direction === 'forward'
        ? this.currentPageSubject.value + 1
        : this.currentPageSubject.value - 1
    );
  }
  //Importation Image
  onProfilePictureSelected(event: any): void {
    console.log(event);
    this.entretienPicture = event.target.files[0] as File;
    console.log(this.entretienPicture);
    this.profilePictureChange = true;
  }
  //Ajouter Entretien
  AjouterEntretien() {
    // this.loadingService.isLoading.next(true);
    this.entretienService.AjouterEntretien(this.entretien).subscribe(
      (response) => {
        //this.entretienId=entretien.id
        console.log(response);
        console.log(
          this.entretien + '-------------------------------------------'
        );
        if (this.profilePictureChange) {
          this.entretienService.uploadeUserEntretienPicture(
            this.entretienPicture,
            this.entretien.entretienNom
          );
        }
        this.getAllEntretienNombre();
        //const token: string|any = response.headers.get('Authorization');
        //this.accountService.saveToken(token);
        // if (this.accountService.redirectUrl) {
        //   this.router.navigateByUrl(this.accountService.redirectUrl);
        // } else {
        //   this.router.navigateByUrl('/tabs/home');
        // }
        // this.loadingService.isLoading.next(false);
      },
      (error) => {
        console.log(error);
        // this.loadingService.isLoading.next(false);
        // this.alerteService.presentToast(' <ion-icon name="warning" size="large"></ion-icon> Email ou mots de passe incorrecte',"danger")
      }
    );
  }

  // Recuperer Entretien Par Id
  GetEntretienById(id: number) {    
    this.entretienService.getOneEntretienById(id).subscribe((data) => {
      this.entretienId = data.id;
      console.log(data);
    });
  }

  //Modifier Entretien
  updateEntretien() {
    this.subscriptions.push(
      this.entretienService
        .ModifierEntretien(this.entretienId, this.entretienUpdate)
        .subscribe((data) => {
          console.log(this.entretienId);
          console.log(data);
          if (this.profilePictureChange) {
            this.entretienService.uploadeUserEntretienPicture(
              this.entretienPicture,
              this.entretienUpdate.entretienNom
            );
          }
        })
    );
  }
// Supprimer entretien
DeleteEntretien(){
  this.entretienService.deleteEntretien(this.entretienId).subscribe(
    data=>{
      console.log(data)
    }
  )
}
  getUserInfo(username: string): void {
    this.subscriptions.push(
      this.accountService.getUserInformation(username).subscribe(
        (response: Utilisateur) => {
          this.utilisateur = response;
          //this.idJury=response.id;
          //  this.usernameconnected=response.username
          //console.log("(-------------------------------)"+this.usernameconnected)
          // console.log(this.idJury)
          //this.nomEntretien= response.entretien.entretienNom
          // this.userpre=response.prenom
          // this.rolename=response.role.roleName
          //this.idEntretien=response.entretien.id
          //console.log(this.utilisateur)
        },
        (error) => {
          console.log(error);
          this.utilisateur = null;
        }
      )
    );
  }
  getAllEntretienNombre() {
    this.entretienService.getAllEntretien().subscribe((data) => {
      this.entretienNombre = data.totalElements;
      console.log(data);
    });
  }
  getAlljuryNombre() {
    this.accountService.getAllJury().subscribe((data) => {
      this.juryNombre = data.totalElements;
      console.log(data);
    });
  }
  getAllPostulantNombre() {
    this.postulantService.getAllPostulant().subscribe((data) => {
      this.postulantNombre = data.totalElements;
      console.log(data);
    });
  }
  // Liste Postulant Par genre
  getPostulantPargenre(genre: string) {
    this.postulantService.getAllPostulantNombre(genre).subscribe((data) => {
      console.log(data);
      if (genre == 'M') {
        this.MasculinNombre = data.pourcentage;
      }
      if (genre == 'F') {
        this.FemininNombre = data.pourcentage;
      }
    });
  }
}
