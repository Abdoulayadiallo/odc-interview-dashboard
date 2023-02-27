import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  Subscription,
} from 'rxjs';
import Swal from 'sweetalert2';
import { Entretien } from '../Model/entretien';
import { Entretienresponse } from '../Model/entretienresponse';
import { Utilisateur } from '../Model/utilisateur';
import { AccountService } from '../Service/account.service';
import { EntretienService } from '../Service/entretien.service';
import { PostulantService } from '../Service/postulant.service';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  pattern = /^[a-zA-Z0-9\s]*$/;
  entretienPicture: File;
  private subscriptions: Subscription[] = [];
  utilisateur: Utilisateur = new Utilisateur();
  userpicture: string = '';
  entretienNombre: number = 0;
  juryNombre: number = 0;
  postulantNombre: number = 0;
  MasculinNombre: number = 0;
  FemininNombre: number = 0;

  //Entretien Variable
  datedebutEntretienSuperieur=false;
  entretienNomSaisi = false;
  DateSaisi = false;
  entretien: Entretien = new Entretien();
  entretienUpdate: Entretien = new Entretien();
  entretienResponse!: Entretienresponse;
  entretienId: number;
  entretienState$!: Observable<{
    appStateEntretien: string;
    appDataEntretien?: Entretien;
    error?: HttpErrorResponse;
  }>;

  private currentPageSubject = new BehaviorSubject<number>(0);
  responseSubject = new BehaviorSubject<Entretienresponse>(
    this.entretienResponse
  );
  currentPage$ = this.currentPageSubject.asObservable();

  entretienStateJury$!: Observable<{
    appStateEntretien: string;
    appDataEntretien?: Entretienresponse;
    error?: HttpErrorResponse;
  }>;
  profilePictureChange: boolean;
  addEntretienForm: any;
  entretienSelectionne: Entretien;

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
    this.getEntretien();
  }
  getEntretien() {
    //---------------Entretien Liste----------------------------
    this.entretienStateJury$ = this.entretienService.getAllEntretien().pipe(
      map((response: Entretienresponse) => {
        // this.loadingService.loadingOff();
        this.responseSubject.next(response);
        this.currentPageSubject.next(response.pageNo);
        console.log(response);
        return { appStateEntretien: 'APP_LOADED', appDataEntretien: response };
      }),
      startWith({
        appStateEntretien: 'APP_LOADED',
        appDataEntretien: this.responseSubject.value,
      }),
      catchError((error: HttpErrorResponse) => {
        // this.loadingService.loadingOff();
        return of({ appStateEntretien: 'APP_ERROR', error });
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
    this.entretienStateJury$ = this.entretienService
      .getAllEntretien(keyword, pageNo, pageSize, sortBy, sortDir)
      .pipe(
        map((response: Entretienresponse) => {
          // this.loadingService.loadingOff();
          this.responseSubject.next(response);
          this.currentPageSubject.next(pageNo);
          console.log(response);

          return {
            appStateEntretien: 'APP_LOADED',
            appDataEntretien: response,
          };
        }),
        startWith({
          appStateEntretien: 'APP_LOADED',
          appDataEntretien: this.responseSubject.value,
        }),
        catchError((error: HttpErrorResponse) => {
          // this.loadingService.loadingOff();
          return of({ appStateEntretien: 'APP_ERROR', error });
        })
      );
    this.entretienStateJury$ = this.entretienService
      .getAllEntretien(keyword, pageNo, pageSize, sortBy, sortDir)
      .pipe(
        map((response: Entretienresponse) => {
          // this.loadingService.loadingOff();
          this.responseSubject.next(response);
          this.currentPageSubject.next(pageNo);
          console.log(response);

          return {
            appStateEntretien: 'APP_LOADED',
            appDataEntretien: response,
          };
        }),
        startWith({
          appStateEntretien: 'APP_LOADED',
          appDataEntretien: this.responseSubject.value,
        }),
        catchError((error: HttpErrorResponse) => {
          // this.loadingService.loadingOff();
          return of({ appStateEntretien: 'APP_ERROR', error });
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
    if (
      this.entretien.entretienNom != '' &&
      this.entretien.description != '' &&
      this.entretien.dateDebut != null &&
      this.entretien.dateFin != null &&
      this.entretienPicture != null && 
      this.pattern.test(this.entretien.entretienNom) &&
      this.pattern.test(this.entretien.description) 

    ) {
      this.entretienService.AjouterEntretien(this.entretien).subscribe(
        (response) => {
          //this.entretienId=entretien.id
          console.log(response);
          console.log(
            this.entretien + '-------------------------------------------'
          );
          Swal.fire({
            icon: 'success',
            title: 'Felicitation',
            text: 'Entretien ' + this.entretien.entretienNom + ' ajouté',
            timer: 5000,
          });
          $('#addEntretienModal').modal('hide');
          if (this.profilePictureChange) {
            this.entretienService.uploadeEntretienPicture(
              this.entretienPicture,
              response.id
            );
          }
          this.resetForm();
          this.getEntretien();
          this.getAllEntretienNombre();
          // this.loadingService.isLoading.next(false);
        },
        (error) => {
          console.log(error.error);
          if(error.error=="DateDebutSuperieurFin"){
            Swal.fire({
              icon: 'error',
              title: 'Une erreur est Survenue',
              text: 'La date de debut est superieure à la date de fin',
              timer: 2000,
            });
          }
          // this.loadingService.isLoading.next(false);
          // this.alerteService.presentToast(' <ion-icon name="warning" size="large"></ion-icon> Email ou mots de passe incorrecte',"danger")
        }
      );
    }
    this.entretienNomSaisi = !!this.entretien.entretienNom;
  }
  resetForm() {
    this.entretienPicture = null;
    this.entretien = new Entretien();
  }

  // Recuperer Entretien Par Id
  GetEntretienById(id: number) {
    this.entretienService.getOneEntretienById(id).subscribe((data) => {
      this.entretienId = data.id;
      this.entretienSelectionne = data;
      this.entretienUpdate = data;
      console.log(data);
    });
  }

  //Modifier Entretien
  updateEntretien() {
    if (
      this.entretienUpdate.entretienNom != '' &&
      this.entretienUpdate.description != '' &&
      this.entretienUpdate.dateDebut != null &&
      this.entretienUpdate.dateFin != null &&
      this.pattern.test(this.entretienUpdate.entretienNom) &&
      this.pattern.test(this.entretienUpdate.description) 
    ) {
      this.subscriptions.push(
        this.entretienService
          .ModifierEntretien(this.entretienId, this.entretienUpdate)
          .subscribe((data) => {
            console.log(this.entretienId);
            console.log(data);
            if (this.profilePictureChange) {
              this.entretienService.uploadeEntretienPicture(
                this.entretienPicture,
                this.entretienUpdate.id
              );
            }
            this.getEntretien();
            $('#editEntretienModal').modal('hide');
            Swal.fire({
              icon: 'success',
              title: 'Felicitation',
              text:
                'Entretien ' +
                this.entretienSelectionne.entretienNom +
                ' modifié',
              timer: 3000,
            });
          })
      );
    }
  }
  // Supprimer entretien
  DeleteEntretien() {
    if (this.entretienId) {
      this.entretienService
        .deleteEntretien(this.entretienId)
        .subscribe((data) => {
          console.log(data);
          this.getEntretien();
          $('#deleteEntretienModal').modal('hide');
          Swal.fire({
            icon: 'success',
            title: 'Felicitation',
            text:
              'Entretien ' +
              this.entretienSelectionne.entretienNom +
              ' supprimé',
            timer: 3000,
          });
        });
    }
  }
  getPostulantByEntretien() {}
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
    this.entretienService.getAllEntretienNombre().subscribe((data) => {
      if (data) {
        this.entretienNombre = data.totalElements;
        console.log(data);
      }
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
