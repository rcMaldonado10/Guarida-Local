import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../services/reservas/reservas.service';
import { Reservas } from '../../Reservas';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-disponible',
  templateUrl: './disponible.component.html',
  styleUrls: ['./disponible.component.css'],
  providers: [ReservasService]
})
export class DisponibleComponent implements OnInit {

  reservas: Reservas[];
  available: Object[] = [];
  dateDesired;

  private date; // su valor es la fecha de la computadora
  private day; // el dia que tenga la computadora
  private month; // el mes que tenga la computadora
  private year; // el año que tenga la computadora

  admin = JSON.parse(localStorage.getItem('admin'));

  constructor(private reservasService: ReservasService, private authService: AuthService) {
    this.day = (new Date().getDate()).toString(); // Verifica la fecha que de el dia correcto el 4 de diciembre dio el 5.
    if (+(this.day) < 10) {
      this.day = this.modifiedDay(this.day);
    }
    this.month = +(new Date().getMonth().toString()) + 1;
    this.year = new Date().getFullYear().toString();
    this.date = this.year + '-' + this.month + '-' + this.day;
    this.dateDesired = this.date;
  }

  ngOnInit() {
    /* recibo las reservas para buscar a que horas hay reserva y a
     partir de hay busco las horas en la que no hay reserva */
    this.reservasService.getReservationsByDate(this.dateDesired).subscribe(reservas => {
      this.reservas = reservas;
    });
  }

  // La funcion search() esta hecha para buscar los espacios disponibles en una reserva
  // que este hecha, esta compara la hora de salida de una y la hora de entrada de la
  // otra para ver si hay una diferencia, ya que si la hay entonces hay un espacio
  // disponible en estas reservas. De no haber una reserva entonces indica que esta
  // disponible desde el "startingLimit" y el "endingLimit".

