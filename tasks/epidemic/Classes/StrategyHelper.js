
import { Global } from './Global.js'
import { Config } from './Config.js'
import { InterfaceHelper } from "./InterfaceHelper";

export class StrategyHelper
{
    static _divId = 1;

    static addNewManually()
    {
        let str = StrategyHelper.createEmptyStarategy();

        str._dayStart = StrategyHelper.getNextNewDay();
        str._dayFinish = str._dayStart + 1;


        InterfaceHelper.createStrategyDiv(str);
    }

    static createEmptyStarategy()
    {
        let str = new Object();
        str._id = StrategyHelper._divId++;
        str._dayStart = 1;
        str._dayFinish = 2;
        str._isMaski = false;
        str._isKarantin = false;
        str._isLok = false;
        str._isActive = true;

        return str;
    }

    static getNextNewDay()
    {
        return 1;
    }
}