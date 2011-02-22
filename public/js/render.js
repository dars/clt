var order_status = [
	[0,'未完成'],
	[1,'已完成'],
	[2,'全選']
];
var order_status_render = function(v){
	if(v === 1){
		return "<span class=\"normal\">已完成</span>";
	}else{
		return "<span class=\"disable\">未完成</span>";
	}
};
/* status */
var statusData = [
	[0,'停用'],
	[1,'正常']
];
var status_render = function(v){
	if(v === 1){
		return "<span class=\"normal\">正常</span>";
	}else{
		return "<span class=\"disable\">停用</span>";
	}
};
/* status end */

/* order render */
var order_unit_render = function(v,p,r){
	if(v === ''){
		return '';
	}else if(r.get('uname') !== 'in'){
		return v+' <span class=\'unit_str\'>'+r.get('uname')+'</span>';
	}else{
		tmp = v.split('.')[0];
		if(typeof v.split('.')[1] !== 'undefined'){
			tmp+="<sup>"+v.split('.')[1]+"</sup>";
		}
		tmp+=' <span class=\'unit_str\'>'+r.get('uname')+'</span>';
		return tmp;
	}
};
/* order end */
/* pending */
var img_render2 = function(v){
	if(v !== ''){
		return "<a href=\"public/files/images/"+v+"\" rel=\"lightbox\">Click</a>";
	}
};
/* pending end */
/* batches render */
var unit_render = function(v){
	switch(v){
		case 1:
			return 'mm';
			break;
		case 2:
			return 'in';
			break;
		case 3:
			return '台尺';
			break;
		default:
			return '';
			break;
	}
	return false;
};
var in_render = function(v,u){
	if(u !== 'in'){
		return v;
	}else{
		tmp = v.split('.')[0];
		if(typeof v.split('.')[1] !== 'undefined'){
			tmp+="<sup>"+v.split('.')[1]+"</sup>";
		}
		return tmp;
	}
};
var size_render = function(v,p,r){
	tmp="<table class=\"size_tb\">";
	tmp+="<tr><td class=\"x_num\">"+in_render(r.data.x1,r.data.uname)+"</td><td class=\"y_num\">"+in_render(r.data.y1,r.data.uname)+"</td><td>&nbsp;</td></tr>";
	tmp+="<tr class=\"xy2\"><td class=\"x_num\">"+in_render(r.data.x2,r.data.uname)+"</td><td class=\"y_num\">"+in_render(r.data.y2,r.data.uname)+"</td><td class=\"unit_str\">"+r.data.uname+"</td></tr>";
	tmp+="</table>";
	return tmp;
};
var spec_render = function(v,p,r){
	var tmp = new Array();
	if(spec1_render(v,p,r)){
		tmp.push(spec1_render(v,p,r));
	}
	if(spec2_render(v,p,r)){
		tmp.push(spec2_render(v,p,r));
	}
	if(spec3_render(v,p,r)){
		tmp.push(spec3_render(v,p,r));
	}
	if(spec4_render(v,p,r)){
		tmp.push(spec4_render(v,p,r));
	}
	if(spec5_render(v,p,r)){
		tmp.push(spec5_render(v,p,r));
	}
	if(spec6_render(v,p,r)){
		tmp.push(spec6_render(v,p,r));
	}
	
	return tmp.join(',');
};
var spec1_render = function(v,p,r){
	if(r.data.spec1_l === '' && r.data.spec1_s === ''){
		return '';
	}else if(r.data.spec1_l === '2' && r.data.spec1_s === '2'){
		return "<span class='spec_info'>光4</span>";
	}else{
		tmp="<span class='spec_info'>光";
		if(r.data.spec1_l){
			tmp+=r.data.spec1_l+"L";
		}
		if(r.data.spec1_l !== '' && r.data.spec1_s !== ''){
			tmp+=",";
		}
		if(r.data.spec1_s){
			tmp+=r.data.spec1_s+"S";
		}
		tmp+="</span>";
		return tmp;
	}
};
var spec2_render = function(v,p,r){
	if(r.data.spec2_num === '' && r.data.spec2_l === '' && r.data.spec2_s === ''){
		return '';
	}else if(r.data.spec2_l === '2' && r.data.spec2_s === '2'){
		return "<span class='spec_info'>面"+r.data.spec2_num+'分/4</span>';
	}else{
		tmp="<span class='spec_info'>面";
		if(r.data.spec2_num){
			tmp+=r.data.spec2_num+"分/";
		}
		if(r.data.spec2_l){
			tmp+=r.data.spec2_l+"L";
		}
		if(r.data.spec2_l !== '' && r.data.spec2_s !== ''){
			tmp+=",";
		}
		if(r.data.spec2_s){
			tmp+=r.data.spec2_s+"S";
		}
		tmp+="</span>";
		return tmp;
	}
};
var spec3_render = function(v,p,r){
	tmp="<span class='spec_info'>合";
	if(r.data.spec3_l === '' && r.data.spec3_s === ''){
		return '';
	}else if(r.data.spec3_l){
		tmp+=r.data.spec3_l+"L";
	}
	if(r.data.spec3_l !== '' && r.data.spec3_s !== ''){
		tmp+=",";
	}
	if(r.data.spec3_s){
		tmp+=r.data.spec3_s+"S";
	}
	tmp+="</span>";
	return tmp;
};
var spec4_render = function(v,p,r){
	if(r.data.spec4_l === '' && r.data.spec4_s === ''){
		return '';
	}else if(r.data.spec4_l === '2' && r.data.spec4_s === '2'){
		return "<span class='spec_info'>異光4</span>";
	}else{
		tmp="<span class='spec_info'>異光";
		if(r.data.spec4_l){
			tmp+=r.data.spec4_l+"L";
		}
		if(r.data.spec4_l !== '' && r.data.spec4_s !== ''){
			tmp+=",";
		}
		if(r.data.spec4_s){
			tmp+=r.data.spec4_s+"S";
		}
		tmp+="</span>";
		return tmp;
	}
};
var spec5_render = function(v,p,r){
	if(r.data.spec5_num === '' && r.data.spec5_l === '' && r.data.spec5_s === ''){
		return '';
	}else if(r.data.spec5_l === '2' && r.data.spec5_s === '2'){
		return "<span class='spec_info'>異面"+r.data.spec5_num+'分/4</span>';
	}else{
		tmp="<span class='spec_info'>異面";
		if(r.data.spec5_num){
			tmp+=r.data.spec5_num+"分/";
		}
		if(r.data.spec5_l){
			tmp+=r.data.spec5_l+"L";
		}
		if(r.data.spec5_l !== '' && r.data.spec5_s !== ''){
			tmp+=",";
		}
		if(r.data.spec5_s){
			tmp+=r.data.spec5_s+"S";
		}
		tmp+="</span>";
		return tmp;
	}
};
var spec6_render = function(v,p,r){
	if(r.data.spec6 === '1'){
		return "<span class=\"spec_info\">打洞</span>";
	}else{
		return '';
	}
};
var bad_render = function(v){
	return "<span class=\"bad_num\">"+v+"</span>";
};
var last_render = function(v,p,r){
	return r.data.num+r.data.bad_num-r.data.ok_num;
};
/* batches end */

