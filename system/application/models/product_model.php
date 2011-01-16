<?php
class Product_model extends Model{
	function __construct(){parent::Model();}
	function chk_prod($id){
		$this->db->where('id',$id);
		if($this->db->count_all_results('products')>0){
			return $id;
		}else{
			$tmp = array();
			$tmp_time = date('Y-m-d H:i:s');
			$tmp['name'] = $id;
			$tmp['status'] = 1;
			$tmp['created'] = $tmp_time;
			$tmp['modified'] = $tmp_time;
			$this->db->insert('products',$tmp);
			return $this->db->insert_id();
		}
	}
}