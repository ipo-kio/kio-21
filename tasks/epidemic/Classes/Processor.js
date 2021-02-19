import { Epidemic } from "../epidemic";
import { Global } from './Global.js'
import { Config } from './Config.js'
import { StrategyHelper } from "./StrategyHelper";

export class Processor
{
    
    static calcSolution(src, solutionObject)
    {
        log('Processor.calcSolution() - src=' + src);

        let i, man, n, n1, day;
        let dayNumber;
        let greenCount = 0;
        let yellowCount = 0;
        let redCount = 0;
        let blueCount = 0;
        let strategy;
        let kY, ySum;
        let totalEE = 0;
        let zarazByDay;
        let zAdd;
        let toDistCnt;
        let redCountZaraz;

        Global._manArr = [];
        Global._dayArr = [];

        //-- подготовка людей
        for(i=0; i < Config._manCount; i++)
        {
			man = new Object();
			man._color = 'green';
			man._firstYellowDay = -1;
			man._firstRedDay = -1;
			man._firstBlueDay = -1;
			man._dayColorArr = [];
			man.x = Global._canvas1W * Math.random() -0;
			man.y = Global._canvas1H * Math.random() -0;
			Processor.createVector(man);
			man._stuk = true;
			man._id = i;
			man._lastStukId = i;	
            man._distByDayDic = {};
            man._vxSetted = false;
            
			Global._manArr.push(man);
        }

        //-- первый зараженный Желтый и красный
        {
            n = 0;

            for(i=0; i < Config._manCount; i++)
            {
                if(n == Config._startYCount) break;
                man = Global._manArr[i];
                if(man._color != 'green') continue;
                man._color = 'yellow';
                man._firstYellowDay = 1;
                man._firstRedDay = -1;
                n++;
            }

            /*
            n = 0;

            for(i=0; i < config._manCount; i++)
            {
                if(n == Config._startRCount) break;
                man = Global._manArr[i];
                if(man._color != 'green') continue;
                man._color = 'red';
                man._firstYellowDay = 1;
                man._firstRedDay = 1;
                n++;
            }     
            */       
        }

        for(let dayIndex=0; dayIndex < Config._dayCount; dayIndex++)
        {
            dayNumber = dayIndex + 1;
            greenCount = 0;
            yellowCount = 0;
            redCount = 0;
            blueCount = 0;
            redCountZaraz = 0;


            strategy = Global.getStrategyForDay(dayNumber, solutionObject);

            

            for(let j=0; j < Global._manArr.length; j++)
            {
                man = Global._manArr[j];

                //-- переход состояния от времени
                {
                    /*
                    При встрече зеленого кружка с желтым или красным он становится желтым.
                    Через две недели желтый становится красным.
                    Через 4 недели красный становится фиолетовым и перемещается в рабочую область.
                    */    
                   if(man._color == 'green')
                   {
                       if(man._firstYellowDay > 0 )
                       {
                           man._color = 'yellow';
                           man._firstYellowDay = dayNumber;
                       }
                   }
                   else if(man._color == 'yellow')
                   {
                       if(man._firstYellowDay <= dayNumber - Config._toRedDays)
                       {
                           man._color = 'red';
                           man._firstRedDay = dayNumber;
                       }
                   }
                   else if(man._color == 'red')
                   {
                       if(man._firstRedDay <= dayNumber - Config._toBlueDays)
                       {
                           man._color = 'blue';
                           man._firstBlueDay = dayNumber;
                           man._firstYellowDay = -1;
                       }
                       
                       if(man._firstRedDay == dayNumber - 1)
                       {
                            redCountZaraz++;
                       }
                   }
                   else if(man._color == 'blue')
                   {
                       if(Config._toGreenDays > 0 && (man._firstBlueDay <= dayNumber - Config._toGreenDays))
                       {
                           man._color = 'green';
                           man._firstYellowDay = -1;
                           man._firstBlueDay = -1;
                           man._firstRedDay = -1;
                       }
                   }                                   
                }

                //-- суммы по цветам за день перед началом процесса заражения
                {
                    if(man._color == 'green')
                    {
                        greenCount++;
                    }
                    else if(man._color == 'yellow')
                    {
                        yellowCount++;
                    }
                    else if(man._color == 'red')
                    {
                        redCount++;
                    }
                    else if(man._color == 'blue')
                    {
                        blueCount++;
                    }
                }

            }

            //-- процесс заражения для этого дня
            {
                if(dayNumber == 1) //-- первый день обрабатываем особо. В нем никто не заражается
                {
                    ySum = 0;
                    zarazByDay = 0;
                }
                else{
    
                    zarazByDay = Processor.getZarazforDay(greenCount, yellowCount, redCountZaraz, blueCount, strategy); //-- кол. заразившихся в этот день
                    //--Накапливаем, т.к. количество может быть меньше единицы
                    ySum = ySum + zarazByDay;
                            
                }

                zAdd = 0;

                if(ySum >= 1)
                {
                    n = Math.trunc(ySum); //-- если накопилось целое, то конвертируем его цвета (заражаем)
                    n1 = n;
    
                    for(let j=0; j < Global._manArr.length; j++)
                    {
                        man = Global._manArr[j];
    
                        if(man._color == 'green')
                        {
                            man._color = 'yellow';
                            man._firstYellowDay = dayNumber;
                            n--;
                            greenCount--;
                            yellowCount++;

                            zAdd++;
                        }
    
                        if(n == 0)
                        {
                            break;
                        }
                    }
    
                    ySum = ySum - n1;
                }
            } 
            
            //-- количество людей на дистанционке в этот день
            toDistCnt = StrategyHelper.getDistManCount(strategy, (greenCount + yellowCount + blueCount));  

            for(let j=0; j < Global._manArr.length; j++)
            {
                man = Global._manArr[j];        
                man._dayColorArr.push(man._color);

                //-- дистанционка
                {
                    if(toDistCnt > 0)
                    {
                        if(man._color == 'green')
                        {
                            man._distByDayDic[dayNumber] = 1;

                            toDistCnt--;
                        }
                    }    
                }
            }

            //-- делаем текущий day
            {
                day = new Object();
                day._number = dayNumber;
                day._dayIndex = dayNumber-1;
                day._ee = Processor.getEEForDay(greenCount, yellowCount, redCount, blueCount, strategy) ; //- (redCount) --расчет ЭЭ за этот день
    
                totalEE = totalEE + day._ee;
    
                day._eeTotal = totalEE;
                day._redCount = redCount;
                day._blueCount = blueCount;
                day._greenCount = greenCount;
                day._yellowCount = yellowCount;
                day._zarazByDay = zarazByDay;
                day._zarazPlus = zAdd;
                day._ySum = ySum;
                day._strategy = strategy;
    
                Global._dayArr.push(day);

                //log(dayNumber + ' zarazByDay=' + zarazByDay)
            }
        }

        //-- окончательный расчет
        {
            let totalEEAvr = totalEE/Config._dayCount;

            solutionObject._totalProfit = Math.round(totalEE);
            solutionObject._totalProfitAvr = Math.round(totalEEAvr);
        }

        Global._currentSolution = solutionObject;
        Epidemic.saveCurrentSolution('calcSolution');
    }

