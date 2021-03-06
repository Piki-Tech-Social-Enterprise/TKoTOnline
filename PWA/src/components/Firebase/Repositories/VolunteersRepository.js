import BaseRepository from './BaseRepository';
import 'firebase/database';
import {
  undefinedRole
} from '../../Domains/VolunteerRoles';

class VolunteersRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbVolunteers = async () => {
    return await this.db.ref('volunteers');
  }

  getDbVolunteersAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbVolunteers = await this.getDbVolunteers();
    const dbVolunteersRef = !includeInactive
      ? await existingDbVolunteers
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbVolunteers
        .orderByChild(childName)
        .once('value');
    const dbVolunteers = await dbVolunteersRef.val();
    const dbVolunteersAsArray = [];
    if (dbVolunteers) {
      Object.keys(dbVolunteers).map(key =>
        dbVolunteersAsArray.push(dbVolunteers[key])
      );
    }
    return dbVolunteersAsArray.filter(v => includeInactive || v.active);
  }

  getDbVolunteer = async vid => {
    return await this.db.ref(`volunteers/${vid}`);
  }

  getDbVolunteerValue = async vid => {
    const existingDbVolunteer = await this.getDbVolunteer(vid),
      snapshot = await existingDbVolunteer.once('value'),
      dbVolunteer = await snapshot.val();
    return dbVolunteer;
  }

  addDbVolunteerDetails = async (vid, details) => {
    const existingDbVolunteer = await this.getDbVolunteer(vid);
    existingDbVolunteer.update({details});
  }

  saveDbVolunteer = async (volunteer, saveDbVolunteer_completed) => {
    const {
      active,
      created,
      createdBy,
      firstName,
      lastName,
      details,
      phoneNumber,
      email,
      providerData,
      roles,
      vid,
      updated,
      updatedBy
    } = volunteer;
    const now = new Date();
    let errorMessage = null;
    let existingDbVolunteer = await this.getDbVolunteer(vid || '')
    let dbVolunteerRef = null;
    let dbVolunteer = null;
    if (!vid) {
      dbVolunteerRef = await existingDbVolunteer.push();
      const newVid = await dbVolunteerRef.getKey();
      volunteer = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        firstName: firstName || '',
        lastName: lastName || '',
        details: details || {},
        phoneNumber: phoneNumber || '',
        email: email || '',
        providerData: providerData || (email && {
          email: email,
          providerId: 'password',
          vid: newVid
        }) || {},
        roles: roles || {
          undefinedRole
        },
        vid: newVid,
        updated: updated || now.toString(),
        updatedBy: updatedBy || ''
      };
      dbVolunteerRef.set(volunteer, saveDbVolunteer_completed);
    } else {
      dbVolunteerRef = await existingDbVolunteer.once('value');
      dbVolunteer = await dbVolunteerRef.val();
      if (dbVolunteer) {
        volunteer = {
          active: typeof active === 'boolean' ? active : dbVolunteer.active || false,
          firstName: firstName || dbVolunteer.firstName || '',
          lastName: lastName || dbVolunteer.lastName || '',
          phoneNumber: phoneNumber || dbVolunteer.phoneNumber || '',
          email: email || dbVolunteer.email,
          providerData: providerData || dbVolunteer.providerData || {},
          details: details || dbVolunteer.details || {},
          roles: roles || dbVolunteer.roles || {
            undefinedRole
          },
          vid: vid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || vid
        };
        existingDbVolunteer.set(volunteer, saveDbVolunteer_completed);
      } else {
        errorMessage = 'Save Db Volunteer Error: vid (' + vid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db Volunteer Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return volunteer.vid;
  }

  deleteDbVolunteer = async vid => {
    const existingDbVolunteer = await this.getDbVolunteer(vid);
    let errorMessage = null;
    if (existingDbVolunteer) {
      await existingDbVolunteer.remove();
    } else {
      errorMessage = 'Delete Db Volunteer Error: vid (' + vid + ') not found.';
    }
    if (errorMessage) {
      console.log('Delete Db Volunteer Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default VolunteersRepository;
