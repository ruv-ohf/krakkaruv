<?php
$image_url 	= '';
$image_url2 = '';

//Til að fá atom id
$atom_id 	= $content['field_custom_banner_image']['#items'][0]['sid'];
$atom_id2 	= $content['field_background_repeat']['#items'][0]['sid'];
$hlekkur 	= $content['field_custom_banner_hlekkur'];

//til að ná í atom
$atom = scald_atom_load($atom_id);
$atom2 = scald_atom_load($atom_id2);

if(!empty($atom)) {
        //Til að ná í myndaurlið í réttum stíl
	$image_url = image_style_url('hero_image_subpage', $atom->file_source);
}
if(!empty($atom2)) {
        //Til að ná í myndaurlið í réttum stíl
	$image_url2 = image_style_url('hero_image_subpage', $atom2->file_source);
}

?>

<?php if ($hlekkur): ?>
	<h1>Hlekkur</h1>
<?php endif; ?>

<?php
	hide($content['field_custom_banner_height']);
	hide($content['field_custom_banner_image']);
	hide($content['field_background_repeat']);
	hide($content['field_breakpoint']);
	hide($content['field_custom_css']);
	hide($content['field_custom_banner_hlekkur']);
?>

<style>
	
	.paragraphs-items {
		height: <?php print render($content['field_custom_banner_height']); ?>px;
		background: url(<?php print $image_url; ?>) no-repeat center center;
	}
	.paragraphs-items-wrapper-inner {
		background: url(<?php print $image_url2; ?>) repeat-x left top;
	}

	<?php print render($content['field_custom_css']); ?>

</style>


<div class="paragraphs-items-wrapper-inner"><?php print render($content['field_breakpoint']); ?></div>

