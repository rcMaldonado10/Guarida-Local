import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateAdmin(admin) {
    if (admin.name === undefined || admin.username === undefined || admin.adminLevel === undefined || admin.password === undefined) {
      return false;
    } else {
      return true;
    }
  }
}
