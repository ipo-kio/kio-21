
import { Global } from './Global.js'
import { Config } from './Config.js'
import { InterfaceHelper } from "./InterfaceHelper";

export class StrategyHelper
{
    static _newDivId = 1;

    static addNewManually()
    {
        

        let str = StrategyHelper.createEmptyStarategy(StrategyHelper._newDivId);

        StrategyHelper._newDivId++;

        str._dayStart = StrategyHelper.getNextNewDay();
        str._dayFinish = str._dayStart + 1;


        InterfaceHelper.createStrategyDiv(str);

        $('#strategy_' + str._id).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    }

    static createEmptyStarategy(strId)
    {
        
        let str = new Object();
        str._id = strId;
        
        str._dayStart = 1;
        str._dayFinish = 2;
        str._isMaski = false;
        str._isKarantin = false;
        //str._isLok = false;
        str._isActive = true;

        return str;
    }

    static getNextNewDay()
    {
        return 1;
    }
}