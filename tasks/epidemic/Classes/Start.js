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

		Global._canvas1W = 400;
		Global._canvas1H = 200;

		let canvas1 = document.createElement('canvas');
		canvas1.id = 'canvas1';
		canvas1.width = Global._canvas1W;
		canvas1.height = Global._canvas1H;
		canvas1.className = 'canvas1'
		div.appendChild(canvas1);

		//--------------------

		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'div_buttons';
		superDiv.appendChild(div);

		btn = document.createElement('button')
		btn.innerHTML = '&#8810;'; // <<
		btn.className = 'btn';
		btn.setAttribute('title', 'В начало');
		div.appendChild(btn);
		btn.addEventListener('click', function()
		{
			Controller.go2Start();
		})

		btn = document.createElement('button')
		btn.innerHTML = '&#8918;'; // <
		btn.className = 'btn';
		btn.setAttribute('title', 'Шаг назад');
		div.appendChild(btn);
		btn.addEventListener('click', function()
		{
			Controller.go2Next();
		})

		btn = document.createElement('button')
		btn.innerHTML = '&#8919;'; // >
		btn.className = 'btn';
		btn.setAttribute('title', 'Шаг вперед');
		div.appendChild(btn);
		btn.addEventListener('click', function()
		{
			Controller.go2Next();
		})

		btn = document.createElement('button')
		btn.innerHTML = '&#8811;'; // >>
		btn.className = 'btn';
		btn.setAttribute('title', 'В конец');
		div.appendChild(btn);
		btn.addEventListener('click', function()
		{
			Controller.go2End();
		})

		btn = document.createElement('button');
		btn.id = 'btn_play';
		btn.innerHTML = '&#9658;'; // play
		btn.className = 'btn btn_play';
		btn.setAttribute('title', 'Play');
		div.appendChild(btn);
		btn.addEventListener('click', function()
		{
			Controller.playStartStop(); //-- TODO PETER  Кнопка Плей не нажимается 
		})
	
		//--------------------

		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'div_slider';
		superDiv.appendChild(div);

		let img = Epidemic.kioapi.getResource('slider_p');

		Global._slider = Slider.Create(div, 500, 100, 'canvas_slider'
		,img
		, 0, 100
		);

		Global._slider.onvaluechangeManual = function () {
			// -- тащим руками
			Controller.go2Day(Global._slider.getValue());
		}

		Global._slider.onvaluechangeExternal = function () {
			// -- изменяем программно
			//log('22222 = '+ _slider.getValue());
		
		}
	}


}

function log(s){
	console.log(s);
}