exports.id = 145;
exports.ids = [145];
exports.modules = {

/***/ 2274:
/***/ ((module) => {

// Exports
module.exports = {
	"navbar": "navbar_navbar__vdWdK",
	"outer": "navbar_outer__Ue_It",
	"container": "navbar_container__dSoic",
	"divider": "navbar_divider__kn6rT"
};


/***/ }),

/***/ 3579:
/***/ ((module) => {

// Exports
module.exports = {
	"container": "Home_container__d256j",
	"title": "Home_title__hYX6j",
	"description": "Home_description__uXNdx",
	"grid": "Home_grid__AVljO",
	"card": "Home_card__E5spL",
	"logo": "Home_logo__IOQAX",
	"findme": "Home_findme__jWtS3",
	"main": "Home_main__VkIEL",
	"socials": "Home_socials__g01QO",
	"background": "Home_background__nqUIs",
	"mainAppContainer": "Home_mainAppContainer__R7RwQ",
	"backgroundContent": "Home_backgroundContent__S9gAz"
};


/***/ }),

/***/ 7145:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ App)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./styles/globals.css
var globals = __webpack_require__(6764);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./components/navbar.module.css
var navbar_module = __webpack_require__(2274);
var navbar_module_default = /*#__PURE__*/__webpack_require__.n(navbar_module);
;// CONCATENATED MODULE: ./components/navbar.js



function Navbar() {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: (navbar_module_default()).outer,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: (navbar_module_default()).container,
                children: [
                    /*#__PURE__*/ jsx_runtime.jsx((link_default()), {
                        href: "/",
                        children: "Home"
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx((link_default()), {
                        href: "/Resume.pdf",
                        children: "Resume"
                    }),
                    /*#__PURE__*/ jsx_runtime.jsx((link_default()), {
                        href: "mailto: labarrett@umass.edu",
                        children: "Contact"
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime.jsx("div", {
                className: (navbar_module_default()).divider
            })
        ]
    });
} /**
 * 
 * 
 *             <Link href="/">Home</Link>
            <Link href="/research">Research</Link>
            <Link href="/Resume.pdf">Resume</Link>
            <Link href="/newPage">Projects</Link>
            <Link href="/newPage">Contact</Link>
 * 
 */ 

// EXTERNAL MODULE: ./styles/Home.module.css
var Home_module = __webpack_require__(3579);
var Home_module_default = /*#__PURE__*/__webpack_require__.n(Home_module);
// EXTERNAL MODULE: ./node_modules/next/dynamic.js
var dynamic = __webpack_require__(5152);
var dynamic_default = /*#__PURE__*/__webpack_require__.n(dynamic);
;// CONCATENATED MODULE: ./pages/_app.js





//import Gravity from "../components/gravitysim"
const Gravity = dynamic_default()(null, {
    loadableGenerated: {
        modules: [
            "_app.js -> " + "../components/gravitysim3"
        ]
    },
    ssr: false
});
function App({ Component, pageProps }) {
    return /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        className: (Home_module_default()).mainAppContainer,
        children: [
            /*#__PURE__*/ jsx_runtime.jsx("div", {
                className: (Home_module_default()).backgroundContent
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                className: (Home_module_default()).topContent,
                children: [
                    /*#__PURE__*/ jsx_runtime.jsx(Navbar, {}),
                    /*#__PURE__*/ jsx_runtime.jsx(Component, {
                        ...pageProps
                    })
                ]
            })
        ]
    });
} /**
 * 
 * <Gravity className={styles2.background} />
 */ 


/***/ }),

/***/ 6764:
/***/ (() => {



/***/ })

};
;