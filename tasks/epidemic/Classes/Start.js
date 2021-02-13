import { Epidemic } from '../epidemic.js'
import { Global } from './Global.js'
import { Controller } from './Controller.js'
import { Slider } from './slider.js'
import { Config } from './Config.js'

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

		//-- TODO PETER - блок стратегии подработать

		let s = '<div>\
		<button class="str_day_to" id="str_day_toleft_" onclick="" title="Сдвиг">&lt;</button>\
		<span class="str_cap">Промежуток дней</span>\
		<button class="str_day_to" id="str_day_toright_" onclick="" title="Сдвиг дней">&gt;</button>\
			</div>\
			<table class="str_t1">\
				<tr>\
					<td>\
						<input type="text" id="str_from_" value="1" class="str_day">\
					</td>\
					<td>-</td>\
					<td>\
						<input type="text" id="str_to_" value="1" class="str_day">\
					</td>\
				</tr>\
				<tr>\
					<td>\
						<button class="str_day_plusminus" id="str_day1_minus_" onclick="" pm="minus" >-</button>\
						<button class="str_day_plusminus" id="str_day1_plus_" onclick="" pm="plus">+</button>\
					</td>\
					<td></td>\
					<td>\
						<button class="str_day_plusminus" id="str_day2_minus_" onclick="" pm="minus" >-</button>\
            			<button class="str_day_plusminus" id="str_day2_plus_" onclick="" pm="plus">+</button>\
					</td>\
				</tr>\
			</table>\
			<input type="checkbox" id="str_mask_"> <label for="str_mask_">Маски</label>\
			<br>\
			<input type="checkbox" id="str_kar_"> <label for="str_kar_">Карантин</label>\
			<span style="float: right;">\
				<button id="str_del_" onclick="" class="str_del_btn" title="Удалить стратегию" >&#9932;</button>\
			</span>';


		let divSSPattern = document.createElement('div')
		divSSPattern.innerHTML = s;
		divSSPattern.id = 'strategy_';
		divSSPattern.className = 'str_div';
		divSSPattern.setAttribute('title', '')
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
		btn.innerHTML = 'Добавить стратегию'; // <<
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

		Global._slider = Slider.Create(div, 800, 50, 'canvas_slider'
		,img
		, 0, Config._dayCount
		);

		Global._slider.onvaluechangeManual = function () {
			// -- тащим руками

			let dayNumber = Global._slider.getValue();

			if(dayNumber < 1 )
			{
				dayNumber = 1;
			}
			else  if( dayNumber >= Config._dayCount)
			{
				dayNumber = Config._dayCount;
			}

			Controller.go2Day(dayNumber);
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