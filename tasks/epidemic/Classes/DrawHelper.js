import { Global } from "./Global";
import { Epidemic } from "../epidemic";
import { Processor } from "./Processor";

export class DrawHelper
{
    static drawTik(dayNumber)
    {
        let radius = 3; //-- ширина/2 человечка
        let ctx = Global._ctx;
        let W = Global._canvas1W;
        let H = Global._canvas1H;

        Global._manArr.forEach((element) => {element._stuk = false;})

        ctx.clearRect(0, 0, W , H);
        ctx.fillStyle="white";
        ctx.fillRect(0,0,W,H);

        let day = Global._dayArr[dayNumber-1];

        DrawHelper.drawVariant1(ctx, day, radius);  //-- все стоят

        //DrawHelper.drawVariant2(ctx, day, radius);  //-- все бегают


    }

    static drawVariant2(ctx, day, radius)
    {
        let man, man2;
        let W = Global._canvas1W;
        let H = Global._canvas1H;

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
                        (man.x >= man2.x && man.x <= (man2.x + radius)
                        && man.y >= man2.y && man.y <= (man2.y + radius)
                        )
                        ||
                        (man2.x >= man.x && man2.x <= (man.x + radius)
                        && man2.y >= man.y && man2.y <= (man.y + radius))
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
    }

    static drawVariant1(ctx, day, radius)
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
    }

    static getColorForDay(man, dayIndex)
    {
        return man._dayColorArr[dayIndex];
    }
}

function log(s){
	console.log(s);
}