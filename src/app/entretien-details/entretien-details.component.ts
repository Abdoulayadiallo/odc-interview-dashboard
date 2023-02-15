import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, catchError, map, of, startWith } from 'rxjs';
import { Entretien } from '../Model/entretien';
import { JuryResponse } from '../Model/jury-response';
import { Postulantresponse } from '../Model/postulantresponse';
import { AccountService } from '../Service/account.service';
import { EntretienService } from '../Service/entretien.service';
import { PostulantService } from '../Service/postulant.service';

@Component({
  selector: 'app-entretien-details',
  templateUrl: './entretien-details.component.html',
  styleUrls: ['./entretien-details.component.scss']
})
export class EntretienDetailsComponent implements OnInit {
  id: any;
  entretien: Entretien;
  selectedPage:number;
  entretienPicture: string
  //Postulant Liste
  postulantResponse!: Postulantresponse;
  postulantState$!: Observable<{
    appState: string;
    appData?: Postulantresponse;
    error?: HttpErrorResponse;
  }>;

  private currentPageSubject = new BehaviorSubject<number>(0);
  responseSubject = new BehaviorSubject<Postulantresponse>(
    this.postulantResponse
  );
  currentPage$ = this.currentPageSubject.asObservable();

  //Jury Liste
  juryResponse!: JuryResponse;
  juryState$!: Observable<{
    appState: string;
    appData?: JuryResponse;
    error?: HttpErrorResponse;
  }>;

  private currentPageSubjectJury = new BehaviorSubject<number>(0);
  responseSubjectJury = new BehaviorSubject<JuryResponse>(
    this.juryResponse
  );
  currentPageJury$ = this.currentPageSubject.asObservable();

  //Fin jury Liste

  constructor(
    private entretienService: EntretienService,
    private route: ActivatedRoute,
    private postulantService: PostulantService,
    private juryService: AccountService
  ) { }

  ngOnInit(): void {
    //Recuperer path variable id
    this.id = this.route.snapshot.params["id"]
    //Recuperer l'emplacement de l'image
    this.entretienPicture = this.entretienService.imageentretien

    //Recuperer la liste des Postulants
    this.getEntretienById()
    if (this.id) {

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
    if (this.id) {

      this.juryState$ = this.juryService
        .getAllJuryByEntretien(this.id)
        .pipe(
          map((response: JuryResponse) => {
            // this.loadingService.loadingOff();
            this.responseSubjectJury.next(response);
            this.currentPageSubjectJury.next(response.pageNo);
            console.log(response);
            return { appState: 'APP_LOADED', appData: response };
          }),
          startWith({
            appState: 'APP_LOADED',
            appData: this.responseSubjectJury.value,
          }),
          catchError((error: HttpErrorResponse) => {
            // this.loadingService.loadingOff();
            return of({ appState: 'APP_ERROR', error });
          })
        );
    }
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
    sortDir: string = '',
    genre: string = ''
  ): void {
    // this.loadingService.loadingOn();
    this.juryState$ = this.juryService
      .getAllJuryByEntretien(
        this.id,
        pageNo,
        pageSize,
        sortBy,
        sortDir,
        name
      )
      .pipe(
        map((response: JuryResponse) => {
          // this.loadingService.loadingOff();
          this.responseSubjectJury.next(response);
          this.currentPageSubjectJury.next(pageNo);
          console.log(response);
          return { appState: 'APP_LOADED', appData: response };
        }),
        startWith({
          appState: 'APP_LOADED',
          appData: this.responseSubjectJury.value,
        }),
        catchError((error: HttpErrorResponse) => {
          // this.loadingService.loadingOff();
          return of({ appState: 'APP_ERROR', error });
        })
      );
  }
  goToNextOrPreviousPageJury(direction: string, name?: string): void {
    this.gotToPage(
      name,
      direction === 'forward'
        ? this.currentPageSubject.value + 1
        : this.currentPageSubject.value - 1
    );
  }
  //Recuperer Entretien par id
  getEntretienById() {
    this.entretienService.getOneEntretienById(this.id).subscribe(
      (data) => {
        this.entretien = data
      }
    )
  }

}
