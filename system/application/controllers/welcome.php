<?php
class Welcome extends Controller {
	function __construct(){
		parent::Controller();	
	}	
	function index(){
		$pdata['page_title'] = "群力泰玻璃";
		$this->parser->parse('layout/main',$pdata);
	}
}

/* End of file welcome.php */
/* Location: ./system/application/controllers/welcome.php */