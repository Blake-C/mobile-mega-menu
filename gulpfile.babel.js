import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import connect from 'gulp-connect-php';
import del from 'del';
import yargs from 'yargs';
import pngquant from 'imagemin-pngquant';
import webpackConfig from "./webpack.config.js";

const $ = gulpLoadPlugins({pattern: ["*"]});
const reload = browserSync.reload;
const argv = yargs.argv;

const dir = {
	dist: 'dist/assets',
	app: 'app/assets',
	components: 'app/components'
}

gulp.task('styles', () => {
	return gulp.src(`${dir.components}/styles/*.scss`)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass.sync({
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['.']
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({browsers: ['last 4 versions', 'Firefox ESR', 'IE 8-11']}))
		.pipe($.cssnano({
			autoprefixer: false
		}))
		.pipe($.sourcemaps.write('.'))
		.pipe($.if(argv.build, gulp.dest(`${dir.dist}/styles`), gulp.dest(`${dir.app}/styles`)))
		.pipe(browserSync.stream({match: '**/*.css'}))
		.pipe($.notify({ message: 'Styles Task Completed.', onLast: true }));
});

gulp.task('scripts', () => {
	return gulp.src([`${dir.components}/scripts/main.js`])
		.pipe($.plumber())
		.pipe($.webpackStream(webpackConfig, $.webpack))
		.pipe($.if(argv.build, gulp.dest(`${dir.dist}/scripts`), gulp.dest(`${dir.app}/scripts`)))
		.pipe(reload({stream: true}))
		.pipe($.notify({ message: 'Scripts Task Completed.', onLast: true }));
});

gulp.task('images', () => {
	// Optimize all images to be used on the site using imageoptim
	// TODO: Improve with SVG/PNG sprite generator
	// TODO: Added Favicon/App Icon generator
	return gulp.src(`${dir.components}/images/**/*`)
		.pipe($.imagemin({
			progressive: true,
			interlaced: true,
			// don't remove IDs from SVGs, they are often used
			// as hooks for embedding and styling
			svgoPlugins: [{cleanupIDs: false}],
			use: [pngquant({quality: '65-80', speed: 4})],
		})
		.on('error', function (err) {
			console.log(err);
			this.end();
		}))
		.pipe($.if(argv.build, gulp.dest(`${dir.dist}/images`), gulp.dest(`${dir.app}/images`)))
});

gulp.task('serve', ['styles', 'scripts', 'images'], () => {
	connect.server({
		base: './app',
		stdio: 'ignore'
	}, function (){
		browserSync({
			proxy: '127.0.0.1:8000',
			browser: 'google chrome',
			notify: false
		});
	});

	gulp.watch([
		'app/*.php',
		'app/*.html',
		'app/images/**/*'
	]).on('change', reload);

	gulp.watch(`${dir.components}/styles/**/*`, ['styles']);
	gulp.watch(`${dir.components}/images/**/*`, ['images']).on('change', reload);
	gulp.watch(`${dir.components}/icons/**/*`, ['icons']).on('change', reload);
	gulp.watch(`${dir.components}/scripts/**/*`, ['scripts']).on('change', reload);
	gulp.watch(`${dir.components}/fonts/**/*`, ['fonts']).on('change', reload);
});

gulp.task('watch', ['styles', 'scripts', 'images', 'fonts', 'icons'], () => {
	gulp.watch([`${dir.components}/styles/**/*`], ['styles']);
	gulp.watch([`${dir.components}/images/**/*`], ['images']);
	gulp.watch([`${dir.components}/icons/**/*`], ['icons']);
	gulp.watch([`${dir.components}/scripts/**/*`], ['scripts']);
	gulp.watch([`${dir.components}/fonts/**/*`], ['fonts']);
});

gulp.task('copy', () => {
	return gulp.src([
		'./app/**/*',
		'!./app/components{,/**}',
		'!./app{,/*}.json'
	])
	.pipe($.if(argv.build, gulp.dest('dist')));
})

gulp.task('clean',
	del.bind(null, [dir.app, 'dist'], {force : true})
);

gulp.task('build', ['styles', 'scripts', 'images', 'copy'], () => {
	return gulp.src(dir.dist + '/**/*')
		.pipe($.size({title: 'build', gzip: true}))
		.pipe(gulp.dest( dir.dist ))
		.pipe($.notify({ message: 'Build Task Completed.', onLast: true }));
});

gulp.task('default', ['clean'], () => {
	gulp.start('build');
});
