$(function() {
	var ajax_url = location.hash.replace(/^#/, '');
	LoadAjaxContent(ajax_url);
	handlerBreadcrumb();

	// 菜单以ajaxload方式打开
	$(".nav-list a").click(function(e) {
		e.preventDefault();
		var url = $(this).attr('href');
		if (url && "#" != url) {
			clickActive($(this));
			handlerBreadcrumb();
			LoadContent(url);
		}
	});

	// hash改变时重新加载页面  支持后退按钮
	$(window).on('hashchange',function(e){
		var ajax_url = location.hash.replace(/^#/, '');
		LoadAjaxContent(ajax_url);
	})
});

// 修改连接为#隔开的url
function LoadContent(url) {
	var oldUrl = location.hash.replace(/^#/, '');
	if (url == oldUrl)
		LoadAjaxContent(url);
	else
		location.href = location.href.split('#')[0]+'#'+url;
}

//以load方式加载中间页面
function LoadAjaxContent(url, data) {
	// 当前url为空时，打开dashboard页面
	if (url.length < 1) {
		url = 'dashboard';
		location.hash = url;
	}
	
	$('.page-content-area').html("");
	$('.ajax-loading-overlay').show();
	$(".page-content-area").css('display','none');
	$.ajax({
		mimeType : 'textml; charset=utf-8', // ! Need set mimeType only
		url : url,
		type : 'GET',
		data : data,
		success : function(rst) {
			$('.page-content-area').html(rst).fadeIn('600');
			$('.ajax-loading-overlay').hide();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$('.page-content-area').html(jqXHR.responseText).fadeIn('600');
			$('.ajax-loading-overlay').hide();
		},
		dataType : "html",
		async : false
	});
}


// 菜单打开时active效果处理
function clickActive(e) {
	$('.nav-list li').each(function() {
		if ($(this).hasClass("active")) {
			$(this).removeClass('active');
		}
	});
	
	var isSubmenu = e.parent().parent().hasClass("submenu");
	
	if (isSubmenu) {
		e.parent().parent().parent().addClass("active");
		e.parent().addClass("active");
	} else {
		e.parent().addClass("active");
	}
}

/*** 处理面包屑 begin ***/
function handlerBreadcrumb() {
	var menuId = '';
	var subMenuId = '';
	$('.nav-list li').each(function() {
		if ($(this).hasClass("active")) {
			var isSubmenu = $(this).parent().hasClass("submenu");
			
			if (isSubmenu) {
				// 面包屑导航
				var menuClasss = $(this).parent().parent().find('a i').attr('class').split(' ');
				var menuIcon = menuClasss[menuClasss.length -1];
				var menuName = $(this).parent().parent().find('a span').text();
				menuId = $(this).parent().parent().find('a').attr('value');
				var subMenuName = $(this).text();
				subMenuId = $(this).find('a').attr('value');
				var breadcrumbHtml = '';
				breadcrumbHtml += '<li> ';
				breadcrumbHtml += '	<i class="ace-icon fa '+menuIcon+' home-icon"></i> ';
				breadcrumbHtml += '	'+menuName+' ';
				breadcrumbHtml += '</li> ';
				breadcrumbHtml += '<li class="active">'+subMenuName+'</li>';
				$(".breadcrumb").html(breadcrumbHtml);
			} else {
				// 面包屑导航
				var menuClasss = $(this).find('a i').attr('class').split(' ');
				var menuIcon = menuClasss[menuClasss.length -1];
				menuId = $(this).find('a').attr('value');
				var menuName = $(this).text();
				var breadcrumbHtml = '<li class="active"><i class="ace-icon fa '+menuIcon+' home-icon"></i>'+menuName+'</li>';
				$(".breadcrumb").html(breadcrumbHtml);
			}
		}
	});
	ajaxDataNoTip('curr_menu', {one_menu:menuId, sub_menu:subMenuId}, function(rst){});
}
/*** 处理面包屑 end ***/



// 调到页面顶部
function goTop() {
	var t = $('#navbar').offset().top;
	$(window).scrollTop(t);
}
// 调到中部顶上
function goContent() {
	var t = $('.page-content-area').offset().top;
	$(window).scrollTop(t);
}

// 返回上一页
function goBack() {
	window.history.go(-1);
	return false;
}

// 公用form提交
function ajaxForm(ajaxCallUrl, frmId, savecallback) {
	$.ajax({
		cache : true,
		type : "POST",
		url : ajaxCallUrl,
		data : $('#' + frmId).serialize(),// frmId
		dataType : "json",
		async : false,
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status == 404)
				messageGritter({
					success : false,
					text : '没有找到url'
				});
			else
				messageGritter({
					success : false,
					text : jqXHR.responseText
				});
		},
		success : function(rst) {
			if (rst.err_code == 0) {
				if (rst.err_msg) {
					messageGritter({
						text : rst.err_msg
					});
				} else {
					messageGritter();
				}
			} else {
				if (rst.err_msg) {
					messageGritter({
						success : false,
						text : rst.err_msg
					});
				} else {
					messageGritter({
						success : false
					});
				}
			}

			if ($.isFunction(savecallback)) {
				savecallback.call(this, rst);
			}
		}
	});
}

//公用form提交
function ajaxFormNoTip(ajaxCallUrl, frmId, savecallback) {
	$.ajax({
		cache : true,
		type : "POST",
		url : ajaxCallUrl,
		data : $('#' + frmId).serialize(),// frmId
		dataType : "json",
		async : false,
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status == 404)
				messageGritter({
					success : false,
					text : '没有找到url'
				});
			else
				messageGritter({
					success : false,
					text : jqXHR.responseText
				});
		},
		success : function(rst) {
			if (rst.err_code != 0) {
				if (rst.err_msg) {
					messageGritter({
						success : false,
						text : rst.err_msg
					});
				} else {
					messageGritter({
						success : false
					});
				}
			}

			if ($.isFunction(savecallback)) {
				savecallback.call(this, rst);
			}
		}
	});
}


