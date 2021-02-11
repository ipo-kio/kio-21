import { Global } from "./Global";
import { DrawHelper } from "./DrawHelper";

export class InterfaceHelper
{
    static setSolutionOnInteface(src, dayNumber)
    {
        log('InterfaceHelper.setSolutionOnInteface('+dayNumber+') src=' + src)

        DrawHelper.drawTik(dayNumber);

        Global.setTikCounter(dayNumber);
        Global._slider.setValue(dayNumber);

    }
}

function log(s){
	console.log(s);
}