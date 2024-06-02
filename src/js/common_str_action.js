export default{
	//截取指定长度字符串
	//用法实例:hs_substr_format('上海自来水',3);
	//如果$Boolean为true，则超出部分用省略号，如果$Boolean为false,则直接截取不显示省略号,默认为true
	hs_substr_format($text, $length,$Boolean=true){
		$text=$text.toString();
		let strLength=$text.length;
		if ($text && strLength>$length){
			let ellipsis=$Boolean?'···':'';
			return $text.substr(0,$length)+ellipsis;
		}else{
			return $text;
		}
	}
}
