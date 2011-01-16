var his_ds = new Ext.data.JsonStore({
	proxy:new Ext.data.HttpProxy({url:'history',method:'post'}),
	root:'root',
	totalProperty:'totalProperty',
	fields:[
		{name:'id',type:'int'},
		{name:'order_id',type:'int'},
		{name:'pname',type:'string'},
		{name:'cname',type:'string'},
		{name:'batch_num',type:'int'},
		{name:'num',type:'int'},
		{name:'bnum',type:'int'},
		{name:'uname',type:'string'},
		{name:'x1',type:'string'},
		{name:'y1',type:'string'},
		{name:'x2',type:'string'},
		{name:'y2',type:'string'},
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
		{name:'img',type:'string'}
	],
	remoteSort:true
});
//his_ds.load();
var his_cm = new Ext.grid.ColumnModel([
	new Ext.grid.RowNumberer(),
	{header:'id',dataIndex:'id',hidden:true},
	{header:'批號',dataIndex:'batch_num',sortable:true},
	{header:'產品名稱',dataIndex:'pname',width:65,sortable:true},
	{header:'客戶名稱',dataIndex:'cname',width:65,sortable:true},
	{header:'數量',dataIndex:'num',align:'right',sortable:true},
	{header:'破片數量',dataIndex:'bnum',align:'right',renderer:bad_render,sortable:true},
	{header:'尺寸',dataIndex:'x1',renderer:size_render},
	{header:'加工細項',dataIndex:'spec1_l',renderer:spec_render},
	{header:'備註',dataIndex:'content'}
]);
var his = new Ext.grid.GridPanel({
	id:'his_grid',
	title:'歷史批號清單',
	store:his_ds,
	cm:his_cm,
	ladMask:true,
	frame:true,
	viewConfig:{forceFit:true},
	stripeRows:true,
	enableHdMenu:false,
	columnLines:true,
	bbar:new Ext.PagingToolbar({
		pageSize:15,
		store:his_ds,
		items:['-',{
			id:'his_del',
			text:'刪除',
			iconCls:'ss_sprite ss_delete',
			tooltip:'刪除選取資料列',
			handler:function(){
				Ext.Msg.confirm('確認','確定刪除已選擇資料？',function(btn){
					if(btn == 'yes'){
						del_his();
					}
				});
			}
		}]
	})
});
his.on('render',function(){
	his_ds.load({params:{start:0,limit:15}});
});
his.on('rowclick',function(grid,rowIndex){show_his_form(grid,rowIndex);});
var show_his_form = function(grid,rowIndex){
	var record = his.getStore().getAt(rowIndex);
	his_form.getForm().loadRecord(record);
	his_form.getForm().findField('spec1').setValue(spec1_render(record,record,record));
	his_form.getForm().findField('spec2').setValue(spec2_render(record,record,record));
	his_form.getForm().findField('spec3').setValue(spec3_render(record,record,record));
	his_form.getForm().findField('spec4').setValue(spec4_render(record,record,record));
	his_form.getForm().findField('spec5').setValue(spec5_render(record,record,record));
	his_form.getForm().findField('bad_num').setMaxValue(record.data.num);
	his_form.getForm().findField('bad_num').setMinValue(1);
	his_form.getForm().findField('bad_num').setValue(record.data.num);
	his_form.getForm().findField('bad_num').focus(true,500);
	his_form.getForm().findField('his_img_name').setValue(img_render(record.data.img));
	his_win.show();
};
var del_his = function(){
	var index = his.getSelectionModel().getSelections();
	if (index.length<1) {
		Ext.Msg.alert('訊息','您沒有選擇要刪除的紀錄');
		return false;
	}else{
		var i = 0;
		var len = index.length;
		tmp=new Array();
		while(i < len){
			if(index[i].get('bnum')>0){
				Ext.Msg.alert('警告','該筆資料有破片記錄，無法刪除');
			}else{
				tmp.push(index[i].get('id'));
				bad_ds.remove(index[i]);
			}
			i++;
		}
		Ext.Ajax.request({
			url: 'history/destory',
			success: function(res){
				show_Growl(1,'訊息','資料已成功刪除');
				bad_ds.reload();
				order_store.reload();
				pending_ds.reload();
			},
			params: {'foo[]': tmp}
		});
	}
	return false;
};