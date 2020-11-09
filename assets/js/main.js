/* $( document ).ready( function () { */
var url = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var urlUVI = 'https://api.openweathermap.org/data/2.5/onecall?';
var appid = '&units=imperial&appid=';
var key = '21d337020a0247b874a0d43202c4ad83';
var weather = '';
var currentDate = moment().format( 'MM/DD/YYYY' );

//working code
var searchHistory = function () {
    console.log( cities );

    if ( !cities ) {
        cities = [];
    } else {
        for ( var i = 0; i < history.length; i++ ) {
            var historyEl = $( 'search-history' );
            historyEl.text( cities[i] );
            historyEl.addClass( 'list-group-item btn btn-light' );
            $( '#search-history' ).append( historyEl );
        }
    }
};

// pings API when user hits submit after city
var getWeather = function ( city ) {
    fetch( url + city + appid + key ).then( function ( response ) {
        if ( response.ok ) {
            response.json().then( function ( data ) {
                var lat = data.city.coord.lat;
                var lon = data.city.coord.lon;
                var location = data.city.name;
                console.log( lat, lon, location );
                $( '#current-city' ).text( location + ' ' + currentDate );
                /* $('#weather-img').attr('src', url + json.list.weather[0].icon + '.png'); */
                $( '#temperature' ).text( data.list[0].main.temp.toFixed( 0 ) + '°F' );
                $( '#temp_low' ).text( data.list[0].main.temp_min.toFixed( 0 ) + '°F' );
                $( '#temp_high' ).text( data.list[0].main.temp_max.toFixed( 0 ) + '°F' );
                $( '#humidity' ).text( data.list[0].main.humidity + '%' );
                $( '#windspeed' ).text( data.list[0].wind.speed.toFixed( 0 ) + ' ' + 'mph' );
                /*                 setHistory( location );
                 */                /* getForecast( lat, lon ); */

                //fetch uvi
                fetch( urlUVI + 'lat=' + lat + '&lon=' + lon + appid + key ).then( function ( response ) {
                    if ( response.ok ) {
                        response.json().then( function ( data ) {
                            $( '#uvIndex' ).text( data.current.uvi );
                            if ( data.current.uvi < 3 ) {
                                $( '#uvIndex' ).css( 'background-color', 'green' );
                            } else if ( uvi < 6 ) {
                                $( '#uvIndex' ).css( 'background-color', 'yellow' );
                            } else if ( uvi < 8 ) {
                                $( '#uvIndex' ).css( 'background-color', 'orange' );
                            } else {
                                $( '#uvIndex' ).css( 'background-color', 'red' );
                            }
                        } )
                    }
                } )

                //fetch 5-day forecast
                fetch( url + city + appid + key ).then( function ( response ) {
                    if ( response.ok ) {
                        response.json().then( function ( data ) {

                            var dayCounter = 1;

                            /* var oneCall = fetch( url + city + appid + key );
                            console.log(oneCall);
                            fetch(oneCall).then(function (response) {
                                // display forecast data from API
                                if (response.ok) {
                                    response.json().then(function (data) {});
                                } */

                            for ( var i = 0; i < data.list.length; i++ ) {
                                var dateTime = data.list[i].dt;
                                var date = dateTime.split( " " )[0];
                                var time = dateTime.split( " " )[1];
                                if ( time === "15:00:00" ) {
                                    var year = date.split( "-" )[0];
                                    var month = date.split( "-" )[1];
                                    var day = date.split( "-" )[2];
                                    $( "#day-" + dayCounter ).children( ".forcast-date" ).text( month + "/" + day + "/" + year );
                                    $( "#day-" + dayCounter ).children( ".forcast-temp" ).text( "Temp: " + ( ( data.list[i].main.temp.toFixed( 0 ) + "°F" ) ) );
                                    $( "#day-" + dayCounter ).children( ".forecast-hum" ).text( "Humidity: " + data.list[i].main.humidity + "%" );
                                    day_counter++;
                                };
                            };
                        } );
                    }
                } );
            } );
        }
    } );
};

/* var getForecast = function ( lat, lon ) {

    
}; */

/* }); */

// Old getforecast data from weather API (use the onecall api here)
/*var getForecast = function ( lat, lon ) {
    fetch( url + city + appid + key ).then( function ( response ) {
        // display forecast data from API
        if ( response.ok ) {
            for ( var i = 0; i < response.list.length; i++ ) {
                var dateTime = response.list[i].dt_txt;
                var date = dateTime.split( ' ' )[0];
                var time = dateTime.split( ' ' )[1];
                if ( time === '15:00:00' ) {
                    var year = date.split( '-' )[0];
                    var month = date.split( '-' )[1];
                    var day = date.split( '-' )[2];
                    $( '#day-' + dayCounter )
                        .children( '.card-date' )
                        .text( month + '/' + day + '/' + year );
                    $( '#day-' + dayCounter )
                    .children( '.weather-icon' )
                .attr(
                    'src',
                    'https://api.openweathermap.org/img/w/' +
                        response.list[i].weather[i].icon +
                        '.png'
                );
                    $( '#day-' + dayCounter )
                        .children( '.weather-temp' )
                        .text( 'Temp: ' + ( response.list[i].main.temp.toFixed( 0 ) + '°F' ) );
                    $( '#day-' + dayCounter )
                        .children( '.weather-humidity' )
                        .text( 'Humidity: ' + response.list[i].main.humidity + '%' );
                    dayCounter++;
                }
            }
        } else {
            alert(
                'Please make sure the city you are searching for is spelled correctly!'
            );
        }
    } );
};*/

//function to get the city (working)
var getCity = function ( e ) {
    e.preventDefault();
    //create a new variable for city to pass into the getForecast function
    var cityEl = $( '#city' );
    var city = $.trim( cityEl.val() );
    console.log( city );
    if ( city ) {
        getWeather( city );
        cityEl.value = '';
    } else {
        alert( 'Please enter a City' );
    }
    console.log( e );
    /*  if (citiesHistory.indexOf(city) === -1){
         citiesHistory.push(city);
     }
     localStorage.setItem("searches", JSON.stringify(citiesHistory)); */
};

/* $('.btn').click(getWeather);
$('.btn').click(getForecast);
$('#search-city').click(searchHistory);
searchHistory(); */
$( '#submit' ).on( 'click', getCity );

/* $( '#submit' ).on( 'click', searchHistory );
 */