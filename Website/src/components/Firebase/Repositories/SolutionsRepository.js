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
}

export default SolutionsRepository;
