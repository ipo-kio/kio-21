import { Epidemic } from "../epidemic";
import { Global } from './Global.js'
import { Config } from './Config.js'
import { InterfaceHelper } from "./InterfaceHelper";
import { StrategyHelper } from "./StrategyHelper";


export class Controller
{
    static go2Start()
    {     
        Global.playStop();

        //if(dayNumber == 1)
        {
            Global._manArr.forEach((element) => {
                element.x = Global._canvas1W * Math.random() -0;
                element.y = Global._canvas1H * Math.random() -0;
            })

        }

        InterfaceHelper.setDay('go2Start', 1);
    }

    static go2End()
    {     
        Global.playStop();
        InterfaceHelper.setDay('go2End', (Config._dayCount) );
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
            InterfaceHelper.setDay('go2Prev', day._number);  
        }
    }

    static go2Day(dayNumber)
    {
        Global.playStop();
        InterfaceHelper.setDay('go2Day', dayNumber );
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

    static addStrategy()
    {
        StrategyHelper.addNewManually();
        Global.recalcFromInterface('addStrategy');
    }

    static strDelete(strId)
    {
        let strDiv = document.getElementById('strategy_' + strId);
        $('#strategy_' + strId).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).promise().done(function(){
            strDiv.parentNode.removeChild(strDiv);
            Global.recalcFromInterface('strDelete ');
        });

        return false;
    }

    static strDaysMove(strId, toLeftRight)
    {
        let pm;
        let ok = false;

        if(toLeftRight == 'left')
        {
            pm = 'minus';

            ok = Controller.strSetPlusMinus('str_from_', strId, pm, 1, Config._dayCount);

            if(ok)
            {
                Controller.strSetPlusMinus('str_to_', strId, pm, 1, Config._dayCount);
            }            
        }
        else{
            pm = 'plus';

            ok = Controller.strSetPlusMinus('str_to_', strId, pm, 1, Config._dayCount);

            if(ok)
            {
                Controller.strSetPlusMinus('str_from_', strId, pm, 1, Config._dayCount);
            }    
        }

        if(ok){
            Global.recalcFromInterface('strDaysMove');
        }      
    }

    static strCheck(strId)
    {
        Global.recalcFromInterface('strCheck strId=' + strId);
    }

    static strMaskSet(strategyId, maskKoef)
    {
        log('strMaskSet ' + strategyId + ' ' + maskKoef)
        let div = document.getElementById('strategy_' + strategyId)
        let btn;
        let arr = div.getElementsByClassName('str_mask_btn');

        for(let i = 0; i < arr.length; i++)
        {
            btn = arr[i];
            btn.style.backgroundColor = 'silver';

            if(btn.getAttribute('koef') == maskKoef)
            {
                btn.style.backgroundColor = 'red';
                div.setAttribute('mask_koef', maskKoef)
            }
        }

        Global.recalcFromInterface('strMaskSet strategyId=' + strategyId);
    }

    static strSetPlusMinus(targetInputId, strId, pm, min, max)
    {
        let res = true;
        let t = document.getElementById(targetInputId + strId);

        let s = t.value.trim();
        let val = parseInt(s, 10);
    
    
        if(val === parseInt(val, 10))
        {
            if(pm == 'minus')
            {
                if(val > min)
                {
                    val = val - 1;
                }
                else if(val == min)
                {
                    res = false;
                }
                else{
                    val = min;
                    res = true;
                }              
            }
            else{

                if(val < max)
                {
                    val = val + 1;
                    res = true;
                }
                else if(val == max){
                    res = false;
                }
                else{
                    val = max;
                    res = true;
                }            
            }
    
            t.value = val;
          
        }
        else{
            res = false;
        }

        return res;
          
    }

    static strDayPlusMinus(targetInputId, strId, pm, min, max)
    {        
        if(Controller.strSetPlusMinus(targetInputId, strId, pm, min, max))
        {
            Global.recalcFromInterface('strDayPlusMinus');
        }
    
        return false;
    }
}

function log(s){
	console.log(s);
}