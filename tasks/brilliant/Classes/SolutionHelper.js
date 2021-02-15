import { Brilliant } from '../brilliant.js'
import { StepResult } from './StepResult.js';
import { Global } from './Global.js'
import { Solution } from './Solution.js'
import { StepHelper } from './StepHelper.js'
import { Config } from '../../epidemic/Classes/Config.js';

export class SolutionHelper
{
	static getModifedString()
	{
		let i, block, n;
		let result = '';
		let kvadr1, kvadr2
		let block1Str = '';
		let block2Str = '';

		let stepType = 0;
		let block1 = null;
		let block2 = null;


		if(Global._movedBlockId > 0)
		{
			//-- передвижение на пустое место

			let block = Global.getBlockById(Global._movedBlockId);


			//log('getModifedString() Global._movedBlockId =' + Global._movedBlockId );
			/*
			log('bX1=' + block._X1);
			log('bX2=' + block._X2);
			log('bY1=' + block._Y1);
			log('bY2=' + block._Y2);
			log('Global._moveToX=' + Global._moveToX);
			log('Global._moveToY=' + Global._moveToY);
			*/

			let X1 = block._kvadr1._posX;
			let X2 = block._kvadr2._posX;
			let Y1 = block._kvadr1._posY;
			let Y2 = block._kvadr2._posY;


			//-- определим какой квадратик ближе всего к целевому квадраику.
			//-- Это значит другой увадратик надо заменить на целевой

			//-- Тут еще возможно перетаскивание в бок

			if(block._VH == 'V')
			{
				if(X1 != Global._moveToX)
				{
					//-- сдвиг боком вправо-лево
					stepType = 1;
					X1 = Global._moveToX;
					X2 = Global._moveToX;
					log('mmmmmm1')
				}
				else{
					//-- шаг вверх - вниз
					Y1 = Global._moveToY;
					Y2 = Global._moveToY + 1;
					log('mmmmmm2')
					stepType = 1;
				}
			}
			else
			{
				if(Y1 != Global._moveToY)
				{
					//-- сдвиг боком вверх-низ
					stepType = 1;
					Y1 = Global._moveToY;
					Y2 = Global._moveToY;
					log('mmmmmm3')
				}
				else{
					//-- шаг  вправо-лево
					X1 = Global._moveToX;
					X2 = Global._moveToX + 1;
					log('mmmmmm4')
					stepType = 1;
				}
			}



			/*
			if(X1 + 1 == Global._moveToX || X1 - 1 == Global._moveToX)
			{
				//-- двигаем по горизонтали
				if(block._VH == 'V')
				{
					if(Global._moveToX != X1)
					{
						stepType = 1;
					}

					X1 = Global._moveToX;
				}
				else
				{
					if(Global._moveToY != Y1 || (X1 != Global._moveToX && X2 != Global._moveToX))
					{
						//-- значит сдиг в бок
						Y1 = Global._moveToY;
						Y2 = Global._moveToY;
						stepType = 1;
					}
				}

				X2 = Global._moveToX;

				log('mmm1 stepType=' + stepType)
			}
			else if(X2 + 1 == Global._moveToX || X2 - 1 == Global._moveToX)
			{
				if(block._VH == 'V')
				{
					X2 = Global._moveToX;
				}
				else
				{
					if(Global._moveToY != Y1 || (X1 != Global._moveToX && X2 != Global._moveToX))
					{
						//-- значит сдиг в бок
						Y1 = Global._moveToY;
						Y2 = Global._moveToY;
						stepType = 1;
					}


				}
				X1 = Global._moveToX;

				log('mmm2 stepType=' + stepType)
			}
			else if(Y1 + 1 == Global._moveToY || Y1 - 1 == Global._moveToY)
			{
								//-- двигаем по вертикали
								if(block._VH == 'H')
								{
									Y2 = Global._moveToY;
									//-- значит сдиг в бок
									stepType = 1;
								}
								else
								{
									if((Y1 != Global._moveToY && Y2 != Global._moveToY))
									{

										//Y1 = Global._moveToY;
										//Y2 = Global._moveToY;

									}
									Y2 = Global._moveToY + 1;
								}
								Y1 = Global._moveToY;


				log('mmm3 stepType=' + stepType)
			}
			else if(Y2 + 1 == Global._moveToY || Y2 - 1 == Global._moveToY)
			{
				//-- двигаем по вертикали
				if(block._VH == 'H')
				{
					Y2 = Global._moveToY;
					//-- значит сдиг в бок
					stepType = 1;
				}
				else
				{
					if((Y1 != Global._moveToY && Y2 != Global._moveToY))
					{

						//Y1 = Global._moveToY;
						//Y2 = Global._moveToY;

					}
					Y2 = Global._moveToY + 1;
				}
				Y1 = Global._moveToY;

				log('mmm4 stepType=' + stepType + ' Y1=' + Y1)
			}
			*/

			block1Str = X1 + ':' + Y1 + '-' + X2 + ':' + Y2+ ';';


			for(i=0; i < Global._blockArr.length; i++)
			{
				block = Global._blockArr[i];

				if(block._id == Global._movedBlockId)
				{
					result = result + block1Str;
				}
				else{
					result = result + block._kvadr1._posX + ':' + block._kvadr1._posY + '-' + block._kvadr2._posX + ':' + block._kvadr2._posY + ';'
				}

			}
		}
		else
		{
			//-- обычный поворот кликом

			n = 0;
			for (var key in Global._selectedBlocksDicById)
			{
				if (Global._selectedBlocksDicById.hasOwnProperty(key))
				{
					n++;

					if(n == 1)
					{
						block1 = Global._selectedBlocksDicById[key];
					}
					else if(n == 2)
					{
						block2 = Global._selectedBlocksDicById[key];
					}
				}
			}


			//log(block1);
			//log(block2);

			if(block1 != null && block2 != null)
			{
				//-- левый верхний угол
				var Xmin = Math.min(block1._kvadr1._posX, block1._kvadr2._posX, block2._kvadr1._posX, block2._kvadr2._posX);
				var Ymin = Math.min(block1._kvadr1._posY, block1._kvadr2._posY, block2._kvadr1._posY, block2._kvadr2._posY);
				//log('X=' + Xmin + ' Y=' + Ymin)

				if(block1._VH == 'V')
				{
					block1Str = Xmin + ':' + Ymin + '-' + (Xmin + 1) + ':' + Ymin;
					block2Str = Xmin + ':' + (Ymin + 1) + '-' + (Xmin + 1) + ':' + (Ymin + 1);

				}
				else{
					block1Str = Xmin + ':' + Ymin + '-' + Xmin + ':' + (Ymin + 1);
					block2Str = (Xmin + 1) + ':' + Ymin + '-' + (Xmin + 1) + ':' + (Ymin + 1);
				}
			}


			for(i=0; i < Global._blockArr.length; i++)
			{
				block = Global._blockArr[i];

				if(block1 != null && block._id == block1._id && block1Str != '')
				{
					result = result + block1Str;
				}
				else if(block2 != null && block._id == block2._id && block2Str != '')
				{
					result = result + block2Str;
				}
				else
				{
					result = result + block._kvadr1._posX + ':' + block._kvadr1._posY + '-' + block._kvadr2._posX + ':' + block._kvadr2._posY ;
				}

				result = result + ';';
			}
		}

		Global._movedBlockId = 0;
		Global._movedBlock = null;

		let stepResult = new StepResult();
		stepResult._string = result;
		stepResult._stepType = stepType;

		return stepResult;
	}
	static getCurrentString()
	{
		let i, block;
		let result = '';

		for(i=0; i < Global._blockArr.length; i++)
		{
			block = Global._blockArr[i];
			result = result + block._kvadr1._posX + ':' + block._kvadr1._posY + '-' + block._kvadr2._posX + ':' + block._kvadr2._posY + ';'
		}

		return result;
	}

