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

		//log('canMove2('+src+') movedBlock._X1 = '+movedBlock._X1+'   moveToX=' + moveToX + ' moveToY=' + moveToY);
		//log('canMove2() DrawMoving._mouseDownX1 = '+DrawMoving._mouseDownX1+'   DrawMoving._mouseDownY1=' + DrawMoving._mouseDownY1 );

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
				//log('DDDDDDDDD n=' + n + ' DrawMoving._mouseDownX=' + DrawMoving._mouseDownX  + ' DrawHelper._stageX=' + DrawHelper._stageX)
			}

		}
		else{
			//log('PPPPPPPPPP ')
		}



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

		}

		canMove = ok;


		return canMove;
	}

}

function log(s)
{
	//console.log(s);
}