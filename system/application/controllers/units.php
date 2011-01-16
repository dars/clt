<?php
class Units extends Controller{
	function __construct(){parent::Controller();}
	function combo_list(){
		$this->db->select('id,name');
		$this->db->order_by('id','ASC');
		$query = $this->db->get('units');
		$res = new stdClass();
		$res->root = $query->result();
		echo json_encode($res);
	}
}