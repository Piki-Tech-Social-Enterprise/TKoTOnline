import BaseRepository from './BaseRepository';
import 'firebase/database';

class ResourcesRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbResources = async () => {
    return await this.db.ref('resources');
  }

  getDbResourcesAsArray = async (includeInactive, childName = 'active', childValue = true) => {
    const existingDbResource = await this.getDbResources();
    const dbResourceRef = !includeInactive
      ? await existingDbResource
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbResource
        .orderByChild(childName)
        .once('value');
    const dbResource = await dbResourceRef.val();
    const dbResourceAsArray = [];
    if (dbResource) {
      Object.keys(dbResource).map(key =>
        dbResourceAsArray.push(dbResource[key])
      );
    }
    return dbResourceAsArray;
  }

  getDbResource = async rid => {
    return await this.db.ref(`resources/${rid}`);
  }

  getDbResourceValue = async rid => {
    const existingDbResource = await this.getDbResource(rid);
    const dbResourceRef = await existingDbResource.once('value');
    const dbResource = await dbResourceRef.val();
    return dbResource;
  }

  saveDbResource = async (resource, saveDbResource_completed) => {
    const {
      active,
      created,
      createdBy,
      category,
      content,
      header,
      imageUrl,
      resourceUrl,
      rid,
      updated,
      updatedBy
    } = resource;
    const now = new Date();
    let errorMessage = null;
    let existingDbResource = await this.getDbResource(rid || '')
    let dbResourceRef = null;
    let dbResource = null;
    if (!rid) {
      dbResourceRef = await existingDbResource.push();
      resource = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        category: category || '',
        content: content || '',
        header: header || '',
        imageUrl: imageUrl || '',
        resourceUrl: resourceUrl || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        rid: await dbResourceRef.getKey()
      };
      dbResourceRef.set(resource, saveDbResource_completed);
    } else {
      dbResourceRef = await existingDbResource.once('value');
      dbResource = await dbResourceRef.val();
      if (dbResource) {
        resource = {
          active: typeof active === 'boolean' ? active : dbResource.active || false,
          category: category || dbResource.category || '',
          content: content || dbResource.content || '',
          header: header || dbResource.header || '',
          imageUrl: imageUrl || (typeof imageUrl === 'undefined' ? dbResource.imageUrl : ''),
          resourceUrl: resourceUrl || dbResource.resourceUrl || '',
          rid: rid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbResource.updatedBy
        };
        existingDbResource.set(resource, saveDbResource_completed);
      } else {
        errorMessage = 'Save Db Resource Error: rid (' + rid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db Resource Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return resource.rid;
  }

  deleteDbResource = async rid => {
    const existingDbResource = await this.getDbResource(rid);
    let errorMessage = null;
    if (existingDbResource) {
      await existingDbResource.remove();
    } else {
      errorMessage = `Delete Db Resource Error: rid (${rid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default ResourcesRepository;
