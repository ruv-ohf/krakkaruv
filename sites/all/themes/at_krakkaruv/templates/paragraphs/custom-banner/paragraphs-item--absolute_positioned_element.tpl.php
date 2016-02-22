<?php hide($content['field_custom_banner_image']); ?>
<?php hide($content['field_custom_banner_top_position']); ?>
<?php hide($content['field_cm_banner_right_position']); ?>
<?php hide($content['field_cm_banner_bottom_position']); ?>
<?php hide($content['field_cm_banner_left_position']); ?>

<?php

$image_url 	= '';

//Til að fá atom id
$atom_id 	= $content['field_custom_banner_image']['#items'][0]['sid'];

//til að ná í atom
$atom 		= scald_atom_load($atom_id);

if(!empty($atom)) {
        //Til að ná í myndaurlið í réttum stíl
	$image_url = image_style_url('hero_image_subpage', $atom->file_source);
}

?>

<h1>Position</h1>

<style>
	.paragraphs-items-field-absolute-positioned-elemen {
		top: <?php print render($content['field_custom_banner_top_position']); ?>;
		right: <?php print render($content['field_cm_banner_right_position']); ?>;
		bottom: <?php print render($content['field_cm_banner_bottom_position']); ?>;
		left: <?php print render($content['field_cm_banner_left_position']); ?>;
	}
</style>