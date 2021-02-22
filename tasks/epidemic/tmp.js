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
<span>Маски</span>\
<button id="str_mask_btn0_" class="str_mask_btn" koef="0" onclick="">&#9932;</button>\
<button id="str_mask_btn1_" class="str_mask_btn" koef="1" onclick="">1</button>\
<button id="str_mask_btn2_" class="str_mask_btn" koef="2" onclick="">2</button>\
<button id="str_mask_btn3_" class="str_mask_btn" koef="3" onclick="">3</button>\
<button id="str_mask_btn4_" class="str_mask_btn" koef="4" onclick="">4</button>\
<button id="str_mask_btn5_" class="str_mask_btn" koef="5" onclick="">5</button>\
<br>\
<input type="text" id="str_dist_" value="0" class="str_day">%\
<button class="str_day_plusminus" id="str_dist_minus_" onclick="" pm="minus" >-</button>\
<button class="str_day_plusminus" id="str_dist_plus_" onclick="" pm="plus">+</button>\
<span class="str_prop_name">Дистант</span>\
<br>\
<input type="text" id="str_test_" value="0" class="str_day">%\
<button class="str_day_plusminus" id="str_test_minus_" onclick="" pm="minus" >-</button>\
<button class="str_day_plusminus" id="str_test_plus_" onclick="" pm="plus">+</button>\
<span class="str_prop_name">Тестирование</span>\
';