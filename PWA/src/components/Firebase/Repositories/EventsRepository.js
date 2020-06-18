import BaseRepository from './BaseRepository';
import 'firebase/database';

class EventsRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbEvents = async () => {
    return await this.db.ref('events');
  }

  getDbEventsAsArray = async includeInactive => {
    const existingDbEvent = await this.getDbEvents();
    const dbEventRef = !includeInactive
      ? await existingDbEvent
        .orderByChild('active')
        .equalTo(true)
        .once('value')
      : await existingDbEvent
        .orderByChild('active')
        .once('value');
    const dbEvent = await dbEventRef.val();
    const dbEventAsArray = [];
    if (dbEvent) {
      Object.keys(dbEvent).map(key =>
        dbEventAsArray.push(dbEvent[key])
      );
    }
    return dbEventAsArray;
  }

  getDbEvent = async evid => {
    return await this.db.ref(`events/${evid}`);
  }

  getDbEventValue = async evid => {
    const existingDbEvents = await this.getDbEvent(evid);
    const dbEventsRef = await existingDbEvents.once('value');
    const dbEvents = await dbEventsRef.val();
    return dbEvents;
  }

  saveDbEvent = async (event, saveDbEvent_completed) => {
    const {
      active,
      created,
      createdBy,
      eventURL,
      eventName,
      evid,
      updated,
      updatedBy
    } = event;
    const now = new Date();
    let errorMessage = null;
    let existingDbEvents = await this.getDbEvent(evid || '')
    let dbEventsRef = null;
    let dbEvents = null;
    if (!evid) {
      dbEventsRef = await existingDbEvents.push();
      event = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        eventURL: eventURL || '',
        eventName: eventName || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        evid: await dbEventsRef.getKey()
      };
      dbEventsRef.set(event, saveDbEvent_completed);
    } else {
      dbEventsRef = await existingDbEvents.once('value');
      dbEvents = await dbEventsRef.val();
      if (dbEvents) {
        event = {
          active: active || (typeof active === 'boolean' && active) || false,
          created: created || dbEvents.created,
          createdBy: createdBy || dbEvents.createdBy,
          eventURL: eventURL || dbEvents.eventURL || '',
          eventName: eventName || dbEvents.eventName || '',
          evid: evid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbEvents.updatedBy
        };
        existingDbEvents.set(event, saveDbEvent_completed);
      } else {
        errorMessage = 'Save Db Events Error: evid (' + evid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db Events Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return event.evid;
  }

  deleteDbEvent = async evid => {
    const existingDbEvents = await this.getDbEvent(evid);
    let errorMessage = null;
    if (existingDbEvents) {
      await existingDbEvents.remove();
    } else {
      errorMessage = `Delete Db News Feed Error: evid (${evid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default EventsRepository;
