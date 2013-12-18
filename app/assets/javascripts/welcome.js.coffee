# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$ ->
	$("#phone_number").phoneNumber
  	format: "local"
  	country: "US"
	$("#phone_number").focus()

	$("#download-cta").click ->
		$("html, body").css(overflow: "hidden", height: "100%")
		$("body").addClass("make-way")
		$("#loaded-content").addClass("loaded")
		$("#downloading").fadeIn(800)

	hide_overlay = () ->
		$("html, body").css(overflow: "auto", height: "auto")
		$("body").removeClass("make-way")
		$("#loaded-content").removeClass("loaded")
		$("#downloading").hide()



	$(document).mouseup (e) ->
	  container = $(".download-region")
	  console.log("click")
	  # if the target of the click isn't the container...
	  # ... nor a descendant of the container
	  hide_overlay()  if not container.is(e.target) and container.has(e.target).length is 0


	

