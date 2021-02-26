import { Config } from './Config.js';

export class Zaraza
{
    //-- количество заразившихся за один день
    static getZarazforDay(greenCountZ, yellowCountZ, redCountZ, blueCountZ, strategy, realDistForDayCount)
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

        p = Config._zarazKoef;
        //log('Zaraz p=' + p)

        let res = 0;

        //-- маски
        if(strategy != null && strategy._maskKoef > 0) //-- 0..5
        {
            f = strategy._maskKoef;
            k = 1 / (Math.log2(f + 2));
        }


        // -- Те кто на дистанте - те не заражаются и не заражают


        blueCountZ = 0;

        res = (greenCountZ + blueCountZ) * (redCountZ + yellowCountZ) * k * p;

        if(res < 0) res = 0;

        return res;
    }
}

function log(s){
	console.log(s);
}