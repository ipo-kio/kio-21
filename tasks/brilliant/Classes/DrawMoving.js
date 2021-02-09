import { Global } from "./Global.js";
import { MoveHelper } from "./MoveHelper.js";
import { Brilliant } from '../brilliant.js'
import { Block } from "./Block.js";

export class DrawMoving
{
	static _mouseDownX; //-- координата в точках
	static _mouseDownY;
	static _mouseDownX1; //- номер клеточки
	static _mouseDownY1;

	static draw(mouseX, mouseY)
	{

		if(Global._movedBlock != null)
		{
			//-- TODO  ?? Заменить курсор на квадратик

			let x1, y1;
			let ctx = Global._ctxST;

			let block = Global._movedBlock;

			ctx.clearRect(0, 0, Global._canvasSuperTop.width, Global._canvasSuperTop.height);

			x1 = block._X1 * Global._storona;
			y1 = block._Y1 * Global._storona;

			//if(DrawMoving._mouseDownX > x1 + Global._storona) DrawMoving._mouseDownX  = DrawMoving._mouseDownX - Global._storona;

			//-- смещение от точки нажатия до верхнего левого угла квадратика
			let x2 =  DrawMoving._mouseDownX -Global._storona/2 - x1;
			let y2 = DrawMoving._mouseDownY -Global._storona/2 - y1;

			//if(x2 > Global._storona) x2 = x2 - Global._storona;
			//if(y2 > Global._storona) y2 = y2 - Global._storona;

			//log('draw() x1=' + x2);

			x1 = mouseX - Global._storona/2;
			y1 = mouseY - Global._storona/2;

			let stX, stY
			let X1, Y1; //-- координаты левого верхнего квадрата, т.к. тянуть мы можем за любой

			if(block._VH == 'V')
			{
				stX = Global._storona;
				stY = Global._storona * 2;
			}
			else
			{
				stX = Global._storona * 2;
				stY = Global._storona;
			}

			ctx.beginPath();
			ctx.lineWidth="2";
			ctx.strokeStyle="red";
			//ctx.strokeRect(x1, y1, Global._storona, Global._storona);
			ctx.strokeRect(x1, y1, stX, stY);
			ctx.stroke();



			let dropToX = Math.floor ((mouseX - 0)/ Global._storona);
			let dropToY = Math.floor ((mouseY - 0)/ Global._storona);



			x1 = dropToX * Global._storona;
			y1 = dropToY * Global._storona;

			//if(Global._XY2MoveDic.hasOwnProperty(X + '_' + Y))
			{
				let canMove = MoveHelper.canMove2('111', block, dropToX, dropToY);

				if(canMove)
				{
					ctx.beginPath();
					ctx.lineWidth="2";
					ctx.strokeStyle="blue";
					//ctx.strokeRect(x1, y1, Global._storona, Global._storona);
					ctx.strokeRect(x1, y1, stX, stY);
					ctx.stroke();


					//log('STEP COUNT= ' + (Math.abs(block._X1 - dropToX)  + Math.abs(block._Y1 - dropToY)));
				}
				//log('XXXX=' + X + '  mouseX=' + mouseX)
			}
		}


	}

	static clear()
	{
		let ctx = Global._ctxST;
		ctx.clearRect(0, 0, Global._canvasSuperTop.width, Global._canvasSuperTop.height);

		DrawMoving._mouseDownX = -1;
		DrawMoving._mouseDownY = -1;
	}

	static setMouseDown(mouseX, mouseY)
	{
		DrawMoving._mouseDownX = mouseX;
		DrawMoving._mouseDownY = mouseY;


		DrawMoving._mouseDownX1 = Math.floor ((mouseX - 0)/ Global._storona);
		DrawMoving._mouseDownY1 = Math.floor ((mouseY - 0)/ Global._storona);
	}
}

function log(s)
{
	console.log(s);
}