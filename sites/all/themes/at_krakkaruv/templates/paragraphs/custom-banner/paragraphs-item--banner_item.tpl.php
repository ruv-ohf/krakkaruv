<div class="paragraphs-item">
<?php
	$node = node_load($nid);
	$field = field_get_items('node', $node, 'field_min_width_size');
	$output = field_view_value('node', $node, 'field_min_width_size', $field[$delta]);
?>
	<?php print $output; ?>
  	<?php //print render($content['field_min_width_size']); ?>
</div>