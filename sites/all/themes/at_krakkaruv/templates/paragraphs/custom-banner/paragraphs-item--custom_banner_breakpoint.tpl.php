<?php

  //$my_image_url = file_create_url($field_my_image[0]['uri']);
  

?>

<?php
	hide($content['field_min_width_size']);
	hide($content['field_custom_banner_image']);
	print render($content);
?>

<style>
	@media only screen and (min-width: <?php print render($content['field_min_width_size']); ?>px) {
		.paragraphs-items {
			background: #071815 url(<?php print render($content(image_style_url('original',['field_custom_banner_image']))); ?>) no-repeat center center;
			height: 250px;
		}
	}
</style>