	static getCurrentSolution()
	{
		log('SolutionHelper.getCurrentSolution()')
		let solution = new Solution();
		solution._moveCount = 0;
		solution._rotateCount = -1;
		solution._complit = 0;
		let step, block, s;

		let i;

		for(i=0; i < StepHelper._stepArr.length; i++)
		{
			step = StepHelper._stepArr[i];

			if(step._stepType == 1)
			{
				solution._moveCount++;
			}
			else{
				solution._rotateCount++;
			}

			solution._stepArr.push(step);
		}

		solution._complit = 1;

		if(Global._level == 0)
		{
			for(i = 0; i < Global._blockArr.length; i++)
			{
				block = Global._blockArr[i];
	
				if(block._VH == 'H')
				{
					solution._complit = 0;
					break;
				}
			}

			if(solution._complit == 1)
			{
				for(i = 0; i < Global._blockArr.length; i++)
				{
					block = Global._blockArr[i];

					s = block._kvadr1._posX + '-' + block._kvadr1._posY;

					if(!Global._startKvadrDic.hasOwnProperty(s))
					{
						solution._complit = 0;
						break;
					}

					s = block._kvadr2._posX + '-' + block._kvadr2._posY;

					if(!Global._startKvadrDic.hasOwnProperty(s))
					{
						solution._complit = 0;
						break;
					}
				}
			}
		}



		return solution;

	}
}

function log(s)
{
	console.log(s);
}