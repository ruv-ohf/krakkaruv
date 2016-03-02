<?php
$image_url 	= '';
$image_url2 = '';
//$image_url3 = '';

//Til að fá atom id
$atom_id 			= $content['field_custom_banner_image']['#items'][0]['sid'];
$atom_id2 			= $content['field_background_repeat']['#items'][0]['sid'];

//til að ná í atom
$atom 	= scald_atom_load($atom_id);
$atom2 	= scald_atom_load($atom_id2);
//$atom3 	= scald_atom_load($absolute_element);

if(!empty($atom)) {
        //Til að ná í myndaurlið í réttum stíl
	$image_url = image_style_url('custom_banner', $atom->file_source);
}
if(!empty($atom2)) {
        //Til að ná í myndaurlið í réttum stíl
	$image_url2 = image_style_url('custom_banner', $atom2->file_source);
}

$hlekkur 	= $content['field_custom_banner_hlekkur'];
$breakpoint = $content['field_breakpoint'];
$banner_id  = $content['field_cm_banner_id_name'];

?>

<?php
	hide($content['field_custom_banner_height']);
	hide($content['field_custom_banner_image']);
	hide($content['field_background_repeat']);
	hide($content['field_breakpoint']);
	hide($content['field_custom_banner_hlekkur']);
	hide($content['field_absolute_positioned_elemen']);
	hide($content['field_cm_banner_image_position']);
	hide($content['field_cm_custom_banner_border']);
	hide($content['field_cm_banner_id_name']);
?>

<div class="<?php print $banner_id; ?>">

<style>
	.paragraphs-items-wrapper-inner {
		position: relative;
		<?php print render($content['field_cm_custom_banner_border']); ?>
	}
	.paragraphs-item-wrapper {
		background: url(<?php print $image_url2; ?>) repeat-x top left;
	}
</style>

<?php if ($hlekkur): ?>

	<style>
		.paragraphs-items-field-breakpoint {
			height: <?php print render($content['field_custom_banner_height']); ?>px;
			background: url(<?php print $image_url; ?>) no-repeat;
			background-position: <?php print render($content['field_cm_banner_image_position']); ?>;
		}
		.paragraphs-item-wrapper a {
			display: block;
		}
		.paragraphs-items-field-absolute-positioned-elemen .absolute-image {
			position: absolute;
		}
	</style>

	<a href="<?php print render($hlekkur); ?>">
		<div class="paragraphs-items-wrapper-inner">
			<?php print render($content['field_absolute_positioned_elemen']); ?>
			<?php print render($content['field_breakpoint']); ?>
		</div>
	</a>
	
<?php elseif ($breakpoint): ?>

	<style>
		.paragraphs-items-field-breakpoint {
			height: <?php print render($content['field_custom_banner_height']); ?>px;
			background: url(<?php print $image_url; ?>) no-repeat;
			background-position: <?php print render($content['field_cm_banner_image_position']); ?>;
		}
		.paragraphs-items-field-absolute-positioned-elemen .absolute-image {
			position: absolute;
		}
	</style>

	<div class="paragraphs-items-wrapper-inner">
		<?php print render($content['field_absolute_positioned_elemen']); ?>
		<?php print render($content['field_breakpoint']); ?>
	</div>
	
<?php else: ?>

	<style>
		.paragraphs-items-wrapper-inner {
			background: url(<?php print $image_url; ?>) no-repeat;
			position: relative;
			overflow: hidden;
			height: <?php print render($content['field_custom_banner_height']); ?>px;
			background-position: <?php print render($content['field_cm_banner_image_position']); ?>;
		}
		.paragraphs-items-field-absolute-positioned-elemen .absolute-image {
			position: absolute;
		}
	</style>

	<div class="paragraphs-items-wrapper-inner">
		<?php print render($content['field_absolute_positioned_elemen']); ?>
	</div>
	
	
<?php endif; ?>

</div>

