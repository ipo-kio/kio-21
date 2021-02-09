

import './brilliant.scss'
import { Global } from './Classes/Global.js';
import { Start } from './Classes/Start.js';
import { Solution } from './Classes/Solution.js'
import { SolutionHelper } from './Classes/SolutionHelper.js'
import { DrawHelper } from './Classes/DrawHelper';
import { ConfigHelper } from './Classes/ConfigHelper.js'
import { StepHelper } from './Classes/StepHelper.js'

var _thisProblem = null

export class Brilliant
{

	static kioapi = null;
	static _stageBottom
	static _stageTop

	constructor (settings)
	{
		log('constructor==============================')
		this.settings = settings
		log(settings)

	}
	/**
	 * Идентификатор задачи, используется сейчас только как ключ для
	 * хранения данных в localstorage
	 * @returns {string} идентификатор задачи
	 */
	id () {
		return 'brilliant' + this.settings.level // TODO заменить task-id на реальный id задачи
	}

	initialize (domNode, kioapi, preferred_width)
	{
		Brilliant.kioapi = kioapi
		log('initialize')
		this.initInterface(domNode, preferred_width)

	}

	parameters () {

		log('parameters ()')

		let _moveCount = {
			name: '_moveCount',
			title: 'Количество перемещений:',
			ordering: 'minimize'
		}

		let _rotateCount = {
			name: '_rotateCount',
			title: 'Количество поворотов:',
			ordering: 'minimize'
		}


		return[_moveCount, _rotateCount];

	}

	static saveCurrentSolution (src)
	{
		log('saveCurrentSolution src=' + src)
		let solution = SolutionHelper.getCurrentSolution()

		Brilliant.kioapi.submitResult({
			_rotateCount: solution._rotateCount,
			_moveCount: solution._moveCount
		})


	}

	solution (){
		log('solution()')

		let solution = SolutionHelper.getCurrentSolution();

		log(solution)

		return JSON.stringify(solution)
	}

	loadSolution (solutionJson){
		// Все объекты, которые сюда передаются, были ранее возвращены методом solution,
		// но проверять их все равно необходимо.
		// TODO загрузить объект с решением участника.


		log('loadSolution()')
		//log(solutionJson)

		if(!Global._appStarted)
		{
			let url = new URL(window.location.href);
			Start._blocksStr = url.searchParams.get("bloksstr");

			if(Start._blocksStr == null)
			{
				Start._blocksStr = '1:2-1:1;2:2-2:1;2:3-1:3;2:4-1:4;4:1-3:1;4:2-3:2;4:4-4:3;4:5-3:5;1:5-2:5;5:4-5:5;5:2-5:3;6:1-5:1;6:3-6:2;6:5-6:4;';
			}

			let startData = ConfigHelper.getStartData(Start._blocksStr);

			//log('startData')
			//log(startData)
			Start.start(this._domNode , startData)

			Global._appStarted = true;
		}



		if (solutionJson !== undefined )
		{
			//log('sol1')
			let sol = JSON.parse(solutionJson)
			//log('sol2')
			//log(sol)
			//log('sol3')

			if(sol._stepArr.length > 0)
			{

			}
			else{

			}

			Global.applaySolution(sol)
			 //log('sol4')
		}
		else{
			//log('sssssssssol 1')
			StepHelper.addNewStep(Start._blocksStr, 0, 'start');
			//log('sssssssssol 2')
			Global.drawStepPrev(0);
			//log('sssssssssol 3')
			DrawHelper.drawAll('Global.applaySolution() start'  )
		}
	}

	initInterface (domNode, preferred_width)
	{
		log('initInterface()')
		_thisProblem = this
		this._domNode = domNode;
		//Start.start(domNode)
	}




	static drawAll(src){
		Global.drawAll(src);
	}


}

function log(s){
	console.log(s);
}