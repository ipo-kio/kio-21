

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
	
				slider._value = Math.round(slider._value); //-- peter
	
				if(slider.onvaluechangeManual)
				{
					slider.onvaluechangeManual({});
				}
			}
	
		};
	
		slider.redraw();		

		return slider;
	}
}
/*
function SliderCreate(parentDiv, width, height, canvasClassName, img, min_value, max_value)
{
	var slider = new Object();
	slider._parentDiv = parentDiv;
	slider._parentDiv.innerHTML = 'aaaaaaaaaa';
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


	var $canvas = $(slider._canvas);

	$canvas
	.on('mousedown', slider.handleMouseDown.bind(slider))
	.on('mousemove', slider.handleMouseMove.bind(slider))
	.on('mouseleave', e => {
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

			slider._value = Math.round(slider._value); //-- peter

			if(slider.onvaluechangeManual)
			{
				slider.onvaluechangeManual({});
			}
		}

	};

	slider.redraw();

	return slider;
}
*/

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
	if (this._value === value)
		return;
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

	// tell the browser we're handling this event
	e.preventDefault();
	e.stopPropagation();
	// get mouse position
	let {x, y} = this.event2point(e);
	// test for possible start of dragging
	let tr = this.humb_rect();

	if (this.point_in_thumb({x, y}, tr)) {
		this.dx = x - tr.x - this._img.width / 2;
	} else {
		this._value = this.position_2_value(x);
		this.dx = 0;
	}

	this.setup_waiting_mouse_up(true);

	this.redraw();
}

function slider_handleMouseMove(e)
{
	this.is_over = this.point_in_thumb(this.event2point(e), this.humb_rect());
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
	//log('redraw = ' +  this._value)
	var ctx = this._ctx;

	ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);



	// bar
	ctx.lineWidth = 4;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(0, this._canvas.height / 2);
	ctx.lineTo(this._canvas.width, this._canvas.height / 2);
	ctx.strokeStyle = '#085e7d'; //--#f7f700
	ctx.stroke();

	{
        var prevVal = -1;
        var val;
        var tikPos = 0;
        var imgW2 = this._img.width / 2;

        ctx.beginPath();
        ctx.lineWidth = 1;

        for (var i = 0; i < this._canvas.width; i++)
        {
            val = Math.round(this.position_2_value(i));

            if(val != prevVal)
            {
                if(val % 10 == 0)
                {
                    ctx.moveTo(i + imgW2, this._canvas.height / 3 - 5);
                }
                else{
                    ctx.moveTo(i + imgW2, this._canvas.height / 3);
                }

                ctx.lineTo(i + imgW2, this._canvas.height / 2);

                if(val == this._tik)
                {
                    tikPos = i;
                }
            }

            prevVal = val;
        }

        ctx.stroke();
	}


	var tr = this.humb_rect();

	ctx.globalAlpha = 1;
	ctx.drawImage(this._img, tr.x, tr.y);
	ctx.globalAlpha = 1;
}

function  slider_position_2_value(x) {
	x -= this._img.width / 2;
	let w = this._canvas.width - this._img.width;
	return x * (this._max_value - this._min_value) / w + this._min_value;
}

function slider_humb_rect()
{
	let xx = this.value_2_pos(this._value);
	return {
		x: xx,
		y: this._canvas.height / 2 - this._img.height / 2,
		w: this._img.width,
		h: this._img.height
	};
}

function slider_value_2_pos(value)
{
	var w = this._canvas.width - this._img.width;
	return w * (value - this._min_value) / (this._max_value - this._min_value);
}