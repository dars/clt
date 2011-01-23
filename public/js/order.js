var order_store = new Ext.data.JsonStore({
	proxy:new Ext.data.HttpProxy({url:base_url+'orders',method:'post'}),
	totalProperty:'totalProperty',
	root:'root',
	fields:[
		{name:'id',type:'int'},
		{name:'pname',type:'string'},
		{name:'cname',type:'string'},
		{name:'uname',type:'string'},
		{name:'x1',type:'string'},
		{name:'y1',type:'string'},
		{name:'x2',type:'string'},
		{name:'y2',type:'string'},
		{name:'num',type:'int'},
		{name:'bad_num',type:'int'},
		{name:'ok_num',type:'int'},
		{name:'content',type:'string'},
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
		{name:'created',type:'string'},
		{name:'modified',type:'string'}
	]
	//remoteSort:true
});
order_store.on('load',function(){
	/*
	if(order_store.data.length>0){
		last_order_id = order_store.getAt(0).data.id;
	}else{
		last_order_id = 0;
	}
	*/
});

var order_sm = new Ext.grid.CheckboxSelectionModel();
var order_cm = new Ext.grid.ColumnModel([
	order_sm,
	new Ext.grid.RowNumberer(),
	{header:'訂單編號',dataIndex:'id',hidden:true,id:'id'},
	{header:'產品',dataIndex:'pname',width:65,sortable:true},
	{header:'客戶',dataIndex:'cname',width:65,sortable:true},
	{header:'X1',dataIndex:'x1',renderer:order_unit_render,align:'right',sortable:true},
	{header:'Y1',dataIndex:'y1',renderer:order_unit_render,align:'right',sortable:true},
	{header:'X2',dataIndex:'x2',renderer:order_unit_render,align:'right',sortable:true},
	{header:'Y2',dataIndex:'y2',renderer:order_unit_render,align:'right',sortable:true},
	{header:'數量',dataIndex:'num',align:'right',width:70,sortable:true},
	{header:'剩餘數量',dataIndex:'ok_num',align:'right',width:70,renderer:last_render,sortable:true},
	{header:'完成數量',dataIndex:'ok_num',align:'right',width:70,sortable:true},
	{header:'破片數量',dataIndex:'bad_num',align:'right',width:70,renderer:bad_render,sortable:true},
	{header:'加工細項',dataIndex:'spec1_l',renderer:spec_render},
	{header:'備註',dataIndex:'content'},
	{header:'建立日期',dataIndex:'created',sortable:true},
	{header:'修改日期',dataIndex:'modified',sortable:true}
]);
order_cm.defaultSortable = true;
var order_status_combo = new Ext.form.ComboBox({
	width:140,
	id:'order_status_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:order_status
	}),
	mode:'local',
	hiddenName:'ostatus',
	displayField:'text',
	valueField:'id',
	editable:false,
	triggerAction:'all',
	value:0
});
order_status_combo.on('select',function(){
	order_store.load({params:{status:this.getValue()}});
});
var order = new Ext.grid.GridPanel({
	id:'order_grid',
	title:'訂單列表',
	frame:true,
	loadMask:true,
	store:order_store,
	cm:order_cm,
	sm:order_sm,
	enableHdMenu:false,
	stripeRows:true,
	columnLines:true,
	autoScroll:true,
	viewConfig:{
		forceFit:true,
		getRowClass:function(record,rowIndex,p,ds){
			if(record.data.bad_num>0){
				return 'bad_row';
			}
			if((record.data.num+record.data.bad_num-record.data.ok_num) === 0){
				return 'ok_row';
			}
		}
	},
	tbar:new Ext.Toolbar({
		buttonAlign:'right',
		items:[{xtype:'tbspacer'},{
			xtype:'textfield',
			name:'order_filter',
			id:'order_filter'
		},{
			xtype:'button',
			text:'搜尋',
			handler:function(){
				var keyword = Ext.get('order_filter').getValue();
				order_store.load({params:{keyword:keyword}});
			}		
		}]
	}),
	bbar:new Ext.Toolbar(['-',{
			id:'order_add',
			text:'新增',
			iconCls:'ss_sprite ss_add',
			tooltip:'新增訂單資料',
			handler:function(){add_order();}
		},'-',{
			id:'order_edit',
			text:'編輯',
			iconCls:'ss_sprite ss_application_form_edit ',
			tooltip:'修改選取資料列',
			handler:function(){edit_order();}
		},'-',{
			text:'重新整理',
			iconCls:'ss_sprite ss_arrow_refresh',
			tooltip:'重新讀取最新資料',
			handler:function(){
				order_store.reload();
			}
		},'-',{
			id:'order_del',
			text:'刪除',
			iconCls:'ss_sprite ss_delete',
			tooltip:'刪除選取資料列,將會一併刪除相關的壞品、批號記錄',
			handler:function(){
				Ext.Msg.confirm('確認','確定刪除已選擇資料？將會一併刪除相關的壞品、批號記錄',function(btn){
					if(btn == 'yes'){
						del_order();
					}
				});
			}
		},{
			id:'order_reset',
			text:'重新計算各數量數值',
			iconCls:'ss_sprite ss_calculator_edit',
			tooltip:'如果數量累計錯誤時，會重新統計完成、破片、未處理的數值。並且會將錯誤的單據刪除(無原始訂單的批號、破片資料)',
			handler:function(){
				Ext.Msg.confirm('確認','確定要重新統計各數量數值？需要花費一點時間做數量的重置計算',function(btn){
					if(btn === 'yes'){
						Ext.getBody().mask();
						Ext.Ajax.request({
							url:base_url+'orders/reset_num',
							success:function(res){
								Ext.getBody().unmask();
								show_Growl(1,'訊息','數量已重新統計完畢');
								order_store.load();
							}
						});
					}
				});
			}
		},order_status_combo/*,'-',{
			id:'order_filter',
			text:'搜尋',
			iconCls:'ss_sprite ss_zoom',
			tooltip:'過濾目前清單',
			handler:function(){
				order_fwin.show();
			}
		}*/
	])
});
order.on('render',function(){
	order_store.load({params:{start:0,limit:30}});
});
order.on('rowdblclick',function(){
	edit_order();
});
var add_order = function(){
	order_form.getForm().reset();
	order_form.buttons[0].setText('新增');
	order_win.show();
};
var edit_order = function(){
	var sm = order.getSelectionModel();
	edit_order_record = sm.getSelected();
	order_ds.baseParams.id = edit_order_record.data.id;
	order_ds.load();
	order_ds.on('load',setEditOrderData);
};
var del_order = function(){
	var index = order.getSelectionModel().getSelections();
	if (index.length<1) {
		Ext.Msg.alert('訊息','您沒有選擇要刪除的紀錄');
		return false;
	}else{
		var i = 0;
		var len = index.length;
		tmp=new Array();
		while(i < len){
			tmp.push(index[i].get('id'));
			order_store.remove(index[i]);
			i++;
		}
		Ext.Ajax.request({
			url: base_url+'orders/destory',
			success: function(res){
				show_Growl(1,'訊息','資料已成功刪除');
				order_store.reload();
			},
			params: {'foo[]': tmp}
		});
	}
	return false;
};