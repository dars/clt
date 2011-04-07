<?php
class Batches extends Controller{
	function __construct(){parent::Controller();}
	function index(){
		$this->db->select('a.*,d.name as uname,e.name as cname,b.x1,b.y1,b.x2,b.y2,b.spec1_l,b.spec1_s,b.spec2_num,b.spec2_l,b.spec2_s,b.spec3_l,b.spec3_s,b.spec4_l,b.spec4_s,b.spec5_num,b.spec5_l,b.spec5_s,b.spec6,b.spec7,b.spec8,b.content,c.name as pname');
		$this->db->join('orders as b','a.order_id = b.id','left');
		$this->db->join('products as c','b.product_id = c.id','left');
		$this->db->join('customers as e','b.customer_id = e.id','left');
		$this->db->join('units as d','b.unit_id = d.id','left');
		$this->db->where('a.status',0);
		$this->db->order_by('a.id','DESC');
		$query = $this->db->get('batches as a');
		$res = new stdClass();
		$res->root = $query->result();
		$this->db->where('status',0);
		$res->totalProperty = $this->db->count_all_results('batches');
		echo json_encode($res);
	}
	function save(){
		$this->db->where('status',0);
		$query = $this->db->get('batches');
		$res = $query->result();
		$tmp_orders=array();
		foreach($res as $r){
			array_push($tmp_orders,$r->order_id);
			$this->db->query("UPDATE orders SET ok_num=ok_num+".$r->num." WHERE id=".$r->order_id);
		}
		$this->db->select_max('batch_num');
		$this->db->where('status',1);
		$this->db->where("modified LIKE '".date('Y-m-d')." %'");
		$query = $this->db->get('batches');
		$res = $query->row();
		if($res->batch_num){
			$tmp_num = $res->batch_num+1;
		}else{
			$tmp_num = 1;
		}
		$this->db->query("UPDATE batches SET status=1,batch_num=".$tmp_num.",modified='".date('Y-m-d H:i:s')."' WHERE status=0");
		$this->db->where_in('id',$tmp_orders);
		$this->db->set('batch_num',0);
		$this->db->update("orders");
		echo '{"success":true}';
	}
	function destory(){
		$i=0;
		$sWhere=array();
		$foo = $this->input->post('foo');
		$len = count($foo);
		
		while($i<$len){
			$this->db->where('id',$foo[$i]);
			$query = $this->db->get('batches');
			$res = $query->row();
			$this->db->set('batch_num','batch_num-'.$res->num,true);
			$this->db->where('id',$res->order_id);
			$this->db->update('orders');
			
			$this->db->where('id',$foo[$i]);
			$this->db->delete('batches');
			$i++;
		}
		echo '{success:true}';
	}
}