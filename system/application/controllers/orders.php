<?php
class Orders extends Controller{
	function __construct(){parent::Controller();}
	function index(){
		$this->db->select('a.*,b.name as pname,c.name as cname,d.name as uname');
		$this->db->join('products as b','a.product_id = b.id','left');
		$this->db->join('customers as c','a.customer_id = c.id','left');
		$this->db->join('units as d','a.unit_id = d.id','left');
		if($this->input->post('keyword')){
			$keyword = $this->input->post('keyword');
			$where = "(b.name LIKE '%".$keyword."%' or ";
			$where.= "a.x1 = '".$keyword."' or ";
			$where.= "a.x2 = '".$keyword."' or ";
			$where.= "a.y1 = '".$keyword."' or ";
			$where.= "a.y2 = '".$keyword."' or ";
			$where.= "a.num = '".$keyword."' or ";
			$where.= "a.content LIKE '%".$keyword."%' or ";
			$where.= "c.name LIKE '%".$keyword."%')";
			$this->db->where($where);
		}
		/* 狀態過濾 */
		if($this->input->post('status') == 1){
			$this->db->where('(a.num+a.bad_num-a.ok_num)=0');
		}else if($this->input->post('fstatus') == 2){
		}else{
			$this->db->where('(a.num+a.bad_num-a.ok_num)>0');
		}		
		$this->db->order_by('a.id','DESC');
		
		$query = $this->db->get('orders as a');
		$res = new stdClass();
		$res->root = $query->result();
		$res->totalProperty = $this->db->count_all_results('orders');
		echo json_encode($res);
	}
	function read(){
		$this->db->where('id',$this->input->post('id'));
		$query = $this->db->get('orders');
		$res = new stdClass();
		$res->root = $query->result();
		echo json_encode($res);
	}
	function save(){
		$config['upload_path'] = 'public/files/images/';
		$config['allowed_types'] = 'gif|jpg|jpeg|png|bmp';
		$config['overwrite'] = false;
		$config['encrypt_name'] = true;
		$this->load->library('upload',$config);
		$this->upload->initialize($config);
		$img_name = "";
		if($this->upload->do_upload('img')){
			$data=$this->upload->data();
			$config = array();
			$config['image_library'] = 'gd2';
			$config['source_image']	= $data['full_path'];
			$config['create_thumb'] = FALSE;
			$config['maintain_ratio'] = TRUE;
			$config['width'] = 300;
			$config['height'] = 300;
			$this->load->library('image_lib',$config); 
			$this->image_lib->initialize($config);
			$this->image_lib->resize();
			$img_name = $data['file_name'];
		}
		$this->load->model('product_model');
		$this->load->model('customer_model');
		$tmp = array();
		$tmp_time = date('Y-m-d H:i:s');
		$tmp['product_id'] = $this->product_model->chk_prod($this->input->post('product_id'));
		$tmp['customer_id'] = $this->customer_model->chk_cust($this->input->post('customer_id'));
		$tmp['unit_id'] = $this->input->post('unit_id');
		if($this->input->post('x1') != 'X1'){
			$tmp['x1'] = $this->input->post('x1');
		}
		if($this->input->post('y1') != 'Y1'){
			$tmp['y1'] = $this->input->post('y1');
		}
		if($this->input->post('x2') != 'X2'){
			$tmp['x2'] = $this->input->post('x2');
		}
		if($this->input->post('y2') != 'Y2'){
			$tmp['y2'] = $this->input->post('y2');
		}
		$tmp['num'] = $this->input->post('num');
		$tmp['content'] = $this->input->post('content');
		if($this->input->post('spec1_l') != '長'){
			$tmp['spec1_l'] = $this->input->post('spec1_l');
		}
		if($this->input->post('spec1_s') != '短'){
			$tmp['spec1_s'] = $this->input->post('spec1_s');
		}
		if($this->input->post('spec2_num') != '分'){
			$tmp['spec2_num'] = $this->input->post('spec2_num');
		}
		if($this->input->post('spec2_l') != '長'){
			$tmp['spec2_l'] = $this->input->post('spec2_l');
		}
		if($this->input->post('spec2_s') != '短'){
			$tmp['spec2_s'] = $this->input->post('spec2_s');
		}
		if($this->input->post('spec3_l') != '長'){
			$tmp['spec3_l'] = $this->input->post('spec3_l');
		}
		if($this->input->post('spec3_s') != '短'){
			$tmp['spec3_s'] = $this->input->post('spec3_s');
		}
		if($this->input->post('spec4_l') != '長'){
			$tmp['spec4_l'] = $this->input->post('spec4_l');
		}
		if($this->input->post('spec4_s') != '短'){
			$tmp['spec4_s'] = $this->input->post('spec4_s');
		}
		if($this->input->post('spec5_num') != '分'){
			$tmp['spec5_num'] = $this->input->post('spec5_num');
		}
		if($this->input->post('spec5_l') != '長'){
			$tmp['spec5_l'] = $this->input->post('spec5_l');
		}
		if($this->input->post('spec5_s') != '短'){
			$tmp['spec5_s'] = $this->input->post('spec5_s');
		}
		if($this->input->post('spec6') == 1){
			$tmp['spec6'] = 1;
		}
		$tmp['created'] = $tmp_time;
		$tmp['modified'] = $tmp_time;
		$tmp['img'] = $img_name;
		if(strlen($this->input->post('id'))>0){
			$this->db->where('id',$this->input->post('id'));
			$this->db->update('orders',$tmp);
		}else{
			$this->db->insert('orders',$tmp);
		}
		echo '{success:true}';
		//write_file('public/files/data.rtf',$this->input->post('customer_id'));
	}
	function destory(){
		$i=0;
		$sWhere=array();
		$foo = $this->input->post('foo');
		$len=count($foo);
		while($i<$len){
			$this->db->where('id',$foo[$i]);
			$this->db->delete('orders');
			
			$this->db->select('id');
			$this->db->where('order_id',$foo[$i]);
			$query = $this->db->get('batches');
			$res = $query->result();
			$tmp = array();
			foreach($res as $r){
				array_push($tmp,$r->id);
			}
			if(count($tmp)>0){
				$this->db->where_in('id',$tmp);
				$this->db->delete('bad');
			}
			$this->db->where('order_id',$foo[$i]);
			$this->db->delete('batches');
			$i++;
		}
		echo '{success:true}';
	}
	function order_sensor(){
		$this->db->select_max('id');
		$query = $this->db->get('orders');
		$res = $query->row();
		echo $res->id;
	}
	function reset_num(){
		$this->db->query("DELETE FROM batches WHERE order_id NOT IN(SELECT id FROM orders)");
		$this->db->query("DELETE FROM bad WHERE batch_id NOT IN(SELECT id FROM batches)");
		$this->db->set('bad_num',0);
		$this->db->set('ok_num',0);
		$this->db->set('batch_num',0);
		$this->db->update('orders');
		$query = $this->db->get('orders');
		$res = $query->result();
		foreach($res as $r){
			$this->db->where('order_id',$r->id);
			$this->db->where('status',0);
			$this->db->select_sum('num');
			$query = $this->db->get('batches');
			$batch_res = $query->row();
			$batch_num = (int)$batch_res->num;

			$this->db->where('order_id',$r->id);
			$this->db->where('status',1);
			$this->db->select_sum('num');
			$query = $this->db->get('batches');
			$ok_res = $query->row();
			$ok_num = (int)$ok_res->num;
			
			$this->db->where("batch_id IN(SELECT id FROM batches WHERE order_id=".$r->id.")");
			$this->db->select_sum('num');
			$query = $this->db->get('bad');
			$bad_res = $query->row();
			$bad_num = (int)$bad_res->num;
			
			$this->db->set('bad_num',$bad_num);
			$this->db->set('ok_num',$ok_num);
			$this->db->set('batch_num',$batch_num);
			$this->db->where('id',$r->id);
			$this->db->update('orders');	
		}
		echo '{"subbess":true}';
	}
}