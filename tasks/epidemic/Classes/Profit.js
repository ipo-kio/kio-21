import { Config } from './Config.js';

export class Profit
{

    static getProfitForDay(greenCount, yellowCount, redCount, blueCount, strategy, realDistForDayCount, realTestForDayCount)
    {
        //-- Таким образом, производительность в день можно вычислять одной формулой:
        //-- E = ( Gz+Rz+Yz )*(1-f/10) - (Gz+Rz+Yz)*t*2
        //--  f- уровень масочного режима
        //--  t - доля тестируемых в день
        //--  Gz, Rz, Yz - количество шариков разного цвета в данный день.

        let Gz = greenCount
        let Bz = blueCount
        let Yz = yellowCount;
        let f = 0;
        if(strategy  && strategy._maskKoef > 0) 
        {
            f = strategy._maskKoef;
        }

        let t = 0;
        if(strategy  && strategy._testPercent > 0) 
        {
            t = strategy._testPercent/100;
        }

        let kT = Config._kT;  //-- 2  тестирование

        let GBZ = Gz+Bz+Yz;   // - realDistForDayCount;  //-- дома не работаем

        let result;

        /*
        if(kT == 0)
        {
            result = (GBZ)*(1-f/10) 
        }
        else{
            result = (GBZ)*(1-f/10) - (realTestForDayCount) +  realTestForDayCount / kT
          
        }
        */

       result = (GBZ)*(1-f/10) - (GBZ*t*kT)


        return result;
        
    }
 
    static getEEForDay_old(greenCount, yellowCount, redCount, blueCount, strategy, realDistForDayCount, realTestForDayCount)
    {
        let result = 0;
         

        //-- дистанционка
        //--переход на дистанционную работу части работников 
        //--(указывается процент переведенных - дома производительность вдвое меньше)

        if(strategy  && realDistForDayCount > 0) 
        {
            greenCount = (greenCount) - (realDistForDayCount/2)
        }


        result = (greenCount +  yellowCount + blueCount); 

        //--жесткость масочного режима указывается f- степень жесткости от 1 до 5 
        //(соответственно от 10 до 50 процентов будет уменьшатся общая производительность

        if(strategy  && strategy._maskKoef > 0) 
        {
            result = result - (result/100) * (strategy._maskKoef * 10);
        }

        //-- Тестирование
        //--На тестирование нужны затраты, пропорциональные числу тестируемых. 
        //--Они должны быть существенны, чтобы невыгодно было тестировать максимальное число.
        
        if(strategy && realTestForDayCount > 0)
        {
            result = result - (realTestForDayCount * 2)
        }

        //
        /*
        В три шага:
        1)  X = (fG + Y + B)
        2) если есть маски
            X = X - (X/100) * (M * 10)
        3) если есть тестирование
            X = X  - (GY * 2)



        X = (fG + Y + B)

        fG = (G) - (Gd/100 * P)
        G - всего зеленых
        Gd - реальное количество Зеленых на уделенке
        P - процент удаленщиков из стратегии

        Y - всего желтых

        B - всего синих

        M - маски. От 0 до 5

        GY - реальное количество тестируемых Зеленых и Желтых в этот день

        */

        return result;
    }

}

function log(s){
	console.log(s);
}