import { Epidemic } from "../epidemic";
import { Global } from './Global.js'
import { Config } from './Config.js'

export class Processor
{
    
    static calcSolution(src, solutionObject)
    {
        log('Processor.calcSolution() - src=' + src);

        let i, man, n, day;
        let dayNumber;
        let greenCount = 0;
        let yellowCount = 0;
        let redCount = 0;
        let blueCount = 0;
        let strategy;
        let kY, ySum;
        let totalEE = 0;

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

                //-- процесс заражения для этого дня
                {
                    if(dayNumber == 1) //-- первый день обрабатываем особо. В нем никто не заражается
                    {
                        ySum = 0;
                        kY = 0;
                    }
                    else{
        
                        kY = Processor.getZarazforDay(greenCount, yellowCount, redCount, blueCount, strategy); //-- кол. заразившихся в этот день
                        //--Накапливаем, т.к. количество может быть меньше единицы
                        ySum = ySum + kY;
        
                    }

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
                            }
        
                            if(n == 0)
                            {
                                break;
                            }
                        }
        
                        ySum = ySum - n1;
                    }
                }

                for(let j=0; j < Global._manArr.length; j++)
                {
                    man = Global._manArr[j];        
                    man._dayColorArr.push(man._color);
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
                day._kY = kY;
                day._ySum = ySum;
    
                Global._dayArr.push(day);
            }
        }

        //-- окончательный расчет
        {
            let totalEEAvr = totalEE/Config._dayCount;

            solutionObject._totalProfit = totalEE;
            solutionObject._totalProfitAvr = totalEEAvr;
        }

        Global._currentSolution = solutionObject;
        Epidemic.saveCurrentSolution('calcSolution');
    }

    static getEEForDay(greenCount, yellowCount, redCount, blueCount, strategy)
    {
        //-- Чем больше одновременно красных, тем больше убыль ЕЕ
    
        var n;   
        var rab = (greenCount +  yellowCount + blueCount);  
        var U =  0 ; //redCount + (redCount*(redCount-1))/10;
        var EE = rab - U;
    
        if(strategy && strategy._isMaski)
        {
            n = Math.abs(EE) * Config._maskEE;
    
            if(EE < 0)
            {
                EE = EE - (Math.abs(EE) - n);
            }
            else{
                EE = n;
            }
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
        let res = 0;
        let Z = (yellowCount + redCount) ; //-- количество заразных

        if(greenCount == 0 && Z == 0)
        {
            res = 0;
        }
        else{

            var kKarantin =0;

            if(strategy && strategy._isKarantin)
            {
                kKarantin = redCount;
            }


            var R = Z * Config._stukByDayCount;

            if(strategy && strategy._isMaski)
            {
                R = R * Config._maskZ;
            }


 
        }


        return res;
    }



    static createVector(man)
    {
        let h;

        h = Processor.getPlusminus();  
        man.vx = (Math.random() * h);
    
        h = Processor.getPlusminus();    
        man.vy = (Math.random() * h);
    
        man.vx = man.vx + 2* h;
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