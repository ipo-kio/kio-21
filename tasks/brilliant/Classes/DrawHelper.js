
import { Brilliant } from '../brilliant.js'
import { ConfigHelper } from './ConfigHelper.js';
import { Global } from './Global.js'
import { SolutionHelper } from './SolutionHelper.js';
import { StepHelper } from './StepHelper.js'

export class DrawHelper
{
	static _stageX = 0
	static _stageY = 0
	static _firstDraw = false;

	static drawAll(src)
	{
		let i, block, x, y;
		log('drawAll - '  + src)

		Brilliant._stageTop.removeAllEventListeners();
		Brilliant._stageTop.removeAllChildren();

		Brilliant._stageBot.removeAllEventListeners();
		Brilliant._stageBot.removeAllChildren();

		let fff = new createjs.Shape()
		fff.x = 0;
		fff.y = 0;
		fff.graphics.beginFill('#1f2a60');
		fff.alpha = 0.5
		fff.graphics.drawRect(0, 0, Global._W, Global._H)	
		fff.graphics.endFill();
		
		Brilliant._stageBot.addChild(fff);

		{
			Brilliant._stageTop.on("stagemousemove", function(evt)
			{
				//log("m "+evt.stageX+","+evt.stageY);


				DrawHelper._stageX = evt.stageX;
				DrawHelper._stageY = evt.stageY;

				let target = Brilliant._stageTop.getObjectUnderPoint(evt.stageX, evt.stageY);
				//let arr = Brilliant._stageTop.getObjectsUnderPoint(evt.stageX, evt.stageY);

				/*
				for(let i=0; i < arr.length; i++)
				{
					if(typeof arr[i] === 'object' && arr[i] !== null 
					&& (arr[i].hasOwnProperty('id'))
					)
					{
						//log(arr[i])
						DrawHelper.onMouseMove(arr[i]);
						break;
					}
				}
				*/

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

		//-- отрисовка клеточек
		{
			let kvShape;
			let storona = Global._storona;


			let kondurDic = {};

			if(Global._level == 1)
			{
				kondurDic['5-3'] = 1;
				kondurDic['6-3'] = 1;
				kondurDic['4-4'] = 1;
				kondurDic['5-4'] = 1;
				kondurDic['6-4'] = 1;
				kondurDic['7-4'] = 1;
				kondurDic['3-5'] = 1;
				kondurDic['4-5'] = 1;
				kondurDic['5-5'] = 1;
				kondurDic['6-5'] = 1;
				kondurDic['7-5'] = 1;
				kondurDic['8-5'] = 1;
				kondurDic['2-6'] = 1;
				kondurDic['3-6'] = 1;
				kondurDic['4-6'] = 1;
				kondurDic['5-6'] = 1;
				kondurDic['6-6'] = 1;
				kondurDic['7-6'] = 1;
				kondurDic['8-6'] = 1;
				kondurDic['9-6'] = 1;
				kondurDic['2-7'] = 1;
				kondurDic['3-7'] = 1;
				kondurDic['4-7'] = 1;
				kondurDic['5-7'] = 1;
				kondurDic['6-7'] = 1;
				kondurDic['7-7'] = 1;
				kondurDic['8-7'] = 1;
				kondurDic['9-7'] = 1;
				kondurDic['3-8'] = 1;
				kondurDic['4-8'] = 1;
				kondurDic['5-8'] = 1;
				kondurDic['6-8'] = 1;
				kondurDic['7-8'] = 1;
				kondurDic['8-8'] = 1;
				kondurDic['4-9'] = 1;
				kondurDic['5-9'] = 1;
				kondurDic['6-9'] = 1;
				kondurDic['7-9'] = 1;
				kondurDic['5-10'] = 1;
				kondurDic['6-10'] = 1;				
			}
			else if(Global._level == 2)
			{
				kondurDic = ConfigHelper._konturDic;

			}


			kvShape = new createjs.Shape()
			kvShape.id = 'kletki';
			kvShape.x = 0;
			kvShape.y = 0;

			Brilliant._stageBot.addChild(kvShape);
			
			//kvShape.graphics.beginFill('lightpinck');
			//kvShape.graphics.drawRect(0, 0, Global._canvasSuperTop.width, Global._canvasSuperTop.height);
			//kvShape.graphics.endFill();
			
			
			kvShape.graphics.setStrokeStyle(2);
			kvShape.graphics.beginStroke("#ffffff");
			kvShape.graphics.beginFill('lightpink');
			kvShape.alpha = 0.5

			for(i = 0; i < Global._klentkiCountX; i++)
			{
				for(let j=0; j < Global._klentkiCountY; j++)
				{
					if(Global._level == 1 || Global._level == 2)
					{
						if(kondurDic.hasOwnProperty(i + '-' + j))
						{
							x = storona * i;
							y = storona * j;
							kvShape.graphics.moveTo(x, y);
							kvShape.graphics.lineTo(x + storona, y);
							kvShape.graphics.lineTo(x + storona, y - storona );
							kvShape.graphics.lineTo(x , y - storona );
							kvShape.graphics.lineTo(x, y );	

						}
					}
	
				}
			}

			kvShape.graphics.endStroke();
			


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
				DrawHelper.drawBlock2(block, Brilliant._stageTop, true, Global._storona, Brilliant._stageBot);
			}
		}

		for(i=0; i < selBlocks.length; i++)
		{
			block = selBlocks[i];
			DrawHelper.drawBlock2(block, Brilliant._stageTop, true, Global._storona, Brilliant._stageBot);

			//log(block)
		}

		Brilliant._stageBot.update();
		Brilliant._stageTop.update();

		//-- отрисовка шагов
		{
			let stepContDiv = document.getElementById('stepContDiv');
			stepContDiv.innerHTML = '';
			let step, stepDiv;

			if(StepHelper._stepArr.length > 1)
			{
				let delDiv  = document.createElement('button');
				delDiv.innerHTML = '&#8810;'; //;
				delDiv.setAttribute('title', 'Шаг назад');
				delDiv.className = 'step_div_back';
				//delDiv.style.backgroundColor = 'lightpink'

				delDiv.addEventListener('click', function (evt) {
					Global.delLastStep();
				})

				stepContDiv.appendChild(delDiv);				
			}


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
					//stepDiv.innerHTML = '<span style="color: yellow;">' + i + '</span>';
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
			if(target.id == 'kletki') return;

			if(Global._lastMouseObjectId != target.id)
			{
				Global._lastMouseObjectId = target.id;

				let selBlocksChanged;

				if(target.id == null)
				{
					selBlocksChanged = Global.clearSelectedBlocks('mmm');
				}
				else
				{
					selBlocksChanged = Global.setSelectedBlocks(target._pos, target._blockId, 1);
				}

				if(selBlocksChanged)
				{
					Brilliant.saveCurrentSolution('DrawHelper.onMouseMove');
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

	static drawBlock2(block, stage, addEvent, storona, stageBot)
	{
		//log('drawBlock2() - id=' + block._id)
		let  blockShape2
		let x = (block._X1 * storona);
		let y = (block._Y1 * storona);
		let b1;
		let hit, s
		let img2;


		var bitmap;



		if(Global._level == 1 && (block._VH == 'V'))
		{
			if(addEvent)
			{
				img2 = Brilliant.kioapi.getResource('block_big_light_1');
			}
			else{
				img2 = Brilliant.kioapi.getResource('block_small_light_1');
			}	
		}
		else{
			if(addEvent)
			{
				img2 = Brilliant.kioapi.getResource('block_big_' + Global._level);
			}
			else{
				img2 = Brilliant.kioapi.getResource('block_small_' + Global._level);
			}			
		}



		bitmap = new createjs.Bitmap(img2);
		bitmap.x = x;
		bitmap.y = y

		if(block._VH == 'H')
		{
			bitmap.rotation = 90;
			bitmap.x = x + storona*2
		}



		stageBot.addChild(bitmap);


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
			//blockShape2.graphics.beginFill('red');

			if(block._VH == 'V')
			{
				blockShape2.graphics.drawRect(0, 0, storona/2, storona * 2);
				blockShape2._pos = 'L';  //-- левая половинка вертикального блока

				hit = new createjs.Shape();
				hit.graphics.beginFill("#000").rect(0, 0, storona/2, storona * 2);
				blockShape2.hitArea = hit;
			}
			else
			{
				blockShape2.graphics.drawRect(0, 0, storona * 2, storona/2);
				blockShape2._pos = 'T';  //-- верхняя половинка горизонтального блока

				hit = new createjs.Shape();
				hit.graphics.beginFill("#000").rect(0, 0, storona * 2, storona/2);
				blockShape2.hitArea = hit;
			}

			//blockShape2.graphics.endFill();


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

			b1 = blockShape2;

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

			//blockShape2.graphics.beginFill('white');



			if(block._VH == 'V')
			{
				blockShape2.x = x + storona/2;
				blockShape2.y = y;
				blockShape2.graphics.drawRect(0, 0, storona/2, storona * 2);
				blockShape2._pos = 'R';  //-- правая половинка вертикального блока
				hit = new createjs.Shape();
				hit.graphics.beginFill("#000").rect(0, 0, storona/2, storona * 2);
				blockShape2.hitArea = hit;
			}
			else
			{
				blockShape2.x = x;
				blockShape2.y = y + storona/2;
				blockShape2.graphics.drawRect(0, 0, storona * 2, storona/2);
				blockShape2._pos = 'B';  //-- нижняя половинка горизонтального блока
				hit = new createjs.Shape();
				hit.graphics.beginFill("#000").rect(0, 0, storona * 2, storona/2);
				blockShape2.hitArea = hit;
			}

			//blockShape2.graphics.endFill();

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
	}

	static drawKontur12(blockShape2,  strokeColor, strokeStyle, storona)
	{
		if(strokeColor == 'blue')
		{
			strokeColor = '#ffffff';
			strokeStyle = 3
		}
		else{
			strokeColor = '#1e2b55';
			strokeStyle = 1
		}
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


		Brilliant._stagePrevBot.removeAllChildren();
		Brilliant._stagePrev.removeAllChildren();

		let fff = new createjs.Shape()
		fff.x = 0;
		fff.y = 0;
		fff.graphics.beginFill('#1f2a60');
		fff.alpha = 0.7
		fff.graphics.drawRect(0, 0, Global._wP, Global._hP)	
		fff.graphics.endFill();
		
		Brilliant._stagePrevBot.addChild(fff);



		for(i = 0; i < startData._blockArr.length; i++)
		{
			block = startData._blockArr[i];

			DrawHelper.drawBlock2(block, Brilliant._stagePrev, false, Global._storonaPrev, Brilliant._stagePrevBot);
		}

		Brilliant._stagePrevBot.update();
		Brilliant._stagePrev.update();

		document.getElementById('prevInfoDiv').innerHTML = 'шаг ' + stepIndex;
	}

}

function log(s){
	//console.log(s);
}