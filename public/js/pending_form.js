var pending_form = new Ext.form.FormPanel({
	labelAlign:'right',
	labelWidth:'100',
	autoScroll:true,
	frame:true,
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
			items:[{
				xtype:'displayfield',
				fieldLabel:'產品名稱',
				name:'pname'
			},{
				xtype:'displayfield',
				fieldLabel:'客戶名稱',
				name:'cname'
			},{
				xtype:'displayfield',
				fieldLabel:'尺寸單位',
				name:'uname'
			},{
				xtype:'compositefield',
				fieldLabel:'X1Y1',
				items:[{
					name:'x1',
					xtype:'displayfield',
					emptyText:'X1',
					width:68
				},{
					name:'y1',
					xtype:'displayfield',
					emptyText:'Y1',
					width:68
				}]
			},{
				xtype:'compositefield',
				fieldLabel:'X2Y2',
				items:[{
					name:'x2',
					xtype:'displayfield',
					emptyText:'X2',
					width:68
				},{
					name:'y2',
					xtype:'displayfield',
					emptyText:'Y2',
					width:68
				}]
			},{
				name:'num',
				id:'padding_num',
				fieldLabel:'數量',
				xtype:'numberfield'
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
				xtype:'displayfield',
				fieldLabel:'光邊',
				name:'spec1',
				id:'padding_spec1'
			},{
				xtype:'displayfield',
				fieldLabel:'面取',
				name:'spec2',
				id:'padding_spec2'
			},{
				xtype:'displayfield',
				fieldLabel:'合口',
				name:'spec3',
				id:'padding_spec3'
			},{
				xtype:'displayfield',
				fieldLabel:'異形光邊',
				name:'spec4',
				id:'padding_spec4'
			},{
				xtype:'displayfield',
				fieldLabel:'異形面取',
				name:'spec5',
				id:'padding_spec5'
			}]
		},{
			columnWidth:1,
			layout:'form',
			items:[{
				fieldLabel:'備註',
				xtype:'displayfield',
				width:393,
				height:60,
				name:'content'
			},{
				xtype:'displayfield',
				name:'img_name',
				id:'pimg_name',
				width:390
			},{
				name:'id',
				xtype:'hidden'
			}]
		}]
	}],
	buttons:[{
		text:'儲存',
		handler:function(){
			pending_form.getForm().submit({
				url:base_url+'pending/save',
				success:function(data){
					show_Growl(1,'訊息','資料已儲存');
					pending_form.getForm().reset();
					pending_win.hide();
					//pending_ds.reload();
					batches_ds.load();
				}
			});
		}
	},{
		text:'取消',
		handler:function(){
			pending_form.getForm().reset();
			pending_win.hide();
		}
	}]
});
var pending_win = new Ext.Window({
	renderTo:Ext.getBody(),
	width:570,
	title:'批號送出設定',
	layout:'fit',
	modal:true,
	height:350,
	closeAction:'hide',
	items:[pending_form]
});