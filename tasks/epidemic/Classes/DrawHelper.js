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

        if(Config._level == 1)
        {
            DrawHelper.drawVariant1(ctx, day);  //-- все стоят
        }
        else{
            DrawHelper.drawVariant2(ctx, day);  //-- все бегают
        }
        
        DrawHelper.drawDayInfo(day);
    }

    static drawVariant2(ctx, day)
    {
        let radius = 3; //-- ширина/2 человечка
        let radius2 = radius * 2;
        let man, man2;
        let W = Global._canvas1W;
        let H = Global._canvas1H;
        let x, y;

        Global._manArr.forEach((element) => {element._stuk = false;})

        for(let i=0; i < Global._manArr.length; i++)
        {
            man = Global._manArr[i];

            //-- определим столкновения
            if(!man._stuk)
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
            if(!man._stuk)
            {
                if ((man.y+radius) > H || (man.y-radius) < 0)
                {
                    man.vy = -man.vy;

                    if((man.y + radius) > H)
                    {
                        man.y = H - radius;
                    }
                    else  if((man.y - radius) < 0)
                    {
                        man.y =  radius;
                    }
                }

                if ((man.x+radius) > W || (man.x-radius) < 0)
                {
                    man.vx = -man.vx;

                    if((man.x + radius) > W)
                    {
                        man.x = W - radius;
                    }
                    else  if((man.x - radius) < 0)
                    {
                        man.x =  radius;
                    }
                }
            }

            man.x += man.vx;
            man.y += man.vy;
    
            ctx.beginPath();
            ctx.arc(man.x, man.y, radius, 0, 2*Math.PI, false);
            ctx.fillStyle = DrawHelper.getColorForDay(man, day._dayIndex);
            ctx.fill();
        }

        //-- куча
        let img = Epidemic.kioapi.getResource('kucha');
        let n = day._eeTotal / 100;
        ctx.drawImage(img, 0, 0, n, n);

        x = n + 10;
        y = 20;

        let s = (day._ee < 0 ? "" : "+");

        ctx.beginPath();
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = 'brown';
        ctx.fillText(day._eeTotal.toFixed(0) + ' (' + s +  day._ee.toFixed(0) + ')', x, y);
        ctx.fill();
    }

    static drawVariant1(ctx, day)
    {
        let man;
        let lastx = 50;
		let y = 100;
        let x;
		let manCountInLine = 25;
		let inLineCount = 0;
        let img;
        let color;

        let imgRed = Epidemic.kioapi.getResource('m_red');
        let imgGreen = Epidemic.kioapi.getResource('m_green');
        let imgYellow = Epidemic.kioapi.getResource('m_yellow');
        let imgBlue = Epidemic.kioapi.getResource('m_blue');

        for(let i=0; i < Global._manArr.length; i++)
        {
            man = Global._manArr[i];

			inLineCount++;
			//x = lastx + (radius*2) + radius;
            x = lastx + 2 + 10;

            color = DrawHelper.getColorForDay(man, day._dayIndex);

            if(color == 'green')
            {
                img = imgGreen;
            }
            else if(color == 'yellow')
            {
                img = imgYellow;
            }
            else if(color == 'red')
            {
                img = imgRed;
            }
            else if(color == 'blue')
            {
                img = imgBlue;
            }                        

            ctx.drawImage(img, x, y, 20, 20);

            /*
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2*Math.PI, false);
			ctx.fillStyle = DrawHelper.getColorForDay(man, day._dayIndex);
			ctx.fill();
            */

			lastx = x;
			

			if( inLineCount == manCountInLine)
			{
				y = y + 22;
				lastx = 50;
				inLineCount = 0;
			}            
        }

        //-- куча
        img = Epidemic.kioapi.getResource('kucha');
        let n = day._eeTotal / 100;
        ctx.drawImage(img, 0, 0, n, n);


        //-- куча 2
        let n1 = day._ee / 5;
        ctx.drawImage(img, n, n, n1, n1);

        x = n + 80;
        y = 20;

        let s = (day._ee < 0 ? "" : "+");

        ctx.beginPath();
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = 'brown';
        ctx.fillText(day._eeTotal.toFixed(0) + ' (' + s +  day._ee.toFixed(0) + ')', x, y);
        ctx.fill();
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
        

        DrawHelper.drawDayInfoMan(ctx, 'm_green', x, y + y1*0, day._greenCount);
        DrawHelper.drawDayInfoMan(ctx, 'm_yellow', x, y + y1*1, day._yellowCount);
        DrawHelper.drawDayInfoMan(ctx, 'm_red', x, y + y1*2, day._redCount);
        DrawHelper.drawDayInfoMan(ctx, 'm_blue', x, y + y1*3, day._blueCount);

    }

    static drawDayInfoMan(ctx, imgId, x, y, colorCount)
    {
        let n = 20;
        let m = n - 5;
        let img = Epidemic.kioapi.getResource(imgId);
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