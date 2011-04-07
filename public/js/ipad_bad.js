Ext.regModel('Bad',{
	fields:[
		{name:'id',type:'int'},
		{name:'pname',type:'string'},
		{name:'cname',type:'string'},
		{name:'uname',type:'string'},
		{name:'num',type:'int'},
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
		{name:'spec',type:'string',convert:ipad_spec_render},
		{name:'img',type:'string',convert:ipad_img_render},
		{name:'bdate',type:'string',convert:function(v){return v.substr(0,10)}}
	]
});
var bad_ds = new Ext.data.JsonStore({
	model:'Bad',
	proxy:{
		type:'ajax',
		url:base_url+'bad',
		reader:{
			root:'root'
		}
	},
	sorters:[{
		property:'bdate',
		direction:'DESC'
	},{
		property:'pname',
		direction:'ASC'
	}],
	getGroupString : function(record) {
		return record.get('bdate');
	}
});
bad_ds.load();
bad_ds.on('load',function(){
});
var card3_tpl = new Ext.XTemplate(
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
		'</div>',
	'</div>');
var card3 = new Ext.List({
	id:'bad_list',
	itemTpl: card3_tpl,
	store: bad_ds,
	grouped:true,
	loadingText:'讀取中...',
	emptyText:'尚無破片記錄'
});
var card3_panel = new Ext.Panel({
	modal:true,
	layout:'fit',
	dockedItems:[{
		title:'破片清單',
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
				bad_ds.load();
			}
		}]
    }],
	items:[card3]
});
card3.on('itemTap',function(obj,index){

});
card3.on('activate',function(){
	bad_ds.load();
});