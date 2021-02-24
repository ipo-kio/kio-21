

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

	level;

	constructor (settings)
	{
		// log('constructor==============================')
		this.settings = settings
		// log(settings)
		// Global._level = settings.level;
		this.level = settings.level;
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
		Global._level = this.level;

		Brilliant.kioapi = kioapi
		log('initialize')

		domNode.style.position = "relative";
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

		let s;

		if(this.level == 0)
		{
			s = 'Собрано';
		}
		else if(this.level == 1)
		{
			s = 'Собрано';
		}
		else if(this.level == 2)
		{
			s = 'В рамках';
		}

		let _isComplit = {
			name: '_isComplit',
			title: s,
			ordering: 'maximize',
			view: function (ok) {
			  if (ok) {
				return 'Да'
			  } else {
				return 'Нет'
			  }
			}
		  }
			   
		let _orientalCount = {
			name: '_orientalCount',
			title: 'Смена ориентации:',
			ordering: 'maximize'
		}


		if(this.level == 2)
		{
			return[_isComplit, _orientalCount,  _moveCount, _rotateCount];
		}
		else{
			return[_isComplit, _moveCount, _rotateCount];
		}
		

	}

	static saveCurrentSolution (src)
	{
		log('saveCurrentSolution src=' + src)
		let solution = SolutionHelper.getCurrentSolution('saveCurrentSolution')

		if(Global._level == 2)
		{
			Brilliant.kioapi.submitResult({
				_isComplit: solution._isComplit,
				_orientalCount: solution._orientalCount,
				_rotateCount: solution._rotateCount,
				_moveCount: solution._moveCount
			})
		}
		else{
			Brilliant.kioapi.submitResult({
				_isComplit: solution._isComplit,
				_rotateCount: solution._rotateCount,
				_moveCount: solution._moveCount
			})
		}
	}

	solution (){
		log('solution()')

		let solution = SolutionHelper.getCurrentSolution('solution');

		//log(solution)

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
			log('startData')

			Global._appStarted = true;
		}
		

		if (solutionJson !== undefined )
		{
			let sol = JSON.parse(solutionJson);
			Global.applaySolution(sol)
		}
		else
		{
			StepHelper.addNewStep(Start._blocksStr, 0, 'start');
			Global.drawStepPrev(0);
			DrawHelper.drawAll('Global.applaySolution() start'  )
		}
	}

	initInterface (domNode, preferred_width)
	{
		log('initInterface()')
		_thisProblem = this
		this._domNode = domNode;
		ConfigHelper.init();
		Start._blocksStr = ConfigHelper.getStartStr();
		Start.start(domNode)
	}




	static drawAll(src){
		Global.drawAll(src);
	}


}

function log(s){
	console.log(s);
}
