<?php
	hide($content['field_min_width_size']);
	print render($content);
?>

<style>
	@media only screen and (min-width: <?php print render($content['field_min_width_size']); ?>) {
		.paragraphs-items {
			background-color: red;
		}
	}
</style>
