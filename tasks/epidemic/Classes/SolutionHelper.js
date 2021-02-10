
import { Solution } from './Solution.js';

export class SolutionHelper
{
	static createSolutionFromInterface()
	{
		log('SolutionHelper.createSolutionFromInterface()')
		let solution = new Solution();
		solution._totalProfit = 0;
        solution._totalAvr = 0;

		return solution;
	}


}

function log(s){
	console.log(s);
}