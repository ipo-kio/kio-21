export class Slider2 
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
        slider._headerH = 0;
        slider.dx = 0; 
        slider._isMmouseDown = false;
        slider._mouseMoveValue = 0;
        slider._canvasLeftOffset = 10;
        slider._canvasRightOffset = 10;

        parentDiv.appendChild(slider._canvas);

        slider.redraw = slider2_redraw;
        slider.thumb_rect = slider2_thumb_rect;
		slider.value_2_pos = slider2_value_2_pos;
        slider.handleMouseDown = slider2_handleMouseDown;
        slider.handleMouseMove = slider2_handleMouseMove;
        slider.event2point = slider2_event2point;
        slider.point_in_thumb = slider2_point_in_thumb;
        slider.position_2_value = slider2_position_2_value;
        slider.setup_waiting_mouse_up = slider2_setup_waiting_mouse_up;
        slider.setValue = slider2_setValue;
		slider.getValue = slider2_getValue;

        slider._canvas.addEventListener('mousedown', slider.handleMouseDown.bind(slider))
        slider._canvas.addEventListener('mousemove', slider.handleMouseMove.bind(slider))

        slider.window_move = e => {
			// tell the browser we're handling this event
			e.preventDefault();
			e.stopPropagation();
			// get mouse position
			let {x, y} = slider.event2point(e);
			// set new thumb & redraw
	
            let n = slider.position_2_value(x);

            if(n < slider._min_value) n = slider._min_value;
            if(n > slider._max_value) n = slider._max_value;
			slider._value = n;
           
            //log(slider._value)
	
			slider.redraw();
		};

        slider.window_up = e => {
			if (e.button === 0)
			{
				slider.setup_waiting_mouse_up(false);

	
				if(slider.onvaluechangeManual)
				{
					slider.onvaluechangeManual({});
				}

                slider.redraw();
			}
	
		};

        slider.redraw();

        return slider;
    }


}

function slider2_redraw()
{
    let y, x, n, x2;
    let yScaleLine;
	var ctx = this._ctx;
	ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

	// центральная полоска
	{
		yScaleLine  = this._canvas.height - 2 + this._headerH;

        x = (this.value_2_pos(this._min_value));
        x2 = (this.value_2_pos(this._max_value));

		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(x, yScaleLine);
		ctx.lineTo(x2, yScaleLine);
		ctx.strokeStyle = '#085e7d'; //--#f7f700
		ctx.stroke();		
	}

    //-- засечки
    {
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        for (var i = 0; i <= this._max_value; i++)
        {
            x = (this.value_2_pos(i));
            if(i % 10 == 0 || i == this._max_value )
			{
				ctx.moveTo(x , yScaleLine - 10 );
                ctx.lineTo(x, yScaleLine + 0);
			}
			else{
				//ctx.moveTo(x , yScaleLine - 5);
			}

            //ctx.lineTo(x, yScaleLine + 0);
        }
        ctx.stroke();
    }

    var tr = this.thumb_rect();

    //-- день под мышкой
    {
        if(this._isMmouseDown)
        {
    
            ctx.beginPath();
            ctx.globalAlpha = 1;
            ctx.font = "bold 12px Arial";
            ctx.fillStyle = 'black';
            ctx.fillText(this._value, tr.x, 10)
            ctx.fill();
        }

    }


    //-- Указатель
	{
		
		ctx.globalAlpha = 0.4;
		ctx.drawImage(this._img, tr.x, tr.y);	
	}


}

function slider2_point_in_thumb({x, y}, thumb_rect) {
	return x >= thumb_rect.x && x <= thumb_rect.x + thumb_rect.w && y >= thumb_rect.y && y <= thumb_rect.y + thumb_rect.h;
}

function slider2_handleMouseDown(e)
{
	if (e.button != 0) return;
    e.preventDefault();
	e.stopPropagation();
    let {x, y} = this.event2point(e);
    // test for possible start of dragging
	let tr = this.thumb_rect();

    if (this.point_in_thumb({x, y}, tr)) {
        this.dx = x - tr.x - this._img.width / 2;
    } else {
        this._value = this.position_2_value(x);
        this.dx = 0;
    }

    this.setup_waiting_mouse_up(true);	
}

function slider2_setup_waiting_mouse_up(on) {
	
    this._isMmouseDown = on;
    if (on)
		$(window)
			.on('mousemove', this.window_move)
			.on('mouseup', this.window_up);
	else
		$(window)
			.off('mousemove', this.window_move)
			.off('mouseup', this.window_up);
}

function  slider2_position_2_value(x) {
	x -= this._img.width / 2 + this._canvasLeftOffset;
	let w = this._canvas.width - this._img.width - this._canvasLeftOffset - this._canvasRightOffset ;
	let n = Math.round(x * (this._max_value - this._min_value) / w + this._min_value);

    if(n < this._min_value) n = this._min_value;
    if(n > this._max_value) n = this._max_value;

    return n;
}

function slider2_event2point(e) {
	let rect = this._canvas.getBoundingClientRect();
	return {x: e.clientX - rect.left, y: e.clientY - rect.top};
}

function slider2_thumb_rect()
{
	let xx = this.value_2_pos(this._value);
	return {
		x: xx - this._img.width/2,
		y: this._headerH ,
		w: this._img.width,
		h: this._img.height
	};
}

function slider2_value_2_pos(value)
{
    
	var w = this._canvas.width - this._img.width - this._canvasLeftOffset - this._canvasRightOffset;
	return  this._canvasLeftOffset +   w * (value - this._min_value) / (this._max_value - this._min_value) + this._img.width/2;
}

function slider2_getValue()
{
	return this._value;
}

function slider2_setValue(value, fireChangeEvent)
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

function slider2_handleMouseMove(e)
{
	//let ee = this.event2point(e);
	//this.is_over = this.point_in_thumb(ee, this.humb_rect());
	//this._mouseX = ee.x;
	this._mouseMoveValue = this._value; //  this.position_2_value(ee.x);
	//log(Math.trunc(this.position_2_value(ee.x)))
	//this.redraw();
}

function log(s){
	console.log(s);
}