//import { isModuleBlock } from 'typescript';
import { Brilliant } from '../brilliant.js'
import { DrawHelper } from "./DrawHelper";
import { SolutionHelper } from "./SolutionHelper";
import { Start } from "./Start";
import { StepHelper } from "./StepHelper.js";
import { DrawMoving } from "./DrawMoving.js";
import { MoveHelper } from "./MoveHelper.js";
import { StepResult } from './StepResult.js';
import { ConfigHelper } from "./ConfigHelper.js";

export class Global
{
	static _level;
	static _klentkiCountX;
	static _klentkiCountY;
	static _storona = 40;
	static _storonaPrev = 20;
	static _blockArr = [];
	static _blockDic = {}
	static _blockStr = ''
	static _selectedBlocksDicById = {}
	static _lastMouseObjectId = 'empty';
	static _mouseDown = false;
	static _movedBlockId = 0;
	static _XY2MoveDic = {};
	static _moveToX = 0;
	static _moveToY = 0;
	static _movedBlock = null;
	static _canvasSuperTop;
	static _ctxST;
	static _appStarted = false;
	static _movedBlockFake = null;
	static _canClick = true;
	static _startKvadrDic = []; //-- это для проверки на законченность решения. Начальное заполнение квадратиками

	static isSelected(blockId)
	{
		return (Global._selectedBlocksDicById.hasOwnProperty(blockId));
	}

	static setSelectedBlocks(selectedPartPos, firstBlockId, tryNumber)
	{
		let selBlocksChanged = true;
		//if(Global._lastMouseOverPartId != partId)
		{
			//Global._lastMouseOverPartId = partId;
			//log(Global._blockDic)
			//log('pos=' + selectedPartPos + ' firstBlockId=' + firstBlockId)
			let block1 = Global._blockDic[firstBlockId];
			let i, block2;
			let block2Found = false;
			for(i=0; i < Global._blockArr.length; i++)
			{
				block2 = Global._blockArr[i];

				if(block2._VH != block1._VH) continue;
				if(block2._id == block1._id) continue;

				if(selectedPartPos == 'L')
				{
					//-- ищем блок слева на одном уровне
					if(block1._VH == 'V')
					{
						if(block1._X1 == block2._X1+1 && block1._Y1 == block2._Y1)
						{
							block2Found = true;
							break;
						}
					}
				}
				else if(selectedPartPos == 'R')
				{
					//-- ищем блок справа на одном уровне
					if(block1._VH == 'V')
					{
						if(block1._X1 == block2._X1-1 && block1._Y1 == block2._Y1)
						{
							block2Found = true;
							break;
						}
					}
				}
				else if(selectedPartPos == 'T')
				{
					//-- ищем блок сверху на одном X
					if(block1._VH == 'H')
					{
						if(block1._Y1 == block2._Y1+1 && block1._X1 == block2._X1)
						{
							block2Found = true;
							break;
						}
					}
				}
				else if(selectedPartPos == 'B')
				{
					//-- ищем блок снизу на одном X
					if(block1._VH == 'H')
					{
						if(block1._Y1 == block2._Y1-1 && block1._X1 == block2._X1)
						{
							block2Found = true;
							break;
						}
					}
				}
			}

			let oldBlock1Id = 0, oldBlock2Id = 0;
			let prevSelectedBlocksDicById = {};

			for (var key in Global._selectedBlocksDicById)
			{
				if (Global._selectedBlocksDicById.hasOwnProperty(key))
				{
					prevSelectedBlocksDicById[key] = Global._selectedBlocksDicById[key];
				}
			}

			if(block2Found)
			{
				Global._selectedBlocksDicById = {};
				Global._selectedBlocksDicById[block1._id] = block1;
				Global._selectedBlocksDicById[block2._id] = block2;

				if(prevSelectedBlocksDicById.hasOwnProperty(block1._id)
					&& prevSelectedBlocksDicById.hasOwnProperty(block2._id))
				{
					selBlocksChanged = false;
				}
			}
			else
			{
				//log('nofound-'+ tryNumber)
				if(tryNumber == 1)
				{
					if(selectedPartPos == 'L') selectedPartPos = 'R';
					else if(selectedPartPos == 'R') selectedPartPos = 'L';
					else if(selectedPartPos == 'T') selectedPartPos = 'B';
					else if(selectedPartPos == 'B') selectedPartPos = 'T';

					selBlocksChanged = Global.setSelectedBlocks(selectedPartPos, firstBlockId, 2);
				}
				else{
					Global._selectedBlocksDicById = {};
				}

			}

		}
		return selBlocksChanged;
	}

	static clearSelectedBlocks(src )
	{
		let selBlocksChanged = (Object.keys(Global._selectedBlocksDicById).length > 0);
		Global._selectedBlocksDicById = {};
		return selBlocksChanged;
	}

