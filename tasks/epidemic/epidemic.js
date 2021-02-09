
import './epidemic.scss'
import './slider.scss'
import { Start } from './Classes/Start.js';
import { Global } from './Classes/Global.js';
import { Processor } from './Classes/Processor.js';
import { Solution } from './Classes/Solution.js';
import { Controller } from './Classes/Controller.js';

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
		this.initInterface(domNode, preferred_width)
	}

	static preloadManifest ()
	{
		return [
			{ id: 'slider_p', src: 'epidemic-resources/tasks/epidemic/res/slider_p.png' },
		] // TODO перечислить загружаемые ресурсы. Они находятся в каталоге taskid-resources

	}

	parameters () {

		log('parameters ()')

		let _totalProfit = {
			name: '_totalProfit',
			title: 'Доход:',
			ordering: 'maximize'
		}



		return[_totalProfit];
	}

	solution (){
		log('solution()')

		let solution = Global.getCurrentSolution();

		log(solution)

		return JSON.stringify(solution)
	}

	loadSolution (solutionJson)
	{
		log('loadSolution() - ' + solutionJson)

		let solutionObject;

		if (solutionJson !== undefined )
		{
			solutionObject = JSON.parse(solutionJson)
		}
		else{
			solutionObject = Global.createSolutionFromInterface();
		}

		Processor.calcSolution(solutionObject);

		Global.setSolutionOnInteface(solutionObject);
	}

	static saveCurrentSolution (src)
	{
		log('saveCurrentSolution() src=' + src)
		let solution = Global.getCurrentSolution()

		log(solution)

		Epidemic.kioapi.submitResult({
			_totalProfit: solution._totalProfit
		})
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