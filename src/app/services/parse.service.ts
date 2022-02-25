import { Injectable } from '@angular/core';
import { Article } from '../classes/article';
import { Attachment } from '../classes/attachment';
import { Kanban_Column } from '../classes/kanban';
import { Schedules, Schedules_Execution } from '../classes/schedules';
import { Ticket } from '../classes/ticket';
import { Workplacecategory } from '../classes/workplacecategory';
import { ImageService } from './image.service';
import { UserService } from './user.service';

const Parse = require('parse');

@Injectable({
  providedIn: 'root',
})
export class ParseService {
  get instance() {
    return Parse;
  }

  // TODO: Parse has to check whether the user is authorized to get the data. Users could change domainname in localstorage and get data from others.
  constructor(
    private userService: UserService,
    private imageService: ImageService
  ) {
    Parse.initialize('maintenancegate_parse_server_1');
    Parse.serverURL = 'https://parse-1.zentrum-digitalisierung.de/parse';
  }

  login(username: string, password: string): Promise<boolean> {
    if (this.checkSession()) {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }

    // Session-token is returned
    return new Promise((resolve, reject) => {
      this.instance.User.logIn(username, password)
        .then(
          (value: any) => {
            if (value.className == '_User') {
              this.userService.login();
              this.userService.createpermissions(this.getUserRoles());
              resolve(true);
            } else {
              this.userService.logout();
              reject();
            }
            // sessiontoken can be accessed via value.attributes.sessionToken
          },
          () => {
            reject();
          }
        )
        .catch(() => {
          reject();
        });
    });
  }

  async logout() {
    this.userService.logout();
    return await this.instance.User.logOut();
  }

  checkSession(): boolean {
    const currentUser = this.instance.User.current();
    if (currentUser) {
      this.userService.createpermissions(this.getUserRoles());
      this.userService.login();
      return true;
    }
    return false;
  }

  getSessionToken(): string {
    return this.instance.User.getSessionToken();
  }

  getCurrentUser() {
    return this.instance.User.current();
  }

  getUserId(): string {
    let user = this.instance.User.current();
    return user.id;
  }

  async getUserRoles() {
    const query = await new Parse.Query(Parse.Role)
      .equalTo('users', this.getCurrentUser())
      .find();
    return query;
  }

  async getMandantRoles() {
    let currentUser = this.getCurrentUser().relation('mandant').query();
    const results = await currentUser.find();

    if (results.length > 0) {
      let query = await new Parse.Query(Parse.Role)
        .equalTo('mandant', results[0])
        .find();
      return query;
    }
  }

  async getTickets() {
    let tickets: Array<Ticket> = [];
    const Tickets = this.instance.Object.extend('Ticket');
    const query = new this.instance.Query(Tickets);

    query.equalTo('owner', this.getCurrentUser());
    const results = await query.find();
    for (let i = 0; i < results.length; i++) {
      let tmp = new Ticket();
      tmp.parseObjectToTicket(results[i]);
      tickets.push(tmp);
    }
    return tickets;
  }

  async getTicketsWithArticles() {
    let tickets: Array<Ticket> = [];
    const Tickets = this.instance.Object.extend('Ticket');
    const query = new this.instance.Query(Tickets);
    query.equalTo('owner', this.getCurrentUser());
    const results = await query.find();

    for (let i = 0; i < results.length; i++) {
      let tmp = new Ticket();
      await results[i]
        .relation('article')
        .query()
        .find()
        .then((articles: Array<Parse.Object>) => {
          tmp.parseObjectToTicket(results[i]);
          tmp.parseObjectToArticle(articles);
          tickets.push(tmp);
        });
    }
    return tickets;
  }

  async getTicketWithArticle(id: string) {
    let ticket: Ticket = new Ticket();
    const Tickets = this.instance.Object.extend('Ticket');
    const query = new this.instance.Query(Tickets);

    query.equalTo('owner', this.getCurrentUser());
    query.equalTo('objectId', id);
    const result = await query.first();
    if (result) {
      let tmp = new Ticket();
      await result
        .relation('article')
        .query()
        .find()
        .then((articles: Array<Parse.Object>) => {
          tmp.parseObjectToTicket(result);
          tmp.parseObjectToArticle(articles);
          ticket = tmp;
        });
    }

    return ticket;
  }

