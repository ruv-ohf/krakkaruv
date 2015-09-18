/**
 * WhereAmI AngularJS application configuration
 * 
 * @author compleXolution <info@complexolution.com>
 * @version 1.5.1
 */
whereAmI = {
    config: {

        branding: 'Hvar er ég?',    // The branding to use in the title and navbar

        googleMapsApiKey: '',       // Google Maps API Key
        facebookAppId: '',          // Facebook App ID (optional, required for share button only)

        newGameTemplate: {
            steps: 5,               // The number of turns in a game
            score: 0                // The initial score
        },
        
        markerIconGuess: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',    // Marker icon for guesses
        markerIconCorrect: 'http://maps.google.com/mapfiles/ms/icons/green.png',    // Marker icon for correct locations
		
		// Define regions and places where random locations should be picked from
		defaultMapPosition: {
			lat: 40.758895, 
			lng: -73.985131,
			zoom: 13
		},
        
        // Define regions and places where random locations should be picked from
        places: [           
            
            // When type = streetViewLocation, the coordinates array is in simple [lat,lng] format.
            { name: 'Times Square, New York', 
                type: 'streetViewLocation', 
                coordinates: [40.758895, -73.985131],
                deals: 'api-demo/deals.php?id=times-square'      // Optional deals API endpoint, to show deals for the current region in an iframe
            },
            
            // When type = streetViewRegion, the coordinates array is in an array of [lat,lng].
            { name: 'Budapest', 
                type: 'streetViewRegion', 
                coordinates: [ [47.5, 19.0], [47.6, 19.0], [47.6, 19.1], [47.5, 19.1] ],
                deals: 'api-demo/deals.php?coordinates=%%COORDINATES%%'   // %%COORDINATES%% will be replaced with latitude,longitude values
            },
            
            // When type = gallery, the streetview area turns into a simple gallery
            { name: 'Piccadilly Circus, London', 
                type: 'gallery', 
                coordinates: [51.510258, -0.133879,17],
                images: [
                    'http://upload.wikimedia.org/wikipedia/commons/2/23/Piccadilly-circus-2004.jpg',
                    'http://upload.wikimedia.org/wikipedia/en/thumb/8/87/London_%2C_Kodachrome_by_Chalmers_Butterfield.jpg/1024px-London_%2C_Kodachrome_by_Chalmers_Butterfield.jpg',
                    'http://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Piccadilly_Circus_in_London_1962_Brighter.jpg/1024px-Piccadilly_Circus_in_London_1962_Brighter.jpg'
                ],
                deals: 'api-demo/deals.php?id=piccadilly'
            }
            
            /*
            ,{ name: 'Europe', 
                type: 'streetViewRegion', 
                coordinates: [[68.74634196954582, 33.519287109375],[69.18794532816639, 33.59619140625],[69.2736528155187, 33.101806640625],[69.21915080729545, 32.607421875],[68.94458043980954, 32.49755859375],[68.79408096149704, 29.256591796875],[69.22304834651693, 29.718017578125],[69.42476011465202, 31.201171875],[69.76185679645226, 31.31103515625],[69.9698488321097, 30.322265625],[70.3057841895306, 31.695556640625],[70.63266248707315, 31.09130859375],[70.96507259301342, 29.366455078125],[71.17889505973734, 28.67431640625],[71.2496534880684, 27.44384765625],[71.08296286656015, 26.65283203125],[71.30959645625158, 26.015625],[71.21076814555101, 23.66455078125],[70.96865539856438, 23.115234375],[70.76339586058107, 21.3134765625],[70.50840787200406, 21.368408203125],[70.45334638895723, 20.14892578125],[70.5010749627574, 18.709716796875],[70.17579022164703, 17.852783203125],[69.86800099157304, 18.03955078125],[69.5249122415947, 16.622314453125],[69.4479136623474, 15.523681640625],[69.21525256928653,15.084228515625],[68.8456827679455, 13.82080078125],[68.5222019155703, 13.9306640625],[68.07945769251718, 12.425537109375],[67.3504400809675, 11.414794921875],[67.22317969918987, 11.898193359375],[67.55265640140559, 13.02978515625],[67.89415341346184, 13.524169921875],[67.98493182436603, 14.4580078125],[67.61549716460256, 14.0185546875],[67.42225501238767, 13.326416015625],[67.07385369337244, 12.974853515625],[66.80273059172438, 11.876220703125],[66.36174470352536, 11.502685546875],[65.70577831745511, 11.370849609375],[65.3049452084133, 11.09619140625],[64.92586979490835, 9.920654296875],[64.5035504066553, 10.184326171875],[64.19442343702703, 9.31640625],[63.92047329565707, 7.877197265625],[63.648697570849286, 7.80029296875],[63.443142420685255, 7.064208984375],[63.24599409649571, 7.1630859375],[62.68674886147266, 5.44921875],[62.10131232774255, 4.515380859375],[61.41512211424534, 4.119873046875],[60.535670296892135, 4.19677734375],[59.52596149713797, 4.493408203125],[59.240605483300556, 4.471435546875],[58.36427519285588, 5.2294921875],[57.824280360856264, 6.251220703125],[57.64834025680058, 7.62451171875],[58.37579834033745, 9.569091796875],[58.70833614572296, 10.26123046875],[58.063350318147386, 10.8544921875],[57.765728734885194, 9.415283203125],[57.382822325566366, 8.89892578125],[57.17496981102601, 7.80029296875],[55.7487578359952, 7.49267578125],[55.05005589189804, 7.657470703125],[54.39655031438518, 7.745361328125],[54.01745222977421, 7.064208984375],[53.6348677883201, 4.603271484375],[52.619725272670294, 3.812255859375],[51.4094858955551, 2.30712890625],[51.730430542940184, 1.64794921875],[52.67305135923188, 2.449951171875],[53.18299586008718, 1.834716796875],[53.34727222643009, 0.6591796875],[54.689709430616546, -0.02197265625],[54.92398527186035, -0.791015625],[55.93997139914653, -1.318359375],[56.16696465022672, -2.076416015625],[57.742281477244454, -1.065673828125],[57.96441703868648, -1.505126953125],[58.00518739971227, -3.076171875],[58.93583884471029, -2.08740234375],[60.215262157101726, -0.494384765625],[61.07688765690606, -0.406494140625],[61.082200589284355, -1.318359375],[60.503230217219034, -2.362060546875],[59.91923685371464, -2.691650390625],[58.91315571775059, -4.10888671875],[58.839332591651775, -5.64697265625],[58.75965446428805, -6.910400390625],[58.312374450913, -7.789306640625],[57.84767441961376, -8.909912109375],[57.601278249736005, -8.76708984375],[57.52467237801596, -8.031005859375],[56.917998496857315, -8.2177734375],[56.38654270188628, -7.635498046875],[56.06283634317047, -7.00927734375],[55.575239380091226, -7.00927734375],[55.4632852242562, -8.536376953125],[54.79751835965899, -9.4921875],[54.57524580078331, -9.613037109375],[54.3197273165176, -10.843505859375],[53.202742353507226, -10.843505859375],[52.8459123539017, -10.096435546875],[52.25807132666112, -11.195068359375],[51.47796179607124, -10.821533203125],[50.8926391311106, -9.547119140625],[51.614605707797466, -7.305908203125],[52.089632613639715, -5.95458984375],[53.73896488496292, -5.592041015625],[54.159217654166895, -5.185546875],[53.81038242731128, -5.108642578125],[54.04971418210692, -3.8671875],[53.75845444856318, -3.8671875],[53.49784954396767, -5.240478515625],[53.05112003878514, -5.07568359375],[52.59303784115741, -5.20751953125],[52.30511992110524, -4.8779296875],[51.87309959004367, -5.965576171875],[51.32031367286622, -5.372314453125],[51.4094858955551, -4.658203125],[50.46100111599232, -5.855712890625],[50.152266272562684, -6.646728515625],[49.64273443429918, -6.6796875],[49.58578744112235, -5.635986328125],[49.954754298064195, -4.37255859375],[49.954754298064195, -3.658447265625],[50.306884231551166, -2.724609375],[50.257741984396894, -1.2744140625],[50.551834865795186, 0.648193359375],[50.13114315479007, 0.15380859375],[49.81317633337614, -0.560302734375],[49.990083926193925, -2.48291015625],[49.56441516255451, -3.36181640625],[49.17093019244911, -3.284912109375],[48.832181625698475, -5.64697265625],[47.535746978239125, -5.482177734375],[47.357431944587034, -3.97705078125],[46.74362499884437, -3.218994140625],[46.1912395780416, -2.39501953125],[45.52559248776561, -1.900634765625],[43.92559366355069, -2.186279296875],[43.830564195198264, -4.075927734375],[44.02837121279199, -6.767578125],[44.319918120477425, -8.426513671875],[43.76712702120528, -9.29443359375],[43.337164854911094, -10.118408203125],[42.0615286181226, -9.656982421875],[40.86783384138491, -9.51416015625],[38.603993275591684, -10.338134765625],[38.087013204022725, -9.73388671875],[37.82714141683739, -9.349365234375],[36.71687068791303, -9.635009765625],[36.42570252039198, -9.151611328125],[36.64638529597495, -7.174072265625],[35.964669147704086, -6.778564453125],[35.48751102385376, -5.5810546875],[36.11125252076156, -3.66943359375],[36.25313319699069, -0.87890625],[37.98750437106374, 0.3515625],[38.212288054388175, 1.5380859375],[38.899583425982705, 2.3291015625],[38.69408504756833, 3.2958984375],[39.58029027440865, 5.42724609375],[40.88860081193033, 4.7900390625],[39.96870074491693, 1.0986328125],[40.72228267283148, 1.5380859375],[41.582579601430346, 4.06494140625],[42.80346172417078, 4.06494140625],[42.382894009614056, 5.82275390625],[43.17313537107136, 7.998046875],[41.7631174470059, 7.5146484375],[41.43449030894922, 7.998046875],[40.88860081193033, 7.18505859375],[38.40194908237822, 7.6904296875],[38.436379603, 10.21728515625],[40.60561205826018, 10.634765625],[41.812267143599804, 10.48095703125],[40.72228267283148, 12.0849609375],[39.816975090490004, 14.43603515625],[39.0533181067413, 14.39208984375],[38.659777730712534, 11.4697265625],[37.57505900514996, 11.8212890625],[37.09462150015557, 11.3818359375],[36.37264499608118, 11.6015625],[35.3039185653117, 12.28271484375],[35.294952147406576, 13.5791015625],[36.46988944681576, 13.0078125],[35.411438052435464, 14.512939453125],[35.875698032496665, 15.501708984375],[36.38149043210595, 14.87548828125],[36.42570252039198, 15.908203125],[37.46177847961746, 15.79833984375],[38.12591462924157, 17.46826171875],[39.35978526869001, 17.86376953125],[39.46164364205549, 18.96240234375],[40.83874913796459, 18.8525390625],[42.67435857693384, 14.83154296875],[43.60426186809618, 14.17236328125],[44.55133484083592, 13.4033203125],[43.413028684751445, 15.1611328125],[42.60970621339408, 16.14990234375],[41.77950486590359, 18.45703125],[41.20758898181025, 19.434814453125],[42.386951440524854, 20.313720703125],[43.01669737169671, 20.63232421875],[43.67979094030124, 19.215087890625],[43.281204464332745, 17.9736328125],[44.66474608911831, 16.402587890625],[44.58655513209543, 18.797607421875],[44.68037164189037, 19.720458984375],[45.30193900072717, 19.9951171875],[45.71001523943372, 19.5556640625],[45.50249699389712, 20.379638671875],[44.937585003910904, 20.8740234375],[44.3906169787868, 21.42333984375],[43.99676629896825, 21.917724609375],[43.16912913272099, 22.203369140625],[42.386951440524854, 21.99462890625],[41.75082413553287, 22.532958984375],[41.03378713521864, 22.532958984375],[41.17451935556443, 24.312744140625],[41.05035951931887, 25.960693359375],[41.58668835697237, 26.817626953125],[41.70162734378918, 28.4326171875],[42.435620156499795, 28.19091796875],[43.201171681272456, 28.509521484375],[43.60823944964323, 29.1357421875],[44.80522439622254, 29.300537109375],[45.48709473229837, 29.344482421875 ],[45.57944511437787, 28.487548828125],[46.81885778879603, 28.509521484375],[47.58023129789275, 27.850341796875],[48.16974908365419, 27.35595703125],[48.37449671682332, 26.38916015625],[48.44742209577055, 25.94970703125],[48.35989909002194, 25.51025390625],[48.14043243818811, 25.55419921875],[48.05972528178406, 24.949951171875],[48.27953734226005, 23.060302734375],[48.57842428752037, 22.69775390625],[48.86110101269274, 23.302001953125],[49.52877389852215, 23.192138671875],[49.72092792670335, 24.32373046875],[50.06066538593667, 24.268798828125],[49.990083926193925, 23.587646484375],[50.48197825997291, 24.466552734375],[51.614605707797466, 24.005126953125],[52.29168256269092, 23.9501953125],[52.7396175542709, 24.43359375],[53.58272269994398, 24.136962890625],[53.991624640444314, 25.3125],[53.92698552779884, 25.83984375],[54.13347814286039, 26.279296875],[54.45407332522336, 26.004638671875],[54.89872361296002, 26.3671875],[55.11294279005422, 27.04833984375],[55.58144971869656, 27.04833984375],[55.63109707296326, 27.894287109375],[55.92150795277898, 28.201904296875],[56.307396031366366, 28.531494140625],[57.001858813506765, 28.125],[57.370976638162986, 28.1689453125],[57.607164335274184, 27.8173828125],[57.87105329209309, 28.1689453125],[58.71974675900472, 27.8173828125],[59.425521757748825, 28.5205078125]],
                deals: 'api-demo/deals.php?coordinates=%%COORDINATES%%'
            },
            
            { name: 'North America', 
                type: 'streetViewRegion', 
                coordinates: [[50.597186230587035, -129.0234375],[48.42920055556841, -125.5078125],[46.34692761055676, -124.453125],[42.779275360241904, -124.892578125],[41.27780646738183, -124.62890625],[39.9434364619742, -125.068359375],[36.70365959719456, -122.431640625],[33.61461929233378, -120.849609375],[32.879587173066305, -118.4765625],[30.486550842588482, -116.455078125],[28.8831596093235, -115.83984375],[27.332735136859146, -115.400390625],[25.760319754713887, -113.37890625],[23.36242859340884, -111.62109375],[22.14670778001263, -109.6875],[22.958393318086348, -108.193359375],[22.79643932091949, -107.314453125],[21.08450008351735, -106.171875],[20.262197124246534, -106.611328125],[17.43451055152291, -103.095703125],[14.817370620155266, -96.767578125],[15.072123545811683, -94.74609375],[13.966054081318314, -92.28515625],[12.940322128384626, -90.615234375],[16.1724728083975, -87.275390625],[19.518375478601566, -86.8359375],[22.553147478403194, -86.1328125],[21.3303150734318, -91.40625],[19.518375478601566, -91.845703125],[18.8543103618898, -94.04296875],[19.435514339097825, -95.625],[22.958393318086348, -97.20703125],[27.176469131898894, -96.240234375],[29.036960648558267, -93.603515625],[28.497660832963472, -90.3515625],[29.420460341013133, -86.8359375],[28.8831596093235, -84.0234375],[26.941659545381516, -83.759765625],[24.32707654001865, -81.73828125],[24.32707654001865, -81.73828125],[24.726874870506972, -79.189453125],[28.497660832963472, -79.189453125],[30.713503990354965, -80.5078125],[34.415973384481866, -74.794921875],[37.1252862849668, -74.970703125],[39.740986355883564, -72.421875],[40.68063802521456, -68.90625],[43.100982876188546, -68.642578125],[42.32606244456202, -66.4453125],[42.58544425738491, -63.984375],[44.49650533109348, -62.75390625],[45.12005284153054, -59.677734375],[46.40756396630067, -58.095703125],[46.34692761055676, -55.01953125],[45.920587344733654, -53.701171875],[47.54687159892238, -51.50390625],[49.75287993415022, -53.0859375],[50.317408112618686, -55.01953125],[49.866316729538674, -58.359375],[48.312427904071775, -60.556640625],[46.81509864599243, -61.8310546875],[48.004625021133904, -63.8525390625],[48.64742780553354, -68.90625],[48.929717630629554, -70.7080078125],[49.46098385110948, -72.2021484375],[49.14578361775004, -73.41064453125],[48.17341248658083, -72.9052734375],[46.837649560937464, -73.388671875],[46.76244305208004, -75.41015625],[48.070738264258296, -76.39892578125],[48.71271258145237, -78.59619140625],[48.828565527993234, -80.13427734375],[49.61782831211114, -81.474609375],[50.014799234787844, -84.3310546875],[50.18393346184497, -86.748046875],[50.46449795300867, -88.17626953125],[50.74340774029213, -89.384765625],[49.30363576187125, -89.560546875],[49.93000812460691, -90.54931640625],[50.450509053586586, -91.7138671875],[50.52041218671901, -94.06494140625],[52.3688917060255, -96.767578125],[53.75520681580145, -99.38232421875],[56.13330691237569, -97.294921875],[57.148160713298324, -99.052734375],[53.72271667491848, -101.07421875],[55.28537238249355, -101.97509765625],[55.96765007530668, -105.9521484375],[56.51707901932375, -108.91845703125],[57.058656606677616, -110.01708984375],[54.983918190363234, -110.478515625],[55.109800793143805, -112.0166015625],[55.91842985630817, -113.5107421875],[56.68640819588568, -114.6533203125],[56.016807763203225, -115.42236328125],[56.68640819588568, -116.74072265625],[56.794862261400546, -120.05859375],[61.079544234557304, -125.15625],[63.99523519297698, -132.01171875],[64.37794095121995, -135.087890625],[68.83180177092166, -131.572265625],[69.20940390181205, -133.9453125],[64.60503753178526, -139.39453125],[65.05360170595502, -142.119140625],[71.00265967789278, -147.568359375],[70.80136623397624, -151.875],[65.85675647909318, -153.6328125],[64.21593657413428, -151.083984375],[62.237232893654486, -153.1494140625],[60.05387385148492, -152.9296875],[58.7111891496366, -152.138671875],[59.38917842312835, -148.7548828125],[60.662414765343684, -147.216796875],[59.92199002450385, -145.1513671875],[59.47856883192639, -141.5478515625],[58.367156332478885, -138.0322265625],[56.23113850341276, -135.615234375],[54.73730756865752, -133.857421875],[53.05442186546102, -133.2861328125],[51.303145259199056, -131.5283203125]]
            }
            */
            
        ],
        
        maxPointsPerGuess: 15000,   // Maximum points a user can get for a guess
        decreasePointsByKm: 3,      // The number of points to decrease the score based on distance

        searchRadius: 100,          // Default search radius for a valid street view coordinate
        
        allowChangeTheme: true,     // Allow switching bootswatch (free Bootstrap 3) themes
        
        leaderboard: 'api-demo/leaderboard.php', // Leaderboard API endpoint

        defaultLanguage: 'is',              // The default language to use
        availableLanguages: ['en', 'hu', 'is'],   // Available languages
        translations: {                     // Translations
            'New Game': { hu: 'Új játék', is : 'Nýr leikur' }, 
            'Full Screen': { hu: 'Teljes képernyő', is: 'Fylla út skjá' },
            'Change Theme': { hu: 'Sablon választása', is: 'Breyta þema' },
            'Next': { hu: 'Következő', is: 'Næsta' },
            'Start New Game!': { hu: 'Új játék', is: 'Byrja nýjan leik!' },
            'Make a Guess': { hu: 'Tippelés', is:'Giskaðu' },
            'click on the map!': { hu: 'kattints a térképre!', is: 'smelltu á kortið!' },
            'Leaderboard': { hu: 'Toplista', is: 'Stigatafla' },
            'Close': { hu: 'Bezárás', is: 'Loka' },
            'Game Over': { hu: 'A játék véget ért', is: 'Leik lokið' },
            'Your Nickname': { hu: 'Beceneved', is: 'Gælunafnið þitt' },
            'Submit High Score': { hu: 'Toplistába vele!', is:'Senda inn stig' },
            'Share on Facebook': { hu: 'Megosztás Facebookon', is:'Deila á Facebook' },

            // You can override text in the default language as well:
            'INTRO': { en: 'Can you find out where you are?', 
                       hu: 'Találd ki, hogy merre jársz!',
                       is : 'Getur þú fundið út hvar þú ert?' },

            'CONFIRM_NEW_GAME': { en: 'Are you sure you want to start a new game? Your current progress will be lost!',
                                  hu: 'Biztosan új játékot indítasz? A jelenlegi állás el fog veszni!',
                                  is: 'Ertu viss um að þú viljir byrja nýjan leik? Staðan í núverandi leik tapast!' },

            'GUESS_SUMMARY': { en: 'You have collected $points points. The original location ($location) was $distance km from where you put the marker.',
                               hu: '$points pontot szereztél. Az eredeti helyszín ($location) $distance km-re volt az általad tippelt helytől.',
                               is: 'Þú hefur náð $points stigum.  Staðsetning ($location) var $distance km frá þeim stað sem þú settir niður merkið.' },

            'GAME_SUMMARY': { en: 'Congratulations, you have collected <code class="score">$score</code> points in this game!',
                              hu: 'Gratulálunk, ebben a játékban összesen <code class="score">$score</code> pontot szereztél!',
                              is: 'Til hamingju! Þú hefur safnað <code class="score">$score</code> stig í þessum leik!'}
        }

    }
};