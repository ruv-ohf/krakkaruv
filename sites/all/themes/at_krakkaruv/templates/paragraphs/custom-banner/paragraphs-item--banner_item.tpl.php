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

<?php
	//hide($content['field_custom_banner_height']);
	//hide($content['field_custom_banner_image']);
	//hide($content['field_background_repeat']);
?>

  <div class="content"<?php print $content_attributes; ?>>
    <?php print render($content); ?>
  </div>

<style>
	
	.paragraphs-items {
		height: <?php print render($content['field_custom_banner_height']); ?>px;
		background: url(<?php print $image_url; ?>) no-repeat center center;
	}

</style>
