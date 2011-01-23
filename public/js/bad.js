var bad_ds = new Ext.data.JsonStore({
	proxy:new Ext.data.HttpProxy({url:base_url+'bad',method:'post'}),
	root:'root',
	fields:[
		{name:'id',type:'int'},
		{name:'order_id',type:'int'},
		{name:'batch_num',type:'int'},
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
		{name:'spec6',type:'string'},
		{name:'content',type:'string'},
		{name:'created',type:'string'},
		{name:'modified',type:'string'}
	]
});
bad_ds.on('load',function(){
	/*
	if(bad_ds.data.length>0){
		last_bad_id = bad_ds.getAt(0).data.id;
	}else{
		last_bad_id = 0;
	}
	*/
});

var bad_cm = new Ext.grid.ColumnModel([
	new Ext.grid.RowNumberer(),
	{header:'訂單編號',dataIndex:'order_id',id:'order_id',hidden:true},
	{header:'批號',dataIndex:'batch_num',sortable:true},
	{header:'產品',dataIndex:'pname',width:65,sortable:true},
	{header:'客戶',dataIndex:'cname',id:'cname',width:65,sortable:true},
	{header:'尺寸',dataIndex:'x1',renderer:size_render},
	{header:'破片數量',dataIndex:'num',align:'right',width:70,renderer:bad_render,sortable:true},
	{header:'加工細項',dataIndex:'spec1_l',renderer:spec_render},
	{header:'備註',dataIndex:'content'},
	{header:'建立日期',dataIndex:'created',width:130,sortable:true}
]);
var bstatus_combo = new Ext.form.ComboBox({
	width:140,
	id:'bstatus_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:order_status
	}),
	mode:'local',
	hiddenName:'bstatus',
	displayField:'text',
	valueField:'id',
	editable:false,
	triggerAction:'all',
	value:0
});
bstatus_combo.on('select',function(){
	bad_ds.load({params:{status:this.getValue()}});
});
var bad = new Ext.grid.GridPanel({
	id:'bad_grid',
	store:bad_ds,
	cm:bad_cm,
	title:'破片清單',
	frame:true,
	ladMask:true,
	autoExpandColumn:'cname',
	enableHdMenu:false,
	stripeRows:true,
	columnLines:true,
	viewConfig:{forceFit:true},
	bbar:new Ext.Toolbar([{
		id:'bad_total',
		iconCls:'ss_sprite ss_tag_green ',
		text:'總數量'
	},'-',{
		text:'重新整理',
		iconCls:'ss_sprite ss_arrow_refresh',
		tooltip:'重新讀取最新資料',
		handler:function(){
			bad_ds.reload();
		}
	},'-',{
		text:'匯出',
		iconCls:'ss_sprite ss_page_white_excel ',
		tooltip:'將所有破片資料匯出成Excel',
		handler:function(){
			Ext.Ajax.request({
				url:base_url+'bad/xls',
				success:function(res){
					Ext.Msg.show({
						title:'下載',
						msg:'請點選<a href=\''+res.responseText+'\' target=\'_blank\' class=\'xls\' \>此處下載Excel</a>',
						buttons:Ext.Msg.CANCEL,
						width:350
					});
					bad_ds.reload();
				}
			});
		}
	},'-',{
		id:'bad_del',
		text:'刪除',
		iconCls:'ss_sprite ss_delete',
		tooltip:'刪除選取資料列',
		handler:function(){
			Ext.Msg.confirm('確認','確定刪除已選擇資料？',function(btn){
				if(btn == 'yes'){
					del_bad();
				}
			});
		}
	},'-',bstatus_combo])
});
bad.on('render',function(){
	bad_ds.load({params:{status:0}});
});

var del_bad = function(){
	var index = bad.getSelectionModel().getSelections();
	if (index.length<1) {
		Ext.Msg.alert('訊息','您沒有選擇要刪除的紀錄');
		return false;
	}else{
		var i = 0;
		var len = index.length;
		tmp=new Array();
		while(i < len){
			tmp.push(index[i].get('id'));
			bad_ds.remove(index[i]);
			i++;
		}
		Ext.Ajax.request({
			url:base_url+'bad/destory',
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