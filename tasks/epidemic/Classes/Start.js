import { Epidemic } from '../epidemic.js'
import { Global } from './Global.js'
import { Controller } from './Controller.js'
import { Slider } from './slider.js'

export class Start
{

	static createGlobalInterface(domNode)
	{
		let div, btn;
		
		//let W = 800;

		//let H = 800;

		let superDiv = document.createElement('div')
		superDiv.innerHTML = '';// Start.getHtml();
		superDiv.id = 'superDiv'
		superDiv.className = 'super_div'
		//superDiv.style.width = (W) + 'px'
		//superDiv.style.height = (H) + 'px'
		domNode.appendChild(superDiv);


		//--------------------

		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'div1';
		superDiv.appendChild(div);

		let canvas1 = document.createElement('canvas');
		canvas1.id = 'canvas1';
		canvas1.width = 400;
		canvas1.height = 200;
		canvas1.className = 'canvas1'
		div.appendChild(canvas1);

		//--------------------

		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'div_buttons';
		superDiv.appendChild(div);

		btn = document.createElement('button')
		btn.innerHTML = 'bbbbbbbb';
		btn.className = 'btn';
		div.appendChild(btn);
		btn.addEventListener('click', function()
		{
			Controller.go2End();
		})
	
		//--------------------
		/*
		let btn = document.getElementById('start_btn');
		btn.addEventListener('click', function()
		{
			Global.start();
		})
		*/

		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'div_slider';
		superDiv.appendChild(div);

		let img = Epidemic.kioapi.getResource('slider_p');

		Global._slider = Slider.Create(div, 500, 100, 'canvas_slider'
		,img
		, 0, 100
		);
	}

	/*
	static getHtml()
	{
		var html = ''

		html += '<DIV id="top_div" class="top_div">';
		html += '<div id="top_left_div" class="top_left_div">';
		html += '<canvas id="canvas_top" class="canvas_top"></canvas>';

		html += '</div>';
		html += '<div id="top_right_div" class="top_right_div">';

		html += '</div>';
		html += '</DIV>';
		html += '<DIV id="bottom_div" class="bottom_div">';
		html += '<button id="start_btn" return false;" class="start_btn">Старт</button>';
		html += '</DIV>';

		return html;
	}

	static start()
	{
		log('start')
	}
	*/
}

function log(s){
	console.log(s);
}