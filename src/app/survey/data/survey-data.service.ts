import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  db: SQLiteObject;
  surveys = new BehaviorSubject([]);

  constructor(
    public platform: Platform,
    public sqlite: SQLite,
    public sharedMethods: SharedmethodsService,
  ) {
    this.platform.ready().then(async() => {
      this.sqlite.create({
        name: 'tunalocal.db',
        location: 'default'
      }).then(async(_db: SQLiteObject) => {
        this.db = _db;
        this.retriveSurveys();
      }).catch(e => console.log(e));
    });
  }
  
  retriveSurveys() {
    const query = 'SELECT * FROM surveys';
    this.db.executeSql(query, []).then(async(data) => {
      const surveys = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          surveys.push({
            id: data.rows.item(i).id,
            appRef: data.rows.item(i).app_ref,
            onlineRef: data.rows.item(i).online_ref,
            surveyDate: data.rows.item(i).survey_date,
            questionKey: data.rows.item(i).question_key,
            questionText: data.rows.item(i).question_text,
            questionResponse: data.rows.item(i).question_response,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      this.surveys.next(surveys);
    }).catch((e) => console.error(e));
  }

  getAll() {
    return this.surveys.asObservable();
  }

  async create(data) {
    const query = `INSERT INTO surveys (app_ref, survey_date, \
      question_key, question_text, question_response, created_at, updated_at, created_by, updated_by) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const now = this.sharedMethods.getCurrentDateTime();
    const user = await this.sharedMethods.getUserData();
    const params = [data.app_ref, data.survey_date, data.question_key, data.question_text, data.question_response, now, now, user.id, user.id];

    return await this.db.executeSql(query, params).then((result) => {
      return result.insertId;
    }).catch((error) => {
      console.error(error);
      return null;
    });
  }
}
