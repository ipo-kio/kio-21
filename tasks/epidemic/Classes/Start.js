import { Epidemic } from '../epidemic.js'
import { Global } from './Global.js'
import { Controller } from './Controller.js'
import { Slider } from './slider.js'
import { Config } from './Config.js'

export class Start
{

	static createGlobalInterface(domNode)
	{
		let div, btn, t;

		let superDiv = document.createElement('div')
		superDiv.innerHTML = '';// Start.getHtml();
		superDiv.id = 'superDiv'
		superDiv.className = 'super_div'
		//superDiv.style.width = (W) + 'px'
		//superDiv.style.height = (H) + 'px'
		domNode.appendChild(superDiv);

		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'div_slider';
		superDiv.appendChild(div);

		let img = Epidemic.kioapi.getResource('slider_p');

		Global._slider = Slider.Create(div, 900, 100, 'canvas_slider'
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



		t = document.createElement('span')
		t.id = 'day_cap'
		t.className = 'day_cap'
		t.innerHTML = '0';
		div.appendChild(t);

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
		t = document.createElement('span')
		t.id = 'zaraz_cap'
		t.className = 'prop_cap'
		t.innerHTML = 'Коэф. заражения';
		div.appendChild(t);

		t = document.createElement('input')
		t.type = 'text'
		t.value = '0.001';
		t.id = 'zaraz_koef';
		t.className = 'input_txt'
		div.appendChild(t);

		t = document.createElement('span')
		t.id = 'prof_cap'
		t.className = 'prop_cap'
		t.innerHTML = 'Затрат на тест';
		div.appendChild(t);

		t = document.createElement('input')
		t.type = 'text'
		t.value = '0.3';
		t.id = 'prof_kt';
		t.className = 'input_txt'
		div.appendChild(t);

		t = document.createElement('span')
		t.id = 'rb_cap'
		t.className = 'prop_cap'
		t.innerHTML = 'R-B';
		div.appendChild(t);

		t = document.createElement('input')
		t.type = 'text'
		t.value = '60';
		t.id = 'rb_kt';
		t.className = 'input_txt'
		div.appendChild(t);

		//--------------------------

		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'div_params';
		div.className = 'div_params';
		superDiv.appendChild(div);

		//-------
		t = document.createElement('span')
		t.id = 'ystart_cap'
		t.className = 'prop_cap'
		t.innerHTML = 'Y start';
		div.appendChild(t);

		t = document.createElement('input')
		t.type = 'text'
		t.value = '0';
		t.id = 'ystart_kt';
		t.className = 'input_txt'
		div.appendChild(t);

		//-------
		t = document.createElement('span')
		t.id = 'yadd_cap'
		t.className = 'prop_cap'
		t.innerHTML = 'new (Y)';
		div.appendChild(t);

		t = document.createElement('input')
		t.type = 'text'
		t.value = '0.34';
		t.id = 'yadd_kt';
		t.className = 'input_txt'
		div.appendChild(t);

		//---------
		btn = document.createElement('button');
		btn.innerHTML = 'Перерасчет'; 
		btn.className = '';
		div.appendChild(btn);
		btn.addEventListener('click', function()
		{
			Controller.recalc(); 
		})


		//--------------------




		Global._slider.onvaluechangeExternal = function () {
			// -- изменяем программно
			//log('22222 = '+ _slider.getValue());
		
		}

		//------strategy--patternDiv------------


		let s = '<div>\
			<button class="str_day_to" id="str_day_toleft_" onclick="" title="Сдвиг">&lt;</button>\
			<span class="str_cap">Промежуток дней</span>\
			<button class="str_day_to" id="str_day_toright_" onclick="" title="Сдвиг дней">&gt;</button>\
			<span style="float: right;">\
				<button id="str_del_" onclick="" class="str_del_btn" title="Удалить стратегию" >&#9932;</button>\
			</span>\
		</div>\
			<table class="str_t1">\
				<tr>\
					<td>\
						<input type="text" id="str_from_" value="1" class="str_day">\
						<button class="str_day_plusminus" id="str_day1_minus_" onclick="" pm="minus" >-</button>\
						<button class="str_day_plusminus" id="str_day1_plus_" onclick="" pm="plus">+</button>\
					</td>\
					<td>-</td>\
					<td>\
						<input type="text" id="str_to_" value="1" class="str_day">\
						<button class="str_day_plusminus" id="str_day2_minus_" onclick="" pm="minus" >-</button>\
						<button class="str_day_plusminus" id="str_day2_plus_" onclick="" pm="plus">+</button>\
					</td>\
				</tr>\
				<tr>\
					<td></td>\
					<td></td>\
					<td></td>\
				</tr>\
			</table>';

			//-- LEVEL SETTINGS
			if(Config._level != 0)
			{
				s = s + '<span class="str_prop_name">Маски</span>\
				<button id="str_mask_btn0_" class="str_mask_btn" koef="0" onclick="">&#9932;</button>\
				<button id="str_mask_btn1_" class="str_mask_btn" koef="1" onclick="">1</button>\
				<button id="str_mask_btn2_" class="str_mask_btn" koef="2" onclick="">2</button>\
				<button id="str_mask_btn3_" class="str_mask_btn" koef="3" onclick="">3</button>\
				<button id="str_mask_btn4_" class="str_mask_btn" koef="4" onclick="">4</button>\
				<button id="str_mask_btn5_" class="str_mask_btn" koef="5" onclick="">5</button>';			
			}





			s = s + '<table class="str_t1">\
			<tr>\
			<td><span class="str_prop_name">Карантин</span><div class="str_prop_val" id="str_dist_">0</div>%</td>\
			<td>';

			//-- LEVEL SETTINGS
			/*
			if(Config._level == 0)
			{
				s = s + '<input type="text" id="str_dist_" value="30" disabled class="str_day">%';
				s = s + '<input type="checkbox" id="str_dist_act_" >';
			}
			else{
				s = s + '<input type="text" id="str_dist_" value="0" class="str_day">%\
				<button class="str_day_plusminus" id="str_dist_minus_" onclick="" pm="minus" >-</button>\
				<button class="str_day_plusminus" id="str_dist_plus_" onclick="" pm="plus">+</button>';
			}
			*/
			
			s = s + '<div id="sliderDist_"></div>';
			/*
			s = s + '<input type="text" id="str_dist_" value="0" class="str_day">%\
			<button class="str_day_plusminus" id="str_dist_minus_" onclick="" pm="minus" >-</button>\
			<button class="str_day_plusminus" id="str_dist_plus_" onclick="" pm="plus">+</button>';
			*/
			s = s + '</td>\
			</tr>\
			<tr>\
			<td><span class="str_prop_name">Тестирование</span><div class="str_prop_val" id="str_test_">0</div>%</td>\
			<td>';
			s = s + '<div id="sliderTest_"></div>';
			/*
			<input type="text" id="str_test_" value="0" class="str_day">%\
			<button class="str_day_plusminus" id="str_test_minus_" onclick="" pm="minus" >-</button>\
			<button class="str_day_plusminus" id="str_test_plus_" onclick="" pm="plus">+</button>\
			*/
			s = s + '</td>\
			</tr>\
			</table>\
			';
			//-- SLIDER2

		let divSSPattern = document.createElement('div')
		divSSPattern.innerHTML = s;
		divSSPattern.id = 'strategy_';
		divSSPattern.className = 'str_div';
		divSSPattern.setAttribute('title', '')
		divSSPattern.setAttribute('mask_koef', '0')
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



		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'strategy_error';
		div.className = 'strategy_error';
		divSS.appendChild(div);

		//-- конейнер для стратегий
		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'strategy_cont';
		div.className = 'strategy_cont';
		divSS.appendChild(div);

		//--------------------

		btn = document.createElement('button')
		btn.id = 'add_str_btn'
		btn.innerHTML = 'Добавить стратегию'; // <<
		btn.className = 'btn_str_control';
		btn.setAttribute('title', 'Добавить стратегию');
		divSS.appendChild(btn);
		btn.addEventListener('click', function()
		{
			Controller.addStrategy();
		})
		//----
		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'day_log0';
		div.className = 'day_log';
		divSS.appendChild(div);

		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'day_log1';
		div.className = 'day_log';
		divSS.appendChild(div);

		div = document.createElement('div')
		div.innerHTML = '';
		div.id = 'day_log2';
		div.className = 'day_log';
		divSS.appendChild(div);
		//--

		div = document.createElement('div')
		div.innerHTML = '';
		div.className = 'div_canvas'
		div.id = 'div_canvas';
		superDiv.appendChild(div);

		Global._canvas1W = 800;
		Global._canvas1H = 400;

		let canvas1 = document.createElement('canvas');
		canvas1.id = 'canvas1';
		canvas1.width = Global._canvas1W;
		canvas1.height = Global._canvas1H;
		canvas1.className = 'canvas1'
		div.appendChild(canvas1);

		Global._ctx = canvas1.getContext('2d');

		div = document.createElement('div')
		div.innerHTML = '';
		div.className = 'div_day_info'
		div.id = 'div_day_info';
		superDiv.appendChild(div);

		/*
		Global._canvas2W = 100;
		Global._canvas2H = 200;

		let canvas2 = document.createElement('canvas');
		canvas2.id = 'canvas2';
		canvas2.width = Global._canvas2W;
		canvas2.height = Global._canvas2H;
		canvas2.className = 'canvas2'
		div.appendChild(canvas2);

		Global._ctx2 = canvas2.getContext('2d');
		*/
		//------------------
		div = document.createElement('div')
		div.innerHTML = '';
		div.className = 'div_log'
		div.id = 'div_log';
		superDiv.appendChild(div);

		Global.setZarazKoef()


	}


}

function log(s){
	console.log(s);
}