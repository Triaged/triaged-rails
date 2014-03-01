# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$ ->
	#$("#phone_number").phoneNumber
  #	format: "local"
  #	country: "US"
  $("#phone_number").focus()

	$(window).scroll ->
		if($('#i1').visible())
			$('#i1').addClass("slideUp")

	$("#download-cta").click ->
		if($("#footer").hasClass("mobile"))
			 window.location.href = "https://itunes.apple.com/us/app/triage-everything-thats-happening/id744662903?ls=1&mt=8"
		else
			$("body").css(overflow: "hidden")
			$("body").addClass("make-way")
			$("#loaded-content").addClass("loaded")
			$("#downloading").fadeIn(800)

	hide_overlay = () ->
		$("body").css(overflow: "auto")
		$(".hero-border").css(height: "100%")
		$("body").removeClass("make-way")
		$("#loaded-content").removeClass("loaded")
		$("#downloading").hide()

	$(".service-icon a img").click ->
		
		if $(".active-card").first().attr('id') == "c#{this.id}"
			return false

		$(".service-cards img").hide()
		$(".service-cards img").removeClass("active-card")
		$("#c#{this.id}").removeClass("hidden-card")
		$("#c#{this.id}").addClass("active-card")
		parentHeight = $('.service-cards').height()
		childHeight = $("#c#{this.id}").height()
		$("#c#{this.id}").css('margin-top', (parentHeight - childHeight) / 2)
		$("#c#{this.id}").fadeIn()
		
		return false



	$(document).mouseup (e) ->
	  container = $(".download-region")
	  # if the target of the click isn't the container...
	  # ... nor a descendant of the container
	  hide_overlay()  if not container.is(e.target) and container.has(e.target).length is 0


	

