<?php
function trans_spec($o){
	$tmp=array();
	if(trans_spec1($o->spec1_l,$o->spec1_s)){
		array_push($tmp,trans_spec1($o->spec1_l,$o->spec1_s));
	}
	if(trans_spec2($o->spec2_l,$o->spec2_s,$o->spec2_num)){
		array_push($tmp,trans_spec2($o->spec2_l,$o->spec2_s,$o->spec2_num));
	}
	if(trans_spec3($o->spec3_l,$o->spec3_s)){
		array_push($tmp,trans_spec3($o->spec3_l,$o->spec3_s));
	}
	if(trans_spec4($o->spec4_l,$o->spec4_s)){
		array_push($tmp,trans_spec4($o->spec4_l,$o->spec4_s));
	}
	if(trans_spec5($o->spec5_l,$o->spec5_s,$o->spec5_num)){
		array_push($tmp,trans_spec5($o->spec5_l,$o->spec5_s,$o->spec5_num));
	}
	if($o->spec6 == 1){
		array_push($tmp,'打洞');
	}
	return join($tmp,',');
}
function trans_spec1($l,$s){
	if(empty($l) && empty($s)){
		return '';
	}else if($l == 2 && $s == 2){
		return '光4';
	}else{
		$tmp='';
		if(!empty($l)){
			$tmp.=$l.'L';
		}
		if(!empty($l) && !empty($s)){
			$tmp.=",";
		}
		if(!empty($s)){
			$tmp.=$s.'S';
		}
		return $tmp;
	}
}
function trans_spec2($l,$s,$num){
	if(empty($l) && empty($s)){
		return '';
	}else if($l == 2 && $s == 2){
		return $num.'分/4';
	}else{
		$tmp='';
		if(!empty($num)){
			$tmp.=$num.'分/';
		}
		if(!empty($l)){
			$tmp.=$l.'L';
		}
		if(!empty($l) && !empty($s)){
			$tmp.=",";
		}
		if(!empty($s)){
			$tmp.=$s.'S';
		}
		return $tmp;
	}
}
function trans_spec3($l,$s){
	$tmp='';
	if(!empty($l)){
		$tmp.=$l.'L';
	}
	if(!empty($l) && !empty($s)){
		$tmp.=",";
	}
	if(!empty($s)){
		$tmp.=$s.'S';
	}
	return $tmp;
}
function trans_spec4($l,$s){
	if(empty($l) && empty($s)){
		return '';
	}else if($l == 2 && $s == 2){
		return '異光4';
	}else{
		$tmp='';
		if(!empty($l)){
			$tmp.=$l.'L';
		}
		if(!empty($l) && !empty($s)){
			$tmp.=",";
		}
		if(!empty($s)){
			$tmp.=$s.'S';
		}
		return $tmp;
	}
}
function trans_spec5($l,$s,$num){
	if(empty($l) && empty($s)){
		return '';
	}else if($l == 2 && $s == 2){
		return $num.'分/4';
	}else{
		$tmp='';
		if(!empty($num)){
			$tmp.=$num.'分/';
		}
		if(!empty($l)){
			$tmp.=$l.'L';
		}
		if(!empty($l) && !empty($s)){
			$tmp.=",";
		}
		if(!empty($s)){
			$tmp.=$s.'S';
		}
		return $tmp;
	}
}