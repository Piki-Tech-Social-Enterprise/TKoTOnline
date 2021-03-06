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

  getDbIwiMembersAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
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
    return dbIwiMemberAsArray.filter(im => includeInactive || im.active);
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
      iwiChairImageURL,
      iwiChairName,
      iwiChairProfile,
      iwiMemberImageURL,
      iwiMemberName,
      iwiMemberURL,
      iwiMemberRegistrationLink,
      imid,
      sequence,
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
        iwiChairImageURL: iwiChairImageURL || '',
        iwiChairName: iwiChairName || '',
        iwiChairProfile: iwiChairProfile || '',
        iwiMemberImageURL: iwiMemberImageURL || '',
        iwiMemberName: iwiMemberName || '',
        iwiMemberURL: iwiMemberURL || '',
        iwiMemberRegistrationLink: iwiMemberRegistrationLink || '',
        sequence: sequence || Number.MAX_SAFE_INTEGER,
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
          active: typeof active === 'boolean' ? active : dbIwiMember.active || false,
          iwiChairImageURL: iwiChairImageURL || dbIwiMember.iwiChairImageURL || '',
          iwiChairName: iwiChairName || dbIwiMember.iwiChairName || '',
          iwiChairProfile: iwiChairProfile || dbIwiMember.iwiChairProfile || '',
          iwiMemberImageURL: iwiMemberImageURL || dbIwiMember.iwiMemberImageURL || '',
          iwiMemberName: iwiMemberName || dbIwiMember.iwiMemberName || '',
          iwiMemberURL: iwiMemberURL || dbIwiMember.iwiMemberURL || '',
          iwiMemberRegistrationLink: iwiMemberRegistrationLink || dbIwiMember.iwiMemberRegistrationLink || '',
          imid: imid,
          sequence: sequence || dbIwiMember.sequence || Number.MAX_SAFE_INTEGER,
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
