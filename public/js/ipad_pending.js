Ext.regModel('Order',{
	fields:[
		{name:'id',type:'int'},
		{name:'pname',type:'string'},
		{name:'cname',type:'string'},
		{name:'uname',type:'string'},
		{name:'num',type:'int'},
		{name:'num2',type:'int'},
		{name:'ok_num',type:'int'},
		{name:'bad_num',type:'int'},
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
		{name:'content',type:'string'},
		{name:'spec',type:'string',convert:ipad_spec_render},
		{name:'img',type:'string',convert:ipad_img_render}
	]
});
var pending_ds = new Ext.data.JsonStore({
	model:'Order',
	proxy:{
		type:'ajax',
		url:'pending',
		actionMethods:'post',
		reader:{
			totalProperty:'totalProperty',
			root:'root'
		}
	},
	sorters: 'pname',
	getGroupString : function(record) {
		return record.get('pname');
	}
});
pending_ds.on('load',function(){
	task_a.delay(100);
});
var card1_tpl = new Ext.XTemplate(
	'<div class="thumb-wrap">',
		'<div class="orders">',
			'<span class="pname">{pname}</span>',
			'<span class="cname">{cname}</span>',
			'<div class="content">{content}</div>',
		'</div>',
		'<div class="size">{size}</div>',
		'<div class="spec">{spec}</div>',
		'<div class="nums">',
			'<div class="vnum num">{num}</div>',
			'<div class="vnum num2">{num2}',
			'<tpl if="batch_num &gt; 0"><span class="batch_num">/{batch_num}</span></tpl>',
			'</div>',
			'<div class="vnum ok_num">{ok_num}</div>',
			'<div class="vnum bad_num">{bad_num}</div>',
		'</div>',
		'<div style="clear:both"></div>',
	'</div>');

var card1 = new Ext.List({
	indexBar: new Ext.IndexBar({
		overlay:true,
		alphabet:true,
		dock:'right',
		listPrefix:'#',
		letters:['1','2','3','4','5','6','7','8','9']
	}),
	id:'pending_list',
	centered:true,
	itemTpl: card1_tpl,
	store: pending_ds,
	grouped:true,
	loadingText:'讀取中...',
	emptyText:'尚無需處理的訂單'
});
card1.on('itemTap',function(obj,index){
	pending_form.loadRecord(obj.getStore().getAt(index));
	pending_form.getComponent('block1').getComponent('num').setValue(obj.getStore().getAt(index).get('num2')-obj.getStore().getAt(index).get('batch_num'));
	pending_form.getComponent('block1').getComponent('num').maxValue = (obj.getStore().getAt(index).get('num2')-obj.getStore().getAt(index).get('batch_num'));
	if(obj.getStore().getAt(index).get('img') !== ''){
		pending_form.getComponent('block1').getComponent('img').value = obj.getStore().getAt(index).get('img');
	}
	pending_form.show();
});
var pending_form = new Ext.form.FormPanel({
	scroll:'vertical',
	url:'pending/save',
	standardSubmit:false,
	autoRender:true,
	floating:true,
	modal:true,
	centered:true,
	height:650,
	width:550,
	items:[{
		id:'block1',
		xtype:'fieldset',
		title:'設定送出數量',
		instructions:'可以點選 + - 按鈕做設定,也可以直接編輯數量',
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
			label:'數量',
			id:'num',
			name:'num',
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
				pending_form.submit({
					url:'pending/save',
					success:function(){
						pending_form.hide();
						pending_ds.load();
						batch_load();
					},
					failure:function(){
						Ext.Msg.alert('訊息','資料送出異常');
					}
				});
			}
		},{xtype:'spacer'},{
			text:'取消',
			handler:function(){
				pending_form.hide();
			}
		}]
	}]
});
card1.on('render',function(){
	pending_ds.load();
});
var search_field = new Ext.form.Search();
var card1_panel = new Ext.Panel({
	layout:'fit',
	dockedItems:[{
		title:'未處理訂單',
		xtype:'toolbar',
		dock:'top',
		ui:'light',
		defaults:{
			iconMask:true,
			ui:'plain'
		},
		layout:{
			pack:'left'
		},
		items:[{
			ui:'round',
			text:'重新整理',
			handler:function(){
				pending_ds.load();
			}
		},{xtype:'spacer'},search_field,{
			iconCls:'search',
			handler:function(){
				var keyword = search_field.getValue();
				pending_ds.load({params:{'keyword':keyword}});
			}
		}]
	}],
	items:[card1]
});