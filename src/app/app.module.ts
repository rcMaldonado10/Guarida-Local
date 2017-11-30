// import de librerias
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';

// import de componentes
import { AppComponent } from './app.component';
import { LogInComponent } from './log-in/log-in.component';
import { PrimerPisoComponent } from './primer-piso/primer-piso.component';
import { CrearReservaComponent } from './crear-reserva/crear-reserva.component';
import { DisponibleComponent } from './disponible/disponible.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';

// import de los Pipes
import { FilterIDPipe } from './filter-id.pipe';

// import del los services
import { ValidateService } from './services/validate/validate.service';
import { AuthService } from './services/auth/auth.service';

import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    PrimerPisoComponent,
    CrearReservaComponent,
    DisponibleComponent,
    FilterIDPipe,
    RegisterAdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlashMessagesModule,
    RouterModule.forRoot([
      {path: '', component: LogInComponent},
      {path: 'app-primer-piso', component: PrimerPisoComponent, canActivate: [AuthGuard]},
      { path: 'app-crear-reserva', component: CrearReservaComponent, canActivate: [AuthGuard]},
      { path: 'app-disponible', component: DisponibleComponent, canActivate: [AuthGuard]},
      { path: 'app-register-admin', component: RegisterAdminComponent, canActivate: [AuthGuard]}
    ])
  ],
  providers: [ValidateService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