	static onMouseDown(target)
	{
		//-- сюда должна прийти половинка блока по которой кликнули
		if(target && target.hasOwnProperty('id') && target.id != null)
		{
			//log('md blockId = ' + target._blockId);
			let block, i;
			let myBlock = Global.getBlockById(target._blockId);

			//-- набиваем все теоретически возможные варианты перемещений
			Global._XY2MoveDic = {};


			if(myBlock != null)
			{

				Global._movedBlockId = myBlock._id;
				Global._movedBlock = myBlock;

				/*
				Global._XY2MoveDic[(myBlock._X1 + 1) + '_' + myBlock._Y1] = 1;  //-- квадратик справа
				Global._XY2MoveDic[(myBlock._X2 + 1) + '_' + myBlock._Y1] = 1;  //-- квадратик справа
				Global._XY2MoveDic[(myBlock._X1 - 1) + '_' + myBlock._Y1] = 1;  //-- квадратик слева
				Global._XY2MoveDic[(myBlock._X2 - 1) + '_' + myBlock._Y1] = 1;  //-- квадратик слева
				Global._XY2MoveDic[(myBlock._X1 + 1) + '_' + myBlock._Y2] = 1;  //-- квадратик справа
				Global._XY2MoveDic[(myBlock._X2 + 1) + '_' + myBlock._Y2] = 1;  //-- квадратик справа
				Global._XY2MoveDic[(myBlock._X1 - 1) + '_' + myBlock._Y2] = 1;  //-- квадратик слева
				Global._XY2MoveDic[(myBlock._X2 - 1) + '_' + myBlock._Y2] = 1;  //-- квадратик слева

				Global._XY2MoveDic[myBlock._X1 + '_' + (myBlock._Y1 + 1)] = 1;  //-- квадратик сверху
				Global._XY2MoveDic[myBlock._X1 + '_' + (myBlock._Y2 + 1)] = 1;  //-- квадратик сверху
				Global._XY2MoveDic[myBlock._X1 + '_' + (myBlock._Y1 - 1)] = 1;  //-- квадратик снизу
				Global._XY2MoveDic[myBlock._X1 + '_' + (myBlock._Y2 - 1)] = 1;  //-- квадратик снизу
				Global._XY2MoveDic[myBlock._X2 + '_' + (myBlock._Y1 + 1)] = 1;  //-- квадратик сверху
				Global._XY2MoveDic[myBlock._X2 + '_' + (myBlock._Y2 + 1)] = 1;  //-- квадратик сверху
				Global._XY2MoveDic[myBlock._X2 + '_' + (myBlock._Y1 - 1)] = 1;  //-- квадратик снизу
				Global._XY2MoveDic[myBlock._X2 + '_' + (myBlock._Y2 - 1)] = 1;  //-- квадратик снизу


				//-- ищем пустоту рядом. Т.е. не должно оказаться блока рядом

				for(i=0; i < Global._blockArr.length; i++)
				{
					block = Global._blockArr[i];

					if(block._id == myBlock._id) continue;




					if(    block._X1 + 1 == myBlock._X1 || block._X1 + 1 == myBlock._X2
						|| block._X2 + 1 == myBlock._X1 || block._X2 + 1 == myBlock._X2
						|| block._X2 - 1 == myBlock._X1 || block._X2 - 1 == myBlock._X2
						|| block._X2 - 1 == myBlock._X1 || block._X2 - 1 == myBlock._X2
						|| block._Y1 + 1 == myBlock._Y1 || block._Y1 + 1 == myBlock._Y2
						|| block._Y2 + 1 == myBlock._Y1 || block._Y2 + 1 == myBlock._Y2
						|| block._Y1 - 1 == myBlock._Y1 || block._Y1 - 1 == myBlock._Y2
						|| block._Y2 - 1 == myBlock._Y1 || block._Y2 - 1 == myBlock._Y2

						)
					{
						//log('delllllllllllll=')
						//log(block)
						delete Global._XY2MoveDic[block._X1 + '_' + block._Y1];
						delete Global._XY2MoveDic[block._X2 + '_' + block._Y1];
						delete Global._XY2MoveDic[block._X1 + '_' + block._Y2];
						delete Global._XY2MoveDic[block._X2 + '_' + block._Y2];

						//-- если передвигаем вбок, то надо еще проверить есть ли место для второй клеточки


					}


				}
				*/

				DrawMoving.draw();
			}
			else{
				log('md block=null');
				Global._movedBlock = null;
			}

		}
	}

