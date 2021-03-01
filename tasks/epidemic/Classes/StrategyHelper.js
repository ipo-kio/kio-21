
import { Global } from './Global.js'
import { Funcs } from './Funcs.js'
import { InterfaceHelper } from "./InterfaceHelper";
import { Config } from './Config.js';

export class StrategyHelper
{
    static _newDivId = 1;

    static addNewManually()
    {        
        document.getElementById('add_str_btn').disabled = true;
        let str = StrategyHelper.createEmptyStarategy(StrategyHelper._newDivId);

        StrategyHelper._newDivId++;

        str._dayStart = StrategyHelper.getNextNewDay();
        str._dayFinish = str._dayStart + 1;


        let div = InterfaceHelper.createStrategyDiv(str);

        $('#strategy_' + str._id).fadeOut(100).fadeIn(100).promise().done(function(){

            document.getElementById('add_str_btn').disabled = false;
        }
        );
        

        InterfaceHelper.showStrategyDiv('addNewManually', div, str._dayStart);
        Global.setSelectedStrategy('addNewManually', str._id);


        return div;
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
        str._distEnabled = false;
        str._distPercent = 0;
        str._testPercent = 0;
        str._distManCount = 0;
        str._distGreenCount = 0;
        str._distGrYellowCount = 0;
        str._distRedCount = 0;
       

        return str;
    }

    static getNextNewDay()
    {
        let result = 1;
        let contDiv = document.getElementById('strategy_cont');
        let strDiv = contDiv.lastChild;

        if(strDiv && (strDiv instanceof Element))
        {
            let strId = strDiv.getAttribute('str_id');
            if(strId)
            {
                let n = parseInt(document.getElementById('str_to_' + strId).value.trim(), 10);

                if(Funcs.isInt(n))
                {
                    result = n + 1;
                }
                else{
                    result = 3;
                }
            }
            else{
                result = 2;
            }
        }
    
        if(result > Config._dayCount)
        {
            result = Config._dayCount - 1;
        }
        else if(result < 1){
            result = 1;
        }

        return result;
    }

    static getDistManCount(strategy, yellowCount)
    {
        if(strategy == null) return 0;

        let manCount = yellowCount;

        return  Math.trunc(manCount/100 *  strategy._distPercent);
    }

    static getTestColorCount(strategy, manCount)
    {
        if(strategy == null) return 0;

        return Math.trunc(manCount * strategy._testPercent/100);
    }


}