  search() {
    let resHour; // Toma la primera reserva que hay en la coleccion de reserva
    let nextResHour; // Toma la proxima reserva de la coleccion
    let floor = '1'; // Indica el piso en el que estamos
    let room = this.getFloorAndRoom(floor); // Devuelve cuantos salones hay dependiendo de el piso
    let roomRes; // Recibe un arreglo en donde el piso, el salon y la fecha de reservas es el mismo
    let flag = -2; /* Determina cuantas veces el loop Megalodon va a correr debido a que hay 3 pisos. El loop va a correr 3 veces ya que
                  termina cuando llegue a cero.*/
    let floorAndRoom;
    let nextFloorAndRoom;
    let primerDigito; // obtiene el primer digito de la primera reserva en el arreglo
    let segundoDigito; // obtiene el segundo digito de la primer reserva en el arreglo
    let nextPrimerDigito; // obtiene el primer digito de la segunda reserva en el arreglo
    let nextSegundoDigito; // obtiene el segundo digito de la segunda reserva en el arreglo
    let diff; // Diferencia de las reservas, si hay diferencia entonces hay un tiempo disponible
    let tercerDigito; // obtiene el tercer digito de la primera reserva en el arreglo
    let cuartoDigito; // obtiene el cuarto digito de la primera reserva en el arreglo
    let nextTercerDigito; // obtiene el tercer digito de la segunda reserva en el arreglo
    let nextCuartoDigito; // obtiene el cuarto digito de la segunda reserva en el arreglo
    let minutosInicial; // junto tercerDigito y cuartoDigito para tener los minutos de la primera reserva
    let minutosFinal; // junto nextTercerDigito y nextCuartoDigito para tener los minutos de la proxima reserva
    let minutoStr; // se cambia los valores de los minutos de la primera reserva del arreglo
    let minutoFinalStr; // se cambia los valores de los minutos de la segunda reserva del arreglo
    let timeInterval; // Obtiene el intervalo de tiempo en que un salon se puede reservar
    let timeIntervalInical; /* Obtiene la hora despues de calcular los minutos iniciales. Tambien muestra la primera hora que se presenta
                              en los intervalos de tiempo de disponiblidad*/
    let timeIntervalFinal; // Obtiene la hora final cuando los mintuos execeden de 60 y debe hacer el arreglo para que se vea bien
    let hourStr; // Le quita uno a la hora para asegurar que presenta la hora correcta
    const startingLimit = '8:00'; // Limite en donde empiezan las reservas
    const endingLimit = '21:00'; // Limite en donde terminan las reservas

    /* Esto es utilizado para ver que si hay data en el arreglo,
    se elimina para hacer espacio para data nueva */
    if (this.available !== undefined) {
      this.available.splice(0);
    }

    for (let j = 0; j < room.length; j++) {
      roomRes = this.sortByRoom(room[j], floor);
      if (roomRes[j] === undefined) {
        // console.log("nada");
        this.available.push({
          'piso': floor,
          'salon': room[j],
          'content': this.getContentByFloorAndRoom(floor, room[j]),
          'timeAvailable': startingLimit + ' - ' + endingLimit,
          'status': 'Crear'
        });
      }
      // Loop Llamado Megalodon. Aqui es donde esta la carne de como se logran las busquedas de las reservas
      // buscando por el piso y por el salon de cada reserva.
      for (let i = 0; i < roomRes.length - 1; i++) {
        // En estas dos lineas de codigo verifico que el piso y el salon de una reserva sea el mismo
        // para entonces tomar las reservas de eso salones
        floorAndRoom = roomRes[i].piso === floor && roomRes[i].numSalon === room[j];
        nextFloorAndRoom = roomRes[i + 1].piso === floor && roomRes[i + 1].numSalon === room[j];

        if (floorAndRoom) {
          primerDigito = roomRes[i].horaSalida.charAt(0); // Tomo el primer digito de la hora
          segundoDigito = roomRes[i].horaSalida.charAt(1); // Tomo el segundo digito de la hora

          // resHour toma la hora de salida de una reserva para entonces compararla
          // con la hora de la proxima reserva
          resHour = +(primerDigito + segundoDigito); // De string los convierto a number
        }

        if (nextFloorAndRoom) {

          nextPrimerDigito = roomRes[i + 1].horaEntrada.charAt(0);
          nextSegundoDigito = roomRes[i + 1].horaEntrada.charAt(1);
          nextResHour = +(nextPrimerDigito + nextSegundoDigito); // De string los convierto a number
          console.log(nextResHour);
        }

        if (floorAndRoom === true && nextFloorAndRoom === true) {
          diff = resHour - nextResHour;
          console.log(resHour + 'resHour');
          console.log(nextResHour + 'nextResHour');
          console.log(diff + 'diff');
          if (diff < 0) {
            tercerDigito = roomRes[i].horaSalida.charAt(3); // Primer minuto de la hora de salida de la reserva
            cuartoDigito = roomRes[i].horaSalida.charAt(4); // Segundo minuto de la hora de salida de la reserva

            nextTercerDigito = roomRes[i + 1].horaEntrada.charAt(3); // Primer minuto de la hora de entrada de la proxima reserva
            nextCuartoDigito = roomRes[i + 1].horaEntrada.charAt(4); // Segundo minuto de la hora de entrada de la proxima reserva

            minutosInicial = (+(tercerDigito + cuartoDigito));
            minutosFinal = (+(nextTercerDigito + nextCuartoDigito));

            console.log(minutosInicial);

            /* Si los minutos son enteros de un solo digito, este if los cambia a un numero de doble digito 
               para que se vea como numero de hora. Si los minutos son de doble digito entonces los minutos
               son asignados a la hora. */
            if (minutosInicial < 10) {
              minutoStr = this.setMinutes(minutosInicial);
              minutoFinalStr = this.setMinutes(minutosFinal);
              timeIntervalInical = primerDigito + segundoDigito + ':' + minutoStr;
            } else {
              timeIntervalInical = primerDigito + segundoDigito + ':' + minutosInicial;
            }
            // if se encarga de que si los minutos de una reserva es 0 lo cambia a string y lo pone 00 para que se vea como numero de hora
            if (minutosFinal === 0) {
              minutoFinalStr = this.setMinutes(minutosFinal);
              hourStr = +(nextPrimerDigito + nextSegundoDigito);
              timeIntervalFinal = hourStr + ':' + minutoFinalStr;
            } else {
              timeIntervalFinal = nextPrimerDigito + nextSegundoDigito + ':' + minutosFinal;
            }
            this.available.push({
              'piso': roomRes[i].piso,
              'salon': roomRes[i].numSalon,
              'content': this.getContentByFloorAndRoom(roomRes[i].piso, roomRes[i].numSalon),
              'timeAvailable': (timeIntervalInical + '-' + timeIntervalFinal),
              'status': 'Crear'
            });
            console.log(this.available);
          } else { // Este else evaula disponibilidad cuando la diferencia de hora (diff) es igual a cero.
            // console.log(diff + "hola");
            tercerDigito = roomRes[i].horaSalida.charAt(3); // Primer minuto de la hora de salida de la reserva
            cuartoDigito = roomRes[i].horaSalida.charAt(4); // Segundo minuto de la hora de salida de la reserva

            nextTercerDigito = roomRes[i + 1].horaEntrada.charAt(3); // Primer minuto de la hora de entrada de la proxima reserva
            nextCuartoDigito = roomRes[i + 1].horaEntrada.charAt(4); // Segundo minuto de la hora de entrada de la proxima reserva
            console.log(nextTercerDigito + nextCuartoDigito);

            minutosInicial = (+(tercerDigito + cuartoDigito));
            minutosFinal = (+(nextTercerDigito + nextCuartoDigito));
            console.log(minutosFinal);
            if (minutosInicial < 10 && minutosFinal < 10) {
              minutoStr = this.setMinutes(minutosInicial);
              minutoFinalStr = this.setMinutes(minutosFinal);
              timeInterval = primerDigito + segundoDigito + ':' + minutoStr + ' - ' +
                nextPrimerDigito + nextSegundoDigito + ':' + minutoFinalStr;
              console.log(timeInterval);
            } else if (minutosInicial < 10) {
              minutoStr = this.setMinutes(minutosInicial);
              timeInterval = primerDigito + segundoDigito + ':' + minutoStr + ' - ' +
                nextPrimerDigito + nextSegundoDigito + ':' + minutosFinal;
              console.log(timeInterval)
            } else if (minutosFinal < 10) {
              minutoFinalStr = this.setMinutes(minutosFinal);
              timeInterval = primerDigito + segundoDigito + ':' + minutosInicial + ' - ' +
                nextPrimerDigito + nextSegundoDigito + ':' + minutoFinalStr;
            } else {
              timeInterval = primerDigito + segundoDigito + ':' + minutosInicial + ' - ' +
                nextPrimerDigito + nextSegundoDigito + ':' + minutosFinal;
            }
            this.available.push({
              'piso': roomRes[i].piso,
              'salon': roomRes[i].numSalon,
              'content': this.getContentByFloorAndRoom(roomRes[i].piso, roomRes[i].numSalon),
              'timeAvailable': timeInterval,
              'status': 'Crear'
            });
          }
        }
      }
      // Este if se utiliza para cambiar de piso y buscar por los salones de ese otro piso
      if (j === room.length - 1) {
        if (floor === '1') {
          floor = '2';
        } else if (floor === '2') {
          floor = '3 (Centro de Aprendizaje)';
        }
        room = this.getFloorAndRoom(floor);
        if (flag !== 0) {
          j = -1; // Para que cuando vuelva al for j sea igual a cero
          flag++;
        }
      }
    }
  }

