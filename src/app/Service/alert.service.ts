import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Alert } from '../Model/alert';
import { AlertType } from '../Model/alert-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  public alerts: Subject<Alert> = new Subject();

  constructor() {}

  showAlert(message: string, alterType: AlertType): void {
    const alert = new Alert(message, alterType);
    this.alerts.next(alert);
  }}
