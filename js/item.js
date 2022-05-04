//#item_

function delete_item(array, verified){
	var id = [];
	$.each(array, function(k, v){
		id.push(v.replace(/[^0-9]/g, ''));
	});
	
	if(!id.length) return false;
	
	if(!confirm(P8LANG.confirm_to_delete)) return;
	
	//var delete_hook = confirm(P8LANG.retain_hook_module_data) ? 0 : 1;
	
	$.ajax({
		url: $this_router +'-delete',
		type: 'POST',
		dataType: 'json',
		data: ajax_parameters({id: id, verified: verified === undefined ? 1 : verified, delete_hook: 0}),
		cache: false,
		beforeSend: function(){
			ajaxing({});
		},
		success: function(json){
			ajaxing({action: 'hide'});
			
			for(var i in json){
				$('#delete_'+ json[i]).parent().parent().remove();
			}
		}
	});
	
	return false;
}

function verify_item(array, value, verified){
	verify_item_id = [];
	$.each(array, function(k, v){
		verify_item_id.push(v.replace(/[^0-9]/g, ''));
	});
	
	if(!verify_item_id.length) return false;
	verify_dialog.show();
	
}

function list_order(array, time, verified){
	if(!verified) return;
	
	up_down_id = [];
	$.each(array, function(k, v){
		up_down_id.push(v.replace(/[^0-9]/g, ''));
	});
	
	if(!up_down_id.length) return false;
	
	up_down_dialog.show();
}

function move_item(array){
	move_item_id = [];
	$.each(array, function(k, v){
		move_item_id.push(v.replace(/[^0-9]/g, ''));
	});
	
	if(!move_item_id.length) return false;
	
	dialog.show();
}

function push_item(id, cid){
	
	$.ajax({
		url: $this_router +'-cluster_push',
		type: 'POST',
		dataType: 'json',
		data: ajax_parameters({id: id, cid: cid}),
		cache: false,
		beforeSend: function(){
			ajaxing({});
		},
		success: function(json){
			ajaxing({action: 'hide'});
			
			alert(lang_array(P8LANG.cms.item.cluster_pushed, [json.length]));
		}
	});
}

function collect(id){
	id = id.replace(/[^0-9]/g, '')*1;
	if( id < 0) return false;
	$.ajax({
		url: P8CONFIG['U_controller'] + "/cms/item-favory",
		type: 'POST',
		data: ajax_parameters({request_type: 'add', id: id}),
		cache: false,
		beforeSend: function(){
			ajaxing({});
		},
		success: function(data){
			if(data == 0){
				ajaxing({text: P8LANG.cms.item.collected, action: 'hide'});
			}else if(data == 1){
				ajaxing({text: P8LANG.cms.item.collect_success, action: 'hide'});
			}else{
				ajaxing({text: P8LANG.cms.item.collect_fail, action: 'hide'});
			}
		}
	});
}

function item_operation(ele){
	var menu = $(
	['<ul style="position: absolute; border: 2px solid #09C; background-color: #ffffff; padding: 5px;">',
		'<li><a href="'+ P8CONFIG.U_controller+ '/'+ SYSTEM +'/item-add?model='+ model +'&cid='+ item_cid +'" target="_blank">'+ P8LANG.add +'</a></li>',
		'<li><a href="'+ P8CONFIG.U_controller+ '/'+ SYSTEM +'/item-update?verified='+ verified +'&id='+ item_id +'&model='+ model +'" target="_blank">'+ P8LANG.edit +'</a></li>',
		'<li><a href="'+ P8CONFIG.U_controller+ '/'+ SYSTEM +'/item-delete?verified='+ verified +'&id='+ item_id +'&model='+ model +'" onclick="return confirm(\''+ P8LANG['delete'] +'???\');" target="_blank">'+ P8LANG['delete'] +'</a></li>',
		'<li><a router="/'+ SYSTEM +'/item-list?verified='+ verified +'&id='+ item_id +'" target="_blank">'+ P8LANG.cms.item.more_operation +'</a></li>',
	'</ul>'].join('')
	);
	
	$(ele).click(function(){
		var offset = $(this).offset();
		menu.toggle().css({
			left: offset.left +'px',
			top: ($(this).height() + offset.top) +'px'
		});
		
		if(!$(ele).data('shown')){
			get_admin_controller(function(c){
				menu.find("li a[router^='/']").each(function(){
					this.href = c + $(this).attr('router');
				});
			});
		}else{
			$(ele).data('shown', 1);
		}
	});
	
	$(document.body).append(menu);
	menu.hide();
}



