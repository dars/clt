<?php
class History extends Controller{
	function __construct(){parent::Controller();}
	function index(){
		$this->db->select('a.*,f.name as cname,e.num as bnum,d.name as uname,b.img,b.content,b.x1,b.y1,b.x2,b.y2,b.spec1_l,b.spec1_s,b.spec2_num,b.spec2_l,b.spec2_s,b.spec3_l,b.spec3_s,b.spec4_l,b.spec4_s,b.spec5_num,b.spec5_l,b.spec5_s,b.spec6,b.spec7,b.spec8,c.name as pname');
		$this->db->join('orders as b','a.order_id = b.id','left');
		$this->db->join('products as c','b.product_id = c.id','left');
		$this->db->join('units as d','b.unit_id = d.id','left');
		$this->db->join('bad as e','e.batch_id = a.id','left');
		$this->db->join('customers as f','b.customer_id = f.id','left');
		if($this->input->post('keyword')){
			$keyword = $this->input->post('keyword');
			$where = '(a.status=1) and (';
			$where.= "c.name LIKE '%".$keyword."%' or ";
			$where.= "b.x1 = '".$keyword."' or ";
			$where.= "b.x2 = '".$keyword."' or ";
			$where.= "b.y1 = '".$keyword."' or ";
			$where.= "b.y2 = '".$keyword."' or ";
			$where.= "b.content LIKE '%".$keyword."%' or ";
			$where.= "a.num = '".$keyword."' or ";
			$where.= "a.batch_num = '".$keyword."' or ";
			$where.= "f.name LIKE '%".$keyword."%')";
			$this->db->where($where);
		}else{
			$where = '(a.status=1) and (';
			$where.= "a.modified LIKE '".date('Y-m-d',mktime(0,0,0,date('m'),date('d'),date('Y')))."%' or ";
			$this->db->where($where);
		}
		$this->db->order_by('a.batch_num','DESC');
		$query = $this->db->get('batches as a');
		//echo $this->db->last_query();
		$res = new stdClass();
		$res->root = $query->result();
		$res->totalProperty = $query->num_rows();
		echo json_encode($res);
	}
	function save(){
		$tmp = array();
		$tmp['batch_id'] = $this->input->post('id');
		$tmp['num'] = $this->input->post('bad_num');
		$tmp['created'] = date('Y-m-d H:i:s');
		$this->db->insert('bad',$tmp);
		$this->db->where('id',$this->input->post('id'));
		$query = $this->db->get('batches');
		$res = $query->row();
		$this->db->query("UPDATE orders SET bad_num=bad_num+".$this->input->post('bad_num')." WHERE id=".$res->order_id);
		echo '{"success":true}';
	}
	function destory(){
		$i=0;
		$sWhere=array();
		$foo = $this->input->post('foo');
		$len=count($foo);
		while($i<$len){
			$this->db->where('id',$foo[$i]);
			$query = $this->db->get('batches');
			$res = $query->row();
			$this->db->query('UPDATE orders SET ok_num=ok_num-'.$res->num.' WHERE id = '.$res->order_id);
			
			$this->db->where('id',$foo[$i]);
			$this->db->delete('batches');
			$i++;
		}
		echo '{success:true}';
	}
}