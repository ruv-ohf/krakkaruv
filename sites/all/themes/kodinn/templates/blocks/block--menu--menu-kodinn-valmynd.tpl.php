<div id="<?php print $block_html_id; ?>" class="<?php print $classes; ?>"<?php print $attributes; ?>>

    <?php print render($title_prefix); ?>
    <?php if ($block->subject): ?>
        <h2<?php print $title_attributes; ?>><?php print $block->subject ?></h2>
    <?php endif;?>
    <?php print render($title_suffix); ?>

    <div class="logo-1">Kóðinn Logo</div>
    <div class="content"<?php print $content_attributes; ?>>
        <?php print $content ?>
        <div class="logo-2">Krakkarúv logo</div>
    </div>
    <span>Burger</span>

</div>