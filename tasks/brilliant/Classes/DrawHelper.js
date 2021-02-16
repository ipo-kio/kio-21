
import { Brilliant } from '../brilliant.js'
import { ConfigHelper } from './ConfigHelper.js';
import { Global } from './Global.js'
import { StepHelper } from './StepHelper.js'

export class DrawHelper
{
	static _stageX = 0
	static _stageY = 0
	static _firstDraw = false;

	static drawAll(src)
	{
		let i, block;
		log('drawAll - '  + src)

		Brilliant._stageTop.removeAllEventListeners();
		Brilliant._stageTop.removeAllChildren();




		//if(!DrawHelper._firstDraw)
		{
			Brilliant._stageTop.on("stagemousemove", function(evt)
			{
				//log("m "+evt.stageX+","+evt.stageY);


				DrawHelper._stageX = evt.stageX;
				DrawHelper._stageY = evt.stageY;

				let target = Brilliant._stageTop.getObjectUnderPoint(evt.stageX, evt.stageY);

				DrawHelper.onMouseMove(target);
			})

			Brilliant._stageTop.on("stagemouseup", function(evt)
			{
				//log("smu "+evt.stageX+","+evt.stageY);
				//log('s=' + Math.floor (evt.stageX / Global._storona))

				//log(evt);

				/*
				let X = Math.floor (evt.stageX / Global._storona);
				let Y = Math.floor (evt.stageY / Global._storona);


				if(Global._movedBlockId > 0)
				{
					Global.moveBlock(X, Y);
				}
				*/


				//let target = Brilliant._stageTop.getObjectUnderPoint(evt.stageX, evt.stageY);
				//log(target)
			})


		}

		let selBlocks = [];

		for(i = 0; i < Global._blockArr.length; i++)
		{
			block = Global._blockArr[i];

			block._isSelected = Global.isSelected(block._id);

			if(block._isSelected){
				selBlocks.push(block);
			}
			else{
				DrawHelper.drawBlock2(block, Brilliant._stageTop, true, Global._storona);
			}
		}

		for(i=0; i < selBlocks.length; i++)
		{
			block = selBlocks[i];
			DrawHelper.drawBlock2(block, Brilliant._stageTop, true, Global._storona);

			//log(block)
		}

		Brilliant._stageTop.update();

		//-- отрисовка шагов
		{
			let stepContDiv = document.getElementById('stepContDiv');
			stepContDiv.innerHTML = '';
			let step, stepDiv;

			for(i=0; i < StepHelper._stepArr.length; i++)
			{
				step = StepHelper._stepArr[i];

				stepDiv = document.createElement('div');
				stepDiv.id = 'step_' + i;
				stepDiv.innerHTML = (i);
				stepDiv.setAttribute('step_index', i);

				if(i == StepHelper._currentStepIndex)
				{
					stepDiv.className = 'step_div step_div_current';
				}
				else{
					stepDiv.className = 'step_div';
				}


				if(step._stepType == 1)
				{
					stepDiv.innerHTML = '<span style="color: yellow;">' + i + '</span>';
				}



				stepDiv.addEventListener('click', function (evt) {

					let idx = this.getAttribute('step_index');
					Global.gotoStep(parseInt(idx));
				})

				stepDiv.addEventListener('mouseover', function (evt) {

					let idx = this.getAttribute('step_index');
					Global.drawStepPrev(idx)
				})

				stepContDiv.appendChild(stepDiv);
			}
		}

	}

	static onMouseMove(target)
	{
		//log('onMouseMove')
		let selBlocksChanged;
		if(target && target.hasOwnProperty('id'))
		{



			if(Global._lastMouseObjectId != target.id)
			{
				Global._lastMouseObjectId = target.id;

				let selBlocksChanged;

				if(target.id == null)
				{
					selBlocksChanged = Global.clearSelectedBlocks('mmm');
				}
				else{
					selBlocksChanged = Global.setSelectedBlocks(target._pos, target._blockId, 1);
				}
				if(selBlocksChanged)
				{
					DrawHelper.drawAll('mousemove setSelectedBlocks');
				}

			}
		}
		else
		{
			if(Global._lastMouseObjectId != 'empty')
			{
				Global._lastMouseObjectId = 'empty';
				selBlocksChanged = Global.clearSelectedBlocks('mmm');
				if(selBlocksChanged)
				{
					DrawHelper.drawAll('mousemove empty');
				}

			}
		}
	}

