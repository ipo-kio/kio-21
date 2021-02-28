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

        //-- переменные
        
            
            Global.setZarazKoef();
    
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
            let redRabCount;
            let yellowRabCount;
            let bolnicaCount; //-- счетчик оставшихся мест в больнице
            let logStr = '';
            let greenRabCount;
            let blueRabCount;
            let bolnicaFillCount = 0;
            let strategyId;
            let prevDay = null;
    
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
            man._stukOff = false;
            man._distStrId = 0;
            man._testStrId = 0;
            
            
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

        //-- крутим дни
        for(let dayIndex=0; dayIndex < Config._dayCount; dayIndex++)
        {
            
            //-- переменные
            {
                dayNumber = dayIndex + 1;
                greenCount = 0;
                yellowCount = 0;
                greenRabCount = 0;
                redCount = 0;
                blueCount = 0;
                redRabCount = 0;
                blueRabCount = 0;
                yellowRabCount = 0;
                bolnicaCount = Config._bolnicaMax;
                bolnicaFillCount = 0;
                toDistForDay = 0;
                toTestForDay = 0;

                if(prevDay != null)
                {
                    greenRabCount = prevDay._greenRabCount;
                    yellowRabCount = prevDay._yellowRabCount;
                    redRabCount = prevDay._redRabCount;
                    blueRabCount = prevDay._blueRabCount;
                }
                else{
                    yellowRabCount = 1;  //-- это первый зараженный
                    greenRabCount = Config._manCount - 1;
                }
                
            }

            
          
            //-- переход состояния от времени
            for(let j=0; j < Global._manArr.length; j++)
            {
                man = Global._manArr[j];

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
                        //man._testDayStart = 0;

                        man._state = 'B'
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
                }

               //-- суммы по цветам за день перед применением стратегий
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

            

            strategy = Global.getStrategyForDay(dayNumber, solutionObject);

            if(strategy != null)
            {
                strategyId = strategy._id;
            }
            else{
                strategyId = 0;
            }


            //-- отправляем в больницу
            {
                if(bolnicaCount > 0)
                {
                    //- заполняем новыми
                    for(let j=0; j < Global._manArr.length; j++)
                    {
                        man = Global._manArr[j];

                        if(man._color != 'red') continue;

                        if(man._testStrId == strategyId && strategyId != 0) continue;  //-- пропустим тех кто Дома
                        if(man._distStrId == strategyId && strategyId != 0) continue;  //-- пропустим тех кто Дома
                        if(man._bolnicaDayDic.hasOwnProperty(dayNumber-1)) 
                        {
                            //-- он уже в больнице
                            //-- продлеваем
                            man._bolnicaDayDic[dayNumber] = 1;
                            bolnicaFillCount++;
                            bolnicaCount--;

                            continue;  
                        }

                   
                        {
                            if(man._firstRedDay == dayNumber
                                || man._distByDayDic.hasOwnProperty(dayNumber - 1))
                            {
                                //-- первый день еще гуляет
                                //-- либо только вышел из Дома
                            }
                            else
                            {
                                if(bolnicaCount > 0)
                                {
                                    //-- отправляем
                                    man._bolnicaDayDic[dayNumber] = 1;
                                    bolnicaFillCount++;
                                    bolnicaCount--;
                                    redRabCount--

                                    if(bolnicaCount == 0)
                                    {
                                        break;
                                    }
                                }
                            }  
                        }                    
                    }                    
                }



            }

            
            //-- определим дистанционщиков (карантин)
            {

              let distGreenCount = 0;
              let distYellowCount = 0;
              let distRedCount = 0;

               if(strategy != null)
               {
                    if(strategy._dayStart == dayNumber)
                    {
                       //-- запоминаем количество на Карантин для первого дня стратегии

                        strategy._distGreenCount =  StrategyHelper.getDistManCount(strategy, greenRabCount);
                        strategy._distYellowCount =  StrategyHelper.getDistManCount(strategy, yellowRabCount);
                        strategy._distRedCount =  StrategyHelper.getDistManCount(strategy, redRabCount);

                        distGreenCount = strategy._distGreenCount;
                        distYellowCount = strategy._distYellowCount;
                        distRedCount = strategy._distRedCount;
                    }                   

               }

               //log(dayNumber + ') dg=' +distGreenCount  + ' Gz=' + greenRabCount)

                //-- продлеваем дистанционку тем кто на ней
                for(let j=0; j < Global._manArr.length; j++)
                {
                    man = Global._manArr[j];

                    //-- по дистанционке синий сидит до конца стратегии
                    //-- по тестированию синий сразу выходит с дистанционки

                    //-- если он сидит Дома по Дистанционке, то пусть сидит до конца стратегии
                    if(man._distStrId == strategyId && strategyId != 0)
                    {
                        man._distByDayDic[dayNumber] = 1;
                        toDistForDay++;
                        if(man._color == 'green')
                        {
                            distGreenCount--;
                        }
                        else if(man._color == 'yellow')
                        {
                            distYellowCount--;
                        }
                        else if(man._color == 'red')
                        {
                            distRedCount--;
                        }                        
                        
                        continue;
                    }

                    //-- если он дома по Тестированию, то синий выходит, а остальные сидят дальше
                    if(man._testStrId == strategyId && strategyId != 0)
                    {
                        if(man._color != 'blue')
                        {
                            man._distByDayDic[dayNumber] = 1;
                            toDistForDay++;
                        }
                        else
                        {
                            blueRabCount++;
                        }
                        continue;
                    }
                    //-- отправляем новых на карантин
                    {                           
                        if(man._color == 'green' && distGreenCount > 0)
                        {
                            man._distByDayDic[dayNumber] = 1;
                            distGreenCount--;
                            man._distStrId = strategyId;
                            greenRabCount--
                            toDistForDay++;
                        }         
                        if(man._color == 'yellow' && distYellowCount > 0)
                        {
                            man._distByDayDic[dayNumber] = 1;
                            distYellowCount--;
                            man._distStrId = strategyId;
                            yellowRabCount--
                            toDistForDay++;
                        } 
                        if(man._color == 'red' && distRedCount > 0)
                        {
                            man._distByDayDic[dayNumber] = 1;
                            distRedCount--;
                            man._distStrId = strategyId;
                            redRabCount--
                            toDistForDay++;
                        }                                                                                                                               
                    }
                }
                

            }            

            //-- подсчитаем количества цветов перед заражением и тестированием
            {
                
                greenCount = 0;
                yellowCount = 0;
                yellowRabCount = 0;
                greenRabCount = 0
                redCount = 0;
                blueCount = 0;
                redRabCount = 0;
                blueRabCount = 0;
                //toDistForDay = 0;
                toTestForDay = 0;

                
                for(let j=0; j < Global._manArr.length; j++)
                {
                    man = Global._manArr[j];     
                    
                    if(man._color == 'green')
                    {
                        greenCount++;

                        if(!man._distByDayDic.hasOwnProperty(dayNumber))
                        {
                            greenRabCount++;
                        }
                        else{
                            //toDistForDay++
                        }

                    }
                    else if(man._color == 'yellow')
                    {
                        yellowCount++;

                        if(!man._distByDayDic.hasOwnProperty(dayNumber)
                        && (man._testStrId != strategyId || man._testStrId == 0))
                        {
                            //-- если не Дома и не дома по Тестированию
                            yellowRabCount++;
                        }
                        else{
                            //toDistForDay++
                        }
                    }
                    else if(man._color == 'red')
                    {
                        redCount++;

                        if(!man._bolnicaDayDic.hasOwnProperty(dayNumber))
                        {
                            if(man._testStrId != strategyId || strategyId == 0)
                            {
                                if(man._distStrId != strategyId || strategyId == 0)
                                {
                                    //-- если не в Больнице и не дома по Тестированию
                                    redRabCount++;
                                }
                            }
                        }
                    }
                    else if(man._color == 'blue')
                    {
                        blueCount++;
                        
                        if(man._distStrId != strategyId || strategyId == 0)
                        {
                            //-- если  не дома по Тестированию
                            blueRabCount++;
                        }
                    }                
    
                }
                
            }


            //-- тестирование. Новые
            //-- берем процент для каждого цвета кроме Синих
           
            if(strategy && strategy._testPercent > 0)
            {
                let testGreenCount = StrategyHelper.getTestColorCount(strategy, greenRabCount);
                let testYellowCount = StrategyHelper.getTestColorCount(strategy, yellowRabCount);
                let testRedCount = StrategyHelper.getTestColorCount(strategy, redRabCount);

                //log(dayNumber + ' ' +testGreenCount + '(' + greenRabCount + ')-' +  testYellowCount + '(' + yellowRabCount + ')-' +  testRedCount+ '(' + redRabCount + ')-'  + ' bol=' + bolnicaFillCount )

                {
                    for(let j=0; j < Global._manArr.length; j++)
                    {
                        man = Global._manArr[j];
                        if(man._color == 'blue') continue;

                        if(man._testStrId == strategyId && strategyId > 0)
                        {
                            //-- он уже на тастировании (желтый или красный)
                            //-- продилм ему сидение Дома, но он уже не в тестировании
                            man._testByDayDic[dayNumber] = 1;
                            man._distByDayDic[dayNumber] = 1;
                        }

                        if(
                            !man._distByDayDic.hasOwnProperty(dayNumber)
                            && !man._bolnicaDayDic.hasOwnProperty(dayNumber))
                        {
                            //-- если не Дома и не в больнице

                            if(man._color == 'green' && testGreenCount > 0)
                            {
                                man._testByDayDic[dayNumber] = 1;
                                testGreenCount--;
                                toTestForDay++;
                            }
                            else if(man._color == 'yellow' && testYellowCount > 0)
                            {
                                //-- отправляем Домой
                                man._testByDayDic[dayNumber] = 1;
                                man._distByDayDic[dayNumber] = 1;
                                testYellowCount--
                                yellowRabCount--;
                                man._testStrId = strategyId;
                                toTestForDay++;
                                toDistForDay++;
                            }
                            else if(man._color == 'red' && testRedCount > 0)
                            {
                                //-- отправляем Домой
                                man._testByDayDic[dayNumber] = 1;
                                man._distByDayDic[dayNumber] = 1;
                                testRedCount--
                                redRabCount--;
                                man._testStrId = strategyId;
                                toTestForDay++;
                                toDistForDay++;
                            }                            
                        }
                    }                    
                }
            }
         

            

            //-- процесс заражения для этого дня. Происходит после ежедневного перехода состояний (смена цветов)
            {
                if(dayNumber == 1) //-- первый день обрабатываем особо. В нем никто не заражается
                {
                    ySum = 0;
                    zarazByDay = 0;
                }
                else
                {
                    //-- кол. заразившихся в этот день    
                    zarazByDay = Zaraza.getZarazforDay(greenRabCount, yellowRabCount, redRabCount, blueRabCount
                        , strategy, toDistForDay); 
                    
                    logStr = logStr + '<tr><td>' +   dayNumber + ')</td><td> Z=+' + zarazByDay.toFixed(2) 
                    +  '</td><td>Gz=' + greenRabCount + '</td><td>Yz=' + yellowRabCount + '</td><td>Rz=' + redRabCount + '</td><td>Bz=' + blueRabCount + '</td><td>K=' + toDistForDay + '</td><td>T=' + toTestForDay + '</td></tr>' ;

                    //--Накапливаем, т.к. количество может быть меньше единицы
                    ySum = ySum + zarazByDay;
                }     

             
                
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
                            greenRabCount--
                            yellowCount++;
                            yellowRabCount++;
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
            }

            //-- делаем текущий day
            {
                day = new Object();
                day._number = dayNumber;
                day._dayIndex = dayNumber-1;


                day._ee = Profit.getProfitForDay(
                      greenRabCount
                    , yellowRabCount
                    , redRabCount
                    , blueRabCount
                    , strategy
                    , toDistForDay
                    , toTestForDay) ; //- --расчет ЭЭ за этот день

                let f = 0;
                let t = 0;
                let kT = Config._kT;
                if(strategy)
                {
                    f = strategy._maskKoef;
                    t = strategy._testPercent/100;

                }
    
                logStr = logStr + '<tr><td></td><td>E=' + day._ee.toFixed(2) 
                +  '</td><td>Gz=' + greenRabCount 
                + '</td><td>Yz=' + yellowRabCount 
                + '</td><td>Rz=' + redRabCount 
                + '</td><td>Bz=' + blueRabCount  
                + '</td><td>K=' + toDistForDay + '</td><td>T=' + toTestForDay 
                + '</td><td>E=('+greenRabCount+'+'+yellowRabCount+'+'+blueRabCount+') * (1-'+f+'/10) - (('+greenRabCount+'+'+yellowRabCount+'+'+blueRabCount+')*'+t+'*'+kT+') = ' + day._ee.toFixed(2)
                + '</td></tr>';


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

                day._redRabCount = redRabCount;
                day._blueRabCount = blueRabCount;
                day._greenRabCount = greenRabCount;
                day._yellowRabCount = yellowRabCount;
    
                Global._dayArr.push(day);

                //log(dayNumber + ' zarazByDay=' + zarazByDay)
            }            

            prevDay = day;
        } //-- for крутим дни

        document.getElementById('div_log').innerHTML = '<table>' +  logStr + '</table>';

        //-- окончательный расчет
        {
            let totalEEAvr = totalEE/Config._dayCount;

            solutionObject._totalProfit = Math.round(totalEE);
            solutionObject._totalProfitAvr = Math.round(totalEEAvr);
        }

        Global._currentSolution = solutionObject;
        Epidemic.saveCurrentSolution('calcSolution');
    }

    static createVector(man)
    {
        let h;

        h = Processor.getPlusminus();  
        man.vx = ((1 + Math.random()) * h);

        man.vx = man.vx + 2* h;
    
        h = Processor.getPlusminus();    
        man.vy = ((1 + Math.random())  * h);
    
        
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