import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Observable,
  BehaviorSubject,
  map,
  startWith,
  catchError,
  of,
} from 'rxjs';
import { Postulantresponse } from '../Model/postulantresponse';
import { Utilisateur } from '../Model/utilisateur';
import { AccountService } from '../Service/account.service';
import { PostulantService } from '../Service/postulant.service';

@Component({
  selector: 'app-jury-details',
  templateUrl: './jury-details.component.html',
  styleUrls: ['./jury-details.component.scss'],
})
export class JuryDetailsComponent implements OnInit {
  idJury: any;
  jury: Utilisateur = new Utilisateur();

  //Postulant Variable
  postulantResponse: Postulantresponse = new Postulantresponse();
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
selectedPage: any;
  postulantId: number;
  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private postulantService: PostulantService
  ) {}

  ngOnInit(): void {
    this.idJury = this.route.snapshot.params['idJury'];
    this.getPostulantParJury();
  }
  getJuryById() {
    this.accountService.getOneJuryById(this.idJury).subscribe((data) => {
      this.jury = data;
    });
  }
  getPostulantParJury() {
    this.postulantState$ = this.postulantService
      .getAllPostulantByJury(this.idJury)
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
  gotToPage(
    name: string = '',
    pageNo: number = 0,
    pageSize: number = 10,
    sortBy: string = '',
    sortDir: string = ''
  ): void {
    // this.loadingService.loadingOn();
    this.postulantState$ = this.postulantService
      .getAllPostulantByJury(
        this.idJury,
        pageNo,
        pageSize,
        sortBy,
        sortDir,
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
    //Recuperer Postulant Id
    getPostulantId(id: number) {
      this.postulantId = id;
      console.log(this.postulantId);
    }
}
