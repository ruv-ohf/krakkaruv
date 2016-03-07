<?php
/**
 * @file
 *
 * Tokens support for Views Alias
 */

/**
 * Implemntats hook_tokens()
 */
function view_alias_tokens($type, $tokens, $data = array(), $options = array()) {
  if ($type != 'view_alias') {
    return array();
  }

  $replacements = array();
  foreach($tokens as $token => $raw) {
    list($field, $token) = explode(':', $token, 2);
    $term_tokens = token_find_with_prefix(array($token => $raw), 'term');
    $replacements += token_generate('term', $term_tokens, array('term' => $data[$field]), $options);
  }

  return $replacements;
}

/**
 * Implements hook_token_list
 *
 * There are no public tokens supported.
 */
function view_alias_token_list($type = 'all') {
  return array();
}
