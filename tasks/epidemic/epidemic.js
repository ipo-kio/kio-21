import './epidemic.scss'
import './slider.scss'
import { Start } from './Classes/Start.js';
import { Global } from './Classes/Global.js';
import { Processor } from './Classes/Processor.js';
import { SolutionHelper } from './Classes/SolutionHelper.js';
import { Solution} from './Classes/Solution.js';
import { Controller } from './Classes/Controller.js';
import { Config } from './Classes/Config';
import { InterfaceHelper } from './Classes/InterfaceHelper';

var _thisProblem = null

export class Epidemic
{
	static kioapi = null;


	constructor (settings)
	{
		log('constructor==============================')
		this.settings = settings
		log(settings)
	
	}

	id () {
		return 'epidemic' + this.settings.level // TODO заменить task-id на реальный id задачи
	}

	initialize (domNode, kioapi, preferred_width)
	{
		Epidemic.kioapi = kioapi
		log('initialize()')

		Config.init(this.settings.level);
		Epidemic._level = this.settings.level;

		this.initInterface(domNode, preferred_width)
	}

	static preloadManifest ()
	{
		return [
			{ id: 'slider_p', src: 'epidemic-resources/slider_p.png' },
			{ id: 'kucha', src: 'epidemic-resources/kucha.png' },
			{ id: 'm_red', src: 'epidemic-resources/m_red.png' },
			{ id: 'm_green', src: 'epidemic-resources/m_green.png' },
			{ id: 'm_yellow', src: 'epidemic-resources/m_yellow.png' },
			{ id: 'm_blue', src: 'epidemic-resources/m_blue.png' },
		]

	}

	parameters () {

		log('parameters ()')

		let _isComplit = {
			name: '_isComplit',
			title: 'Больных',
			ordering: 'maximize',
			view: function (ok) {
			  if (ok) {
				return 'В норме'
			  } else {
				return 'Переполнение'
			  }
			}
		}

		let _totalProfit = {
			name: '_totalProfit',
			title: 'Доход:',
			ordering: 'maximize'
		}

		let _strCount = {
			name: '_strCount',
			title: 'Количество стратегий:',
			ordering: 'minimize'
		}

		

		if(this.settings.level == 2)
		{
			return[_isComplit, _totalProfit, _strCount];
		}
		else{
			return[_totalProfit, _strCount];
		}

	}

	solution (){
		log('solution()')

		let solution = Global.getCurrentSolution();

		//log(solution)

		if (solution === undefined )
		{
			solution = SolutionHelper.creteEmptySolution();
		}

		return JSON.stringify(solution)
	}

	loadSolution (solution)
	{
		log('loadSolution()  ' )

		let solutionObject;

		if (solution !== undefined )
		{
			solutionObject = JSON.parse(solution)
		}
		else
		{
			solutionObject = SolutionHelper.creteEmptySolution();
		}

		InterfaceHelper.setSolutionOnInteface('loadSolution', solutionObject);

		Global.recalcFromInterface('loadSolution');

		solutionObject = Global._currentSolution;

		if(solutionObject._strategyArr.length > 0)
        {
            Global.setSelectedStrategy('loadSolution', solutionObject._strategyArr[0]._id)
        }

	}

	static saveCurrentSolution (src)
	{
		log('saveCurrentSolution() src=' + src)
		let solution = Global.getCurrentSolution()

		//log(solution)

		let strCount = 0;

		for(let i=0; i < solution._strategyArr.length; i++)
		{
			if(solution._strategyArr[i]._isActive)
			{
				strCount++;
			}
		}

		

		if(Epidemic._level == 2)
		{
			Epidemic.kioapi.submitResult({
				_isComplit: solution._isComplit,
				_totalProfit: solution._totalProfit,
				_strCount: strCount
			})
		}
		else{
			Epidemic.kioapi.submitResult({
				_totalProfit: solution._totalProfit,
				_strCount: strCount
			})
		}


	}

	initInterface (domNode, preferred_width)
	{
		log('initInterface()')
		_thisProblem = this

		Start.createGlobalInterface(domNode);
	
	}
}



function log(s){
	console.log(s);
}
