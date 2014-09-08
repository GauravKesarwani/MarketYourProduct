$(document).ready(function() {
    $('#code').autocomplete({
        source: function(request, response) {
            $.ajax({
                url: 'http://ws.geonames.org/postalCodeSearchJSON',
                dataType: 'jsonp',
                data: {
                    maxRows: 10,
                    country: 'US',
                    postalcode_startsWith: request.term
                },
                success: function(data) {
                    response($.map(data.postalCodes, function(item) {
                        return {
                            label: item.placeName + ' - ' + item.postalCode + ', ' + item.adminName1,
                            value: item.postalCode
                        };
                    }));
                }
            });
        }
    });

});
