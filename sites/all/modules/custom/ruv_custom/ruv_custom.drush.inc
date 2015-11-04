<?php 
/**
 * Implements hook_drush_help().
 */
function ruv_custom_drush_help($command) {
  switch ($command) {
    case 'drush:ruv-feed':
      return dt('Runs Feeds cron job');
    //case 'drush:ruv-delete-forms':
  }
}

/**
 * Implements hook_drush_command().
 */
function ruv_custom_drush_command() {
  $items = array();
  $items['ruv-feed'] = array(
    'description' => dt('Runs the feed import with Feeds.'),
    'arguments'   => array(
      'feed'    => dt("A list of feeds to import, separated by comma (','). "
                      . "Available feeds: " . _ruv_custom_available_feed()),
    ),
    'examples' => array(
      'Standard example' => 'drush ruv-feed',
      'Argument example with one feed' => 'drush ruv-feed ruv',
      'Argument example with two feeds' => 'drush ruv-feed ruv,ras2',
      'Argument example with all feeds' => 'drush ruv-feed ALL',
    ),
    'aliases' => array('ruv-f'),
  );

  $items['ruv-solr'] = array(
    'description' => dt('Runs the feed import with Feeds.'),
    'arguments'   => array(),
    'examples' => array(
      'Standard example' => 'drush ruv-solr'
    ),
    'aliases' => array('ruv-s'),
  );

  $items['ruv-jstats'] = array(
    'description' => dt('Runs the jstat accesslog handling and aggregation.'),
    'arguments'   => array(),
    'examples' => array(
      'Standard example' => 'drush ruv-jstats'
    ),
    'aliases' => array('ruv-js'),
  );

   $items['ruv-schedule'] = array(
    'description' => dt('Runs the jstat accesslog handling and aggregation.'),
    'arguments'   => array(),
    'examples' => array(
      'Standard example' => 'drush ruv-schedule'
    ),
    'aliases' => array('ruv-sh'),
  );
  $items['ruv-formclearcache'] = array(
    'description' => dt('Run.'),
    'arguments'   => array(),
    'examples' => array(
      'Standard example' => 'drush ruv-formclearcache'
    ),
    'aliases' => array('ruv-fcc'),
  );
  $items['ruv-connect-sip'] = array(
    'description' => dt('Run.'),
    'arguments'   => array(),
    'examples' => array(
      'Standard example' => 'drush ruv-connect-sip'
    ),
    'aliases' => array('ruv-cs'),
  );
  $items['ruv-unpublish-expired-nodes'] = array(
      'description' => dt('Run.'),
      'arguments'   => array(),
      'examples' => array(
          'Standard example' => 'drush ruv-unpublish-expired-nodes'
      ),
      'aliases' => array('ruv-unpublish'),
  );
 /* $items['ruv-delete-forms'] = array(
      'description' => dt("Runs a delete command to reduce the size of cache_form table in the database"),
      'arguments' => null,
      ),
      'examples' => array(
        'Standard example' => 'drush ruv-delete-forms',
        ),
      'aliases' => array('ruv-df'),
    );*/
  return $items;
}

/**
 * Callback function for drush ruv-feeds. 
 *
 * @param $limit
 *   An optional argument
 */
function drush_ruv_custom_ruv_feed($feeds = NULL) 
{
  //check if the argument was passed in and just print it out
  if (isset($feeds)) 
  {
    switch($feeds)
    {
      case "ALL" :
        drush_print("Run ALL feed");
        drush_ruv_custom_ruv_feed( _ruv_custom_available_feed() );
      break;
      default :
        $feedsarray = explode(',', $feeds);
        foreach ($feedsarray as $feed) 
        {
          $feed = trim($feed);
          drush_print("Run feed $feed @ ".date("Y-m-d H:i:s",time()));
          _ruv_custom_run_feed($feed);
          drush_print("$feed DONE @ ".date("Y-m-d H:i:s",time()));
        }          
    }
  }else 
  {
    drush_print('You must specify one or more feeds to run. Available feeds: ' . _ruv_custom_available_feed());
  }  
}

/**
* Callback function for drush solar cun
**/
function drush_ruv_custom_ruv_solr()
{
  drush_print("Running Solr Index | ".date("Y-m-d H:i:s",time()));
  $is_succsess = search_api_cron();
  drush_print($is_succsess);
  drush_print("DONE Solr Index | ".date("Y-m-d H:i:s",time()));
}

/**
* Callback function for drush solar cun
**/
function drush_ruv_custom_ruv_formclearcache()
{
  drush_print("Running Form Clear Cache | ".date("Y-m-d H:i:s",time()));
  $is_succsess = db_delete("cache_form")->condition("expire",time(),"<=")->execute();
  drush_print($is_succsess);
  drush_print("DONE Form Clear Cache | ".date("Y-m-d H:i:s",time()));
}  


/**
* Callback function for drush solar cun
**/
function drush_ruv_custom_ruv_schedule()
{
  drush_print("Running Schedule | ".date("Y-m-d H:i:s",time()));
  $is_success = scheduler_cron();
  drush_print($is_succsess);
  drush_print("DONE Schedule | ".date("Y-m-d H:i:s",time()));
} 

/**
*Callback function for drush jstats handleing and aggregation
**/
function drush_ruv_custom_ruv_jstats()
{
  drush_print("Running jStats Index | ".date("Y-m-d H:i:s",time()) );
  $is_succsess = jstats_cron();
  drush_print($is_succsess);
  drush_print("DONE jStats Index | ".date("Y-m-d H:i:s",time()) );
}
/*
 * Internal function that lists available tables
 */
