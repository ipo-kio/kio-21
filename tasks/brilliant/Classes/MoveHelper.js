import { Global } from './Global.js'
import {DrawMoving} from './DrawMoving.js'
import {DrawHelper} from './DrawHelper.js'

export class MoveHelper
{
	static canMove2(src, movedBlock, moveToX, moveToY)
	{
		let canMove = false;
		let i, block;

		//-- определим, свободен ли целевой квадратик

		log('canMove2('+src+') movedBlock._X1 = '+movedBlock._X1+'   moveToX=' + moveToX + ' moveToY=' + moveToY);
		log('canMove2() DrawMoving._mouseDownX1 = '+DrawMoving._mouseDownX1+'   DrawMoving._mouseDownY1=' + DrawMoving._mouseDownY1 );

		let ok = true;


		if(isNaN(moveToX) || isNaN(moveToY))
		{
			ok = false;
			return false;
		}


		//-- был ло ли вобще перемещение
		if(DrawMoving._mouseDownX1 == moveToX && DrawMoving._mouseDownY1 == moveToY )
		{
			let n = Math.abs(DrawMoving._mouseDownX - DrawHelper._stageX) +  Math.abs(DrawMoving._mouseDownY - DrawHelper._stageY);

			if(n < 10)
			{
				ok = false;
				return false;
			}
			else{
				log('DDDDDDDDD n=' + n + ' DrawMoving._mouseDownX=' + DrawMoving._mouseDownX  + ' DrawHelper._stageX=' + DrawHelper._stageX)
			}

		}
		else{
			log('PPPPPPPPPP ')
		}


		/*
		if(movedBlock._VH == 'H')
		{
			if(movedBlock._X1 == moveToX && movedBlock._Y1 == moveToY)
			{
				ok = false;
				return false;
			}
		}
		else
		{
			if(movedBlock._X1 == moveToX && movedBlock._Y1 == moveToY)
			{
				ok = false;
				return false;
			}
		}
		*/

		//-- можно передвинуть только на соседнюю (на 1 ход)

		if(( Math.abs(movedBlock._X1 - moveToX) > 1
		|| Math.abs(movedBlock._Y1 - moveToY) > 1 )
		|| (Math.abs(movedBlock._X1 - moveToX) == 1 && Math.abs(movedBlock._Y1 - moveToY) == 1))
		{
			ok = false;
			return false;
		}



		for(i = 0; i < Global._blockArr.length; i++)
		{
			block = Global._blockArr[i];

			if(block._id == movedBlock._id) continue;

			if(block._X1 == moveToX &&  block._Y1 == moveToY
				|| block._X2 == moveToX &&  block._Y1 == moveToY
				|| block._X1 == moveToX &&  block._Y2 == moveToY
				|| block._X2 == moveToX &&  block._Y2 == moveToY
			)
			{
				ok = false;
				break;
			}
			else
			{
				//-- свободна ли вторая клетка (справа или снизу, т. первая всегда левая верхняя)

				if(movedBlock._VH == 'H')
				{
					if(block._X1 == moveToX + 1 &&  block._Y1 == moveToY
						|| block._X2 == moveToX + 1 &&  block._Y1 == moveToY
						|| block._X1 == moveToX + 1 &&  block._Y2 == moveToY
						|| block._X2 == moveToX + 1 &&  block._Y2 == moveToY
					)
					{
						ok = false;
						break;
					}
				}
				else
				{
					if(block._X1 == moveToX &&  block._Y1 == moveToY + 1
						|| block._X2 == moveToX &&  block._Y1 == moveToY + 1
						|| block._X1 == moveToX &&  block._Y2 == moveToY + 1
						|| block._X2 == moveToX &&  block._Y2 == moveToY + 1
					)
					{
						ok = false;
						break;
					}
				}
			}



			/*
			if(block._VH == 'H' && block._Y1 == moveToY)
			{
				if(block._X1 == moveToX || block._X2 == moveToX)
				{
					ok = false;
					break;
				}
			}
			else if(block._VH == 'V' && block._X1 == moveToX)
			{
				if(block._Y1 == moveToY || block._Y2 == moveToY)
				{
					ok = false;
					break;
				}
			}
			*/
		}

		canMove = ok;


		return canMove;
	}
	/*
	static canMove(block, moveToX, moveToY)
	{
		let canMove = false;

		let X1 = block._kvadr1._posX;
		let X2 = block._kvadr2._posX;
		let Y1 = block._kvadr1._posY;
		let Y2 = block._kvadr2._posY;

		if(block._VH == 'H')
		{

			if(moveToY != Y1)
			{
				//-- значит сдиг в бок по вертикали
				//log('FFFFFFFFFFFFFFF 1')

				if(Global._XY2MoveDic.hasOwnProperty(X1 + '_' + moveToY)
					&& Global._XY2MoveDic.hasOwnProperty(X2 + '_' + moveToY))
				{
					canMove = true;
				}
			}
			else{
				canMove = true;
			}
		}
		else
		{
			if(moveToX != X1)
			{
				//-- значит сдиг в бок по горизонтали
				//log('FFFFFFFFFFFFFFF 2 Global._moveToY=' + moveToY + " Y1=" + Y1)

				if(Global._XY2MoveDic.hasOwnProperty(moveToX + '_' + Y1)
					&& Global._XY2MoveDic.hasOwnProperty(moveToX + '_' + Y2))
				{
					canMove = true;
				}
			}
			else{
				canMove = true;
			}
		}

		return canMove;
	}
	*/
}

function log(s)
{
	console.log(s);
}