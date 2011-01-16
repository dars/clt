<?php
class Ipad extends Controller{
	function __construct(){parent::Controller();}
	function index(){
		$pdata=array();
		$this->parser->parse('layout/ipad',$pdata);
	}
}