  async postTicket(ticket: Ticket): Promise<boolean> {
    const Tickets = this.instance.Object.extend('Ticket');
    const queryticket = new this.instance.Query(Tickets);

    queryticket.equalTo('objectId', ticket.objectId);
    return queryticket.first().then((object: Parse.Object) => {
      if (!object) {
        // No object exists so create a new one
        object = new Parse.Object('Ticket');
      }
      object.set('title', ticket.title);
      object.set('owner', ticket.owner);
      object.set('kanban_state', ticket.kanban_state);
      object.set('downtime', ticket.downtime);
      object.set('frequency', ticket.frequency);
      object.set('priority', ticket.priority);
      object.set('restriction', ticket.restriction);
      object.set('workplace', ticket.workplace);
      object.set('faultcategory', ticket.faultcategory);
      object.set('duedate', ticket.duedate);

      let article = new Parse.Object('Article');
      article.set('subject', ticket.article[ticket.article.length - 1].subject);
      article.set('body', ticket.article[ticket.article.length - 1].body);
      article.set('author', this.getCurrentUser());

      return article.save().then(
        async (savedarticle: Parse.Object) => {
          object.relation('article').add(savedarticle);

          // If there are attachments in the article upload these
          // Wait for this to happen and proceed with uploading the ticket afterwards.
          if (ticket.article[ticket.article.length - 1].images.length > 0) {
            await this.uploadFiles(
              ticket.article[ticket.article.length - 1].images,
              article
            ).then(
              () => {
                console.log('Attachments successfully uploaded.');
              },
              () => {
                console.log('Error while uploading attachments.');
              }
            );
          }

          return object.save().then(
            (backobject: Parse.Object) => {
              return new Promise((resolve, reject) => {
                resolve(true);
              });
            },
            (err: Parse.Error) => {
              return new Promise((resolve, reject) => {
                reject(false);
              });
            }
          );
        },
        (error: Parse.Error) => {
          return new Promise((resolve, reject) => {
            reject(false);
          });
        }
      );
    });
  }

  async updateTicket(ticket: Ticket): Promise<boolean> {
    const Tickets = this.instance.Object.extend('Ticket');
    const queryticket = new this.instance.Query(Tickets);

    queryticket.equalTo('objectId', ticket.objectId);
    return queryticket.first().then(
      (object: Parse.Object) => {
        if (!object) {
          return new Promise((resolve, reject) => {
            reject(false);
          });
        }
        object.set('title', ticket.title);
        object.set('owner', ticket.owner);
        object.set('kanban_state', ticket.kanban_state);
        object.set('downtime', ticket.downtime);
        object.set('frequency', ticket.frequency);
        object.set('priority', ticket.priority);
        object.set('restriction', ticket.restriction);
        object.set('workplace', ticket.workplace);
        object.set('faultcategory', ticket.faultcategory);
        object.set('duedate', ticket.duedate);

        return object.save().then(
          (backobject: Parse.Object) => {
            return new Promise((resolve, reject) => {
              resolve(true);
            });
          },
          (err: Parse.Error) => {
            return new Promise((resolve, reject) => {
              reject(false);
            });
          }
        );
      },
      (error: Parse.Error) => {
        return new Promise((resolve, reject) => {
          reject(false);
        });
      }
    );
  }

  async postArticle(ticketid: string, article: Article): Promise<Parse.Object> {
    const Tickets = this.instance.Object.extend('Ticket');
    const queryticket = new this.instance.Query(Tickets);

    queryticket.equalTo('objectId', ticketid);
    return queryticket.first().then((object: Parse.Object) => {
      if (!object) {
        // If no object exists return with error.
        return new Promise((resolve, reject) => {
          reject();
        });
      }

      let parsearticle = new Parse.Object('Article');
      parsearticle.set('subject', 'Neue Notiz');
      parsearticle.set('body', article.body);
      parsearticle.set('author', this.getCurrentUser());

      return parsearticle.save().then(
        async (savedarticle: Parse.Object) => {
          object.relation('article').add(savedarticle);

          return object.save().then(
            (backobject: Parse.Object) => {
              return new Promise((resolve, reject) => {
                resolve(savedarticle);
              });
            },
            (err: Parse.Error) => {
              return new Promise((resolve, reject) => {
                reject();
              });
            }
          );
        },
        (error: Parse.Error) => {
          return new Promise((resolve, reject) => {
            reject();
          });
        }
      );
    });
  }

  async getFaultCategories() {
    let currentUser = this.getCurrentUser().relation('mandant').query();
    const results = await currentUser.find();

    for (let i = 0; i < results.length; i++) {
      var _faults = results[i].get('faults');
    }
    return _faults;
  }

  async getWorkplaceCategories() {
    let currentUser = this.getCurrentUser().relation('mandant').query();
    const results = await currentUser.find();

    for (let i = 0; i < results.length; i++) {
      var _workplaces: Array<Workplacecategory> = results[i].get('workplaces');
    }
    return _workplaces;
  }

  async getKanbanColumns() {
    let currentUser = this.getCurrentUser().relation('mandant').query();
    const results = await currentUser.find();

    for (let i = 0; i < results.length; i++) {
      var _columns: Array<Kanban_Column> = results[i].get('kanban_columns');
    }
    return _columns;
  }

