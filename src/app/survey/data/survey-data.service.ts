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
  surveys = [];
  surveysObs = new BehaviorSubject([]);
  inlineQuestions = [];
  inlineQuestionsObs = new BehaviorSubject([]);

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
        this.retrieveInlineQuestions();
      }).catch(e => console.log(e));
    });

    this.getAll().subscribe((data) => {
      this.surveys = data;
    });

    this.getAllInlineQuestions().subscribe((data) => {
      this.inlineQuestions = data;
    });
  }
  
  async retriveSurveys() {
    const query = 'SELECT * FROM surveys';
    return this.db.executeSql(query, []).then(async(data) => {
      const surveys = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          surveys.push({
            id: data.rows.item(i).id,
            appRef: data.rows.item(i).app_ref,
            onlineRef: data.rows.item(i).online_ref,
            userId: data.rows.item(i).user_id,
            surveyDate: data.rows.item(i).survey_date,
            questionKey: data.rows.item(i).question_key,
            questionType: data.rows.item(i).question_type,
            questionText: data.rows.item(i).question_text,
            questionResponse: data.rows.item(i).question_response,
            followUpQuestionKey: data.rows.item(i).follow_up_question_key,
            followUpQuestionType: data.rows.item(i).follow_up_question_type,
            followUpQuestionText: data.rows.item(i).follow_up_question_text,
            followUpQuestionResponse: data.rows.item(i).follow_up_question_response,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      this.surveysObs.next(surveys);
      return surveys;
    }).catch((e) => {
      console.error(e);
      return null;
    });
  }

  getAll() {
    return this.surveysObs.asObservable();
  }

  async create(data) {
    const query = `INSERT INTO surveys (app_ref, user_id, survey_date, \
      question_key, question_type, question_text, question_response, \
      follow_up_question_key, follow_up_question_type, follow_up_question_text, follow_up_question_response, \
      created_at, updated_at, created_by, updated_by) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const now = this.sharedMethods.getCurrentDateTime();
    const user = await this.sharedMethods.getUserData();
    const params = [data.appRef, data.userId, data.surveyDate, data.questionKey, data.questionType,
      data.questionText, data.questionResponse, data.followUpQuestionKey, data.followUpQuestionType,
      data.followUpQuestionText, data.followUpQuestionResponse, now, now, user.id, user.id];

    return this.db.executeSql(query, params).then(async(result) => {
      return result.insertId;
    }).catch((error) => {
      console.error(error);
      return null;
    });
  }

  async delete(id) {
    const query = 'DELETE FROM surveys WHERE id = ?';
    return await this.db.executeSql(query, [id]).then((result) => {
      return result.rowsAffected;
    }).catch((error) => {
      console.error(error);
      return null;
    });
  }

  async retrieveInlineQuestions() {
    const query = 'SELECT * FROM inline_questions';
    return await this.db.executeSql(query, []).then((data) => {
      const inlineQuestions = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          inlineQuestions.push({
            id: data.rows.item(i).id,
            appRef: data.rows.item(i).app_ref,
            onlineRef: data.rows.item(i).online_ref,
            userId: data.rows.item(i).user_id,
            subChapter: data.rows.item(i).sub_chapter,
            questionKey: data.rows.item(i).question_key,
            questionType: data.rows.item(i).question_type,
            questionText: data.rows.item(i).question_text,
            questionResponse: data.rows.item(i).question_response,
            followUpQuestionKey: data.rows.item(i).follow_up_question_key,
            followUpQuestionType: data.rows.item(i).follow_up_question_type,
            followUpQuestionText: data.rows.item(i).follow_up_question_text,
            followUpQuestionResponse: data.rows.item(i).follow_up_question_response,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      this.inlineQuestionsObs.next(inlineQuestions);
      return inlineQuestions;
    }).catch((error) => {
      console.error(error);
      return null;
    });
  }

  getAllInlineQuestions() {
    return this.inlineQuestionsObs.asObservable();
  }

  async createInlineQuestion(data) {
    const query = `INSERT INTO inline_questions (app_ref, user_id, sub_chapter, \
      question_key, question_type, question_text, question_response, \
      follow_up_question_key, follow_up_question_type, follow_up_question_text, follow_up_question_response, \
      created_at, updated_at, created_by, updated_by) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const now = this.sharedMethods.getCurrentDateTime();
    const user = await this.sharedMethods.getUserData();
    const params = [data.appRef, data.userId, data.subChapter, data.questionKey, data.questionType,
      data.questionText, data.questionResponse, data.followUpQuestionKey, data.followUpQuestionType,
      data.followUpQuestionText, data.followUpQuestionResponse, now, now, user.id, user.id];
  
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveInlineQuestions();
      return result.insertId;
    }).catch((error) => {
      console.error(error);
      return null;
    });
  }

  async saveOnlineInlineQuestion(data) {
    const query = `INSERT INTO inline_questions (app_ref, online_ref, user_id, sub_chapter, \
      question_key, question_type, question_text, question_response, \
      follow_up_question_key, follow_up_question_type, follow_up_question_text, follow_up_question_response, \
      created_at, updated_at, created_by, updated_by) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [data.appRef, data.onlineRef, data.userId, data.subChapter, data.questionKey, data.questionType,
      data.questionText, data.questionResponse, data.followUpQuestionKey, data.followUpQuestionType,
      data.followUpQuestionText, data.followUpQuestionResponse, data.createdAt, data.updatedAt, data.createdBy, data.updatedBy];
  
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveInlineQuestions();
      return result.insertId;
    }).catch((error) => {
      console.error(error);
      return null;
    });
  }

  async updateInlineQuestion(data) {
    const query = `UPDATE inline_questions SET question_type = ?, question_text = ?, question_response = ?, \
      follow_up_question_key = ?, follow_up_question_type = ?, follow_up_question_text = ?, \
      follow_up_question_response = ?, updated_at = ?, updated_by = ? WHERE id = ?`;
    const now = this.sharedMethods.getCurrentDateTime();
    const user = await this.sharedMethods.getUserData();
    const params = [data.questionType, data.questionText, data.questionResponse, data.followUpQuestionKey,
      data.followUpQuestionType, data.followUpQuestionText, data.followUpQuestionResponse, now, user.id, data.id];

    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveInlineQuestions();
      return result.rowsAffected;
    }).catch((error) => {
      console.error(error);
      return null;
    });
  }
}
