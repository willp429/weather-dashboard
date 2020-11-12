/* $( document ).ready( function () { */
var wUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var uUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=';
var appid = '&units=imperial&appid=';
var key = '21d337020a0247b874a0d43202c4ad83';
var img = 'http://openweathermap.org/img/w/';
var weather = '';
var cities = [];
var cDate1 = moment().format( 'MM/DD/YYYY' );


//function to display search history in the left column of the app
var searchHistory = function () {
    cities = JSON.parse( localStorage.getItem( 'cities' ) );
    if ( !cities ) {
        cities = [];
        return;
    } else {
        for ( var i = 0; i < cities.length; ++i ) {
            //BCS learning assistant advised to do this with less jQuery
            var historyEl = document.createElement( 'p' );
            historyEl.textContent = cities[i];
            historyEl.classList = 'clear list-group-item btn btn-light';
            $( '#search-history' ).append( historyEl );
            console.log( historyEl );
        }
    }
};

//function to grab the searched for city and return required data elements
var getWeather = function ( city ) {
    var mainWeather = wUrl + city + appid + key;
    fetch( mainWeather ).then( function ( response ) {
        if ( response.ok ) {
            response.json().then( function ( data ) {
                var lat = data.city.coord.lat;
                var lon = data.city.coord.lon;
                var location = data.city.name;
                console.log( lat, lon, location );
                $( '#current-city' ).text( location + ' ' + cDate1 );
                $( '#weather-img' ).attr(
                    'src',
                    img + data.list[0].weather[0].icon + '.png'
                );
                $( '#temperature' ).text( data.list[0].main.temp.toFixed( 0 ) + '°F' );
                $( '#temp_low' ).text( data.list[0].main.temp_min.toFixed( 0 ) + '°F' );
                $( '#temp_high' ).text( data.list[0].main.temp_max.toFixed( 0 ) + '°F' );
                $( '#humidity' ).text( data.list[0].main.humidity + '%' );
                $( '#windspeed' ).text( data.list[0].wind.speed.toFixed( 0 ) + ' ' + 'mph' );

                //pass the location into the setHistory function to store the city
                setHistory( location );
                //pass lat/lon into the getForecast function
                getForecast( lat, lon );

                fetch( uUrl + lat + '&lon=' + lon + appid + key ).then( function (
                    response
                ) {
                    if ( response.ok ) {
                        response.json().then( function ( data ) {
                            $( '#uvIndex' ).text( data.current.uvi );
                            console.log( data.current.uvi );
                            if ( data.current.uvi > 2 && data.current.uvi < 5 ) {
                                $( '#uvIndex' ).addClass( 'bg-warning' );
                            } else if ( data.current.uvi < 2 ) {
                                $( '#uvIndex' ).addClass( 'bg-success' );
                            } else if ( data.current.uvi > 5 ) {
                                $( '#uvIndex' ).addClass( 'bg-danger' );
                            }
                        } );
                    } else {
                        alert( 'Sorry, unable to display UV Index' );
                    }
                } );
            } );
        } else {
            alert(
                'Your search did not work, please make sure the city is spelled correctly!'
            );
        }
    } );
};

//function to get the five day forecast data from the oncall weather api
var getForecast = function ( lat, lon ) {
    var oneCall = uUrl + lat + '&lon=' + lon + appid + key;
    fetch( oneCall ).then( function ( response ) {
        // display forecast data from API
        if ( response.ok ) {
            response.json().then( function ( data ) {
                var forecast = data.daily.splice( 3 );
                console.log( forecast );

                for ( var i = 0; i < forecast.length; ++i ) {
                    $( '.forecast' ).each( function () {
                        var cDate2 = moment()
                            .add( i + 1, 'days' )
                            .format( 'MM/DD YYYY' );
                        $( this )
                            .children( '.forecast-date' + i )
                            .text( cDate2 );
                        console.log( 'src', img + forecast[i].weather[0].icon + '.png' );
                        $( this )
                            .children( '.forecast-icon' + i )
                            .attr( 'src', img + forecast[i].weather[0].icon + '.png' );
                        $( this )
                            .children( '.forecast-temp' + i )
                            .text( 'Temp: ' + forecast[i].temp.day + 'F' );
                        $( this )
                            .children( '.forecast-hum' + i )
                            .text( 'Hum: ' + forecast[i].humidity + '%' );
                    } );
                }
            } );
        } else {
            alert(
                'Sorry, displaying the five day forecast is not working. Please try again.'
            );
        }
    } );
};

//function to get the city
var getCity = function ( e ) {
    e.preventDefault();
    //create a new variable for city to pass into the getWeather function
    var cityEl = $( '#city' );
    var city = $.trim( cityEl.val() );

    if ( city ) {
        getWeather( city );
        cityEl.val( '' );
    } else {
        alert( 'Please enter a City' );
    }

    console.log( e );
};

//function to set the history for cities searched
var setHistory = function ( location ) {
    if ( cities.includes( location ) ) {
        return;
    } else {
        //if a location does exist, then push the value to the cities variable
        cities.push( location );

        //ths will put the most recent 8 entries at the top of the list
        if ( cities.length > 8 ) {
            cityHistory.shift();
        }

        //set the local storage with a key name of cities
        localStorage.setItem( 'cities', JSON.stringify( cities ) );

        //needed to create a class that would allow us to grab the created p elements so we could clear the list and append the new cities
        $( '.clear' ).each( function () {
            $( this ).remove();
        } );
        searchHistory();
    }
};

var searchList = function () {
    var search = $( this ).text().trim();
    getWeather( search );
};

$( '#search-city' ).on( 'click', getCity );
$( '#search-history' ).on( 'click', '.clear', searchList );