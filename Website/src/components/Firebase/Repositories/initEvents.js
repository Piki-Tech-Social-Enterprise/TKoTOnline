const initEvents = async initialisedFirebaseApp => {
  await import('firebase/database');
  const database = initialisedFirebaseApp.database();
  const getDbEvents = async () => {
    return await database.ref('events');
  };
  const getDbEventsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbEvents = await getDbEvents();
    const dbEventsRef = !includeInactive
      ? await existingDbEvents
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbEvents
        .orderByChild(childName)
        .once('value');
    const dbEvents = await dbEventsRef.val();
    const dbEventsAsArray = [];
    if (dbEvents) {
      Object.keys(dbEvents).map(key =>
        dbEventsAsArray.push(dbEvents[key])
      );
    }
    return dbEventsAsArray.filter(c => includeInactive || c.active);
  };
  const getDbEvent = async pid => {
    return await database.ref(`events/${pid}`);
  };
  const getDbEventValue = async pid => {
    const existingDbEvent = await getDbEvent(pid);
    const dbEventRef = await existingDbEvent.once('value');
    const dbEvent = await dbEventRef.val();
    return dbEvent;
  };
  return {
    getDbEvents,
    getDbEventsAsArray,
    getDbEvent,
    getDbEventValue
  };
};

export default initEvents;
