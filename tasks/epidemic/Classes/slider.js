import { Global } from './Global.js'
import { Config } from './Config.js'

export class Slider
{
	static Create(parentDiv, width, height, canvasClassName, img, min_value, max_value)
	{
		let slider = new Object();
		slider._parentDiv = parentDiv;
		slider._canvas = document.createElement('canvas');
		slider._canvas.className = canvasClassName;
		slider._canvas.width = width;
		slider._canvas.height = height;
		slider._img = img;
		slider._ctx = slider._canvas.getContext('2d');
		slider._value = 0;
		slider._min_value = min_value;
		slider._max_value = max_value;
		slider._tik = 0;
		slider._is_over = false;
		slider._mouseX = 0;
		slider._headerH = 20
	
		parentDiv.appendChild(slider._canvas);

		slider.redraw = slider_redraw;
		slider.humb_rect = slider_humb_rect;
		slider.value_2_pos = slider_value_2_pos;
		slider.position_2_value = slider_position_2_value;
		slider.handleMouseDown = slider_handleMouseDown;
		slider.handleMouseMove = slider_handleMouseMove;
		slider.setup_waiting_mouse_up = slider_setup_waiting_mouse_up;
		slider.event2point = slider_event2point;
		slider.point_in_thumb = slider_point_in_thumb;
		slider.setValue = slider_setValue;
		slider.getValue = slider_getValue;
		slider.setMaxValue = slider_setMaxValue;

		slider._strategyH = 15;
		slider._scalaH = 40;
		slider._mouseMoveValue = 0;
	
	
		var $canvas = $(slider._canvas);	
		
		$canvas
		.on('mousedown', slider.handleMouseDown.bind(slider))
		.on('mousemove', slider.handleMouseMove.bind(slider))
		.on('mouseleave', e => {
			slider._is_over = false;
			slider.redraw();
		});		

		slider.window_move = e => {
			// tell the browser we're handling this event
			//log('m = ' + slider._value)
			e.preventDefault();
			e.stopPropagation();
			// get mouse position
			let {x, y} = slider.event2point(e);
			// set new thumb & redraw
	
			slider._value = slider.position_2_value(x - slider.dx);
	
			slider.redraw();
		};

		slider.window_up = e => {
			if (e.button === 0)
			{
				slider.setup_waiting_mouse_up(false);

				var isPlay = Global._isPlay;
				Global.playStop();
	
				slider._value = Math.round(slider._value); //-- peter
	
				if(slider.onvaluechangeManual)
				{
					slider.onvaluechangeManual({});
				}

				if(isPlay)
				{
					//Global.playStart();
				}
			}
	
		};
	
		slider.redraw();		

		return slider;
	}
}

function slider_setMaxValue(maxValue)
{
	this._max_value = maxValue;
	this.redraw();
}

function slider_getValue()
{
	return this._value;
}

function slider_setValue(value, fireChangeEvent)
{
	if (value < this.min_value)
		value = this.min_value;
	if (value > this.max_value)
		value = this.max_value;
	//if (this._value === value) return;
	this._value = value;
	this.redraw();

	if(fireChangeEvent && this.onvaluechangeExternal)
	{
		this.onvaluechangeExternal({});
	}

}

function slider_handleMouseDown(e) {
	if (e.button != 0)
		return;

	Global.playStop();

	// tell the browser we're handling this event
	e.preventDefault();
	e.stopPropagation();
	// get mouse position
	let {x, y} = this.event2point(e);
	// test for possible start of dragging
	let tr = this.humb_rect();

	let act, str;

	if(y < this._headerH + this._scalaH)
	{
		//-- зона слайдера
		if (this.point_in_thumb({x, y}, tr)) {
			this.dx = x - tr.x - this._img.width / 2;
		} else {
			this._value = this.position_2_value(x);
			this.dx = 0;
		}

		this.setup_waiting_mouse_up(true);		
	}
	else
	{
		//-- ищем стратегию под кликом
		let val = Math.trunc(this.position_2_value(x)) + 1;

		if(y < this._headerH + this._scalaH + this._strategyH)
		{
			//-- хорошая стратегия
			act = true;
		}
		else{
			//-- ниже плохая стратеия
			act = false;
		}

		let strArr = Global.getStrategyArrForDay(val)

		for(let i = 0; i < strArr.length; i++)
		{
			str = strArr[i];
			if(act && str._isActive)
			{
				Global.setSelectedStrategy('slider_handleMouseDown1', str._id);
				break;
			}
			else if(!act && !str._isActive)
			{
				Global.setSelectedStrategy('slider_handleMouseDown2', str._id);
				break;
			}
		}

		this.redraw();

	}



	//this.redraw();
}

