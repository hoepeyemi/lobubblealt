(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[172],{8477:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/docs",function(){return r(7036)}])},8199:function(e,t){"use strict";var r,o,n,s;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ACTION_FAST_REFRESH:function(){return u},ACTION_NAVIGATE:function(){return a},ACTION_PREFETCH:function(){return f},ACTION_REFRESH:function(){return l},ACTION_RESTORE:function(){return i},ACTION_SERVER_ACTION:function(){return d},ACTION_SERVER_PATCH:function(){return c},PrefetchCacheEntryStatus:function(){return o},PrefetchKind:function(){return r},isThenable:function(){return b}});let l="refresh",a="navigate",i="restore",c="server-patch",f="prefetch",u="fast-refresh",d="server-action";function b(e){return e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof e.then}(n=r||(r={})).AUTO="auto",n.FULL="full",n.TEMPORARY="temporary",(s=o||(o={})).fresh="fresh",s.reusable="reusable",s.expired="expired",s.stale="stale",("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7195:function(e,t,r){"use strict";function o(e,t,r,o){return!1}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getDomainLocale",{enumerable:!0,get:function(){return o}}),r(8337),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8342:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return y}});let o=r(8754),n=r(5893),s=o._(r(7294)),l=r(6075),a=r(3955),i=r(8041),c=r(9903),f=r(5490),u=r(1928),d=r(257),b=r(4229),p=r(7195),x=r(9470),h=r(8199),m=new Set;function j(e,t,r,o,n,s){if(s||(0,a.isLocalURL)(t)){if(!o.bypassPrefetchedCheck){let n=t+"%"+r+"%"+(void 0!==o.locale?o.locale:"locale"in e?e.locale:void 0);if(m.has(n))return;m.add(n)}(async()=>s?e.prefetch(t,n):e.prefetch(t,r,o))().catch(e=>{})}}function g(e){return"string"==typeof e?e:(0,i.formatUrl)(e)}let y=s.default.forwardRef(function(e,t){let r,o;let{href:i,as:m,children:y,prefetch:_=null,passHref:v,replace:N,shallow:k,scroll:w,locale:O,onClick:C,onMouseEnter:E,onTouchStart:T,legacyBehavior:P=!1,...A}=e;r=y,P&&("string"==typeof r||"number"==typeof r)&&(r=(0,n.jsx)("a",{children:r}));let M=s.default.useContext(u.RouterContext),R=s.default.useContext(d.AppRouterContext),S=null!=M?M:R,I=!M,z=!1!==_,L=null===_?h.PrefetchKind.AUTO:h.PrefetchKind.FULL,{href:U,as:D}=s.default.useMemo(()=>{if(!M){let e=g(i);return{href:e,as:m?g(m):e}}let[e,t]=(0,l.resolveHref)(M,i,!0);return{href:e,as:m?(0,l.resolveHref)(M,m):t||e}},[M,i,m]),H=s.default.useRef(U),K=s.default.useRef(D);P&&(o=s.default.Children.only(r));let B=P?o&&"object"==typeof o&&o.ref:t,[F,V,W]=(0,b.useIntersection)({rootMargin:"200px"}),G=s.default.useCallback(e=>{(K.current!==D||H.current!==U)&&(W(),K.current=D,H.current=U),F(e),B&&("function"==typeof B?B(e):"object"==typeof B&&(B.current=e))},[D,B,U,W,F]);s.default.useEffect(()=>{S&&V&&z&&j(S,U,D,{locale:O},{kind:L},I)},[D,U,V,O,z,null==M?void 0:M.locale,S,I,L]);let X={ref:G,onClick(e){P||"function"!=typeof C||C(e),P&&o.props&&"function"==typeof o.props.onClick&&o.props.onClick(e),S&&!e.defaultPrevented&&function(e,t,r,o,n,l,i,c,f){let{nodeName:u}=e.currentTarget;if("A"===u.toUpperCase()&&(function(e){let t=e.currentTarget.getAttribute("target");return t&&"_self"!==t||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!f&&!(0,a.isLocalURL)(r)))return;e.preventDefault();let d=()=>{let e=null==i||i;"beforePopState"in t?t[n?"replace":"push"](r,o,{shallow:l,locale:c,scroll:e}):t[n?"replace":"push"](o||r,{scroll:e})};f?s.default.startTransition(d):d()}(e,S,U,D,N,k,w,O,I)},onMouseEnter(e){P||"function"!=typeof E||E(e),P&&o.props&&"function"==typeof o.props.onMouseEnter&&o.props.onMouseEnter(e),S&&(z||!I)&&j(S,U,D,{locale:O,priority:!0,bypassPrefetchedCheck:!0},{kind:L},I)},onTouchStart:function(e){P||"function"!=typeof T||T(e),P&&o.props&&"function"==typeof o.props.onTouchStart&&o.props.onTouchStart(e),S&&(z||!I)&&j(S,U,D,{locale:O,priority:!0,bypassPrefetchedCheck:!0},{kind:L},I)}};if((0,c.isAbsoluteUrl)(D))X.href=D;else if(!P||v||"a"===o.type&&!("href"in o.props)){let e=void 0!==O?O:null==M?void 0:M.locale,t=(null==M?void 0:M.isLocaleDomain)&&(0,p.getDomainLocale)(D,e,null==M?void 0:M.locales,null==M?void 0:M.domainLocales);X.href=t||(0,x.addBasePath)((0,f.addLocale)(D,e,null==M?void 0:M.defaultLocale))}return P?s.default.cloneElement(o,X):(0,n.jsx)("a",{...A,...X,children:r})});("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4229:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useIntersection",{enumerable:!0,get:function(){return i}});let o=r(7294),n=r(4474),s="function"==typeof IntersectionObserver,l=new Map,a=[];function i(e){let{rootRef:t,rootMargin:r,disabled:i}=e,c=i||!s,[f,u]=(0,o.useState)(!1),d=(0,o.useRef)(null),b=(0,o.useCallback)(e=>{d.current=e},[]);return(0,o.useEffect)(()=>{if(s){if(c||f)return;let e=d.current;if(e&&e.tagName)return function(e,t,r){let{id:o,observer:n,elements:s}=function(e){let t;let r={root:e.root||null,margin:e.rootMargin||""},o=a.find(e=>e.root===r.root&&e.margin===r.margin);if(o&&(t=l.get(o)))return t;let n=new Map;return t={id:r,observer:new IntersectionObserver(e=>{e.forEach(e=>{let t=n.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)})},e),elements:n},a.push(r),l.set(r,t),t}(r);return s.set(e,t),n.observe(e),function(){if(s.delete(e),n.unobserve(e),0===s.size){n.disconnect(),l.delete(o);let e=a.findIndex(e=>e.root===o.root&&e.margin===o.margin);e>-1&&a.splice(e,1)}}}(e,e=>e&&u(e),{root:null==t?void 0:t.current,rootMargin:r})}else if(!f){let e=(0,n.requestIdleCallback)(()=>u(!0));return()=>(0,n.cancelIdleCallback)(e)}},[c,r,t,f,d.current]),[b,f,(0,o.useCallback)(()=>{u(!1)},[])]}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7036:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return i}});var o=r(5893),n=r(645),s=r.n(n);r(7294);var l=r(1664),a=r.n(l);function i(){return(0,o.jsxs)("div",{className:"jsx-5364b2126f85218e container",children:[(0,o.jsxs)("main",{className:"jsx-5364b2126f85218e",children:[(0,o.jsx)("h1",{className:"jsx-5364b2126f85218e",children:"Solana Wallet & Bubblemap Bot Documentation"}),(0,o.jsxs)("div",{className:"jsx-5364b2126f85218e doc-card",children:[(0,o.jsx)("h2",{className:"jsx-5364b2126f85218e",children:"Getting Started"}),(0,o.jsx)("p",{className:"jsx-5364b2126f85218e",children:"The Solana Wallet & Bubblemap Bot offers two main features:"}),(0,o.jsxs)("ul",{className:"jsx-5364b2126f85218e",children:[(0,o.jsx)("li",{className:"jsx-5364b2126f85218e",children:"Generate Solana vanity wallet addresses with custom prefixes"}),(0,o.jsx)("li",{className:"jsx-5364b2126f85218e",children:"Analyze token distributions across multiple blockchains"})]}),(0,o.jsx)("h3",{className:"jsx-5364b2126f85218e",children:"How to Use"}),(0,o.jsxs)("p",{className:"jsx-5364b2126f85218e",children:["1. Open the bot in Telegram by clicking ",(0,o.jsx)("a",{href:"https://t.me/your_bot_username",target:"_blank",rel:"noopener noreferrer",className:"jsx-5364b2126f85218e",children:"here"}),".",(0,o.jsx)("br",{className:"jsx-5364b2126f85218e"}),"2. Start with the /register command to create your wallet.",(0,o.jsx)("br",{className:"jsx-5364b2126f85218e"}),"3. Once registered, use /bubblemap to analyze any token."]}),(0,o.jsx)("h3",{className:"jsx-5364b2126f85218e",children:"Available Commands"}),(0,o.jsxs)("ul",{className:"jsx-5364b2126f85218e command-list",children:[(0,o.jsxs)("li",{className:"jsx-5364b2126f85218e",children:[(0,o.jsx)("code",{className:"jsx-5364b2126f85218e",children:"/start"})," - Initialize the bot"]}),(0,o.jsxs)("li",{className:"jsx-5364b2126f85218e",children:[(0,o.jsx)("code",{className:"jsx-5364b2126f85218e",children:"/register"})," - Create a new Solana wallet"]}),(0,o.jsxs)("li",{className:"jsx-5364b2126f85218e",children:[(0,o.jsx)("code",{className:"jsx-5364b2126f85218e",children:"/wallet"})," - View your wallet details"]}),(0,o.jsxs)("li",{className:"jsx-5364b2126f85218e",children:[(0,o.jsx)("code",{className:"jsx-5364b2126f85218e",children:"/bubblemap"})," - Analyze token distribution"]}),(0,o.jsxs)("li",{className:"jsx-5364b2126f85218e",children:[(0,o.jsx)("code",{className:"jsx-5364b2126f85218e",children:"/help"})," - Show available commands"]})]}),(0,o.jsx)("h3",{className:"jsx-5364b2126f85218e",children:"Demo Video"}),(0,o.jsx)("p",{className:"jsx-5364b2126f85218e",children:"Watch our demo video to see the bot in action:"}),(0,o.jsx)("a",{href:"https://drive.google.com/drive/folders/1j74KjxCiLj34nQu2TDQPXz5hBrfAlHDN?usp=sharing",target:"_blank",rel:"noopener noreferrer",className:"jsx-5364b2126f85218e button",children:"Watch Demo"})]})]}),(0,o.jsx)("footer",{className:"jsx-5364b2126f85218e",children:(0,o.jsx)(a(),{href:"/",children:"Back to Home"})}),(0,o.jsx)(s(),{id:"5364b2126f85218e",children:"h1.jsx-5364b2126f85218e{margin:0 0 2rem 0;font-size:2.5rem;text-align:center;color:#0070f3}.doc-card.jsx-5364b2126f85218e{margin:1rem;padding:1.5rem;text-align:left;color:inherit;text-decoration:none;border:1px solid#eaeaea;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;-webkit-transition:color.15s ease,border-color.15s ease;-moz-transition:color.15s ease,border-color.15s ease;-o-transition:color.15s ease,border-color.15s ease;transition:color.15s ease,border-color.15s ease;width:100%;background-color:white;-webkit-box-shadow:0 4px 6px rgba(0,0,0,.1);-moz-box-shadow:0 4px 6px rgba(0,0,0,.1);box-shadow:0 4px 6px rgba(0,0,0,.1)}h2.jsx-5364b2126f85218e{margin:0 0 1rem 0;font-size:1.8rem;color:#0070f3}h3.jsx-5364b2126f85218e{margin:1.5rem 0 .5rem 0;font-size:1.3rem;color:#333}.command-list.jsx-5364b2126f85218e{background-color:#f5f5f5;padding:1rem 2rem;-webkit-border-radius:8px;-moz-border-radius:8px;border-radius:8px}.command-list.jsx-5364b2126f85218e li.jsx-5364b2126f85218e{margin:.7rem 0}code.jsx-5364b2126f85218e{background-color:#e2e2e2;padding:.2rem .4rem;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;font-family:monospace}.button.jsx-5364b2126f85218e{display:inline-block;background-color:#0070f3;color:white;padding:.75rem 1.5rem;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px;font-weight:600;margin-top:1rem}.button.jsx-5364b2126f85218e:hover{background-color:#0051cc}footer.jsx-5364b2126f85218e{margin-top:2rem}footer.jsx-5364b2126f85218e a.jsx-5364b2126f85218e{color:#0070f3;text-decoration:underline}@media(prefers-color-scheme:dark){.doc-card.jsx-5364b2126f85218e{background-color:#1e1e1e;border-color:#333}h2.jsx-5364b2126f85218e{color:#3694ff}h3.jsx-5364b2126f85218e{color:#e0e0e0}.command-list.jsx-5364b2126f85218e{background-color:#2d2d2d}code.jsx-5364b2126f85218e{background-color:#3d3d3d}}"})]})}},1664:function(e,t,r){e.exports=r(8342)}},function(e){e.O(0,[645,888,774,179],function(){return e(e.s=8477)}),_N_E=e.O()}]);