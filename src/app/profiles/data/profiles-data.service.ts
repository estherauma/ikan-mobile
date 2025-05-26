import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DBService } from 'src/app/shared/services/database/db.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilesDataService {
  db: SQLiteObject;
  profiles: any = [];
  profilesObs = new BehaviorSubject([]);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private dbService: DBService,
  ) {
    this.platform.ready().then(async() => {
      this.db = await this.dbService.configureDB();
    });

    this.dbService.isDBsetup().subscribe((res) => {
      if (res) {
        this.retrieveProfiles();
      }
    });

    this.getAll().subscribe((data) => {
      this.profiles = data;
    });
  }

  getAll() {
    return this.profilesObs.asObservable();
  }

  retrieveProfiles() {
    const query = 'SELECT * FROM profiles';
    return this.db.executeSql(query, []).then((data) => {
      const profiles = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          profiles.push({
            id: data.rows.item(i).id,
            deleted: (data.rows.item(i).deleted || data.rows.item(i).deleted === 'true') ? true : false,
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
            isTelephoneVerified: (data.rows.item(i).is_telephone_verified || data.rows.item(i).is_telephone_verified === 'true')
              ? true : false,
            mobile: data.rows.item(i).mobile,
            isMobileVerified: (data.rows.item(i).is_mobile_verified || data.rows.item(i).is_mobile_verified === 'true') ? true : false,
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
            isActive: (data.rows.item(i).is_active || data.rows.item(i).is_active === 'true') ? true : false,
            isVerified: (data.rows.item(i).is_verified || data.rows.item(i).is_verified === 'true') ? true : false,
            lastLogin: data.rows.item(i).last_login,
            userRole: data.rows.item(i).user_role,
            onlineRef: data.rows.item(i).online_ref,
          });
        }
      }
      this.profilesObs.next(profiles);
      return profiles;
    }).catch((e) => {
      console.error(e);
      return [];
    });
  }

  async getProfilesByRole(userRole: string) {
    return this.profiles?.filter((prof) => prof.userRole === userRole);
  }

  async getProfileByOnlineRef(onlineRef: string) {
    return this.profiles?.find((p) => p.onlineRef === onlineRef);
  }

  async getSingleProfile(email: string) {
    const profile = await this.profiles.find((p) => p.email === email);
    return profile;
  }

  async create(data) {
    const query = 'INSERT OR IGNORE INTO profiles (email, first_name, last_name, telephone, is_telephone_verified, mobile, \
      is_mobile_verified, address_line_1, address_line_2, address_line_3, city, country, postal_code, profile_image, \
      registration_number, passport_number, position, is_active, is_verified, last_login, user_role, \
      created_at, updated_at, created_by, updated_by) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    data.isActive = data.isActive ?? false;
    data.isVerified = data.isVerified ?? false;
    const params = [data?.email, data?.firstName, data?.lastName, data?.telephone, data.isTelephoneVerified,
      data.mobile, data.isMobileVerified,
      data?.addressLine1, data?.addressLine2, data?.addressLine3, data?.city, data?.country,
      data?.postalCode, data?.profileImage, data?.registrationNumber, data?.passportNumber,
      data?.position, data?.isActive, data?.isVerified, data?.lastLogin, data?.userRole,
      data?.createdAt, data?.updatedAt, data?.createdBy, data?.updatedBy];

    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveProfiles();
      return result.insertId;
    }).catch((e) => {
      console.error(e);
      return null;
    });
  }
  async saveOnlineProfile(data) {
    const query = 'INSERT OR IGNORE INTO profiles (email, first_name, last_name, telephone, is_telephone_verified, \
      mobile, is_mobile_verified, address_line_1, address_line_2, address_line_3, city, country, postal_code, \
      registration_number, passport_number, position, is_active, is_verified, last_login, user_role, \
      created_at, updated_at, created_by, updated_by, online_ref) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data?.email, data?.firstName, data?.lastName, data?.telephone, data.isTelephoneVerified,
      data.mobile, data.isMobileVerified,
      data?.addressLine1, data?.addressLine2, data?.addressLine3, data?.city, data?.country,
      data?.postalCode, data?.registrationNumber, data?.passportNumber,
      data?.position, data?.isActive, data?.isVerified, data?.lastLogin, data?.userRole,
      data?.createdAt, data?.updatedAt, data?.createdBy, data?.updatedBy, data?.id];

    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveProfiles();
      return result.insertId;
    }).catch((e) => {
      console.error(e);
      return null;
    });
  }

  update(data) {
    const query = 'UPDATE profiles SET first_name = ?, last_name = ?, telephone = ?, is_telephone_verified = ?, mobile = ?, \
      is_mobile_verified = ?, address_line_1 = ?, address_line_2 = ?, address_line_3 = ?, city = ?, country = ?, postal_code = ?, \
      profile_image = ?, registration_number = ?, passport_number = ?, position = ?, is_active = ?, is_verified = ?, \
      last_login = ?, user_role = ?, updated_at = ?, updated_by = ? \
      WHERE email = ?';
    const params = [data.firstName, data.lastName, data.telephone, data.isTelephoneVerified, data.mobile, data.isMobileVerified,
      data.addressLine1, data.addressLine2, data.addressLine3, data.city, data.country,
      data.postalCode, data.profileImage, data.registrationNumber, data.passportNumber,
      data.position, data.isActive, data.isVerified, data.lastLogin, data.userRole,
      data.updatedAt, data.updatedBy, data.email];

    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveProfiles();
      return result;
    }).catch((e) => {
      console.error(e);
      return null;
    });
  }

  async updateProfileOnlineRef(email: string, onlineRef: string) {
    const query = 'UPDATE profiles SET online_ref = ? WHERE email = ?';
    const params = [onlineRef, email];
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveProfiles();
      return result;
    }).catch((e) => {
      console.error(e);
      return null;
    });
  }

  async checkIfProfileExists(email: string) {
    const profileExists = this.profiles.some((prof) => prof.email === email);
    return profileExists;
  }

  async updateProfileRegistrationDetails(data) {
    const query = 'UPDATE profiles SET registration_number = ?, passport_number = ?, updated_at = ?, updated_by = ? \
      WHERE email = ?';
    const params = [data.registrationNumber, data.passportNumber, data.updatedAt, data.updatedBy, data.email];
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveProfiles();
      return result;
    }).catch((e) => {
      console.error(e);
      return null;
    });
  }

  async updateProfilesField(email: string, field: string, value: any) {
    const query = `UPDATE profiles SET ${field} = ? WHERE email = ?`;
    const params = [value, email];
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveProfiles();
      return result;
    }).catch((e) => {
      console.error(e);
      return null;
    });
  }

  async delete(email: string) {
    const query = 'DELETE FROM profiles WHERE email = ?';
    const params = [email];
    return this.db.executeSql(query, params).then(async(result) => {
      await this.retrieveProfiles();
      return result;
    }).catch((e) => {
      console.error(e);
      return null;
    });
  }
}
