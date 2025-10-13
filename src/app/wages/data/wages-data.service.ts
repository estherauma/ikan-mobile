import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DBService } from 'src/app/shared/services/database/db.service';

@Injectable({
  providedIn: 'root'
})
export class WagesDataService {
  
  db: SQLiteObject
  wages: any = [];
  wagesObs = new BehaviorSubject([]);

  constructor(
    public platform: Platform,
    public dbService: DBService,
  ) {
    this.platform.ready().then(async() => {
      this.db = await this.dbService.configureDB();
    });

    this.dbService.isDBsetup().subscribe((isDBsetup) => {});

  }
}
