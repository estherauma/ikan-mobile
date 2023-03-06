import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentsDataService {
  db: SQLiteObject;
  agents = new BehaviorSubject([]);

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
        this.retrieveAgents();
      }).catch(e => console.log(e));
    });
  }

  retrieveAgents() {
    const query = 'SELECT * FROM agents';
    this.db.executeSql(query, []).then((data) => {
      const agents = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          agents.push({
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
            contactName: data.rows.item(i).contact_name,
            email: data.rows.item(i).email,
            telephone: data.rows.item(i).telephone,
            logoUrl: data.rows.item(i).logo_url,
            status: data.rows.item(i).status,
            country: data.rows.item(i).country,
            createdAt: data.rows.item(i).created_at,
            updatedAt: data.rows.item(i).updated_at,
            createdBy: data.rows.item(i).created_by,
            updatedBy: data.rows.item(i).updated_by,
          });
        }
      }
      this.agents.next(agents);
    }).catch((e) => console.log(e));
  }

  getAll() {
    return this.agents.asObservable();
  }

  async create(data) {
    const query = 'INSERT INTO agents (name, contact_name, email, telephone, logo_url, status, country, created_at,\
      updated_at, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [data.name, data.contact_name, data.email, data.telephone, data.logo_url,
      data.status, data.country, data.created_at, data.updated_at, data.created_by,data.updated_by];
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveAgents();
      return result.insertId;
    });
  }

  delete(id) {
    const query = 'DELETE FROM agents WHERE id = ?';
    const params = [id];
    return this.db.executeSql(query, params).then((result) => {
      this.retrieveAgents();
      return result;
    });
  }

  async getOne(id) {
    const allAgents = await this.getAll().toPromise();
    const agent = allAgents.filter((entry) => entry.id === id);
    return agent;
  }

  update() {}
}
