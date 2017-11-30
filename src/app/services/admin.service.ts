/*
Servicio que se comunica con la base de datos y que recibe los administradores que estan en la base de datos.
Esto lo que hace es comunicarse para buscar y recibir la informacion para que se pueda dar la autenticacion 
en el login.
*/
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AdminService {

  constructor(private http:Http) { 
    console.log("AdminService Initialized...");
  }

  getAdmin(){
    return this.http.get('http://localhost:3000/admin')
        .map(res => res.json());
  }
   /* postAdmin(){
      console.log(this.body);
    return this.http.post('http://192.168.1.106:3000/users', this.body)
        .map(res => res.json());
  }*/
}
