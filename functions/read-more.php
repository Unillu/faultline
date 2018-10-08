<?php

/*
Faultline Read More text
=================================================
Add this to your `functions.php`
*/
/**
 * Removes width and height attributes from image tags
 *
 * @param string $html
 *
 * @return string
 */

 function modify_read_more_link() {
    return '&hellip; <a class="more-link" href="' . get_permalink() . '">Read More</a>';
}
add_filter( 'the_content_more_link', 'modify_read_more_link' );