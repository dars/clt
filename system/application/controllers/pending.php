<?php
class Pending extends Controller{
	function __construct(){parent::Controller();}
	function index(){
		$this->db->select('a.*,(a.num+a.bad_num-a.ok_num) as num2,b.name as pname,c.name as cname,d.name as uname');
		$this->db->join('products as b','a.product_id = b.id','left');
		$this->db->join('customers as c','a.customer_id = c.id','left');
		$this->db->join('units as d','a.unit_id = d.id','left');
		
		if($this->input->post('keyword')){
			$keyword = $this->input->post('keyword');
			$where = '((a.num+a.bad_num-a.ok_num-a.batch_num)>0) and (';
			$where.= "b.name LIKE '%".$keyword."%' or ";
			$where.= "a.x1 = '".$keyword."' or ";
			$where.= "a.x2 = '".$keyword."' or ";
			$where.= "a.y1 = '".$keyword."' or ";
			$where.= "a.y2 = '".$keyword."' or ";
			$where.= "a.num = '".$keyword."' or ";
			$where.= "c.name LIKE '%".$keyword."%')";
			$this->db->where($where);
		}else{
			$this->db->where('(a.num+a.bad_num-a.ok_num-a.batch_num)>0');
		}
		$this->db->order_by('a.id','DESC');
		$query = $this->db->get('orders as a');
		//echo $this->db->last_query();
		$res = new stdClass();
		$res->root = $query->result();
		$res->totalProperty = $this->db->count_all_results('orders');
		echo json_encode($res);
	}
	function save(){
		$tmp = array();
		if($this->input->post('id')){
			$this->db->where('order_id',$this->input->post('id'));
			$this->db->where('status',0);
			$count = $this->db->count_all_results('batches');
			if($count<1){
				$tmp['order_id'] = $this->input->post('id');
				$tmp['num'] = $this->input->post('num');
				$tmp['created'] = date('Y-m-d H:i:s');
				$this->db->insert('batches',$tmp);
			}else{
				$this->db->where('order_id',$this->input->post('id'));
				$this->db->where('status',0);
				$this->db->set('num','num+'.$this->input->post('num'),false);
				$this->db->set('modified',date('Y-m-d H:i:s'));
				$this->db->update('batches');
			}
			$this->db->query("UPDATE orders SET batch_num=batch_num+".$this->input->post('num')." WHERE id=".$this->input->post('id'));
		}
		echo '{"success":true}';
	}
	function xls(){
		$this->load->plugin('libs');
		$this->load->library('phpexcel');
		$this->load->library('PHPExcel/iofactory');
		
		$this->db->select('a.*,(a.num+a.bad_num-a.ok_num) as num2,b.name as pname,c.name as cname,d.name as uname');
		$this->db->join('products as b','a.product_id = b.id','left');
		$this->db->join('customers as c','a.customer_id = c.id','left');
		$this->db->join('units as d','a.unit_id = d.id','left');
		$this->db->where('(a.num+a.bad_num-a.ok_num)>0');
		$this->db->order_by('a.product_id','ASC');
		$query = $this->db->get('orders as a');
		$res = $query->result();
		
		$xls = new PHPExcel();
		$xls->getProperties()->setTitle('TITLE')
							 ->setDescription('description');
		$xls->setActiveSheetIndex(0);
		
		$xls->getActiveSheet()->setCellValue('A1','');
		$xls->getActiveSheet()->setCellValue('B1','訂單編號');
		$xls->getActiveSheet()->setCellValue('C1','產品名稱');
		$xls->getActiveSheet()->setCellValue('D1','客戶名稱');
		$xls->getActiveSheet()->setCellValue('E1','尺寸X1');
		$xls->getActiveSheet()->setCellValue('F1','Y1');
		$xls->getActiveSheet()->setCellValue('G1','X2');
		$xls->getActiveSheet()->setCellValue('H1','Y2');
		$xls->getActiveSheet()->setCellValue('I1','訂單數量');
		$xls->getActiveSheet()->setCellValue('J1','剩餘數量');
		$xls->getActiveSheet()->setCellValue('K1','完成數量');
		$xls->getActiveSheet()->setCellValue('L1','破片數量');
		$xls->getActiveSheet()->setCellValue('M1','加工細項');
		$xls->getActiveSheet()->setCellValue('N1','備註');
		$xls->getActiveSheet()->setCellValue('O1','建立日期');
		$num=1;
		
		foreach($res as $r):
			$col=$num+1;
			$xls->getActiveSheet()->setCellValue('A'.$col,$num);
			$xls->getActiveSheet()->setCellValue('B'.$col,$r->id);
			$xls->getActiveSheet()->setCellValue('C'.$col,$r->pname);
			$xls->getActiveSheet()->setCellValue('D'.$col,$r->cname);
			if($r->x1 != ''){
				$xls->getActiveSheet()->setCellValue('E'.$col,$r->x1.$r->uname);
			}
			if($r->y1 != ''){
				$xls->getActiveSheet()->setCellValue('F'.$col,$r->y1.$r->uname);
			}
			if($r->x2 != ''){
				$xls->getActiveSheet()->setCellValue('G'.$col,$r->x2.$r->uname);
			}
			if($r->y2 != ''){
				$xls->getActiveSheet()->setCellValue('H'.$col,$r->y2.$r->uname);
			}
			$xls->getActiveSheet()->setCellValue('I'.$col,$r->num);
			$xls->getActiveSheet()->setCellValue('J'.$col,$r->num2);
			$xls->getActiveSheet()->setCellValue('K'.$col,$r->ok_num);
			$xls->getActiveSheet()->setCellValue('L'.$col,$r->bad_num);
			$xls->getActiveSheet()->setCellValue('M'.$col,trans_spec($r));
			$xls->getActiveSheet()->setCellValue('N'.$col,$r->content);
			$xls->getActiveSheet()->setCellValue('O'.$col,$r->created);
			$num++;
		endforeach;
		$xls_writer = IOFactory::createWriter($xls,'Excel5');
		$tmp_name=date('YmdHis').'.xls';
		$xls_writer->save('public/files/xls/'.$tmp_name);
		echo 'public/files/xls/'.$tmp_name;
	}
}