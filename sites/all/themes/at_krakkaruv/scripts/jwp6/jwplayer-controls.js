jQuery(document).ready(function($)
{
	$('body').keypress(function(event){
		//Commandkey = ALT
		//console.log(event.altKey);
		//console.log(event.charCode);
		if(event.altKey == true) 
		{
			var state = jwplayer().getState();
			var volume = jwplayer().getVolume();
			var position = jwplayer().getPosition();
			var duration = jwplayer().getDuration();
			switch(event.charCode)
			{
				case 52 : // Commandkey + 4 -> Rewind
					var new_pos = Math.round(position - 30);
					if(new_pos <= 0)
					{
						new_pos = 0;
					}
					jwplayer().seek(new_pos);
				break;
				case 53 : //Commandkey + 5 -> Volume down
					var new_volume = Math.round(volume - 10);
					if(new_volume < 0)
					{
						new_volume = 0;
					}
					jwplayer().setVolume(new_volume);
				break;
				case 54 :// Commandkey + 6 -> play / pause
					if(state == 'PLAYING')
					{
						jwplayer().pause(true);
					}else
					{
						jwplayer().play();
					}
				break;
				case 55 : //Commandkey + 7 -> Volume Up
					var new_volume = Math.round(volume + 10);
					if(new_volume > 100)
					{
						new_volume = 100;
					}
					jwplayer().setVolume(new_volume);
				break;
				case 56 : // Commandkey + 8 -> Forward
					var new_pos = Math.round(position + 30);
					if(new_pos >= duration)
					{
						new_pos = duration;
					}
					jwplayer().seek(new_pos);
				break;
			}
			//event.preventDefault();
		}
		
	});
	$(".sarps-klippur li a.cliptime").click(function(e){
	    e.preventDefault();
	    var seektime = $(this).attr('rel');
	    jwplayer("sarpur-player").seek(seektime);

	    $(".sarps-klippur li").removeClass('active');
	    $(this).closest('li').addClass('active');

    });

    var cliptime = [];

    $(".sarps-klippur li a.cliptime").each(function(i,x){
        var cliptimevalue = $(x).attr('rel');
        var clip_id = $(x).attr('id');
        cliptime[cliptimevalue] = clip_id; 
    });

    $(".sarps-klippur li").hover(function(){
		$(this).find('.clip-social-links').removeClass('hidden');
	},function(){
		$(this).find('.clip-social-links').addClass('hidden');
	});

	$(".sarps-klippur li .clip-social-links a").hover(function(){
		$(this).find('i.fa').addClass('color-white');
	},function(){
		$(this).find('i.fa').removeClass('color-white');
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
                    $(".sarps-klippur li a.cliptime").removeClass('active');
                    $('#'+clip_id).addClass('active');
                    setactive[p] = 1;
                }
            }
        });
    }
});