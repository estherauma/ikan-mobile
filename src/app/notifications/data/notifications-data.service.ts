import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DBService } from 'src/app/shared/services/database/db.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsDataService {

  db: SQLiteObject;
  notifications: any = [];
  notificationsObs = new BehaviorSubject([]);
  
  constructor(
    private platform: Platform,
    private dbService: DBService,
    private sharedMethods: SharedmethodsService,
  ) {
    this.platform.ready().then(async() => {
      this.db = await this.dbService.configureDB();
    });

    this.dbService.isDBsetup().subscribe(async(res) => {
      if (res) {
        await this.retrieveNotifications();
      }
    });

    this.getAll().subscribe((data) => {
      this.notifications = data;
    });
  }

  async retrieveNotifications() {
    const query = 'SELECT * FROM notifications ORDER BY created_at DESC';
    return this.db.executeSql(query, []).then((data) => {
      const notifications = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          notifications.push({
            id: data.rows.item(i).id,
            appRef: data.rows.item(i).app_ref,
            onlineRef: data.rows.item(i).online_ref,
            userId: data.rows.item(i).user_id,
            category: data.rows.item(i).category,
            title: data.rows.item(i).title,
            message: data.rows.item(i).message,
            status: data.rows.item(i).status,
            isDisplayed: this.getBooleanValue(data.rows.item(i).is_displayed),
            isDeleted: this.getBooleanValue(data.rows.item(i).is_deleted),
            metadata: data.rows.item(i).metadata,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            deletedAt: data.rows.item(i).deleted_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
            deletedBy: data.rows.item(i).deleted_by,
            deleted: this.getBooleanValue(data.rows.item(i).deleted),
          });
        }
      }
      
      this.notificationsObs.next(notifications);
    }).catch((error) => {
      console.error('Error in notifications-data.service.ts at retrieveNotifications().', error);
    });
  }

  getBooleanValue(value) {
    if (typeof value === 'boolean') {
      return value;
    } else if (typeof value === 'number' && value > 0) {
      return true;
    } else if(typeof value === 'string' && (value === 'true' || value === '1')) {
      return true;
    } else{
      return false;
    }
  }

  getAll() {
    return this.notificationsObs.asObservable();
  }

  async create(data) {
    const query = `INSERT INTO notifications (app_ref, user_id, category, title, \
      message, status, is_displayed, is_deleted, metadata, created_at, created_by, \
      updated_at, updated_by, deleted_at, deleted_by, deleted) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      data.appRef, data.userId, data.category, data.title, data.message, data.status,
      data.isDisplayed, data.isDeleted, data.metadata, data.createdAt, data.createdBy,
      data.updatedAt, data.updatedBy, data.deletedAt, data.deletedBy, data.deleted,
    ];

    return this.db.executeSql(query, params).then(async(res) => {
      await this.retrieveNotifications();
      return res;
    }).catch((error) => {
      console.error('Error in notifications-data.service.ts at create().', error);
    });
  }

  async saveOnlineNotification(data) {
    const query = `INSERT INTO notifications (app_ref, online_ref, user_id, category, title, \
      message, status, is_displayed, is_deleted, metadata, created_at, created_by, \
      updated_at, updated_by, deleted_at, deleted_by, deleted) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      data.appRef, data.onlineRef, data.userId, data.category, data.title, data.message,
      data.status, data.isDisplayed, data.isDeleted, data.metadata, data.createdAt,
      data.createdBy, data.updatedAt, data.updatedBy, data.deletedAt, data.deletedBy,
      data.deleted,
    ];

    return this.db.executeSql(query, params).then(async(res) => {
      await this.retrieveNotifications();
      return res;
    }).catch((error) => {
      console.error('Error in notifications-data.service.ts at saveOnlineNotification().', error);
    });
  }

  async updateNotificationField(notificationId, fieldName, fieldValue) {
    const query = `UPDATE notifications SET ${fieldName} = ? WHERE id = ?`;
    const params = [fieldValue, notificationId];

    return this.db.executeSql(query, params).then(async(res) => {
      await this.retrieveNotifications();
      return res;
    }).catch((error) => {
      console.error(`Error in notifications-data.service.ts at updateNotificationField(). Failed to update field ${fieldName}.`, error);
    });
  }

  async checkIfNotificationExists(onlineRef: string) {
    return await this.notifications.some((notification: any) => notification.onlineRef === onlineRef);
  }

  async getNotificationsByField(fieldName: string, fieldValue: any) {
    return this.notifications.filter((notification: any) => notification[fieldName] === fieldValue);
  }
}