function _ruv_custom_available_feed() {
  $available_feeds = array(
    "ruv",
    "ras1",
    "ras2",
    "thaettir-ruv",
    "thaettir-ras1",
    "thaettir-ras2",
  );
  return implode(",", $available_feeds);
}

/**
* Run the feeds import commands for each tiesm
*/
function _ruv_custom_run_feed($feed=NULL)
{
	if(isset($feed))
	{
		switch($feed)
		{
			case "ruv" :
				drush_print("Running RÚV feed | ".date("Y-m-d H:i:s",time()));
				$is_succsess = _ruv_custom_import_feed('muninn_feeds_15m',144);
				drush_print($is_succsess);
				drush_print("DONE RÚV feed | ".date("Y-m-d H:i:s",time()));
			break;
			//
			case "ras1" :
				drush_print("Running Rás 1 feed | ".date("Y-m-d H:i:s",time()));
				$is_succsess = _ruv_custom_import_feed('muninn_feeds_15m',295);
				drush_print($is_succsess);
				drush_print("DONE Rás 1 feed | ".date("Y-m-d H:i:s",time()));
			break;
			//
			case "ras2" :
				drush_print("Running Rás 2 feed | ".date("Y-m-d H:i:s",time()));
                $is_succsess = _ruv_custom_import_feed('muninn_feeds_15m',296);
				drush_print($is_succsess);
				drush_print("DONE Rás 2 feed | ".date("Y-m-d H:i:s",time()));
			break;
      //
      case "thaettir-ruv" :
        drush_print("Running RÚV þættir feed | ".date("Y-m-d H:i:s",time()));
        $is_succsess = _ruv_custom_import_feed('theattir_info_feed',2);
        drush_print($is_succsess);
        drush_print("DONE RÚV þættir feed");
      break;
       //
      case "thaettir-ras1" :
        drush_print("Running Rás 1 þættir feed | ".date("Y-m-d H:i:s",time()));
        $is_succsess = _ruv_custom_import_feed('theattir_info_feed',4);
        drush_print($is_succsess);
        drush_print("DONE Rás 1 þættir feed | ".date("Y-m-d H:i:s",time()));
      break;
       //
      case "thaettir-ras2" :
        drush_print("Running Rás 2 þættir feed | ".date("Y-m-d H:i:s",time()));
        $is_succsess = _ruv_custom_import_feed('theattir_info_feed',3);
        drush_print($is_succsess);
        drush_print("DONE Rás 2 þættir feed | ".date("Y-m-d H:i:s",time()));
      break;
		}
	}
}

function _ruv_custom_import_feed($type=NULL,$nid=NULL)
{
	if(isset($type) && isset($nid))
	{
		$myFeed = feeds_source($type, $nid);
		while (FEEDS_BATCH_COMPLETE != $myFeed->import());
		return t('Import successfull');
	}
}

/**
 * Connects Sip envelopes to nodes that have unconnected Sip envelopes
 * @throws \Exception
 */
function drush_ruv_custom_ruv_connect_sip(){
  $reference_node = node_load(603854);
  $sql = "SELECT * FROM node
		WHERE `type` = 'faersla' AND title IN(
			SELECT title FROM ruv.node
			WHERE nid IN
			(SELECT nid FROM ruv.node WHERE `type` = 'faersla'
				AND title IN(SELECT title FROM ruv.node WHERE `type` = 'media') ORDER BY title
			)
			AND nid NOT IN
			(
				SELECT entity_id FROM field_data_field_media_reference WHERE entity_id IN(
					SELECT nid FROM ruv.node WHERE `type` = 'faersla'
					AND title IN(SELECT title FROM ruv.node WHERE `type` = 'media') ORDER BY title
				)
			)
		)
		AND language = 'und' and status = 1 AND (title != 'Spurning dagsins' OR title != 'Test')
	";

  $result = db_query($sql);
  $counter = 0;
  foreach($result as $r){
    $counter++;
    $node = node_load($r->nid);
    $media_sql = "SELECT * FROM node WHERE `type` = 'media' AND title = '{$node->title}'";
    $media_result = db_query($media_sql);
    $media = $media_result->fetchAssoc();

    if(!isset($node->field_media_reference[LANGUAGE_NONE])){
      $node->field_media_reference[LANGUAGE_NONE][0]['target_id'] = $media['nid'];
      node_save($node);
    }
    else{
      $size = sizeof($node->field_media_reference[LANGUAGE_NONE]);
      $found = false;
      foreach($node->field_media_reference[LANGUAGE_NONE] as $ref){
        if($ref->target_id != $media->nid){
          $found = true;
        }
      }
      if(!$found){
        $node->field_media_reference[LANGUAGE_NONE][$size]['target_id'] = $media['nid'];
        node_save($node);
      }
    }
  }
  drush_print('Connect successful.  Connected ' . $counter . ' nodes.');
}

function drush_ruv_custom_ruv_unpublish_expired_nodes(){
  //
  $query = new EntityFieldQuery();
  $date = date('Y-m-d H:i:s');
  $result = $query
      ->entityCondition('entity_type', 'node')
      ->propertyCondition('type', 'dagskra')
      ->propertyCondition('status', 1, '=')
      ->fieldCondition('field_kringlan_expires_web', 'value', $date, '<')
      ->execute();
  if (!empty($result['node'])) {
    $results = entity_load('node', array_keys($result['node']));
  }
  foreach($results as $res){
    $res->status = 0;
    node_save($res);
  }
  drush_print("Unpublished " . sizeof($results) . " nodes.");
}
