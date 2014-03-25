# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$ ->
	# $("#pilotForm").bootstrapValidator({
 #        message: 'This value is not valid',
 #        #live: 'enabled',
 #        submitHandler: (validator, form, submitButton) -> {
 #          #form.find('.alert').html('Thanks for signing up. Now you can sign in as ' + validator.getFieldElements('username').val()).show();
          
 #        },
 #        fields: {
 #        	'pilot[name]': {
 #                message: 'The username is not valid',
 #                validators: {
 #                    notEmpty: {
 #                        message: 'Your name is required and can\'t be empty'
 #                    }
                    
 #                }
 #            },
 #           'pilot[email]': {
 #                message: 'The email is not valid',
 #                validators: {
 #                    emailAddress: {
 #                        message: 'The input is not a valid email address'
 #                    }
                    
 #                }
 #            }
 #        }
 #    })



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

	$("#myCarousel").bind "slide.bs.carousel", ->
		#$('#pilotForm').bootstrapValidator('validate')
		return

	# bind 'slid' function
	$("#myCarousel").bind "slid.bs.carousel", ->
		# Scroll to top
	  $('html, body').animate({ scrollTop: 0 }, 'slow')
		
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
		$("#pilotForm").submit()

	$("#other-team").click ->
		$("#other-team").hide()
		$("#other-team-input").show()

	$("#other-services").click ->
		$("#other-services").hide()
		$("#other-services-input").show()
		
             


