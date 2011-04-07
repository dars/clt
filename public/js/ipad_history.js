Ext.regModel('History',{
	fields:[
		{name:'id',type:'int'},
		{name:'pname',type:'string'},
		{name:'cname',type:'string'},
		{name:'uname',type:'string'},
		{name:'num',type:'int'},
		{name:'bad_num',type:'int',convert:function(v,r){return r.get('num');}},
		{name:'num2',type:'int'},
		{name:'ok_num',type:'int'},
		{name:'bnum',type:'int'},
		{name:'batch_num',type:'int'},
		{name:'x1',type:'string'},
		{name:'x2',type:'string'},
		{name:'y1',type:'string'},
		{name:'y2',type:'string'},
		{name:'size',type:'string',convert:ipad_size_render},
		{name:'spec1_l',type:'string'},
		{name:'spec1_s',type:'string'},
		{name:'spec2_num',type:'string'},
		{name:'spec2_l',type:'string'},
		{name:'spec2_s',type:'string'},
		{name:'spec3_l',type:'string'},
		{name:'spec3_s',type:'string'},
		{name:'spec4_l',type:'string'},
		{name:'spec4_s',type:'string'},
		{name:'spec5_num',type:'string'},
		{name:'spec5_l',type:'string'},
		{name:'spec5_s',type:'string'},
		{name:'spec6',type:'string'},
		{name:'spec7',type:'string'},
		{name:'spec8',type:'string'},
		{name:'content',type:'string'},
		{name:'modified',type:'string',convert:function(v){return v.substr(0,10)}},
		{name:'spec',type:'string',convert:ipad_spec_render},
		{name:'img',type:'string',convert:ipad_img_render}
	]
});
var history_ds = new Ext.data.JsonStore({
	model:'History',
	proxy:{
		type:'ajax',
		url:base_url+'history',
		actionMethods:'post',
		reader:{
			root:'root'
		}
	},
	sorters:[{
		property:'batch_num',
		direction:'DESC'
	}],
	getGroupString : function(record) {
		return record.get('modified');
	}
});
history_ds.on('load',function(){
});
var card4_tpl = new Ext.XTemplate(
	'<div class="thumb-wrap">',
		'<div class="batch_id">{batch_num}</div>',
		'<div class="orders">',
			'<span class="pname">{pname}</span>',
			'<span class="cname">{cname}</span>',
			'<div class="content">{content}</div>',
		'</div>',
		'<div class="size">{size}</div>',
		'<div class="spec">{spec}</div>',
		'<div class="nums">',
			'<div class="vnum num">{num}</div>',
			'<div class="vnum bad_num">{bnum}</div>',
		'</div>',
	'</div>');
var card4 = new Ext.List({
	id:'history_list',
	itemTpl: card4_tpl,
	store: history_ds,
	grouped:true,
	loadingText:'讀取中...',
	emptyText:'尚無已完成的批號'
});
card4.on('itemTap',function(obj,index){
	history_form.loadRecord(obj.getStore().getAt(index));
	history_form.getComponent('block4').getComponent('bad_num').maxValue = obj.getStore().getAt(index).get('bad_num');
	if(obj.getStore().getAt(index).get('img') !== ''){
		history_form.getComponent('block4').getComponent('img').value = obj.getStore().getAt(index).get('img');
	}
	history_form.show();
});
var history_form = new Ext.form.FormPanel({
	scroll:'vertical',
	url:base_url+'history/save',
	standardSubmit:false,
	autoRender:true,
	floating:true,
	modal:true,
	centered:true,
	height:650,
	width:550,
	items:[{
		id:'block4',
		xtype:'fieldset',
		title:'新增破片資料',
		instructions:'可設定破片數量或是刪除此批號',
		defaults:{
			disabledCls:'',
			disabled:true
		},
		items:[{
			xtype:'textfield',
			name:'pname',
			label:'產品名稱'
		},{
			xtype:'textfield',
			name:'cname',
			label:'客戶名稱'
		},{
			xtype:'displayfield',
			name:'size',
			label:'尺寸',
			style:'height:70px;'
		},{
			xtype:'textfield',
			label:'加工細項',
			name:'spec'
		},{
			xtype:'spinnerfield',
			label:'設定破片數量',
			id:'bad_num',
			name:'bad_num',
			minValue:1,
			cycle:true,
			disabled:false
		},{
			label:'備註',
			name:'content',
			xtype:'textfield'
		},{
			xtype:'hiddenfield',
			name:'id',
			id:'id',
			disabled:false
		},{
			xtype:'hiddenfield',
			name:'batch_id',
			id:'batch_id',
			disabled:false
		},{
			xtype:'displayfield',
			label:'圖片',
			id:'img',
			name:'img',
			value:'',
			autoCapitalize:false
		}]
	}],
	dockedItems:[{
		xtype:'toolbar',
		dock:'bottom',
		items:[{
			text:'送出',
			ui:'confirm',
			handler:function(){
				history_form.submit({
					url:base_url+'history/save',
					success:function(){
						history_form.hide();
						history_ds.load();
						bad_ds.load();
						pending_ds.load();
						batch_ds.load();
					},
					failure:function(){
						Ext.Msg.alert('訊息','資料送出異常');
					}
				});
			}
		},{
			text:'刪除',
			ui:'decline',
			handler:function(){
				Ext.Ajax.request({
					url:base_url+'history/destory',
					method:'post',
					params:{
						'foo[]':history_form.getComponent('block4').getComponent('id').value
					},
					success:function(res){
						//Ext.Msg.alert('訊息','資料已刪除');
						history_ds.load();
						history_form.hide();
					}
				});
			}
		},{xtype:'spacer'},{
			text:'取消',
			handler:function(){
				history_form.hide();
			}
		}]
	}]
});
card4.on('render',function(){
	history_ds.load();
});
var hsearch_field = new Ext.form.Search();
var card4_panel = new Ext.Panel({
	modal:true,
	layout:'fit',
	dockedItems:[{
		title:'歷史批號記錄',
		xtype:'toolbar',
		dock:'top',
		ui:'light',
		defaults:{
			iconMask:true,
			ui:'plain'
		},
		layout:{
			pack:'right'
		},
		items:[{
			ui:'round',
			text:'重新整理',
			handler:function(){
				history_ds.load();
			}
		},{xtype:'spacer'},hsearch_field,{
			iconCls:'search',
			handler:function(){
				var keyword = hsearch_field.getValue();
				history_ds.load({params:{'keyword':keyword}});
			}
		}]
	}],
	items:[card4]
});