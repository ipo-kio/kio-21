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

        document.getElementById('day_cap').innerHTML = dayNumber

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


        let day = Global._dayArr[dayNumber-1];

        let t ;

        t = document.getElementById('day_log0');
        t.innerHTML = 'Перед тестированием';
        t.innerHTML += '<br>Gz = ' + day._greenRabCount1;
        t.innerHTML += '<br>Yz = ' + day._yellowRabCount1;
        t.innerHTML += '<br>Rz = ' + day._redRabCount1;
        t.innerHTML += '<br>Bz = ' + day._blueRabCount1;

        t = document.getElementById('day_log1');
        t.innerHTML = '';
        t.innerHTML += '<br>Больница: ' + day._bolnicaCount + '(+' + day._bolnicaDayAdd + ')';
        t.innerHTML += '<br>Карантин сумма: ' + day._toDistForDay;
        t.innerHTML += '<br>Карантин Карантин: ' + day._toDistForDayK;
        t.innerHTML += '<br>Карантин Карантин (новые): ' + day._toDistForDayKone;
        t.innerHTML += '<br>Карантин Тестирование: ' + day._toDistForDayT;
        t.innerHTML += '<br>Карантин Тестирование (новые): ' + day._toDistForDayTone;       
        t.innerHTML += '<br>Заражение (новые): ' + day._zarazPlus;
        t.innerHTML += '<br>Появление новых: ' + day._neeYellowAdd + ' (' + day._manCount + ')';
        t.innerHTML += '';

        t = document.getElementById('day_log2');
        t.innerHTML = 'В конце дня (переход-больница-карантин-тестирование-заражение)';
        t.innerHTML += '<br>Gz = ' + day._greenRabCount;
        t.innerHTML += '<br>Yz = ' + day._yellowRabCount;
        t.innerHTML += '<br>Rz = ' + day._redRabCount;
        t.innerHTML += '<br>Bz = ' + day._blueRabCount;

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

            //-- LEVEL SETTINGS
            if(Config._level != 0)
            {
                t = document.getElementById('str_mask_btn0_' + newId);
                t.addEventListener('click', function(){
                    Controller.strMaskSet(newId, '0');
                }); 

                t = document.getElementById('str_mask_btn1_' + newId);
                t.addEventListener('click', function(){
                    Controller.strMaskSet(newId, '1');
                });     
                
                if(Config._level == 2)
                {
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
                }              
            }



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


            //-- LEVEL SETTINGS
            /*
            if(Config._level != 0)
            {
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
            else
            {
                t = document.getElementById('str_dist_act_' + newId);
                t.addEventListener('click', function(){
                    Controller.strDistClick(newId);
                });
            }
            */
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
            //-----------------




            t = document.getElementById('str_test_' + newId);
            t.addEventListener('input', function(){
                Controller.strCheck(newId);
            }); 

            t = document.getElementById('str_test_minus_' + newId);
            t.addEventListener('click', function(){
                Controller.strDayPlusMinus('str_test_', newId, 'minus', 0, 100);
            });

            t = document.getElementById('str_test_plus_' + newId);
            t.addEventListener('click', function(){
                Controller.strDayPlusMinus('str_test_', newId, 'plus', 0, 100);
            }); 
            
        }


        document.getElementById('str_from_' + newId).value = strategy._dayStart;
        document.getElementById('str_to_' + newId).value = strategy._dayFinish;


        //-- LEVEL SETTINGS
        /*
        let ch = document.getElementById('str_dist_act_' + newId);
        if(ch)
        {
            ch.checked = strategy._distEnabled;
            Controller.setDist(newId);
        }
        else{
            //if(Config._level == 2)
            {
                document.getElementById('str_dist_' + newId).value = strategy._distPercent;
            }
        }
        */
       document.getElementById('str_dist_' + newId).value = strategy._distPercent;
        


        
        document.getElementById('str_test_' + newId).value = (strategy._testPercent);

        //-- LEVEL SETTINGS
        if(Config._level != 0)
        {
            Controller.strMaskSet(newId, strategy._maskKoef + '');
        }
      

        return newDiv;
        
    }

    static showStrategyDivByStrId(src, selectedStrId)
    {
        log('InterfaceHelper.showStrategyDivByStrId('+selectedStrId+') src=' + src)

        let strategy = Global.getStrategyById(selectedStrId);

        if(strategy == null) return;

        let dayStart = strategy._dayStart;

        let div, strId
        let arr = document.getElementsByClassName('str_div')


        for(let i=0; i < arr.length; i++)
        {
            div = arr[i];
            strId = div.getAttribute('str_id');
            if(strId == null) continue; //-- это шаблон

            if(strId == selectedStrId)
            {
                InterfaceHelper.showStrategyDiv('showStrategyDivByStrId', div, dayStart);
                return;
            }

        }
    }

    static showStrategyDiv(src, strDiv, dayStart)
    {
        log('showStrategyDiv() src=' + src)
        let div, strId, s;
        let arr = document.getElementsByClassName('str_div')

        for(let i=0; i < arr.length; i++)
        {
            div = arr[i];
            strId = div.getAttribute('str_id');
            if(strId == null) continue; //-- это шаблон

            if(strDiv.id == div.id)
            {
                div.style.display = 'inline-block'
                //div.style.marginLeft = (dayStart * 8) + 'px';         
                
                if(div.style.backgroundColor == 'red')
                {
                    s = 'Не действует'
                }
                else{
                    s = '';
                }

                document.getElementById('strategy_error').innerHTML = s;
            }
            else{
                div.style.display = 'none'
            }
            
        }
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

        Global.setSelectedStrategy('strategyDivClick', strategyId);
    }
}

function log(s){
	console.log(s);
}