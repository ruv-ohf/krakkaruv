<?php

/**
 * A (fake) pager plugin that wraps around the actual pager.
 *
 * @ingroup views_pager_plugins
 */
class views_php_plugin_pager extends views_php_plugin_wrapper  {

  /**
   * Perform any needed actions just prior to the query executing.
   */
  public function pre_execute(&$query) { 
    $this->wrapped->pre_execute($query);

    foreach (array(/*'argument',*/ 'field', 'filter', 'sort', /*'relationship'*/) as $type) {
      foreach ($this->wrapped->view->$type as $id => $handler) {
        if (is_callable(array($handler, 'php_pre_execute'))) {
          $handler->php_pre_execute();
        }
      }
    }
	$this->wrapped->view->query->set_limit(0);
    $this->wrapped->view->query->set_offset(0);

  }

  /**
   * Perform any needed actions just after the query executing.
   */
  public function post_execute(&$result) {
    foreach (array(/*'argument',*/ 'field', 'filter', 'sort', /*'relationship'*/) as $type) {
      foreach ($this->wrapped->view->$type as $id => $handler) {
        if (is_callable(array($handler, 'php_post_execute'))) {
          $handler->php_post_execute();
        }
      }
    }

    if(count($this->wrapped->view->result)< $this->wrapped->get_items_per_page()) {
      $this->wrapped->total_items=count($this->wrapped->view->result);
      $this->update_page_info();
      $is_last = 1;   
    }
    $this->wrapped->post_execute($result);
    
    //total_items less than items_per_page sets current_page=0, but we set current page to -1 to prevent the evaluation in 
    // function views_load_more_views_ajax_data_alter() to be true and prevent that function to alter the ajax $commands array. 
    if(isset($is_last) && $is_last == 1){
      //view::set_current_page(-1);
      $this->set_current_page(-1);
    }

  }


  /**
   * Execute the count query, which will be done just prior to the query
   * itself being executed.
   */
  function execute_count_query(&$count_query) {
    //Hack: stopping  (the slow) count queries since we are not using full pager and do not need to know the correct count. 
    //$this->wrapped->execute_count_query($count_query);

    //Instead we set the pager to fixed large number, and reset the pager to -1 in post_execute if the last page
    $this->total_items = 30000;
    $this->update_page_info();
    return $this->total_items;
  }
}
