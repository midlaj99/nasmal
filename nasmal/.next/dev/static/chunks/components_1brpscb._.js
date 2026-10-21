(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/AutoCarousel.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "activeDot": "AutoCarousel-module__jQ3Bua__activeDot",
  "bookNowBtn": "AutoCarousel-module__jQ3Bua__bookNowBtn",
  "carouselItem": "AutoCarousel-module__jQ3Bua__carouselItem",
  "carouselTrack": "AutoCarousel-module__jQ3Bua__carouselTrack",
  "carouselWrapper": "AutoCarousel-module__jQ3Bua__carouselWrapper",
  "dot": "AutoCarousel-module__jQ3Bua__dot",
  "dots": "AutoCarousel-module__jQ3Bua__dots",
  "offerCard": "AutoCarousel-module__jQ3Bua__offerCard",
  "offerImage": "AutoCarousel-module__jQ3Bua__offerImage",
  "offerOverlay": "AutoCarousel-module__jQ3Bua__offerOverlay",
  "offerTitle": "AutoCarousel-module__jQ3Bua__offerTitle",
});
}),
"[project]/components/AutoCarousel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AutoCarousel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoCarousel$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/AutoCarousel.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function AutoCarousel({ deals = [] }) {
    _s();
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [itemsPerView, setItemsPerView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(3);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutoCarousel.useEffect": ()=>{
            const handleResize = {
                "AutoCarousel.useEffect.handleResize": ()=>{
                    if (window.innerWidth <= 768) {
                        setItemsPerView(1);
                    } else if (window.innerWidth <= 1024) {
                        setItemsPerView(2);
                    } else {
                        setItemsPerView(3);
                    }
                }
            }["AutoCarousel.useEffect.handleResize"];
            handleResize();
            window.addEventListener('resize', handleResize);
            return ({
                "AutoCarousel.useEffect": ()=>window.removeEventListener('resize', handleResize)
            })["AutoCarousel.useEffect"];
        }
    }["AutoCarousel.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutoCarousel.useEffect": ()=>{
            if (deals.length <= itemsPerView) return;
            const interval = setInterval({
                "AutoCarousel.useEffect.interval": ()=>{
                    setCurrentIndex({
                        "AutoCarousel.useEffect.interval": (prev)=>{
                            const step = 1;
                            const maxIndex = deals.length - itemsPerView;
                            if (prev >= maxIndex) return 0;
                            return prev + step;
                        }
                    }["AutoCarousel.useEffect.interval"]);
                }
            }["AutoCarousel.useEffect.interval"], 4000);
            return ({
                "AutoCarousel.useEffect": ()=>clearInterval(interval)
            })["AutoCarousel.useEffect"];
        }
    }["AutoCarousel.useEffect"], [
        deals.length,
        itemsPerView
    ]);
    if (deals.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                textAlign: 'center',
                padding: '40px 16px',
                color: '#64748b'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontSize: '1.05rem',
                    margin: 0
                },
                children: "Special best deals will be featured here soon!"
            }, void 0, false, {
                fileName: "[project]/components/AutoCarousel.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/AutoCarousel.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoCarousel$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].carouselWrapper,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoCarousel$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].carouselTrack,
                style: {
                    width: `${deals.length / itemsPerView * 100}%`,
                    transform: `translateX(-${currentIndex / deals.length * 100}%)`
                },
                children: deals.map((deal)=>{
                    const safeImage = deal.image && (deal.image.startsWith('http') || deal.image.startsWith('/')) ? deal.image : '/hero-bg.jpg';
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoCarousel$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].carouselItem,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoCarousel$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].offerCard,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: safeImage,
                                    alt: deal.title,
                                    fill: true,
                                    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoCarousel$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].offerImage,
                                    unoptimized: Boolean(safeImage && (safeImage.startsWith('/api/images') || safeImage.startsWith('data:')))
                                }, void 0, false, {
                                    fileName: "[project]/components/AutoCarousel.tsx",
                                    lineNumber: 77,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoCarousel$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].offerOverlay,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoCarousel$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].offerTitle,
                                            children: deal.title
                                        }, void 0, false, {
                                            fileName: "[project]/components/AutoCarousel.tsx",
                                            lineNumber: 86,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/packages/${deal.id}`,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoCarousel$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bookNowBtn,
                                            children: "Book Now"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AutoCarousel.tsx",
                                            lineNumber: 87,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AutoCarousel.tsx",
                                    lineNumber: 85,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AutoCarousel.tsx",
                            lineNumber: 76,
                            columnNumber: 15
                        }, this)
                    }, deal.id, false, {
                        fileName: "[project]/components/AutoCarousel.tsx",
                        lineNumber: 75,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/AutoCarousel.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            deals.length > itemsPerView && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoCarousel$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dots,
                children: Array.from({
                    length: Math.ceil(deals.length / itemsPerView)
                }).map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoCarousel$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].dot} ${currentIndex === idx * itemsPerView ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AutoCarousel$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].activeDot : ''}`,
                        onClick: ()=>setCurrentIndex(idx * itemsPerView)
                    }, idx, false, {
                        fileName: "[project]/components/AutoCarousel.tsx",
                        lineNumber: 100,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/AutoCarousel.tsx",
                lineNumber: 98,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AutoCarousel.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_s(AutoCarousel, "2NkSw/PC1hXsNMoJAUXSrwEJhSg=");
_c = AutoCarousel;
var _c;
__turbopack_context__.k.register(_c, "AutoCarousel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/DestinationTickets.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "activeTab": "DestinationTickets-module__m-sDWW__activeTab",
  "container": "DestinationTickets-module__m-sDWW__container",
  "grid": "DestinationTickets-module__m-sDWW__grid",
  "tab": "DestinationTickets-module__m-sDWW__tab",
  "tabsContainer": "DestinationTickets-module__m-sDWW__tabsContainer",
  "viewMoreBtn": "DestinationTickets-module__m-sDWW__viewMoreBtn",
  "viewMoreContainer": "DestinationTickets-module__m-sDWW__viewMoreContainer",
});
}),
"[project]/components/DestinationTickets.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DestinationTickets
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PackageCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DestinationTickets$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/DestinationTickets.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function DestinationTickets({ destinations = [], tickets = [] }) {
    _s();
    const [activeDestination, setActiveDestination] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(destinations[0] || 'Dubai');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DestinationTickets.useEffect": ()=>{
            if (destinations.length > 0 && (!activeDestination || !destinations.includes(activeDestination))) {
                setActiveDestination(destinations[0]);
            }
        }
    }["DestinationTickets.useEffect"], [
        destinations,
        activeDestination
    ]);
    const filteredTickets = tickets.filter((t)=>t.destination && t.destination.toLowerCase() === (activeDestination || '').toLowerCase());
    if (destinations.length === 0) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DestinationTickets$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DestinationTickets$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tabsContainer,
                children: destinations.map((dest)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DestinationTickets$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tab} ${activeDestination === dest ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DestinationTickets$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].activeTab : ''}`,
                        onClick: ()=>setActiveDestination(dest),
                        children: dest
                    }, dest, false, {
                        fileName: "[project]/components/DestinationTickets.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/DestinationTickets.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            filteredTickets.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DestinationTickets$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].grid,
                children: filteredTickets.map((ticket)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        ...ticket
                    }, ticket.id, false, {
                        fileName: "[project]/components/DestinationTickets.tsx",
                        lineNumber: 58,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/DestinationTickets.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'center',
                    padding: '48px 16px',
                    color: '#64748b'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: '1.1rem',
                            margin: 0
                        },
                        children: [
                            "No packages added for ",
                            activeDestination,
                            " yet."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DestinationTickets.tsx",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: '0.9rem',
                            color: '#94a3b8',
                            marginTop: '6px'
                        },
                        children: "Check back soon or explore our other exciting destinations!"
                    }, void 0, false, {
                        fileName: "[project]/components/DestinationTickets.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DestinationTickets.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, this),
            activeDestination && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DestinationTickets$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].viewMoreContainer,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/destinations/${activeDestination.toLowerCase().replace(/\s+/g, '-')}`,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DestinationTickets$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].viewMoreBtn,
                    children: [
                        "View full activity in ",
                        activeDestination
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DestinationTickets.tsx",
                    lineNumber: 74,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/DestinationTickets.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/DestinationTickets.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(DestinationTickets, "2FqBPMUsCVxO85m7HickuiRI2ss=");
_c = DestinationTickets;
var _c;
__turbopack_context__.k.register(_c, "DestinationTickets");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Hero.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "activeBg": "Hero-module__Z8hQ_W__activeBg",
  "animatedText": "Hero-module__Z8hQ_W__animatedText",
  "bgImage": "Hero-module__Z8hQ_W__bgImage",
  "hero": "Hero-module__Z8hQ_W__hero",
  "heroContent": "Hero-module__Z8hQ_W__heroContent",
  "overlay": "Hero-module__Z8hQ_W__overlay",
  "searchBar": "Hero-module__Z8hQ_W__searchBar",
  "searchBtn": "Hero-module__Z8hQ_W__searchBtn",
  "searchInput": "Hero-module__Z8hQ_W__searchInput",
  "slideUpFade": "Hero-module__Z8hQ_W__slideUpFade",
  "subtitle": "Hero-module__Z8hQ_W__subtitle",
  "title": "Hero-module__Z8hQ_W__title",
});
}),
"[project]/components/Hero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/HeroSearchBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/Hero.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const DEFAULT_HERO_DESTINATIONS = [
    {
        name: 'Dubai',
        image: '/hero-bg.jpg'
    }
];
function Hero({ destinations: propDestinations }) {
    _s();
    // Format initial destinations from server prop
    const formatDestinations = (list)=>{
        return list.filter((d)=>Boolean(d && (d.title || d.name) && d.image)).map((d)=>({
                name: d.title || d.name || '',
                image: d.image || '/hero-bg.jpg'
            }));
    };
    const [destList, setDestList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Hero.useState": ()=>{
            if (propDestinations && propDestinations.length > 0) {
                const formatted = formatDestinations(propDestinations);
                if (formatted.length > 0) return formatted;
            }
            return DEFAULT_HERO_DESTINATIONS;
        }
    }["Hero.useState"]);
    const [activeIndex, setActiveIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Sync with live database via API on client
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Hero.useEffect": ()=>{
            fetch('/api/destinations').then({
                "Hero.useEffect": (res)=>{
                    if (!res.ok) throw new Error('Failed to fetch destinations');
                    return res.json();
                }
            }["Hero.useEffect"]).then({
                "Hero.useEffect": (data)=>{
                    if (Array.isArray(data) && data.length > 0) {
                        const valid = formatDestinations(data);
                        if (valid.length > 0) {
                            setDestList(valid);
                        }
                    }
                }
            }["Hero.useEffect"]).catch({
                "Hero.useEffect": (err)=>console.error('Error loading destinations for hero:', err)
            }["Hero.useEffect"]);
        }
    }["Hero.useEffect"], []);
    // Auto-cycle through destinations every 5 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Hero.useEffect": ()=>{
            if (destList.length <= 1) return;
            const interval = setInterval({
                "Hero.useEffect.interval": ()=>{
                    setActiveIndex({
                        "Hero.useEffect.interval": (current)=>(current + 1) % destList.length
                    }["Hero.useEffect.interval"]);
                }
            }["Hero.useEffect.interval"], 5000);
            return ({
                "Hero.useEffect": ()=>clearInterval(interval)
            })["Hero.useEffect"];
        }
    }["Hero.useEffect"], [
        destList.length
    ]);
    // Ensure activeIndex is within bounds if destination list size changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Hero.useEffect": ()=>{
            if (activeIndex >= destList.length && destList.length > 0) {
                setActiveIndex(0);
            }
        }
    }["Hero.useEffect"], [
        destList.length,
        activeIndex
    ]);
    const activeBgList = destList.length > 0 ? destList : DEFAULT_HERO_DESTINATIONS;
    const currentDest = activeBgList[activeIndex] || DEFAULT_HERO_DESTINATIONS[0];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hero,
        children: [
            activeBgList.map((dest, idx)=>{
                const bgUrl = dest.image.startsWith('http') || dest.image.startsWith('data:') ? dest.image : encodeURI(dest.image);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bgImage} ${idx === activeIndex ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].activeBg : ''}`,
                    style: {
                        backgroundImage: `url("${bgUrl}")`
                    }
                }, `${dest.name}-${idx}`, false, {
                    fileName: "[project]/components/Hero.tsx",
                    lineNumber: 91,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].overlay
            }, void 0, false, {
                fileName: "[project]/components/Hero.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].heroContent,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                            children: [
                                "Travel that shapes you in ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/components/Hero.tsx",
                                    lineNumber: 103,
                                    columnNumber: 39
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].animatedText,
                                    children: currentDest.name
                                }, currentDest.name, false, {
                                    fileName: "[project]/components/Hero.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Hero.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].subtitle,
                            children: "Book activities, tours and experiences"
                        }, void 0, false, {
                            fileName: "[project]/components/Hero.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            placeholder: `Search for destinations in ${currentDest.name}...`,
                            align: "center"
                        }, void 0, false, {
                            fileName: "[project]/components/Hero.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Hero.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Hero.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Hero.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s(Hero, "4ZO5pTzMVHkaphfhIYSdyPKM40w=");
_c = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/HeroSearchBar.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "clearBtn": "HeroSearchBar-module__F6lXJa__clearBtn",
  "destIconBubble": "HeroSearchBar-module__F6lXJa__destIconBubble",
  "dropIn": "HeroSearchBar-module__F6lXJa__dropIn",
  "footerSearchText": "HeroSearchBar-module__F6lXJa__footerSearchText",
  "noSuggestions": "HeroSearchBar-module__F6lXJa__noSuggestions",
  "packageThumb": "HeroSearchBar-module__F6lXJa__packageThumb",
  "searchBar": "HeroSearchBar-module__F6lXJa__searchBar",
  "searchBtn": "HeroSearchBar-module__F6lXJa__searchBtn",
  "searchInput": "HeroSearchBar-module__F6lXJa__searchInput",
  "searchWrapper": "HeroSearchBar-module__F6lXJa__searchWrapper",
  "searchWrapperCenter": "HeroSearchBar-module__F6lXJa__searchWrapperCenter",
  "searchWrapperLeft": "HeroSearchBar-module__F6lXJa__searchWrapperLeft",
  "suggestionArrow": "HeroSearchBar-module__F6lXJa__suggestionArrow",
  "suggestionFooter": "HeroSearchBar-module__F6lXJa__suggestionFooter",
  "suggestionItem": "HeroSearchBar-module__F6lXJa__suggestionItem",
  "suggestionSub": "HeroSearchBar-module__F6lXJa__suggestionSub",
  "suggestionTextWrapper": "HeroSearchBar-module__F6lXJa__suggestionTextWrapper",
  "suggestionTitle": "HeroSearchBar-module__F6lXJa__suggestionTitle",
  "suggestionsDropdown": "HeroSearchBar-module__F6lXJa__suggestionsDropdown",
  "suggestionsGroup": "HeroSearchBar-module__F6lXJa__suggestionsGroup",
  "suggestionsGroupTitle": "HeroSearchBar-module__F6lXJa__suggestionsGroupTitle",
});
}),
"[project]/components/HeroSearchBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroSearchBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/HeroSearchBar.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function HeroSearchBar({ placeholder = 'Search destinations, tours, activities...', defaultLocation, align = 'left' }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSuggestionsOpen, setIsSuggestionsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [destinations, setDestinations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [packages, setPackages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroSearchBar.useEffect": ()=>{
            fetch('/api/destinations').then({
                "HeroSearchBar.useEffect": (r)=>r.json()
            }["HeroSearchBar.useEffect"]).then({
                "HeroSearchBar.useEffect": (d)=>{
                    if (Array.isArray(d)) setDestinations(d);
                }
            }["HeroSearchBar.useEffect"]).catch({
                "HeroSearchBar.useEffect": ()=>{}
            }["HeroSearchBar.useEffect"]);
            fetch('/api/packages').then({
                "HeroSearchBar.useEffect": (r)=>r.json()
            }["HeroSearchBar.useEffect"]).then({
                "HeroSearchBar.useEffect": (d)=>{
                    if (Array.isArray(d)) setPackages(d);
                }
            }["HeroSearchBar.useEffect"]).catch({
                "HeroSearchBar.useEffect": ()=>{}
            }["HeroSearchBar.useEffect"]);
        }
    }["HeroSearchBar.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroSearchBar.useEffect": ()=>{
            const handleClickOutside = {
                "HeroSearchBar.useEffect.handleClickOutside": (e)=>{
                    if (containerRef.current && !containerRef.current.contains(e.target)) {
                        setIsSuggestionsOpen(false);
                    }
                }
            }["HeroSearchBar.useEffect.handleClickOutside"];
            document.addEventListener('click', handleClickOutside);
            return ({
                "HeroSearchBar.useEffect": ()=>document.removeEventListener('click', handleClickOutside)
            })["HeroSearchBar.useEffect"];
        }
    }["HeroSearchBar.useEffect"], []);
    const handleSearchSubmit = (e)=>{
        if (e) e.preventDefault();
        const query = searchQuery.trim();
        if (!query) return;
        setIsSuggestionsOpen(false);
        let url = `/activities?search=${encodeURIComponent(query)}`;
        if (defaultLocation) {
            url += `&location=${encodeURIComponent(defaultLocation)}`;
        }
        router.push(url);
    };
    const handleSelectPackage = (pkgId)=>{
        setIsSuggestionsOpen(false);
        router.push(`/packages/${pkgId}`);
    };
    const handleSelectDestination = (slug)=>{
        setIsSuggestionsOpen(false);
        router.push(`/destinations/${slug}`);
    };
    const formatTitle = (text)=>{
        if (!text) return '';
        return text.split(' ').map((w)=>w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    };
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const matchingDestinations = trimmedQuery.length > 0 ? destinations.filter((dest)=>{
        const title = (dest.title || dest.name || dest.id || '').toLowerCase();
        return title.includes(trimmedQuery);
    }).slice(0, 3) : [];
    const matchingPackages = trimmedQuery.length > 0 ? packages.filter((pkg)=>{
        const title = (pkg.title || '').toLowerCase();
        const dest = (pkg.destination || '').toLowerCase();
        return title.includes(trimmedQuery) || dest.includes(trimmedQuery);
    }).slice(0, 5) : [];
    const hasSuggestions = matchingDestinations.length > 0 || matchingPackages.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].searchWrapper} ${align === 'center' ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].searchWrapperCenter : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].searchWrapperLeft}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSearchSubmit,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].searchBar,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: searchQuery,
                        onChange: (e)=>{
                            setSearchQuery(e.target.value);
                            setIsSuggestionsOpen(true);
                        },
                        onFocus: ()=>{
                            if (searchQuery.trim().length > 0) {
                                setIsSuggestionsOpen(true);
                            }
                        },
                        placeholder: placeholder,
                        autoComplete: "off",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].searchInput
                    }, void 0, false, {
                        fileName: "[project]/components/HeroSearchBar.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].clearBtn,
                        onClick: ()=>{
                            setSearchQuery('');
                            setIsSuggestionsOpen(false);
                        },
                        "aria-label": "Clear search",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "14",
                            height: "14",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2.5",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "18",
                                    y1: "6",
                                    x2: "6",
                                    y2: "18"
                                }, void 0, false, {
                                    fileName: "[project]/components/HeroSearchBar.tsx",
                                    lineNumber: 130,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "6",
                                    y1: "6",
                                    x2: "18",
                                    y2: "18"
                                }, void 0, false, {
                                    fileName: "[project]/components/HeroSearchBar.tsx",
                                    lineNumber: 131,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/HeroSearchBar.tsx",
                            lineNumber: 129,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/HeroSearchBar.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].searchBtn,
                        "aria-label": "Search",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "20",
                            height: "20",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2.5",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "11",
                                    cy: "11",
                                    r: "8"
                                }, void 0, false, {
                                    fileName: "[project]/components/HeroSearchBar.tsx",
                                    lineNumber: 137,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "21",
                                    y1: "21",
                                    x2: "16.65",
                                    y2: "16.65"
                                }, void 0, false, {
                                    fileName: "[project]/components/HeroSearchBar.tsx",
                                    lineNumber: 138,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/HeroSearchBar.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/HeroSearchBar.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/HeroSearchBar.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            isSuggestionsOpen && trimmedQuery.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionsDropdown,
                children: [
                    hasSuggestions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            matchingDestinations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionsGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionsGroupTitle,
                                        children: "Destinations"
                                    }, void 0, false, {
                                        fileName: "[project]/components/HeroSearchBar.tsx",
                                        lineNumber: 150,
                                        columnNumber: 19
                                    }, this),
                                    matchingDestinations.map((dest)=>{
                                        const title = formatTitle(dest.title || dest.name || dest.id);
                                        const targetSlug = dest.id || encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionItem,
                                            onClick: ()=>handleSelectDestination(targetSlug),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].destIconBubble,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        width: "15",
                                                        height: "15",
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        strokeWidth: "2.5",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/HeroSearchBar.tsx",
                                                                lineNumber: 162,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                cx: "12",
                                                                cy: "10",
                                                                r: "3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/HeroSearchBar.tsx",
                                                                lineNumber: 163,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/HeroSearchBar.tsx",
                                                        lineNumber: 161,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/HeroSearchBar.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionTextWrapper,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionTitle,
                                                            children: title
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/HeroSearchBar.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionSub,
                                                            children: "Explore Destination"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/HeroSearchBar.tsx",
                                                            lineNumber: 168,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/HeroSearchBar.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionArrow,
                                                    children: "→"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/HeroSearchBar.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, dest.id || title, true, {
                                            fileName: "[project]/components/HeroSearchBar.tsx",
                                            lineNumber: 155,
                                            columnNumber: 23
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/HeroSearchBar.tsx",
                                lineNumber: 149,
                                columnNumber: 17
                            }, this),
                            matchingPackages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionsGroup,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionsGroupTitle,
                                        children: "Activities & Packages"
                                    }, void 0, false, {
                                        fileName: "[project]/components/HeroSearchBar.tsx",
                                        lineNumber: 179,
                                        columnNumber: 19
                                    }, this),
                                    matchingPackages.map((pkg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionItem,
                                            onClick: ()=>handleSelectPackage(pkg.id),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: pkg.image || pkg.images && pkg.images[0] || '/hero-bg.jpg',
                                                    alt: pkg.title,
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].packageThumb
                                                }, void 0, false, {
                                                    fileName: "[project]/components/HeroSearchBar.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionTextWrapper,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionTitle,
                                                            children: pkg.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/HeroSearchBar.tsx",
                                                            lineNumber: 192,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionSub,
                                                            children: [
                                                                pkg.destination ? `${pkg.destination} • ` : '',
                                                                pkg.price ? `AED ${pkg.price}` : 'Featured'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/HeroSearchBar.tsx",
                                                            lineNumber: 193,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/HeroSearchBar.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionArrow,
                                                    children: "→"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/HeroSearchBar.tsx",
                                                    lineNumber: 198,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, pkg.id, true, {
                                            fileName: "[project]/components/HeroSearchBar.tsx",
                                            lineNumber: 181,
                                            columnNumber: 21
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/HeroSearchBar.tsx",
                                lineNumber: 178,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/HeroSearchBar.tsx",
                        lineNumber: 147,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].noSuggestions,
                        children: "No direct matches found."
                    }, void 0, false, {
                        fileName: "[project]/components/HeroSearchBar.tsx",
                        lineNumber: 205,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionFooter,
                        onClick: ()=>handleSearchSubmit(),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].footerSearchText,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "15",
                                        height: "15",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2.5",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                cx: "11",
                                                cy: "11",
                                                r: "8"
                                            }, void 0, false, {
                                                fileName: "[project]/components/HeroSearchBar.tsx",
                                                lineNumber: 217,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "21",
                                                y1: "21",
                                                x2: "16.65",
                                                y2: "16.65"
                                            }, void 0, false, {
                                                fileName: "[project]/components/HeroSearchBar.tsx",
                                                lineNumber: 218,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/HeroSearchBar.tsx",
                                        lineNumber: 216,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Search all for “",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: searchQuery
                                            }, void 0, false, {
                                                fileName: "[project]/components/HeroSearchBar.tsx",
                                                lineNumber: 220,
                                                columnNumber: 43
                                            }, this),
                                            "”"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/HeroSearchBar.tsx",
                                        lineNumber: 220,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/HeroSearchBar.tsx",
                                lineNumber: 215,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSearchBar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].suggestionArrow,
                                children: "→"
                            }, void 0, false, {
                                fileName: "[project]/components/HeroSearchBar.tsx",
                                lineNumber: 222,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/HeroSearchBar.tsx",
                        lineNumber: 211,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/HeroSearchBar.tsx",
                lineNumber: 145,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/HeroSearchBar.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_s(HeroSearchBar, "yBF/b4t0lRtDvywBcUKjwXbGld8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = HeroSearchBar;
var _c;
__turbopack_context__.k.register(_c, "HeroSearchBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/PackageCard.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "badge": "PackageCard-module__55bUCG__badge",
  "card": "PackageCard-module__55bUCG__card",
  "content": "PackageCard-module__55bUCG__content",
  "favButton": "PackageCard-module__55bUCG__favButton",
  "favButtonActive": "PackageCard-module__55bUCG__favButtonActive",
  "from": "PackageCard-module__55bUCG__from",
  "heartPulse": "PackageCard-module__55bUCG__heartPulse",
  "image": "PackageCard-module__55bUCG__image",
  "imageWrapper": "PackageCard-module__55bUCG__imageWrapper",
  "originalPrice": "PackageCard-module__55bUCG__originalPrice",
  "price": "PackageCard-module__55bUCG__price",
  "priceBox": "PackageCard-module__55bUCG__priceBox",
  "prices": "PackageCard-module__55bUCG__prices",
  "rating": "PackageCard-module__55bUCG__rating",
  "ratingBox": "PackageCard-module__55bUCG__ratingBox",
  "reviews": "PackageCard-module__55bUCG__reviews",
  "star": "PackageCard-module__55bUCG__star",
  "title": "PackageCard-module__55bUCG__title",
});
}),
"[project]/components/PackageCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PackageCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/PackageCard.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// User ID generator / retriever for persistent customer wishlist
function getUserId() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    let uid = localStorage.getItem('nasmal_uid');
    if (!uid) {
        uid = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('nasmal_uid', uid);
    }
    return uid;
}
// Shared cache across all PackageCards on the page to avoid duplicate requests
let cachedWishlistIds = null;
let pendingFetch = null;
async function loadUserWishlist(uid) {
    if (cachedWishlistIds) return cachedWishlistIds;
    if (pendingFetch) return pendingFetch;
    pendingFetch = fetch(`/api/wishlist?userId=${encodeURIComponent(uid)}`).then((r)=>r.json()).then((data)=>{
        const set = new Set();
        if (Array.isArray(data)) {
            data.forEach((item)=>{
                const id = item.id || item.packageId;
                if (id) set.add(String(id));
            });
        }
        cachedWishlistIds = set;
        return set;
    }).catch(()=>new Set());
    return pendingFetch;
}
function PackageCard({ id, title, image, price, originalPrice, rating, reviewsCount }) {
    _s();
    const [isSaved, setIsSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isUpdating, setIsUpdating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PackageCard.useEffect": ()=>{
            const uid = getUserId();
            loadUserWishlist(uid).then({
                "PackageCard.useEffect": (set)=>{
                    if (set.has(String(id))) {
                        setIsSaved(true);
                    }
                }
            }["PackageCard.useEffect"]);
            const handleWishlistUpdate = {
                "PackageCard.useEffect.handleWishlistUpdate": (e)=>{
                    if (e.detail?.id === id) {
                        setIsSaved(e.detail.isSaved);
                    }
                }
            }["PackageCard.useEffect.handleWishlistUpdate"];
            window.addEventListener('nasmal_wishlist_updated', handleWishlistUpdate);
            return ({
                "PackageCard.useEffect": ()=>window.removeEventListener('nasmal_wishlist_updated', handleWishlistUpdate)
            })["PackageCard.useEffect"];
        }
    }["PackageCard.useEffect"], [
        id
    ]);
    const toggleWishlist = async (e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (isUpdating) return;
        setIsUpdating(true);
        const nextState = !isSaved;
        setIsSaved(nextState);
        // Update shared cache
        if (cachedWishlistIds) {
            if (nextState) cachedWishlistIds.add(String(id));
            else cachedWishlistIds.delete(String(id));
        }
        // Broadcast event to other components
        window.dispatchEvent(new CustomEvent('nasmal_wishlist_updated', {
            detail: {
                id,
                isSaved: nextState
            }
        }));
        const uid = getUserId();
        try {
            if (nextState) {
                await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: uid,
                        packageId: id
                    })
                });
            } else {
                await fetch(`/api/wishlist?userId=${encodeURIComponent(uid)}&packageId=${encodeURIComponent(id)}`, {
                    method: 'DELETE'
                });
            }
        } catch (err) {
            console.error('Failed to update wishlist:', err);
            // Revert if failed
            setIsSaved(!nextState);
        } finally{
            setIsUpdating(false);
        }
    };
    const safeImage = image && (image.startsWith('http') || image.startsWith('/')) ? image : '/hero-bg.jpg';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: `/packages/${id}`,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].card,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageWrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: safeImage,
                        alt: title,
                        fill: true,
                        sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].image,
                        unoptimized: Boolean(safeImage && (safeImage.startsWith('/api/images') || safeImage.startsWith('data:')))
                    }, void 0, false, {
                        fileName: "[project]/components/PackageCard.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].favButton} ${isSaved ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].favButtonActive : ''}`,
                        onClick: toggleWishlist,
                        title: isSaved ? "Remove from Wishlist" : "Save to Wishlist",
                        "aria-label": isSaved ? "Remove from Wishlist" : "Add to Wishlist",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "18",
                            height: "18",
                            viewBox: "0 0 24 24",
                            fill: isSaved ? "#e11d48" : "none",
                            stroke: isSaved ? "#e11d48" : "currentColor",
                            strokeWidth: "2.2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            }, void 0, false, {
                                fileName: "[project]/components/PackageCard.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/PackageCard.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/PackageCard.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/PackageCard.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].content,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/PackageCard.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].ratingBox,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].star,
                                children: "★"
                            }, void 0, false, {
                                fileName: "[project]/components/PackageCard.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].rating,
                                children: rating
                            }, void 0, false, {
                                fileName: "[project]/components/PackageCard.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].reviews,
                                children: [
                                    "(",
                                    reviewsCount,
                                    " Reviews)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PackageCard.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PackageCard.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceBox,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].from,
                                children: "From"
                            }, void 0, false, {
                                fileName: "[project]/components/PackageCard.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].prices,
                                children: [
                                    originalPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].originalPrice,
                                        children: [
                                            "AED ",
                                            originalPrice
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/PackageCard.tsx",
                                        lineNumber: 169,
                                        columnNumber: 31
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PackageCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].price,
                                        children: [
                                            "AED ",
                                            price
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/PackageCard.tsx",
                                        lineNumber: 170,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PackageCard.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PackageCard.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/PackageCard.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/PackageCard.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
_s(PackageCard, "afqebfA8wq7Pbl3KxZ4cHLtzSJo=");
_c = PackageCard;
var _c;
__turbopack_context__.k.register(_c, "PackageCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_1brpscb._.js.map