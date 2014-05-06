$ ->

	$(".provider-account").on "tap", ->
		console.log("tap")
		$(".provider-account").removeClass("active")
		$(this).addClass("active")
		$("#account_id").val(this.id)
		$("#account_name").val( $(this).data("name") )
		$("#account_personal").val( $(this).data("personal") )
		$(".btn-custom").prop('disabled', false)