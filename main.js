$(document).ready(function(){

	$('#search').keyup(function(){
		x = $('#search').val();
		if(x.length > 2){
			search(x)
		}
	});

	var search = function(query){
		$.ajax({
			type: "GET",
			url: 'https://api.spotify.com/v1/search',
			data: {
				q: query,
				type: 'artist'
			}, 
			success: function(response){
				update(response)
				var id = response.artists.items[0].id;
				get_albums(id)
				get_tracks(id)
				get_related(id)
			}
		});

		var get_related = function(x){
			$.ajax({
				type: "GET",
				url: "https://api.spotify.com/v1/artists/"+x+"/related-artists",
				success: function(response){
					gen_related(response);
				}
			});
		};

		var get_albums = function(x){
			$.ajax({
				type: "GET",
				url: "https://api.spotify.com/v1/artists/"+x+"/albums",
				success: function(response){
					gen_albums(response);
				}
			});
		};

		var get_tracks = function(x){
			$.ajax({
				type: "GET",
				url: "https://api.spotify.com/v1/artists/"+x+"/top-tracks?country=US",
				success: function(response){
					console.log(response);
					gen_tracks(response);
				}
			});
		};
	};

	var update = function(x){
		clear();
		var i = 0
		var artist = x.artists.items[0];
		console.log(artist);
		var name = artist.name;
		var image = artist.images[i].url;
		var width = artist.images[i].width;
		var height = artist.images[i].height;
		var images = artist.images;
		// genres returns an array of items
		var genres = artist.genres;
		var url = artist.external_urls.spotify;
		var followers = artist.followers.total;
		var popularity = artist.popularity;

		
		$('#name').html("<a id='nameA' href=" + url + ">" + name + "</a></h1>");

		var nameWidth = $('#nameA').width();
		console.log(nameWidth);

		$('#name').css({'width' : nameWidth + "px"});

		$('#followers').text("Followers: " + followers);
		$('#popularity').text("Popularity: " + popularity);
		$('#g_title').text("Genres");
		$('#ra_title').text("Related Artists");

		for(var g=0; g < genres.length; g++){
			$('#genres').append("<li>" + genres[g] + "</li>");
		};

		generate(artist, i);
		

		// $('#image').on('click', function(){
		// 	if(i < images.length-1){
		// 		i+=1;
		// 	} else {
		// 		i=0;
		// 	};
		// 	generate(artist, i)

		// 	if(height > 700){
		// 		i += 1
		// 		generate(artist, i)
		// 	}
		// });
	};

	var generate = function(x, y){
		var image = x.images[y].url;
		var height = x.images[y].height;
		var width = x.images[y].width;
		var inHeight = window.innerHeight;
		console.log(inHeight);
		$('#image').html("<img src='" + image + "'></img>");
		
		if(window.innerWidth > 719){
			$('#right').css({'height': inHeight + "px"});
		};
	};

	var clear = function(){
		$('#genres').empty();
		$('#ra').empty();
		$('#albums').empty();
		$('#tracks').empty();
	};

	var clear_related = function(){
		$('#ra').empty();
	}

	var clear_albums = function(){
		$('#albums').empty();
	}

	var clear_tracks = function(){
		$('#tracks').empty();
	}

	var clear_play = function(){
		$('#npTitle').empty();
		$('#play').empty();
	}

	var gen_related = function(x){
		clear_related();
		var related = x.artists;
		for(var g = 0; g < related.length; g++){
			var last = related[g].images.length-1;
			var sm_image = related[g].images[last].url;
			var r_name = related[g].name
			$('#ra').append("<li class='follower_text'><img class='sm_circle' src='" + sm_image + "'></img><span>" + r_name + "</span></li>");
		};

		$('.follower_text').on('click', function(){
			search($(this).text());
		});

		var lHeight = $('#left').height();
		var hHeight = $('#head').height();
		
		$('#right').css({'height' : window.innerHeight +"px"});
	};

	var gen_albums = function(x){
		clear_albums();
		var albums = x.items;
		var inHeight = document.documentElement.clientHeight
		if(window.innerWidth > 719){
			$('#albums').css({'margin-top' : inHeight + "px"})
		}
		for(var a = 0; a < albums.length; a++){
			if((a > 1) && (albums[a].name != albums[a-1].name)){
				$('#albums').append("<div class='album'><img class='album_art' src='" + albums[a].images[1].url + "'></img><p class='album_title'>"+ albums[a].name +"</p></div>");
			};
		};
	};

	var gen_tracks = function(x){
		clear_tracks();
		$('#tt_title').text("Top Tracks");
		$('#tt_subtitle').text("select a song to listen")
		var tracks = x.tracks;
		for(var t = 0; t < tracks.length; t++){
			$('#tracks').append("<li class='track_text' data-track="+tracks[t].uri+">"+tracks[t].name+"</li>")
		};

		$('.track_text').on('click', function(){
			clear_play();
			uri = $(this).data("track");
			console.log(uri)
			$('#npTitle').text("Now Playing");
			$('#play').append("<iframe src='https://embed.spotify.com/?uri="+uri+"' width='250' height='80' frameborder='0' allowtransparency='true' autoplay='true'></iframe>")
		});
	};

	var inHeight = window.innerHeight;

	$(window).on('resize', function(){
		if(window.innerWidth < 719){
			console.log('hello')
			var imgHeight = $('#image').height();
			var lHeight = $('#left').height();
			var rHeight = $('#right').height();
			console.log(imgHeight);
			$('#left').css({'margin-top' : imgHeight + 25 + "px"})
			$('#right').css({
				'margin-top' : imgHeight + lHeight + 50 + "px"
			})
		}
		$('#right').css({'height' : window.innerHeight + "px"})

	});
});