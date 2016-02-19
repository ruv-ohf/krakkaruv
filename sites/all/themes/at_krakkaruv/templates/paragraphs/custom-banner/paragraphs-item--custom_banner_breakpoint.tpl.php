<?php
	$field_banner_image = field_get_items('node', $node, 'field_custom_banner_image');
	$image_url = file_create_url($field_banner_image[0]['uri']);
	hide($content['field_min_width_size']);
	hide($content['field_custom_banner_image']);
	print render($content);
?>

<style>
	@media only screen and (min-width: <?php print render($content['field_min_width_size']); ?>px) {
		.paragraphs-items {
			background: #071815 url(<?php print $image_url; ?><?php print render($content['field_custom_banner_image']); ?>) no-repeat center center;
			height: 250px;
		}
	}
</style>
