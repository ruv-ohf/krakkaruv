<?php
	$image_url = $content['field_custom_banner_image'];
    $speaker_image_url = "'$image_url'";
	hide($content['field_min_width_size']);
	hide($content['field_custom_banner_image']);
	print render($content);
?>

<style>
	@media only screen and (min-width: <?php print render($content['field_min_width_size']); ?>px) {
		.paragraphs-items {
			background: #071815 url(<?php print $speaker_image_url; ?>) no-repeat center center;
			height: 250px;
		}
	}
</style>
