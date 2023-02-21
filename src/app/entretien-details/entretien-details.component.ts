import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  BehaviorSubject,
  catchError,
  map,
  of,
  startWith,
  Subscription,
} from 'rxjs';
import { Entretien } from '../Model/entretien';
import { JuryResponse } from '../Model/jury-response';
import { Postulantresponse } from '../Model/postulantresponse';
import { Utilisateur } from '../Model/utilisateur';
import { AccountService } from '../Service/account.service';
import { EntretienService } from '../Service/entretien.service';
import { PostulantService } from '../Service/postulant.service';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
declare var $: any;


@Component({
  selector: 'app-entretien-details',
  templateUrl: './entretien-details.component.html',
  styleUrls: ['./entretien-details.component.scss'],
})
export class EntretienDetailsComponent implements OnInit {
  id: any;
  entretien: Entretien = new Entretien();
  selectedPage: number;
  entretienPicture?: string;
  subcriptions: Subscription[] = [];
  //Postulant Liste
  postulantId: number;
  postulantResponse!: Postulantresponse;
  postulantState$!: Observable<{
    appState?: string;
    appData?: Postulantresponse;
    error?: HttpErrorResponse;
  }>;

  private currentPageSubject = new BehaviorSubject<number>(0);
  responseSubject = new BehaviorSubject<Postulantresponse>(
    this.postulantResponse
  );
  currentPage$ = this.currentPageSubject.asObservable();

  //Jury Liste
  juryResponse: JuryResponse = new JuryResponse();
  juryState$!: Observable<{
    appStateJury: string;
    appDataJury?: JuryResponse;
    errorJury?: HttpErrorResponse;
  }>;
  juryId: number
  //Jury ajout
  juryAjout: Utilisateur = new Utilisateur();

  private currentPageSubjectJury = new BehaviorSubject<number>(0);
  responseSubjectJury = new BehaviorSubject<JuryResponse>(this.juryResponse);
  currentPageJury$ = this.currentPageSubject.asObservable();
  excel: File;
  excelChange: boolean = false;
  postulantNombre: number;
  juryNombre: number;

  //Fin jury Liste
  genre = [
    { genre: 'M' },
    { genre: 'F' },
  ];
  constructor(
    private entretienService: EntretienService,
    private route: ActivatedRoute,
    private postulantService: PostulantService,
    private juryService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //Recuperer path variable id
    this.id = this.route.snapshot.params['id'];
    //Recuperer l'emplacement de l'image
    this.entretienPicture = this.entretienService?.imageentretien;
    this.getJurys();
    this.getPostulants();
    this.getEntretienById()
    this.getPostulantNombreParEntretien()
    this.getJuryNombreParEntretien()
  }


