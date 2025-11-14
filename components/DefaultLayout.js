 function DefaultLayout({ children }) {
      return <MathJaxContext config={config} version={3}>

                <Head>
                    <title>Luc Barrett</title>
                    <link rel="icon" href="/L.png" />
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous" />
                    {/* <meta name="theme-color" content="#ff8000" /> */}
                    {/* <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /> */}

                    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8" crossorigin="anonymous"></script>

                    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossorigin="anonymous"
                        onload="renderMathInElement(document.body);"></script>

                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            window.Module = {
                                onRuntimeInitialized: function() {
                                    console.log('WASM Runtime Initialized.');
                                    window.dispatchEvent(new CustomEvent('WasmReady'));
                                }
                            };
                        `,
                        }}
                    />
                </Head>
                <div className={styles2.backgroundContent}>
                    {/* <div className={`${styles2.backgroundContent} ${shouldBlur ? styles2.blurredBackground : ''}`}> */}
                    {/* <Lorenz className={styles2.background} showEllipses={showEllipsesState} isPaused={shouldBlur} /> */}
                    {/* <lorenzWASM className={styles2.background} /> */}

                    <canvas class="emscripten" id="canvas" tabindex={-1}></canvas>
                    {/* <script async type="text/javascript" src="app.js"></script> */}
                    <Script src="/load_app.js" strategy="afterInteractive" />

                </div>

                <div className={`${styles2.topContent} ${shouldBlur ? styles2.blurBackdrop : ''}`} >
                    <Navbar className={styles2.nbar} showName={!showEllipsesState} />
                    <Component {...pageProps}
                        scrollProgress={scrollProgress}
                        showProgress={isPostsPage}
                    />
                </div>
                <Analytics />
                <SpeedInsights />
            </MathJaxContext >


    }
    export default NoLayout;