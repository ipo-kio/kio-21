
import { Solution } from './Solution.js';

export class SolutionHelper
{
	static createSolutionFromInterface()
	{
		let i, strDiv, strId, d1, d2;
		let errMess = '';
		log('SolutionHelper.createSolutionFromInterface()')
		let solution = new Solution();
		solution._totalProfit = 0;
        solution._totalAvr = 0;

		//-- TODO PETER
		//-- заполняем стратегии
		{
			let arr = document.getElementsByClassName('strategy_cont');

			for(i=0; i < arr.length; i++)
			{
				strDiv = arr[i];
				strId = strDiv.getAttribute('str_id');
				if(strId == null) continue; //-- это шаблон

				d1 = parseInt(document.getElementById('str_from_' + strId).value.trim(), 10);
				d2 = parseInt(document.getElementById('str_to_' + strId).value.trim(), 10);

				if(!func_isInt(d1) || !func_isInt(d2))
				{
					errMess = 'Ошибка формата дней!' ;
					ok = false;
				}
			}
		}
		

		return solution;
	}


}

function log(s){
	console.log(s);
}