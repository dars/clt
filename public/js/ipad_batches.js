Ext.regModel('Batch',{
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
var batch_ds = new Ext.data.JsonStore({
	model:'Batch',
	proxy:{
		type:'ajax',
		url:base_url+'batches',
		reader:{
			root:'root'
		}
	},
	sorters:[{
		property:'pname',
		direction:'ASC'
	},{
		property:'cname',
		direction:'ASC'
	}],
	getGroupString : function(record) {
		return record.get('pname');
	}
});
batch_ds.load();
batch_ds.on('load',function(){
});
var card2_tpl = new Ext.XTemplate(
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
		'</div>',
	'</div>');
var card2 = new Ext.List({
	id:'batch_list',
	itemTpl: card2_tpl,
	store: batch_ds,
	grouped:true,
	loadingText:'讀取中...',
	emptyText:'尚無需設定的批號記錄'
});

card2.on('itemTap',function(obj,index){
	batches_form.loadRecord(obj.getStore().getAt(index));
	batches_form.getComponent('block2').getComponent('num').setValue(obj.getStore().getAt(index).get('num2')-obj.getStore().getAt(index).get('batch_num'));
	if(obj.getStore().getAt(index).get('img') !== ''){
		batches_form.getComponent('block2').getComponent('img').value = obj.getStore().getAt(index).get('img');
	}
	batches_form.show();
});
var batches_form = new Ext.form.FormPanel({
	scroll:'vertical',
	standardSubmit:false,
	autoRender:true,
	floating:true,
	modal:true,
	centered:true,
	height:650,
	width:550,
	items:[{
		id:'block2',
		xtype:'fieldset',
		title:'確認訂單批號資訊',
		instructions:'僅可確認相關資訊並不可修改',
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
			name:'num'
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
			text:'取消',
			handler:function(){
				batches_form.hide();
			}
		}]
	}]
});

var card2_panel = new Ext.Panel({
	modal:true,
	layout:'fit',
	dockedItems:[{
		title:'批號清單',
    	xtype:'toolbar',
    	dock:'top',
    	ui:'light',
    	layout:{
    		pack:'left'
    	},
    	items:[{
			ui:'round',
			text:'重新整理',
			handler:function(){
				batch_ds.load();
			}
		},{xtype:'spacer'},{
			text:'刪除',
			ui:'decline',
			handler:function(){
				var tmp = card2.getSelectedRecords();
				if(tmp.length>0){
					var tmp_id = tmp[0].get('id');
					Ext.Ajax.request({
						url:base_url+'batches/destory',
						params:'foo[]='+tmp_id,
						success:function(res){
							Ext.Msg.alert('資料已刪除');
							batch_ds.load();
							pending_ds.load();
							history_ds.load();
						}
					});
				}
			}
		},{
    		text:'確認送出',
    		ui:'forward',
    		handler:function(){
    			Ext.Msg.confirm('確認','確定送出批號？',function(btn){
    				if(btn === 'yes'){
    					Ext.Ajax.request({
							url:base_url+'batches/save',
							success:function(res){
								Ext.Msg.alert('資料已送出');
								batch_ds.load();
								pending_ds.load();
								history_ds.load();
							}
						});
    				}
    			})
    		}
    	}]
    }],
	items:[card2]
});
card2.on('itemTap',function(obj,index){

});
card2.on('activate',function(){
	batch_ds.load();
});