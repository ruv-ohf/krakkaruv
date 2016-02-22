<?php hide($content['field_custom_banner_image']); ?>

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

<div class="absolute-image"><img src="<?php print$image_url; ?>"></div>

<pre>
<?php print_r($atom['scald_thumbnail']['und'][0]['metadata']['height']); ?>