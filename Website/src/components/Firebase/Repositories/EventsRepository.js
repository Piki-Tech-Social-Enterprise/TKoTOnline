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
}

export default EventsRepository;
