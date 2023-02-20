import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, map, startWith, catchError, of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Entretien } from '../Model/entretien';
import { Entretienresponse } from '../Model/entretienresponse';
import { AccountService } from '../Service/account.service';
import { EntretienService } from '../Service/entretien.service';
declare var $: any;

@Component({
  selector: 'app-entretien',
  templateUrl: './entretien.component.html',
  styleUrls: ['./entretien.component.scss']
})
export class EntretienComponent implements OnInit {

//Entretien Variable
entretien: Entretien = new Entretien();
entretienUpdate: Entretien = new Entretien()
entretienResponse!: Entretienresponse;
entretienId: number;
entretienState$!: Observable<{
  appStateEntretien: string;
  appDataEntretien?: Entretien;
  error?: HttpErrorResponse;
}>;
userpicture: string = '';
entretienPicture: File;


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
  subscriptions: Subscription[ ]=[];

constructor(
  private accountService: AccountService,
  private entretienService: EntretienService
) {}

ngOnInit(): void {
  this.getEntretien()
}
getEntretien(){

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
  this.entretienStateJury$ = this.entretienService
    .getAllEntretien(keyword, pageNo, pageSize, sortBy, sortDir)
    .pipe(
      map((response: Entretienresponse) => {
        // this.loadingService.loadingOff();
        this.responseSubject.next(response);
        this.currentPageSubject.next(pageNo);
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


}
goToNextOrPreviousPage(direction: string, name?: string): void {
  this.gotToPage(
    name,
    direction === 'forward'
      ? this.currentPageSubject.value + 1
      : this.currentPageSubject.value - 1
  );
}
//Ajouter Entretien
AjouterEntretien() {
  // this.loadingService.isLoading.next(true);
  if (
    this.entretien.entretienNom != '' &&
    this.entretien.description != '' &&
    this.entretien.dateDebut != null &&
    this.entretien.dateFin != null &&
    this.entretienPicture != null
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
        this.getEntretien();
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
          this.entretienService.uploadeEntretienPicture(
            this.entretienPicture,
            this.entretienUpdate.id
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
    this.getEntretien()
  }
)
}
//Importation Image
onProfilePictureSelected(event: any): void {
  console.log(event);
  this.entretienPicture = event.target.files[0] as File;
  console.log(this.entretienPicture);
  this.profilePictureChange = true;
}

}
