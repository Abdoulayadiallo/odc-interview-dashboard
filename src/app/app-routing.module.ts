import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CritereComponent } from './critere/critere.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EntretienComponent } from './entretien/entretien.component';
import { JuryComponent } from './jury/jury.component';
import { PostulantComponent } from './postulant/postulant.component';
import { ProfileComponent } from './profile/profile.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'entretien', component: EntretienComponent},
  {path: 'jury', component: JuryComponent},
  {path: 'postulant', component: PostulantComponent},
  {path: 'critere', component: CritereComponent},
  {path: 'questionnaire', component: QuestionnaireComponent},
  {path: 'profile', component: ProfileComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
