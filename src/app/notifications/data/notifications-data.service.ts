import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Subject } from 'rxjs';
import { ContentService } from 'src/app/shared/services/content/content.service';
import { DBService } from 'src/app/shared/services/database/db.service';
import { SharedmethodsService } from 'src/app/shared/services/sharedmethods/sharedmethods.service';
import { NotificationCategory } from 'src/app/shared/types/api-types';
import { WagesDataService } from 'src/app/wages/data/wages-data.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsDataService {

  db: SQLiteObject;
  notifications: any = [];
  notificationsObs = new BehaviorSubject([]);
  undisplayedWageNotifications: any = [];
  displayWageNotificationsObs = new Subject<boolean>();
  
  constructor(
    private platform: Platform,
    private dbService: DBService,
    private sharedMethods: SharedmethodsService,
    private wagesDataService: WagesDataService,
    private contentService: ContentService,
  ) {
    this.platform.ready().then(async() => {
      this.db = await this.dbService.configureDB();
    });

    this.dbService.isDBsetup().subscribe(async(res) => {
      if (res) {
        await this.retrieveNotifications();
      }
    });

    this.getAll().subscribe(async(data) => {
      this.notifications = data;
      
      setTimeout(async() => {
        const paymentsPageData = this.contentService.getContentByPropertyName('payments-common-text');
        const paymentsCommonText = this.sharedMethods.convertAdditionalTextToObj(paymentsPageData?.additionalText);
        
        this.undisplayedWageNotifications = await this.retrieveUndisplayedWageNotifications(paymentsCommonText);
        if (this.undisplayedWageNotifications.length > 0) {
          this.displayWageNotificationsObs.next(true);
        } else {
          this.displayWageNotificationsObs.next(false);
        }
      }, 2000);
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

  async update(notificationId, data) {
    const query = `UPDATE notifications SET app_ref = ?, user_id = ?, category = ?, title = ?, \
      message = ?, status = ?, is_displayed = ?, is_deleted = ?, metadata = ?, \
      updated_at = ?, updated_by = ?, deleted_at = ?, deleted_by = ?, deleted = ? \
      WHERE id = ?`;
    const params = [
      data.appRef, data.userId, data.category, data.title, data.message, data.status,
      data.isDisplayed, data.isDeleted, data.metadata, data.updatedAt, data.updatedBy,
      data.deletedAt, data.deletedBy, data.deleted, notificationId,
    ];

    return this.db.executeSql(query, params).then(async(res) => {
      await this.retrieveNotifications();
      return res;
    }).catch((error) => {
      console.error('Error in notifications-data.service.ts at update().', error);
    });
  }

  async updateNotificationField(notificationId, fieldName, fieldValue) {
    const query = `UPDATE notifications SET updated_at = ?, updated_by = ?, ${fieldName} = ? WHERE id = ?`;
    const now = new Date().toISOString();
    const user = await this.sharedMethods.getUserData();
    const params = [now, user?.id, fieldValue, notificationId];

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

  async retrieveUndisplayedWageNotifications(paymentsCommonText) {
    const user = await this.sharedMethods.getUserData();
    if (!user || !user.id || this.notifications.length === 0) {
      return [];
    }
    
    const notifs =  this.notifications.filter((notification: any) =>
      notification.userId === user?.id &&
      notification.category === NotificationCategory.wagePayment &&
      notification.isDisplayed === false &&
      notification.isDeleted === false
    );

    for (const notif of notifs) {
      const pseudoTitle = paymentsCommonText?.wagePaymentNotificationTitle;
      const pseudoMessage = paymentsCommonText?.wagePaymentNotificationBody;
      
      // add wageId and details from metadata
      if (notif.metadata) {
        try {
          const metadataObj = JSON.parse(notif.metadata);
          const wageOnlineRef = metadataObj.wage_id;
          const wage = await this.wagesDataService.getWageByField('onlineRef', wageOnlineRef);
          if (wage) {
            notif.wageId = wage.id;
            notif.wageDetails = wage;
            notif.notificationDataId = notif.id;
          }

          // format title & message
          if (pseudoTitle) {
            notif.title = pseudoTitle;
          }
          if (pseudoMessage && metadataObj.amount && metadataObj.vessel_name) {
            notif.message = pseudoMessage
              .replace('{{wageUsdAmount}}', metadataObj.amount)
              .replace('{{wageVesselName}}', metadataObj.vessel_name);
          }
        } catch (error) {
          console.error('Error parsing notification metadata', error);
        }
      }
    }

    return notifs;
  }
}
