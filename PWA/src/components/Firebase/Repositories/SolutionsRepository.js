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
    const existingDbSolutions = await this.getDbSolution(slid);
    const dbSolutionsRef = await existingDbSolutions.once('value');
    const dbSolutions = await dbSolutionsRef.val();
    return dbSolutions;
  }

  saveDbSolution = async (solution, saveDbSolution_completed) => {
    const {
      active,
      created,
      createdBy,
      solutionURL,
      solutionName,
      slid,
      updated,
      updatedBy
    } = solution;
    const now = new Date();
    let errorMessage = null;
    let existingDbSolutions = await this.getDbSolution(slid || '')
    let dbSolutionsRef = null;
    let dbSolutions = null;
    if (!slid) {
      dbSolutionsRef = await existingDbSolutions.push();
      solution = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        solutionURL: solutionURL || '',
        solutionName: solutionName || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        slid: await dbSolutionsRef.getKey()
      };
      dbSolutionsRef.set(solution, saveDbSolution_completed);
    } else {
      dbSolutionsRef = await existingDbSolutions.once('value');
      dbSolutions = await dbSolutionsRef.val();
      if (dbSolutions) {
        solution = {
          active: active || (typeof active === 'boolean' && active) || false,
          created: created || dbSolutions.created,
          createdBy: createdBy || dbSolutions.createdBy,
          solutionURL: solutionURL || dbSolutions.solutionURL || '',
          solutionName: solutionName || dbSolutions.solutionName || '',
          slid: slid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbSolutions.updatedBy
        };
        existingDbSolutions.set(solution, saveDbSolution_completed);
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
    const existingDbSolutions = await this.getDbSolution(slid);
    let errorMessage = null;
    if (existingDbSolutions) {
      await existingDbSolutions.remove();
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
