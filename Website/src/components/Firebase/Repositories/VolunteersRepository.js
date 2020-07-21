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

  getDbVolunteersAsArray = async includeInactive => {
    const existingDbVolunteers = await this.getDbVolunteers();
    const dbVolunteersRef = !includeInactive
      ? await existingDbVolunteers
        .orderByChild('active')
        .equalTo(true)
        .once('value')
      : await existingDbVolunteers
        .orderByChild('active')
        .once('value');
    const dbVolunteers = await dbVolunteersRef.val();
    const dbVolunteersAsArray = [];
    if (dbVolunteers) {
      Object.keys(dbVolunteers).map(key =>
        dbVolunteersAsArray.push(dbVolunteers[key])
      );
    }
    return dbVolunteersAsArray;
  }

  getDbVolunteer = async vid => {
    return await this.db.ref(`volunteers/${vid}`);
  }

  saveDbVolunteer = async (volunteer, saveDbVolunteer_completed) => {
    const {
      active,
      created,
      createdBy,
      firstName,
      lastName,
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
          active: active || (typeof active === 'boolean' && active) || false,
          firstName: firstName || dbVolunteer.firstName || '',
          lastName: lastName || dbVolunteer.lastName || '',
          phoneNumber: phoneNumber || dbVolunteer.phoneNumber || '',
          email: email || dbVolunteer.email,
          providerData: providerData || dbVolunteer.providerData || {},
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
}

export default VolunteersRepository;
