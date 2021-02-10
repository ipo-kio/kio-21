import { Epidemic } from "../epidemic";
import { Global } from './Global.js'
import { Config } from './Config.js'
import { InterfaceHelper } from "./InterfaceHelper";

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
}

function log(s){
	console.log(s);
}