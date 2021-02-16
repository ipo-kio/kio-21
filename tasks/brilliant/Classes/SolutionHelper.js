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
		let minY = 100;
		let minX = 100;

		if(Global._level == 0)
		{
			let kvadrArr = [];

			//-- все должны быть горизонтально

			for(i = 0; i < Global._blockArr.length; i++)
			{
				block = Global._blockArr[i];


	
				if(block._VH == 'H')
				{
					solution._complit = 0;
					log('Ошибка вертикалки')
					//--break;
				}

				kvadrArr.push(block._kvadr1);
				kvadrArr.push(block._kvadr2);

				if(block._kvadr1._posX < minX)
				{
					minX = block._kvadr1._posX;
				}
				if(block._kvadr2._posX < minX)
				{
					minX = block._kvadr2._posX;
				}

				if(block._kvadr1._posY < minY)
				{
					minY = block._kvadr1._posY;
				}
				if(block._kvadr2._posY < minY)
				{
					minY = block._kvadr2._posY;
				}
			}

			solution._complit = 1

			if(solution._complit == 1)
			{
				//-- собран ли правильный квадрат в любом месте.
				//-- сверху вниз
				//-- 5-2 6-2
				//-- 4-3 5-3 6-3 7-3
				//-- 3-4 4-4 5-4 6-4 7-4 8-4
				//-- 2-5 3-5 4-5 5-5 6-5 7-5 8-5 9-5
				//-- 2-6 3-6 4-6 5-6 6-6 7-6 8-6 9-6
				//-- 3-7 4-7 5-7 6-7 7-7 8-7
				//-- 4-8 5-8 6-8 7-8
				//-- 5-9 6-9

				//-- сверху вниз по рядам

				let kvadr;
				let kCount;
				let nY;

				log('minX=' + minX + ' minY=' + minY)

				
				

				for(let y = minY; y < 11; y++)
				{
					log('Проверка ряда  y=' + y)
					//-- для каждого ряда сверху вниз
					
					nY = 0;

					if(y == minY+nY) // 1
					{
						//-- в первом ряду должно быть 2 квадратика, 
						//-- но первый ряд может начаться не с самого верха minY
						//-- и еще есть сдвиг слева  minX
						kCount = 0;
						for(i = 0; i < kvadrArr.length; i++)
						{
							kvadr = kvadrArr[i];
		
							if(kvadr._posY == minY) //-- тут должно быть два квадратика смещенные на 3 и 4 по Х
							{
								if(kvadr._posX == (minX + 3) || kvadr._posX == (minX + 4))
								{
									kCount++;

									if(kCount > 2)
									{
										break;
									}
								}						
							}
						}
						
						if(kCount != 2)
						{							
							log('Ошибка в  ряду 1 - minY=' + minY+ ' kCount=' + kCount)
							solution._complit = 0;
							//--break
						}
					}

					nY = 1;

					if(y == (minY+nY)) // 2
					{
						//-- во втором ряду 4 квадратика
						kCount = 0;
						for(i = 0; i < kvadrArr.length; i++)
						{
							kvadr = kvadrArr[i];
		
							if(kvadr._posY == minY+nY) //-- тут должно быть два квадратика смещенные на 2,3,4,5 по Х
							{
								if(kvadr._posX == (minX + 2) 
								|| kvadr._posX == (minX + 3) 
								|| kvadr._posX == (minX + 4) 
								|| kvadr._posX == (minX + 5))
								{
									kCount++;

									if(kCount > 4)
									{
										break;
									}
								}						
							}
						}

						if(kCount != 4)
						{							
							log('Ошибка в  ряду 2 - minY=' + minY+ ' kCount=' + kCount)
							solution._complit = 0;
							//--break
						}
					}

					nY = 2;

					if(y == (minY+nY)) // 3
					{
						//-- во 3 ряду  6 квадратиков
						kCount = 0;
						for(i = 0; i < kvadrArr.length; i++)
						{
							kvadr = kvadrArr[i];
		
							if(kvadr._posY == minY+nY) //-- тут должно быть два квадратика смещенные на 1,2,3,4,5 по Х
							{
								if( kvadr._posX == (minX + 1)
								|| kvadr._posX == (minX + 2)								 
								|| kvadr._posX == (minX + 3) 
								|| kvadr._posX == (minX + 4) 
								|| kvadr._posX == (minX + 5)
								||kvadr._posX == (minX + 6)
								)
								{
									kCount++;

									if(kCount > 6)
									{
										break;
									}
								}						
							}
						}

						if(kCount != 6)
						{							
							log('Ошибка в  ряду 3 - minY=' + minY+ ' kCount=' + kCount)
							solution._complit = 0;
							//--break
						}
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