function Comment(options){

this.iid = options.iid;
this.url = options.url;
this.callback = options.callback;
this.view_page = options.view_page || false;
this.quotes = {};
this.items = {};
var _this = this;

this.digg = function(id, obj){
	var cookie = get_cookie('digged_'+ SYSTEM +'_comment') || ',';
	if(cookie.indexOf(','+ id +',') != -1){
		alert(P8LANG.cms.comment.digged);
		return;
	}
	
	cookie += id +',';
	set_cookie('digged_'+ SYSTEM +'_comment', cookie);
	$.ajax({
		url: this.url,
		type: 'post',
		data: {action: 'digg', id: id},
		success: function(status){
			$(obj).html(
				$(obj).html().replace(/(\d+)/g, function(s, m){return parseInt(m)+1;})
			);
		}
	});
};

this.item = function(json, copy){
	
	var quotes = json.quote.split(',').reverse(),
		id = json.id,
		repeat = false;
	
	for(var i in this.items){
		if(
			this.items[id] && quotes.length > 1 &&
			this.items[i].quote.indexOf(this.items[id].quote +',') == 0 &&
			this.items[i].quote != this.items[id].quote
		){
			repeat = true;
			break;
		}
	}
	
	var repeat_hide = $(repeat ? this._quote(quotes.slice(quotes.length -1), 1, true) :  '<div></div>');
	repeat_hide.find('.repeat').
		click(function(){
			quote.show();
			repeat_hide.hide();
		});
	
	var quote = $(this._quote(quotes, quotes.length));
	var wrapper = $('<div class="quote_wrapper"></div>').
		append(repeat_hide).
		append(quote[repeat ? 'hide' : 'show']());
	
	copy.attr('id', 'comment_'+ json.id).
		addClass('comment_item').
		find('.author').html(
			copy.find('.author').html().replace('__author__', json.username)
		);
	
	copy.find('.content').
		append(wrapper).
		append($('<div class="content">'+ nl2br(json.content) +'</div>'));
	
	copy.find('.date').html(
		copy.find('.date').html().replace('__date__', date('Y-m-d H:i:s', json.timestamp))
	);
	
	copy.find('.button_bar').html(
		copy.find('.button_bar').html().replace(/__id__/g, json.id).
		replace('__digg__', json.digg)
	);
	
	return copy;
};

this._quote = function(quote_path, floor, repeat){
	var id = quote_path.shift();
	if(!id) return '<div></div>';
	
	var quote_item = this.quotes[id];
	
	var quote = [
		'<div class="quote">',
			this._quote(quote_path, floor -1),
			'<div class="postby">',
				'<span class="floor">', floor, '</span>',
				'<span class="author">',
					(quote_item ? lang_array(P8LANG[SYSTEM].comment.quote_who, [quote_item.username]) : ''),
				'</span>',
			'</div>',
			'<div class="content">',
				nl2br(quote_item ? quote_item.content : P8LANG[SYSTEM].comment.deleted),
			'</div>',
		'</div>'].join('');
	
	if(repeat){
		quote = ['<div class="quote">', quote,
				'<div class="repeat" style="cursor: pointer;">',
					P8LANG[SYSTEM].comment.repeat,
				'</div>',
			'</div>'].join('');
	}
	
	return quote;
};

this._callback = function(json){
	
	ajaxing({action: 'hide'});
	
	_this.quotes = json.quotes;
	_this.items = json.items;
	
	_this.callback(json);
};

this.request = function(page){
	page = page === undefined ? 1 : intval(page);
	page = Math.max(page, 1);
	
	ajaxing({});
	
	$.getJSON(
		this.url +'?iid='+ this.iid +'&page='+ page +'&_ajax_request=1'+ (this.view_page ? '&view_page=1' : '') +'&callback=?',
		this._callback);
};

}
