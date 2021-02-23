
export class Zaraza
{
    //-- количество заразившихся за один день
    static getZarazforDay(greenCount, yellowCountZ, redCountZ, blueCount, strategy, realDistForDayCount)
    {
        /*
        На самом деле количество встреч уменьшается при изменении здоровых или заразных определяется произведением 
        G*(Y+R)*k*p, 
        где p-вероятность заразиться (которая и должна быть константой), 
        а коэффициентом k мы управляем, вводя жесткость масочного режима 
        (например, он меняется как 1/log(f+2), 
        где f - степень жесткости масочного режима, а логарифм берется по основанию 2

        Красные шарики после появления присутствуют на рабочем поле (и влияют на заболеваемость) 1 единицу времени
        */
        let f = 0;
        let k = 1;
        let p = 0.01; //-- вероятность заразиться (которая и должна быть константой)

        let res = 0;

        //-- маски
        if(strategy != null && strategy._maskKoef > 0) //-- 0..5
        {
            f = strategy._maskKoef;
            k = 1 / (Math.log2(f + 2));
        }

        //-- дистанционка
        //--переход на дистанционную работу части работников 
        //--(указывается процент переведенных - дома производительность вдвое меньше)
        // -- Те кто на дистанте - те не заражаются и не заражают

        if(strategy  && strategy._distPercent > 0) 
        {
            greenCount = (greenCount) - (realDistForDayCount/100 * strategy._distPercent)
        }

        //-- тестирование
        //-- количество желтых опрделяется на этапе подготовки к вызову этой функции

        blueCount = 0;

        res = (greenCount + blueCount) * (redCountZ + yellowCountZ) * k * p;

        if(res < 0) res = 0;

        return res;
    }
}

function log(s){
	console.log(s);
}