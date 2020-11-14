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

  getDbIwiMembersAsArray = async (includeInactive, childName = 'active', childValue = true) => {
    const existingDbIwiMember = await this.getDbIwiMembers();
    const dbIwiMemberRef = !includeInactive
      ? await existingDbIwiMember
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbIwiMember
        .orderByChild(childName)
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

  getDbIwiMember = async imid => {
    return await this.db.ref(`iwiMembers/${imid}`);
  }

  getDbIwiMemberValue = async imid => {
    const existingDbIwiMember = await this.getDbIwiMember(imid);
    const dbIwiMemberRef = await existingDbIwiMember.once('value');
    const dbIwiMember = await dbIwiMemberRef.val();
    return dbIwiMember;
  }
}

export default IwiMembersRepository;
