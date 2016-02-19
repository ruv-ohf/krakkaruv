<?php
// field_my_image is the name of the image field
  
  // using field_get_items() you can get the field values (respecting multilingual setup)
  $field_my_image = field_get_items('node', $content, 'field_custom_banner_image');
  
  // after you have the values, you can get the image URL (you can use foreach here)
  $my_image_url = file_create_url($field_my_image[0]['uri']);
  
  print $my_image_url;
?>

<?php
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
