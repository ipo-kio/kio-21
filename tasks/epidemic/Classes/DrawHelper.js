import { Global } from "./Global";
import { Epidemic } from "../epidemic";
import { Processor } from "./Processor";
import { Config } from "./Config";

export class DrawHelper
{
    static drawTik(dayNumber)
    {
        
        let ctx = Global._ctx;
        let W = Global._canvas1W;
        let H = Global._canvas1H;
        
        
        ctx.clearRect(0, 0, W , H);
        ctx.fillStyle="white";
        ctx.fillRect(0,0,W,H);

        let day = Global._dayArr[dayNumber-1];

   

        //let strategy = Global.getStrategyForDay(dayNumber, Global._currentSolution);

        /*
        if(Config._level == 1)
        {
            DrawHelper.drawVariant1(ctx, day);  //-- все стоят
        }
        else{
            //DrawHelper.drawVariant2(ctx, day);  //-- все бегают
            
        }
        */
        DrawHelper.drawVariant3(ctx, day);  //-- все бегают по новой
        //DrawHelper.drawVariant2(ctx, day);  //-- все стоят
        
        DrawHelper.drawDayInfo(day);
    }

    static drawVariant3(ctx, day)
    {
        let radius = 5; //-- ширина/2 человечка
        let radius2 = radius * 2;
        let man, man2;
        let W = Global._canvas1W;
        let H = Global._canvas1H;
        let x, y, dayColor, n;
        let leftX, rightX;
        let topY, botY;
        let vvOK;
        let maskKoef = 0;
        let aa;
        let drawManKontur = false;
        let distPercent = 0;
        let testPercent = 0;

        let headerH = 100;
        let leftW = 100;
        let distW = 150;
        let testH = 150;
        let bolW = 150;
    

        if(day._strategy != null)
        {
            maskKoef = day._strategy._maskKoef;
            distPercent = day._strategy._distPercent;
            testPercent = day._strategy._testPercent;
        }

        //-- заливка комнат Больница
        if(day._bolnicaCount > 0)
        {
            n = day._bolnicaCount / Config._bolnicaCount;
            y = headerH - headerH * n;
            x = 0;
                 
            ctx.fillStyle = 'red';
            ctx.globalAlpha = 0.1;
            ctx.fillRect(x, y, bolW, headerH * n );           
        } 

        //-- заливка комнат производство
        if(day._eeTotal != 0)
        {
            x = bolW;
            n = day._eeTotal / Global._currentSolution._totalProfit;
            y = headerH - headerH * n;

            ctx.fillStyle = 'blue';
            ctx.globalAlpha = 0.2;
            ctx.fillRect(x, y, W - bolW - distW, headerH * n );  
        }

        //-- заливка комнат Удаленка
        if(distPercent > 0)
        {
            x = W - distW;
            n = distPercent/100;
            y = headerH - headerH * n;

            ctx.fillStyle = 'green';
            ctx.globalAlpha = 0.2;
            ctx.fillRect(x, y, distW, headerH * n );  
        }

        //-- заливка комнат Тестирование
        if(testPercent > 0)
        {
            x = 0;
            n = testPercent/100;
            y = H - testH * n;

            ctx.fillStyle = 'yellow';
            ctx.globalAlpha = 0.2;
            ctx.fillRect(x, y, leftW, testH * n );  
        }


        //-- контуры и тексты
        {
            //-- горизонтальное отсечение

            y = headerH;

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'black';
            ctx.moveTo(0, y);              
            ctx.lineTo(W , y);   
            ctx.stroke();

            //-- левая область (вертикальная линия)

            x = leftW;
            y = headerH;

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'black';
            ctx.moveTo(leftW, headerH);              
            ctx.lineTo(leftW , H);   
            ctx.stroke();

            //-- больница
            {
                x = leftW;
                y = headerH;
    
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.globalAlpha = 1;
                ctx.strokeStyle = 'black';
                ctx.moveTo(bolW, 0);              
                ctx.lineTo(bolW , headerH);   
                ctx.stroke();

                x = 5;
                y = 15;

                ctx.beginPath();
                ctx.font = "bold 12px Arial";
                ctx.fillStyle = 'black';
                ctx.fillText('Больница', x, y);
                ctx.fill(); 
            }

            //-- Продукт
            {
                x = bolW + 15;
                y = 15;

                ctx.beginPath();
                ctx.font = "bold 12px Arial";
                ctx.fillStyle = 'black';
                ctx.fillText('Производство', x, y);
                ctx.fill(); 
            }


            //-- правая верхняя для удаленки
            {
                x = leftW;
                y = headerH;
    
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.globalAlpha = 1;
                ctx.strokeStyle = 'black';
                ctx.moveTo(W - distW, 0);              
                ctx.lineTo(W - distW , headerH);   
                ctx.stroke();

                x = W - distW + 5;
                y = 15;

                ctx.beginPath();
                ctx.font = "bold 12px Arial";
                ctx.fillStyle = 'black';
                ctx.fillText('Удаленка', x, y);
                ctx.fill(); 
            }



            //-- верхняя граница тестирования
            {
                y = H - testH;

                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.globalAlpha = 1;
                ctx.strokeStyle = 'black';
                ctx.moveTo(0, y);              
                ctx.lineTo(leftW , y);   
                ctx.stroke();

                x = 5;
                y =  H - testH + 15;

                ctx.beginPath();
                ctx.font = "bold 12px Arial";
                ctx.fillStyle = 'black';
                ctx.fillText('Тестирование', x, y);
                ctx.fill();                
            }
          


            
        }


        Global._manArr.forEach((element) => {element._stuk = false;})

  
        for(let i=0; i < Global._manArr.length; i++)
        {
            man = Global._manArr[i];
            man._vxSetted = false;
            dayColor = DrawHelper.getColorForDay(man, day._dayIndex);


            //-- кого куда
            {
                vvOK = false;

                //-- общая область
                leftX = leftW;
                rightX = W;
                topY = headerH;              
                botY = H;
                //log('day._number=' + day._number + ' ' + dayColor)

                if(dayColor != 'blue')
                {
                    if(man._testByDayDic.hasOwnProperty(day._number)
                    || (man._testDayStart > 0 && man._testDayStart <= day._number )
                    )
                    {
                        //-- тестировщики
                        //-- угол для тестируемых

                        if(man._testDayStart <= day._number - 1)
                        //if(man._testByDayDic.hasOwnProperty(day._number-1))
                        {
                            leftX = 0
                            rightX = leftW;
                            topY = H - testH;              
                            botY = H;
                        }
                        else
                        {
                            if(man.x > rightX/3)
                            {
                                man.vx = -10;
                                man.vy = 2;
                            }
                            else
                            {
                                man.vx = -10;
                                man.vy = 10;
                            }
                        }

                        vvOK = true;
                        //log('111 vy=' + man.vy)
                    }
                }

                if(!vvOK)
                {
                   // log('2222')

                    if(dayColor == 'red')
                    {
                        if(man._bolnicaDayDic.hasOwnProperty(day._number))
                        {
                            //-- угол для красных
                            leftX = 0
                            rightX = bolW;
                            topY = 0;              
                            botY = headerH;     
                            
                            
                        }
                        else                       
                        //if(man._bolnicaDayDic.hasOwnProperty(day._number))
                        {
                            if((man._bolnicaDayDic.hasOwnProperty(day._number+1)))
                            {
                                //-- если ему в больницу завтра
                                if(man.x > rightX - rightX/3)
                                {
                                    man.vx = -10;
                                    man.vy = -1;
                                }
                                else if(man.x > rightX/3)
                                {
                                    man.vx = -10;
                                    man.vy = -2;
                                }
                                else if(man.x < rightX/6)
                                {
                                    man.vx = 0;
                                    man.vy = -5;
                                }
                                else
                                {
                                    man.vx = -10;
                                    man.vy = -10;
                                }
        
        
                                man._vxSetted = true;
                                
                            }
                           
                        } 
                    }
                }

                if(!vvOK)
                {

                    if(dayColor == 'green' || dayColor == 'yellow' || dayColor == 'blue')
                    {
                        {
                            if(man._distByDayDic.hasOwnProperty(day._number))
                            {
                                //-- угол для удаленщиков
                                leftX = W - distW
                                rightX = W;
                                topY = 0;              
                                botY = headerH;
    
                                if(man.x < W/2)
                                {
                                    man.vx = 10;
                                    man.vy = 3;
                                }
                                else{
                                    //man.vx = 10;
                                    //man.vy = 10;
                                }  
                            }
                        }
    
                    }
                }

            }

            //-- отскок от края
            if(!man._stuk &&  !man._vxSetted)
            {             

                if ((man.y + radius) > botY || (man.y-radius2) < topY)
                {
                    man.vy = -man.vy;

                    if((man.y + radius) > botY)
                    {
                        man.y = botY - radius;
                    }
                    else  if((man.y - radius2) < topY)
                    {
                        man.y =  radius2 + topY;
                    }

                    man._vxSetted = true;
                }

                if ((man.x+radius) > rightX || (man.x-radius) < leftX)
                {
                    man.vx = -man.vx;

                    if((man.x + radius) > rightX)
                    {
                        man.x = rightX - radius -1;
                    }
                    else  if((man.x - radius) < leftX)
                    {
                        man.x =  leftX + radius + 1;
                    }

                    man._vxSetted = true;
                }
            }

            //-- определим столкновения            
            if(!man._stuk && !man._vxSetted)
            {
                for (let j=i+1; j < Global._manArr.length; j++)
                {
                    man2 = Global._manArr[j];
                    if(man2._stuk) continue;
                    if(man2._lastStukId == man._lastStukId)
                    {
                        //-- был стук с тем же самым в прошлой итерации. Это чтоб не прилипали
                        continue;
                    }


                    if(
                        (man.x >= man2.x && man.x <= (man2.x + radius2)
                        && man.y >= man2.y && man.y <= (man2.y + radius2)
                        )
                        ||
                        (man2.x >= man.x && man2.x <= (man.x + radius2)
                        && man2.y >= man.y && man2.y <= (man.y + radius2))
                    )
                    {
                        Processor.createVector(man);
                        Processor.createVector(man2);

                        man._stuk = true;
                        man2._stuk = true;

                        man._lastStukId = i + '_' + j;
                        man2._lastStukId = i + '_' + j;

                    }
                }
            }	
            



            man.x = man.x + man.vx;
            man.y = man.y + man.vy;

            aa = 1;
            drawManKontur = false;


          
            if(dayColor == 'green')
            {
                aa = maskKoef / 10 + 0.5;

                if(maskKoef > 0)
                {
                    drawManKontur = true;
                }
            }
          
            if(dayColor == 'yellow')
            {
                aa = (10 - maskKoef) / 10;

                dayColor = '#dbb63d';
            }
            

    
            ctx.beginPath();
            ctx.globalAlpha = aa;
            ctx.fillStyle = dayColor;
            ctx.arc((man.x), (man.y), radius, 0, 2*Math.PI, false);      
            ctx.fill();   

            if(man._testByDayDic.hasOwnProperty(day._number)
            || drawManKontur)
            {
                ctx.strokeStyle = "#000000";
                ctx.stroke();
            }


            ctx.closePath();
                 
        }

        //-- куча
        {
            let img = Epidemic.kioapi.getResource('kucha');
            n = Math.trunc(day._eeTotal / 100);

            let startY = 30;
            let startX = bolW + 50;
            let kuchaW = 10;
            let ny = -kuchaW;
            let nx = 0;
            let ySdvig = 0;
            let xSdvig = 0;
            let rowCount = 0;

            for(i = 0; i < n; i++)
            {
                if(i%20 == 0)
                {
                    
                    nx = 0;
                    rowCount++;

                    if(rowCount == 5)
                    {
                        rowCount = 0;
                        ny = -kuchaW;
    
                        if(ySdvig == 0)
                        {
                            ySdvig = kuchaW/2;
                            xSdvig = kuchaW/2;
                        }
                    }

                    ny = ny + kuchaW;
                }
                else{
                    nx++;
                }

                x =  kuchaW * nx + xSdvig + startX;
                y = ny + ySdvig + startY;

                ctx.globalAlpha = 1;
                ctx.drawImage(img, x, y, kuchaW, kuchaW);


            }

            
        }
    }