  // Esta funcion recibe el piso en el que se este buscando reservas
  // y devuelve la cantidad de salones de estudio que hay en ese piso
  getFloorAndRoom(floor: string) {
    const floorAndRoom: any = {
      floor1: ['1', '2', '3', '4', '5', '6', '7'],
      floor2: ['1', '2', '3', '4', '5', '6'],
      floor3: ['1', '2', '3']
    };

    if (floor === '1') {
      return floorAndRoom.floor1;
    } else if (floor === '2') {
      return floorAndRoom.floor2;
    } else {
      return floorAndRoom.floor3;
    }
  }

  getContentByFloorAndRoom(floor, room) {
    let content: any;

    if (floor === '1') {
      if (room === '1') {
        content = {
          capacity: '5',
          board: 'Sí',
          ethernet: 'Sí',
          electricity: 'Sí'
        };
      } else if (room === '2') {
        content = {
          capacity: '4',
          board: 'Sí',
          ethernet: 'Sí',
          electricity: 'Sí'
        };
      } else if (room === '3') {
        content = {
          number: '3',
          capacity: '4',
          board: 'No',
          ethernet: 'No',
          electricity: 'Sí'
        };
      } else if (room === '4') {
        content = {
          number: '4',
          capacity: '4',
          board: 'Sí',
          ethernet: 'No',
          electricity: 'Sí'
        };
      } else if (room === '5') {
        content = {
          capacity: '6',
          board: 'No',
          ethernet: 'No',
          electricity: 'No'
        };
      } else if (room === '6') {
        content = {
          number: '6',
          capacity: '4',
          board: 'Sí',
          ethernet: 'No',
          electricity: 'Sí'
        };
      } else {
        content = {
          number: '7',
          capacity: '5',
          board: 'Sí',
          ethernet: 'Sí',
          electricity: 'Sí'
        };
      }
    } else if (floor === '2') {
      if (room === '1') {
        content = {
          capacity: '8',
          board: 'No',
          ethernet: 'No',
          electricity: 'Sí'
        };
      } else if (room === '2') {
        content = {
          number: '2',
          capacity: '4',
          board: 'No',
          ethernet: 'No',
          electricity: 'Sí'
        };
      } else if (room === '3') {
        content = {
          number: '3',
          capacity: '4',
          board: 'No',
          ethernet: 'Sí',
          electricity: 'Sí'
        };
      } else if (room === '4') {
        content = {
          number: '4',
          capacity: '8',
          board: 'No',
          ethernet: 'Sí',
          electricity: 'Sí'
        };
      } else if (room === '5') {
        content = {
          number: '5',
          capacity: '8',
          board: 'Sí',
          ethernet: 'Sí',
          electricity: 'Sí'
        };
      } else {
        content = {
          number: '6',
          capacity: '10',
          board: 'No',
          ethernet: 'Sí',
          electricity: 'Sí'
        };
      }
    } else {
      if (room === '1') {
        content = {
          number: '1',
          capacity: '5',
          board: 'Sí',
          ethernet: 'Sí',
          electricity: 'Sí'
        };
      } else if (room === '2') {
        content = {
          number: '2',
          capacity: '4',
          board: 'No',
          ethernet: 'No',
          electricity: 'Sí'
        };
      } else {
        content = {
          number: '3',
          capacity: '4',
          board: 'No',
          ethernet: 'No',
          electricity: 'Sí'
        };
      }
    }

    return content;
  }

