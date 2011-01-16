<?php
class Customers extends Controller{
	function __construct(){parent::Controller();}
	function index(){}
	function read(){
		$this->db->order_by('id','DESC');
		$query = $this->db->get('customers');
		$res = new stdClass();
		$res->data = $query->result();
		echo json_encode($res);
	}
	function create(){
		$data=json_decode($this->input->post('data'));
		$tmp = array();
		$tmp_time = date('Y-m-d H:i:s');
		$tmp['name'] = $data->name;
		$tmp['status'] = $data->status;
		$tmp['created'] = $tmp_time;
		$tmp['modified'] = $tmp_time;
		$this->db->insert('customers',$tmp);
		echo '{success:true}';
	}
	function update(){
		$data=json_decode($this->input->post('data'));
		$tmp = array();
		$this->db->where('id',$data->id);
		$tmp['name'] = $data->name;
		$tmp['status'] = $data->status;
		$tmp['modified'] = date('Y-m-d H:i:s');
		$this->db->update('customers',$tmp);
		echo '{success:true}';
	}
	function destroy(){
		$data=json_decode($this->input->post('data'));
		$this->db->where('id',$data);
		$this->db->delete('customers');
		echo '{success:true}';
	}
	function combo_list(){
		$this->db->select('id,name');
		$this->db->order_by('id','ASC');
		$this->db->where('status',1);
		$query = $this->db->get('customers');
		$res = new stdClass();
		$res->root = $query->result();
		echo json_encode($res);
	}
}