    static drawDayInfo(day)
    {
        let ctx = Global._ctx2;
        let W = Global._canvas2W;
        let H = Global._canvas2H;
        let x, y;

        
        ctx.clearRect(0, 0, W , H);
        ctx.fillStyle="white";
        ctx.fillRect(0,0,W,H);

        
        ctx.beginPath();
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = 'black';
        ctx.fillText('День:  ' + day._number, 10, 20);
        ctx.fill();
        

        x = 10;
        y = 40;

        let s = (day._ee < 0 ? "" : "+");

        ctx.beginPath();
        ctx.font = "bold 15px Arial";
        ctx.fillStyle = 'brown';
        ctx.fillText(day._eeTotal.toFixed(0) + ' (' + s +  day._ee.toFixed(0) + ')', x, y);
        ctx.fill();        

        x = 10;

        y = 70;
        let y1 = 30;
        let zS = ''

        if(day._zarazPlus > 0)
        {
            zS = '(+' + day._zarazPlus + ')'
        }

        
        

        DrawHelper.drawDayInfoMan(ctx, 'm_green', x, y + y1*0, day._greenCount);
        DrawHelper.drawDayInfoMan(ctx, 'm_yellow', x, y + y1*1, day._yellowCount + zS);
        DrawHelper.drawDayInfoMan(ctx, 'm_red', x, y + y1*2, day._redCount);
        DrawHelper.drawDayInfoMan(ctx, 'm_blue', x, y + y1*3, day._blueCount);

    }

    static drawDayInfoMan(ctx, imgId, x, y, colorCount)
    {
        let n = 20;
        let m = n - 5;
        let img = Epidemic.kioapi.getResource(imgId);
        ctx.globalAlpha = 1;
        ctx.drawImage(img, x, y, n, n);

        x = x + n + 5;

        y = y + m ;

        ctx.beginPath();
        ctx.font = "14px Arial";
        ctx.fillStyle = 'black';
        ctx.fillText('- ' + colorCount, x, y);
        ctx.fill();
    }

    static getColorForDay(man, dayIndex)
    {
        return man._dayColorArr[dayIndex];
    }
}

function log(s){
	console.log(s);
}