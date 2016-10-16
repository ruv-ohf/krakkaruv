<div id="page-wrapper">

    <div class="main-menu">
        <?php print render($page['menu']); ?>
    </div>
    <div id="header">
        <?php print render($page['header']); ?>
    </div> 
    <div id="main-wrapper">
       <?php print render($page['content']); ?>
    </div>
    <div id="footer">
        <?php print render($page['footer']); ?>
    </div>

    <div id="square"></div>
    <style>
        #square {
            background-color: red;
            width: 100px;
            height: 100px;
        }
    </style>

</div>
