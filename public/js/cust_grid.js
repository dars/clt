var cust_writer = new Ext.data.JsonWriter({
	encode:true,
	writeAllFields:true
});
var cust_store = new Ext.data.JsonStore({
	proxy:new Ext.data.HttpProxy({
		api:{
			read:'customers/read',
			create:'customers/create',
			update:'customers/update',
			destroy:'customers/destroy'
		}
	}),
	writer:cust_writer,
	root:'data',
	fields:[
		{name:'id',type:'int'},
		{name:'name',type:'string',allowBlank:false},
		{name:'status',type:'int',allowBlank:false},
		{name:'created',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'modified',type:'date',dateFormat:'Y-m-d H:i:s'}
	]
});
//cust_store.load();
cust_store.on('save',function(){cust_store.reload();});
var dateFormat = Ext.util.Format.dateRenderer('Y-m-d H:i:s');
var cust_cm = [
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
var cust_editor = new Ext.ux.grid.RowEditor({
	saveText: '儲存'
});
var cust_grid = new Ext.grid.GridPanel({
	title:'客戶列表',
	id:'cust_grid',
	stripeRows:true,
	loadMask:true,
	store:cust_store,
	columns:cust_cm,
	frame:true,
	enableHdMenu:false,
	bbar:new Ext.Toolbar([{
		id:'cust_new',
		text:'新增',
		iconCls:'ss_sprite ss_add',
		tooltip:'新增客戶',
		handler:function(btn,ev){
			var p = new cust_grid.store.recordType({
				name:'',
				status:1
			});
			cust_editor.stopEditing();
			cust_grid.store.insert(0,p);
			cust_editor.startEditing(0);
		}
	},{
		id:'cust_destroy',
		text:'刪除',
		iconCls:'ss_sprite ss_delete',
		tooltip:'刪除資料',
		handler:function(){
			var rec = cust_grid.getSelectionModel().getSelected();
			if(!rec){
				return false;
			}else{
				cust_grid.store.remove(rec);
			}
			return false;
		}
	},{
		id:'prod_refresh',
		text:'重新整理',
		iconCls:'ss_sprite ss_arrow_refresh',
		tooltip:'重新讀取目前最新資料',
		handler:function(){cust_store.reload();return false;}
	}]),
	plugins:[cust_editor]
});
cust_grid.on('render',function(){
	cust_store.load();
});