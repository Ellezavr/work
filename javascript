var w;//открыть в маленьком новом окне отчет при клике на дату
function win_open(link) {	                 
	w = window.open(link,"","width=1000,height=700,scrollbars=yes");                 
	WaitForClose();
}

//аналог пхп-шной функции
function StrReplace(haystack, needle, replacement) {
	var temp = haystack.split(needle);
	return temp.join(replacement);
}

//перегрузить страницу при закрытии попап окна
function WaitForClose()	{              
	if(!w.closed){                  
		setTimeout("WaitForClose()", 300);
	}else{                              
		window.location.reload();                 
	}
}

$(document).ready( function(){

	$(".tooltip_block").hide();

	var width = $("#divTable").width();
	window_width = 950;
	if(width <= window_width){
		$("#divHeader, #divTable, #divFooter").css({"width": width+"px"});
	}else{
		$("#divHeader, #divTable, #divFooter").css({"width": window_width+"px"});
		$("#divFooter").css({"overflowX" : "scroll"});
	}

	$("input[type=text]").keyup(function(){
		var sum_number = $(this).val();
		sum_number = StrReplace(sum_number, ",",".");
		$(this).val(sum_number);
	});

	var height = $("#fin_numbers_table").height();
	$("#firstCol, #divTable, #total").css("height", height);

	$(".rent_all tr td").click(function(){
		$(".rent_all tr td").css("border", "1px dotted #FB9D49")
		$(this).css("border", "1px #A70202 solid");
	});

	$(".service_panel, .tooltip_block").draggable();

	$("#fin_numbers_table td").hover(function(){
		var tr = $(this).parent();
		var tr_num = tr.index();
		$("#fin_itog tr").eq(tr_num).css("color", "red");
		$("#fin_state tr").eq(tr_num).css("color", "red");
	}, function(){
		$("#fin_state tr, #fin_itog tr").css("color", "black");    
	}); 

	$(".click_tooltip_new").hover(function(){
		$(this).css("opacity", "0.5");
	}, function(){
		$(this).css("opacity", "0");    
	});		
	
	
	$(".scroll").hover(function(){
		$(this).css("opacity", "0.85");
	}, function(){
		$(this).css("opacity", "0");
	});
	
	
	$(".scrollRight").click(function(){
		left = $('#divHeader').scrollLeft();
		$("#divTable,#divHeader,#divFooter").scrollLeft(left + 948);
	});
	
	$(".scrollLeft").click(function(){
		left = $('#divHeader').scrollLeft();
		$("#divTable,#divHeader,#divFooter").scrollLeft(left - 948);
	});

});

//переключалка тумблера вкл/выкл отчет финотдела
function tumbler(mode, elem){
	var mode1;
	var mode2;
	if(mode == 'on'){
		mode1 = 'off';
		mode2 = 'false';
	}else{
		mode1 = 'on';
		mode2 = 'true';
	}

	var stuff_id = $("#stuff_id").attr("stuff_id");
	var date_z = $("#stuff_id").attr("date_z");
	var obj = $(elem);
	$.ajax({
		url: "index.php?action=dir_z_cost",
		type: "POST", 
		data: "tumbler=yes&open="+mode2+"&dt="+date_z+"&dir="+stuff_id,
		success: function(){
			obj.children().attr("src", "img/"+mode1+".png");
			obj.attr("onclick", "tumbler('"+mode1+"', this)");
		}
	});		
}

//переключалка тумблера вкл/выкл отчет падасенка
function tumbler2(mode, elem){
	var mode1;
	var mode2;
	if(mode == 'on_p'){
		mode1 = 'off_p';
		mode2 = 'false';
	}else{
		mode1 = 'on_p';
		mode2 = 'true';
	}

	var stuff_id = $("#stuff_id").attr("stuff_id");
	var date_z = $("#stuff_id").attr("date_z");
	var obj = $(elem);
	$.ajax({
		url: "index.php?action=dir_z_cost",
		type: "POST", 
		data: "tumbler2=yes&open="+mode2+"&dt="+date_z+"&dir="+stuff_id,
		success: function(){ 
			obj.children().attr("src", "img/"+mode1+".gif");
			obj.attr("onclick", "tumbler2('"+mode1+"', this)");
		}
	});		
}