    static getEEForDay(greenCount, yellowCount, redCount, blueCount, strategy)
    {

    
        var n;   
        var rab = (greenCount +  yellowCount + blueCount);  
        var U =  0 ; //redCount + (redCount*(redCount-1))/10;
        

        //-- дистанционка
        //--переход на дистанционную работу части работников 
        //--(указывается процент переведенных - дома производительность вдвое меньше)
        if(strategy)
        {
            rab = rab -  (rab/100 *  strategy._distPercent)/2;
        }

        var EE = rab - U;
    
        if(strategy)
        {
            n = Math.abs(EE) * (0.1 * strategy._maskKoef);
    
            if(EE < 0)
            {
                EE = EE - (Math.abs(EE) - n);
            }
            else{
                EE = n;
            }
            //log('EE mask = ' + n)
        }
    
        if(strategy && strategy._isKarantin)
        {
            n = Math.abs(EE) * Config._karEE;
    
            if(EE < 0)
            {
                EE = EE - (Math.abs(EE) - n);
            }
            else{
                EE = n;
            }
        }
    
        /*
        if(strategy && strategy._isLok)
        {
            n = Math.abs(EE) * config._lokEE;
    
            if(EE < 0)
            {
                EE = EE - (Math.abs(EE) - n);
            }
            else{
                EE = n;
            }
        }
        */
    
        return EE;
    }

    //-- количество заразившихся за один день
    static getZarazforDay(greenCount, yellowCount, redCount, blueCount, strategy)
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
        let k;
        let p = 0.1;

        //-- дистанционка
        //--переход на дистанционную работу части работников 
        //--(указывается процент переведенных - дома производительность вдвое меньше)
        if(strategy)
        {            
            greenCount = greenCount -  (greenCount/100 *  strategy._distPercent)/2;
            yellowCount = yellowCount -  (yellowCount/100 *  strategy._distPercent)/2;
            blueCount = blueCount -  (blueCount/100 *  strategy._distPercent)/2;
        }

        if(strategy != null && strategy._maskKoef > 0)
        {
            f = strategy._maskKoef;
            k = 1 / (Math.log2(f + 2));
        }
        else{
            k = 1;
        }

        let res = (greenCount + blueCount) * (redCount + yellowCount) * k * p;

        if(greenCount > 0)
        {
            res = greenCount - 1;
        }
        else{
            res = 0;
        }

        res = 1;

        return res;
    }
    static getZarazforDay_Old(greenCount, yellowCount, redCount, blueCount, strategy)
    {

        let res = 0;
        let Z = (yellowCount + redCount) ; //-- количество заразных

        if(greenCount == 0 && Z == 0)
        {
            res = 0;
        }
        else
        {

            let kKarantin =0;

            if(strategy && strategy._isKarantin)
            {
                kKarantin = redCount;
            }


            let R = Z * Config._stukByDayCount;

            if(strategy && strategy._isMaski)
            {
                R = R * Config._maskZ;
            }

            //log(R)
            res = R;
        }


        return res;
    }



    static createVector(man)
    {
        let h;

        h = Processor.getPlusminus();  
        man.vx = (Math.random() * h);

        man.vx = man.vx + 2* h;
    
        h = Processor.getPlusminus();    
        man.vy = (Math.random() * h);
    
        
        man.vy = man.vy + 2* h;
    }

    static getPlusminus()
    {
        let n = Math.trunc(Math.random() * 10);
        let h;

        if(n % 2 == 0)
        {
            h = 1;
        }
        else{
            h = -1;
        }
    
        return h;
    }


}

function log(s){
	console.log(s);
}