	static moveBlock(droppedX, droppedY)
	{
		//log('Global._movedBlockId=' + Global._movedBlockId)
		//-- Тут надо передвинуть блок на найденное свободное место Х.
		//-- При этом проверить, имеется ли в действительности это свободное место, которое мы должны были найти в Global.onMouseDown()
		if(Global._movedBlockId > 0)
		{
			//log('mmmmmmmm droppedX=' + droppedX + " droppedY=" + droppedY +" bid=" + Global._movedBlockId);

			let block = Global.getBlockById(Global._movedBlockId);

			//-- проверим было ли перетаскивание блока

			

			//if(block._X1 != droppedX && block._X2 != droppedX
			//	|| block._Y1 != droppedY && block._Y2 != droppedY
			//	)
			{
				//-- если XY блока равны +-1 из найденных ранее возможных ХY, то была попытка передвижения на пустой участок
				//-- Но надо еще проверить, небыло ли передвижения в бок, где один из вадратиков занят
				//log('MMMMMMMMMMMMMMMMMMMMM')

				//if(Global._XY2MoveDic.hasOwnProperty(droppedX + '_' + droppedY))
				{
					let canMove = MoveHelper.canMove2('222',block, droppedX, droppedY);

					//-- тут  реальное передвижение блока с пересчетом и отрисовкой
					if(canMove)
					{
						//log('MOOVVVV to ' + droppedX + '_' +droppedY);
						//log(Global._XY2MoveDic);

						Global._moveToX = droppedX;
						Global._moveToY = droppedY;

						Global._canClick = false;

						Global.modifySolution('move');
					}
					else{
						log("FFFFFfF=false")
					}

				}
			}
		}
	}

	static getBlockById(blockId)
	{
		if(Global._blockDic.hasOwnProperty(blockId))
		{
			return Global._blockDic[blockId];
		}
		else{
			return null;
		}
	}

	static click(target)
	{
		//log('click')

		Global._movedBlockId = 0;
		//log(target)
		//-- сюда должна прийти половинка блока по которой кликнули
		if(target && target.hasOwnProperty('id') && target.id != null)
		{

			if(Global._canClick)
			{
				Global.modifySolution('click');
			}
			Global._canClick = true;

			Global.clearSelectedBlocks();
			Global._lastMouseObjectId = '';


			let target = Brilliant._stageTop.getObjectUnderPoint(DrawHelper._stageX, DrawHelper._stageY);

			DrawHelper.onMouseMove(target);

		}
		else{
			log('eeeeeeeeeeeeeeeeeeee')
		}
	}

	static modifySolution(src)
	{

		let oldStr = SolutionHelper.getCurrentString();

		log('modifySolution(' + src + ')');

		let stepResult = SolutionHelper.getModifedString();

		//log(oldStr);
		//log(stepResult._string);

		if(!SolutionHelper.compareStrings(stepResult._string, oldStr))
		{
			StepHelper.addNewStep(stepResult._string, stepResult._stepType, 'modifySolution-' + src);
			Start.createNewFromString('Global.modifySolution', stepResult._string);

			SolutionHelper.getCurrentSolution('modifySolution');
		}

		Global._canClick = true;
	}

	static goBackClick()
	{
		let stepNum = StepHelper._currentStepIndex - 1;
		Global.gotoStep(stepNum);
	}

	static goForwardClick()
	{
		let stepNum = StepHelper._currentStepIndex + 1;
		Global.gotoStep(stepNum);
	}

	static gotoStep(stepIdx)
	{
		log('gotoStep() - ' + stepIdx)

		let step = StepHelper.getStep(stepIdx);
		StepHelper.setCurentStepIndex(stepIdx);
		Start.createNewFromString('gotoStep', step._str);

	}

	static drawStepPrev(stepIndex)
	{
		DrawHelper.drawStepPrev(stepIndex);

	}

	static applaySolution(solution)
	{
		log('Global.applaySolution()')


		if(solution)
		{

			if(solution._stepArr.length > 0)
			{

				let lastStep = solution._stepArr[solution._stepArr.length - 1];

				let startData = ConfigHelper.getStartData('applaySolution1',lastStep._str);

				//log('startData')
				//log(startData)

				Global._blockDic = startData._blockDic;
				Global._selectedBlocksDicById = {};
				Global._blockArr = startData._blockArr;
				StepHelper._stepArr = solution._stepArr;
				StepHelper._currentStepIndex = StepHelper._stepArr.length - 1;
				DrawHelper.drawAll('Global.applaySolution() sidx=' + StepHelper._currentStepIndex )
			}
			else{

				let startData = ConfigHelper.getStartData('applaySolution2',Start._blocksStr);

				Global._blockDic = startData._blockDic;
				Global._blockArr = startData._blockArr;
				StepHelper._stepArr = [];
				StepHelper._currentStepIndex = 0;

				StepHelper.addNewStep(Start._blocksStr, 0, 'start');

				Global.drawStepPrev(0);
				DrawHelper.drawAll('Global.applaySolution() clear'  )
			}

			Brilliant.saveCurrentSolution('applaySolution');


		}
	}

	static delLastStep()
	{
		Global.gotoStep(StepHelper._currentStepIndex - 1);
	}
}

function log(s){
	console.log(s);
}