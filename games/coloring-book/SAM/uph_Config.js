//--------------------------------------
//----------Configure - Bucket----------
//--------------------------------------
function bucket_mode()
{
	var_mode=0;//0 to remove feature. 2 default mode
	return var_mode;
}
function bucket_size()
{
	var_size=7;//7 default value.
	return var_size;
}
//-----------------------------------------
//----------Configure - Parameter----------
//-----------------------------------------
function parameter_mode()
{
	var_mode=0;//0 to remove feature.
	return var_mode;
}
function parameter_back_button()
{
	return "";//your URL or blank for none.
}
//--------------------------------------
//----------Configure - Screen----------
//--------------------------------------
function screen_mode()
{
	var_mode=3;
	return var_mode;
}
function screen_x()
{
	var_x=0;//to do
	return var_x;
}
function screen_y()
{
	var_y=0;//to do
	return var_y;
}

function screen_w()
{
	var_width=1024;//to do
	return var_width;
}

function screen_h()
{
	var_height=800;
	return var_height;
}

//-------------------------------------
//----------Configure - Other----------
//-------------------------------------
function getBackgroundMode()
{
	return 1;//0:Old  1:New
}
function getWebLink()
{
	return "";//Your URL
}

function showWebLink()
{
	return 0;//1:true 0:false
}

function printPage()
{
	window.print();
	return 1;
}

function showPrintButton()
{
	return 1;//1:true 0:false
}