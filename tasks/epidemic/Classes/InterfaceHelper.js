import { Global } from "./Global";
import { DrawHelper } from "./DrawHelper";
import { Controller } from "./Controller";
import { SolutionHelper } from "./SolutionHelper";
import { StrategyHelper } from "./StrategyHelper";
import { Config } from "./Config";

export class InterfaceHelper
{
    static setSolutionOnInteface(src, solution)
    {
        log('InterfaceHelper.setSolutionOnInteface src=' + src)

		let strategy;
		let conteinerDiv = document.getElementById('strategy_cont');
		conteinerDiv.innerHTML = '';

        for(let i=0; i < solution._strategyArr.length; i++)
        {
            strategy = solution._strategyArr[i];

            if(strategy._id >= StrategyHelper._newDivId)
            {
                StrategyHelper._divId = strategy._id + 1;
            }

            InterfaceHelper.createStrategyDiv(strategy);
        }

    }

    static setDay(src, dayNumber)
    {
        log('setDay('+dayNumber+') src=' + src);

        if(dayNumber < 1 || dayNumber >= Config._dayCount)
        {
            dayNumber = Config._dayCount;
            log('setDay('+dayNumber+') src=' + src + '  dayNumber ERROR!');
        }

        DrawHelper.drawTik(dayNumber);

        Global.setTikCounter(dayNumber);
        Global._slider.setValue(dayNumber);
    }

    static createStrategyDiv(strategy)
    {
        let f, t;
        let containerDiv = document.getElementById('strategy_cont');
        let divSSPattern = document.getElementById('strategy_');
        let newDiv = divSSPattern.cloneNode(true);

        let newId = strategy._id;
        newDiv.id = 'strategy_' + newId;
        newDiv.setAttribute("str_id",  newId);
        let arr = newDiv.getElementsByTagName("*");

        for (var i = 0; i < arr.length; i++)
        {
            if (arr[i].id)
            {
                arr[i].setAttribute("id", arr[i].id + newId);
            }
            if (arr[i].name)
            {
                arr[i].setAttribute("name", arr[i].name + newId);
            }
    
            if(arr[i].tagName === 'LABEL')
            {
                f = arr[i].getAttribute('for');
    
                if(f)
                {
                    arr[i].setAttribute("for", f + newId);
                }
    
    
            }
            else{
                arr[i].setAttribute("str_id",  newId);
            }
        }

        newDiv.style.display = 'inline-block';

		containerDiv.appendChild(newDiv);


        //-- events
        {
            
            t = document.getElementById('str_del_' + newId);
            t.addEventListener('click', function(){
                Controller.strDelete(newId);
            });

            t = document.getElementById('str_day1_minus_' + newId);
            t.addEventListener('click', function(){
                Controller.strDayPlusMinus('str_from_', newId, 'minus');
            });

            t = document.getElementById('str_day1_plus_' + newId);
            t.addEventListener('click', function(){
                Controller.strDayPlusMinus('str_from_', newId, 'plus');
            });

            t = document.getElementById('str_day2_minus_' + newId);
            t.addEventListener('click', function(){
                Controller.strDayPlusMinus('str_to_', newId, 'minus');
            });

            t = document.getElementById('str_day2_plus_' + newId);
            t.addEventListener('click', function(){
                Controller.strDayPlusMinus('str_to_', newId, 'plus');
            });            

            //return str_day_plusminus(this, \'str_from_\');

            t = document.getElementById('str_mask_' + newId);
            t.addEventListener('click', function(){
                Controller.strCheck(newId);
            }); 

            t = document.getElementById('str_kar_' + newId);
            t.addEventListener('click', function(){
                Controller.strCheck(newId);
            }); 

            t = document.getElementById('str_from_' + newId);
            t.addEventListener('input', function(){
                Controller.strCheck(newId);
            }); 

            t = document.getElementById('str_to_' + newId);
            t.addEventListener('input', function(){
                Controller.strCheck(newId);
            }); 
            
        }


        document.getElementById('str_from_' + newId).value = strategy._dayStart;
        document.getElementById('str_to_' + newId).value = strategy._dayFinish;
        document.getElementById('str_mask_' + newId).checked = (strategy._isMaski);
        document.getElementById('str_kar_' + newId).checked = (strategy._isKarantin);
        //document.getElementById('str_lok_' + newId).checked = (strategy._isLok);
       // document.getElementById('str_active_' + newId).checked = (strategy._isActive);
    }
}

function log(s){
	console.log(s);
}