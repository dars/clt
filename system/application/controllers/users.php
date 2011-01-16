<?php
class Users extends Controller{
	function __construct(){parent::Controller();}
	function login(){
		$this->db->where('username',$this->input->post('username'));
		$this->db->where('password',$this->input->post('password'));
		$count = $this->db->count_all_results('users');
		if($count == 1){
			$this->db->where('username',$this->input->post('username'));
			$this->db->where('password',$this->input->post('password'));
			$query = $this->db->get('users');
			$res = new stdClass();
			$res->data = $query->row();
			
			$query2 = $this->db->get('property');
			$res2 = $query2->row();
			$res->refresh_time = $res2->refresh_time;
			
			$res->success = true;
			echo json_encode($res);
		}else{
			echo '{success:false}';
		}
	}
	function index(){
		$this->db->order_by('id','DESC');
		$query = $this->db->get('users');
		$res = new stdClass();
		$res->root = $query->result();
		$res->totalProperty = $this->db->count_all_results('users');
		echo json_encode($res);
	}
	function save(){
		$tmp = array();
		$tmp_time = date('Y-m-d H:i:s');
		if($this->input->post('username')){
			$tmp['username'] = $this->input->post('username');
		}
		if($this->input->post('password')){
			$tmp['password'] = $this->input->post('password');
		}
		if($this->input->post('status')){
			$tmp['status'] = $this->input->post('status');
		}
		if($this->input->post('permission1')){
			$tmp['permission1'] = $this->input->post('permission1');
		}
		if($this->input->post('permission2')){
			$tmp['permission2'] = $this->input->post('permission2');
		}
		if($this->input->post('permission3')){
			$tmp['permission3'] = $this->input->post('permission3');
		}
		if($this->input->post('permission4')){
			$tmp['permission4'] = $this->input->post('permission4');
		}
		if($this->input->post('permission5')){
			$tmp['permission5'] = $this->input->post('permission5');
		}
		if($this->input->post('permission6')){
			$tmp['permission6'] = $this->input->post('permission6');
		}
		if($this->input->post('permission7')){
			$tmp['permission7'] = $this->input->post('permission7');
		}
		if($this->input->post('permission8')){
			$tmp['permission8'] = $this->input->post('permission8');
		}
		if($this->input->post('permission9')){
			$tmp['permission9'] = $this->input->post('permission9');
		}
		$tmp['modified'] = $tmp_time;
		if($this->input->post('id')){
			$this->db->where('id',$this->input->post('id'));
			$this->db->update('users',$tmp);
		}else{
			$tmp['created'] = $tmp_time;
			$this->db->insert('users',$tmp);
		}
		echo '{success:true}';
	}
	function destory(){
		$i=0;
		$sWhere=array();
		$foo = $this->input->post('foo');
		$len=count($foo);
		while($i<$len){
			$this->db->where('id',$foo[$i]);
			$this->db->delete('users');
			$i++;
		}
		echo '{success:true}';
	}
}