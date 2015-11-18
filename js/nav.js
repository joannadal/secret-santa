$(function() {
	$('#nav-wrapper').height($("#nav").height());
	
	$('#nav').affix({
		offset: { top: $('#start-offset').offset().top }
	});
});