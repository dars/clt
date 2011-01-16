var tp;
var refresh_time;
var keyn=0;
Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.override(Ext.data.Store, {
		storeOptions : function(o) {
			o = Ext.apply({}, o);
			if(o.params){
				o.params = Ext.apply({}, o.params);
			}
			delete o.callback;
			delete o.scope;
			this.lastOptions = o;
		}
	});
	login_win.show();
	//order_fwin.show();
	var keyNav = new Ext.KeyNav(Ext.get('password'),{
		enter:function(){
			validate_login();
		}
	});
	tp = new Ext.TabPanel({
		id:'tp',
		region:'center',
		items:[
			order,
			pending,
			batches,
			bad,
			his,
			prod_grid,
			cust_grid,
			users/*,
			property*/
		]
	});
	var vp = new Ext.Viewport({
		layout:'border',
		items:[{
			region:'north',
			html:"<img src='public/images/logo.png'>",
			height:60
		},tp]
	});
	/*
	Ext.getBody().on('keypress',function(e){
		console.log(e.getKey());
		if(e.getKey() == 110){
			if(keyn == 1){
				add_order();
			}else{
				keyn = 1;
				setTimeout(function(){
					keyn=0;
				},1500);
			}
		}
	});
	*/
	
	var new_order = new Ext.KeyMap(document,{
		key:Ext.EventObject.SPACE,
		fn:function(){
			//console.log(123);
			if(keyn == 1){
				add_order();
			}else{
				keyn = 1;
				setTimeout(function(){
					keyn=0;
				},1500);
			}
		}
	});
	new Ext.KeyNav(document, {
		enter: function(e){
			var target = e.getTarget();
			if(target.form){
				e.stopEvent();
				var els = target.form.elements, len = target.form.length;
				for(var p = 0; p < len; p++){
					if(els[p] == target){
						break;
					}
				}
				for(var i = 1; i < len; i++){
					var el = els[++p % len];
					if(el.style.display != 'none' && el.style.visibility != 'hidden'
							&& !el.disabled && !el.getAttribute('readonly')
							&& !/button|submit|reset|hidden/i.test(el.type)){
						el.focus();
						break;
					}
				}
			}
		}
	});
	Ext.ux.Lightbox.register('a[rel^=lightbox]');
});
function show_Growl(type,title,string){
	if(type == 1){
		Ext.ux.Growl.notify({
			title: title, 
			message: string,
			iconCls:'x-growl-notice',
			alignment: "tr-tr",
			offset: [-10, 10]
		});
	}else{
		Ext.ux.Growl.notify({
			title: title, 
			message: string,
			iconCls:'x-growl-error',
			alignment: "tr-tr",
			offset: [-10, 10]
		});
	}
}
var last_bad_id;
var last_order_id;
var setTabs = function(obj){
	if(obj.permission1 != 1){
		tp.remove('order_grid',true);
	}
	if(obj.permission2 != 1){
		tp.remove('pending_grid',true);
	}else{
		order_sensor();
	}
	if(obj.permission3 != 1){
		tp.remove('batches_grid',true);
	}
	if(obj.permission4 != 1){
		tp.remove('bad_grid',true);
	}else{
		bad_sensor();
	}
	if(obj.permission5 != 1){
		tp.remove('his_grid',true);
	}
	if(obj.permission6 != 1){
		tp.remove('prod_grid',true);
	}
	if(obj.permission7 != 1){
		tp.remove('cust_grid',true);
	}
	if(obj.permission8 != 1){
		tp.remove('users_grid',true);
	}
	if(obj.permission9 != 1){
		tp.remove('prop_grid',true);
	}
	tp.activate(0);
};

var img_render = function(v){
	return "<a href=\"public/files/images/"+v+"\" rel=\"lightbox\">"+v+"</a>";
};
var order_sensor = function(){
	var task = {
		run:function(){
			Ext.Ajax.request({
				method:'post',
				url:'orders/order_sensor',
				success:function(res){
					if(res.responseText>last_order_id){
						if(typeof last_order_id == 'undefined'){
							last_order_id = res.responseText;
						}
						orderRunner.stop(task);
						sensor_alert('提醒','有新訂單，請重新整理頁面');
					}
				}
			});
		},interval:refresh_time
	}
	var orderRunner = new Ext.util.TaskRunner();
	orderRunner.start(task);
};
var bad_sensor = function(){
	var task = {
		run:function(){
			Ext.Ajax.request({
				method:'post',
				url:'bad/bad_sensor',
				success:function(res){
					if(typeof last_bad_id == 'undefined'){
						last_bad_id = res.responseText;
					}
					if(res.responseText>last_bad_id){
						badRunner.stop(task);
						sensor_alert('提醒','有破片資料新增，請至破片清單確認');
					}
				}
			});
		},interval:refresh_time
	}
	var badRunner = new Ext.util.TaskRunner();
	badRunner.start(task);
};

var sensor_alert = function(title,content){
	Ext.ux.Growl.notify({
		title: title, 
		message: content,
		iconCls: "x-growl-notice",
		alignment: "c-c",
		pin:true
	});
};