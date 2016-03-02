<? $banner_id  = $content['field_cm_banner_id_name']; ?>
<?php 
	hide($content['field_custom_banner_image']);
	hide($content['field_min_width_size']);
	hide($content['field_custom_css']);
	hide($content['field_cm_banner_image_position']);
	hide($content['field_cm_banner_id_name']);
?>

<?php
$image_url = '';

//Til að fá atom id
$atom_id = $content['field_custom_banner_image']['#items'][0]['sid'];

//til að ná í atom
$atom = scald_atom_load($atom_id);

if(!empty($atom)) {
        //Til að ná í myndaurlið í réttum stíl
	$image_url = image_style_url('custom_banner', $atom->file_source);
}

?>


<style>
	@media only screen and (min-width: <?php print render($content['field_min_width_size']); ?>px) {
		.<?php print $banner_id; ?> .paragraphs-items-field-breakpoint {
			background: url(<?php print $image_url; ?>) no-repeat;
			background-position: <?php print render($content['field_cm_banner_image_position']); ?>;
		}
	}
</style>