  //Postulant Liste
  getPostulants() {
    this.postulantState$ = this.postulantService
      .getAllPostulantByEntretien(this.id)
      .pipe(
        map((response: Postulantresponse) => {
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
  }
  getPostulantNombreParEntretien() {
    this.postulantService.getAllPostulantByEntretien(this.id).subscribe(
      data => {
        this.postulantNombre = data.totalElements
      }
    )
  }
  getJuryNombreParEntretien() {
    this.juryService.getAllJuryByEntretien(this.id).subscribe(
      data => {
        this.juryNombre = data.totalElements
      }
    )
  }

  //Jury liste
  getJurys() {
    this.juryState$ = this.juryService.getAllJuryByEntretien(this.id).pipe(
      map((response: JuryResponse) => {
        // this.loadingService.loadingOff();
        this.responseSubjectJury.next(response);
        this.currentPageSubjectJury.next(response.pageNo);
        console.log(response);
        return { appStateJury: 'APP_LOADED', appDataJury: response };
      }),
      startWith({
        appStateJury: 'APP_LOADED',
        appDataJury: this.responseSubjectJury.value,
      }),
      catchError((error: HttpErrorResponse) => {
        // this.loadingService.loadingOff();
        return of({ appStateJury: 'APP_ERROR', error });
      })
    );
  }

  //Naviguer entre les pages Postulants
  gotToPage(
    name: string = '',
    pageNo: number = 0,
    pageSize: number = 10,
    sortBy: string = '',
    sortDir: string = '',
    genre: string = ''
  ): void {
    // this.loadingService.loadingOn();
    this.postulantState$ = this.postulantService
      .getAllPostulantByEntretien(
        this.id,
        pageNo,
        pageSize,
        sortBy,
        sortDir,
        genre,
        name
      )
      .pipe(
        map((response: Postulantresponse) => {
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
  //Naviguer entre les pages Jury
  gotToPageJury(
    name: string = '',
    pageNo: number = 0,
    pageSize: number = 10,
    sortBy: string = '',
    sortDir: string = ''
  ): void {
    // this.loadingService.loadingOn();
    this.juryState$ = this.juryService
      .getAllJuryByEntretien(this.id, pageNo, pageSize, sortBy, sortDir, name)
      .pipe(
        map((response: JuryResponse) => {
          // this.loadingService.loadingOff();
          this.responseSubjectJury.next(response);
          this.currentPageSubjectJury.next(pageNo);
          console.log(response);
          return { appStateJury: 'APP_LOADED', appDataJury: response };
        }),
        startWith({
          appStateJury: 'APP_LOADED',
          appDataJury: this.responseSubjectJury.value,
        }),
        catchError((error: HttpErrorResponse) => {
          // this.loadingService.loadingOff();
          return of({ appStateJury: 'APP_ERROR', error });
        })
      );
  }
  goToNextOrPreviousPageJury(direction: string, name?: string): void {
    this.gotToPage(
      name,
      direction === 'forward'
        ? this.currentPageSubjectJury.value + 1
        : this.currentPageSubjectJury.value - 1
    );
  }
  //Recuperer Entretien par id
  getEntretienById() {
    this.entretienService.getOneEntretienById(this.id).subscribe((data) => {
      this.entretien = data;
    });
  }
  //Ajout jury

  AjouterJury(utilisateur: Utilisateur): void {
    // this.loadingService.isLoading.next(true);
    if (utilisateur.nom != null && utilisateur.prenom != null && utilisateur.email != null && utilisateur.genre != null) {

      console.log(utilisateur);
      this.subcriptions.push(
        this.juryService.addJury(utilisateur, this.id).subscribe(
          (response) => {
            // this.loadingService.isLoading.next(false);
            // this.alertService.showAlert(
            //   'You have registered successfully. Please check your email for account details.',
            //   AlertType.SUCCESS
            // );
            console.log(response);
            $('#addJuryModal').modal('hide');
            this.getJurys();

          },
          (error: HttpErrorResponse) => {
            console.log(error);
            const errorMsg: string = error.error;
            if (errorMsg == "email existe") {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Email exist déja. Veuillez réessayer avec un autre...',
                timer: 2000,
              });
            }
            if (errorMsg != "email existe") {
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Un problème est survenu. Veuillez réessayer...',
                timer: 2000,
              });
            }

          }
        )
      );
    }
  }

  //Importation du fichier excel
  onExcelFileSelected(event: any): void {
    console.log(event);
    this.excel = event.target.files[0] as File;
    console.log(this.entretienPicture);
    this.excelChange = true;
  }

  importer() {
    this.postulantService
      .UploadPostulant(this.id, this.excel)
      .subscribe((data) => {
        console.log(data);
        this.getPostulants();
        $('#importPostulantModal').modal('hide');
        Swal.fire({
          icon: 'success',
          title: 'Importation reussie',
          text: 'Postulants importés avec succès',
          timer: 2000,
        });
      });
  }
  //Recuperer Postulant Id
  getPostulantId(id: number) {
    this.postulantId = id;
    console.log(this.postulantId);
  }

  // Supprimer Postulant
  DeletePostulant() {
    this.postulantService
      .deletePostulant(this.postulantId)
      .subscribe((data) => {
        this.getPostulants()
        console.log(data);
      });
    this.getPostulants()
    Swal.fire({
      icon: 'success',
      title: 'suppression reussie',
      text: 'Postulant supprimé avec succès',
      timer: 2000,
    });
    $('#deletePostulantModal').modal('hide');
  }
  DownloadPostulant() {
    this.postulantService
      .DownloadPostulant(this.id)
      .subscribe((blob) => saveAs(blob, this.entretien?.entretienNom));
  }
  //Recuperer Jury par Id
  getJuryId(id: number) {
    this.juryId = id;
    console.log(this.juryId);
  }

  // Supprimer Jury
  DeleteJury() {
    this.juryService
      .deleteJury(this.juryId)
      .subscribe((data) => {
        this.getPostulants()
        console.log(data);
        Swal.fire({
          icon: 'success',
          title: 'Jury supprimé',
          text: 'Le jury supprimé',
          timer: 2000,
        });
        $('#deleteJuryModal').modal('hide');
        this.getJurys()
      },
        error => {
          if (error) {
            Swal.fire({
              icon: 'error',
              title: 'Une erreur est Survenue',
              text: 'Lors de la suppression du jury',
              timer: 2000,
            });
          }
        })
  }
  //Naviguer à la page Critere
  gotoCritere() {
    this.router.navigate(['/critere', this.id])
  }
}

