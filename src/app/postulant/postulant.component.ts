import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith, Subscription } from 'rxjs';
import { Postulantresponse } from '../Model/postulantresponse';
import { PostulantService } from '../Service/postulant.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-postulant',
  templateUrl: './postulant.component.html',
  styleUrls: ['./postulant.component.scss']
})
export class PostulantComponent implements OnInit {

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

  constructor(    private postulantService: PostulantService,
    ) { }

  ngOnInit(): void {
    this.getPostulants();
  }
  //Postulant Liste
  getPostulants() {
    this.postulantState$ = this.postulantService
      .getAllPostulant()
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
      .getAllPostulant(
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
  
  importer() {
    this.postulantService
      // .UploadPostulant(this.id, this.excel)
      // .subscribe((data) => {
      //   console.log(data);
      //   setTimeout(()=>{
      //     this.getPostulants();
      //   },20)
      // });
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
      this.gotToPage()
  }
//Telecharger tous les postulants
DownloadAllPostulant() {
  this.postulantService
    .DownloadAllPostulant()
    .subscribe((blob) => saveAs(blob, "tous_les_postulants"));
}

}
