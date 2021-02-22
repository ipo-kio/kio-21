
export class Profit
{
    static getEEForDay(greenCount, yellowCount, redCount, blueCount, strategy, realDistForDayCount, realTestForDayCount)
    {
        let result = 0;
         

        //-- дистанционка
        //--переход на дистанционную работу части работников 
        //--(указывается процент переведенных - дома производительность вдвое меньше)

        if(strategy  && strategy._distPercent > 0) 
        {
            greenCount = (greenCount) - (realDistForDayCount/100 * strategy._distPercent)
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

        return result;
    }

}

function log(s){
	console.log(s);
}