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

		//------strategy--patternDiv------------

		let s = '<div> \
		<span style="float: right;">\
			<button id="str_del_" onclick="" class="str_del_btn" >\
				&#9932;\
			</button>\
		</span>\
	</div>\
	<div>\
		<table>\
			<tr>\
				<td class="param_cap">дней С</td>\
				<td style="white-space: nowrap;">\
					<input type="text" id="str_from_" value="1" size="2">\
					<button class="str_day_plusminus" id="str_day1_minus_" onclick="" pm="minus" >-</button>\
					<button class="str_day_plusminus" id="str_day1_plus_" onclick="" pm="plus">+</button>\
				</td>\
			</tr>\
			<tr>\
				<td class="param_cap">По</td>\
				<td>\
					<input type="text" id="str_to_" value="1" size="2">\
					<button class="str_day_plusminus" id="str_day2_minus_" onclick="" pm="minus" >-</button>\
					<button class="str_day_plusminus" id="str_day2_plus_" onclick="" pm="plus">+</button>\
				</td>\
			</tr>\
			<tr>\
				<td><label for="str_mask_">Маски</label></td>\
				<td>\
					<input type="checkbox" id="str_mask_">\
				</td>\
			</tr>\
			<tr>\
				<td><label for="str_kar_">Карантин</label></td>\
				<td>\
					<input type="checkbox" id="str_kar_">\
				</td>\
			</tr>\
		</table>\
	</div>\
';

		let divSSPattern = document.createElement('div')
		divSSPattern.innerHTML = s;
		divSSPattern.id = 'strategy_';
		divSSPattern.className = 'str_div';
		superDiv.appendChild(divSSPattern);

		//-------------------

		let divSS = document.createElement('div')
		divSS.innerHTML = '';
		divSS.id = 'div_str_super';
		superDiv.appendChild(divSS);

		let divSControls = document.createElement('div')
		divSControls.innerHTML = '';
		divSControls.id = 'div_str_controlls';
		divSS.appendChild(divSControls);

		btn = document.createElement('button')
		btn.innerHTML = '+'; // <<
		btn.className = 'btn_str_control';
		btn.setAttribute('title', 'Добавить стратегию');
		divSControls.appendChild(btn);
		btn.addEventListener('click', function()
		{
			Controller.addStrategy();
		})

		//-- конейнер для стратегий
		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'strategy_cont';
		divSS.appendChild(div);

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

		Global._ctx = canvas1.getContext('2d');

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
			Controller.go2Prev();
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
			Controller.playStartStop(); 
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