import { Epidemic } from "../epidemic";
import { Global } from './Global.js'
import { Config } from './Config.js'
import { StrategyHelper } from "./StrategyHelper";
import { Zaraza } from "./Zaraza";
import { Profit } from "./Profit";

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
        let toDistForDay;
        let toTestForDay;
        let toTestCnt;
        let redCountZaraz;
        let yellowCountZaraz;
        let bolnicaCount; //-- счетчик оставшихся мест в больнице
        let logStr = '';
        let yellowRabCount;
        let bolnicaFillCount = 0;

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
            man._testByDayDic = {};
            man._bolnicaDayDic = {};
            man._dayStateArr = [];
            man._vxSetted = false;
            man._testDayStart = 0;
            man._state = 'G';
            
            
			Global._manArr.push(man);
        }
        //log('111')
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
                man._state = 'Y';
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
        //log('222')

        for(let dayIndex=0; dayIndex < Config._dayCount; dayIndex++)
        {
            dayNumber = dayIndex + 1;
            greenCount = 0;
            yellowCount = 0;
            yellowRabCount = 0;
            redCount = 0;
            blueCount = 0;
            redCountZaraz = 0;
            yellowCountZaraz = 0;
            bolnicaCount = Config._bolnicaCount;
            bolnicaFillCount = 0;

            //log('333')
            //-- посчет количества в начале
            for(let j=0; j < Global._manArr.length; j++)
            {
                man = Global._manArr[j];

                if(man._color == 'green')
                {
                    greenCount++;
                }
                else if(man._color == 'yellow')
                {
                    yellowCount++;

                    if(!man._testByDayDic.hasOwnProperty(dayNumber))
                    {
                        if(!man._distByDayDic.hasOwnProperty(dayNumber))
                        {
                            yellowRabCount++; 
                        }                         
                    }
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

            //log('444')

            strategy = Global.getStrategyForDay(dayNumber, solutionObject);


            //-- Дистанционка и тестирование. Влияют на участвующих в расчете заражения в день
            {
                if(strategy)
                {
                    if(strategy._dayStart == dayNumber)
                    {
                        //-- количество людей на дистанционке в эту стратегию
                        strategy._distManCount = StrategyHelper.getDistManCount(strategy, (greenCount)); 
                    }

                    toDistForDay = strategy._distManCount;
                }
                else{
                    toDistForDay = 0;
                }

                //-- количество людей на дистанционке в этот день
                //toDistForDay = StrategyHelper.getDistManCount(strategy, (greenCount));  
                toDistCnt = toDistForDay;
                //-- количество тестируемых в этот день. Желтуе только из рабочих
                toTestCnt = StrategyHelper.getTestManCount(strategy, greenCount, yellowRabCount);  
                toTestForDay = 0;
                //log(dayNumber + ' - ' +  toTestCnt)

                greenCount = 0;
                yellowCount = 0;
                redCount = 0;
                blueCount = 0;

                for(let j=0; j < Global._manArr.length; j++)
                {
                    man = Global._manArr[j];

                    //-- дистанционка  только для зеленых
                    {
                        if(toDistCnt > 0)
                        {
                            //-- 
                            if(man._color == 'green')
                            {
                                man._distByDayDic[dayNumber] = 1;

                                toDistCnt--;
                            }
                        }    

                        //
                        
                        //--  проверим может он уже на тестировании
                        if(toTestCnt > 0)
                        {
                            if(man._color != 'blue')
                            {
                                if(man._testByDayDic.hasOwnProperty(dayNumber-1))
                                {
                                    toTestCnt--;
                                    toTestForDay++;
                                    man._testByDayDic[dayNumber] = 1;

                                    if(man._color == 'yellow')
                                    {
                                        man._state = 'Y test old'
                                    }
                                    else if(man._color == 'red')
                                    {
                                        man._state = 'R test old'
                                    }
                                    
                                }
                            }
                        }
                        else
                        {
                            //-- исключаем из тестирования, т.к. мест нет или тестирования нет

                            //if(man._testByDayDic.hasOwnProperty(dayNumber))
                            if(man._testDayStart > 0)
                            {
                                //delete man._testByDayDic[dayNumber];
                                man._testDayStart = 0;

                                if(man._color == 'yellow')
                                {
                                    man._state = 'Y'
                                }
                                else if(man._color == 'red')
                                {
                                    man._state = 'R'
                                }
                            }

                        }


                        //-- новое тестирование только для желтых

                        if(toTestCnt > 0)
                        {

                            if(man._color == 'yellow' ) // && (man._firstYellowDay < dayNumber - 1)
                            {
                                man._testByDayDic[dayNumber] = 1;

                                if(man._testDayStart == 0)
                                {
                                    man._testDayStart = dayNumber;
                                    man._state = 'Y test new'
                                }
                                else{
                                    man._state = 'Y test old'
                                }
                                
                                //log(man)

                                toTestCnt--;
                                toTestForDay++;
                                //yellowCountZaraz--;  //-- убрали одного в тестирование
                            }
                        }  
                    }
                }
            }
            //log('555')

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
                           if(!man._testByDayDic.hasOwnProperty(dayNumber))
                           {
                                yellowCountZaraz++; 
                                man._state = 'Y'
                           }
                           else{
                                man._state = 'Y nozaraz'
                           }
                           
                       }
                   }
                   else if(man._color == 'yellow')
                   {

                        if(man._firstYellowDay <= dayNumber - Config._toRedDays)
                        {
                            man._color = 'red';
                            man._firstRedDay = dayNumber;

                            if(!man._testByDayDic.hasOwnProperty(dayNumber))
                            {
                                redCountZaraz++;
                                man._state = 'R'
                            }
                            else{
                                man._state = 'R nozaraz'
                            }
                        }
                        else
                        {
                            if(!man._testByDayDic.hasOwnProperty(dayNumber))
                            {
                                yellowCountZaraz++; 
                                man._state = 'Y'
                            }
                            else{
                                man._state = 'Y test'
                            }
                        }
                   }
                   else if(man._color == 'red')
                   {
                        if(man._firstRedDay <= dayNumber - Config._toBlueDays)
                        {
                            man._color = 'blue';
                            man._firstBlueDay = dayNumber;
                            man._firstYellowDay = -1;
                            //man._testDayStart = 0;

                            man._state = 'B'
                        }
                        else
                        {
                            //--количество мест в больнице сделать ограниченным и оставлять больного в рабочем поле для заражения других, 
                            //--но не учитывать его как производителя.

                            if(!man._testByDayDic.hasOwnProperty(dayNumber))
                            {
                                if(man._firstRedDay == dayNumber - 1)
                                {
                                    redCountZaraz++;
                                    //bolnicaCount--;
                                    //man._bolnicaDayDic[dayNumber] = 1;
                                    man._state = 'R new'
                                }
                                else
                                {
                                    if(bolnicaCount > 0)
                                    {
                                        bolnicaCount--;
                                        man._bolnicaDayDic[dayNumber] = 1;
                                        man._state = 'R bol'
                                        bolnicaFillCount++;
                                    }
                                    else
                                    {
                                        redCountZaraz++;
                                        man._state = 'R'
                                    }
                                }                               
                            }
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
                           man._state = 'G'
                       }
                       else{
                            man._state = 'B'
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

            } //-- for manArr

            //log('666')

            //-- процесс заражения для этого дня. Происходит после ежедневного перехода состояний (смена цветов)
            {
                if(dayNumber == 1) //-- первый день обрабатываем особо. В нем никто не заражается
                {
                    ySum = 0;
                    zarazByDay = 0;
                }
                else
                {
                    if(yellowCountZaraz < 0) yellowCountZaraz = 0;
                    

                    toDistForDay =  (toDistForDay  - toDistCnt); //-- реальное количество дистанционщиков

                    //-- кол. заразившихся в этот день    
                    zarazByDay = Zaraza.getZarazforDay(greenCount, yellowCountZaraz, redCountZaraz, blueCount, strategy, toDistForDay); 
                    
                    logStr = logStr + '<tr><td>' +   dayNumber + ')</td><td> Z=' + zarazByDay.toFixed(2) +  '</td><td>G=' + greenCount + '</td><td>Yz=' + yellowCountZaraz + '</td><td>Rz=' + redCountZaraz + '</td><td>B=' + blueCount + '</td><td>D=' + toDistForDay + '</td><td>T=' + toTestForDay + '</td></tr>' ;

                    //log(dayNumber +  ' G=' + greenCount + ' Yz=' + yellowCountZaraz + ' Rz=' + redCountZaraz + ' B=' + blueCount + ' zarazByDay=' + zarazByDay)

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
    
                        if(man._color == 'green' && !man._distByDayDic.hasOwnProperty(dayNumber))
                        {
                            man._color = 'yellow';
                            man._firstYellowDay = dayNumber;
                            man._state = 'Y'
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
            
       

            for(let j=0; j < Global._manArr.length; j++)
            {
                man = Global._manArr[j];        
                man._dayColorArr.push(man._color);
                man._dayStateArr.push(man._state);
            }
          
            //-- делаем текущий day
            {
                day = new Object();
                day._number = dayNumber;
                day._dayIndex = dayNumber-1;


                day._ee = Profit.getEEForDay(greenCount, yellowCount, redCount, blueCount, strategy, toDistForDay, toTestForDay) ; //- (redCount) --расчет ЭЭ за этот день
    
                logStr = logStr + '<tr><td></td><td>E=' + day._ee.toFixed(2) +  '</td><td>G=' + greenCount + '</td><td>Y=' + yellowCount + '</td><td>R=' + redCount + '</td><td>B=' + blueCount  + '</td><td>D=' + toDistForDay + '</td><td>T=' + toTestForDay + '</td></tr>';


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
                day._bolnicaCount = bolnicaFillCount;
    
                Global._dayArr.push(day);

                //log(dayNumber + ' zarazByDay=' + zarazByDay)
            }
        }

        document.getElementById('div_log').innerHTML = '<table>' +  logStr + '</table>';

        //-- окончательный расчет
        {
            let totalEEAvr = totalEE/Config._dayCount;

            solutionObject._totalProfit = Math.round(totalEE);
            solutionObject._totalProfitAvr = Math.round(totalEEAvr);
        }

        Global._currentSolution = solutionObject;
        Epidemic.saveCurrentSolution('calcSolution');

        //log(Global._dayArr)
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