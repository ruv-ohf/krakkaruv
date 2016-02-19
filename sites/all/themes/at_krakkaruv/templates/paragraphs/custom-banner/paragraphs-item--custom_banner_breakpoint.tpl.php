<?php
$image_url = '';

//Til að fá atom id
$atom_id = $content['field_custom_banner_image']['#items'][0]['sid'];

//til að ná í atom
$atom = scald_atom_load($atom_id);

if(!empty($atom)) {
        //Til að ná í myndaurlið í réttum stíl
	$image_url = image_style_url('thumbnails', $atom->file_source);
	//print render($content->image_url);
?>

<?php
	hide($content['field_min_width_size']);
	hide($content['field_custom_banner_image']);
	print render($content);
?>

<style>
	@media only screen and (min-width: <?php print render($content['field_min_width_size']); ?>px) {
		.paragraphs-items {
			background: #071815 url() no-repeat center center;
			height: 250px;
		}
	}
</style>
