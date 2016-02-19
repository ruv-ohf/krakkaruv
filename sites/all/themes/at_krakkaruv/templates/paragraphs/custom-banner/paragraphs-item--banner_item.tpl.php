<div class="paragraphs-item">
<?php
	$output = field_view_value('node', $node, 'field_min_width_size', $field[$delta]);
?>
	<?php print render($output); ?>
  	<?php //print render($content['field_min_width_size']); ?>
</div>