/**
 * ajax post提交
 * 
 * @param data
 * @param ajaxCallUrl
 */
function ajaxData(ajaxCallUrl, data, savecallback) {
	$.ajax({
		cache : true,
		type : "post",
		dataType : "json",
		url : ajaxCallUrl,
		data : data,
		async : false,
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status == 404)
				messageGritter({
					success : false,
					text : '没有找到url'
				});
			else
				messageGritter({
					success : false,
					text : jqXHR.responseText
				});
		},
		success : function(rst) {
			if (rst.err_code == 0) {
				if (rst.err_msg) {
					messageGritter({
						text : rst.err_msg
					});
				} else {
					messageGritter();
				}
			} else {
				if (rst.err_msg) {
					messageGritter({
						success : false,
						text : rst.err_msg
					});
				} else {
					messageGritter({
						success : false
					});
				}
			}

			if ($.isFunction(savecallback)) {
				savecallback.call(this, rst);
			}
		}
	});
}

function ajaxDataNoTip(ajaxCallUrl, data, savecallback) {
	$.ajax({
		cache : true,
		type : "post",
		dataType : "json",
		url : ajaxCallUrl,
		data : data,
		async : false,
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status == 404)
				messageGritter({
					success : false,
					text : '没有找到url'
				});
			else
				messageGritter({
					success : false,
					text : jqXHR.responseText
				});
		},
		success : function(rst) {
			if ($.isFunction(savecallback)) {
				savecallback.call(this, rst);
			}

			if (rst.err_code != 0) {
				if (rst.err_msg) {
					messageGritter({
						success : false,
						text : rst.err_msg
					});
				} else {
					messageGritter({
						success : false
					});
				}
			}
		}
	});
}

// 通知提示框
function messageGritter(param) {
	var text = "操作成功!";
	var time = 1000;
	var successClass = 'gritter-success';
	if (param && param.success == false) {
		successClass = 'gritter-error';
		text = "操作失败!";
		time = 1000 * 3;
	}
	if (param && param.text) {
		text = param.text;
	}
	$.gritter.add({
		text : text,
		class_name : successClass,
		time : time
	});
	return false;
};

$(function() {
	// 确认提示框样式支持
	// override dialog's title function to allow for HTML titles
	$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
		_title : function(title) {
			var $title = this.options.title || '&nbsp;';
			if (("title_html" in this.options)
					&& this.options.title_html == true)
				title.html($title);
			else
				title.text($title);
		}
	}));

});

// 确认提示框
function dialogMessage(param) {
	var message = "确认操作？";
	var title = "系统提示";
	var callBackFunc;

	if (param.message)
		message = param.message;
	if (param.title)
		title = param.title;
	if (param.confirm)
		callBackFunc = param.confirm;

	$("#dialog-message p").html(message);

	var dialog = $("#dialog-message")
			.removeClass('hide')
			.dialog(
					{
						modal : true,
						title : "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon fa fa-exclamation-triangle'></i>"
								+ title + "</h4></div>",
						title_html : true,
						buttons : [ {
							text : "Cancel",
							"class" : "btn btn-xs",
							click : function() {
								$(this).dialog("close");
							}
						}, {
							text : "OK",
							"class" : "btn btn-primary btn-xs",
							click : function() {
								$(this).dialog("close");
								if ($.isFunction(callBackFunc)) {
									callBackFunc.call(this, true);
								}
							}
						} ]
					});
}

// 处理字段为undefined时，转成“”
function HandleSpaceToStr(item) {
	if (item == undefined || item == "undefined") {
		return "";
	}
	return item;
}
// 处理字段为undefined时，转成0
function HandleSpaceToZero(item) {
	if (item == "undefined" || item == undefined) {
		return 0;
	}
	return item;
}

//让光标停在文本框内容的最后面 也可选中第几个字符到第几个字符
$.fn.selectRange = function(start, end) {
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};



/** 翻页查询
*/
function queryPageFrm(pageNo) {
	if (!pageNo)
		pageNo = 1;
	var url = "";
	if (true && $("#queryPageFrm")) {
		url = $("#queryPageFrm").attr("action");
		if (url.indexOf('?') > -1) {
			url += "&pageNo=";
		} else {
			url += "?pageNo=";
		}
		url += pageNo;
		$("#queryPageFrm").action = url;
	} else {
		url = document.location + '';
		if (url.indexOf('?') > -1) {
			if (url.indexOf('pageNo') > -1) {
				var reg = /pageNo=\d*/g;
				url = url.replace(reg, 'pageNo=');
			} else {
				url += "&pageNo=";
			}
		} else {
			url += "?pageNo=";
		}
		url += pageNo;
	}
	LoadContent(url + "&" + $("#queryPageFrm").serialize());
	return false;
}

/**
 * 提交查询
 */
function queryFrm() {
	var url = "";
	if (true && $("#queryFrm")) {
		url = $("#queryFrm").attr("action");
	} else {
		url = document.location + '';
	}
	if (url.indexOf('?') == -1) {
		url += "?";
	} else {
		url += "&";
	}
	LoadContent(url + $("#queryFrm").serialize());
	return false;
}
