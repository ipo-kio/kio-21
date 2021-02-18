import { Brilliant } from '../brilliant.js'
import { Kvadr } from './Kvadr.js'
import { ConfigHelper } from './ConfigHelper.js'
import { StartData } from './StartData.js'
import { DrawHelper } from './DrawHelper.js'
import { Global } from './Global.js'
import { StepHelper } from './StepHelper.js'
import { DrawMoving } from './DrawMoving.js'

export class Start
{
	static _blocksStr;

	static start(domNode)
	{

		log('start()')

		let X = 4
		let Y = 4;
		let i, x, y;

		/*
		let url = new URL(window.location.href);
		Start._blocksStr = url.searchParams.get("bloksstr");

		if(Start._blocksStr == null)
		{
			Start._blocksStr = '1:2-1:1;2:2-2:1;2:3-1:3;2:4-1:4;4:1-3:1;4:2-3:2;3:4-3:3;4:4-4:3;';
		}

		let startData = ConfigHelper.getStartData(Start._blocksStr);
		*/

		let startData = ConfigHelper.getStartData('start', Start._blocksStr);

		Global._klentkiCountX = startData._maxX + 2 + 1;
		Global._klentkiCountY = startData._maxY + 2 + 2;

		let w = (startData._maxX + 2) * Global._storona + Global._storona + 4;
		let h = (startData._maxY + 2) * Global._storona + Global._storona + 4;

		//log('Global._klentkiCount = ' + Global._klentkiCountX + ' ' + Global._klentkiCountY)


		let canvasContDiv = document.createElement('div')
		canvasContDiv.innerHTML = ''
		canvasContDiv.id = 'canvasContDiv'
		canvasContDiv.className = 'canvas_cont_div'
		canvasContDiv.style.width = (w) + 'px'
		canvasContDiv.style.height = (h) + 'px'
		domNode.appendChild(canvasContDiv)

		let canvasTop = document.createElement('canvas')
		canvasTop.width = w
		canvasTop.height = h
		canvasTop.className = 'canvas_top'
		canvasTop.id = 'canvas_top'
		canvasContDiv.appendChild(canvasTop);
		Global._canvasTop = canvasTop;

		Global._canvasSuperTop = document.createElement('canvas')
		Global._canvasSuperTop.width = w
		Global._canvasSuperTop.height = h
		Global._canvasSuperTop.className = 'canvas_supertop'
		Global._canvasSuperTop.id = 'canvas_supertop'
		canvasContDiv.appendChild(Global._canvasSuperTop);
		Global._ctxST = Global._canvasSuperTop.getContext("2d");

		let bottomContDiv = document.createElement('div')
		bottomContDiv.innerHTML = ''
		bottomContDiv.id = 'bottomContDiv'
		bottomContDiv.className = 'bottom_cont_div'
		domNode.appendChild(bottomContDiv);

		let stepContDiv = document.createElement('div')
		stepContDiv.innerHTML = ''
		stepContDiv.id = 'stepContDiv'
		stepContDiv.className = 'step_cont_div'
		domNode.appendChild(stepContDiv);

		let btn = document.createElement('button');
		btn.id = 'btn_back';
		btn.innerHTML = 'Шаг назад';
		btn.className = 'step_btn'
		btn.addEventListener('click', function (evt) {
			Global.goBackClick();
		})
		bottomContDiv.appendChild(btn);

		btn = document.createElement('button');
		btn.id = 'btn_forward';
		btn.innerHTML = 'Шаг вперед';
		btn.className = 'step_btn'
		btn.addEventListener('click', function (evt) {
			Global.goForwardClick();
		})
		bottomContDiv.appendChild(btn);



		//--------------маленький канвас---------------------------------
		{
			let prevDiv = document.createElement('div')
			prevDiv.innerHTML = ''
			prevDiv.id = 'prevDiv'
			prevDiv.className = 'prevDiv'
			prevDiv.style.left = (w + 20) + 'px';
			domNode.appendChild(prevDiv)

			let wP = (startData._maxX + 2) * Global._storonaPrev + Global._storonaPrev + 4;
			let hP = (startData._maxY + 2) * Global._storonaPrev + Global._storonaPrev + 4;

			let canvasContDiv2 = document.createElement('div')
			canvasContDiv2.innerHTML = ''
			canvasContDiv2.id = 'canvasContDiv2'
			canvasContDiv2.className = 'canvas_cont_div'
			canvasContDiv2.style.width = (wP) + 'px'
			canvasContDiv2.style.height = (hP) + 'px'
			prevDiv.appendChild(canvasContDiv2)



			let canvasPrev = document.createElement('canvas')
			canvasPrev.width = wP
			canvasPrev.height = hP
			canvasPrev.className = 'canvas_prev'
			canvasContDiv2.appendChild(canvasPrev)

			let prevInfoDiv = document.createElement('div')
			prevInfoDiv.innerHTML = ''
			prevInfoDiv.id = 'prevInfoDiv'
			prevInfoDiv.className = 'prevInfoDiv'
			prevDiv.appendChild(prevInfoDiv)

			Brilliant._stagePrev = new createjs.Stage(canvasPrev)
		}

		//------------------------------------------------

		Brilliant._stageTop = new createjs.Stage(canvasTop)
		Brilliant._stageTop.enableMouseOver(1)

		Brilliant._stageSuperTop = new createjs.Stage(Global._canvasSuperTop)
		Brilliant._stageSuperTop.enableMouseOver(1);

		//createjs.Ticker.addEventListener("tick", function(){log('ttt')});


		Brilliant._stageSuperTop.on("stagemousedown", function(evt)
		{
			//log("smm down "+evt.stageX+","+evt.stageY);
			DrawMoving.setMouseDown(evt.stageX, evt.stageY);
		})

		Brilliant._stageSuperTop.on("stagemousemove", function(evt)
		{
			if(Global._mouseDown && Global._movedBlock != null)
			{
				//log("smm "+evt.stageX+","+evt.stageY);
				DrawMoving.draw(evt.stageX, evt.stageY);
			}
		})

		Brilliant._stageSuperTop.on("stagemouseup", function(evt)
		{
			//log("smm up "+evt.stageX+","+evt.stageY);

			let X = Math.floor (evt.stageX / Global._storona);
			let Y = Math.floor (evt.stageY / Global._storona);


			if(Global._movedBlockId > 0)
			{
				Global.moveBlock(X, Y);
			}
			Global._mouseDown = false;
			DrawMoving.clear();
		})

		Brilliant._stageSuperTop.nextStage = Brilliant._stageTop;

		//StepHelper.addNewStep(Start._blocksStr, 0, 'start');
		Start.createNewFromString('start', Start._blocksStr);

		//Global.drawStepPrev(0);

		//-- сохраняем начальное заполнение для последующего сравнения с текущим.
		let kvadr;

		for(i=0; i < startData._kvadrArr.length; i++)
		{
			kvadr = startData._kvadrArr[i];

			Global._startKvadrDic[kvadr._posX + '-' + kvadr._posY] = 1;
		}

		log(Global._startKvadrDic)

	}

	static createNewFromString(src, bloksStr)
	{
		log('Start.createNewFromString ' + src)
		let startData = ConfigHelper.getStartData('createNewFromString',bloksStr);

		Global._blockStr = bloksStr;
		Global._blockArr = startData._blockArr;
		Global._blockDic = startData._blockDic;

		if(startData._errMess != '')
		{
			log('Config ERROR! - ' + startData._errMess)
		}
		else
		{

			DrawHelper.drawAll('Start.createNewFromString');

		}

		

	}

}

function handleTick(){
    console.log('tik');
}

function log(s){
	console.log(s);
}