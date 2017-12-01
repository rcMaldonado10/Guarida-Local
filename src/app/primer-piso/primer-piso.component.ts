import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../services/reservas/reservas.service';
import { Reservas } from '../../Reservas';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-primer-piso',
  templateUrl: './primer-piso.component.html',
  styleUrls: ['./primer-piso.component.css'],
  providers: [ReservasService]
})
export class PrimerPisoComponent {

  public reservas: Reservas[]; // arreglo que recibe la informacion de la base de datos
  private date; // su valor es la fecha de la computadora
  private day; // el dia que tenga la computadora
  private month; // el mes que tenga la computadora
  private year; // el año que tenga la computadora

  private admin = JSON.parse(localStorage.getItem('admin'));

  public reservationHeader: string[] = ['ID', 'Nombre', 'Departamento', 'Hora Reservada',
                                        'Hora de Salida', 'Cant. Est.', 'Piso', 'Salon', 'Fecha', 'Reserva'];


  constructor(private reservasService: ReservasService, private authService: AuthService) {
    this.day = new Date().getDate().toString();
    if (+(this.day) < 10) {
      this.day = this.modifiedDay(this.day);
    }
    this.month = +(new Date().getMonth().toString()) + 1;
    this.year = new Date().getFullYear().toString();
    this.date = this.year + '-' + this.month + '-' + this.day;

    console.log(this.date);

    this.reservasService.getReservationsByDate(this.date).subscribe(reservas => {
    this.reservas = this.organizeByHour(reservas);
    });
  }

  setStatus(resID) {
    const res = this.reservas;
    for (let i = 0; i < this.reservas.length; i++) {
      if (this.reservas[i].status === 'Confirmar' && this.reservas[i]._id === resID) {
        // this.reservasService.updateReservation(resID).subscribe(data =>{
          this.reservas[i].status = 'Desalojar';
          this.reservas[i].style = 'btn btn-danger';
          // window.location.reload();
        // });
        i = this.reservas.length;
      } else if (this.reservas[i].status === 'Desalojar' && this.reservas[i]._id === resID) {
        this.reservasService.deleteReservation(resID).subscribe(data => {
          if (data.n === 1) {
            res.splice(i, 1);
          }
          window.location.reload();
        });
      }
    }
  }

  organizeByHour(organizedReservations) {
    let firstResHour: number;
    let nextFirstResHour: number;
    let diffHours: number;
    let minutesRes: number;
    let nextMinutesRes: number;
    let diffMinutes: number;

    if (organizedReservations !== []) {
      while (true) {
        let swapped = false;
        for (let j = 0; j < organizedReservations.length - 1; j++) {
          firstResHour = +(organizedReservations[j].horaSalida.charAt(0) + organizedReservations[j].horaSalida.charAt(1));
          nextFirstResHour = +(organizedReservations[j + 1].horaEntrada.charAt(0) + organizedReservations[j + 1].horaEntrada.charAt(1));
          diffHours = firstResHour - nextFirstResHour;
          if (diffHours > 0) {
            [organizedReservations[j], organizedReservations[j + 1]] = [organizedReservations[j + 1], organizedReservations[j]];
            swapped = true;
          } else if (diffHours === 0) {
            minutesRes = +(organizedReservations[j].horaSalida.charAt(3) + organizedReservations[j].horaSalida.charAt(4));
            nextMinutesRes = +(organizedReservations[j + 1].horaEntrada.charAt(3) + organizedReservations[j + 1].horaEntrada.charAt(4));
            diffMinutes = minutesRes - nextMinutesRes;
            if (diffMinutes > 0) {
              [organizedReservations[j], organizedReservations[j + 1]] = [organizedReservations[j + 1], organizedReservations[j]];
              swapped = true;
            }
          }
        }
        if (!swapped) {
          break;
        }
      }
    }
    return organizedReservations;
  }

  // Funcion que modifica el dia para que pueda encontrar reservas en la base de datos
  modifiedDay(day) {
    switch (day) {
      case '1':
        day = '01';
        break;
      case '2':
        day = '02';
        break;
      case '3':
        day = '03';
        break;
      case '4':
        day = '04';
        break;
      case '5':
        day = '05';
        break;
      case '6':
        day = '06';
        break;
      case '7':
        day = '07';
        break;
      case '8':
        day = '08';
        break;
      case '9':
        day = '09';
        break;
    }
    return day;
  }

  onLogout() {
    this.authService.logout();
  }
}