  // Esta funcion recibe el arreglo de reservas y crea un arreglo
  // en donde estan las reservas de un salon en especifico. Luego
  // organiza las reservas por la hora, es decir, de reservas que son
  // en la mañana hasta por la noche
  sortByRoom(room: string, floor: string) {
    const resByRoom: any[] = [];
    let firstResHour: number; // Recive la hora de la reserva en el arreglo
    let nextFirstResHour: number; // Recive la hora de la siguiente reserva
    let minutesRes: number; // Los minutos de la primera reserva
    let nextMinutesRes: number; // los minutos de la segunda reserva
    let diffHours: number;
    let diffMinutes: number;
    for (let i = 0; i < this.reservas.length; i++) {
      if (this.reservas[i].numSalon === room && this.reservas[i].piso === floor && this.reservas[i].fecha === this.dateDesired) {
        resByRoom.push(this.reservas[i]);
      }
    }
    // Entra a este if si el arreglo resByRoom tiene reserva, de lo contrario lo sigue
    if (resByRoom !== []) {
      while (true) {
        let swapped = false;
        for (let j = 0; j < resByRoom.length - 1; j++) {
          firstResHour = +(resByRoom[j].horaSalida.charAt(0) + resByRoom[j].horaSalida.charAt(1));
          nextFirstResHour = +(resByRoom[j + 1].horaEntrada.charAt(0) + resByRoom[j + 1].horaEntrada.charAt(1));
          diffHours = firstResHour - nextFirstResHour;
          if (diffHours > 0) {
            [resByRoom[j], resByRoom[j + 1]] = [resByRoom[j + 1], resByRoom[j]];
            swapped = true;
          } else if (diffHours === 0) {
            minutesRes = +(resByRoom[j].horaSalida.charAt(3) + resByRoom[j].horaSalida.charAt(4));
            nextMinutesRes = +(resByRoom[j + 1].horaEntrada.charAt(3) + resByRoom[j + 1].horaEntrada.charAt(4));
            diffMinutes = minutesRes - nextMinutesRes;
            console.log(diffMinutes + 'minutos');
            if (diffMinutes > 0) {
              [resByRoom[j], resByRoom[j + 1]] = [resByRoom[j + 1], resByRoom[j]];
              swapped = true;
            }
          }
        }
        if (!swapped) {
          break;
        }
      }
    }
    return resByRoom;
  }
  // Funcion setea los minutos que sean de 0 a 9 un string y el string es el numero de dos digitos para que se vea
  // como que es parte de la hora que se presenta
  setMinutes(minutoStr) {
    let minuto;
    switch (minutoStr) {
      case 0: {
        minuto = '00';
        break;
      }
      case 1: {
        minuto = '01';
        break;
      }
      case 2: {
        minuto = '02';
        break;
      }
      case 3: {
        minuto = '03';
        break;
      }
      case 4: {
        minuto = '04';
        break;
      }
      case 5: {
        minuto = '05';
        break;
      }
      case 6: {
        minuto = '06';
        break;
      }
      case 7: {
        minuto = '07';
        break;
      }
      case 8: {
        minuto = '08';
        break;
      }
      case 9: {
        minuto = '09';
        break;
      }
    }
    return minuto;
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