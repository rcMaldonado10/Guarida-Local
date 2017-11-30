import { Component } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AdminService]
})
export class AppComponent { }
