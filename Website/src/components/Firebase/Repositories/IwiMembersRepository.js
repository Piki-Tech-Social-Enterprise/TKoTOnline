import BaseRepository from './BaseRepository';
import 'firebase/database';

class IwiMembersRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbIwiMembers = async () => {
    return await this.db.ref('iwiMembers');
  }

  getDbIwiMembersAsArray = async includeInactive => {
    const existingDbIwiMember = await this.getDbIwiMembers();
    const dbIwiMemberRef = !includeInactive
      ? await existingDbIwiMember
        .orderByChild('active')
        .equalTo(true)
        .once('value')
      : await existingDbIwiMember
        .orderByChild('active')
        .once('value');
    const dbIwiMember = await dbIwiMemberRef.val();
    const dbIwiMemberAsArray = [];
    if (dbIwiMember) {
      Object.keys(dbIwiMember).map(key =>
        dbIwiMemberAsArray.push(dbIwiMember[key])
      );
    }
    return dbIwiMemberAsArray;
  }
}

export default IwiMembersRepository;
