<?php
class Property extends Controller{
	function __construct(){parent::Controller();}
	function save(){
		$time = $this->input->post('time');
		if($time<3){
			$time=3;
		}
		$tmp['refresh_time'] = $time;
		$this->db->update('property',$tmp);
		echo '{success:true}';
	}
}