/*
 * @Author: Wendy 
 * @gitee: https://gitee.com/hi_wendy
 * @Date: 2018-03-09 16:59:29 
 * @Last Modified by: Wendy
 * @Last Modified time: 2018-03-13 09:28:32
 * @Version:0.0.1
 */
var obj = $('#cityBox');
obj.find('.cityTop').on('click','li',function () {
	var index = $(this).index();
	/*头部切换*/
	$(this).addClass('active').siblings().removeClass('active');
	obj.find('.selBox').eq(index).addClass('active').siblings().removeClass('active');
});
var citysData = [];
/*省份选择*/
obj.find('.provinceBox').on('click', 'dd', function() {
	citysData = cityFn(this,cityData3,citysData);
});
var countyData = [];
/*城市选择*/
obj.find('.citysBox').on('click', 'dd', function() {
	countyData = cityFn(this,citysData,countyData);
});
/*县区选择*/
obj.find('.countyBox').on('click', 'dd', function() {
	var dataId = $(this).attr('dataId');
	var dataText = $(this).text();
	$(this).addClass('active').siblings().removeClass('active');
	obj.find('.cityText .countyTxt').attr({
		'dataId':dataId,
		'title':dataText,
		'dataText':dataText
	}).addClass('active').find('em').text(dataText.length > 3 ? dataText.slice(0, 3) +'…':dataText);
});
/*三级联动展开*/
obj.find('.cityText').click(function() {
	if (obj.hasClass('active')&&!obj.find('.cityText').hasClass('active')) {
		obj.removeClass('active');
	}else{
		obj.addClass('active');
	}
});
obj.find('.cityText .icon-jiantou').click(function() {
	obj.find('.cityText').trigger('click');
});
/*text框中的点击跟随*/
obj.find('.cityText').on('click', 'span', function(event) {
	/**阻止冒泡，防止执行父级点击事件 */
	event.stopPropagation();
	var index = $(this).index();
	obj.find('.cityTop li').eq(index).trigger('click');
});
/*text框span关闭*/
obj.find('.cityText').on('click', 'span .iconfont', function(event) {
	event.stopPropagation();
	var index = $(this).closest('span').index();
	var dataId = $(this).closest('span').attr('dataId');
	clearCity(index,dataId,true);
});
/*默认点击（全部）*/
obj.find('.defaultBtn').click(function() {
	obj.find('.cityText span:eq(0) .iconfont').trigger('click');
	obj.find('.cityBtn').trigger('click');
});
/*确定按钮*/
obj.find('.cityBtn').click(function(event) {
	event.stopPropagation();
	obj.removeClass('active');
	/*input赋值*/
	var txt = '';
	for (var i = 0; i < obj.find('.cityText .content span').length; i++) {
		var nObj = obj.find('.cityText .content span').eq(i);
		txt += nObj.attr('dataText');
		if (i==0) {
			obj.find('.cityInput').attr({
				'provinceId':nObj.attr('dataId'),
				'provinceText':nObj.attr('dataText')
			});
		}else if (i==1) {
			obj.find('.cityInput').attr({
				'cityId':nObj.attr('dataId'),
				'cityText':nObj.attr('dataText')
			});
		}else if (i==2) {
			obj.find('.cityInput').attr({
				'countyId':nObj.attr('dataId'),
				'countyText':nObj.attr('dataText')
			});
		}
	}
	obj.find('.cityInput').val(txt);
	console.log(obj.find('.cityInput').val());
	console.log(obj.find('.cityInput').attr('provinceId'),obj.find('.cityInput').attr('provinceText'));
	console.log(obj.find('.cityInput').attr('cityId'),obj.find('.cityInput').attr('cityText'));
	console.log(obj.find('.cityInput').attr('countyId'),obj.find('.cityInput').attr('countyText'));
});
/*城市选择状态清除*/
function clearCity(index,dataId,follow){
	/*text数据清除*/
	obj.find('.cityText span').eq(index).closest('span').attr({
		'dataId':'',
		'title':'',
		'dataText':''}).removeClass('active');
	/*省市区面板选中状态清除*/
	obj.find('.citysContent .selBox').eq(index).find('dd').removeClass('active');
	if (index==0) {
		clearCity(1,dataId);
		clearCity(2,dataId);
		citysData = [];
		countyData = [];
		obj.find('.citysBox dl').html('');
		obj.find('.citysBox .noData').addClass('active');
		obj.find('.countyBox dl').html('');
		obj.find('.countyBox .noData').addClass('active');
		obj.find('.cityText').removeClass('active');
	}else if (index==1) {
		clearCity(2,dataId);
		countyData = [];
		obj.find('.countyBox dl').html('');
		obj.find('.countyBox .noData').addClass('active');
	}else{

	}
	if (follow) {
		/*省市区头部跟随*/
		obj.find('.cityTop li').eq(index).trigger('click');
	}
}

function cityFn(that,sourceArr,newArr) {
	debugger
	var dataId = $(that).attr('dataId');
	var dataText = $(that).text();
	var index = $(that).closest('.selBox').index();
	/*是否状态初始化*/
	if (!$(that).hasClass('active')) {
		/*状态初始化*/
		clearCity(index,dataId,true);
		/*当前选中添加激活状态*/
		$(that).addClass('active');
		/*给文本框添加数据*/
		obj.find('.cityText .content span').eq(index).attr({
			'dataId':dataId,
			'title':dataText,
			'dataText':dataText
		}).addClass('active').find('em').text(dataText.length>3?dataText.slice(0, 3)+'...':dataText);
		/*给文本框添加激活标记*/
		obj.find('.cityText').addClass('active');
		/*给下一级做准备*/
		newArr = [];
		for (var i = 0; i < sourceArr.length; i++) {
			if (sourceArr[i].value==dataId) {
				newArr = sourceArr[i].children||[];
				break;
			}
		}
		/*下一级数据展示*/
		var citysStr = '';
		if (newArr.length>0) {
			for (var i = 0; i < newArr.length; i++) {
				citysStr += '<dd dataId="'+newArr[i].value+'">'+newArr[i].text+'</dd>';
			}
		}
		/**数据填充 */
		obj.find('.selBox').eq(index+1).find('dl').html(citysStr);
		/*如果没有下一级数据的处理*/
		if (citysStr!='') {
			obj.find('.selBox').eq(index+1).find('.noData').removeClass('active');
		}
		/*三级跳转跟随*/
		obj.find('.cityTop li').eq(index+1).trigger('click');
	}else{
		/*三级跳转跟随*/
		obj.find('.cityTop li').eq(index+1).trigger('click');
	}
	/*返回新数组,以便下一次使用*/
	return newArr;
}