import { Brilliant } from '../brilliant.js'
import { Step } from './Step.js'

export class StepHelper
{
	static _stepArr = [];
	static _currentStepIndex = 0;

	static addNewStep(str, stepType, src)
	{
		let n;
		log('addNewStep() prevStep=' + StepHelper._currentStepIndex + ' src=' + src)

		//if(StepHelper._currentStepIndex >= 0 &&  StepHelper._currentStepIndex < StepHelper._stepArr.length-1)
		if(StepHelper._currentStepIndex < StepHelper._stepArr.length-1)
		{
			//-- значит был отход назад, а потом игрок начал двигать фигуры
			//-- Удалим всю историю после текущей позиции

			n = StepHelper._currentStepIndex + 1;
			log('n=' + n)

			StepHelper._stepArr = StepHelper._stepArr.slice(0, n);
			//StepHelper._stepArr = StepHelper._stepArr.slice(0, 4);

			log('slice len=' +  StepHelper._stepArr.length);
			log( StepHelper._stepArr)
		}
		else{
			log('StepHelper._currentStepIndex < ' + (StepHelper._stepArr.length - 1))
		}

		let step = new Step();
		step._str = str;
		step._stepType = stepType;
		//log('sssssssssssssssssssss')
		//log(StepHelper._stepArr)
		StepHelper._stepArr.push(step);

		StepHelper._currentStepIndex = StepHelper._stepArr.length - 1;

		Brilliant.saveCurrentSolution('addNewStep ');

		//log('curr step=' + StepHelper._currentStep)

		//-- TODO оживить кнопки вперед-назад
		StepHelper.setButtons();
	}

	static setButtons()
	{
		let btnBack = document.getElementById('btn_back');

		btnBack.disabled = (StepHelper._stepArr.length < 2);
	}

	static getStep(stepIdx)
	{
		return StepHelper._stepArr[stepIdx];
	}

	static setCurentStepIndex(currentStepIndex)
	{
		StepHelper._currentStepIndex = currentStepIndex;
	}

}

function log(s){
	console.log(s);
}