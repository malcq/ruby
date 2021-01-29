# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

ready_post = ->
# Display the image to be uploaded.
  $('.photo_upload').on 'change', (e) ->
    readURL(this);

  readURL = (input) ->
    if (input.files && input.files[0])
      reader = new FileReader()

    reader.onload = (e) ->
      $('.image_to_upload').attr('src', e.target.result).removeClass('hidden');
      $swap = $('.swap')
      if $swap
        $swap.removeClass('hidden')
        $('.image_is_uploaded').addClass('hidden')

    reader.readAsDataURL(input.files[0]);

$(document).on 'ready turbolinks:change turbolinks:load', ->
  ready_post()
  if (window.location.pathname == '/notifications')
    $.ajax '/notifications/read_all',
      type: 'PUT'
      dataType: 'json'
      error: (jqXHR, textStatus, errorThrown) ->
        console.log(errorThrown)
      success: (data, textStatus, jqXHR) ->
        console.log('OPS!!!')