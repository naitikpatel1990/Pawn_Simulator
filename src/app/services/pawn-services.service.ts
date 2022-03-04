import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PawnServicesService {
  private pawnService = new Subject<any>();
  pawnServiceObs = this.pawnService.asObservable();
  constructor() { }

  pawnMovmentUpdate(data){
    this.pawnService.next(data);
  }
}
