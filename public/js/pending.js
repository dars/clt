var pending_ds = new Ext.data.JsonStore({
	proxy:new Ext.data.HttpProxy({url:base_url+'pending',method:'post'}),
	root:'root',
	ac_num:'ac_num',
	acb_num:'acb_num',
	aco_num:'aco_num',
	fields:[
		{name:'id',type:'int'},
		{name:'pname',type:'string'},
		{name:'cname',type:'string'},
		{name:'uname',type:'string'},
		{name:'unit_id',type:'int'},
		{name:'x1',type:'string'},
		{name:'y1',type:'string'},
		{name:'x2',type:'string'},
		{name:'y2',type:'string'},
		{name:'num',type:'int'},
		{name:'bad_num',type:'int'},
		{name:'ok_num',type:'int'},
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
		{name:'content',type:'string'},
		{name:'created',type:'string'},
		{name:'modified',type:'string'},
		{name:'img',type:'string'},
		{name:'spec6',type:'string'},
		{name:'spec7',type:'string'},
		{name:'spec8',type:'string'}
	]
});
pending_ds.on('load',function(){
	                   
});

var pending_cm = new Ext.grid.ColumnModel([
	new Ext.grid.RowNumberer(),
	{header:'訂單編號',dataIndex:'id',hidden:true,id:'id'},
	{header:'產品',dataIndex:'pname',width:65,sortable:true},
	{header:'客戶',dataIndex:'cname',id:'cname',width:65,sortable:true},
	{header:'尺寸',dataIndex:'x1',renderer:size_render},
	{header:'訂單數量',dataIndex:'num',align:'right',width:70,sortable:true},
	{header:'剩餘數量',dataIndex:'num',align:'right',width:70,renderer:last_render,sortable:true},
	{header:'完成數量',dataIndex:'ok_num',align:'right',width:70,sortable:true},	
	{header:'破片數量',dataIndex:'bad_num',align:'right',width:70,renderer:bad_render,sortable:true},
	{header:'加工細項',dataIndex:'spec1_l',renderer:spec_render},
	{header:'備註',dataIndex:'content'}
]);
var pending = new Ext.grid.GridPanel({
	id:'pending_grid',
	store:pending_ds,
	cm:pending_cm,
	title:'未處理訂單',
	frame:true,
	loadMask:true,
	autoExpandColumn:'cname',
	enableHdMenu:false,
	stripeRows:true,
	columnLines:true,
	viewConfig:{
		forceFit:true,
		getRowClass:function(record,rowIndex,p,ds){
			if(record.data.bad_num>0){
				return 'bad_row';
			}
		}
	},
	tbar:new Ext.Toolbar({
		buttonAlign:'right',
		items:[{xtype:'tbspacer'},{
			xtype:'textfield',
			name:'pending_filter',
			id:'pending_filter'
		},{
			xtype:'button',
			text:'搜尋',
			handler:function(){
				var keyword = Ext.get('pending_filter').getValue();
				pending_ds.load({params:{keyword:keyword}});
			}		
		}]
	}),
	bbar:new Ext.Toolbar([{
		id:'pending_total',
		iconCls:'ss_sprite ss_tag_green ',
		text:'總數量:'
	},'-',{
		text:'重新整理',
		iconCls:'ss_sprite ss_arrow_refresh',
		tooltip:'重新讀取最新資料',
		handler:function(){
			pending_ds.reload();
		}
	},'-',{
		text:'匯出Excel',
		iconCls:'ss_sprite ss_page_white_excel ',
		tooltip:'將所有位處理訂單資料匯出成Excel',
		handler:function(){
			Ext.Ajax.request({
				url:base_url+'pending/xls',
				success:function(res){
					Ext.Msg.show({
						title:'下載',
						msg:'請點選<a href=\''+res.responseText+'\' target=\'_blank\' class=\'xls\' \>此處下載Excel</a>',
						buttons:Ext.Msg.CANCEL,
						width:350
					});
					//pending_ds.reload();
				}
			});
		}
	}])
});
pending.on('render',function(){
	pending_ds.load();
});
pending.on('rowclick',function(grid,rowIndex){show_pending_form(grid,rowIndex);});

var show_pending_form = function(grid,rowIndex){
	var record = pending.getStore().getAt(rowIndex);
	max=record.data.num+record.data.bad_num-record.data.ok_num;
	pending_form.getForm().loadRecord(record);
	pending_form.getForm().findField('spec1').setValue(spec1_render(record,record,record));
	pending_form.getForm().findField('spec2').setValue(spec2_render(record,record,record));
	pending_form.getForm().findField('spec3').setValue(spec3_render(record,record,record));
	pending_form.getForm().findField('spec4').setValue(spec4_render(record,record,record));
	pending_form.getForm().findField('spec5').setValue(spec5_render(record,record,record));
	pending_form.getForm().findField('num').setMaxValue(max);
	pending_form.getForm().findField('num').setMinValue(1);
	pending_form.getForm().findField('num').setValue(max);
	pending_form.getForm().findField('num').focus(true,500);
	pending_form.getForm().findField('img_name').setValue(img_render(record.data.img));
	pending_win.show();
};