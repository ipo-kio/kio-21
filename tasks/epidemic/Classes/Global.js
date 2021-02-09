import { Epidemic } from "../epidemic";
import { Solution } from "./Solution";

export class Global
{
	static _canvasTop;
	static _slider;
	static _currentSolution;

	static createSolutionFromInterface()
	{
		log('Global.createSolutionFromInterface()')
		let solution = new Solution();
		solution._totalProfit = 0;

		return solution;
	}

	static setSolutionOnInteface(solutionObject)
	{
		log('Global.setSolutionOnInteface()')
		Global._currentSolution = solutionObject;

		Epidemic.saveCurrentSolution('setSolutionOnInteface');
	}

	static getCurrentSolution()
	{
		return Global._currentSolution;
	}

}

function log(s){
	console.log(s);
}