/* ipad */
var ipad_img_render = function(v){
	if(v !== ''){
		var tmp = "<img src=\"public/files/images/"+v+"\">";
		return tmp;
	}
}
var ipad_size_render = function(v,r){
	tmp='<table class="size_tb">'+
		'<tr><td class="xsize">'+ipad_in_render(r.get('x1'),r)+'</td><td class="ysize">'+ipad_in_render(r.get('y1'),r)+'</td><td class="uname">&nbsp;</td></tr>'+
		'<tr><td class="xsize">'+ipad_in_render(r.get('x2'),r)+'</td><td class="ysize">'+ipad_in_render(r.get('y2'),r)+'</td><td class="uname">'+r.get('uname')+'</td></tr>'+
		'</table>';
	return tmp;
}
var ipad_in_render = function(v,r){
	if(v === ''){
    	return '';
    }else if(r.get('uname') !== 'in'){
    	return v;
    }else{
    	tmp = v.split('.')[0];
    	if(typeof v.split('.')[1] !== 'undefined'){
    		tmp+="<sup>"+v.split('.')[1]+"</sup>";
    	}
    	return tmp;
    }
}

var ipad_spec_render = function(v,r){
	var tmp = new Array();
	if(ipad_spec1_render(v,r)){
		tmp.push(ipad_spec1_render(v,r));
	}
	if(ipad_spec2_render(v,r)){
		tmp.push(ipad_spec2_render(v,r));
	}
	if(ipad_spec3_render(v,r)){
		tmp.push(ipad_spec3_render(v,r));
	}
	if(ipad_spec4_render(v,r)){
		tmp.push(ipad_spec4_render(v,r));
	}
	if(ipad_spec5_render(v,r)){
		tmp.push(ipad_spec5_render(v,r));
	}
	if(ipad_spec6_render(v,r)){
		tmp.push(ipad_spec6_render(v,r));
	}
	return tmp.join(',');
};
var ipad_spec1_render = function(v,r){
	if(r.get('spec1_l') === '' && r.get('spec1_s') === ''){
		return '';
	}else if(r.get('spec1_l') === '2' && r.get('spec1_s') === '2'){
		return "光4";
	}else{
		tmp="光";
		if(r.get('spec1_l')){
			tmp+=r.get('spec1_l')+"L";
		}
		if(r.get('spec1_l') !== '' && r.get('spec1_s') !== ''){
			tmp+=",";
		}
		if(r.get('spec1_s')){
			tmp+=r.get('spec1_s')+"S";
		}
		return tmp;
	}
};
var ipad_spec2_render = function(v,r){
	if(r.get('spec2_num') === '' && r.get('spec2_l') === '' && r.get('spec2_s') === ''){
		return '';
	}else if(r.get('spec2_l') === '2' && r.get('spec2_s') === '2'){
		return "面"+r.get('spec2_num')+'分/4';
	}else{
		tmp="面";
		if(r.get('spec2_num')){
			tmp+=r.get('spec2_num')+"分/";
		}
		if(r.get('spec2_l')){
			tmp+=r.get('spec2_l')+"L";
		}
		if(r.get('spec2_l') !== '' && r.get('spec2_s') !== ''){
			tmp+=",";
		}
		if(r.get('spec2_s')){
			tmp+=r.get('spec2_s')+"S";
		}
		return tmp;
	}
};
var ipad_spec3_render = function(v,r){
	tmp="合";
	if(r.get('spec3_l') === '' && r.get('spec3_s') === ''){
		return '';
	}else if(r.get('spec3_l')){
		tmp+=r.get('spec3_l')+"L";
	}
	if(r.get('spec3_l') !== '' && r.get('spec3_s') !== ''){
		tmp+=",";
	}
	if(r.get('spec3_s')){
		tmp+=r.get('spec3_s')+"S";
	}
	return tmp;
};
var ipad_spec4_render = function(v,r){
	if(r.get('spec4_l') === '' && r.get('spec4_s') === ''){
		return '';
	}else if(r.get('spec4_l') === '2' && r.get('spec4_s') === '2'){
		return "異光4";
	}else{
		tmp="異光";
		if(r.get('spec4_l')){
			tmp+=r.get('spec4_l')+"L";
		}
		if(r.get('spec4_l') !== '' && r.get('spec4_s') !== ''){
			tmp+=",";
		}
		if(r.get('spec4_s')){
			tmp+=r.get('spec4_s')+"S";
		}
		return tmp;
	}
};
var ipad_spec5_render = function(v,r){
	if(r.get('spec5_num') === '' && r.get('spec5_l') === '' && r.get('spec5_s') === ''){
		return '';
	}else if(r.get('spec5_l') === '2' && r.get('spec5_s') === '2'){
		return "異面"+r.get('spec5_num')+'分/4';
	}else{
		tmp="異面";
		if(r.get('spec5_num')){
			tmp+=r.get('spec5_num')+"分/";
		}
		if(r.get('spec5_l')){
			tmp+=r.get('spec5_l')+"L";
		}
		if(r.get('spec5_l') !== '' && r.get('spec5_s') !== ''){
			tmp+=",";
		}
		if(r.get('spec5_s')){
			tmp+=r.get('spec5_s')+"S";
		}
		return tmp;
	}
};
var ipad_spec6_render = function(v,r){
	if(r.get('spec6') === '1'){
		return "打洞";
	}else{
		return '';
	}
};
/* ipad end */