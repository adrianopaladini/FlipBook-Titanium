///////////////////////////////
//
//  FlipBook 0.7 By Adriano
//       23/12/2010
//
///////////////////////////////


// TODO:
//
//		-Animation to direct 'GotoPage'
//		-Landscape Mode with 2 pages
//		-Transform to a 3D flip
//

// Maybe TODO:
//
//		-Convert this to a Titanium module (Objective-C)
//


// Variables
var flipbook_actualPage;
var flipbook_pages=[];
var flipbook_fingers;
var flipbook_pgRear;
var flipbook_pgBright;
var flipbook_pgShadow;
var flipbook_pgShadow2;
var flipbook_imgBottom;
var flipbook_pgBottom;
var flipbook_imgRear;
var flipbook_pgTop;
var flipbook_btn_prev;
var flipbook_btn_next;
var flipbook_pgn;
var flipbook_dots=[];
var flipbook_options=[];
var flipbook_container;
var flipbook_containerProxy;
var flipbook_overlay;
var flipbook_startDrag;

	
// Main Class
var flipbook = {
	showPagination: function(b){
		flipbook_pgn.visible=b;
	},
	showButtons: function(b){
		flipbook_btn_prev.visible=b;
		flipbook_btn_next.visible=b;
	},
	setPagination: function(pg){
		
		// Set current page in Dots
		for(var i=0;i<flipbook_dots.length;i++){
			if(i==(pg-1)){
				flipbook_dots[i].opacity=1;
			}else{
				flipbook_dots[i].opacity=0.3;	
			}
		}
		
	},
	createPagination: function(pgs){
		
		// Create Dots for pagination
		flipbook_pgn.width=(pgs*15)-8;
		for(var i=0;i<pgs;i++){
			pos = (i*15);
			flipbook_dots[i]=Ti.UI.createImageView({
				image:'flipbook/pgn.png',
				height:6,
				width:6,
				left:pos,
				opacity:0.3
			});
			flipbook_pgn.add(flipbook_dots[i]);
		}
		
	},
	create: function(flipbook_opt){


		// Default Parameters
		var default_args = {
			'top'				:	null,
			'left'				:	null,
			'right'				:	null,
			'bottom'			:	null,
			'height'			:	null,
			'width'				:	null,
			'pages'				:	null,
			'attachTo'			: 	null,
			'showPagination'	: 	true,
			'showButtons'		: 	true 
		};
		
		
		// Set Parameters
		for(var index in default_args) {
			if(typeof flipbook_opt[index] == "undefined") {
				flipbook_opt[index] = default_args[index];
			}
		}
		flipbook_options = flipbook_opt;
		

		// Load Pages
		for(i=0;i<flipbook_options.pages.length;i++){
			flipbook_pages.push(flipbook_options.pages[i]);
		}


		// Create Main Container
		flipbook_container = Ti.UI.createScrollableView({
			width:flipbook_options.width,
			height:flipbook_options.height,
			top:flipbook_options.top,
			bottom:flipbook_options.bottom,
			left:flipbook_options.left,
			right:flipbook_options.right,
			touchEnabled:true,
			visible:false
		});
		
		// Add FlipBook to Window
		flipbook_options.attachTo.add(flipbook_container);
		
		
		flipbook_containerProxy = Ti.UI.createView({
			top:0,
			left:0,
			right:0,
			bottom:0
		});
		flipbook_container.addView(flipbook_containerProxy);
		

		// Create Spot to slide fingers
		flipbook_fingers = Ti.UI.createView({
			top:0,
			left:0,
			right:0,
			bottom:0,
			zIndex:6
		});
		flipbook_containerProxy.add(flipbook_fingers);
		
		
		// Create Buttons
		flipbook_btn_prev = Ti.UI.createImageView({
			image:'flipbook/btn_prev.png',
			height:64,
			width:64,
			bottom:10,
			left:12,
			zIndex:7,
			visible:flipbook_options.showButtons
		});
		flipbook_btn_next = Ti.UI.createImageView({
			image:'flipbook/btn_next.png',
			height:64,
			width:64,
			bottom:10,
			right:12,
			zIndex:7,
			visible:flipbook_options.showButtons
		});
		flipbook_containerProxy.add(flipbook_btn_prev);
		flipbook_containerProxy.add(flipbook_btn_next);
		
		
		// Create Pagination Dots area
		flipbook_pgn = Ti.UI.createView({
			zIndex:7,
			height:6,
			bottom:10,
			visible:flipbook_options.showPagination
		});
		flipbook_containerProxy.add(flipbook_pgn);
		
		
		// Create Pages
		flipbook_overlay = Ti.UI.createImageView({
			top:0,
			left:0,
			width:flipbook_container.width,
			height:flipbook_container.height,
			zIndex:5
		});
		flipbook_pgBottom = Ti.UI.createScrollableView({
			zIndex:4,
			top:0,
			left:0,
			width:flipbook_container.width,
			height:flipbook_container.height,
			touchEnabled:false
		});
		flipbook_imgBottom = Ti.UI.createImageView({
			top:0,
			left:0,
			width:flipbook_container.width,
			height:flipbook_container.height
		});
		flipbook_pgBottom.addView(flipbook_imgBottom);
		flipbook_pgRear = Ti.UI.createView({
			zIndex:2,
			top:0,
			left:0,
			width:flipbook_container.width,
			height:flipbook_container.height,
			backgroundColor:'#fff'
		});
		flipbook_imgRear = Ti.UI.createImageView({
			top:0,
			left:0,
			width:flipbook_container.width,
			height:flipbook_container.height,
			opacity:0.4
		});
		flipbook_pgRear.add(flipbook_imgRear);
		flipbook_pgShadow2 = Ti.UI.createImageView({
			zIndex:1,
			image:'flipbook/sombra.png',
			width:100,
			height:1200,
			left:0
		});
		flipbook_pgBottom.add(flipbook_pgShadow2);
		flipbook_pgShadow = Ti.UI.createImageView({
			zIndex:1,
			image:'flipbook/sombra.png',
			width:100,
			height:1200
		});
		flipbook_pgBright = Ti.UI.createImageView({
			zIndex:3,
			image:'flipbook/brilho.png',
			width:100,
			height:1200
		});
		flipbook_pgTop = Ti.UI.createImageView({
			zIndex:0,
			top:0,
			left:0,
			width:flipbook_container.width,
			height:flipbook_container.height
		});
		
	
		// Prepare back flip of page
		flipbook_pgRear.transform = Ti.UI.create3DMatrix().rotate(180, 0,1,0);
		flipbook_pgShadow2.transform = Ti.UI.create3DMatrix().rotate(180, 0,1,0);
		

		
		// Add pages to container
		flipbook_containerProxy.add(flipbook_pgBottom);
		flipbook_containerProxy.add(flipbook_pgRear);
		flipbook_containerProxy.add(flipbook_pgShadow);
		flipbook_containerProxy.add(flipbook_pgBright);
		flipbook_containerProxy.add(flipbook_pgTop);



		
		// I don't know, but sometimes this line crash...
		// Trying to fix.
		flipbook_containerProxy.add(flipbook_overlay);
		





		/*

		Test for next version, do not use (YET)!!!!!

		flipbook_pgRear.transform = Ti.UI.create3DMatrix().rotate(10, 0,0,1);
		flipbook_pgShadow.transform = Ti.UI.create3DMatrix().rotate(10, 0,0,1);
		flipbook_pgBright.transform = Ti.UI.create3DMatrix().rotate(10, 0,0,1);
		
		*/

		


		

		// Get Finger's Events
		flipbook_fingers.addEventListener('touchstart', function(e) {
			if(e.x<(flipbook_container.width/2)){
				
				
				
				if(flipbook_actualPage>1){
					flipbook_overlay.image = flipbook_pages[flipbook_actualPage-1];
					flipbook_overlay.visible = true;

					flipbook.move(0);


					flipbook_imgBottom.image=flipbook_pages[flipbook_actualPage-1];
					flipbook_imgRear.image=flipbook_pages[flipbook_actualPage-2];
					flipbook_pgTop.image=flipbook_pages[flipbook_actualPage-2];

					flipbook_overlay.visible = false;

					flipbook.animate(e.x,200);
					flipbook_startDrag=1;
				}
			}else{
				
				if(flipbook_actualPage<flipbook_pages.length){
					flipbook_overlay.image = flipbook_pages[flipbook_actualPage-1];
					flipbook_overlay.visible = true;

					flipbook.move(flipbook_container.width);
					

					flipbook_imgBottom.image=flipbook_pages[flipbook_actualPage];
					flipbook_imgRear.image=flipbook_pages[flipbook_actualPage-1];
					flipbook_pgTop.image=flipbook_pages[flipbook_actualPage-1];

					
					flipbook_overlay.visible = false;

					flipbook.animate(e.x,200);
					flipbook_startDrag=2;
				}
			}
		});
		flipbook_fingers.addEventListener('touchmove', function(e) {
			if(flipbook_startDrag>0){
				flipbook.move(e.x);
			}
		});
		flipbook_fingers.addEventListener('touchend', function(e) {
			if(flipbook_startDrag>0){
				if(e.x<(flipbook_container.width/2)){
					flipbook.animate(0);
					if(flipbook_startDrag==2){
						flipbook_actualPage++;
					}
				}else{
					flipbook.animate(flipbook_container.width);
					if(flipbook_startDrag==1){
						flipbook_actualPage--;
					}
				}
				flipbook.setPagination(flipbook_actualPage);
				flipbook_startDrag=0;
			}
		});
		



		
		// Create Pagination
		flipbook.createPagination(flipbook_pages.length);
		
	
		// Goto Page 1 without animation
		flipbook.gotoPage(1,0);
		

		// Get Button's Click
		flipbook_btn_prev.addEventListener('click', function(e) {
			// Check if isn't the first page
			if(flipbook_actualPage>1){
				// goto previous page
				flipbook.gotoPage('prev',800);
			}
		});
		flipbook_btn_next.addEventListener('click', function(e) {
			// Check if isn't the last page
			if(flipbook_actualPage<flipbook_pages.length){
				// goto next page
				flipbook.gotoPage('next',800);
			}
		});

		
		// Show Flipbook
		flipbook_container.visible=true;

	},
	
	
	gotoPage: function(go,anim){

		flipbook_overlay.image = flipbook_pages[flipbook_actualPage-1];
		flipbook_overlay.visible = true;

		if(go=='next'){
			flipbook.move(flipbook_container.width);
		}else if(go=='prev'){
			flipbook.move(0);
			flipbook_actualPage--;
		}else{
			flipbook.move(flipbook_container.width);
			flipbook_actualPage=go;
		}
		
		flipbook_imgBottom.image=flipbook_pages[flipbook_actualPage];
		flipbook_imgRear.image=flipbook_pages[flipbook_actualPage-1];
		flipbook_pgTop.image=flipbook_pages[flipbook_actualPage-1];

		flipbook_overlay.visible = false;
		
		if(go=='next'){
			flipbook.animate(0,anim);
			flipbook_actualPage++;
		}else if(go=='prev'){
			flipbook.animate(flipbook_container.width,anim);
		}else{
			// TODO: Animate page find
		}
		flipbook.setPagination(flipbook_actualPage);
	},
	
	
	
	
	

	move: function(x){
		flipbook_pgRear.left=(x*2)-flipbook_container.width;
		flipbook_pgShadow.left=((x*2)-flipbook_container.width)-90;
		flipbook_pgBright.left=x-100;

		op = -(x-flipbook_container.width)/(flipbook_container.width/8);
		if(op>1){op=1;}
		flipbook_pgShadow.opacity=op;
		flipbook_pgBright.opacity=op;


		op2 = x/(flipbook_container.width/8);
		if(op2>1){op2=1;}
		if(op2<0){op2=0;}
		flipbook_pgShadow2.opacity=op2;


		xo = parseInt(x,10);
		flipbook_imgBottom.left=-xo;
		flipbook_pgBottom.left=xo;
		
	},
	animate: function(x,v){
		if(v==null){v=300;}
		flipbook_pgRear.animate({left:(x*2)-flipbook_container.width,duration:v});
		flipbook_pgShadow.animate({left:((x*2)-flipbook_container.width)-90,duration:v});
		flipbook_pgBright.animate({left:x-100,duration:v});

		op = -(x-flipbook_container.width)/(flipbook_container.width/8);
		if(op>1){op=1;}
		flipbook_pgShadow.animate({opacity:op,duration:v});
		flipbook_pgBright.animate({opacity:op,duration:v});


		op2 = x/(flipbook_container.width/8);
		if(op2>1){op2=1;}
		if(op2<0){op2=0;}
		flipbook_pgShadow2.animate({opacity:op2,duration:v});


		xo = parseInt(x,10);
		flipbook_imgBottom.animate({left:-xo,duration:v});
		flipbook_pgBottom.animate({left:xo,duration:v});
		
	}
};

//
// End Of File
//
