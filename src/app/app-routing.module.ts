import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CritereComponent } from './critere/critere.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EntretienDetailsComponent } from './entretien-details/entretien-details.component';
import { EntretienComponent } from './entretien/entretien.component';
import { AuthentificationGuard } from './guard/authentification.guard';
import { JuryDetailsComponent } from './jury-details/jury-details.component';
import { JuryComponent } from './jury/jury.component';
import { PostulantDetailsComponent } from './postulant-details/postulant-details.component';
import { PostulantComponent } from './postulant/postulant.component';
import { ProfileComponent } from './profile/profile.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'entretien', component: EntretienComponent},
  {path: 'jury', component: JuryComponent},
  {path: 'jury-details/:username', component: JuryDetailsComponent},
  {path: 'postulant', component: PostulantComponent},
  {path: 'postulant-details/:idPostulant', component: PostulantDetailsComponent},
  {path: 'critere/:idEntretien', component: CritereComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'entretien-details/:id', component: EntretienDetailsComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
