<?php
/**
 * @file
 * Defines admin form for shownid settings.
 */

/**
 * Page callback for shownid settings.
 *
 * @see shownid_menu()
 */
function shownid_admin_form($form, &$form_state) {
  $form['shownid_block_prefix'] = array(
    '#type' => 'textfield',
    '#title' => t('Block string prefix'),
    '#description' => t('The string to show in front of nid/tid in the block.'),
    '#default_value' => variable_get('shownid_block_prefix', 'Current nid'),
    '#disabled' => FALSE,
    '#size' => 50,
    '#maxlength' => 128,    
  );

  $form['shownid_navbar'] = array(
    '#type' => 'checkbox',
    '#title' => t('Integrate with navbar module'),
    '#description' => t('Show nid/tid in navbar when navbar module is enabled.'),
    '#default_value' => variable_get('shownid_navbar', 0),
  );

  $form['shownid_navbar_weight'] = array(
  	'#type' => 'weight',
  	'#title' => t('Weight'),
  	'#delta' => 1000,
  	'#default_value' => variable_get('shownid_navbar_weight', 0),
  	'#description' => t('Weight of the shownid item in navbar.'),
    '#states' => array(
      'visible' => array(
        ':input[name="shownid_navbar"]' => array('checked' => TRUE),
      ),
  	),
  );

  return system_settings_form($form);
}
