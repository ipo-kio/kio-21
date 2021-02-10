import { Global } from "./Global";

export class InterfaceHelper
{
    static setSolutionOnInteface(src, dayNumber)
    {
        log('InterfaceHelper.setSolutionOnInteface('+dayNumber+') src=' + src)
        Global.setTikCounter(dayNumber);
        Global._slider.setValue(dayNumber);

    }
}

function log(s){
	console.log(s);
}