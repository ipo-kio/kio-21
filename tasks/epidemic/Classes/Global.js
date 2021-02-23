import { Epidemic } from "../epidemic";
import { Solution } from "./Solution";
import { InterfaceHelper } from "./InterfaceHelper";
import { Controller } from "./Controller";
import { SolutionHelper } from "./SolutionHelper";
import { Processor } from "./Processor";
import { Config } from "./Config";

export class Global
{

	static _canvasTop;
	static _slider;
	static _currentSolution;
	static _canvas1W;
	static _canvas1H;
	static _canvas2W;
	static _canvas2H;
	static _manArr = [];
	static _dayArr = [];
	static _isPlay = false;
	static _tikCounter = 0;
	static _ctx;
	static _ctx2;
	static _selectedStrategyId = -1;

    static getStrategyForDay(dayNumber, solutionObject)
    {
		let strategy = null;
		
		for(let i=0; i < solutionObject._strategyArr.length; i++)
		{
			strategy = solutionObject._strategyArr[i];

			if(!strategy._isActive) continue;


			if(dayNumber >= strategy._dayStart  && dayNumber <= strategy._dayFinish)
			{
				return strategy;
			}
		}

		return null;
    }

    static getCurrentDayIndex()
    {
        return  Math.trunc((Global._tikCounter - 1) / 10);  //-- 4 - это количество тиков в одном дне
    }

	static playStop()
	{
		Global._isPlay = false;
		document.getElementById('btn_play').innerHTML = '&#9658;'; //-- start play
		document.getElementById('btn_play').setAttribute('title', 'Play');
	}

	static playStart()
	{
		let dayIdx = Global.getCurrentDayIndex();

		if(dayIdx >= Config._dayCount-1)
		{
			Controller.go2Start();
		}

		Global._isPlay = true;
		Global.playTik();
		document.getElementById('btn_play').innerHTML = '||';  //--- stop play
		document.getElementById('btn_play').setAttribute('title', 'Stop');
	}

	static playTik()
	{
		if(Global._isPlay)
		{
			Global._tikCounter++;
			let dayIdx = Global.getCurrentDayIndex();

			InterfaceHelper.setDay('playTik', dayIdx+1 );
			//Global.go2NextDay('tik');
		
			setTimeout(Global.playTik, 100);						
		}
		else{
			Global.playStop();
		}
	}

	static go2NextDay(src)
	{
		let dayIdx = Global.getCurrentDayIndex();

        if(dayIdx < Global._dayArr.length-1)
        {
            let day = Global._dayArr[dayIdx + 1];
            InterfaceHelper.setDay('Global.go2NextDay + ' + src, day._number);            
        }
        else{
            Global._isPlay = false;
        }
	}

	static setTikCounter(dayNumber)
	{
		Global._tikCounter = dayNumber * 10;  //-- 4 - это количество тиков в одном дне

		//log('setTikCounter=' + Global._tikCounter + ' dayNumber=' + dayNumber )
	}

	static getCurrentSolution()
	{
		return Global._currentSolution;
	}

	static recalcFromInterface(src)
	{
		log('recalcFromInterface() src=' + src);

		let solutionObject = SolutionHelper.createSolutionFromInterface();

		if(solutionObject != null)
		{
			Processor.calcSolution('recalcFromInterface', solutionObject);
			
			Controller.go2End();			
		}
	}

	static setSelectedStrategy(strategyId)
	{
		Global._selectedStrategyId = strategyId;
		Global._slider.redraw();
	}

	static setZarazKoef()
	{
		let s = document.getElementById('zaraz_koef').value.trim();

        let zz = parseFloat(s);

        if(isNaN(parseFloat(s)))
        {
            alert('Ошибка коэффициента заражения!!  Применяем по умолчанию = 0.01 ')
            zz = 0.01
        }  

        Config._zarazKoef = zz;

		document.getElementById('zaraz_cap').innerHTML = 'Коэф. заражения = ' + zz

		//---------------------------------

		s = document.getElementById('prof_kt').value.trim();

        zz = parseFloat(s);

        if(isNaN(parseFloat(s)))
        {
            alert('Ошибка коэффициента затрат на Тестирование!!  Применяем по умолчанию = 2 ')
            zz = 2
        }  

        Config._kT = 2;

		document.getElementById('prof_cap').innerHTML = 'Затрат на тест = ' + zz
	}

}

function log(s){
	console.log(s);
}