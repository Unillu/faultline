<?php

/*
Faultline Footer Menus
=================================================
Add this to your `functions.php`
*/

function register_my_menus() {
  register_nav_menus(
    array(
      'who' => __( 'Who We Are' ),
      'how' => __( 'How We Play' ),
      'media' => __( 'Our Media' )
    )
  );
}
add_action( 'init', 'register_my_menus' );
