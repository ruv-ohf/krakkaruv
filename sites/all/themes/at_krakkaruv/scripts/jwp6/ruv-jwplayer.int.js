
jQuery(document).ready(function($)
{
	var browserInfo = {
		init : function () {
			this.browserName = this.searchString(this.dataBrowser) || "Óþekktur vafri",
			this.browserVersion = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "óþekkt útgáfa",
			this.OS = this.searchString(this.dataOS) || "Óþekkt stýrikerfi",
			this.OSVersion = this.searchOsVersion(navigator),
			this.userAgentHeader = navigator.userAgent,
			this.cookies = navigator.cookieEnabled,
			this.osPlatform = navigator.platform,
			this.theIP = this.myIp(),
			this.isISLip = this.isISLip(this.theIP),
			this.flashVersion = this.getFlashVersion(),
			this.html5 = this.html5support()
		},
		searchString : function (data) {
			for (var i = 0; i < data.length; i++) {
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1) {
						return data[i].identity;
					}
				} else if (dataProp) {
					return data[i].identity;
				}
			}
		},
		searchVersion : function (dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1)
				return;
			return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
		},
		dataBrowser : [{
				string : navigator.userAgent,
				subString : "Chrome",
				identity : "Chrome"
			}, {
				string : navigator.vendor,
				subString : "Apple",
				identity : "Safari",
				versionSearch : "Version"
			}, {
				prop : window.opera,
				identity : "Opera",
				versionSearch : "Version"
			}, {
				string : navigator.vendor,
				subString : "KDE",
				identity : "Konqueror"
			}, {
				string : navigator.userAgent,
				subString : "Firefox",
				identity : "Firefox"
			}, {
				string : navigator.userAgent,
				subString : "MSIE",
				identity : "Internet Explorer",
				versionSearch : "MSIE"
			}, {
				string : navigator.userAgent,
				subString : "Windows Phone",
				identity : "IEMobile",
				versionSearch : "rv"
			},{
				string : navigator.userAgent,
				subString : ".NET",
				identity : "Internet Explorer",
				versionSearch : "rv"
			}
		],
		dataOS : [{
				string : navigator.platform,
				subString : "Win",
				identity : "Windows"
			}, {
				string : navigator.platform,
				subString : "Win32",
				identity : "Windows"
			}, {
				string : navigator.platform,
				subString : "Mac",
				identity : "Mac"
			}, {
				string : navigator.userAgent,
				subString : "iPhone",
				identity : "iPhone/iPod"
			}, {
				string : navigator.userAgent,
				subString : "iPad",
				identity : "iPad"
			}, {
				string : navigator.userAgent,
				subString : "Android",
				identity : "Android"
			}, {
				string : navigator.platform,
				subString : "Linux",
				identity : "Linux"
			}
		],
		searchOsVersion : function(nav){
			var parts = nav.userAgent.split(/\s*[;)(]\s*/);
			return parts[1];
		},
		/* Skilar Flash útgáfu */
		getFlashVersion : function () {
			// ie
			try {
				try {
					// avoid fp6 minor version lookup issues
					// see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
					var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
					try {
						axo.AllowScriptAccess = 'always';
					} catch (e) {
						return '6,0,0';
					}
				} catch (e) {}
				return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
				// other browsers
			} catch (e) {
				try {
					if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
						return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1]
					}
				} catch (e) {}
			}
			return 0;
		},
		myIp : function(){
		    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
			else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			xmlhttp.open("GET","/sites/all/themes/at_krakkaruv

term_custom/scripts/return-ip.php",false);
			xmlhttp.send();
			hostipInfo = xmlhttp.responseText;
			return hostipInfo;
		},
		isISLip : function(ip)
		{
			if (window.XMLHttpRequest)
			{
				xmlhttp = new XMLHttpRequest();
			}else 
			{
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.open("POST","/sites/all/themes/at_krakkaruv

term_custom/scripts/is-ip-check.php?ip="+ip,false);
			xmlhttp.send();
			hostISLipInfo = xmlhttp.responseText;
			return hostISLipInfo;
		},
		html5support : function(){
			if(!isCanvasSupported())
			{
				return false;
			}else
			{
				return true;
			}
		}
	};

	browserInfo.init();

	$('.jwplayerplaceholder').each(function(i,x)
	{
		//Player wrapper int setup
		var itemId = $(x).attr('id'); //ID á spilara
		var isPlaylist = $(x).attr('playlist'); //Hvort að viðkomandi spilari innihaldi playlista.
		//Setup fyrir stærð á spilara
		var playerWidth = $(x).attr('width'); //Breidd
		if(playerWidth == 'auto')
		{
			playerWidth = "'100%'";
		}
		var playerHeight = $(x).attr('height'); //Hæð
		if(playerHeight == "auto")
		{
			playerHeight = "'100%'";
		}
		var fullWidth = $(x).attr('fullwidth'); // Full width fyrir responsive spilara
		if (fullWidth == "true") {
			playerWidth = "100%";
		}
		
		//Default stillingar fyrir autoplay
		var player_autostart = "false";
		var playertitle = "";
		
		//Playlistasetup
		var displayPlaylist = "";
		//Streamers - streymi týpur og þjónar. Annarsvegar RTMP og HLS hinsvegar.
		var	streamingService = {
			'mp4' : {
					"html5" : "http://sip-ruv-vod.dcp.adaptive.level3.net/", //HLS
					"rtmp" : "rtmp://sipvodfs.fplive.net/sipvod/" //RTMP fyrir MP4
					},
			'mp3' : {
					//"html5" : "http://static.sip.is/utvarp/", //HLS fyrir MP3 ELDRA
					"html5" : "http://178.19.48.74:1935/ruvvod/_definst_/mp3:ruvvod/", //HLS fyrir MP3
					"rtmp" : "rtmp://sipvodfs.fplive.net/sipvod/" //RTMP fyrir MP3
					}
		};
		var activeStreamingServices = ['html5','rtmp'];
		var playbackfiles = $(x).find('source'); //Sækir öll eintök af source taggi sem innihalda slóð á skrá sem þarf að spila.
		
		var itemcount = 0; //Telur fyrir array í jwplayer_playlist.
		var jwplayer_playlist = []; // int playlist array.
		var start_time = 0; //Default upphafstími upptöku.
		var orginal_filepath;
		var playerimage;
		var filepathType;
		var witchconfig = "0";
		var jwplayerEnable = false;
		var filepath;
		
		//Loopar í gegnum playbackitems (þær skrár sem á að spila).
		playbackfiles.each(function(itemkey, playbackitem)
		{	
			playerimage = $(playbackitem).attr('jwimg'); //Slóð á mynd til að setja í playlista
			playertitle = $(playbackitem).attr('title'); //Titill á video til að setja í playlista.
			filepath = $(playbackitem).attr('jw-src'); //Sækir skráarslóð í video-tagg.
			var time_param_argument_split = filepath.split("?"); //Sækir tíma-parameter sem kemur eftir '?' í a href url.
			var filepath_split = time_param_argument_split[0].split(":"); //splittar í sundur fyrripartinn af a href upplýsingum til
			orginal_filepath = filepath_split[1]; //Setur inn upprunalegu skráarslóðina í breytu
			var filename_split = orginal_filepath.split("/"); //splittar upp strengnum eftir '/' til að geta sótt skráarnafnið.
			var filename = filename_split[ filename_split.length - 1 ]; //Setur skráarnafnið í breytu byggt á síðasta hluta array.
						
			//Sækir upplýsingar um autostart
			if($(playbackitem).attr('jwautostart').length >= 1)
			{
				player_autostart = $(playbackitem).attr('jwautostart');
			}
	
			var filename_seperate = filename.split("."); //tekur í sundur skráarnafnið svo að hægt að fá beina vísun í upptökunúmer (fyrir MP3 HLS).
			var clean_filename = filename_seperate[0]; //Upptökunúmer sett í breytu.
								
			if(time_param_argument_split[1] != undefined) //Ef það er búið að setja ?time= argument með a href á slóð.
			{
				var time_param_split = time_param_argument_split[1].split("="); //Splitar upp time og tölugildi eftir '='.
				start_time = time_param_split[1]; //Byrjuanrtími upptöku settur í breytu.
			}
						
			filepathType = filepath_split[0];//Sækir protocol-type.
			var streamType = 'html5'; // Protocol fyrir upptökustreymi. - Default.
			
			//Ef það slóðin er http (HLS) þá verður að breyta skráarendingunni.
			var playlist_sources = new Array();
			var playlist_sources_count = 0;
			
			
			$(activeStreamingServices).each(function(protocol_key, protocol_service)
			{
				/*switch(protocol_service)
				{
					case "html5" :
						streamType = 'html5';
						switch(filepathType)
						{
							case "mp4" : 
								filepath = streamingService.mp4.html5 + orginal_filepath+".m3u8";
							break;
							case "mp3" : 
							    filepath = streamingService.mp3.html5 + orginal_filepath+"/playlist.m3u8";
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
				}*/

				switch(browserInfo.browserName)
				{
					case "Chrome" : 
					case "Safari" : 
						if(browserInfo.flashVersion != "0")
						{ //Er með Flash
							switch(filepathType)
							{
								case "mp4" : 
									filepath = streamingService.mp4.rtmp + orginal_filepath;
								break;
								case "mp3" : 
									filepath = streamingService.mp3.rtmp + orginal_filepath;
								break;
							}
							witchconfig = "1";//Chrome/Safari with Flash
							jwplayerEnable = true;
						}else // Er ekki með flash
						{
							switch(filepathType)
							{
								case "mp4" : 
									filepath = streamingService.mp4.html5 + orginal_filepath+".m3u8";
									jwplayerEnable = true;
								break;
								case "mp3" : 
									if(browserInfo.OS == "Android") //Sem sagt Chrome á Android
									{
								    	filepath = streamingService.mp3.html5 + orginal_filepath;
								    	jwplayerEnable = false;
								    }else
								    {
								    	filepath = streamingService.mp3.html5 + orginal_filepath+"/playlist.m3u8";
								    	jwplayerEnable = true;
								    }
								break;
							}
							witchconfig = "2";//Chrome/Safari with NO Flash
						}
						
					break;
					///
					case "Internet Explorer" : 
					case "IEMobile" : 
					case "Firefox" : 
						if(browserInfo.flashVersion != "0")
						{ //Er með Flash
							switch(filepathType)
							{
								case "mp4" : 
									filepath = streamingService.mp4.rtmp + orginal_filepath;
								break;
								case "mp3" : 
									filepath = streamingService.mp3.rtmp + orginal_filepath;
								break;
							}
							witchconfig = "3";//Internet Explorer/IEmobile/Firefox with Flash
							jwplayerEnable = true;
						}else
						{
							witchconfig = "4";//Internet Explorer/IEmobile/Firefox with NO Flash - Fallback to Smooth
						}
					break;					
				}

				var isDefault = false;

				if(protocol_service == "html5")
				{
					isDefault = true;
				}

				playlist_sources[playlist_sources_count] = {
					type : protocol_service,
					file : filepath,
					default : isDefault
				};

				playlist_sources_count++;//Talning fyrir sources count
			});
			
			//Setur gildin í playlista
			jwplayer_playlist[itemcount] = {	
											type : streamType, 
											image : playerimage, 
											title : playertitle,
											start : start_time,
											sources : playlist_sources
										};
						itemcount++;//Telja í playlista.
		});
		
		//		//Ef það eru fleirri en eitt item í playlista.
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
		if(jwplayerEnable == true)
		{
			//Keyra inn spilara í object (itemID).
			jwplayer(itemId).setup({
				playlist : jwplayer_playlist,
				width: playerWidth,
				height: playerHeight,
				aspectratio: "16:9",
				primary : "html5",
				src: '/sites/all/themes/at_krakkaruv

term_custom/scripts/jwp6/jwplayer/jwplayer.flash.swf',
				skin : '/sites/all/themes/at_krakkaruv

term_custom/scripts/jwp6/jwplayer-skins-premium/six.xml',
				autostart : player_autostart,
				fallback : true,
				stretching: "uniform",
				andriodhls: true,
			}).onSetupError(function(){ 
				var fileurl = "http://smooth.ruv.cache.is/"+orginal_filepath;
				var fallbackHTML5Player = "";
				var typeoffile;
				switch(filepathType)
				{
					case "mp4" : 
						typeoffile = "video/mp4";
					break;
					case "mp3" : 
						typeoffile = "audio/mp3";
					break;
					default :
						typeoffile = "video/mp4";
				}
				fallbackHTML5Player += "<video width='100%' controls poster='"+playerimage+"'>";
				fallbackHTML5Player += "<source src='"+fileurl+"' type='"+typeoffile+"'>";
				fallbackHTML5Player += "</video>";
				$("#"+itemId).replaceWith(fallbackHTML5Player);		
			}).onBeforePlay(function(){
				$('.views-slideshow-controls-bottom').addClass('hidden');
			}).onPause(function(){
				$('views-slideshow-controls-bottom').removeClass('hidden');
			});	
		}

		$("#witchconfig").html(browserInfo.OS+" / "+browserInfo.browserName+" / Flash "+browserInfo.flashVersion+" - C"+witchconfig);
	});	
	
	$('.jwplayer-live').each(function(i,x)
	{
		var itemId = $(x).attr('id'); //ID á spilara
		var isPlaylist = $(x).attr('playlist'); //Hvort að viðkomandi spilari innihaldi playlista.
		//Setup fyrir stærð á spilara
		var playerWidth = $(x).attr('width'); //Breidd
		var playerHeight = $(x).attr('height'); //Hæð
		var fullWidth = $(x).attr('fullwidth'); // Full width fyrir responsive spilara
		if (fullWidth == "true") {
			playerWidth = "100%";
		}
		
		//Default stillingar fyrir autoplay
		var player_autostart = "false";
		if($(x).attr('jwautostart') == "true")
		{
			player_autostart = "true";
		}
		//Playlistasetup
		var displayPlaylist = "";
		
		//Fetch items 
		var playbackfiles = $(x).find('source'); //Sækir öll eintök af source taggi sem innihalda slóð á skrá sem þarf að spila.
		//Setup loop
		var file_sources = new Array();
		var playerimage = $(x).attr('poster');
		if(playerimage == "")
		{
			playerimage = $(x).attr('image');
		}
		
		//Ef það slóðin er http (HLS) þá verður að breyta skráarendingunni.
		var channel = playbackfiles.attr('jw-src');
		var channel_id = channel.split(":");
		var playertitle = playbackfiles.attr('title');
		var live_channel_id = channel_id[1];
		
		var player_levels,player_modes;
		//Upplýsingar um tengipunkt útfrá ip og staðsetningu
		$.ajax({
			url : "/sites/all/themes/at_krakkaruv

term_custom/scripts/ajax-geo.php?channel="+live_channel_id,
			dataType : "json",
			async : 'false',
			success : function(data){ //Fær upplýsingar um tengipunkt
				var stream_urls = data.result;
				//Setur upp strauma fyrir RTMP og HLS
				player_levels  = [
					{file: stream_urls[1], image: playerimage }, //HLS
					{file: stream_urls[0]+"stream1", label: "360p SD"}, //RTMP
					{file: stream_urls[0]+"stream2", label: "640p SD"}, //RTMP
					{file: stream_urls[0]+"stream3", label: "720p HD"}, //RTMP
					{file: stream_urls[0]+"stream4", label: "1080p HD"} //RTMP					
				];
				/*player_modes = [
					{ type: 'html5' },
					{ type: 'flash', src: '/sites/all/themes/at_krakkaruv

term_custom/scripts/jwp6/jwplayer/jwplayer.flash.swf' }
				];*/
				
				jwplayer(itemId).setup({
					playlist : player_levels,
					image : playerimage, 
					poster : playerimage,
					title : playertitle,
					src: '/sites/all/themes/at_krakkaruv

term_custom/scripts/jwp6/jwplayer/jwplayer.flash.swf',
					skin : '/sites/all/themes/at_krakkaruv

term_custom/scripts/jwp6/jwplayer-skins-premium/six.xml',
					width: playerWidth,
					height: playerHeight,
					aspectratio: "16:9",
					hlslabels : {
						"Bestu gæði" : "2244",
						"Mið gæði" : "1173",
						"Góð gæði" : "781",
						"Farsímar" : "488"
					},
					primary : "flash",
					stretching: "uniform",
					andriodhls: true,
					autostart : player_autostart,
					fallback : true		
				}).onSetupError(function(){ 
					var fileurl = stream_urls[1];
					var fallbackHTML5Player = "";
					var typeoffile;
					switch(filepathType)
					{
						case "mp4" : 
							typeoffile = "video/mp4";
						break;
						case "mp3" : 
							typeoffile = "audio/mp3";
						break;
						default :
							typeoffile = "video/mp4";
					}
					fallbackHTML5Player += "<video width='100%' controls poster='"+playerimage+"'>";
					fallbackHTML5Player += "<source src='"+fileurl+"' type='"+typeoffile+"'>";
					fallbackHTML5Player += "<a href='"+fileurl+"'><img src='"+playerimage+"' width='100%'></a>";
					fallbackHTML5Player += "</video>";
					$("#"+itemId).replaceWith(fallbackHTML5Player);		
		 		}).onBeforePlay(function(){
					$('#inair').addClass("hidden");
					$('#mediaslider .views-slideshow-controls-top, #mediaslider .views-slideshow-controls-bottom').addClass('hidden');
				}).onPause(function(){
					$('#inair').removeClass("hidden");
					$('#mediaslider .views-slideshow-controls-top, #mediaslider .views-slideshow-controls-bottom').removeClass('hidden');
				});								
			}
		});		
	});


	/* Live radio players on frontpage */
	 
	$('#now-playing, #channel-placeholder').hover(function(){
		$('#radio-submenu').show();
		$('#radio-volume-control-container').hide();
	});
	
	$('#radio-volume-control').hover(function(){
		$('#radio-volume-control-container').show();
		$('#radio-submenu').hide();
	});
	
	$('#radio-volume-control').click(function(){
		if(jwplayer('player-placeholder').getMute() == false)
		{
			jwplayer('player-placeholder').setMute(true);
			$(this).removeClass('fa-volume-up').removeClass('fa-volume-down').addClass('fa-volume-off');
		}else{
			jwplayer('player-placeholder').setMute(false);
			jwplayer('player-placeholder').setVolume('60');
			$(this).removeClass('fa-volume-off').addClass('fa-volume-up');
		}
	});
	
	$("#slider").slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: 60,
		slide: function( event, ui ) {
			var volumelevel = ui.value;
			jwplayer('player-placeholder').setVolume(volumelevel);
			$('#radio-volume-control').attr("title","Hljóðstyrkur "+volumelevel);
			if(volumelevel < 50)
			{
				$('#radio-volume-control').removeClass('fa-volume-up').addClass('fa-volume-down');
			}
			if(volumelevel < 1)
			{
				$('#radio-volume-control').removeClass('fa-volume-down').addClass('fa-volume-off');
			}
			if(volumelevel > 50)
			{
				$('#radio-volume-control').removeClass('fa-volume-down').removeClass('fa-volume-off').addClass('fa-volume-up');
			}				
		}
	});
	
	$("#horiz-slider").slider({
		orientation: "horizontal",
		range: "min",
		min: 0,
		max: 100,
		value: 60,
		slide: function( event, ui ) {
			var volumelevel = ui.value;
			jwplayer('player-placeholder').setVolume(volumelevel);
			$('#radio-volume-control').attr("title","Hljóðstyrkur "+volumelevel);
			if(volumelevel < 50)
			{
				$('#radio-volume-control').removeClass('fa-volume-up').addClass('fa-volume-down');
			}
			if(volumelevel < 1)
			{
				$('#radio-volume-control').removeClass('fa-volume-down').addClass('fa-volume-off');
			}
			if(volumelevel > 50)
			{
				$('#radio-volume-control').removeClass('fa-volume-down').removeClass('fa-volume-off').addClass('fa-volume-up');
			}				
		}
	});

	$('.radio-menu').live({
		mouseover : function(){
			var channel = $(this).attr('rel');
			$(this).find('.icon').removeClass('color-gray').addClass("color-"+channel);
		},
		mouseout : function(){
			var channel = $(this).attr('rel');
			if($(this).find('.icon').hasClass('radio-menu-hold') == false)
			{
				$(this).find('.icon').removeClass("color-"+channel).addClass('color-gray');
			}
		},	
		keypress : function(event){
			if(e.which == 13){
				$(this).click();
			}
		},	
		click: function(event){
			var channel = $(this).attr('rel');
			var channel_name_class = "icon-"+channel;
			
			$('.radio-menu-hold').removeClass('radio-menu-hold color-ras1 color-ras2 color-rondo').addClass('radio-menu color-gray');
			$(this).find('.icon').removeClass('radio-menu color-gray').addClass('radio-menu-hold color-'+channel);
			
			
			$('#channel-placeholder').
				removeClass('icon-ras1').
				removeClass('icon-ras2').
				removeClass('icon-rondo').
				removeClass('color-ras1').
				removeClass('color-ras2').
				removeClass('color-rondo').
				removeClass('color-gray').
				addClass('icon '+channel_name_class+" color-"+channel);
			$('#now-playing').
				removeClass('color-ras1').
				removeClass('color-ras2').
				removeClass('color-rondo').
				removeClass('color-gray').
				addClass("color-"+channel).
				attr('rel',channel);
			$('#radio-volume-control').
				removeClass('color-ras1').
				removeClass('color-ras2').
				removeClass('color-rondo').
				removeClass('color-gray').
				addClass("color-"+channel);		
			$('#eject-player').
				removeClass('color-ras1').
				removeClass('color-ras2').
				removeClass('color-rondo').
				removeClass('color-gray').
				addClass("color-"+channel).
				attr('rel',channel);
			$('.ui-slider-range').
				removeClass('fill-ras1').
				removeClass('fill-ras2').
				removeClass('fill-rondo').
				addClass('fill-'+channel);

			var smalltitle = "";
			switch(channel)
			{
				case "ras1" :
					smalltitle = "Rás 1";
				break;
				case "ras2" :
					smalltitle = "Rás 2";
				break;
				case "rondo" :
					smalltitle = "Rondó";
				break;
			}

			$('#channel-title').html(smalltitle);
			
			
			//$('#radio-submenu').hide();
			
			var player_levels,player_modes;
			
			if(channel == "rondo")
			{
				channel = "ras3";
			}		
			
			var stream_urls = ["rtmp://ruv"+channel+"livefs.fplive.net/ruv"+channel+"live-live/","http://sip-live.hds.adaptive.level3.net/hls-live/ruv-"+channel+"/_definst_/live.m3u8"];
			//Setur upp strauma fyrir RTMP og HLS
			player_levels  = [
				{file: stream_urls[0]+"stream1"}, //RTMP
				{file: stream_urls[0]+"stream2"}, //RTMP
				{file: stream_urls[0]+"stream3"}, //RTMP
				{file: stream_urls[0]+"stream4"}, //RTMP
				{file: stream_urls[1] } //HLS
			];
			player_modes = [
				{ type: 'html5' },
				{ type: 'flash', src: '/sites/all/themes/at_krakkaruv

term_custom/scripts/jwp6/jwplayer/jwplayer.flash.swf' }
			];
			
			jwplayer('player-placeholder').setup({
				levels : player_levels,
				modes: player_modes,
				width: 0,
				height: 0,
				primary : "flash",
				autostart : true,
				fallback : true		
			}).onBuffer(function(){
				$('#now-playing').removeClass('fa-play').removeClass('fa-pause').addClass('fa-refresh fa-spin');
				$('#player-note').html('Sæki streymi...').fadeTo('fast',1);
			}).onPlay(function(){
				$('#now-playing').removeClass('fa-refresh fa-spin').addClass('fa-pause');
				$('#eject-player').addClass('active-player');
				$('#player-note').html('Streymir '+smalltitle).delay('3000').fadeTo('fast',0);
				var volumelevel = jwplayer('player-placeholder').getVolume();
				$('#now-playing').attr('title','Stoppa streymi');
				$('#radio-volume-control').attr("title","Hljóðstyrkur "+volumelevel);
				$('#radio-volume-control').removeClass('fa-volume-off').addClass('fa-volume-up');
			});

			//Function to load dagskra item with ajax on radio player in popup-player
			ajax_load_current_program(channel);
			event.preventDefault();
		}
	});

	function ajax_load_current_program(channel)
	{
		$.get("/ajax/iloftinu/"+channel,
			function(data){
				$('#iloftinu-ajax').html(data);
		});
		setTimeout(function(){ ajax_load_current_program(channel); },60000);
	}

	
	
	$('#radio-submenu, #radio-volume-control-container').mouseleave(function(){
		$(this).hide();
	});
	
	$('.active-player').live({
		click : function(){
			$('#now-playing').removeClass('fa-pause').addClass('fa-play');
			jwplayer('player-placeholder').stop();
			var utvarp = $(this).attr('rel');
			window.open('/nolayout/popup/'+utvarp,utvarp+'-popupradio','width=400, height=100, menubar=no, scrollbars=no, location=no');
		}
	});
	
	$('#now-playing').click(function(){
		
		var playerstate = jwplayer('player-placeholder').getState();
		var channel = $(this).attr('rel');

		switch(playerstate)
		{
			/*case "IDLE" :
				$('.icon.radio-menu[rel='+channel+']').click();
			break;*/
			case "PLAYING" :
				jwplayer('player-placeholder').stop();
				$('#player-note').html('Stöðva streymi').fadeTo('fase',1).delay('3000').fadeTo('slow',0);
				$('#now-playing').removeClass('fa-pause').addClass('fa-play');
				$('#now-playing').attr('title','Hefja streymi');

			break;
			default :
				$('#player-note').html('Sæki streymi...').fadeTo('fast',1);
				jwplayer('player-placeholder').play().onBuffer(function(){
					$(this).removeClass('fa-play').removeClass('fa-pause').addClass('fa-refresh fa-spin');
				}).onPlay(function(){
					$(this).removeClass('fa-play').removeClass('fa-refresh fa-spin').addClass('fa-pause');
				});	
		}
	});
	/* Live radio ends */
	
	$(".sarps-klippur li a").click(function(e){
		e.preventDefault();
		var seektime = $(this).attr('rel');
		jwplayer("sarpur-player").seek(seektime);

		$(".sarps-klippur li").removeClass('active');
		$(this).closest('li').addClass('active');

	});

	var cliptime = [];

	$(".sarps-klippur li a").each(function(i,x){
		var cliptimevalue = $(x).attr('rel');
		var clip_id = $(x).attr('id');
		cliptime[cliptimevalue] = clip_id; 
	});

	var setactive = [];

	if(jwplayer('sarpur-player').length > 0)
	{
		jwplayer('sarpur-player').onTime(function(){
			var p = Math.round(this.getPosition());
			if(evaluateTime(p) === true)
			{
				if(setactive[p] === undefined)
				{
					var clip_id = clipID(p);
					$(".sarps-klippur li a").removeClass('active');
					$('#'+clip_id).addClass('active');
					setactive[p] = 1;
				}
			}
		});
	}

	/* Kannar hvort að browserinn styðji HTML5 */
	function isCanvasSupported(){
	  var elem = document.createElement('canvas');
	  return !!(elem.getContext && elem.getContext('2d'));
	}

});