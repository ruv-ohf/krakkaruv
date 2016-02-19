<?php
	hide($content['field_min_width_size']);
	hide($content['field_custom_banner_image']);
	print render($content);
?>

<style>
	@media only screen and (min-width: <?php print render($content['field_min_width_size']); ?>px) {
		.paragraphs-items {
			background: #071815 url(<?php print (file_create_url(file_build_uri(image_style_url(render($content['field_custom_banner_image']))))); ?>) no-repeat center center;
			height: 250px;
		}
	}
</style>
