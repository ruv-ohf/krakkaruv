/*
 * Tronix
 *
 * (c) 2014 Danijel Durakovic
 *
 */

Tronix = function() {
	// asset loader module
	Assets = function() {
		// assets to be loaded
		var assetList = {
			// graphics
			gfx_sprites: 'gfx/sprites.png',
			gfx_menu: 'gfx/menu.png',
			gfx_ui: 'gfx/ui.png',
			gfx_arrow: 'gfx/arrow.png',
			// graph definitions
			graphs: 'data/graphs.json',
			// user config
			user: 'data/user.json'
		};

		// compiled collection of assets
		var loadedAssets = {};

		// retreive a filename's extension
		var GetExt = function(filename) {
			return filename.split('.').pop().toLowerCase();
		};

		// iterator
		var Iterate = function(collection, callback) {
			for (var obj in collection)
				if (collection.hasOwnProperty(obj))
					callback(obj, collection[obj]);
		};

		return {
			// load function
			// usage: Load(finished callback, [progress callback])
			Load: function(finished, progress) {
				// track item loading
				var itemsLoaded = 0;

				// count items to load
				var itemsToLoad = 0;
				Iterate(assetList, function(key, property) {
					var ext = GetExt(property);
					if (['png', 'jpg', 'jpeg', 'json'].indexOf(ext) > -1)
						itemsToLoad++;
				});

				// advance the progress when individual resource is loaded
				var Advance = function() {
					// increment counter
					itemsLoaded++;
					// track progress and finish when all items are done loading
					if (progress instanceof Function)
						progress(itemsLoaded, itemsToLoad);
					if (finished instanceof Function && itemsLoaded == itemsToLoad)
						finished();
				};

				// load media assets
				Iterate(assetList, function(key, property) {
					var ext = GetExt(property);
					if (['png', 'jpg', 'jpeg'].indexOf(ext) > -1) {
						// load image asset
						var loadImg = loadedAssets[key] = new Image();
						loadImg.src = property;
						loadImg.addEventListener('load', Advance, false);
					}
					else if ('json' === ext) {
						// request json file
						var xhr = new XMLHttpRequest();
						xhr.open('get', property, true);
						xhr.send(null);
						xhr.onreadystatechange = function() {
							if (xhr.readyState === 4 && xhr.status === 200) {
								// parse json data from file
								var json = xhr.responseText;
								loadedAssets[key] = JSON.parse(json);
								Advance();
							}
						};
					}
				});
			},
			// retreive a media asset
			Get: function(asset) {
				return loadedAssets[asset];
			}
		};
	}();

	// draw module
	var Draw = function() {
		// drawing context
		var ctx;

		return {
			// set drawing context
			SetContext: function(context) {
				ctx = context;
			},
			// sets global alpha
			// usage: SetAlpha ([alpha = 1.0])
			SetAlpha: function(alpha) {
				if (typeof alpha == 'undefined')
					alpha = 1.0;
				if (alpha > 1.0)
					alpha = 1.0;
				else if (alpha < 0.0)
					alpha = 0.0;
				ctx.globalAlpha = alpha;
			},
			// clear area
			// usage: Clear(x, y, width, height)
			Clear: function(x, y, w, h) {
				ctx.clearRect(x, y, w, h);
			},
			// draws text
			// usage: Text(text, x, y, [fillStyle], [textAlign], [font])
			Text: function(text, x, y, fillStyle, textAlign, font) {
				if (typeof fillStyle == 'undefined')
					fillStyle = '#fff';
				if (typeof textAlign == 'undefined')
					textAlign = 'left';
				if (typeof font == 'undefined')
					font = '12px sans-serif';
				ctx.textBaseline = 'top';
				ctx.fillStyle = fillStyle;
				ctx.textAlign = textAlign;
				ctx.font = font;
				ctx.fillText(text, x, y);
			},
			// draws a rectangle
			// usage: Rect(x, y, width, height, [fillStyle], [lineWidth])
			Rect: function(x, y, w, h, fillStyle, lineWidth) {
				if (typeof fillStyle == 'undefined')
					fillStyle = '#fff';
				if (typeof lineWidth == 'undefined')
					lineWidth = 1;
				ctx.strokeStyle = fillStyle;
				ctx.lineWidth = lineWidth;
				ctx.strokeRect(x, y, w, h);
			},
			// draws a filled rectangle
			// usage: RectFill(x, y, width, height, [fillStyle])
			RectFill: function(x, y, w, h, fillStyle) {
				if (typeof fillStyle == 'undefined')
					fillStyle = '#fff';
				ctx.fillStyle = fillStyle;
				ctx.fillRect(x, y, w, h);
			},
			// draws a line
			// usage: Line(x1, y1, x2, y2, [strokeStyle], [lineWidth])
			Line: function(x1, y1, x2, y2, strokeStyle, lineWidth) {
				if (typeof strokeStyle == 'undefined')
					strokeStyle = '#fff';
				if (typeof lineWidth == 'undefined')
					lineWidth = 1;
				ctx.strokeStyle = strokeStyle;
				ctx.lineWidth = lineWidth;
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.stroke();
			},
			// draws an image
			// usage: Image(image, x, y, [width], [height])
			Image: function(image, x, y, w, h) {
				if (typeof w != 'undefined' && typeof h != 'undefined') {
					ctx.drawImage(image, x, y, w, h);
				}
				else {
					ctx.drawImage(image, x, y);
				}
			},
			// draws a tile
			// usage: Image(image, x, y, width, height, sx, sy)
			Tile: function(image, x, y, w, h, sx, sy) {
				ctx.drawImage(image, sx, sy, w, h, x, y, w, h);
			}
		};
	}();

	// input module
	var Input = function() {
		// reference to element capturing the input
		var element;

		// input agent constants
		var MOUSE = 0;
		var TOUCH = 1;

		// translates event coordinates to game coordinates
		var TranslateCoords = function(e, agent) {
			var ratio = Math.max(element.width / window.innerWidth, element.height / window.innerHeight);
			var bounds = element.getBoundingClientRect();

			var px = (agent === TOUCH) ? e.changedTouches[0].clientX : e.clientX;
			var py = (agent === TOUCH) ? e.changedTouches[0].clientY : e.clientY;

			return {
				x: Math.floor((px - bounds.left) * ratio),
				y: Math.floor((py - bounds.top) * ratio)
			};
		};
		
		// event dispatch callback lists
		var cbPress = [];
		var cbMove = [];
		var cbRelease = [];

		// event handlers
		var PressEvent = function(e, agent) {
			if (e.preventDefault) e.preventDefault();
			if (agent === MOUSE) {
				var button = e.which || e.button;
				if (button !== 1)
					return;
			}
			var coords = TranslateCoords(e, agent);
			for (var i = 0; i < cbPress.length; i++)
				cbPress[i](coords);
			return false;
		};

		var MoveEvent = function(e, agent) {
			if (e.preventDefault) e.preventDefault();
			var coords = TranslateCoords(e, agent);
			for (var i = 0; i < cbMove.length; i++)
				cbMove[i](coords);
			return false;
		};

		var ReleaseEvent = function(e, agent) {
			if (e.preventDefault) e.preventDefault();
			if (agent === MOUSE) {
				var button = e.which || e.button;
				if (button !== 1)
					return;
			}
			var coords = TranslateCoords(e, agent);
			for (var i = 0; i < cbRelease.length; i++)
				cbRelease[i](coords);
			return false;
		};

		return {
			// initializes the input module on given element
			Init: function(el) {
				element = el;
				// attach event listeners
				el.addEventListener('mousedown', function(e) { PressEvent(e, MOUSE); }, false);
				el.addEventListener('touchstart', function(e) { PressEvent(e, TOUCH); }, false);
				window.addEventListener('mousemove', function(e) { MoveEvent(e, MOUSE); }, false);
				window.addEventListener('touchmove', function(e) { MoveEvent(e, TOUCH); }, false);
				window.addEventListener('mouseup', function(e) { ReleaseEvent(e, MOUSE); }, false);
				window.addEventListener('touchend', function(e) { ReleaseEvent(e, TOUCH); }, false);
			},
			// register a callback function
			Register: function(eventType, callback) {
				if (eventType === 'press')
					cbPress.push(callback);
				else if (eventType === 'move')
					cbMove.push(callback);
				else if (eventType === 'release')
					cbRelease.push(callback);
			}
		};
	}();

	// game module
	var Game = function() {
		// reference to game canvas
		var canvas;

		// graphics
		var gfx_sprites, gfx_menu, gfx_ui, gfx_arrow;

		// graph definitions
		var graphCollection;

		// user config
		var userConfig;

		// local config
		var localConfig = {
			unlocked: 0
		};

		// save config to local storage
		var SaveConfig = function() {
			localStorage.setItem('tronix', JSON.stringify(localConfig));
		};

		// load config from local storage
		var LoadConfig = function() {
			var cfg = localStorage.getItem('tronix');
			if (cfg)
				localConfig = JSON.parse(cfg);
		};

		// returns if a point is within rectangle
		var PointInRect = function(x, y, rx, ry, rw, rh) {
			return (x >= rx && x <= rx + rw &&
					y >= ry && y <= ry + rh);
		};

		// menu
		var Menu = function() {
			// menu folding
			var folding = false;
			var folded = true;
			var enabled = false;

			var raised = 0;

			var Fold = function(fold, seq) {
				if (typeof seq == 'undefined') {
					seq = 0;
				}
				raised = (fold) ? 114 - seq : seq;
				if (seq < 114)
					setTimeout(function() { Fold(fold, seq + 3); }, 1);
				else {
					folded = fold;
					folding = false;
					enabled = !fold;
				}
			};

			// current menu state
			var currentIndex = 0;

			// drawing y-offset
			var YOff = function() {
				return 114 - raised;
			};

			// touch button class
			var TouchButton = function(bc) {

				var holding = false;
				var pressed = false;

				var MouseIn = function(coords) {
					return PointInRect(coords.x, coords.y, bc.x, bc.y, 72, 72);
				};

				// repeat timeout
				var repeatTimeout = null;

				// push event repeater
				function RepeatPush(seq) {
					if (typeof seq == 'undefined')
						seq = 0;
					bc.OnPush();
					repeatTimeout = setTimeout(function() {
						RepeatPush(Math.min(seq + 1, 20));
					}, (seq === 0) ? 400 : 120 - seq * 4);
				};

				// register button input events
				Input.Register('press', function(coords) {
					if (!enabled)
						return;
					if (MouseIn(coords)) {
						pressed = true;
						holding = true;
						if (bc.pushBehavior) {
							RepeatPush();
						}
					}
				});

				Input.Register('move', function(coords) {
					if (!enabled)
						return;
					if (holding) {
						pressed = MouseIn(coords);
						if (!pressed) {
							clearTimeout(repeatTimeout);
							repeatTimeout = null;
						}
						else if (!repeatTimeout && bc.pushBehavior) {
							RepeatPush();
						}
					}
				});

				Input.Register('release', function(coords) {
					if (!enabled)
						return;
					if (holding) {
						if (pressed) {
							if (!bc.pushBehavior)
								bc.OnPush();
							else {
								clearTimeout(repeatTimeout);
								repeatTimeout = null;
							}
						}
						holding = false;
						pressed = false;
					}
				});

				this.DoDrawing = function() {
					Draw.Tile(gfx_ui, bc.x, bc.y + YOff(), 72, 72, (pressed) ? 72 : 0, 5);
					Draw.Tile(gfx_ui, bc.x + 11, bc.y + 11 + YOff(), 50, 50, bc.icon[0], bc.icon[1]);
				};
			};

			// menu buttons
			var buttonStart = new TouchButton({
				x: 5, y: 374,
				icon: [150, 5],
				pushBehavior: false,
				OnPush: function() {
					if (currentIndex <= localConfig.unlocked) {
						LoadLevel(currentIndex);
						folding = true;
						Fold(true);
						enabled = false;
					}
				}
			});

			var buttonPrevious = new TouchButton({
				x: 166, y: 374,
				icon: [200, 5],
				pushBehavior: true,
				OnPush: function() {
					if (currentIndex > 0)
						currentIndex--;
				}
			});

			var buttonNext = new TouchButton({
				x: 243, y: 374,
				icon: [250, 5],
				pushBehavior: true,
				OnPush: function() {
					if (currentIndex < graphCollection.length - 1) {
						currentIndex++;
					}
				}
			});

			// register input events
			Input.Register('press', function(coords) {
				if (folded) {
					if (!folding && PointInRect(coords.x, coords.y, 0, 456, 320, 24)) {
						folding = true;
						Fold(false);
						currentIndex = Graph.GetIndex();
					}
				}
				else {
					if (!folding && PointInRect(coords.x, coords.y, 0, 0, 320, 366)) {
						folding = true;
						Fold(true);
						enabled = false;
					}
				}
			});

			// draws a preview of the graph
			var DrawPreview = function() {
				// preview window
				var pw = [96, 374, 54, 80];

				// translate graph coordinates to preview window coordinates
				var Translate = function(pos) {
					return [pw[0] + Math.floor(pos[0] * pw[2] / 320), pw[1] + Math.floor(pos[1] * pw[3] / 480)];
				};

				// retreive graph datapoints
				var graph = graphCollection[currentIndex];
				if (typeof graph == 'undefined')
					return;
				var V = graph.V;
				var E = graph.E;
				if (typeof E == 'undefined' || typeof V == 'undefined')
					return;

				// draw edges
				for (var i = 0; i < E.length; i++) {
					var e = E[i];
					var pos1 = V[e[0]];
					var pos2 = V[e[1]];
					var tpos1 = Translate(pos1);
					var tpos2 = Translate(pos2);
					Draw.Line(tpos1[0], tpos1[1] + YOff(), tpos2[0], tpos2[1] + YOff(), '#2ad', 1);
				}

				// draw vertices
				for (var i = 0; i < V.length; i++) {
					var pos = V[i];
					var tpos = Translate(pos);
					Draw.Tile(gfx_ui, tpos[0] - 3, tpos[1] - 3 + YOff(), 6, 6, 150, 55);
				}
			};

			return {
				IsFolded: function() {
					return folded;
				},
				DoDrawing: function() {
					Draw.Tile(gfx_menu, 0, 456 - raised, 320, 24 + raised, 0, 0);
					if (raised > 0) {
						var label = (currentIndex + 1) + ' / ' + graphCollection.length;
						var barwidth = 320 * (currentIndex + 1) / graphCollection.length;
						Draw.Tile(gfx_ui, 0, 451 + YOff(), barwidth, 5, 0, 0);
						Draw.Text(label, 160, 460 + YOff(), '#ccc', 'center');
						buttonStart.DoDrawing();
						buttonPrevious.DoDrawing();
						buttonNext.DoDrawing();
						if (currentIndex <= localConfig.unlocked)
							DrawPreview();
						else
							Draw.Tile(gfx_ui, 96, 374 + 124 - raised, 50, 50, 200, 55);
					}
				}
			};
		}();

		// tutorial
		var Tutorial = function() {
			// active tutorial
			var activeTutorial = null;

			// fade-in animation
			var alpha = 1;
			var yoff = 0;
			
			var FadeIn = function(seq) {
				if (typeof seq == 'undefined')
					seq = 0;
				yoff = 20 - seq;
				alpha = seq / 20;
				if (seq < 20)
					setTimeout(function() { FadeIn(seq + 1); }, 16);
			};

			return {
				ShowTutorial: function(name) {
					var tutorials = userConfig.tutorials;
					if (typeof tutorials == 'undefined')
						return;
					var t = tutorials[name];
					if (typeof t == 'undefined') {
						activeTutorial = null;
						return;
					}
					activeTutorial = t;
					yoff = 20;
					FadeIn();
				},
				DoDrawing: function() {
					if (activeTutorial != null) {
						for (var i = 0; i < activeTutorial.text.length; i++) {
							if (alpha < 1)
								Draw.SetAlpha(alpha);
							Draw.Text(activeTutorial.text[i], 1 + activeTutorial.x, 1 + activeTutorial.y + 18 * i + yoff, '#222');
							Draw.Text(activeTutorial.text[i], activeTutorial.x, activeTutorial.y + 18 * i + yoff, '#bb9');
							if (alpha < 1)
								Draw.SetAlpha();
						}
					}
				}
			};
		}();

		// next level arrow
		var Arrow = function() {
			// shown flag
			var shown = false;

			// active flag
			var active = false;

			// fade-in animation
			var alpha = 1;
			var yoff = 0;

			// animation sequence
			var animSeq = 0;
			
			setInterval(function() {
				animSeq++;
				if (animSeq > 10)
					animSeq = 0;
			}, 80);

			var FadeIn = function(seq) {
				if (typeof seq == 'undefined')
					seq = 0;
				yoff = 20 - seq;
				alpha = seq / 20;
				if (seq < 20)
					setTimeout(function() { FadeIn(seq + 1); }, 16);
				else
					active = true;
			};

			// input event
			Input.Register('press', function(coords) {
				if (!active || !Menu.IsFolded())
					return;
				if (PointInRect(coords.x, coords.y, 260, 390, 40, 40)) {
					LoadLevel(Graph.NextIndex());
				}
			});

			return {
				Show: function() {
					if (shown)
						return;
					shown = true;
					FadeIn();
				},
				Hide: function() {
					shown = false;
					active = false;
				},
				DoDrawing: function() {
					if (shown) {
						if (alpha < 1)
							Draw.SetAlpha(alpha);
						Draw.Tile(gfx_arrow, 260, 390 + yoff, 40, 40, animSeq * 40, 0);
						if (alpha < 1)
							Draw.SetAlpha();

					}
				}
			};
		}();
		
		// game graph
		var Graph = function() {
			// vertices
			var V = [];

			// edges
			var E = [];

			// graph index
			var gi = 0;

			return {
				// load a graph
				Load: function(index) {
					gi = index;
					// retreive graph from collection
					var graph = graphCollection[index];
					if (typeof graph == 'undefined')
						return;
					V = [];
					E = [];
					for (var i = 0; i < graph.V.length; i++)
						V.push(graph.V[i].slice());
					for (var i = 0; i < graph.E.length; i++)
						E.push(graph.E[i].slice());
				},
				// get vertices
				GetV: function() {
					return V;
				},
				// get edges
				GetE: function() {
					return E;
				},
				// get index
				GetIndex: function() {
					return gi;
				},
				// next index
				NextIndex: function() {
					return gi + 1;
				}
			};
		}();

		// input handling flags
		// captured point
		var captured = -1;
		
		// capture x, y offset
		var cxoff = 0;
		var cyoff = 0;

		// touch indicator alpha
		var indicatorAlpha = 0;

		var ShowIndicator = function(seq) {
			if (typeof seq == 'undefined')
				seq = 0;
			indicatorAlpha = seq / 20;
			if (seq < 20)
				setTimeout(function() { ShowIndicator(seq + 1); }, 10);
		};

		// intersections flag
		var intersections = false;

		// tutorial step
		var tutStep = -1;

		// check if two line segments intersect
		var LineIntersection = function(a, b, c, d) {
			var ccw = function(a, b, c) {
				return ((c[1] - a[1]) * (b[0] - a[0]) > (b[1] - a[1]) * (c[0] - a[0]));
			};
			return (ccw(a, c, d) != ccw(b, c, d) && ccw(a, b, c) != ccw(a, b, d));
		};

		// distance from line segment to point
		var LineToPointDistance = function(a, b, c) {
			var d = [b[0] - a[0], b[1] - a[1]];
			var l = Math.pow(d[0], 2) + Math.pow(d[1], 2);
			if (l == 0)
				return 0;
			var t = Math.min(1, Math.max(0, (d[0] * (c[0] - a[0]) + d[1] * (c[1] - a[1])) / l));
			var x = a[0] + t * d[0];
			var y = a[1] + t * d[1];
			return Math.sqrt(Math.pow(c[0] - x, 2) + Math.pow(c[1] - y, 2));
		};

		// move point a towards point b by a difference of d
		var MovePoint = function(a, b, d) {
			var dir = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
			a[0] += Math.floor(Math.cos(dir * Math.PI / 180) * d);
			a[1] += Math.floor(Math.sin(dir * Math.PI / 180) * d);
		};

		// shorten a line segment by length d from each side
		var ShortenLine = function(a, b, d) {
			MovePoint(a, b, d);
			MovePoint(b, a, d);
		};

		// check all intersections
		var CheckIntersections = function() {
			var V = Graph.GetV();
			var E = Graph.GetE();
			// line-to-line instersections
			for (var i = 0; i < E.length - 1; i++) {
				for (var j = i + 1; j < E.length; j++) {
					var edge1 = E[i];
					var edge2 = E[j];
					var i1 = edge1[0];
					var i2 = edge1[1];
					var i3 = edge2[0];
					var i4 = edge2[1];
					var p0 = [V[i1][0], V[i1][1]];
					var p1 = [V[i2][0], V[i2][1]];
					var p2 = [V[i3][0], V[i3][1]];
					var p3 = [V[i4][0], V[i4][1]];
					ShortenLine(p0, p1, 12);
					ShortenLine(p2, p3, 12);

					if (LineIntersection(p0, p1, p2, p3))
						return true;
				}
			}
			// line-to-circle collision
			for (var i = 0; i < V.length; i++) {
				var vertex = V[i];
				for (var j = 0; j < E.length; j++) {
					var edge = E[j];
					if (edge[0] == i || edge[1] == i)
						continue;
					var p0 = [V[edge[0]][0], V[edge[0]][1]];
					var p1 = [V[edge[1]][0], V[edge[1]][1]];
					var v = [vertex[0], vertex[1]];
					if (LineToPointDistance(p0, p1, v) < 12)
						return true;
				}
			}
			return false;
		};

		// register input events
		Input.Register('press', function(coords) {
			if (!Menu.IsFolded())
				return;
			if (captured > -1)
				return;
			// find the point user is capturing
			var V = Graph.GetV();
			for (var i = V.length - 1; i >= 0; i--) {
				var pos = V[i];
				if (PointInRect(coords.x, coords.y,
					pos[0] - 16, pos[1] - 16, 32, 32)) {
					cxoff = coords.x - pos[0];
					cyoff = coords.y - pos[1];
					captured = i;
					ShowIndicator();
					break;
				}
			}
		});
		Input.Register('move', function(coords) {
			// move the captured point
			if (captured > -1) {
				var V = Graph.GetV();
				var vertex = V[captured];
				var vx = coords.x - cxoff;
				var vy = coords.y - cyoff;
				if (vx >= 12 && vx <= 308)
					vertex[0] = vx;
				if (vy >= 12 && vy <= 438)
					vertex[1] = vy;
			}
		});
		Input.Register('release', function(coords) {
			if (captured > -1) {
				captured = -1;
				indicatorAlpha = 0;
				intersections = CheckIntersections();
				if ([0, 2].indexOf(tutStep) > -1 && !intersections) {
					tutStep = 1;
					Tutorial.ShowTutorial('won');
				}
				else if (tutStep == 1 && intersections) {
					tutStep = 2;
					Tutorial.ShowTutorial('won2');
				}
				else if (tutStep == 3 && !intersections) {
					tutStep = 4;
					Tutorial.ShowTutorial('goodluck');
				}
				if (!intersections && Graph.GetIndex() < graphCollection.length - 1) {
					if (tutStep == 1 || tutStep == 4) {
						setTimeout(function() {
							Arrow.Show();
						}, 200);
					}
					else
						Arrow.Show();
				}
			}
		});

		var LoadLevel = function(graphIndex) {
			if (graphIndex >= 0 && graphIndex < graphCollection.length) {
				Graph.Load(graphIndex);
				intersections = CheckIntersections();
				if (graphIndex == 0) {
					Tutorial.ShowTutorial('first');
					tutStep = 0;
				}
				else {
					if ([1, 2].indexOf(tutStep) > -1) {
						tutStep = 3;
						Tutorial.ShowTutorial('second');
					}
					else {
						tutStep = -1;
						Tutorial.ShowTutorial();
					}
				}
				captured = -1;
				Arrow.Hide();
				if (localConfig.unlocked < graphIndex) {
					localConfig.unlocked = graphIndex;
					SaveConfig();
				}
			}
		};

		return {
			Init: function(canvas) {
				//canvas = canvas;
				// get graphical assets
				gfx_sprites = Assets.Get('gfx_sprites');
				gfx_menu = Assets.Get('gfx_menu');
				gfx_ui = Assets.Get('gfx_ui');
				gfx_arrow = Assets.Get('gfx_arrow');
				// get graphs
				graphCollection = Assets.Get('graphs');
				// get user config
				userConfig = Assets.Get('user');
				// get local config
				LoadConfig();
				// load the starting graph
				var graphIndex = 0;
				if (typeof userConfig.forcelevel == 'number')
					graphIndex = userConfig.forcelevel;
				else if (typeof localConfig.unlocked != 'undefined' &&
					localConfig.unlocked >= 1 && localConfig.unlocked < graphCollection.length)
					graphIndex = localConfig.unlocked;
				LoadLevel(graphIndex);
			},
			DoDrawing: function() {
				// graph data
				var V = Graph.GetV();
				var E = Graph.GetE();
				// draw tutorials
				Tutorial.DoDrawing();
				// draw graph edges
				Draw.SetAlpha(0.7);
				for (var i = 0; i < E.length; i++) {
					var edge = E[i];
					var eColor;
					if (edge[0] === captured || edge[1] === captured)
						eColor = userConfig.color_highlight || '#cc2';
					else if (intersections)
						eColor = userConfig.color_unsolved || '#2ad';
					else
						eColor = userConfig.color_solved || '#7fdb1d';
					var posA = V[edge[0]];
					var posB = V[edge[1]];
					Draw.Line(posA[0], posA[1], posB[0], posB[1], eColor, (userConfig.thickness || 6));
				}
				Draw.SetAlpha();
				// draw graph vertices
				var spriteX = (intersections) ? 24 : 0;
				for (var i = 0; i < V.length; i++) {
					var pos = V[i];
					Draw.Tile(gfx_sprites, pos[0] - 12, pos[1] - 12, 24, 24, spriteX, 0);
					if (userConfig.touch_indicator !== 'no' && captured === i) {
						if (indicatorAlpha < 1)
							Draw.SetAlpha(indicatorAlpha);
						Draw.Tile(gfx_sprites, pos[0] - 21, pos[1] - 21, 42, 42, 0, 24);
						if (indicatorAlpha < 1)
							Draw.SetAlpha();
					}
					if (userConfig.debug === "yes")
						Draw.Text(i, pos[0] + 12, pos[1] - 20);
				}
				// draw the next-level arrow
				Arrow.DoDrawing();
				// draw the menu
				Menu.DoDrawing();
			},
			UnlockAll: function() {
				localConfig.unlocked = graphCollection.length - 1;
				SaveConfig();
			},
			ForgetAll: function() {
				localConfig.unlocked = 0;
				SaveConfig();
				LoadLevel(localConfig.unlocked);
			}
		};
	}();

	// core module
	var Core = function() {
		// reference to canvas and render context
		var canvas, ctx;

		// current window height
		var wHeight;

		// fallbacks for requestAnimFrame
		var RequestAnimFrame = (
			window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			}
		);

		// main game loop
		var Run = function() {
			var cw = canvas.width;
			var ch = canvas.height;
			// track window height for changes
			var dh = window.innerHeight;
			if (dh !== wHeight) {
				// update viewport
				wHeight = dh;
				var ratio = cw / ch;
				var width = dh * ratio;
				canvas.style.width = width + 'px';
				canvas.style.height = dh + 'px';
			}
			// clear canvas area
			Draw.RectFill(0, 0, cw, ch, '#191916');
			// draw to context
			Game.DoDrawing();
			// loopback
			RequestAnimFrame(Run);
		};

		return {
			Start: function() {
				// retreive canvas
				canvas = document.getElementById('tronix');
				// retreive loadscreen elements
				var loadscreen = document.getElementById('tronix-loadscreen');
				var progressbar = document.getElementById('tronix-progressbar');
				var progresslbl = document.getElementById('tronix-progresslabel');
				// retreive canvas context and initialize the drawing module
				Draw.SetContext(ctx = canvas.getContext('2d'));
				// initialize the input module
				Input.Init(canvas);
				// load game assets
				Assets.Load(function() {
					// finished loading
					// remove the loadscreen and bring up game canvas
					loadscreen.style.display = 'none';
					canvas.style.display = 'block';
					// initialize game
					Game.Init(canvas);
					// run the main loop
					Run();
				}, function(items, nitems) {
					// track progress
					var progress = Math.floor(items * 100 / nitems) + '%';
					progresslbl.innerHTML = progressbar.style.width = progress;
				});
			}
		};
	}();

	// start the game as the window loads
	window.addEventListener('load', Core.Start, false);

	return {
		UnlockAll: function() {
			Game.UnlockAll();
		},
		ForgetAll: function() {
			Game.ForgetAll();
		}
	};
}();
