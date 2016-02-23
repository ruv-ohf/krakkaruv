<?php $breakpoint 			= $content['field_cm_ban_element_breakpoint']; ?>
<?php $breakpoint_media 	= "and (min-width: "; ?>
<?php $breakpoint_media2 	= "px)"; ?>

<?php hide($content['field_custom_banner_image']); ?>
<?php hide($content['field_cm_banner_element_position']); ?>
<?php hide($content['field_cm_ban_element_breakpoint']); ?>

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

<?php if ($breakpoint): ?>

	<div class="absolute-image-<?php print $atom_id; ?>">
		<style>
			@media only screen <?php print $breakpoint_media; ?><?php print render($breakpoint); ?><?php print $breakpoint_media2; ?> {
				.absolute-image-<?php print $atom_id; ?> {
					background: url(<?php print $image_url; ?>) no-repeat center center;
					width: <?php print($atom->scald_thumbnail['und'][0]['metadata']['width']); ?>px;
					height: <?php print($atom->scald_thumbnail['und'][0]['metadata']['height']); ?>px;
					position: absolute; 
					<?php print render($content['field_cm_banner_element_position']); ?>
				}
			}
		</style>
	</div>

<?php else: ?>

	<div class="absolute-image" style="background: url(<?php print $image_url; ?>) no-repeat center center;
	width: <?php print($atom->scald_thumbnail['und'][0]['metadata']['width']); ?>px;
	height: <?php print($atom->scald_thumbnail['und'][0]['metadata']['height']); ?>px;
	position: absolute; <?php print render($content['field_cm_banner_element_position']); ?>">

<?php endif; ?>