  async getSchedules(id: number) {
    var _maintenanceschedule: Array<Schedules> = [];

    let currentUser = this.getCurrentUser().relation('mandant').query();
    const mandant = await currentUser.find();

    const Schedules = this.instance.Object.extend('Schedule');
    const queryschedule = new this.instance.Query(Schedules);
    queryschedule.equalTo('workplaceid', id);

    queryschedule.matchesKeyInQuery('objectid', 'mandant', mandant[0]);

    let results = await queryschedule.find();
    for (let i = 0; i < results.length; i++) {
      _maintenanceschedule.push(results[i].toJSON());
      _maintenanceschedule[0].images = results[i].attributes.images.map(
        (image: Parse.File) => {
          let attachment = new Attachment();
          attachment.data = image.url();
          attachment.filename = image.name();
          attachment.id = 0;
          attachment.mimetype = this.imageService.calculateMimeTypeFromFileName(
            image.name()
          );
          return attachment;
        }
      );
    }
    return _maintenanceschedule;
  }

  async saveSchedules(schedule: Schedules): Promise<any> {
    const Schedules = this.instance.Object.extend('Schedule');
    const queryschedule = new this.instance.Query(Schedules);
    let currentUser = this.getCurrentUser().relation('mandant').query();
    const mandant = await currentUser.find();

    queryschedule.equalTo('objectId', schedule.objectId);
    return queryschedule.first().then((object: any) => {
      if (object) {
        // Object already exists. Has to be updated.
        object.set('title', schedule.title);
        object.set('description', schedule.description);
        object.set('workplaceid', schedule.workplaceid);
        object.set('steps', schedule.steps);
        object.relation('mandant').add(mandant);
        return object.save();
      } else {
        // No object exists. Create a new one.
        var object = new Schedules();
        object.set('title', schedule.title);
        object.set('description', schedule.description);
        object.set('workplaceid', schedule.workplaceid);
        object.set('steps', schedule.steps);
        object.relation('mandant').add(mandant);

        if (schedule.images.length > 0) {
          return this.uploadFiles(schedule.images, object).then(
            (backobject: Parse.Object) => {
              object = backobject;

              return object.save();
            }
          );
        } else {
          return object.save();
        }
      }
    });
  }

  async getSchedulesAndExecution(id: number) {
    let _schedules: Array<Schedules> = [];

    let currentUser = this.getCurrentUser().relation('mandant').query();
    const mandant = await currentUser.find();

    const queryschedule = new this.instance.Query(
      this.instance.Object.extend('Schedule')
    );
    queryschedule.equalTo('workplaceid', id);
    queryschedule.matchesKeyInQuery('objectid', 'mandant', mandant[0]);

    const results = await queryschedule.find();
    for (let i = 0; i < results.length; i++) {
      let tmp: Schedules = new Schedules();
      await results[i]
        .relation('execution')
        .query()
        .find()
        .then((schedules: Array<Parse.Object>) => {
          tmp.parseObjectToSchedule(results[i]);
          tmp.parseObjectToExecutions(schedules);
          _schedules.push(tmp);
        });
    }
    return _schedules;
  }

  async saveScheduleExecution(schedule: Schedules) {
    const SchedulesExecution =
      this.instance.Object.extend('Schedule_Execution');

    const Schedules = this.instance.Object.extend('Schedule');
    const queryschedule = new this.instance.Query(Schedules);
    queryschedule.equalTo('objectId', schedule.objectId);

    return queryschedule.first().then((object: any) => {
      if (object) {
        // Schedule exists.
        var executionobject = new SchedulesExecution();
        executionobject.set('createdBy', this.getCurrentUser());
        executionobject.set('steps', schedule.steps);
        return executionobject.save().then(
          async (savedexecution: Parse.Object) => {
            object.relation('execution').add(savedexecution);

            return object.save().then(
              (backobject: Parse.Object) => {
                return new Promise((resolve, reject) => {
                  resolve(savedexecution);
                });
              },
              (err: Parse.Error) => {
                return new Promise((resolve, reject) => {
                  reject();
                });
              }
            );
          },
          (error: Parse.Error) => {
            return new Promise((resolve, reject) => {
              reject();
            });
          }
        );
      }
    });
  }

  async deleteSchedule(schedule: Schedules) {
    const Schedules = this.instance.Object.extend('Schedule');
    const queryschedule = new this.instance.Query(Schedules);

    queryschedule.equalTo('objectId', schedule.objectId);
    return await queryschedule.first().then(async (object: any) => {
      if (object) {
        return await object.destroy({});
      }
    });
  }

  async uploadFiles(
    files: Attachment[],
    parseObject: Parse.Object
  ): Promise<Parse.Object> {
    let promises: Promise<Parse.File>[] = [];
    let parseFiles: Parse.File[] = [];
    files.forEach((file, i) => {
      parseFiles.push(
        new this.instance.File(file.filename, {
          base64: file.data,
        })
      );
      promises.push(parseFiles[i].save());
    });

    await Promise.all(promises).then(
      (value: any) => {
        // success callback says all files are saved, now lets add them to the parent
        parseFiles.forEach((parseFile) => {
          // delete parseFile._previousSave; //--> fix circular json error
          parseObject.addUnique('images', parseFile); // could alternatively use .add()
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
    return parseObject;
  }
}