	static drawBlock2(block, stage, addEvent, storona)
	{
		//log('drawBlock2() - id=' + block._id)
		let  blockShape2
		let x = (block._X1 * storona);
		let y = (block._Y1 * storona);


		//-- длина сторон
		//let xLen = (block._X2 - block._X1 + 1) * Global._storona;
		//let yLen = (block._Y2 - block._Y1 + 1) * Global._storona;

		block._part1ShapeId = block._kvadr1._id;
		block._part2ShapeId = block._kvadr2._id;
		block._part1ShapeName = 'part' + block._kvadr1._id;
		block._part2ShapeName = 'part' + block._kvadr2._id;

		//-- первая половинка блока (левая или верхняя)
		{
			blockShape2 = new createjs.Shape()
			blockShape2._b12 = 1;
			blockShape2.id = block._part1ShapeId;
			blockShape2.name = block._part1ShapeName;
			blockShape2._blockId = block._id;
			blockShape2._VH = block._VH;
			blockShape2.x = x;
			blockShape2.y = y;
			blockShape2.graphics.beginFill('white');

			if(block._VH == 'V')
			{
				blockShape2.graphics.drawRect(0, 0, storona/2, storona * 2);
				blockShape2._pos = 'L';  //-- левая половинка вертикального блока
			}
			else
			{
				blockShape2.graphics.drawRect(0, 0, storona * 2, storona/2);
				blockShape2._pos = 'T';  //-- верхняя половинка горизонтального блока
			}

			blockShape2.graphics.endFill();

			//-- контур 1

			if(block._isSelected && Global._mouseDown == false)
			{
				DrawHelper.drawKontur12( blockShape2,  'blue', 4, storona);
			}
			else{
				DrawHelper.drawKontur12( blockShape2,  'black', 1, storona);
			}

			if(addEvent)
			blockShape2.on('click', function (event)
			{
				//log('click1=' + event.target.id)
				Global.click(event.target);
				Global._mouseDown = false;
				//Global._canClick = true;
			})


			if(addEvent)
			blockShape2.on('mousedown', function (event)
			{
				//log('mousedown=' + event.target.id)
				Global._mouseDown = true;
				Global.onMouseDown(event.target);
			})


			stage.addChild(blockShape2);

		}

		//-- вторая половинка блока
		{
			blockShape2 = new createjs.Shape()
			blockShape2._b12 = 2;
			blockShape2.id = block._part2ShapeId;
			blockShape2.name = block._part2ShapeName;
			blockShape2._VH = block._VH;
			blockShape2._blockId = block._id;

			blockShape2.graphics.beginFill('white');

			if(block._VH == 'V')
			{
				blockShape2.x = x + storona/2;
				blockShape2.y = y;
				blockShape2.graphics.drawRect(0, 0, storona/2, storona * 2);
				blockShape2._pos = 'R';  //-- правая половинка вертикального блока
			}
			else
			{
				blockShape2.x = x;
				blockShape2.y = y + storona/2;
				blockShape2.graphics.drawRect(0, 0, storona * 2, storona/2);
				blockShape2._pos = 'B';  //-- нижняя половинка горизонтального блока
			}

			blockShape2.graphics.endFill();

			//-- контур 2

			if(block._isSelected && Global._mouseDown == false)
			{
				DrawHelper.drawKontur12( blockShape2, 'blue', 4, storona);
			}
			else{
				DrawHelper.drawKontur12( blockShape2,  'black', 1, storona);
			}

			if(addEvent)
			blockShape2.on('click', function (event)
			{
				//log('click2=' + event.target.id)
				Global.click(event.target);
				Global._mouseDown = false;
				//Global._canClick = true;
			})

			if(addEvent)
			blockShape2.on('mousedown', function (event)
			{
				//log('mousedown=' + event.target.id)
				Global._mouseDown = true;
				Global.onMouseDown(event.target);
			})



			stage.addChild(blockShape2);

		}

		//log(Brilliant._stageTop)
	}

	static drawKontur12(blockShape2,  strokeColor, strokeStyle, storona)
	{
		blockShape2.graphics.beginStroke(strokeColor);
		blockShape2.graphics.setStrokeStyle(strokeStyle);

		if(blockShape2._b12 == 1)
		{
			if(blockShape2._VH == 'V')
			{
				blockShape2.graphics.moveTo(storona/2, 0);
				blockShape2.graphics.lineTo(0, 0);
				blockShape2.graphics.lineTo(0, storona * 2);
				blockShape2.graphics.lineTo(storona/2, storona * 2);
			}
			else
			{
				blockShape2.graphics.moveTo(0, storona/2);
				blockShape2.graphics.lineTo(0, 0);
				blockShape2.graphics.lineTo(storona * 2, 0);
				blockShape2.graphics.lineTo(storona * 2, storona /2);
			}
		}
		else
		{
			//--вторая половинка
			if(blockShape2._VH == 'V')
			{
				blockShape2.graphics.moveTo(0, 0);
				blockShape2.graphics.lineTo(storona/2, 0);
				blockShape2.graphics.lineTo(storona/2, storona * 2);
				blockShape2.graphics.lineTo(0, storona * 2);
			}
			else
			{
				blockShape2.graphics.moveTo(0, 0);
				blockShape2.graphics.lineTo(0, storona/2);
				blockShape2.graphics.lineTo(storona * 2, storona/2);
				blockShape2.graphics.lineTo(storona * 2, 0);
			}
		}



		blockShape2.graphics.endStroke();

	}

	static drawStepPrev(stepIndex)
	{
		let step = StepHelper.getStep(stepIndex);
		let block,i;

		let startData = ConfigHelper.getStartData('drawStepPrev', step._str);



		Brilliant._stagePrev.removeAllChildren();

		for(i = 0; i < startData._blockArr.length; i++)
		{
			block = startData._blockArr[i];

			DrawHelper.drawBlock2(block, Brilliant._stagePrev, false, Global._storonaPrev);
		}

		Brilliant._stagePrev.update();

		document.getElementById('prevInfoDiv').innerHTML = 'Шаг ' + stepIndex;
	}

}

function log(s){
	console.log(s);
}