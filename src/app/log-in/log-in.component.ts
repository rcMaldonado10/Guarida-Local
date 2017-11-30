import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  username: String;
  password: String;

  // Inicializo los servicios que se usaran en el componente de login
  constructor(private authService: AuthService,
              private flashMessage: FlashMessagesService,
              private router: Router) {
  }

  // ngOnInit() { }

  onLoginSubmit() {
    const admin = {
      username: this.username,
      password: this.password
    };

    this.authService.authenticateAdmin(admin).subscribe(data => {
      if (data.success) {
        this.authService.storeAdminData(data.token, data.admin);
        this.router.navigate(['/app-primer-piso']);
      } else {
        this.flashMessage.show('Verifique que la información entrada sea correcta', {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate(['/']);
      }
    });
  }
}
