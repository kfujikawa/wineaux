$(document).ready(function () {
    $.ajax("/vault")
        .done(function (wines){
            for(var i = 0; i < wines.length; i++){
                $('.js-vault-results').append('<li>' + wines[i].name);
            }
        }).fail(function (error){
            console.log(error);
        });
});

$('form').submit(function (event) {
    event.preventDefault();

    var query = $('#search').val();


    $.ajax({
        url: '/vault/search/' + query,
        type: 'POST'
    }).done(function (wines) {

        for(var i = 0; i < wines.length; i++){
            $('.js-search-results').append('<li>' + wines[i].name);
        }

    }).fail(function (error) {
        console.log(error);
    });
});

// on click add it to the list of ids