var batches_ds = new Ext.data.JsonStore({
	proxy:new Ext.data.HttpProxy({url:'batches',method:'post'}),
	root:'root',
	totalProperty:'totalProperty',
	fields:[
		{name:'id',type:'int'},
		{name:'order_id',type:'int'},
		{name:'pname',type:'string'},
		{name:'cname',type:'string'},
		{name:'num',type:'int'},
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
		{name:'content',type:'string'}
	]
});
//batches_ds.load();
var batches_cm = new Ext.grid.ColumnModel([
	new Ext.grid.RowNumberer(),
	{header:'id',dataIndex:'id',hidden:true},
	{header:'產品名稱',dataIndex:'pname',sortable:true},
	{header:'客戶名稱',dataIndex:'cname',sortable:true},
	{header:'數量',dataIndex:'num',align:'right',sortable:true},
	{header:'尺寸',dataIndex:'x1',renderer:size_render},
	{header:'加工細項',dataIndex:'spec1_l',renderer:spec_render},
	{header:'備註',dataIndex:'content'}
]);

var batches = new Ext.grid.GridPanel({
	id:'batches_grid',
	title:'批號清單',
	store:batches_ds,
	cm:batches_cm,
	ladMask:true,
	frame:true,
	viewConfig:{forceFit:true},
	stripRows:true,
	enableHdMenu:false,
	columnLines:true,
	bbar:new Ext.Toolbar([{
		id:'batches_total',
		iconCls:'ss_sprite ss_tag_green ',
		text:'總數量'
	},'-',{
		text:'重新整理',
		iconCls:'ss_sprite ss_arrow_refresh',
		tooltip:'重新讀取最新資料',
		handler:function(){
			batches_ds.reload();
		}
	},'-',{
		text:'確定送出',
		iconCls:'ss_sprite ss_lightning',
		tooltip:'送出所有單據產生批號',
		handler:function(){
			Ext.Msg.confirm('確認','確定送出所有單據？',function(btn){
				if(btn == 'yes'){
					save_batch();
				}
			});
		}
	},'-',{
		id:'batch_del',
		text:'刪除',
		iconCls:'ss_sprite ss_delete',
		tooltip:'刪除選取資料列',
		handler:function(){
			Ext.Msg.confirm('確認','確定刪除已選擇資料？',function(btn){
				if(btn == 'yes'){
					del_batch();
				}
			});
		}
	}])
});
batches.on('render',function(){
	batches_ds.load();
});
var save_batch = function(){
	Ext.Ajax.request({
		url:'batches/save',
		success:function(res){
			show_Growl(1,'訊息','資料已成功儲存');
			batches_ds.reload();
			pending_ds.reload();
			his_ds.load();
		}
	});
};
var del_batch = function(){
	var index = batches.getSelectionModel().getSelections();
	if (index.length<1) {
		Ext.Msg.alert('訊息','您沒有選擇要刪除的紀錄');
		return false;
	}else{
		var i = 0;
		var len = index.length;
		tmp=new Array();
		while(i < len){
			tmp.push(index[i].get('id'));
			batches_ds.remove(index[i]);
			i++;
		}
		Ext.Ajax.request({
			url: 'batches/destory',
			success: function(res){
				show_Growl(1,'訊息','資料已成功刪除');
				batches_ds.reload();
			},
			params: {'foo[]': tmp}
		});
	}
	return false;
};