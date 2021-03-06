		<footer class="footer">
			<div class="container">
			  <h3 class="social-headline"><span class="header">Follow Us</span>
			  <a href="https://www.facebook.com/faultline40k/" class="social-link" target="_blank"><span class="icon icon-facebook"></span></a><a href="https://www.instagram.com/faultline40k/" class="social-link" target="_blank"><span class="icon icon-instagram"></span></a></h3>

			  <div class="grid-row">
				<div class="grid-xs-col12 grid-md-col2 footer-content">
				  <ul class="footer-list">
					<li class="header">Who we are</li>
					<?php wp_nav_menu( array( 'theme_location' => 'who' ) ); ?>
				  </ul>
				</div>
				<div class="grid-xs-col12 grid-md-col2 footer-content">
				  <ul class="footer-list">
					<li class="header">How we play</li>
					<?php wp_nav_menu( array( 'theme_location' => 'how' ) ); ?>
				  </ul>
				</div>
				<div class="grid-xs-col12 grid-md-col2 footer-content">
				  <ul class="footer-list">
					<li class="header">Our Media</li>
					<?php wp_nav_menu( array( 'theme_location' => 'media' ) ); ?>
				  </ul>
				</div>
				<div class="grid-xs-col12 grid-md-col4 grid-md-offset-col1 copyright">
					&copy; Copyright <?php echo get_bloginfo( 'name' ); ?> <?php echo date("Y"); ?>
					<ul class="footer-list">
						<li><a href="<?php echo esc_url( home_url( '/privacy-policy' ) ); ?>" />Privacy Policy</a></li>
					</ul>
				</div>
			  </div>
			</div>
		</footer>
	</main>
	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous" type="text/javascript"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous" type="text/javascript"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous" type="text/javascript"></script>
	<?php if (is_front_page()) { ?>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/parallax/3.1.0/parallax.min.js"></script>
	<script type="text/javascript">
		var scene = document.getElementById('scene');
		var parallaxInstance = new Parallax(scene);

		// Bad guys featured on the left
		var baddiesArray = [
			"<?php echo get_bloginfo('template_directory'); ?>/images/home-hero-tyranid.png"
		];
		var numBad = Math.floor(Math.random() * baddiesArray.length);

		// Good guys featured on the right
		var gooddiesArray = [
			"<?php echo get_bloginfo('template_directory'); ?>/images/home-hero-tau.png"
		];
		var numGood = Math.floor(Math.random() * gooddiesArray.length);

		function selectPlayers() {
			document.baddie.src = baddiesArray[numBad];
			document.goodie.src = gooddiesArray[numGood];
		}

		selectPlayers();
	</script>
	<?php } ?>
	<!-- endbuild -->

	<!-- Built with love using Web Starter Kit -->
	<?php wp_footer(); ?>
  </body>
</html>
