<?php

/**
 * @file
 * Custom feeds tamper plugin, currently works only with the "Muninn Feeds" dayly feeds importer.
 * Checks if the current heimar term exist and then checks if that term has terms from the aldursflokkar vocabulary defined and if so, adds those term to the current dagskra item.
 */

$plugin = array(
  'form' => 'ruv_custom_aldursflokkar_add_form',
  'callback' => 'ruv_custom_aldursflokkar_add_callback',
  'validate' => 'ruv_custom_aldursflokkar_add_validate',
  'name' => 'Add aldursflokkar',
  'multi' => 'loop',
  'category' => 'RUV custom',
);

// Form function. Only used for description, since there are no settings to config.
function ruv_custom_aldursflokkar_add_form($importer, $element_key, $settings) {
  $form = array();
    $form['info'] = array(
    '#markup' => t('No configuration needed. Adds aldursflokkar terms to dagskrar items if relavant heimur term has any. Notice that this is custom plugin and will only work correctly with the "Muninn Feeds daily" feeds importer'),
  );
  return $form;
}

// Validate function. Not used since there are no setting in config
// function ruv_custom_aldursflokkar_add_validate(&$settings) {
//   error_log(print_r("validate function"),true);
// }

//Callback function - Performs all the magic.
function ruv_custom_aldursflokkar_add_callback($result, $item_key, $element_key, &$field, array $settings) {

  $feed_title = $result->items[$item_key]["xpathparser:30"];
  $vid = 4;
  $bundle = 'heimar';
  $terms = array();



  $query = "SELECT 'node' as entity_type, 'heimar' as bundle, b.field_age_category_tid, c.name as name 
    from taxonomy_term_data a
    left join field_data_field_age_category b on a.tid = b.entity_id 
    left join taxonomy_term_data c on b.field_age_category_tid = c.tid
    WHERE a.name = :tname
    AND b.bundle = :bundle
    AND a.vid = :vid";
  $args = array(
    ':vid' => $vid,
    ':bundle' => $bundle,
    ':tname' => $feed_title,
  );

  $results = db_query($query, $args)->fetchAll();

  if (count($results) >0){

    foreach ($results as $key=>$record) {

      $terms[] = $record->name;
    }
    $field = $terms;
   
  }
//error_log(print_r($field,"true"));  

}
