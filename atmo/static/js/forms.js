$(function() {
  // apply datetimepicker initialization
  $('.datetimepicker').datetimepicker({
    sideBySide: true, // show the time picker and date picker at the same time
    useCurrent: false, // don't automatically set the date when opening the dialog
    format: 'YYYY-MM-DD HH:mm',
    stepping: 5,
    toolbarPlacement: 'top',
    showTodayButton: true,
    showClear: true,
    showClose: true
  });

  // Track keyboard input and check existing Spark job identifiers
  var taken_timeout = 0.5,
      taken_timeout_id;
  $('.identifier-taken-check').keyup(function(event) {
      // get rid of previously set timeouts
      if (taken_timeout_id) {
          window.clearTimeout(taken_timeout_id);
      }
      // the input this was launched from
      var $element = $(this);
      var $form_group = $element.closest('.form-group');
      var $siblings = $element.siblings();
      var $feedback = $siblings.filter('.form-control-feedback');
      var form_instance_id = $form_group.attr('data-form-instance-id');
      // reset taken check elements
      $siblings.filter('.identifier-taken-check-status').remove();
      $feedback.addClass('hidden');
      $feedback.removeClass('glyphicon-success glyphicon-remove')
      $form_group.removeClass('has-error has-success has-feedback')

      // the function to call as soon something is typed
      value = $element.val();
      url = $element.attr('data-identifier-taken-check-url')
      var check = function() {
        if (!url) {
          // shortcut in case for some reason the URL wasn't given
          return;
        }
        // the payload for the identifier check
        var data = {
          identifier: value
        }
        // if the form instance id was found in the form group,
        // append it to the payload. this will be used for excluding the
        // form instance on the job edit view
        if (form_instance_id) {
          data.id = form_instance_id;
        }
        $.get(url, data=data)
         .done(function(data) {
            if (data.error) {
              // show the form field as having errors
              $form_group.addClass('has-error has-feedback');
              $feedback.addClass('glyphicon-remove');
              $feedback.removeClass('hidden');
              // if the backend returns an alternative identifier, show it
              if (data.alternative) {
                data.error = data.error + ' Available alternative: ' + data.alternative;
              }
              // add a check status
              $feedback.after(
                '<p class="help-block identifier-taken-check-status">' +
                data.error +
                '</p>'
              );
            } else if (data.success) {
              // show the form field as being a success
              $form_group.addClass('has-success has-feedback');
              $feedback.addClass('glyphicon-ok');
              $feedback.removeClass('hidden');
              // just show the success message
              $feedback.after(
                '<p class="help-block identifier-taken-check-status">' +
                data.success +
                '</p>'
              );
            }
        })
      }
      // only if there is a value we want to check after a bit
      if (value) {
          taken_timeout_id = window.setTimeout(check, taken_timeout * 1000);
      }
  })

  // Disable form submit buttons on form submission
  $('form').on('submit', function(event){
    var $form = $(this);
    var $submit = $form.find('button[type=submit]');
    var $cancel = $form.find("a:contains('Cancel')");
    var $reset = $form.find('button[type=reset]');
    var submit_label = $submit.text();
    var wait_label = 'Please wait…';

    // disable submit button and change label
    $submit.addClass('disabled').find('.submit-button').text(wait_label);

    // hide cancel button
    $cancel.addClass('hidden');

    var reset_callback = function(event) {
      // re-enable submit button
      $submit.removeClass('disabled')
        .find('.submit-button')
        .text(submit_label);
      // show cancel button again
      $cancel.removeClass('hidden');
      // hide reset button
      $reset.addClass('hidden');
    };
    // show reset button to be able to reset form
    $reset.removeClass('hidden').click(reset_callback);
  });
});
