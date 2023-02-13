import { Component } from '@angular/core';
import { AccountService } from './Service/account.service';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'odc-interview-dashboard';
  isSideNavCollapsed = false;
  screenWidth = 0;
 isAuthentification:boolean = false

  constructor(private accountService:AccountService){}
  isAuthenfication = this.accountService.isAuthentificate
  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
  
}
