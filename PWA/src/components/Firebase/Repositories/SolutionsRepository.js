import BaseRepository from './BaseRepository';
import 'firebase/database';

class SolutionsRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbSolutions = async () => {
    return await this.db.ref('solutions');
  }

  getDbSolutionsAsArray = async includeInactive => {
    const existingDbSolution = await this.getDbSolutions();
    const dbSolutionRef = !includeInactive
      ? await existingDbSolution
        .orderByChild('active')
        .equalTo(true)
        .once('value')
      : await existingDbSolution
        .orderByChild('active')
        .once('value');
    const dbSolution = await dbSolutionRef.val();
    const dbSolutionAsArray = [];
    if (dbSolution) {
      Object.keys(dbSolution).map(key =>
        dbSolutionAsArray.push(dbSolution[key])
      );
    }
    return dbSolutionAsArray;
  }

  getDbSolution = async slid => {
    return await this.db.ref(`solutions/${slid}`);
  }

  getDbSolutionValue = async slid => {
    const existingDbSolution = await this.getDbSolution(slid);
    const dbSolutionRef = await existingDbSolution.once('value');
    const dbSolution = await dbSolutionRef.val();
    return dbSolution;
  }

  saveDbSolution = async (solution, saveDbSolution_completed) => {
    const {
      active,
      created,
      createdBy,
      solutionImageURL,
      solutionURL,
      solutionName,
      slid,
      updated,
      updatedBy
    } = solution;
    const now = new Date();
    let errorMessage = null;
    let existingDbSolution = await this.getDbSolution(slid || '')
    let dbSolutionRef = null;
    let dbSolution = null;
    if (!slid) {
      dbSolutionRef = await existingDbSolution.push();
      solution = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        solutionImageURL: solutionImageURL || '',
        solutionURL: solutionURL || '',
        solutionName: solutionName || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        slid: await dbSolutionRef.getKey()
      };
      dbSolutionRef.set(solution, saveDbSolution_completed);
    } else {
      dbSolutionRef = await existingDbSolution.once('value');
      dbSolution = await dbSolutionRef.val();
      if (dbSolution) {
        solution = {
          active: active || (typeof active === 'boolean' && active) || false,
          created: created || dbSolution.created,
          createdBy: createdBy || dbSolution.createdBy,
          solutionImageURL: solutionImageURL || dbSolution.solutionImageURL || '',
          solutionURL: solutionURL || '',
          solutionName: solutionName || dbSolution.solutionName || '',
          slid: slid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbSolution.updatedBy
        };
        existingDbSolution.set(solution, saveDbSolution_completed);
      } else {
        errorMessage = 'Save Db Solution Error: slid (' + slid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db Solution Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return solution.slid;
  }

  deleteDbSolution = async slid => {
    const existingDbSolution = await this.getDbSolution(slid);
    let errorMessage = null;
    if (existingDbSolution) {
      await existingDbSolution.remove();
    } else {
      errorMessage = `Delete Db Solution Error: slid (${slid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default SolutionsRepository;
