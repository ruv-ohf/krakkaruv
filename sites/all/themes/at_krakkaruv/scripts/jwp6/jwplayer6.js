$(document).ready(function(){
	
	$('.jwplayer').each(function(i,x){
		
		//Player wrapper int setup
		var itemId = $(x).attr('id'); //ID á spilara
		var isPlaylist = $(x).attr('playlist');
		var playerDimensons = $(x).attr('jwtag').split(','); //Sækir stærð spilarans
		var heightSplit = playerDimensons[0].split(":"); //Hæð-splituð
		var widthSplit = playerDimensons[1].split(":"); //Breidd-splituð
		
		//Setuup fyrir stærð á spilara
		var playerWidth = heightSplit[1];//hæð
		var playerHeight = widthSplit[1];//breidd
		
		//Playlistasetup
		var displayPlaylist = "";
		
		//Streamers - streymi týpur og þjónar. Annarsvegar RTMP og HLS hinsvegar.
		var	streamingService = {
			'mp4' : { 
					"rtmp" : "rtmp://sipvodfs.fplive.net/sipvod/", //RTMP fyrir MP4
					"http" : "http://sip-ruv-vod.dcp.adaptive.level3.net/" //HLS
					},
			'mp3' : {
					"rtmp" : "rtmp://sipvodfs.fplive.net/sipvod/",  //RTMP fyrir MP3
					"http" : "http://static.sip.is/utvarp/" //HLS fyrir MP3
					}
		};
		
		var activeStreamingServices = ['rtmp','http'];
				
		//Fetch items 
		var playbackfiles = $(x).find('a'); //Sækir öll eintök af A taggi sem innihalda slóð á skrá sem þarf að spila.
		var playbackimages = $(x).find('img'); //Sækir öll eintök af IMG taggi sem inniheldur slóð á mynd sem á að birta með.
		
		//Setup loop
		var itemcount = 0; //Telur fyrir array í jwplayer_playlist.
		var jwplayer_playlist = new Array(); // int playlist array.
		
		//Loopar í gegnum playbackitems (þær skrár sem á að spila).
		playbackfiles.each(function(itemkey, playbackitem){
			var playerimage = $(playbackimages[itemkey]).attr('src'); //Slóð á mynd til að setja í playlista
			var playertitle = $(playbackimages[itemkey]).attr('title'); //Titill á video til að setja í playlista.
			var filepath = $(playbackitem).attr('href'); //Sækir skráarslóð í A tagg.
			var time_param_argument_split = filepath.split("?"); //Sækir tíma-parameter sem kemur eftir '?' í a href url.
			var filepath_split = time_param_argument_split[0].split(":"); //splittar í sundur fyrripartinn af a href upplýsingum til
			var orginal_filepath = filepath_split[1]; //Setur inn upprunalegu skráarslóðina í breytu
			var filename_split = orginal_filepath.split("/"); //splittar upp strengnum eftir '/' til að geta sótt skráarnafnið.
			var filename = filename_split[ filename_split.length - 1 ]; //Setur skráarnafnið í breytu byggt á síðasta hluta array.
			var filename_seperate = filename.split("."); //tekur í sundur skráarnafnið svo að hægt að fá beina vísun í upptökunúmer.
			var clean_filename = filename_seperate[0]; //Upptökunúmer sett í breytu.
			
			var playlist_sources = new Array();
			var playlist_sources_count = 0;
									
			var start_time = 0; //Default upphafstími upptöku.
			if(time_param_argument_split[1] != undefined) //Ef það er búið að setja ?time= argument með a href á slóð.
			{
				var time_param_split = time_param_argument_split[1].split("="); //Splitar upp time og tölugildi eftir '='.
				start_time = time_param_split[1]; //Byrjuanrtími upptöku settur í breytu.
			}
						
			var filepathType = filepath_split[0];//Sækir protocol-type.
			var streamType = 'rtmp'; // Protocol fyrir streymi. - Default.
			
			//Ef það slóðin er http (HLS) þá verður að breyta skráarendingunni.
			$(activeStreamingServices).each(function(protocol_key, protocol_service){
				switch(protocol_service)
				{
					case "http" :
						streamType = 'hls';
						switch(filepathType)
						{
							case "mp4" : 
								filepath = streamingService.mp4.http + orginal_filepath+".m3u8";
							break;
							case "mp3" : 				    
								filepath = streamingService.mp3.http + clean_filename + "/" + clean_filename +".m3u8";
							break;
						}
					break;
					case "rtmp" :
						streamType = 'rtmp';
						switch(filepathType)
						{
							case "mp4" : 
								filepath = streamingService.mp4.rtmp + orginal_filepath;
							break;
							case "mp3" : 
								filepath = streamingService.mp3.rtmp + orginal_filepath;
							break;
						}
					break;
				}
				
				playlist_sources[playlist_sources_count] = {
					type : streamType,
					file : filepath,
					start : start_time
				};
				
				playlist_sources_count++;//Talning fyrir sources count
			});
			
			//Setur gildin í playlista
			jwplayer_playlist[itemcount] = {	
											type : streamType, 
											image : playerimage, 
											title : playertitle,
											sources : playlist_sources
										};
			itemcount++;//Telja í playlista.
		});
		
		console.log(jwplayer_playlist);
		
		//Ef það eru fleirri en eitt item í playlista.
		if(jwplayer_playlist.length > 1 && isPlaylist == "true")
		{
			//Reiknar út nýja breidd á spilarann vegna playlista.
			var playlistwidth_newvalue = (playerWidth * 0.28);
			// Býr til playlist attribute fyrir jwplayer.
			displayPlaylist = {
				position: 'right',
				size: playlistwidth_newvalue
			};
			//Ný hæðargildi vegna playlista.
			var playerheight_newvalue = (playerHeight * 0.25); //minnkar hæðina um 25% þar sem playlistinn bætist við.
			playerHeight = playerHeight - playerheight_newvalue;  //nýtt gildi sett inn.
		}
		
		if(navigator.userAgent.indexOf('Android') !== -1)
		{
			var fallbackitems = "";
			$(jwplayer_playlist).each(function(playlist_item_key, playlist_item){
				if(playlist_item_key == 0)
				{
					fallbackitems += "<a href='"+playlist_item.sources[0].file+"' style='float:left; display:block; opacity:1;'>";
					fallbackitems += "<img src='"+playlist_item.image+"' style='width:"+playerWidth+"px; height:"+playerHeight+"px; float:left; display:block; opacity:1;'>";
					fallbackitems += "</a><br>";
					fallbackitems += "<a href='"+playlist_item.sources[1].file+"' style='float:left; display:block; opacity:1;'>";
					fallbackitems += "<img src='"+playlist_item.image+"' style='width:"+playerWidth+"px; height:"+playerHeight+"px; float:left; display:block; opacity:1;'>";
					fallbackitems += "</a>";
				}else
				{
					fallbackitems += "<a href='"+playlist_item.sources[0].file+"' style='float:left; display:block; opacity:1;'>"+playlist_item.title+"</a><br>";
					fallbackitems += "<a href='"+playlist_item.sources[1].file+"' style='float:left; display:block; opacity:1;'>"+playlist_item.title+"</a>";
				}
			});
			$('#'+itemId).html(fallbackitems);
			$('#'+itemId).css({'display' : 'block', 'opacity' : '1'});
			//$('#debug').append('Andoid í gangi');
		}else
		{
			//Keyra inn spilara í object (itemID).
			jwplayer(itemId).setup({
				playlist : jwplayer_playlist,
				width: playerWidth,
				height: playerHeight,
				listbar: displayPlaylist,
				primary : "flash",
				src: '/sites/all/themes/ruv/spilari/jwp6/jwplayer/jwplayer.flash.swf',
				autostart : false,
				fallback : true,
				stretching: 'uniform'				
			});
		}
	});
});