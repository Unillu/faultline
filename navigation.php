<nav class="navbar navbar-expand-md fixed-top container">
	<a class="navbar-brand icon-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>"></a>
  <button class="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#faultlineNav" aria-controls="faultlineNav" aria-expanded="false" aria-label="Toggle navigation">
	<svg viewBox="0 0 22 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="menu-toggle">
		<g class="nav-toggle-bg">
			<path d="M0.5,0.5 L0.5,1.5 L21.5,1.5 L21.5,0.5 L0.5,0.5 Z M0.5,6.5 L0.5,7.5 L21.5,7.5 L21.5,6.5 L0.5,6.5 Z M0.5,12.5 L0.5,13.5 L21.5,13.5 L21.5,12.5 L0.5,12.5 Z"></path>
		</g>
	</svg>
  </button>
  <div class="collapse navbar-collapse navbar-toggleable-xs" id="faultlineNav">
	<?php
		wp_nav_menu( array(
		  'theme_location' => 'navbar',
		  'container'      => false,
		  'menu_class'     => 'navbar-nav ml-auto',
		  'fallback_cb'    => '__return_false',
		  'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
		  'depth'          => 2,
		  'walker'         => new bootstrap_4_walker_nav_menu()
	   ) );
	?>
  </div>
</nav>
