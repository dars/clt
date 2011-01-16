var ustatus_combo = new Ext.form.ComboBox({
	id:'ustatus_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:statusData
	}),
	mode:'local',
	hiddenName:'status',
	displayField:'text',
	valueField:'id',
	emptyText:'請選擇',
	editable:false,
	triggerAction:'all'
});
var perm1_combo = new Ext.form.ComboBox({
	id:'perm1_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:statusData
	}),
	mode:'local',
	hiddenName:'permission1',
	displayField:'text',
	valueField:'id',
	emptyText:'請選擇',
	editable:false,
	triggerAction:'all'
});
var perm2_combo = new Ext.form.ComboBox({
	id:'perm2_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:statusData
	}),
	mode:'local',
	hiddenName:'permission2',
	displayField:'text',
	valueField:'id',
	emptyText:'請選擇',
	editable:false,
	triggerAction:'all'
});
var perm3_combo = new Ext.form.ComboBox({
	id:'perm3_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:statusData
	}),
	mode:'local',
	hiddenName:'permission3',
	displayField:'text',
	valueField:'id',
	emptyText:'請選擇',
	editable:false,
	triggerAction:'all'
});
var perm4_combo = new Ext.form.ComboBox({
	id:'perm4_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:statusData
	}),
	mode:'local',
	hiddenName:'permission4',
	displayField:'text',
	valueField:'id',
	emptyText:'請選擇',
	editable:false,
	triggerAction:'all'
});
var perm5_combo = new Ext.form.ComboBox({
	id:'perm5_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:statusData
	}),
	mode:'local',
	hiddenName:'permission5',
	displayField:'text',
	valueField:'id',
	emptyText:'請選擇',
	editable:false,
	triggerAction:'all'
});
var perm6_combo = new Ext.form.ComboBox({
	id:'perm6_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:statusData
	}),
	mode:'local',
	hiddenName:'permission6',
	displayField:'text',
	valueField:'id',
	emptyText:'請選擇',
	editable:false,
	triggerAction:'all'
});
var perm7_combo = new Ext.form.ComboBox({
	id:'perm7_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:statusData
	}),
	mode:'local',
	hiddenName:'permission7',
	displayField:'text',
	valueField:'id',
	emptyText:'請選擇',
	editable:false,
	triggerAction:'all'
});
var perm8_combo = new Ext.form.ComboBox({
	id:'perm8_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:statusData
	}),
	mode:'local',
	hiddenName:'permission8',
	displayField:'text',
	valueField:'id',
	emptyText:'請選擇',
	editable:false,
	triggerAction:'all'
});
var perm9_combo = new Ext.form.ComboBox({
	id:'perm9_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:statusData
	}),
	mode:'local',
	hiddenName:'permission9',
	displayField:'text',
	valueField:'id',
	emptyText:'請選擇',
	editable:false,
	triggerAction:'all'
});
var user_record = Ext.data.Record.create([
	{name:'id',type:'int'},
	{name:'username',type:'string',allowBlank:false},
	{name:'password',type:'string',allowBlank:false},
	{name:'status',type:'int'},
	{name:'permission1',type:'int'},
	{name:'permission2',type:'int'},
	{name:'permission3',type:'int'},
	{name:'permission4',type:'int'},
	{name:'permission5',type:'int'},
	{name:'permission6',type:'int'},
	{name:'permission7',type:'int'},
	{name:'permission8',type:'int'},
	{name:'permission9',type:'int'},
	{name:'created',type:'string'},
	{name:'modified',type:'string'}
]);
var user_ds = new Ext.data.JsonStore({
	proxy:new Ext.data.HttpProxy({url:'users',method:'post'}),
	root:'root',
	totalProperty:'totalProperty',
	fields:user_record
});
//user_ds.load();
var user_cm = new Ext.grid.ColumnModel([
	new Ext.grid.RowNumberer(),
	{header:'帳號',dataIndex:'username',editor:{xtype:'textfield',allowBlank:false}},
	{header:'密碼',dataIndex:'password',editor:{xtype:'textfield',allowBlank:false}},
	{header:'狀態',dataIndex:'status',editor:ustatus_combo,renderer:status_render},
	{header:'訂單列表',dataIndex:'permission1',editor:perm1_combo,renderer:status_render},
	{header:'未處理訂單',dataIndex:'permission2',editor:perm2_combo,renderer:status_render},
	{header:'批號清單',dataIndex:'permission3',editor:perm3_combo,renderer:status_render},
	{header:'破片清單',dataIndex:'permission4',editor:perm4_combo,renderer:status_render},
	{header:'歷史批號清單',dataIndex:'permission5',editor:perm5_combo,renderer:status_render},
	{header:'產品列表',dataIndex:'permission6',editor:perm6_combo,renderer:status_render},
	{header:'客戶列表',dataIndex:'permission7',editor:perm7_combo,renderer:status_render},
	{header:'使用者設定',dataIndex:'permission8',editor:perm8_combo,renderer:status_render},
	{header:'系統設定',dataIndex:'permission9',editor:perm9_combo,renderer:status_render},
	{header:'建立日期',dataIndex:'created'},
	{header:'更新日期',dataIndex:'modified'}
]);
var user_editor = new Ext.ux.grid.RowEditor({
	saveText:'儲存',
	cancelText:'取消',
	errorSummary:false
});
var users = new Ext.grid.GridPanel({
	id:'users_grid',
	title:'使用者設定',
	cm:user_cm,
	store:user_ds,
	frame:true,
	columnLine:true,
	stripeRows:true,
	enableHdMenu:false,
	viewConfig:{
		forceFit:true
	},
	plugins:[user_editor],
	bbar:new Ext.Toolbar([{
		text:'新增',
		tooltip:'新增一筆使用者資料',
		id:'user_add',
		iconCls:'ss_sprite ss_add',
		handler:function(){
			add_user();
		}
	},'-',{
		id:'user_del',
		text:'刪除',
		iconCls:'ss_sprite ss_delete',
		tooltip:'刪除選取資料列',
		handler:function(){
			Ext.Msg.confirm('確認','確定刪除已選擇資料？',function(btn){
				if(btn == 'yes'){
					del_user();
				}
			});
		}
	},'-',{
		text:'重新整理',
		iconCls:'ss_sprite ss_arrow_refresh',
		tooltip:'重新讀取最新資料',
		handler:function(){
			user_ds.reload();
		}
	}])
});
var add_user = function(){
	var u = new user_record({
		name:'',
		password:'',
		status:1,
		permission1:0,
		permission2:0,
		permission3:0,
		permission4:0,
		permission5:0,
		permission6:0,
		permission7:0,
		permission8:0,
		permission9:0,
		created:'',
		modified:''
	});
	user_editor.stopEditing();
	user_ds.insert(0,u);
	users.getView().refresh();
	users.getSelectionModel().selectRow(0);
	user_editor.startEditing(0);
};
var del_user = function(){
	var index = users.getSelectionModel().getSelections();
	if (index.length<1) {
		Ext.Msg.alert('訊息','您沒有選擇要刪除的紀錄');
		return false;
	}else{
		var i = 0;
		var len = index.length;
		tmp=new Array();
		while(i < len){
			tmp.push(index[i].get('id'));
			user_ds.remove(index[i]);
			i++;
		}
		Ext.Ajax.request({
			url: 'users/destory',
			success: function(res){
				show_Growl(1,'訊息','資料已成功刪除');
				user_ds.reload();
			},
			params: {'foo[]': tmp}
		});
	}
	return false;
};
users.on('render',function(){
	user_ds.load();
});
user_editor.on({
	scope:this,
	afteredit:function(roweditor,values,record,rowIndex){
		values['id']=record.get('id');
		Ext.Ajax.request({
			url:'users/save',
			params:values,
			success:function(res){
				show_Growl(1,'訊息','資料儲存完成');
				user_ds.reload();
			}
		});
	},
	canceledit:function(roweditor,values,record,rowIndex){
		var s = users.getSelectionModel().getSelections();
		for(var i = 0, r; r = s[i]; i++){
			user_ds.remove(r);
		}
	}
});