//по даблклику удаляет контрольную красноту
function del_redness(cash, cost, elem){
	if(confirm("Удалить красноту по "+cash)){
		var stuff_id = $("#stuff_id").attr("stuff_id");
		var date_z = $("#stuff_id").attr("date_z");

		$.ajax({
			url: "index.php?action=dir_z_cost",
			type: "POST", 
			data: "del_redness=yes&cost="+cost+"&date_z="+date_z+"&cash="+cash+"&dir="+stuff_id,
			success: function(){
				$(elem).remove();
			}
		});
	}
}

//заливки во всех полях
function click_zalivka(color){
	var td = $("#fin_numbers_table td[style*=solid]");
	var td_spec = $("#table_prixod td[style*=solid], #table_podotchet td[style*=solid], #table_dop td[style*=solid]");
	var cash = td.attr("cash");
	var cost = td.attr("cost");
	var date_z = td.attr("date");
	var color_length = color.length;

	if(td_spec.size() == 1){/*заливка для таблицы прихода или подотчета*/
		var row_name = td_spec.attr("row");
		if(row_name.length == 0){/*пасхальное яйцо*/
			window.open("index.php?action=egg","","width=720,height=570,scrollbars=yes");					
		}else{
			var stuff_id = $("#stuff_id").attr("stuff_id");
			date_z = $("#stuff_id").attr("date_z");

			$.ajax({
				url: "index.php?action=dir_z_cost",
				type: "POST", 
				data: "zakivka_prixod=yes&row="+row_name+"&date_z="+date_z+"&color="+color+"&dir="+stuff_id,
				success: function(data){
					if(data.length == 0){
						if(color_length == 0){
							td_spec.removeAttr("bgcolor");
						}else{
							td_spec.attr("bgcolor", "#"+color);
						}
					}else{
						alert(data);
					}
				}
			});
		}

	} else {/*заливка для таблицы затрат*/

		$.ajax({
			url: "index.php?action=dir_z_cost",
			type: "POST", 
			data: "zakivka=yes&cash="+cash+"&cost="+cost+"&date_z="+date_z+"&color="+color,
			success: function(data){
				if(data.length == 0){
					if(color_length == 0){
						td.removeAttr("bgcolor");
					}else{
						td.attr("bgcolor", "#"+color);
					}
				}else{
					alert(data);
				}

			}
		});
	}
}

//залить все розовой заливкой для Иры
function click_zalivka_red(){
	var stuff_id = $("#stuff_id").attr("stuff_id");
	var date_z = $("#stuff_id").attr("date_z");
	$.ajax({
		url: "index.php?action=dir_z_cost",
		type: "POST", 
		data: "all_red=yes&stuff_id="+stuff_id+"&date_z="+date_z,
		success: function(data){
			if(data.length == 0){
				tds = $("#fin_numbers_table td[cost!=22] .desc_num").parent();
				tds.attr("bgcolor", "#FFAFBF");
			}else{
				alert(data);
			}
		}
	});				
}

//удалить все заливки
function click_del_zalivka(){
	var stuff_id = $("#stuff_id").attr("stuff_id");
	var date_z = $("#stuff_id").attr("date_z");
	$.ajax({
		url: "index.php?action=dir_z_cost",
		type: "POST", 
		data: "all_del=yes&stuff_id="+stuff_id+"&date_z="+date_z,
		success: function(data){
			if(data.length == 0){
				$("#fin_numbers_table td[bgcolor!=#D3F3FF]").removeAttr("bgcolor");
			}else{
				alert(data);
			}
		}
	});				
}

//редатирует примечание красным в затратах 
function edit_tooltip(cash, column, id_row){ 
	var td = $("#edit_t_margo_" + cash + "_" + column + "_" + id_row);
	var text_t = td.html();
	if(text_t == "--")text_t = "";
	td.html('<input style="width:250px" type="text" value="' + text_t + '" /><img id="save_t_margo_' + cash + '_' + column + '_' + id_row + '" title="Сохранить" style="width:16px;cursor:pointer" src="img/save.png" />');
	var save = $("#save_t_margo_" + cash + "_" + column + "_" + id_row);
	save.click(function(){
		var newText = $(this).prev().val();
		$.ajax({
			url: "index.php?action=dir_z_cost",
			type: "POST", 
			data: "id_row1="+id_row+"&newText="+newText,
			success: function(data){
				if(newText == "")newText = "--";
				td.html(newText);
			}
		});
	});
}