function slider_handleMouseMove(e)
{
	let ee = this.event2point(e);
	this.is_over = this.point_in_thumb(ee, this.humb_rect());
	this._mouseX = ee.x;
	this._mouseMoveValue = Math.trunc(this.position_2_value(ee.x - 5));
	//log(Math.trunc(this.position_2_value(ee.x)))
	this.redraw();
}

function slider_point_in_thumb({x, y}, thumb_rect) {
	return x >= thumb_rect.x && x <= thumb_rect.x + thumb_rect.w && y >= thumb_rect.y && y <= thumb_rect.y + thumb_rect.h;
}

function slider_event2point(e) {
	let rect = this._canvas.getBoundingClientRect();
	return {x: e.clientX - rect.left, y: e.clientY - rect.top};
}


function slider_setup_waiting_mouse_up(on) {
	if (on)
		$(window)
			.on('mousemove', this.window_move)
			.on('mouseup', this.window_up);
	else
		$(window)
			.off('mousemove', this.window_move)
			.off('mouseup', this.window_up);
}

function slider_redraw()
{
	let solution = Global.getCurrentSolution();
	var prevVal = -1;
	var val;
	var y, x, n;
	//log('redraw = ' +  this._value)
	var ctx = this._ctx;

	ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);



	// центральная полоска
	{
		y  = this._img.width  + 10 + this._headerH;

		ctx.lineWidth = 4;
		//ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(this._canvas.width, y);
		ctx.strokeStyle = '#085e7d'; //--#f7f700
		ctx.stroke();		

	}


	//-- засечки
	{

        var tikPos = 0;
        var imgW2 = this._img.width / 2 ;

        ctx.beginPath();
        ctx.lineWidth = 1;
		

		

		for (var i = 0; i <= this._max_value ; i++)
		{
			if(this._mouseMoveValue == i - 1)
			{
				ctx.strokeStyle = 'black';
				n = 10;
			}
			else{
				n = 0;
				ctx.strokeStyle = 'black';
			}
			
			x = (this.value_2_pos(i));



			if(i % 10 == 0 || i == this._max_value )
			{
				ctx.moveTo(x , y - n - 20);
			}
			else{
				ctx.moveTo(x , y - n - 15);
			}

			ctx.lineTo(x, y + 15);
		}


        ctx.stroke();



	}

	//-- красная полоса блокировки
	if(solution)
	{
		if(!solution._isComplit && solution._uncomplitDayNumber > 0)
		{
			x = this.value_2_pos(solution._uncomplitDayNumber-1) ;

			ctx.save()
			ctx.beginPath();
			ctx.lineWidth = 5;
			ctx.moveTo(x, y);
			ctx.lineTo(this._canvas.width, y);
			ctx.strokeStyle = 'red'; //--#f7f700
			ctx.stroke();
			ctx.restore()
		}
	}

	//-- Стратегии
	{

		if(solution)
		{
			var lineColor;
			var str;
			
			var aa;
			var strX1, strX2;
			var selectedId = Global._selectedStrategyId;

			for (var i = 0; i < solution._strategyArr.length ; i++)
			{
				str = solution._strategyArr[i];

				y = this._headerH + this._scalaH ;
				{
					if(str._isActive)
					{
						//y = ;
						if(str._id == selectedId)
						{
							lineColor = 'green';
						}
						else{
							lineColor = '#2cdb3d';// 'lightgreen';
						}
					}
					else{
						y = y + this._strategyH ;
						if(str._id == selectedId)
						{
							lineColor = 'brown';
						}
						else{
							lineColor = 'red';
						}
					}
					
					//-- основная линия стратегии
					{

						if(str._dayStart <= str._dayFinish)
						{
							n = str._dayFinish
						}
						else{
							n = Config._dayCount;
						}

						strX1 = this.value_2_pos(str._dayStart) ;
						strX2 = this.value_2_pos(n) ;



						//-- засечка
						ctx.beginPath();
						ctx.lineWidth = 1;
						ctx.strokeStyle = lineColor;

						x = (strX1) - 7  ;
						ctx.moveTo(x , y);						
						ctx.lineTo(x , y + 18);	

						x = (strX2);
						ctx.moveTo(x , y);						
						ctx.lineTo(x , y + 18);
						ctx.stroke();

						//-- прямоуголник
						ctx.beginPath();
						ctx.globalAlpha = 1;
						ctx.fillStyle = lineColor;
						ctx.rect(strX1 - 7, y, (strX2 - strX1) + 7 , this._strategyH)

						if(str._id == selectedId)
						{
							ctx.lineWidth = 3;
							ctx.strokeStyle = 'yellow';
							ctx.stroke()
						}

						ctx.fill();


			
					}

					//-- линия маски
					//-- LEVEL SETTINGS
					if(Config._level != 0)
					{
						/*
						y = y + 6
						lineColor = 'green';
						if(str._maskKoef > 0)
						{
							//-- LEVEL SETTINGS
							if(Config._level == 1)
							{
								aa = 1;
							}
							else{
								aa =  (str._maskKoef * 1) / 10 + 0.5;
							}
							
						}
						else{
							aa = 0.2;
						}
						

						ctx.beginPath();
						ctx.lineWidth = 3;
						ctx.globalAlpha = aa;
						ctx.strokeStyle = lineColor;
						ctx.moveTo(strX1 , y);
						ctx.lineTo(strX2 , y);
						ctx.stroke();
						*/
					}

					//-- линия Дистант
					{
						/*
						y = y + 6
						lineColor = 'red';
						if(str._distPercent > 0)
						{
							aa =  (str._distPercent / 100);

							if(aa < 0.1)
							{
								aa == 0.1
							}
						}
						else{
							aa = 0.09;
						}		

						ctx.beginPath();
						ctx.lineWidth = 3;
						ctx.globalAlpha = aa;
						ctx.strokeStyle = lineColor;
						ctx.moveTo(strX1 , y);
						ctx.lineTo(strX2 , y);
						ctx.stroke();
						*/
					}

					//-- линия Тестирования
					{
						/*
						y = y + 6
						lineColor = 'brown';
						if(str._testPercent > 0)
						{
							aa =  (str._testPercent / 100);

							if(aa < 0.1)
							{
								aa == 0.1
							}
						}
						else{
							aa = 0.09;
						}

						ctx.beginPath();
						ctx.lineWidth = 3;
						ctx.globalAlpha = aa;
						ctx.strokeStyle = lineColor;
						ctx.moveTo(strX1 , y);
						ctx.lineTo(strX2 , y);
						ctx.stroke();
						*/
					}

				}
			}			
		}

	}

	//-- день под мышкой
	{
		/*
		if(Global._isPlay)
		{
			x = this.value_2_pos(this.value) ;
		}
		else
		{
			x = this._mouseX - 5;			
		}
		*/
		x = this._mouseX - 5;
		y =  15;

		ctx.beginPath();
		ctx.globalAlpha = 1;
		ctx.font = "bold 12px Arial";
		ctx.fillStyle = 'black';
		ctx.fillText(this._mouseMoveValue + 1, x, y)
		ctx.fill();

		/*
		x = x + 2.5;
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		ctx.strokeStyle = 'black'
		ctx.moveTo(x, this._headerH);
		ctx.lineTo(x, this._canvas.height - 5);
		ctx.stroke();
		*/
	}

	//-- Указатель
	{
		var tr = this.humb_rect();

		ctx.globalAlpha = 1;
		ctx.drawImage(this._img, tr.x, tr.y);
		
	}

}

function  slider_position_2_value(x) {
	x -= this._img.width / 2;
	let w = this._canvas.width - this._img.width/1;
	return x * (this._max_value - this._min_value) / w + this._min_value;
}

function slider_value_2_pos(value)
{
	var w = this._canvas.width - this._img.width/1 ;//- this._img.width*2;
	return w * (value - this._min_value) / (this._max_value - this._min_value) + this._img.width/2;
}

function slider_humb_rect()
{
	let xx = this.value_2_pos(this._value);
	return {
		x: xx - this._img.width/2,
		//y: this._canvas.height / 2 - this._img.height / 2,
		y: 10 + this._headerH ,
		w: this._img.width,
		h: this._img.height
	};
}

function log(s){
	console.log(s);
}