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

   
        DrawHelper.drawVariant3(ctx, day);  //-- все бегают по новой

        
       // DrawHelper.drawDayInfo(day);
    }

    static drawVariant3(ctx, day)
    {
        let radius = 6; //-- ширина/2 человечка
        let radius2 = radius * 2;
        let radius05 = radius / 2;
        let man, man2;
        let W = Global._canvas1W;
        let H = Global._canvas1H;
        let x, y, dayColor, n, s;
        let leftX, rightX;
        let topY, botY;
        let vvOK;
        let maskKoef = 0;
        let aa;
        let drawManKontur = false;
        let distPercent = 0;
        let testPercent = 0;
        let otskokOff;
        let changeVX;

        let headerH = 100;
        let leftW = 0;
        let distW = 200;
        let testH = 150;
        let bolW = 200;


    

        if(day._strategy != null)
        {
            maskKoef = day._strategy._maskKoef;
            distPercent = day._strategy._distPercent;
            testPercent = day._strategy._testPercent;
        }

        //-- заливка комнат Больница
        if(day._bolnicaCount > 0)
        {
            n = day._bolnicaCount / Config._bolnicaMax;
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

            ctx.fillStyle = '#f9c481';
            // ctx.globalAlpha = 0.2;
            ctx.globalAlpha = 1;
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
            /*
            x = 0;
            n = testPercent/100;
            y = H - testH * n;

            ctx.fillStyle = 'yellow';
            ctx.globalAlpha = 0.2;
            ctx.fillRect(x, y, leftW, testH * n );  
            */
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

            /*
            x = leftW;
            y = headerH;

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;
            ctx.strokeStyle = 'black';
            ctx.moveTo(leftW, y);              
            ctx.lineTo(leftW , H );   
            ctx.stroke();
            */

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

                if(Config._level == 2)
                {
                    s = 'Больница';

                    n = Config._bolnicaMax - day._bolnicaCount; 

                    if(n <= 0)
                    {
                        s = s + ' (мест нет)'
                    }
                    else{
                        s = s + ' (' + n + ')'
                    }
                }
                else{
                    s = 'Больница';
                }

                ctx.beginPath();
                ctx.font = "bold 12px Arial";
                ctx.fillStyle = 'black';
                ctx.fillText(s, x, y);
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
                ctx.fillText('Карантин', x, y);
                ctx.fill(); 
            }



            //-- верхняя граница тестирования
            {
                /*
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
                */              
            }
          


            
        }





        //-- если прыгаем по дням
        if(!Global._isPlay)
        {
            for(let i=0; i < Global._manArr.length; i++)
            {
                man = Global._manArr[i];

                if(man._distByDayDic.hasOwnProperty(day._number))
                {
                    leftX = W - distW + radius
                    rightX = W;
                    topY = 0;              
                    botY = headerH - radius;

                    man.x = leftX + 1 * (0 + Math.random() * 200);
                    man.y = botY - 1 * (0 + Math.random() * 100);
                }
                else if(man._bolnicaDayDic.hasOwnProperty(day._number))
                {
                    leftX = 0
                    rightX = bolW - radius2;
                    topY = 0;              
                    botY = headerH - radius2; 
                    man.x = leftX +  (1 * (0 + Math.random() * 200));
                    man.y = topY + 1 * (0 + Math.random() * 100);
                }
                else{
                    //-- рабочая область                   
                    leftX = leftW;
                    rightX = W;
                    topY = headerH;              
                    botY = H;
                    man.x = leftX + 1 * (0 + Math.random() * 800);
                    man.y = topY + 1 * (0 + Math.random() * 200);
                }
            }
        }

        if(!day._isComplit)
        {
            y = headerH - headerH * n;
            x = 0;
                 
            ctx.fillStyle = 'red';
            ctx.globalAlpha = 0.7;
            ctx.fillRect(0, headerH, W, H); 

            ctx.beginPath();
            ctx.font = "bold 30px Arial";
            ctx.fillStyle = 'black';
            ctx.fillText('Переполнение больницы', 200, 250);
            ctx.fill(); 

            return;
        }

        Global._manArr.forEach((element) => {element._stuk = false;})

        
        for(let i=0; i < Global._manArr.length; i++)
        {
            man = Global._manArr[i];
            if(man._firstGreenDay > day._number) continue;  //-- этот еще не появился
            man._vxSetted = false;
            dayColor = DrawHelper.getColorForDay(man, day._dayIndex);
            otskokOff = false;

            
            //-- рабочая область
            
            leftX = leftW;
            rightX = W;
            topY = headerH;              
            botY = H;
            
            man._vxSetted = false;
            vvOK = false;
            changeVX = true;

            if(!vvOK) //-- угол больница
            {
                if(man._bolnicaDayDic.hasOwnProperty(day._number))
                {
                    //-- угол больница
                    leftX = 0
                    rightX = bolW - radius2;
                    topY = 0;              
                    botY = headerH - radius2; 


                    if(!man._bolnicaDayDic.hasOwnProperty(day._number + 1))
                    {
                        //-- если ему завтра на работу из больницы
                        man.vx = 3;
                        man.vy = 3; 
                        man._stukOff = false;
                        changeVX = true;
                    }
                    else
                    {
                        if(!man._bolnicaDayDic.hasOwnProperty(day._number - 1))
                        {
                            //-- первый день в больнице
                            man.vx = -1 * (0 + Math.random() * 10);
                            man.vy = -1 * (0 + Math.random() * 10);
                            man._stukOff = true;      
                            changeVX = true;   
                            otskokOff = false;          
                        }
                        else
                        {
                            changeVX = false;
                        }
                        
                                               
                    }
                    vvOK = true; 
                } 
            }  
            
            if(!vvOK) //-- карантин
            {
                if(man._distByDayDic.hasOwnProperty(day._number))
                {
                    //-- угол для удаленщиков
                    leftX = W - distW + radius
                    rightX = W;
                    topY = 0;              
                    botY = headerH - radius;

                    if(!man._distByDayDic.hasOwnProperty(day._number - 1))
                    {
                        //-- первый день дома
                        //man.vx =  man.vx + ( Math.random());
                        //man.vy = man.vy - (1 + Math.random());
                        man._stukOff = true;      
                        otskokOff = false;
                        changeVX = true;                 
                    }
                    else
                    {
                        if(!man._distByDayDic.hasOwnProperty(day._number + 1))
                        {
                            //-- завтра на работу из дома

                            man.vx = - Math.random() * 5;
                            man.vy = 1 + Math.random() * 12;
                            man._stukOff = true;
                            otskokOff = true;
                            changeVX = true;
                        }
                        else{
                            changeVX = false;
                        }                      
                    }
                    vvOK = true;
                }

            }

            if(!vvOK) //-- в рабочей зоне
            {
                if(man._distByDayDic.hasOwnProperty(day._number + 1))
                {
                    //-- если завтра на удаленку
                    if(man.x < W-W/4)
                    {
                        man.vx = 10* (Math.random());
                        man.vy = -2* (Math.random());
                    }
                    else{
                        man.vx = 9 * (Math.random());
                        man.vy = -10 * Math.random();
                    }
                    otskokOff = true
                    man._stukOff = false;
                    changeVX = true;
                    vvOK = true;
                }
                else if(man._bolnicaDayDic.hasOwnProperty(day._number + 1))                  
                {
                    //-- если в больницу завтра
                    if(man._distByDayDic.hasOwnProperty(day._number - 1))
                    {
                        //-- если он из карантина

                        n = Global._tikCounter - (Math.trunc((Global._tikCounter) / 10) * 10)
                        if(n < 7)
                        {
                            man.vx = -25 *(Math.random()+2);
                            man.vy = 20  *(Math.random()+1);
                        }
                        else{
                            man.vx = -15 *(Math.random()+1);
                            man.vy = -25  *(Math.random()+1);
                        }



                        man._stukOff = true;                
                        otskokOff = true;
                        vvOK = true;
                        changeVX = true;
                    }
                    else
                    {
                        if(man.x > rightX - rightX/3)
                        {
                            man.vx = -20;
                            man.vy = -1 ;
                        }
                        else if(man.x > rightX/2)
                        {
                            man.vx = -15;
                            man.vy = -2 ;
                        }
                        else if(man.x > rightX/3)
                        {
                            man.vx = -5;
                            man.vy = -10 ;
                        }
                        else
                        {
                            man.vx = -5;
                            man.vy = -7;
                        }

                        man._stukOff = true;                
                        otskokOff = false;
                        vvOK = true;
                        changeVX = true;
                    }
                    
    

                }
                else{
                    man._stukOff = false; 
                    otskokOff = false
                    changeVX = true;
                    vvOK = true;
                }
            }

            //-- определим столкновения            
            if(!man._stuk  && !man._stukOff)
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

            //-- отскок от края
            if(!man._stuk &&  !otskokOff) //&&  !man._vxSetted
            {             

                if((man.y + radius) > botY)
                {
                    man.y = botY - radius - 1;
                    man.vy = -man.vy;
                    man._vxSetted = true;
                }
                else  if((man.y - (radius + radius05)) < topY)
                {
                    man.y =  radius + topY + 1;
                    man.vy = -man.vy;
                    man._vxSetted = true;
                }

                if((man.x + radius) > rightX)
                {
                    man.vx = -man.vx;
                    man.x = rightX - radius -1;
                    man._vxSetted = true;
                }
                else  if((man.x - (radius + radius05)) < leftX)
                {
                    man.vx = -man.vx;
                    man.x =  leftX + radius + 1;
                    man._vxSetted = true;
                }
            }            

            if(changeVX)
            {
                man.x = man.x + man.vx;
                man.y = man.y + man.vy;              
            }

            aa = 1;
           
            if(dayColor == 'green')
            {
                aa = maskKoef / 10 + 0.5;
            }        
            else if(dayColor == 'yellow')
            {
                aa = (10 - maskKoef) / 10;

                dayColor = '#dbb63d';
            }
            
 
            ctx.beginPath();
            ctx.globalAlpha = aa;
            ctx.fillStyle = dayColor;
            ctx.arc((man.x), (man.y), radius, 0, 2*Math.PI, false);      
            ctx.fill();   

            if(man._testByDayDic.hasOwnProperty(day._number))
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
        let ctx = Global._ctx;
        let W = Global._canvasW;
        let H = Global._canvasH;
        let x, y;
        let topY = 120;

        /*
        ctx.clearRect(0, 0, W , H);
        ctx.fillStyle="white";
        ctx.fillRect(0,0,W,H);
        */

        x = 10;
        y = topY;

        
        ctx.beginPath();
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = 'black';
        ctx.fillText('День:  ' + day._number, x, y);
        ctx.fill();
        

        x = 10;
        y = y + 20;

        let s = (day._ee < 0 ? "" : "+");

        ctx.beginPath();
        ctx.font = "bold 15px Arial";
        ctx.fillStyle = 'brown';
        ctx.fillText(day._eeTotal.toFixed(0) + ' (' + s +  day._ee.toFixed(0) + ')', x, y);
        ctx.fill();        

        x = 10;

        y = y + 10 ;
        let y1 = 20;
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
        //let i = dayIndex + Config._dayCount - man._dayColorArr.length;
        //return man._dayColorArr[i];

        return man._dayColorArr[dayIndex];
    }
}

function log(s){
	console.log(s);
}
