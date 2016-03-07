VIEW ALIAS

This module aids in the bulk creation and deletion of SEO friendly view aliases.

In the past, I've worked on several sites that utilize a single view which takes
in a one taxonomy term id to display a list of related items.  And, on these
sites maintaining the URL aliases for them was a pain to do by hand, so I wrote
this module to do the repetition for me.

    - Eric Mckenna, Phase2 Technology

Views Alias was critical to the success of some Drupal 6 sites I put together,
so when I started to work on some Drupal 7 sites with similar needs, I reached
for Views Alias.  To my dismay, I found no Drupal 7 version and only a single
pending patch to create a baseline D7 port.  Eric was kind enough to grant me
co-maintainer status on the module and I spent a couple weeks updating it for
Drupal 7 and adding features requested in the issue queue.  What you see here
is the results of that effort.

    - John Franklin, Sentai Digital

SETUP
1. untar the tarball into your drupal modules directory
2. enable the module
3. visit admin/config/search/path for configuration options.

Generating Aliases
View Alias is integrated with pathauto, (admin/config/search/path).  So, expand
the "View Alias Paths" settings fieldset to select the views to alias.

Steps to make a view available to view_alias:
1. View must exist and have a page display.
2. Under Arguments, View must have one or more arguments (Contextual Filters) of
  "Content: Has taxonomy term ID" or "Content: Has taxonomy term ID (with depth)"
3. Check "Specify validation criteria"
4. Under "Validator" options:
  a. Set "Validator" to "Taxonomy Term", then select your term vocabularies.
  b. Set "Filter Value Type" to "Term ID"

In the 7.x version, the views are listed and a text field is provided to
specify the alias pattern.  Views generates machine names for each argument
(e.g., tid, tid_1), which need to be referenced in the alias pattern so Pathauto
can pass it to token_replace() to generate the aliases.  Views Alias provides
token prefixes of the form [view_alias:argument_machine_name?:?] for each
argument and passes the rest down to the standard taxonomy tokens.

For example, if you want use the term name of the tid argument, you would use
the token [view_alias:tid:term:name].  To use all the parent terms joined with
a slash (/), you would use [view_alias:tid:parents:join:/].  To prefix the term
name with the machine name of the vocabulary, use the pattern:

    [view:alias:tid:term:vocabulary:machine_name]/[view:alias:tid:term:name]

Any of the tokens listed in the Taxonomy Term Paths Replacement Patterns list
are available.

The text field for each view has a "default" listed below it that can be
copy/pasted into the text field to provide direct term name replacements of
the arguments in the views path.

Leaving a text field blank will disable aliasing for that view.

Not (yet) supported:
- Multiple value term arguments (e.g. my-view/12+34)
- NIDs or UIDs

7.x version:
John Franklin, Sentai Digital
franklin@sentaidigital.com

6.x version:
Eric Mckenna, Phase2 Technology
emckenna@phase2technology.com
