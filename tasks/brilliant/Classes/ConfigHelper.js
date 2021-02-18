
import { Kvadr } from './Kvadr.js'
import { Block } from './Block.js'
import { StartData } from './StartData.js'
import { Global } from './Global.js';

export class ConfigHelper
{
	static _konturDic = {};

	static init()
	{
		if(Global._level == 2)
		{
			ConfigHelper._konturDic['6-3'] = 'H';
			ConfigHelper._konturDic['7-3'] = 'H';

			ConfigHelper._konturDic['5-4'] = 'H';
			ConfigHelper._konturDic['6-4'] = 'H';
			ConfigHelper._konturDic['7-4'] = 'H';
			ConfigHelper._konturDic['8-4'] = 'H';

			ConfigHelper._konturDic['4-5'] = 'V';
			ConfigHelper._konturDic['5-5'] = 'H';
			ConfigHelper._konturDic['6-5'] = 'H';
			ConfigHelper._konturDic['7-5'] = 'H';
			ConfigHelper._konturDic['8-5'] = 'H';
			ConfigHelper._konturDic['9-5'] = 'V';

			ConfigHelper._konturDic['3-6'] = 'V';
			ConfigHelper._konturDic['4-6'] = 'V';
			ConfigHelper._konturDic['9-6'] = 'V';
			ConfigHelper._konturDic['10-6'] = 'V';

			ConfigHelper._konturDic['2-7'] = 'V';
			ConfigHelper._konturDic['3-7'] = 'V';
			ConfigHelper._konturDic['4-7'] = 'V';
			ConfigHelper._konturDic['9-7'] = 'V';
			ConfigHelper._konturDic['10-7'] = 'V';
			ConfigHelper._konturDic['11-7'] = 'V';

			ConfigHelper._konturDic['2-8'] = 'V';
			ConfigHelper._konturDic['3-8'] = 'V';
			ConfigHelper._konturDic['4-8'] = 'V';
			ConfigHelper._konturDic['9-8'] = 'V';
			ConfigHelper._konturDic['10-8'] = 'V';
			ConfigHelper._konturDic['11-8'] = 'V';

			ConfigHelper._konturDic['3-9'] = 'V';
			ConfigHelper._konturDic['4-9'] = 'V';
			ConfigHelper._konturDic['9-9'] = 'V';
			ConfigHelper._konturDic['10-9'] = 'V';

			ConfigHelper._konturDic['4-10'] = 'V';
			ConfigHelper._konturDic['5-10'] = 'H';
			ConfigHelper._konturDic['6-10'] = 'H';
			ConfigHelper._konturDic['7-10'] = 'H';
			ConfigHelper._konturDic['8-10'] = 'H';
			ConfigHelper._konturDic['9-10'] = 'V';
			
			ConfigHelper._konturDic['5-11'] = 'H';
			ConfigHelper._konturDic['6-11'] = 'H';
			ConfigHelper._konturDic['7-11'] = 'H';
			ConfigHelper._konturDic['8-11'] = 'H';
					
			ConfigHelper._konturDic['6-12'] = 'H';
			ConfigHelper._konturDic['7-12'] = 'H';
		}
	}

	static getStartStr()
	{
		let blocksStr;

		if(Global._level == 0)
		{
			//-- горизонтальный
			blocksStr = '3:5-2:5;5:5-4:5;7:5-6:5;9:5-8:5;8:6-9:6;6:6-7:6;4:6-5:6;2:6-3:6;4:4-3:4;6:4-5:4;8:4-7:4;6:3-7:3;4:3-5:3;6:2-5:2;4:7-3:7;6:7-5:7;8:7-7:7;6:8-7:8;4:8-5:8;6:9-5:9;';
			//-- вертикальный 
			//blocksStr = "3:5-3:4;3:7-3:6;2:6-2:5;4:4-4:3;4:6-4:5;4:8-4:7;5:3-5:2;5:5-5:4;5:7-5:6;5:9-5:8;6:8-6:9;6:6-6:7;6:4-6:5;6:2-6:3;7:4-7:3;7:6-7:5;7:8-7:7;8:6-8:7;8:4-8:5;9:6-9:5";
		}
		else  if(Global._level == 1)
		{
			//-- горизонтальный
			blocksStr = '3:5-2:5;5:5-4:5;7:5-6:5;9:5-8:5;8:6-9:6;6:6-7:6;4:6-5:6;2:6-3:6;4:4-3:4;6:4-5:4;8:4-7:4;6:3-7:3;4:3-5:3;6:2-5:2;4:7-3:7;6:7-5:7;8:7-7:7;6:8-7:8;4:8-5:8;6:9-5:9;';
			//-- вертикальный 
			//blocksStr = "3:5-3:4;3:7-3:6;2:6-2:5;4:4-4:3;4:6-4:5;4:8-4:7;5:3-5:2;5:5-5:4;5:7-5:6;5:9-5:8;6:8-6:9;6:6-6:7;6:4-6:5;6:2-6:3;7:4-7:3;7:6-7:5;7:8-7:7;8:6-8:7;8:4-8:5;9:6-9:5";
	}
		else if(Global._level == 2)
		{
			blocksStr = '6:4-5:4;8:4-7:4;2:7-2:6;3:5-3:6;4:4-4:5;6:3-5:3;8:3-7:3;7:2-6:2;9:5-9:4;10:6-10:5;10:8-10:7;9:9-9:8;9:7-9:6;3:8-3:7;4:7-4:6;4:9-4:8;6:9-5:9;8:9-7:9;6:10-5:10;8:10-7:10;11:6-11:7;6:11-7:11';
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