//редатирует примечание красным в приходной таблице в прочих поступлениях
function edit_cost_tooltip(row, id_row, column){ 
	var td = $("#edit_t_cost_" + row);
	var text_t = td.html();
	if(text_t == "--")text_t = "";
	td.html('<input style="width:250px" type="text" value="' + text_t + '" /><img id="save_t_cost' + row + '" title="Сохранить" style="width:16px;cursor:pointer" src="img/save.png" />');
	var save = $("#save_t_cost" + row);
	save.click(function(){
		var newText = $(this).prev().val();
		$.ajax({
			url: "index.php?action=dir_z_cost",
			type: "POST", 
			data: "cost_t="+row+"&newText="+newText+"&id_row="+id_row+"&column="+column,
			success: function(data){
				if(newText == "")newText = "--";
				td.html(newText);
			}
		});
	});
}

//редактирование цифер в доп полях по даблклику
function edit_dop(id_row){			
	var stuff_id = $("#stuff_id").attr("stuff_id");
	var date_z = $("#stuff_id").attr("date_z");

	var td = $("#edit_dop_" + id_row);
	var text_t = td.html();
	if(text_t == "0.00" || text_t == "")text_t = "";
	td.html('<input style="width:65px" type="text" value="' + text_t + '" /><img id="save_dop_' + id_row + '" title="Сохранить" style="width:16px;cursor:pointer" src="img/save.png" />');

	$('input[type=text]').live('keyup',function(){
		var sum_number = $(this).val();
		sum_number = StrReplace(sum_number, ",",".");
		$(this).val(sum_number);
	});

	var save = $("#save_dop_" + id_row);
	save.click(function(){
		var newText = $(this).prev().val();
		$.ajax({
			url: "index.php?action=dir_z_cost",
			type: "POST", 
			data: "dop_number="+id_row+"&newText="+newText+"&stuff_id="+stuff_id+"&date_z="+date_z,
			success: function(data){					
				if(data.length == 0){
					if(newText == "")newText = "";
					td.html(newText);
				}else{
					alert(data);
				}
			}
		});
	});
}

//добавление/редактирование красных примечаний в таблицах прихода,расхода и доп полей кроме строки прочих поступлений
function edit_other_tooltip(column){			
	var stuff_id = $("#stuff_id").attr("stuff_id");
	var date_z = $("#stuff_id").attr("date_z");

	var td = $("#edit_t_" + column);
	var text_t = td.html();
	if(text_t == "--" || text_t == "")text_t = "";
	td.html('<input style="width:250px" type="text" value="' + text_t + '" /><img id="save_t" title="Сохранить" style="width:16px;cursor:pointer" src="img/save.png" />');
	var save = $("#save_t");
	save.click(function(){
		var newText = $(this).prev().val();
		$.ajax({
			url: "index.php?action=dir_z_cost",
			type: "POST", 
			data: "other_tooltip=yes&column="+column+"&newText="+newText+"&stuff_id="+stuff_id+"&date_z="+date_z,
			success: function(data){
				if(newText == "") {
					newText = "--";
					td.closest('div.tooltip_block').parent().prev().children().attr("src", "img/blank.gif");
				}else{
					td.closest('div.tooltip_block').parent().prev().children().attr("src", "img/red.gif");
				}
				td.html(newText);
			}
		});
	});
}

//открывает примечания
function open_tooltip(cash, column, elem){
	var pos = $(elem).offset();
	var left_pos = pos.left;
	var top_pos = pos.top;
	var target1 = $(".tooltip_" + column + "_" + cash);
	var source1 = target1.parent();

	source1.css({"left": left_pos+5+"px", "top": top_pos+5+"px", "zIndex": "900"});				

	/*jsPlumb.connect({
		source:"source1",
		target:"target1",
		endpoint:"Rectangle"
	});*/

	//var img = $(elem).children().attr('src');

	target1.show();
}

//скрывает примечание, если убрать с него курсор
function close_tooltip(cash, column){
	$(".tooltip_" + column + "_" + cash).hide();
}

//function to support scrolling of title and first column
fnScroll = function(){
	$("#divTable,#divHeader").scrollLeft($("#divFooter").scrollLeft());
	$("#divTable, #firstCol").scrollTop($("#total").scrollTop());
}
