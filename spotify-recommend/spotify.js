var getFromApi = function(endpoint, query) {
    var url = 'https://api.spotify.com/v1/' + endpoint;

    var queryString = Qs.stringify(query);
    if (queryString) {
        url += '?' + queryString;
    }

    return fetch(url).then(function(response) {
        if (response.status < 200 || response.status >= 300) {
            return Promise.reject(response.statusText);
        }
        return response.json();
    });
};

var artist;
var getArtist = function(name) {
        // var url= 'https://api.spotify.com/v1';

        var endpoint = 'search';
        var query = {
            q: name,
            limit: 1,
            type: 'artist'
        };


        return getFromApi(endpoint, query).then(function(item) {

            artist = item.artists.items[0];

            var artist_id = artist.id;
            var endpoint2 = 'artists/' + artist_id + '/related-artists';
            var endpoint3 = 'artists/' + artist_id + '/top-tracks';
            return getFromApi(endpoint2, query).then(function(item) {
                artist.related = item.artists;
                var toptracksArray = [];
                query = {
                    country: 'US'
                }
                artist.related.forEach(function() {
                    toptracksArray.push(getFromApi(endpoint3, query));
                });
                return Promise.all(toptracksArray).then(function(responses) {
                    console.log(artist.related);
                    responses.forEach(function(item, index) {
                        artist.related[index].tracks = item.tracks;
                    })
                    return artist;
                })
                .catch(function(err) {
                    console.error(err);
                });
            });
        });
    }
    // artist.related[item].tracks =item.tracks;
    //       console.log("track response"+responses.tracks);
    //   })