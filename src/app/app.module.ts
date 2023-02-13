import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { PostulantComponent } from './postulant/postulant.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JuryComponent } from './jury/jury.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ProfileComponent } from './profile/profile.component';
import { CritereComponent } from './critere/critere.component';
import { EntretienComponent } from './entretien/entretien.component';
import { BodyComponent } from "./body/body.component";
import { SigninComponent } from './signin/signin.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PostulantDetailsComponent } from './postulant-details/postulant-details.component';
import { JuryDetailsComponent } from './jury-details/jury-details.component';
import { HeaderComponent } from './header/header.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { EntretienDetailsComponent } from './entretien-details/entretien-details.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { CacheInterceptor } from './interceptor/cache.interceptor';
import { AccountService } from './Service/account.service';
import { EntretienService } from './Service/entretien.service';
import { PostulantService } from './Service/postulant.service';
import { AlertService } from './Service/alert.service';
import { CritereService } from './Service/critere.service';
import { NoteService } from './Service/note.service';
import { QuestionService } from './Service/question.service';
import { CacheService } from './Service/cache.service';
import { LoadingService } from './Service/loading.service';


@NgModule({
    declarations: [
        AppComponent,
        AccueilComponent,
        PostulantComponent,
        SidebarComponent,
        DashboardComponent,
        JuryComponent,
        QuestionnaireComponent,
        ProfileComponent,
        CritereComponent,
        EntretienComponent,
        BodyComponent,
        SigninComponent,
        PostulantDetailsComponent,
        JuryDetailsComponent,
        HeaderComponent,
        EntretienDetailsComponent,
    ],
    providers: [
        AccountService,
        EntretienService,
        PostulantService,
        AlertService,
        CritereService,
        NoteService,
        NoteService,
        QuestionService,
        CacheService,
        LoadingService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgCircleProgressModule.forRoot({
            responsive: true,
            // set defaults here
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 300,
            showSubtitle: false
        }),
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatDividerModule,
        MatListModule


        // NgxLoadingModule.forRoot({})
    ]
})
export class AppModule { }
