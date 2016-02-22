<?php hide($content['field_custom_banner_image']); ?>
<?php hide($content['field_min_width_size']); ?>

<?php
$image_url = '';

//Til að fá atom id
$atom_id = $content['field_custom_banner_image']['#items'][0]['sid'];

//til að ná í atom
$atom = scald_atom_load($atom_id);

if(!empty($atom)) {
        //Til að ná í myndaurlið í réttum stíl
	$image_url = image_style_url('hero_image_subpage', $atom->file_source);
}

?>

<style>
	@media only screen and (min-width: <?php print render($content['field_min_width_size']); ?>px) {
		.paragraphs-items-field-breakpoint {
			background: url(<?php print $image_url; ?>) no-repeat center center;
		}
	}
</style>
