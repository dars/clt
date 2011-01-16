var prod_writer = new Ext.data.JsonWriter({
	encode:true,
	writeAllFields:true
});
var prod_store = new Ext.data.JsonStore({
	proxy:new Ext.data.HttpProxy({
		api:{
			read:'products/read',
			create:'products/create',
			update:'products/update',
			destroy:'products/destroy'
		}
	}),
	writer:prod_writer,
	root:'data',
	fields:[
		{name:'id',type:'int'},
		{name:'name',type:'string',allowBlank:false},
		{name:'status',type:'int',allowBlank:false},
		{name:'created',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'modified',type:'date',dateFormat:'Y-m-d H:i:s'}
	]
});
//prod_store.load();
prod_store.on('save',function(){prod_store.reload();});
var dateFormat = Ext.util.Format.dateRenderer('Y-m-d H:i:s');
var prod_cm = [
	new Ext.grid.RowNumberer(),
	{header:'名稱',dataIndex:'name',editor:new Ext.form.TextField({allowBlank:false}),sortable:true},
	{header:'狀態',dataIndex:'status',editor:new Ext.form.ComboBox({
		emptyText:'請選擇',
		mode:'local',
		editable:false,
		triggerAction:'all',
		allowBlank:false,
		store:new Ext.data.SimpleStore({
			fields:['id','text'],
			data:statusData
		}),
		valueField:'id',
		displayField:'text'
	}),renderer:status_render,sortable:true},
	{header:'建立日期',dataIndex:'created',width:120,renderer:dateFormat,editor:new Ext.form.Field({disabled:true})},
	{header:'修改日期',dataIndex:'modified',width:120,renderer:dateFormat,editor:new Ext.form.Field({disabled:true})}
];
var prod_editor = new Ext.ux.grid.RowEditor({
	saveText: '儲存'
});
var prod_grid = new Ext.grid.GridPanel({
	title:'產品列表',
	id:'prod_grid',
	stripeRows:true,
	loadMask:true,
	store:prod_store,
	columns:prod_cm,
	frame:true,
	enableHdMenu:false,
	bbar:new Ext.Toolbar([{
		id:'prod_new',
		text:'新增',
		iconCls:'ss_sprite ss_add',
		tooltip:'新增產品',
		handler:function(btn,ev){
			var p = new prod_grid.store.recordType({
				name:'',
				status:1
			});
			prod_editor.stopEditing();
			prod_grid.store.insert(0,p);
			prod_editor.startEditing(0);
		}
	},{
		id:'prod_destroy',
		text:'刪除',
		iconCls:'ss_sprite ss_delete',
		tooltip:'刪除資料',
		handler:function(){
			var rec = prod_grid.getSelectionModel().getSelected();
			if(!rec){
				return false;
			}else{
				prod_grid.store.remove(rec);
			}
			return false;
		}
	},{
		id:'prod_refresh',
		text:'重新整理',
		iconCls:'ss_sprite ss_arrow_refresh',
		tooltip:'重新讀取目前最新資料',
		handler:function(){prod_store.reload();}
	}]),
	plugins:[prod_editor]
});
prod_grid.on('render',function(){
	prod_store.load();
});