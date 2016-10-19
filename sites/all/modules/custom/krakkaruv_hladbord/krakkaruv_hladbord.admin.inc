<?php
// $Id$
define('WATCH', 313);
define('LISTEN', 312);
define('CREATE', 315);
define('PLAY', 314);
/**
 * @file
 * Admin page callback for the scaffolding module.
 */

/**
* Helperfunction to get list of nodequeues that the module should affect on.
* @date 2016-10-19
* @author: Helgi P (holypoly4) <helgipall@ruv.is>  
*/
function krakkaruv_haldbord_queuelist()
{
  $queuelist = nodequeue_load_queues(nodequeue_get_all_qids());
  if($queuelist)
  {
    foreach($queuelist as $key => $val)
    {
      $queuelistarray[$key] = $val->title;
    }
  }else
  {
    return false;
  }
  return $queuelistarray;
}


/**
 * Builds and returns the scaffolding settings form.
 */

function krakkaruv_hladbord_admin_settings() {
  $form['krakkaruv_hladbord_affected_queue'] = array(
    '#type' => 'select',
    '#title' => t('Affected node-queue'),
    '#options' => drupal_map_assoc(krakkaruv_haldbord_queuelist()),
    '#default_value' => variable_get('krakkaruv_hladbord_affected_queue', 1),
    '#description' => t('Defines witch Node-queue for Hlaðborð should be affected.'),
    '#required' => TRUE,
  );
  $form['krakkaruv_hladbord_number_of_watch_nodes'] = array(
    '#type' => 'select',
    '#title' => t('Number of "watch" nodes'),
    '#options' => drupal_map_assoc(range(0, 9)),
    '#default_value' => variable_get('krakkaruv_hladbord_number_of_watch_nodes', 0),
    '#description' => t('Defines how many watch nodes will be pulled to the Hlaðborð.'),
    '#required' => TRUE,
  );
  $form['krakkaruv_hladbord_number_of_listen_nodes'] = array(
    '#type' => 'select',
    '#title' => t('Number of "listen" nodes'),
    '#options' => drupal_map_assoc(range(0, 9)),
    '#default_value' => variable_get('krakkaruv_hladbord_number_of_listen_nodes', 0),
    '#description' => t('Defines how many listen nodes will be pulled to the Hlaðborð.'),
    '#required' => TRUE,
  );
  $form['krakkaruv_hladbord_fixed_places'] = array(
    '#type' => 'textfield',
    '#title' => t('What places are "fixed"'),
    '#default_value' => variable_get('krakkaruv_hladbord_fixed_places', ''),
    '#description' => t('A comma seperated list of hlaðborð-places that are fixed (will not be replaced).
        Be aware though! If you have a fixed node that will also appear in the newest feed, only the
        first item will show!'),
    '#required' => FALSE,
  );
  $form['krakkaruv_hladbord_first_place_tax'] = array(
    '#type' => 'select',
    '#title' => t('Which taxonomy will sit in first place'),
    '#options' => array(WATCH => 'Horfa', LISTEN => 'Hlusta'),
    '#default_value' => variable_get('krakkaruv_hladbord_first_place_tax', WATCH),
    '#description' => t('Defines which taxonomy term will be in the first place for the Hlaðborð.'),
    '#required' => TRUE,
  );
  return system_settings_form($form);
}
