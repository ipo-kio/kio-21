import { Epidemic } from "../epidemic";
import { Solution } from "./Solution";
import { InterfaceHelper } from "./InterfaceHelper";
import { Controller } from "./Controller";

export class Global
{
	static _canvasTop;
	static _slider;
	static _currentSolution;
	static _canvas1W;
	static _canvas1H;
	static _manArr = [];
	static _dayArr = [];
	static _isPlay = false;
	static _tikCounter = 0;

    static getStrategyForDay(dayNumber, solutionObject)
    {
		let strategy = null;

		return strategy;
    }

    static getCurrentDayIndex()
    {
        return  Math.trunc((Global._tikCounter - 1) / 4);  //-- 4 - это количество тиков в одном дне
    }

	static playStop()
	{
		Global._isPlay = false;
		document.getElementById('btn_play').innerHTML = '&#9658;'; //-- start play
	}

	static playStart()
	{
		Global._isPlay = true;
		Global.playTik();
		document.getElementById('btn_play').innerHTML = '&#10074;';  //--- stop play
	}

	static playTik()
	{
		if(Global._isPlay)
		{
			Controller.go2Next();
			setTimeout(Global.playTik, 100);		
		}
	}

	static go2NextDay(src)
	{
		let dayIdx = Global.getCurrentDayIndex();

        if(dayIdx < Global._dayArr.length-1)
        {
            let day = Global._dayArr[dayIdx + 1];
            InterfaceHelper.setSolutionOnInteface('Global.go2NextDay + ' + src, day._number);            
        }
        else{
            Global._isPlay = false;
        }
	}

	static setTikCounter(dayNumber)
	{
		Global._tikCounter = dayNumber * 4;  //-- 4 - это количество тиков в одном дне

		log('tikcounter=' + Global._tikCounter )
	}

	static getCurrentSolution()
	{
		return Global._currentSolution;
	}

}

function log(s){
	console.log(s);
}