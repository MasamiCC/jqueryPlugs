//jquery新增方法
jQuery.extend({
		//页面加载中
		loading: function(a) {
			a.fadeOut("slow");
		},

		//判断是移动端还是pc端
		isPc: function() {
			var userAgentInfo = navigator.userAgent;
			var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
			var flag = true;
			for(var v = 0; v < Agents.length; v++) {
				if(userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false;
					break;
				}
			}
			return flag;
		}

	}),

	(function($) {

		//切换tab
		$.fn.changeTab = function(options) {
				options = $.extend({
					//定义一个对象，设置默认值
					//点击选择区域
					checkedArea: $.noop,

					//切换区域
					changeArea: $.noop,

					//是否复用
					manyTimes: false,

					//给点击元素新增的元素
					checkedClass: 'active',

				}, options);

				//主体区域
				var className = $(this).attr('class');

				//点击区域
				var checkedArea = options.checkedArea;

				//需要新增的class
				var checkedClass = options.checkedClass;

				//切换区域
				var changeArea = options.changeArea;

				//是否复用
				var manyTimes = options.manyTimes;

				//回调函数
				var callBack = options.callBack;

				//点击选择区域触发事件
				$(document).on('click', checkedArea, function() {
					var num = $(this).index();
					$(this).siblings(checkedArea).removeClass(checkedClass);
					$(this).addClass(checkedClass);
					//判断是否有父级元素
					if(manyTimes) {
						$(this).parents('.' + className).find(changeArea).hide();
						$(this).parents('.' + className).find(changeArea).eq(num).show();
					} else {
						$(changeArea).hide();
						$(changeArea).eq(num).show();
					}

					//回调函数
					if(callBack) {
						callBack();
					}
				})

				return this;
			},

			//横向进度条
			$.fn.progress = function(options) { //定义插件方法名
				options = $.extend({
					//定义一个对象，设置默认值

					//百分比数量（默认为1）
					percent: 1,

					//速度（默认为5）
					speed: 5,

					//颜色（默认为黑）
					color: 'black',

					//滚动条是否自己运动（默认为false）
					autoPlay: false,

					//是否显示百分比（默认为false）
					showPercent: true,

					//回调函数（默认为null）
					callBack: $.noop,

				}, options);

				//设置百分比，速度,颜色,是否自己运动
				var percent = options.percent;
				var speed = options.speed;
				var color = options.color;
				var autoPlay = options.autoPlay;
				var showPercent = options.showPercent;
				var callBack = options.callBack;
				var content = $(this);
				var height = parseInt(content.height());
				var width = parseInt(content.width());
				var _width = width * percent;

				//先判断用户有无设置该div的宽度与高度
				if(height > 0 && width > 0) {

				} else {
					alert('请为你的父元素设置下宽高好吧');
				}

				//准备生成子元素
				content.html("<div class='progress_bar'></div>");
				var progressBar = content.find(".progress_bar");
				progressBar.height(height / 2);
				progressBar.css("background-color", color);

				//判断该元素是否自动移动
				if(autoPlay == false) {
					progressBar.width(_width);
				} else {
					var bar = setInterval(function() {
						var nowWidth = parseInt(progressBar.width());
						if(nowWidth <= _width) {
							var barWidth = (nowWidth + 1) + "px";
							progressBar.css("width", barWidth);
						} else {
							//进度条读满后，停止
							clearInterval(bar);
						}
					}, 1);
				}

				//判断百分比是否显示
				if(showPercent == true) {
					var percentArea = "<div class='percent'>" + percent + "</div>";
					progressBar.append(percentArea);
					content.find('.percent').css({
						"height": height / 2,
						"line-height": height / 2 + 'px',
					});
				}

				//回调函数
				if(callBack) {
					callBack();
				}

				return this;
			},

			/*
			 * 图片轮播插件
			 *
			 */
			$.fn.carousel = function(options) { //定义插件方法名
				options = $.extend({
					//定义一个对象，设置默认值

					//轮播方式（默认为按以透明度变化轮播）
					way: 'fade',

					//一列显示的图片数量（默认为1）
					num: 1,

					//滚动速度（默认为100）
					speed: 100,

					//滚动间隔时间（默认为100）
					timer: 100,

					//是否显示下圆角（默认为false）
					showButton: false,

					//是否显示左右箭头（默认为false）
					showArrow: false,

					//是否自动播放（默认为false）
					autoPlay: false,

					//图片高度是否需要自适应
					imgHeight: $.noop,

					//是否一直循环
					isLoop: false,

				}, options);

				//轮播方式
				var way = options.way;
				//显示数量
				var num = options.num;
				//轮播速度
				var speed = options.speed;
				//轮播间隔
				var timer = options.timer;
				//是否显示下圆角
				var showButton = options.showButton;
				//是否显示左右箭头
				var showArrow = options.showArrow;
				//是否自动播放
				var autoPlay = options.autoPlay;
				//图片高度是否自适应
				var imgHeight = options.imgHeight;
				//是否一直循环
				var isLoop = options.isLoop;

				//获取页面元素
				var $content = $(this);
				var $contentDiv = $(this).find('.carousels_div');
				var $contentUl = $(this).find('.carousel_ul');
				var $contentLi = $contentUl.children('li');
				var page_count = $contentLi.length;

				//先判断图片元素是否符合要求
				if($content.width() > 0 && $content.height() > 0) {

				} else {
					alert("请设置元素高度，宽度再来使用好吧")
				}

				//图片高度是否需要自适应
				if(imgHeight === 'auto') {
					//找到图片元素
					var $_img = $content.find('img');
					$content.height($_img.height());
				}

				//一面显示多图片时触发
				if(num > 1 && way === 'scrolls_x') {
					var li_width = $contentDiv.outerWidth() / num;
					$contentLi.outerWidth(li_width);
				} else if(num > 1 && way === 'scrolls_y') {
					var li_height = $content.height() / num;
					$contentLi.height(li_height);
				}

				//如果显示下圆角为true
				if(showButton && num === 1) {
					var $positionUl = $("<ul class='position_ul'></ul>");
					$content.append($positionUl);
					for(var i = 1; i <= page_count; i++) {
						$positionUl.append("<li></li>");
					}
					$positionUl.find('li').eq(0).addClass('cur');
					var id;
					var _this;
					$positionUl.hover(function() {
						_this = $(this);
						id = setTimeout(mouseOver, 100);
					}, function() {
						if(id) {
							clearTimeout(id);
						}
					});
				}

				//如果显示左右箭头为true
				if(showArrow) {
					var $prev = $("<span class='prev'></span>");
					var $next = $("<span class='next'></span>");
					$content.append($prev);
					$content.append($next);
					var time = 0;
					$next.click(function() {
						//判断计时器是否处于关闭状态(为了解决多次点击问题)
						if(time == 0) {
							time = 1; //设定间隔时间（秒）

							//启动计时器，倒计时time秒后自动关闭计时器。
							var index = setInterval(function() {
								time--;
								if(time == 0) {
									clearInterval(index);
								}
							}, 500);

							playLeft();
						}
					});

					$prev.click(function() {
						//判断计时器是否处于关闭状态(为了解决多次点击问题)
						if(time == 0) {
							time = 1; //设定间隔时间（秒）

							//启动计时器，倒计时time秒后自动关闭计时器。
							var index = setInterval(function() {
								time--;
								if(time == 0) {
									clearInterval(index);
								}
							}, 500);

							playRight();
						}
					});
				}
				//设置左移函数
				var playLeft;
				//设置右移函数
				var playRight;
				//设置鼠标移入函数
				var mouseOver;

				switch(way) {
					//渐变(透明度)切换
					case 'fade':
						//隐藏所有li，显示第一个li
						$contentLi.hide();
						$contentLi.eq(0).show();
						$contentUl.addClass('fade_ul');
						var i = 0;
						//左移函数
						playLeft = function() {
							i++;
							i = i > page_count - 1 ? 0 : i;
							$positionUl.find('li').eq(i).addClass('cur').siblings().removeClass("cur");
							$contentLi.eq(i).fadeIn(speed).siblings().fadeOut(speed);
						}

						//右移函数
						playRight = function() {
							i--;
							i = i < 0 ? page_count - 1 : i;
							$positionUl.find('li').eq(i).addClass('cur').siblings().removeClass("cur");
							$contentLi.eq(i).fadeIn(speed).siblings().fadeOut(speed);
						}

						//鼠标移入圆角函数
						mouseOver = function(a) {
							_this.addClass('cur').siblings().removeClass("cur");
							var index = _this.index();
							i = index;
							$contentLi.eq(i).fadeIn(speed).siblings().fadeOut(speed);
						}
						break;

						//左右切换
					case 'scrollX':
						$contentUl.addClass('scrollX_ul');
						var v_width = $content.outerWidth();
						$contentLi.outerWidth(v_width);
						$contentUl.width(v_width * page_count);
						var i = 0;
						playLeft = function() {
							if(i >= page_count - 1) {
								i = 0;
								$contentUl.animate({
									left: '0px'
								}, speed);
								$positionUl.find('li').eq(i).addClass('cur').siblings().removeClass("cur");
							} else {
								i++;
								$contentUl.animate({
									left: '-=' + v_width
								}, speed);
								$positionUl.find('li').eq(i).addClass('cur').siblings().removeClass("cur");
							}
						}

						playRight = function() {
							if(i == 0) {
								i = page_count - 1;
								$contentUl.animate({
									left: '-=' + v_width * (page_count - 1)
								}, speed);
								$positionUl.find('li').eq(i).addClass('cur').siblings().removeClass("cur");
							} else {
								i--;
								$contentUl.animate({
									left: '+=' + v_width
								}, speed);
								$positionUl.find('li').eq(i).addClass('cur').siblings().removeClass("cur");
							}
						}

						//鼠标移入圆角函数
						mouseOver = function() {
							_this.addClass('cur').siblings().removeClass("cur");
							var index = _this.index();
							i = index;
							$contentUl.animate({
								left: -v_width * i
							}, "slow");
						}

						break;

						//上下切换
					case 'scrollY':
						$contentUl.addClass('scrollY_ul');
						var i = 0;
						var v_height = $content.height();
						playLeft = function() {
							if(i >= page_count - 1) {
								i = 0;
								$contentUl.animate({
									top: '0px'
								}, speed);
								$positionUl.find('li').eq(i).addClass('cur').siblings().removeClass("cur");
							} else {
								i++;
								$contentUl.animate({
									top: '-=' + v_height
								}, speed);
								$positionUl.find('li').eq(i).addClass('cur').siblings().removeClass("cur");
							}
						}

						playRight = function() {
							if(i == 0) {
								i = page_count - 1;
								$contentUl.animate({
									top: '-=' + v_height * (page_count - 1)
								}, speed);
								$positionUl.find('li').eq(i).addClass('cur').siblings().removeClass("cur");
							} else {
								i--;
								$contentUl.animate({
									top: '+=' + v_height
								}, speed);
								$positionUl.find('li').eq(i).addClass('cur').siblings().removeClass("cur");
							}
						}

						//鼠标移入圆角函数
						mouseOver = function() {
							_this.addClass('cur').siblings().removeClass("cur");
							var index = _this.index();
							i = index;
							$contentUl.animate({
								top: -v_height * i
							}, "slow");
						}

						break;

						//多图片左右切换
					case 'scrolls_x':
						$contentUl.addClass('scrolls_x_ul');
						//移动距离
						var v_width = $contentLi.outerWidth();
						$contentUl.outerWidth(v_width * ($contentUl.find('li').length + 1));
						var i = 0;
						//判断是否一直循环
						if(isLoop) {
							//复制ul里的元素
							var cloneLi = $contentLi.clone();
							$contentUl.append(cloneLi);
							//左移函数
							playLeft = function() {
								if(i > page_count - num) {
									i = 0;
									$contentUl.animate({
										left: '-=' + v_width
									}, speed, function() {
										$contentUl.css('left', '0px');
									});
								} else {
									i++;
									$contentUl.animate({
										left: '-=' + v_width
									}, speed);
								}
							}
						} else {
							$prev.addClass('stop');

							//左移函数
							playLeft = function() {
								if(i < page_count - num) {
									$prev.removeClass('stop');
									$next.removeClass('stop');
									i++;
									$contentUl.animate({
										left: '-=' + v_width
									}, speed, function() {
										if(i == page_count - num) {
											$next.addClass('stop');
										}
									});
								}
							}

							//右移函数
							playRight = function() {
								if(i > 0) {
									$prev.removeClass('stop');
									$next.removeClass('stop');
									i--;
									$contentUl.animate({
										left: '+=' + v_width
									}, speed, function() {
										if(i == 0) {
											$prev.addClass('stop');
										}
									});
								}
							}

						}

						break;
						//类似公告的上下切换
					case 'scrolls_y':
						showButton = false;
						showArrow = false;
						$contentUl.addClass('scrolls_y_ul');

						//复制ul里的元素
						var cloneLi = $contentLi.clone();
						$contentUl.append(cloneLi);

						//移动距离
						var v_height = $contentLi.outerHeight();
						$contentUl.height(v_height * $contentUl.find('li').length);

						var i = 0;
						//下移函数
						playLeft = function() {
							if(i > page_count - 2) {
								i = 0;
								$contentUl.animate({
									top: '-=' + v_height
								}, speed, function() {
									$contentUl.css('top', '0px');
								});
							} else {
								i++;
								$contentUl.animate({
									top: '-=' + v_height
								}, speed);
							}
						}
						break;
				}
				//如果自动切换为true
				if(autoPlay) {
					var setTime = setInterval(playLeft, timer);
					//鼠标移入清空时间函数
					$content.hover(function() {
						clearInterval(setTime);
					}, function() {
						setTime = setInterval(playLeft, timer);
					});
				}

				return this;
			},

			//表单提交及验证
			//form表单验证函数
			jQuery.fn.formValid = function() {
				var text = $(this).find('.form_text');
				var submitArea = $(this).find(".submit_area");
				var submit = $(this).find(".submit_btn");
				var self_ = $(this);

				//得到焦点
				text.on('focus', function() {
					focus();
				});

				//失去焦点事件
				text.on('blur', function() {
					confirm(event);
				});

				//定义一个改变提示信息的jquery方法
				jQuery.fn.info = function(status, info) {
					$(this).closest('.public_form').addClass(status);
					$(this).closest('.public_form').find('.prompt_message').html(info);
				}

				//文本框重获焦点
				var focus = function() {
					var self = $(event.target);
					self.closest('.public_form').attr('class', 'public_form');
					self.closest('.public_form').find('.prompt_message').empty();
				}

				//文本框失去焦点
				var confirm = function(event) {
					//兼容ie的设置
					var evt = window.event || arguments.callee.caller.arguments[0]; // 获取event对象

					//获取各个对象
					var self = evt.srcElement || evt.target; // 获取触发事件的源对象
					var val = $.trim($(self).val());
					var quality = $(self).attr('name');
					var required = $(self).closest('.public_form').find('.required');

					//进行非空判断
					var isEmpty = function(val) {
						if(val === '') {
							return false
						} else {
							return true;
						}
					}

					//进行姓名判断
					var confirmName = function(num1, num2, val) {
						//校验用户姓名：只能输入4-30个以字母开头的字串
						var patrn = new RegExp("^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){" + num1 + "," + num2 + "}$");
						if(patrn.test(val)) {
							return true;
						} else {
							return false
						}
					}

					//进行密码判断
					var confirmPass1 = function(num1, num2, val) {
						//校验用户密码
						var patrn = new RegExp("^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){" + num1 + "," + num2 + "}$");
						if(patrn.test(val)) {
							return true;
						} else {
							return false
						}
					}

					//验证第二次密码与第一次输入相同
					var confirmPass2 = function(val) {
						//校验密码与第一相同
						var pass = $("input[name='password1']").val();
						if(val == pass) {
							return true;
						} else {
							return false
						}
					}

					//验证邮箱
					var confirmEmail = function(val) {
						//校验邮箱
						var patrn = /^([0-9A-Za-z\-_\.]+)@([0-9A-Za-z]+\.[A-Za-z]{2,3}(\.[A-Za-z]{2})?)$/g;
						if(patrn.test(val)) {
							return true;
						} else {
							return false
						}
					}

					//验证手机号
					var confirmPhone = function(val) {
						//校验用户姓名：只能输入4-30个以字母开头的字串
						var patrn = /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;
						if(patrn.test(val)) {
							return true;
						} else {
							return false
						}
					}

					//验证描述
					var confirmDescribe = function(val) {
						//验证描述不超过100
						var patrn = /^\S{1,100}$/;
						if(patrn.test(val)) {
							return true;
						} else {
							return false
						}
					}

					//进行非空判断
					if($(required).length > 0) {
						var flag = isEmpty(val);
						if(!flag) {
							//输入框里内容为空时
							$(self).info('error', '请填入内容哟');
							return false;
						}
					}
					//正则判断
					var zz;

					if(val != '') {
						switch(quality) {
							//验证姓名
							case 'name':
								zz = confirmName(6, 10, val);
								if(zz) {
									//姓名匹配
									$(self).info('success', '下一步');
								} else {
									//姓名不匹配
									$(self).info('error', '请填入5-9个以字母开头的姓名');
								}
								break;
								//验证密码
							case 'password1':
								zz = confirmPass1(8, 20, val);
								if(zz) {
									//密码匹配
									$(self).info('success', '下一步');
								} else {
									//密码不匹配
									$(self).info('error', '请填入8-20以字母开头的密码');
								}
								break;

								//验证第二次密码与第一次输入相同
							case 'password2':
								zz = confirmPass2(val);
								if(zz) {
									//密码匹配
									$(self).info('success', '密码相同');
								} else {
									//密码与第一次不匹配
									$(self).info('error', '请填入与上一步相同的密码');
								}
								break;

								//验证邮箱格式
							case 'email':
								zz = confirmEmail(val);
								if(zz) {
									//邮箱格式匹配
									$(self).info('success', '下一步');
								} else {
									//邮箱格式不匹配
									$(self).info('error', '请填入正确的邮箱格式');
								}
								break;
								//验证手机号
							case 'phone':
								zz = confirmPhone(val);
								if(zz) {
									//邮箱格式匹配
									$(self).info('success', '下一步');
								} else {
									//邮箱格式不匹配
									$(self).info('error', '请填入正确的手机号');
								}
								break;
								//验证描述不超过100
							case 'describe':
								zz = confirmDescribe(val);
								if(zz) {
									//邮箱格式匹配
									$(self).info('success', '下一步');
								} else {
									//邮箱格式不匹配
									$(self).info('error', '描述不超过100字');
								}
								break;
							default:
								$(self).info('success', '下一步');
						}
					}
				}

				//表单内的提交按钮点击时
				submit.on('click', function() {
					//判断必填表单有无内容
					var sub = true;
					var required_text = self_.find('.required').closest('.public_form').find('.form_text');
					$.each(required_text, function(i, val) {
						if($(val).val() === '') {
							$(val).info('error', '请填入内容哟');
							sub = false;
						}
					});

					var err = self_.find('.error').length;
					if(err > 0) {
						sub = false;
					}

					if(sub) {
						submitArea.empty();
						var submitIng = $("<div class='submit_ing'>提交中<span>...</span></div>")
						submitArea.html(submitIng);

						return true;
					} else {
						return false;
					}
				})
			},

			//模态框
			$.fn.modle = function(options) { //定义插件方法名
				options = $.extend({
					//定义一个对象，设置默认值

					//弹出框class
					modle: $.noop,

					//弹出方式（默认为normal）
					modleWay: 'normal',

				}, options);

				//设置各参数
				var modle = options.modle;
				var modleWay = options.modleWay;
				var modle_content = $(modle).find('.modle_content');
				var modle_close = $(modle).find('.modle_close');
				var modle_content_width = $(modle_content).outerWidth();
				var modle_content_height = $(modle_content).outerHeight();

				//点击展示模态框
				$(this).click(function() {

					//设置body样式，已达到隐藏滚动条的效果
					$('body').addClass('modle_open');

					//模态款弹出方式
					switch(modleWay) {
						case 'normal':
							$(modle_content).css({
								"margin-left": -modle_content_width / 2 + 'px',
								"margin-top": -modle_content_height / 2 + 'px',
								'top': '50%'
							});
							$(modle).show();

							break;

						case 'top':
							$(modle).show();
							$(modle_content).animate({
								top: "10%"
							}, 400)
							break;

					}
				})

				//关闭按钮（模态框消失方式）
				$(modle_close).click(function() {

					//删除body样式
					$('body').removeClass('modle_open');
					//模态款弹出方式
					switch(modleWay) {
						case 'normal':
							$(modle).hide();
							break;
						case 'top':
							$(modle_content).animate({
								top: "-50%"
							}, 200, function() {
								$(modle).hide();
							})
							break;

					}
				})

				return this;
			}
		//悬浮框
		$.fn.suspend = function(options) {
				options = $.extend({
					//定义一个对象，设置默认值

					//是否自动漂浮（默认为true）
					autoFloat: true,

					//运动速度（默认为10）
					speed: 10,

				}, options);

				//设置是否自动浮动，速度
				var autoFloat = options.autoFloat;
				var speed = options.speed;

				//初始值
				var x = 0;
				var y = 0;
				var xin = true;
				var yin = true;
				var step = 1;
				var obj = $(this);
				var closeObj = $(this).find('.close');

				//定义漂浮方法
				var suspend = function() {
					var L = 0;
					var T = 0;
					var R = document.documentElement.clientWidth - obj.outerWidth();
					var B = document.documentElement.clientHeight - obj.outerHeight();
					obj.css({
						"left": x + document.documentElement.scrollLeft + 'px',
						"top": y + document.documentElement.scrollTop + 'px'
					});
					x = x + step * (xin ? 1 : -1);
					if(x < L) {
						xin = true;
						x = L
					}
					if(x > R) {
						xin = false;
						x = R
					}
					y = y + step * (yin ? 1 : -1)
					if(y < T) {
						yin = true;
						y = T
					}
					if(y > B) {
						yin = false;
						y = B
					}
				}

				/*判断是否自动漂浮*/
				if(autoFloat) {
					var time = setInterval(suspend, speed);
					/*鼠标移入移出事件*/
					obj.hover(function() {
						clearInterval(time);
					}, function() {
						time = setInterval(suspend, speed);
					})
				}

				/*关闭按钮点击事件*/
				closeObj.click(function() {
					obj.hide();
				})
				return this;
			},

			//定义一个美化select的方法
			$.fn.selectric = function() {
				//定义一些数据
				$.each($(this), function(key, val) {
					var $_select = $(val);
					var $_pSelect = $(this).parent();

					//把原select隐藏
					$_select.hide();

					//生成一个模拟selece的div
					var selecTric = $(
						"<div class='selectric'>" +
						"<span class='selectric_span'>" + "</span>" +
						"<b>" + "▾</b>" +
						"</div>"
					);

					//生成一个模拟option的div
					var optionTric = $(
						"<div class='selectric-items'>" +
						"<div class='selectric-scroll'>" +
						"<ul>" +
						"</ul>" +
						"</div>" +
						"</div>"
					);

					$_pSelect.append(selecTric);
					$_pSelect.append(optionTric);

					//调用插件美化进度条插件
					//					optionTric.find('.selectric-scroll').mCustomScrollbar({
					//						theme: "minimal-dark"
					//					});

					//先加入一个空的li
					optionTric.find('ul').append("<li class='active'></li>");

					//把select的option加到模拟option的div中
					$.each($_select.find('option'), function(key, val) {
						var liTric = $(
							"<li>" + val.innerHTML +
							"</li>"
						);
						optionTric.find('ul').append(liTric);
					});

					//模拟option的div的显示与隐藏
					$_pSelect.on('click', '.selectric', function(e) {
						e.stopPropagation();
						$('.selectric-items').css('visibility', 'hidden');
						optionTric.css('visibility', 'visible');
					});

					$(document).on('click', function(e) {
						optionTric.css('visibility', 'hidden');
					});

					//模拟option的div中的li被点击事件
					$_pSelect.on('click', '.selectric-scroll li', function(event) {
						//兼容ie的设置
						var evt = window.event || arguments.callee.caller.arguments[0]; // 获取event对象

						//获取各个对象
						var self = evt.srcElement || evt.target; // 获取触发事件的源对象
						var liHtml = $.trim($(self).html());

						//改变li本身的class
						$(self).addClass('active').siblings().removeClass('active');

						//改变页面中元素
						selecTric.find('.selectric_span').html(liHtml);

						//得到序号并改变select的选中状态
						var index = $(self).index();
						$_select.find('option').eq(index).prop("selected", true);
						//						$_select.trigger('click');

					});
				});

				return this;
			}

		//伸缩的ul的点击事件				  	
		$(document).on('click', '.layout_item_title', function() {
			$(".layout_item").removeClass("layout_itemed");
			if($(this).next('.treeview-menu').css("display") == "none") {
				$(this).parent().addClass("layout_itemed");
			} else {
				$(this).parent().removeClass("layout_itemed");
			}

			var $_content = $(this).next(".layout_item_content");
			$('.layout_item_content').not($_content).slideUp(500);
			$_content.slideToggle(500);
		})

	})(window.jQuery)

/*jquery新增判断浏览器版本*/
jQuery.browser = {};
(function() {
	jQuery.browser.msie = false;
	jQuery.browser.version = 0;
	if(navigator.userAgent.match(/MSIE ([0-9]+)./)) {
		jQuery.browser.msie = true;
		jQuery.browser.version = RegExp.$1;
	}
})();

