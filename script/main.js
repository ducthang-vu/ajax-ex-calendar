$(document).ready(function () {
    var baseMonth  = moment('2018-01-01')

    // Init Hndlenars
    var source = $('#day-template').html();
    var template = Handlebars.compile(source);

    printMonth(template, baseMonth)

    $('#prev-btn').click(() => printMonth(template, baseMonth.subtract(1, 'months')));

    $('#next-btn').click(() => printMonth(template, baseMonth.add(1, 'months')));

}); 


/*************************************
    FUNCTIONS
 *************************************/

// Stampa a schermo i giorni del mese
function printDays(template, date) {
    $('.month-list').children().remove();

    //  setta header
    $('h1').html( date.format('MMMM YYYY') );

    // Imposta data attribute data visualizzata
    $('.month').attr('data-this-date',  date.format('YYYY-MM-DD'));

    // genera giorni mese
    for (var i = 0; i < date.daysInMonth(); i++) {
        // genera data con moment js
        var thisDate = moment({
            year: date.year(),
            month: date.month(),
            day: i + 1
        });

        // imposta dati template
        var context = {
            class: 'day',
            day: thisDate.date(),
            completeDate: thisDate.format('YYYY-MM-DD')
        };

        //compilare e aggiungere template
        var html = template(context);
        $('.month-list').append(html);
    }
}

// Ottieni e stampa festivitÃ 
function printHoliday(date) {
    // chiamo API
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays' ,
        method: 'GET',
        data: {
            year: date.year(),
            month: date.month()
        },

        success: function(res) {
            for (var i = 0; i < res.response.length; i++) {
                var thisHoliday = res.response[i];

                var listItem = $('li[data-complete-date="' + thisHoliday.date + '"]');

                if(listItem) {
                    listItem.addClass('holiday');
                    listItem.text( listItem.text() + ' - ' + thisHoliday.name );
                }
            }
        },
        error: function() {
            console.log('Errore chiamata festivitÃ '); 
        }
    });
}


function removeButtons(month) {
    $('#prev-btn, #next-btn').show();
    if (month === 0) $('#prev-btn').hide();
    else if (month === 11) $('#next-btn').hide();
}

function printMonth(template, date) {
    printDays(template, date);
    removeButtons(date.month());
    printHoliday(date);
}