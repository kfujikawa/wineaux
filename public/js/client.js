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

$('#searchform').submit(function (event) {
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

$('#createform').submit(function (event) {
    console.log($(this).find("#name").val());
    console.log($(this).find("#lastName").val());
    event.preventDefault();
    $.ajax({
        url: "/wineaux/create",
        method: "POST",
        data: {
            name: $(this).find("#name").val(),
            lastName: $(this).find("#lastName").val()
        },
    }).done(function (response) {
        console.log(response);
    }).fail(function (failed) {
        console.log(failed);
    })
});