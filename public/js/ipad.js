Ext.setup({
	icon:base_url+'public/images/icon.png',
	tabletStartupScreen:base_url+'public/images/tablet_startup.png',
	phoneStartupScreen:base_url+'public/images/phone_startup.png',
	glossOnIcon:true,
	onReady:function(){
		var tabpanel = new Ext.TabPanel({
			id:"tabpanel",
			tabBar:{
				dock:'bottom',
				layout:{
					pack:'center'
				}
			},
			fullscreen:true,
			ui:'light',
			cardSwitchAnimation:{
				type:'slide',
				cover:true
			},
			defaults:{
				scroll:'vertical',
				layout:'fit'
			},
			items:[{
				title:'未處理訂單',
				iconCls:'info',
				items:[card1_panel],
				cls:'card1'
			},{
				title:'批號清單',
				iconCls:'more',
				items:[card2_panel],
				cls:'card2'
			},{
				title:'壞品列表',
				iconCls:'info',
				items:[card3_panel],
				cls:'card3'
			},{
				title:'歷史批號',
				iconCls:'info',
				items:[card4_panel],
				cls:'card4'
			}]
		});
		var set_minute = 0.1;
		var real_ms = Number(set_minute*60*1000);
		task_b = new Ext.util.DelayedTask(function(){
			Ext.Ajax.request({
				url:base_url+'orders/order_sensor',
				success:function(res){
					if(chk_order_id < res.responseText){
						Ext.Msg.alert('提醒','有新未處理訂單,請更新確認');
					}
					task_b.delay(real_ms);
				}
			});
		});
		task_a = new Ext.util.DelayedTask(function(){
			task_b.cancel();
			Ext.Ajax.request({
				url:base_url+'orders/order_sensor',
				success:function(res){
					chk_order_id = res.responseText;
					task_b.delay(real_ms);
				}
			});
		});
		task_a.delay(500);
	}
});