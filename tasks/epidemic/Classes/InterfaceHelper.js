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

            strategy._id = strategy._id * 1;

            if(strategy._id >= StrategyHelper._newDivId)
            {
                StrategyHelper._newDivId = strategy._id + 1;
            }

            log('StrategyHelper._newDivId=' + StrategyHelper._newDivId + ' id=' + strategy._id)

            InterfaceHelper.createStrategyDiv(strategy);
        }

    }

    static setDay(src, dayNumber)
    {
        //log('setDay('+dayNumber+') src=' + src);

        if(dayNumber < 1 || dayNumber > Config._dayCount)
        {
            dayNumber = Config._dayCount;
            log('setDay('+dayNumber+') src=' + src + '  dayNumber ERROR!');
            Global.playStop();
        }

        DrawHelper.drawTik(dayNumber);

        if(!Global._isPlay)
        {
            Global.setTikCounter(dayNumber);
        }
        
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
            newDiv.addEventListener('click', function(){
                InterfaceHelper.strategyDivClick(newDiv.id, newId);
            });
            
            t = document.getElementById('str_del_' + newId);
            t.addEventListener('click', function(){
                Controller.strDelete(newId);
            });

            t = document.getElementById('str_day1_minus_' + newId);
            t.addEventListener('click', function(){
                Controller.strDayPlusMinus('str_from_', newId, 'minus', 1, Config._dayCount);
            });

            t = document.getElementById('str_day1_plus_' + newId);
            t.addEventListener('click', function(){
                Controller.strDayPlusMinus('str_from_', newId, 'plus', 1, Config._dayCount);
            });

            t = document.getElementById('str_day2_minus_' + newId);
            t.addEventListener('click', function(){
                Controller.strDayPlusMinus('str_to_', newId, 'minus', 1, Config._dayCount);
            });

            t = document.getElementById('str_day2_plus_' + newId);
            t.addEventListener('click', function(){
                Controller.strDayPlusMinus('str_to_', newId, 'plus', 1, Config._dayCount);
            });            

            /*
            t = document.getElementById('str_mask_' + newId);
            t.addEventListener('click', function(){
                Controller.strCheck(newId);
            }); 
            */

            t = document.getElementById('str_mask_btn0_' + newId);
            t.addEventListener('click', function(){
                Controller.strMaskSet(newId, '0');
            }); 

            t = document.getElementById('str_mask_btn1_' + newId);
            t.addEventListener('click', function(){
                Controller.strMaskSet(newId, '1');
            });     
            
            t = document.getElementById('str_mask_btn2_' + newId);
            t.addEventListener('click', function(){
                Controller.strMaskSet(newId, '2');
            }); 

            t = document.getElementById('str_mask_btn3_' + newId);
            t.addEventListener('click', function(){
                Controller.strMaskSet(newId, '3');
            }); 

            t = document.getElementById('str_mask_btn4_' + newId);
            t.addEventListener('click', function(){
                Controller.strMaskSet(newId, '4');
            }); 

            t = document.getElementById('str_mask_btn5_' + newId);
            t.addEventListener('click', function(){
                Controller.strMaskSet(newId, '5');
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

            t = document.getElementById('str_day_toleft_' + newId);
            t.addEventListener('click', function(){
                Controller.strDaysMove(newId, 'left');
            }); 

            t = document.getElementById('str_day_toright_' + newId);
            t.addEventListener('click', function(){
                Controller.strDaysMove(newId, 'right');
            }); 


            t = document.getElementById('str_dist_' + newId);
            t.addEventListener('input', function(){
                Controller.strCheck(newId);
            }); 

            t = document.getElementById('str_dist_minus_' + newId);
            t.addEventListener('click', function(){
                Controller.strDayPlusMinus('str_dist_', newId, 'minus', 0, 100);
            });

            t = document.getElementById('str_dist_plus_' + newId);
            t.addEventListener('click', function(){
                Controller.strDayPlusMinus('str_dist_', newId, 'plus', 0, 100);
            }); 
            
        }


        document.getElementById('str_from_' + newId).value = strategy._dayStart;
        document.getElementById('str_to_' + newId).value = strategy._dayFinish;
        //document.getElementById('str_mask_' + newId).checked = (strategy._isMaski);
        document.getElementById('str_kar_' + newId).checked = (strategy._isKarantin);
        //document.getElementById('str_lok_' + newId).checked = (strategy._isLok);
        // document.getElementById('str_active_' + newId).checked = (strategy._isActive);
        document.getElementById('str_dist_' + newId).value = (strategy._distPercent);

        Controller.strMaskSet(newId, strategy._maskKoef + '');
    }

    static strategyDivClick(strDivId, strategyId )
    {
        let div;
        let arr = document.getElementsByClassName('str_div');

        for(let i=0; i < arr.length; i++)
        {
            div = arr[i];
            //div.className = 'str_div';
            div.style.borderColor = 'black';
            //div.style.borderWidth = '1px';

            if(div.id == strDivId)
            {
                div.style.borderColor = 'blue';
                //div.style.borderWidth = '3px';
            }
        }

        Global.setSelectedStrategy(strategyId);
    }
}

function log(s){
	console.log(s);
}