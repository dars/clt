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