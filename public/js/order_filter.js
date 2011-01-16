var fstatus_combo = new Ext.form.ComboBox({
	fieldLabel:'訂單狀態',
	width:140,
	id:'fstatus_combo',
	store:new Ext.data.SimpleStore({
		fields:['id','text'],
		data:order_status
	}),
	mode:'local',
	hiddenName:'fstatus',
	displayField:'text',
	valueField:'id',
	emptyText:'請選擇',
	editable:false,
	triggerAction:'all'
});
var order_fform = new Ext.form.FormPanel({
	id:'order_fform',
	labelAlign:'right',
	labelWidth:'100',
	autoScroll:true,
	frame:true,
	fileUpload:true,
	defaults:{
		anchor:'95%',
		magTarget:'side'
	},
	items:[{
		layout:'column',
		items:[{
			columnWidth:0.5,
			layout:'form',
			border:false,
			xtype:'fieldset',
			title:'訂單內容',
			autoHeight:true,
			items:[fstatus_combo,{
				xtype:'textfield',
				fieldLabel:'產品名稱',
				name:'prod_name'
			},{
				xtype:'textfield',
				fieldLabel:'客戶名稱',
				name:'cust_name'
			},{
				xtype:'compositefield',
				fieldLabel:'X尺寸',
				items:[{
					name:'x1',
					xtype:'textfield',
					emptyText:'min',
					width:63
				},{
					xtype:'displayfield',
					value:'~',
					cls:'form-txt'
				},{
					name:'x2',
					xtype:'textfield',
					emptyText:'max',
					width:63
				}]
			},{
				xtype:'compositefield',
				fieldLabel:'Y尺寸',
				items:[{
					name:'y1',
					xtype:'numberfield',
					emptyText:'min',
					width:63
				},{
					xtype:'displayfield',
					value:'~',
					cls:'form-txt'
				},{
					name:'y2',
					xtype:'numberfield',
					emptyText:'max',
					width:63
				}]
			},{
				xtype:'compositefield',
				fieldLabel:'數量',
				items:[{
					name:'num1',
					xtype:'numberfield',
					emptyText:'min',
					width:63
				},{
					xtype:'displayfield',
					value:'~',
					cls:'form-txt'
				},{
					name:'num2',
					xtype:'numberfield',
					emptyText:'max',
					width:63
				}]
			}]
		},{
			columnWidth:0.5,
			style:'margin-left:5px',
			layout:'form',
			xtype:'fieldset',
			border:false,
			title:'加工細項',
			autoHeight:true,
			items:[{
				xtype:'compositefield',
				fieldLabel:'光邊',
				items:[{
					id:'order_spec1_l',
					name:'spec1_l',
					xtype:'textfield',
					emptyText:'長',
					width:68
				},{
					id:'order_spec1_s',
					name:'spec1_s',
					xtype:'textfield',
					emptyText:'短',
					width:68
				}]
			},{
				xtype:'compositefield',
				fieldLabel:'面取',
				items:[{
					id:'order_spec2_num',
					name:'spec2_num',
					xtype:'textfield',
					width:40,
					emptyText:'分'
				},{
					xtype:'displayfield',
					value:'/',
					cls:'form-txt'
				},{
					id:'order_spec2_l',
					name:'spec2_l',
					xtype:'textfield',
					emptyText:'長',
					width:40
				},{	
					id:'order_spec2_s',
					name:'spec2_s',
					xtype:'textfield',
					emptyText:'短',
					width:40
				}]
			},{
				xtype:'compositefield',
				fieldLabel:'合口',
				items:[{
					id:'order_spec3_l',
					name:'spec3_l',
					xtype:'textfield',
					emptyText:'長',
					width:68
				},{
					id:'order_spec3_s',
					name:'spec3_s',
					xtype:'textfield',
					emptyText:'短',
					width:68
				}]
			},{
				xtype:'compositefield',
				fieldLabel:'異形光邊',
				items:[{
					id:'order_spec4_l',
					name:'spec4_l',
					xtype:'textfield',
					emptyText:'長',
					width:68
				},{
					id:'order_spec4_s',
					name:'spec4_s',
					xtype:'textfield',
					emptyText:'短',
					width:68
				}]
			},{
				xtype:'compositefield',
				fieldLabel:'異形面取',
				items:[{
					id:'order_spec5_num',
					name:'spec5_num',
					xtype:'textfield',
					width:40,
					emptyText:'分'
				},{
					xtype:'displayfield',
					value:'/',
					cls:'form-txt'
				},{
					id:'order_spec5_l',
					name:'spec5_l',
					xtype:'textfield',
					emptyText:'長',
					width:40
				},{
					id:'order_spec5_s',
					name:'spec5_s',
					xtype:'textfield',
					emptyText:'短',
					width:40
				}]
			},{
				xtype:'checkbox',
				fieldLabel:'打洞',
				name:'spec6',
				inputValue:1
			}]
		},{
			columnWidth:1,
			layout:'form',
			items:[{
				fieldLabel:'備註',
				xtype:'textarea',
				width:393,
				name:'content'
			},{
				xtype:'compositefield',
				fieldLabel:'建立日期',
				items:[{
					xtype:'datefield',
					name:'start_date',
					width:150,
					format:'Y-m-d',
					editable:false
				},{
					xtype:'datefield',
					name:'end_date',
					width:150,
					format:'Y-m-d',
					editable:false
				}]
			},{
				name:'id',
				xtype:'hidden'
			}]
		}]
	}],
	buttons:[{
		text:'查詢',
		handler:function(){
			var tparams;
			tparams = new Object();
			if(order_fform.getForm().findField('fstatus').getValue() !== ''){
				tparams.fstatus = order_fform.getForm().findField('fstatus').getValue();
			}
			if(order_fform.getForm().findField('prod_name').getValue() !== ''){
				tparams.prod_name = order_fform.getForm().findField('prod_name').getValue();
			}
			if(order_fform.getForm().findField('cust_name').getValue() !== ''){
				tparams.cust_name = order_fform.getForm().findField('cust_name').getValue();
			}
			if(order_fform.getForm().findField('x1').getValue() !== ''){
				tparams.x1 = order_fform.getForm().findField('x1').getValue();
			}
			if(order_fform.getForm().findField('x2').getValue() !== ''){
				tparams.x2 = order_fform.getForm().findField('x2').getValue();
			}
			if(order_fform.getForm().findField('y1').getValue() !== ''){
				tparams.y1 = order_fform.getForm().findField('y1').getValue();
			}
			if(order_fform.getForm().findField('y2').getValue() !== ''){
				tparams.y2 = order_fform.getForm().findField('y2').getValue();
			}
			if(order_fform.getForm().findField('num1').getValue() !== ''){
				tparams.num1 = order_fform.getForm().findField('num1').getValue();
			}
			if(order_fform.getForm().findField('num2').getValue() !== ''){
				tparams.num2 = order_fform.getForm().findField('num2').getValue();
			}
			if(order_fform.getForm().findField('spec1_l').getValue() !== ''){
				tparams.spec1_l = order_fform.getForm().findField('spec1_l').getValue();
			}
			if(order_fform.getForm().findField('spec1_s').getValue() !== ''){
				tparams.spec1_s = order_fform.getForm().findField('spec1_s').getValue();
			}
			if(order_fform.getForm().findField('spec2_l').getValue() !== ''){
				tparams.spec2_l = order_fform.getForm().findField('spec2_l').getValue();
			}
			if(order_fform.getForm().findField('spec2_s').getValue() !== ''){
				tparams.spec2_s = order_fform.getForm().findField('spec2_s').getValue();
			}
			if(order_fform.getForm().findField('spec3_l').getValue() !== ''){
				tparams.spec3_l = order_fform.getForm().findField('spec3_l').getValue();
			}
			if(order_fform.getForm().findField('spec3_s').getValue() !== ''){
				tparams.spec3_s = order_fform.getForm().findField('spec3_s').getValue();
			}
			if(order_fform.getForm().findField('spec4_l').getValue() !== ''){
				tparams.spec4_l = order_fform.getForm().findField('spec4_l').getValue();
			}
			if(order_fform.getForm().findField('spec4_s').getValue() !== ''){
				tparams.spec4_s = order_fform.getForm().findField('spec4_s').getValue();
			}
			if(order_fform.getForm().findField('spec5_l').getValue() !== ''){
				tparams.spec5_l = order_fform.getForm().findField('spec5_l').getValue();
			}
			if(order_fform.getForm().findField('spec5_s').getValue() !== ''){
				tparams.spec5_s = order_fform.getForm().findField('spec5_s').getValue();
			}
			if(order_fform.getForm().findField('spec2_num').getValue() !== ''){
				tparams.spec2_num = order_fform.getForm().findField('spec2_num').getValue();
			}
			if(order_fform.getForm().findField('spec5_num').getValue() !== ''){
				tparams.spec5_num = order_fform.getForm().findField('spec5_num').getValue();
			}
			
			if(order_fform.getForm().findField('spec6').getValue()){
				tparams.spec6=1;
			}
			if(order_fform.getForm().findField('start_date').getValue() !== ''){
				tparams.start_date = order_fform.getForm().findField('start_date').getValue();
			}
			if(order_fform.getForm().findField('end_date').getValue() !== ''){
				tparams.end_date = order_fform.getForm().findField('end_date').getValue();
			}
			if(order_fform.getForm().findField('content').getValue() !== ''){
				tparams.content = order_fform.getForm().findField('content').getValue();
			}
			order_store.load({params:tparams});
			order_fwin.hide();
		}
	},{
		text:'取消',
		handler:function(){
			order_fform.getForm().reset();
			order_fwin.hide();
		}
	},{
		text:'清除過濾條件',
		handler:function(){
			order_fform.getForm().reset();
			order_store.load();
			order_fwin.hide();
		}
	}]
});
var order_fwin = new Ext.Window({
	renderTo:Ext.getBody(),
	width:570,
	title:'過濾條件表單',
	layout:'fit',
	modal:true,
	height:380,
	closeAction:'hide',
	items:[order_fform]
});
order_fwin.on('show',function(){
});