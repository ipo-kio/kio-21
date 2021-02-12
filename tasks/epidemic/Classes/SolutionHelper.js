
import { Solution } from './Solution.js';
import { Funcs } from './Funcs.js';
import { Config } from './Config.js';
import { StrategyHelper } from './StrategyHelper.js';

export class SolutionHelper
{
	static creteEmptySolution()
	{
		let solution =  new Solution();
		solution._totalProfit = 0;
        solution._totalAvr = 0;
		solution._strategyArr = [];

		return solution;
	}

	static createSolutionFromInterface()
	{
		let i, strDiv, strId, d1, d2, str, bgColor, ok, t;
		let errMess = '';
		log('SolutionHelper.createSolutionFromInterface()')
		let solution = SolutionHelper.creteEmptySolution(); 

		
		//-- заполняем стратегии
		{
			let arr = document.getElementsByClassName('str_div');

			//log(arr)

			for(i=0; i < arr.length; i++)
			{
				ok = true;
				strDiv = arr[i];
				strId = strDiv.getAttribute('str_id');
				if(strId == null) continue; //-- это шаблон

				d1 = parseInt(document.getElementById('str_from_' + strId).value.trim(), 10);
				d2 = parseInt(document.getElementById('str_to_' + strId).value.trim(), 10);

				if(!Funcs.isInt(d1) || !Funcs.isInt(d2))
				{
					errMess = 'Ошибка формата дней!' ;
					ok = false;
				}

				if(ok)
				{
					if(d1 < 1 || d1 >  Config._dayCount)
					{
						errMess = 'Ошибка интервала дней! d1=' + d1;
						ok = false;
					}
					if(d2 < 1 || d2 >  Config._dayCount)
					{
						errMess = 'Ошибка интервала дней! d2=' + d2;
						ok = false;
					}
				}

				if(ok)
				{
					if(d1 > d2)
					{
						errMess = 'Ошибка интервала дней! d1=' + d1 + ' - d2=' + d2;
						ok = false;
					}
				}

				str = StrategyHelper.createEmptyStarategy();
				str._id = strId;
				str._dayStart = d1;
				str._dayFinish = d2;
				str._isMaski = document.getElementById('str_mask_' + strId).checked;
				str._isKarantin = document.getElementById('str_kar_' + strId).checked;
				//str._isLok = document.getElementById('str_lok_' + strId).checked;
				str._isActive = ok;

				solution._strategyArr.push(str);

				log('errMess=' + errMess)

				t = document.getElementById('strategy_' + str._id);
				t.setAttribute('title', errMess);
			}
		}
		
		//-- проверяем стратегии на валидность промежутков
		{
			let daysArr = Array(Config._dayCount).fill(0);

			for(i=0; i < solution._strategyArr.length; i++)
			{
				str = solution._strategyArr[i];
				if(str._isActive) 
				{
					for(let j= str._dayStart - 1; j < str._dayFinish; j++)
					{
						if(daysArr[j] == 0)
						{
							daysArr[j] = 1;
						}
						else
						{
							ok = false;
							errMess = 'Ошибка в интервалах стратегий ';
							str._isActive = false;
						}
					}					
				}

				t = document.getElementById('strategy_' + str._id);

				if(str._isActive)
				{	
					bgColor = 'lightgreen';
				}
				else{
					bgColor = 'red';
					t.setAttribute('title', errMess);
				}

				
				t.style.backgroundColor = bgColor;
				

			}
		}

		return solution;
	}


}

function log(s){
	console.log(s);
}