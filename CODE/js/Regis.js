(function($) {

    $('#RegistrationFee').parent().append('<ul class="list-item" id="newRegistrationFee" name="RegistrationFee"></ul>');
  $('#RegistrationFee option').each(function(){
      $('#newRegistrationFee').append('<li value="' + $(this).val() + '">'+$(this).text()+'</li>');
  });
    $('#RegistrationFee').remove();
    $('#newRegistrationFee').attr('id', 'RegistrationFee');
    $('#RegistrationFee li').first().addClass('init');
    $("#RegistrationFee").on("click", ".init", function() {
        $(this).closest("#RegistrationFee").children('li:not(.init)').toggle();  
  });

    var allOptions = $("#RegistrationFee").children('li:not(.init)');
    $("#RegistrationFee").on("click", "li:not(.init)", function() {
      allOptions.removeClass('selected');
      $(this).addClass('selected');
        $("#RegistrationFee").children('.init').html($(this).html());
      allOptions.toggle();
    });

    $('#RegistrationFee2').parent().append('<ul class="list-item" id="newRegistrationFee2" name="RegistrationFee2"></ul>');
    $('#RegistrationFee2 option').each(function () {
        $('#newRegistrationFee2').append('<li value="' + $(this).val() + '">' + $(this).text() + '</li>');
    });
    $('#RegistrationFee2').remove();
    $('#newRegistrationFee2').attr('id', 'RegistrationFee2');
    $('#RegistrationFee2 li').first().addClass('init');
    $("#RegistrationFee2").on("click", ".init", function () {
        $(this).closest("#RegistrationFee2").children('li:not(.init)').toggle();
    });
    var allOptions2 = $("#RegistrationFee2").children('li:not(.init)');
    $("#RegistrationFee2").on("click", "li:not(.init)", function () {
        allOptions2.removeClass('selected');
        $(this).addClass('selected');
        $("#RegistrationFee2").children('.init').html($(this).html());
        allOptions2.toggle();
    });

  var marginSlider = document.getElementById('slider-margin');
  if (marginSlider != undefined) {
      noUiSlider.create(marginSlider, {
            start: [500],
            step: 10,
            connect: [true, false],
            tooltips: [true],
            range: {
                'min': 0,
                'max': 1000
            },
            format: wNumb({
                decimals: 0,
                thousand: ',',
                prefix: '$ ',
            })
    });
  }
  $('#reset').on('click', function(){
      $('#register-form').reset();
  });

  $('#register-form').validate({
    rules : {
        paper_id : {
            required: true,
        },
        paper_title : {
            required: true,
        },
        paper_authors : {
            required: true
        },
        affiliation : {
            required: true,
            email : true
        },
        nationality : {
            required: true,
        },
        attendee_name: {
            required: true,
        }
    },
    onfocusout: function(element) {
        $(element).valid();
    },
});

    jQuery.extend(jQuery.validator.messages, {
        required: "",
        remote: "",
        email: "",
        url: "",
        date: "",
        dateISO: "",
        number: "",
        digits: "",
        creditcard: "",
        equalTo: ""
    });
})(jQuery);