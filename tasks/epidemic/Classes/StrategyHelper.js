
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
        str._isKarantin = false;
        str._isActive = true;
        str._maskKoef = 0;
        str._distPercent = 0;
        str._testPercent = 0;

        return str;
    }

    static getNextNewDay()
    {
        return 1;
    }

    static getDistManCount(strategy, manCount)
    {
        if(strategy == null) return 0;

        return  Math.trunc(manCount/100 *  strategy._distPercent);
    }
}