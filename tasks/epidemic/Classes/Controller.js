import { Epidemic } from "../epidemic";
import { Global } from './Global.js'
import { Config } from './Config.js'
import { InterfaceHelper } from "./InterfaceHelper";
import { StrategyHelper } from "./StrategyHelper";

export class Controller
{
    static go2Start()
    {     
        Global.playStop();
        InterfaceHelper.setSolutionOnInteface('go2Start', 1);
    }

    static go2End()
    {     
        Global.playStop();
        InterfaceHelper.setSolutionOnInteface('go2End', (Config._dayCount-1) );
    }

    static go2Next()
    {     
        Global.playStop();
        Global.go2NextDay('go2Next');
    }

    static go2Prev()
    {     
        let dayIdx = Global.getCurrentDayIndex();

        if(dayIdx > 0)
        {
            Global.playStop();
            let day = Global._dayArr[dayIdx - 1];
            InterfaceHelper.setSolutionOnInteface('go2Prev', day._number);  
        }
    }

    static go2Day(dayNumber)
    {
        Global.playStop();
        InterfaceHelper.setSolutionOnInteface('go2Day', dayNumber );
    }

    static playStartStop()
    {
        if(Global._isPlay)
        {
            Global.playStop();
        }
        else
        {
            Global.playStart();
        }
    }

    static addStrategy()
    {
        StrategyHelper.addNewManually();
    }

    static strDelete(strId)
    {
        let strDiv = document.getElementById('strategy_' + strId);
        strDiv.parentNode.removeChild(strDiv);
        return false;
    }

    static strDayPlusMinus(targetInputId, strId, pm)
    {
        let t = document.getElementById(targetInputId + strId);

        let s = t.value.trim();
        let val = parseInt(s, 10);
    
    
        if(val === parseInt(val, 10))
        {
            if(pm == 'minus')
            {
                val = val - 1;
            }
            else{
                val = val + 1;
            }

            if(val < 1)
            {
                val = 1;
            }
            else
            {
                if(val > Global._dayCount)
                {
                    val = Global._dayCount;
                }
            }
    
            t.value = val;

            Global.recalcFromInterface('strDayPlusMinus');
        }
    
        return false;
    }
}

function log(s){
	console.log(s);
}