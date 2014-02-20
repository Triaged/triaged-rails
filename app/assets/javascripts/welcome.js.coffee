# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$ ->
	#$("#phone_number").phoneNumber
  #	format: "local"
  #	country: "US"
	$("#phone_number").focus()

	$("#download-cta").click ->
		if($("#footer").hasClass("mobile"))
			 window.location.href = "https://itunes.apple.com/us/app/triage-everything-thats-happening/id744662903?ls=1&mt=8"
		else
			$("html, body").css(overflow: "hidden", height: "100%")
			$("body").addClass("make-way")
			$("#loaded-content").addClass("loaded")
			$("#downloading").fadeIn(800)

	hide_overlay = () ->
		$("html, body").css(overflow: "auto", height: "auto")
		$("body").removeClass("make-way")
		$("#loaded-content").removeClass("loaded")
		$("#downloading").hide()

	$(".service-icon a img").click ->
		
		if $(".active-card").first().attr('id') == "c#{this.id}"
			return false

		$(".service-card img").hide()
		$(".service-card img").removeClass("active-card")
		$("#c#{this.id}").removeClass("hidden-card")
		$("#c#{this.id}").addClass("active-card")
		$("#c#{this.id}").fadeIn()
		
		return false



	$(document).mouseup (e) ->
	  container = $(".download-region")
	  # if the target of the click isn't the container...
	  # ... nor a descendant of the container
	  hide_overlay()  if not container.is(e.target) and container.has(e.target).length is 0


	

