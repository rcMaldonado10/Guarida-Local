import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ReservasService {

  constructor(private http: Http) { }

   getReservas() {
     return this.http.get('http://localhost:3000/reservas')
        .map(res => res.json());
   }

   getReservationsByEspecific(date, floor, room) {
    return this.http.get('http://localhost:3000/reservas/' + date + '/' + floor + '/' + room)
      .map(res => res.json());
   }
  getReservationsByDate(date) {
    return this.http.get('http://localhost:3000/reservas/' + date)
      .map(res => res.json());
  }
   addReserva(reserva) {
     console.log(reserva);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post('http://localhost:3000/reservas', JSON.stringify(reserva), {headers: headers})
        .map(res => res.json());
   }

   deleteReservation(id) {
      return this.http.delete('http://localhost:3000/reservas/' + id)
          .map(res => res.json());
   }

   updateReservation(id) {
    console.log(id);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:3000/reservas/' + id, {headers: headers})
      .map(res => res.json());
   }
}
