<?php

$locationId = isset($_GET['id']) 
                ? $_GET['id'] 
                : null;

$coordinates = isset($_GET['coordinates'])
                ? explode(',', $_GET['coordinates'])
                : null;

switch ($locationId) {
    case 'times-square':
        $deals = array(
            array('url' => '#', 'title' => 'Party at Times Square', 'content' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.'),
            array('url' => '#', 'title' => 'Times Square Massage', 'content' => 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
        );
        break;
    
    case 'piccadilly':
        $deals = array(
            array('url' => '#', 'title' => 'Party at Piccadilly Circus', 'content' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.'),
            array('url' => '#', 'title' => 'Piccadilly Circus Massage', 'content' => 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
        );
        break;
    
    default:
        $deals = array(
            array('url' => '#', 'title' => 'White Party at ' . $coordinates[0] . ', ' . $coordinates[1], 'content' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.'),
            array('url' => '#', 'title' => 'Great Massage!', 'content' => 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
            array('url' => '#', 'title' => 'Cheap Tickets', 'content' => 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.')
        );
}

//------------------------------------------------------------------------------

?>
<!DOCTYPE html>
<html lang="en" data-ng-app="WhereAmI">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Deals</title>
        <link href="//maxcdn.bootstrapcdn.com/bootswatch/3.1.1/amelia/bootstrap.min.css" rel="stylesheet" title="bootstrap-theme">
        <!--[if lt IE 9]>
        <script src="//oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
        <script src="//oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>
    <body>
        <div class="container-fluid">
            <h1>Optional Deals Sidebar</h1>
            <p>Show location-specific deals next to the map!</p>
            <hr />
            <?php foreach ($deals as $deal) : ?>
                <div class="row" style="margin-top:20px;">
                    <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                        <img src="demo.jpg" style="width:100%" />
                    </div>
                    <div class="col-xs-6 col-sm-8 col-md-9 col-lg-10">
                        <h2>
                            <a href="<?php echo $deal['url'] ?>">
                                <?php echo $deal['title'] ?>
                            </a>
                        </h2>
                        <p>
                            <?php echo $deal['content'] ?>
                        </p>
                    </div>
                </div>
                <hr />
            <?php endforeach ?>
        </div>
    </body>
</html>
