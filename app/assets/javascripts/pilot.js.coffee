# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$ ->
	$(".pagination-custom > li > a").click ->
	  
	  # grab href, remove pound sign, convert to number
	  item = Number($(this).attr("href").substring(1))
	  
	  # slide to number -1 (account for zero indexing)
	  $("#myCarousel").carousel item - 1
	  
	  # remove current active class
	  $(".pagination-custom .active").removeClass "active"
	  
	  # add active class to just clicked on item
	  $(this).parent().addClass "active"

	  buttonToFinish()
	  
	  # don't follow the link
	  false

	# bind 'slid' function
	$("#myCarousel").bind "slid.bs.carousel", ->
		
	  # remove active class
	  $(".pagination-custom .active").removeClass "active"
	  
	  # get index of currently active item
	  idx = $("#myCarousel .item.active").index()
	  
	  # select currently active item and add active class
	  $(".pagination-custom li:eq(" + idx + ")").addClass "active"

	  buttonToFinish()
	  return

	buttonToFinish = () ->
		idx = $("#myCarousel .item.active").index()
		if idx != 4
			$("#slideButton").text("Next")
			return 

		$("#slideButton").text("Finish")

	$("#slideButton").click ->
		idx = $("#myCarousel .item.active").index()
		return if idx != 4
		$("#pilot_form").submit()

	$("#other-team").click ->
		$("#other-team").hide()
		$("#other-team-input").show()

	$("#other-services").click ->
		$("#other-services").hide()
		$("#other-services-input").show()
		
             


