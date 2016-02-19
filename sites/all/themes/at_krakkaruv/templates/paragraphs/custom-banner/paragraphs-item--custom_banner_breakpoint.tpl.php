<?php
	hide($content['field_min_width_size']);
	hide($content['field_custom_banner_image']);
	print render($content);
?>

<pre>
<?php print_r($node->field_custom_banner_image); ?>

<style>
	@media only screen and (min-width: <?php print render($content['field_min_width_size']); ?>px) {
		.paragraphs-items {
			background: #071815 url(/sites/default/files/thumbnails/image/<?php print render($content['field_custom_banner_image']); ?>) no-repeat center center;
			height: 250px;
		}
	}
</style>
