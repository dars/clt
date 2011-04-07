<?php
class Bad extends Controller{
	function __construct(){parent::Controller();}
	function index(){
		$this->db->select('a.*,e.modified as bdate,b.content,e.batch_num,d.name as uname,f.name as cname,e.order_id,b.x1,b.y1,b.x2,b.y2,b.spec1_l,b.spec1_s,b.spec2_num,b.spec2_l,b.spec2_s,b.spec3_l,b.spec3_s,b.spec4_l,b.spec4_s,b.spec5_num,b.spec5_l,b.spec5_s,b.spec6,b.spec7,b.spec8,c.name as pname');
		$this->db->join('batches as e','a.batch_id = e.id','left');
		$this->db->join('orders as b','e.order_id = b.id','left');
		$this->db->join('products as c','b.product_id = c.id','left');
		$this->db->join('units as d','b.unit_id = d.id','left');
		$this->db->join('customers as f','b.customer_id = f.id','left');
		if($this->input->post('status') != 2){
			$this->db->where('a.status',$this->input->post('status'));
		}
		$this->db->order_by('a.id','DESC');
		$query = $this->db->get('bad as a');
		$res = new stdClass();
		$res->root = $query->result();
		if($this->input->post('status') != 2){
			$this->db->where('status',$this->input->post('status'));
		}
		$res->totalProperty = $this->db->count_all_results('bad');
		echo json_encode($res);
	}
	function xls(){
		$this->load->plugin('libs');
		$this->load->library('phpexcel');
		$this->load->library('PHPExcel/iofactory');
		
		$this->db->select('a.*,b.content,e.batch_num,d.name as uname,f.name as cname,e.order_id,b.x1,b.y1,b.x2,b.y2,b.spec1_l,b.spec1_s,b.spec2_num,b.spec2_l,b.spec2_s,b.spec3_l,b.spec3_s,b.spec4_l,b.spec4_s,b.spec5_num,b.spec5_l,b.spec5_s,b.spec6,c.name as pname');
		$this->db->join('batches as e','a.batch_id = e.id','left');
		$this->db->join('orders as b','e.order_id = b.id','left');
		$this->db->join('products as c','b.product_id = c.id','left');
		$this->db->join('units as d','b.unit_id = d.id','left');
		$this->db->join('customers as f','b.customer_id = f.id','left');
		$this->db->where('a.status',0);
		$this->db->order_by('a.id','DESC');
		$query = $this->db->get('bad as a');
		$res = $query->result();
		
		$xls = new PHPExcel();
		$xls->getProperties()->setTitle('TITLE')
							 ->setDescription('description');
		$xls->setActiveSheetIndex(0);
		
		$xls->getActiveSheet()->setCellValue('A1','');
		$xls->getActiveSheet()->setCellValue('B1','訂單編號');
		$xls->getActiveSheet()->setCellValue('C1','批號');
		$xls->getActiveSheet()->setCellValue('D1','產品名稱');
		$xls->getActiveSheet()->setCellValue('E1','客戶名稱');
		$xls->getActiveSheet()->setCellValue('F1','尺寸X1');
		$xls->getActiveSheet()->setCellValue('G1','Y1');
		$xls->getActiveSheet()->setCellValue('H1','X2');
		$xls->getActiveSheet()->setCellValue('I1','Y2');
		$xls->getActiveSheet()->setCellValue('J1','破片數量');
		$xls->getActiveSheet()->setCellValue('K1','光邊');
		$xls->getActiveSheet()->setCellValue('L1','面取');
		$xls->getActiveSheet()->setCellValue('M1','合口');
		$xls->getActiveSheet()->setCellValue('N1','異形光邊');
		$xls->getActiveSheet()->setCellValue('O1','異形面取');
		$xls->getActiveSheet()->setCellValue('P1','建立日期');
		$num=1;
		
		foreach($res as $r):
			$col=$num+1;
			$xls->getActiveSheet()->setCellValue('A'.$col,$num);
			$xls->getActiveSheet()->setCellValue('B'.$col,$r->order_id);
			$xls->getActiveSheet()->setCellValue('C'.$col,$r->batch_id);
			$xls->getActiveSheet()->setCellValue('D'.$col,$r->pname);
			$xls->getActiveSheet()->setCellValue('E'.$col,$r->cname);
			$xls->getActiveSheet()->setCellValue('F'.$col,$r->x1.$r->uname);
			$xls->getActiveSheet()->setCellValue('G'.$col,$r->y1.$r->uname);
			$xls->getActiveSheet()->setCellValue('H'.$col,$r->x2.$r->uname);
			$xls->getActiveSheet()->setCellValue('I'.$col,$r->y2.$r->uname);
			$xls->getActiveSheet()->setCellValue('J'.$col,$r->num);
			$xls->getActiveSheet()->setCellValue('K'.$col,trans_spec1($r->spec1_l,$r->spec1_s));
			$xls->getActiveSheet()->setCellValue('L'.$col,trans_spec2($r->spec2_l,$r->spec2_s,$r->spec2_num));
			$xls->getActiveSheet()->setCellValue('M'.$col,trans_spec3($r->spec3_l,$r->spec3_s));
			$xls->getActiveSheet()->setCellValue('N'.$col,trans_spec4($r->spec4_l,$r->spec4_s));
			$xls->getActiveSheet()->setCellValue('O'.$col,trans_spec5($r->spec5_l,$r->spec5_s,$r->spec5_num));
			$xls->getActiveSheet()->setCellValue('P'.$col,$r->created);
			$num++;
		endforeach;
		$this->db->query("UPDATE bad SET status=1");
		$xls_writer = IOFactory::createWriter($xls,'Excel5');
		$tmp_name=date('YmdHis').'.xls';
		$xls_writer->save('public/files/xls/'.$tmp_name);
		echo 'public/files/xls/'.$tmp_name;
	}
	function bad_sensor(){
		$this->db->select_max('id');
		$query = $this->db->get('bad');
		$res = $query->row();
		echo $res->id;
	}
	function destory(){
		$i=0;
		$sWhere=array();
		$foo = $this->input->post('foo');
		$len=count($foo);
		while($i<$len){
			$this->db->select('a.num,b.order_id');
			$this->db->where('a.id',$foo[$i]);
			$this->db->join('batches as b','a.batch_id = b.id','left');
			$query = $this->db->get('bad as a');
			$res = $query->row();
			$this->db->query('UPDATE orders SET bad_num=bad_num-'.$res->num.' WHERE id = '.$res->order_id);
			
			$this->db->where('id',$foo[$i]);
			$this->db->delete('bad');
			$i++;
		}
		echo '{success:true}';
	}
}