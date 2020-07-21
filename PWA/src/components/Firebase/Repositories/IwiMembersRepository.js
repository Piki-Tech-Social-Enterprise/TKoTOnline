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

  getDbIwiMember = async imid => {
    return await this.db.ref(`iwiMembers/${imid}`);
  }

  getDbIwiMemberValue = async imid => {
    const existingDbIwiMember = await this.getDbIwiMember(imid);
    const dbIwiMemberRef = await existingDbIwiMember.once('value');
    const dbIwiMember = await dbIwiMemberRef.val();
    return dbIwiMember;
  }

  saveDbIwiMember = async (iwiMember, saveDbIwiMember_completed) => {
    const {
      active,
      created,
      createdBy,
      iwiMemberImageURL,
      iwiMemberName,
      iwiMemberURL,
      imid,
      updated,
      updatedBy
    } = iwiMember;
    const now = new Date();
    let errorMessage = null;
    let existingDbIwiMember = await this.getDbIwiMember(imid || '')
    let dbIwiMemberRef = null;
    let dbIwiMember = null;
    if (!imid) {
      dbIwiMemberRef = await existingDbIwiMember.push();
      iwiMember = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        iwiMemberImageURL: iwiMemberImageURL || '',
        iwiMemberName: iwiMemberName || '',
        iwiMemberURL: iwiMemberURL || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        imid: await dbIwiMemberRef.getKey()
      };
      dbIwiMemberRef.set(iwiMember, saveDbIwiMember_completed);
    } else {
      dbIwiMemberRef = await existingDbIwiMember.once('value');
      dbIwiMember = await dbIwiMemberRef.val();
      if (dbIwiMember) {
        iwiMember = {
          active: active || (typeof active === 'boolean' && active) || false,
          iwiMemberImageURL: iwiMemberImageURL || dbIwiMember.iwiMemberImageURL || '',
          iwiMemberName: iwiMemberName || dbIwiMember.iwiMemberName || '',
          iwiMemberURL: iwiMemberURL || dbIwiMember.iwiMemberURL || '',
          imid: imid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbIwiMember.updatedBy
        };
        existingDbIwiMember.set(iwiMember, saveDbIwiMember_completed);
      } else {
        errorMessage = 'Save Db IwiMembers Error: imid (' + imid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db IwiMembers Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return iwiMember.imid;
  }

  deleteDbIwiMember = async imid => {
    const existingDbIwiMember = await this.getDbIwiMember(imid);
    let errorMessage = null;
    if (existingDbIwiMember) {
      await existingDbIwiMember.remove();
    } else {
      errorMessage = `Delete Db News Feed Error: imid (${imid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default IwiMembersRepository;
