
import { Kvadr } from './Kvadr.js'
import { Block } from './Block.js'
import { StartData } from './StartData.js'
import { Global } from './Global.js';

export class ConfigHelper
{
	static getStartStr()
	{
		let blocksStr;

		if(Global._level == 0)
		{
			//-- горизонтальный
			blocksStr = '3:5-2:5;5:5-4:5;7:5-6:5;9:5-8:5;8:6-9:6;6:6-7:6;4:6-5:6;2:6-3:6;4:4-3:4;6:4-5:4;8:4-7:4;6:3-7:3;4:3-5:3;6:2-5:2;4:7-3:7;6:7-5:7;8:7-7:7;6:8-7:8;4:8-5:8;6:9-5:9;';
			//-- вертикальный 3:5-3:4;3:7-3:6;2:6-2:5;4:4-4:3;4:6-4:5;4:8-4:7;5:3-5:2;5:5-5:4;5:7-5:6;5:9-5:8;6:8-6:9;6:6-6:7;6:4-6:5;6:2-6:3;7:4-7:3;7:6-7:5;7:8-7:7;8:6-8:7;8:4-8:5;9:6-9:5;
		}
		else  if(Global._level == 1)
		{
			blocksStr = '2:4-1:4;2:5-1:5;4:4-3:4;4:5-3:5;6:5-5:5;5:4-6:4;8:4-7:4;7:5-8:5;3:3-2:3;5:3-4:3;7:3-6:3;4:2-3:2;6:2-5:2;5:1-4:1;3:6-2:6;5:6-4:6;7:6-6:6;4:7-3:7;6:7-5:7;5:8-4:8;';
		}
		else if(Global._level == 2)
		{
			blocksStr = '2:4-1:4;2:5-1:5;4:4-3:4;4:5-3:5;6:5-5:5;5:4-6:4;8:4-7:4;7:5-8:5;3:3-2:3;5:3-4:3;7:3-6:3;4:2-3:2;6:2-5:2;5:1-4:1;3:6-2:6;5:6-4:6;7:6-6:6;4:7-3:7;6:7-5:7;5:8-4:8;';
		}

		return blocksStr;
	}

	static getStartData(src, blocksStr)
	{
		let err = false;

		//-- '2:2-2:3 3:2-3:3 '
		let startData = new StartData();
		startData._errMess = '';
		let i, s, kvadrStr, kvadrSS, kk, blockStr;
		let kvadr, block;
		let kvadrId = 0;
		let VH;


		if(blocksStr == '')
		{
			blocksStr = ConfigHelper.getStartStr();
		}
		

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