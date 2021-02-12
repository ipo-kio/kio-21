
import { Kvadr } from './Kvadr.js'
import { Block } from './Block.js'
import { StartData } from './StartData.js'

export class ConfigHelper
{
	static getStartData(blocksStr)
	{
		let err = false;

		//-- '2:2-2:3 3:2-3:3 '
		let startData = new StartData();
		startData._errMess = '';
		let i, s, kvadrStr, kvadrSS, kk, blockStr;
		let kvadr, block;
		let kvadrId = 0;
		let VH;

		let ss = blocksStr.split(';');

		for(i=0; i < ss.length; i++)
		{
			//-- 2:2-2:3
			blockStr = ss[i];

			if(blockStr.length >= 7 && blockStr.indexOf('-') > 0)
			{
				kvadrSS = blockStr.split('-');

				if(kvadrSS.length == 2)
				{
					block = new Block();

					//-- 2:2
					kvadrStr = kvadrSS[0];
					kk = kvadrStr.split(':');

					if(kk.length == 2)
					{
						//-- первый
						kvadrId++;
						kvadr = new Kvadr();
						kvadr._id = kvadrId;
						kvadr._posX = parseInt(kk[0]);
						kvadr._posY = parseInt(kk[1]);
						startData._kvadrArr.push(kvadr);
						block._kvadr1 = kvadr;

						if(kvadr._posX > startData._maxX)
						{
							startData._maxX = kvadr._posX;
						}
						if(kvadr._posY > startData._maxY)
						{
							startData._maxY = kvadr._posY;
						}
					}
					else{
						err = true;
						startData._errMess = blockStr + ' kv12 != 2';
						break;
					}

					kvadrStr = kvadrSS[1];
					kk = kvadrStr.split(':');

					if(kk.length == 2)
					{
						//-- второй
						kvadrId++;
						kvadr = new Kvadr();
						kvadr._id = kvadrId;
						kvadr._posX= parseInt(kk[0]);
						kvadr._posY = parseInt(kk[1]);
						startData._kvadrArr.push(kvadr);
						block._kvadr2 = kvadr;
						
						if(kvadr._posX > startData._maxX)
						{
							startData._maxX = kvadr._posX;
						}
						if(kvadr._posY > startData._maxY)
						{
							startData._maxY = kvadr._posY;
						}
					}
					else
					{
						err = true;
						startData._errMess = blockStr + ' kv12 != 2';
						break;
					}

					//-- определяем сторону связи

					if(block._kvadr1._posX == block._kvadr2._posX)
					{
						//-- вертикальный
						VH = 'V';
						if(block._kvadr1._posY < block._kvadr2._posY)
						{
							block._kvadr1._bindSide = 'bottom';
							block._kvadr2._bindSide = 'top';
							block._Y1 = block._kvadr1._posY;
							block._Y2 = block._kvadr2._posY;
						}
						else
						{
							block._kvadr2._bindSide = 'bottom';
							block._kvadr1._bindSide = 'top';
							block._Y1 = block._kvadr2._posY;
							block._Y2 = block._kvadr1._posY;
						}

						block._X1 = block._kvadr1._posX;
						block._X2 = block._kvadr1._posX;
					}
					else
					{
						//-- горизонтальный
						VH = 'H';
						if(block._kvadr1._posX < block._kvadr2._posX)
						{
							block._kvadr1._bindSide = 'right';
							block._kvadr2._bindSide = 'left';
							block._X1 = block._kvadr1._posX;
							block._X2 = block._kvadr2._posX;
						}
						else
						{
							block._kvadr2._bindSide = 'right';
							block._kvadr1._bindSide = 'left';
							block._X1 = block._kvadr2._posX;
							block._X2 = block._kvadr1._posX;
						}

						block._Y1 = block._kvadr1._posY;
						block._Y2 = block._kvadr1._posY;
					}

					block._id = block._kvadr1._id;
					block._VH = VH;

					startData._blockArr.push(block);
					startData._blockDic[block._id] = block;
				}
				else{
					err = true;
					startData._errMess = blockStr + ' kv!=2';
					break;
				}
			}
			else{
				err = true;
				startData._errMess = blockStr;
				break;
			}
		}


		return startData;
	}

	static getBlockArrFromStr(blocksStr){
		let blockArr = [];

		let block

		block = new Block();

		blockArr.push(block);

	}
}