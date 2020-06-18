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
}

export default EventsRepository;
