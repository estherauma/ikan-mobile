import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilesDataService {
  db: SQLiteObject
  profiles = new BehaviorSubject([]);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
  ) {
    this.platform.ready().then(async() => {
      this.sqlite.create({
        name: 'tunalocal.db',
        location: 'default'
      }).then(async(_db: SQLiteObject) => {
        this.db = _db;
        this.retrieveProfiles();
      }).catch(e => console.log(e));
    });
  }

  getAll() {
    return this.profiles.asObservable();
  }

  retrieveProfiles() {
    const query = 'SELECT * FROM profiles';
    this.db.executeSql(query, []).then((data) => {
      const profiles = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          profiles.push({
            id: data.rows.item(i).id,
            deleted: data.rows.item(i).deleted,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            deletedAt: data.rows.item(i).deleted_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
            deletedBy: data.rows.item(i).deleted_by,
            email: data.rows.item(i).email,
            firstName: data.rows.item(i).first_name,
            lastName: data.rows.item(i).last_name,
            telephone: data.rows.item(i).telephone,
            mobile: data.rows.item(i).mobile,
            addressLine1: data.rows.item(i).address_line_1,
            addressLine2: data.rows.item(i).address_line_2,
            addressLine3: data.rows.item(i).address_line_3,
            city: data.rows.item(i).city,
            country: data.rows.item(i).country,
            postalCode: data.rows.item(i).postal_code,
            profileImage: data.rows.item(i).profile_image,
            registrationNumber: data.rows.item(i).registration_number,
            passportNumber: data.rows.item(i).passport_number,
            position: data.rows.item(i).position,
            isActive: data.rows.item(i).is_active,
            isVerified: data.rows.item(i).is_verified,
            lastLogin: data.rows.item(i).last_login,
            userRole: data.rows.item(i).user_role,
          });
        }
      }
      this.profiles.next(profiles);
      return profiles;
    }).catch((e) => console.error(e));
  }

  // TODO: refactor retrieve methods to use profiles observable
  retrieveProfilesByRole(userRole: string) {
    const query = 'SELECT * FROM profiles WHERE user_role = ?';
    this.db.executeSql(query, [userRole]).then((data) => {
      const profiles = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          profiles.push({
            id: data.rows.item(i).id,
            deleted: data.rows.item(i).deleted,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            deletedAt: data.rows.item(i).deleted_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
            deletedBy: data.rows.item(i).deleted_by,
            email: data.rows.item(i).email,
            firstName: data.rows.item(i).first_name,
            lastName: data.rows.item(i).last_name,
            telephone: data.rows.item(i).telephone,
            mobile: data.rows.item(i).mobile,
            addressLine1: data.rows.item(i).address_line_1,
            addressLine2: data.rows.item(i).address_line_2,
            addressLine3: data.rows.item(i).address_line_3,
            city: data.rows.item(i).city,
            country: data.rows.item(i).country,
            postalCode: data.rows.item(i).postal_code,
            profileImage: data.rows.item(i).profile_image,
            registrationNumber: data.rows.item(i).registration_number,
            passportNumber: data.rows.item(i).passport_number,
            position: data.rows.item(i).position,
            isActive: data.rows.item(i).is_active,
            isVerified: data.rows.item(i).is_verified,
            lastLogin: data.rows.item(i).last_login,
            userRole: data.rows.item(i).user_role,
          });
        }
      }
      return profiles;
    }).catch((e) => console.error(e));
  }

  retrieveProfileByField(field: string, fieldValue: any) {
    const query = 'SELECT * FROM profiles WHERE ? = ?';
    this.db.executeSql(query, [field, fieldValue]).then((data) => {
      const profiles = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          profiles.push({
            id: data.rows.item(i).id,
            deleted: data.rows.item(i).deleted,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            deletedAt: data.rows.item(i).deleted_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
            deletedBy: data.rows.item(i).deleted_by,
            email: data.rows.item(i).email,
            firstName: data.rows.item(i).first_name,
            lastName: data.rows.item(i).last_name,
            telephone: data.rows.item(i).telephone,
            mobile: data.rows.item(i).mobile,
            addressLine1: data.rows.item(i).address_line_1,
            addressLine2: data.rows.item(i).address_line_2,
            addressLine3: data.rows.item(i).address_line_3,
            city: data.rows.item(i).city,
            country: data.rows.item(i).country,
            postalCode: data.rows.item(i).postal_code,
            profileImage: data.rows.item(i).profile_image,
            registrationNumber: data.rows.item(i).registration_number,
            passportNumber: data.rows.item(i).passport_number,
            position: data.rows.item(i).position,
            isActive: data.rows.item(i).is_active,
            isVerified: data.rows.item(i).is_verified,
            lastLogin: data.rows.item(i).last_login,
            userRole: data.rows.item(i).user_role,
          });
        }
      }
      return profiles[0];
    }).catch((e) => console.error(e));
  }

  create(data) {
    // TODO: Refactor to insert or update
    const query = 'INSERT OR IGNORE INTO profiles (email, first_name, last_name, telephone, mobile, \
      address_line_1, address_line_2, address_line_3, city, country, postal_code, profile_image, \
      registration_number, passport_number, position, is_active, is_verified, last_login, user_role, \
      created_at, updated_at, created_by, updated_by) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.email, data.first_name, data.last_name, data.telephone, data.mobile,
      data.address_line_1, data.address_line_2, data.address_line_3, data.city, data.country,
      data.postal_code, data.profile_image, data.registration_number, data.passport_number,
      data.position, data.is_active, data.is_verified, data.last_login, data.user_role,
      data.created_at, data.updated_at, data.created_by, data.updated_by];
    
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveProfiles();
      return result.insertId;
    }).catch((e) => console.error(e));
  }

  update(data) {
    const query = 'UPDATE profiles SET first_name = ?, last_name = ?, telephone = ?, mobile = ?, \
      address_line_1 = ?, address_line_2 = ?, address_line_3 = ?, city = ?, country = ?, postal_code = ?, \
      profile_image = ?, registration_number = ?, passport_number = ?, position = ?, is_active = ?, is_verified = ?, \
      last_login = ?, user_role = ?, updated_at = ?, updated_by = ? \
      WHERE email = ?';
    const params = [data.first_name, data.last_name, data.telephone, data.mobile,
      data.address_line_1, data.address_line_2, data.address_line_3, data.city, data.country,
      data.postal_code, data.profile_image, data.registration_number, data.passport_number,
      data.position, data.is_active, data.is_verified, data.last_login, data.user_role,
      data.updated_at, data.updated_by, data.email];
    
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveProfiles();
      return result;
    }).catch((e) => console.error(e));
  }
}
