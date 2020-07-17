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
    const existingDbEvent = await this.getDbEvent(evid);
    const dbEventRef = await existingDbEvent.once('value');
    const dbEvent = await dbEventRef.val();
    return dbEvent;
  }

  saveDbEvent = async (event, saveDbEvent_completed) => {
    const {
      active,
      created,
      createdBy,
      content,
      header,
      imageUrl,
      evid,
      updated,
      updatedBy
    } = event;
    const now = new Date();
    let errorMessage = null;
    let existingDbEvent = await this.getDbEvent(evid || '')
    let dbEventRef = null;
    let dbEvent = null;
    if (!evid) {
      dbEventRef = await existingDbEvent.push();
      event = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        content: content || '',
        header: header || '',
        imageUrl: imageUrl || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        evid: await dbEventRef.getKey()
      };
      dbEventRef.set(event, saveDbEvent_completed);
    } else {
      dbEventRef = await existingDbEvent.once('value');
      dbEvent = await dbEventRef.val();
      if (dbEvent) {
        event = {
          active: active || (typeof active === 'boolean' && active) || false,
          created: created || dbEvent.created,
          createdBy: createdBy || dbEvent.createdBy,
          content: content || dbEvent.content || '',
          header: header || dbEvent.header || '',
          imageUrl: imageUrl || dbEvent.imageUrl || '',
          evid: evid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbEvent.updatedBy
        };
        existingDbEvent.set(event, saveDbEvent_completed);
      } else {
        errorMessage = 'Save Db Event Error: evid (' + evid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db Event Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return event.evid;
  }

  deleteDbEvent = async evid => {
    const existingDbEvent = await this.getDbEvent(evid);
    let errorMessage = null;
    if (existingDbEvent) {
      await existingDbEvent.remove();
    } else {
      errorMessage = `Delete Db Event Error: evid (${evid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default EventsRepository;
