(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const _ of l.addedNodes)_.tagName==="LINK"&&_.rel==="modulepreload"&&o(_)}).observe(document,{childList:!0,subtree:!0});function n(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerPolicy&&(l.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?l.credentials="include":r.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(r){if(r.ep)return;r.ep=!0;const l=n(r);fetch(r.href,l)}})();var Q,m,ze,A,ye,je,_e,Ve,he,se,ae,J={},Ge=[],it=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,oe=Array.isArray;function L(e,t){for(var n in t)e[n]=t[n];return e}function me(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function ue(e,t,n){var o,r,l,_={};for(l in t)l=="key"?o=t[l]:l=="ref"?r=t[l]:_[l]=t[l];if(arguments.length>2&&(_.children=arguments.length>3?Q.call(arguments,2):n),typeof e=="function"&&e.defaultProps!=null)for(l in e.defaultProps)_[l]===void 0&&(_[l]=e.defaultProps[l]);return G(e,_,o,r,null)}function G(e,t,n,o,r){var l={type:e,props:t,key:n,ref:o,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:r??++ze,__i:-1,__u:0};return r==null&&m.vnode!=null&&m.vnode(l),l}function H(e){return e.children}function O(e,t){this.props=e,this.context=t}function j(e,t){if(t==null)return e.__?j(e.__,e.__i+1):null;for(var n;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null)return n.__e;return typeof e.type=="function"?j(e):null}function Je(e){var t,n;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null){e.__e=e.__c.base=n.__e;break}return Je(e)}}function we(e){(!e.__d&&(e.__d=!0)&&A.push(e)&&!ne.__r++||ye!==m.debounceRendering)&&((ye=m.debounceRendering)||je)(ne)}function ne(){var e,t,n,o,r,l,_,s;for(A.sort(_e);e=A.shift();)e.__d&&(t=A.length,o=void 0,l=(r=(n=e).__v).__e,_=[],s=[],n.__P&&((o=L({},r)).__v=r.__v+1,m.vnode&&m.vnode(o),ve(n.__P,o,r,n.__n,n.__P.namespaceURI,32&r.__u?[l]:null,_,l??j(r),!!(32&r.__u),s),o.__v=r.__v,o.__.__k[o.__i]=o,Ze(_,o,s),o.__e!=l&&Je(o)),A.length>t&&A.sort(_e));ne.__r=0}function Ke(e,t,n,o,r,l,_,s,a,u,f){var i,h,d,y,S,k,g=o&&o.__k||Ge,b=t.length;for(a=_t(n,t,g,a,b),i=0;i<b;i++)(d=n.__k[i])!=null&&(h=d.__i===-1?J:g[d.__i]||J,d.__i=i,k=ve(e,d,h,r,l,_,s,a,u,f),y=d.__e,d.ref&&h.ref!=d.ref&&(h.ref&&ge(h.ref,null,d),f.push(d.ref,d.__c||y,d)),S==null&&y!=null&&(S=y),4&d.__u||h.__k===d.__k?a=Ye(d,a,e):typeof d.type=="function"&&k!==void 0?a=k:y&&(a=y.nextSibling),d.__u&=-7);return n.__e=S,a}function _t(e,t,n,o,r){var l,_,s,a,u,f=n.length,i=f,h=0;for(e.__k=new Array(r),l=0;l<r;l++)(_=t[l])!=null&&typeof _!="boolean"&&typeof _!="function"?(a=l+h,(_=e.__k[l]=typeof _=="string"||typeof _=="number"||typeof _=="bigint"||_.constructor==String?G(null,_,null,null,null):oe(_)?G(H,{children:_},null,null,null):_.constructor===void 0&&_.__b>0?G(_.type,_.props,_.key,_.ref?_.ref:null,_.__v):_).__=e,_.__b=e.__b+1,s=null,(u=_.__i=st(_,n,a,i))!==-1&&(i--,(s=n[u])&&(s.__u|=2)),s==null||s.__v===null?(u==-1&&h--,typeof _.type!="function"&&(_.__u|=4)):u!=a&&(u==a-1?h--:u==a+1?h++:(u>a?h--:h++,_.__u|=4))):e.__k[l]=null;if(i)for(l=0;l<f;l++)(s=n[l])!=null&&!(2&s.__u)&&(s.__e==o&&(o=j(s)),Qe(s,s));return o}function Ye(e,t,n){var o,r;if(typeof e.type=="function"){for(o=e.__k,r=0;o&&r<o.length;r++)o[r]&&(o[r].__=e,t=Ye(o[r],t,n));return t}e.__e!=t&&(t&&e.type&&!n.contains(t)&&(t=j(e)),n.insertBefore(e.__e,t||null),t=e.__e);do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function re(e,t){return t=t||[],e==null||typeof e=="boolean"||(oe(e)?e.some(function(n){re(n,t)}):t.push(e)),t}function st(e,t,n,o){var r,l,_=e.key,s=e.type,a=t[n];if(a===null||a&&_==a.key&&s===a.type&&!(2&a.__u))return n;if(o>(a!=null&&!(2&a.__u)?1:0))for(r=n-1,l=n+1;r>=0||l<t.length;){if(r>=0){if((a=t[r])&&!(2&a.__u)&&_==a.key&&s===a.type)return r;r--}if(l<t.length){if((a=t[l])&&!(2&a.__u)&&_==a.key&&s===a.type)return l;l++}}return-1}function ke(e,t,n){t[0]=="-"?e.setProperty(t,n??""):e[t]=n==null?"":typeof n!="number"||it.test(t)?n:n+"px"}function X(e,t,n,o,r){var l;e:if(t=="style")if(typeof n=="string")e.style.cssText=n;else{if(typeof o=="string"&&(e.style.cssText=o=""),o)for(t in o)n&&t in n||ke(e.style,t,"");if(n)for(t in n)o&&n[t]===o[t]||ke(e.style,t,n[t])}else if(t[0]=="o"&&t[1]=="n")l=t!=(t=t.replace(Ve,"$1")),t=t.toLowerCase()in e||t=="onFocusOut"||t=="onFocusIn"?t.toLowerCase().slice(2):t.slice(2),e.l||(e.l={}),e.l[t+l]=n,n?o?n.u=o.u:(n.u=he,e.addEventListener(t,l?ae:se,l)):e.removeEventListener(t,l?ae:se,l);else{if(r=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=n??"";break e}catch{}typeof n=="function"||(n==null||n===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&n==1?"":n))}}function Ne(e){return function(t){if(this.l){var n=this.l[t.type+e];if(t.t==null)t.t=he++;else if(t.t<n.u)return;return n(m.event?m.event(t):t)}}}function ve(e,t,n,o,r,l,_,s,a,u){var f,i,h,d,y,S,k,g,b,U,P,B,v,I,T,F,q,$=t.type;if(t.constructor!==void 0)return null;128&n.__u&&(a=!!(32&n.__u),l=[s=t.__e=n.__e]),(f=m.__b)&&f(t);e:if(typeof $=="function")try{if(g=t.props,b="prototype"in $&&$.prototype.render,U=(f=$.contextType)&&o[f.__c],P=f?U?U.props.value:f.__:o,n.__c?k=(i=t.__c=n.__c).__=i.__E:(b?t.__c=i=new $(g,P):(t.__c=i=new O(g,P),i.constructor=$,i.render=ut),U&&U.sub(i),i.props=g,i.state||(i.state={}),i.context=P,i.__n=o,h=i.__d=!0,i.__h=[],i._sb=[]),b&&i.__s==null&&(i.__s=i.state),b&&$.getDerivedStateFromProps!=null&&(i.__s==i.state&&(i.__s=L({},i.__s)),L(i.__s,$.getDerivedStateFromProps(g,i.__s))),d=i.props,y=i.state,i.__v=t,h)b&&$.getDerivedStateFromProps==null&&i.componentWillMount!=null&&i.componentWillMount(),b&&i.componentDidMount!=null&&i.__h.push(i.componentDidMount);else{if(b&&$.getDerivedStateFromProps==null&&g!==d&&i.componentWillReceiveProps!=null&&i.componentWillReceiveProps(g,P),!i.__e&&(i.shouldComponentUpdate!=null&&i.shouldComponentUpdate(g,i.__s,P)===!1||t.__v==n.__v)){for(t.__v!=n.__v&&(i.props=g,i.state=i.__s,i.__d=!1),t.__e=n.__e,t.__k=n.__k,t.__k.some(function(M){M&&(M.__=t)}),B=0;B<i._sb.length;B++)i.__h.push(i._sb[B]);i._sb=[],i.__h.length&&_.push(i);break e}i.componentWillUpdate!=null&&i.componentWillUpdate(g,i.__s,P),b&&i.componentDidUpdate!=null&&i.__h.push(function(){i.componentDidUpdate(d,y,S)})}if(i.context=P,i.props=g,i.__P=e,i.__e=!1,v=m.__r,I=0,b){for(i.state=i.__s,i.__d=!1,v&&v(t),f=i.render(i.props,i.state,i.context),T=0;T<i._sb.length;T++)i.__h.push(i._sb[T]);i._sb=[]}else do i.__d=!1,v&&v(t),f=i.render(i.props,i.state,i.context),i.state=i.__s;while(i.__d&&++I<25);i.state=i.__s,i.getChildContext!=null&&(o=L(L({},o),i.getChildContext())),b&&!h&&i.getSnapshotBeforeUpdate!=null&&(S=i.getSnapshotBeforeUpdate(d,y)),s=Ke(e,oe(F=f!=null&&f.type===H&&f.key==null?f.props.children:f)?F:[F],t,n,o,r,l,_,s,a,u),i.base=t.__e,t.__u&=-161,i.__h.length&&_.push(i),k&&(i.__E=i.__=null)}catch(M){if(t.__v=null,a||l!=null)if(M.then){for(t.__u|=a?160:128;s&&s.nodeType==8&&s.nextSibling;)s=s.nextSibling;l[l.indexOf(s)]=null,t.__e=s}else for(q=l.length;q--;)me(l[q]);else t.__e=n.__e,t.__k=n.__k;m.__e(M,t,n)}else l==null&&t.__v==n.__v?(t.__k=n.__k,t.__e=n.__e):s=t.__e=at(n.__e,t,n,o,r,l,_,a,u);return(f=m.diffed)&&f(t),128&t.__u?void 0:s}function Ze(e,t,n){for(var o=0;o<n.length;o++)ge(n[o],n[++o],n[++o]);m.__c&&m.__c(t,e),e.some(function(r){try{e=r.__h,r.__h=[],e.some(function(l){l.call(r)})}catch(l){m.__e(l,r.__v)}})}function at(e,t,n,o,r,l,_,s,a){var u,f,i,h,d,y,S,k=n.props,g=t.props,b=t.type;if(b=="svg"?r="http://www.w3.org/2000/svg":b=="math"?r="http://www.w3.org/1998/Math/MathML":r||(r="http://www.w3.org/1999/xhtml"),l!=null){for(u=0;u<l.length;u++)if((d=l[u])&&"setAttribute"in d==!!b&&(b?d.localName==b:d.nodeType==3)){e=d,l[u]=null;break}}if(e==null){if(b==null)return document.createTextNode(g);e=document.createElementNS(r,b,g.is&&g),s&&(m.__m&&m.__m(t,l),s=!1),l=null}if(b===null)k===g||s&&e.data===g||(e.data=g);else{if(l=l&&Q.call(e.childNodes),k=n.props||J,!s&&l!=null)for(k={},u=0;u<e.attributes.length;u++)k[(d=e.attributes[u]).name]=d.value;for(u in k)if(d=k[u],u!="children"){if(u=="dangerouslySetInnerHTML")i=d;else if(!(u in g)){if(u=="value"&&"defaultValue"in g||u=="checked"&&"defaultChecked"in g)continue;X(e,u,null,d,r)}}for(u in g)d=g[u],u=="children"?h=d:u=="dangerouslySetInnerHTML"?f=d:u=="value"?y=d:u=="checked"?S=d:s&&typeof d!="function"||k[u]===d||X(e,u,d,k[u],r);if(f)s||i&&(f.__html===i.__html||f.__html===e.innerHTML)||(e.innerHTML=f.__html),t.__k=[];else if(i&&(e.innerHTML=""),Ke(e,oe(h)?h:[h],t,n,o,b=="foreignObject"?"http://www.w3.org/1999/xhtml":r,l,_,l?l[0]:n.__k&&j(n,0),s,a),l!=null)for(u=l.length;u--;)me(l[u]);s||(u="value",b=="progress"&&y==null?e.removeAttribute("value"):y!==void 0&&(y!==e[u]||b=="progress"&&!y||b=="option"&&y!==k[u])&&X(e,u,y,k[u],r),u="checked",S!==void 0&&S!==e[u]&&X(e,u,S,k[u],r))}return e}function ge(e,t,n){try{if(typeof e=="function"){var o=typeof e.__u=="function";o&&e.__u(),o&&t==null||(e.__u=e(t))}else e.current=t}catch(r){m.__e(r,n)}}function Qe(e,t,n){var o,r;if(m.unmount&&m.unmount(e),(o=e.ref)&&(o.current&&o.current!==e.__e||ge(o,null,t)),(o=e.__c)!=null){if(o.componentWillUnmount)try{o.componentWillUnmount()}catch(l){m.__e(l,t)}o.base=o.__P=null}if(o=e.__k)for(r=0;r<o.length;r++)o[r]&&Qe(o[r],t,n||typeof e.type!="function");n||me(e.__e),e.__c=e.__=e.__e=void 0}function ut(e,t,n){return this.constructor(e,n)}function dt(e,t,n){var o,r,l,_;t==document&&(t=document.documentElement),m.__&&m.__(e,t),r=(o=!1)?null:t.__k,l=[],_=[],ve(t,e=t.__k=ue(H,null,[e]),r||J,J,t.namespaceURI,r?null:t.firstChild?Q.call(t.childNodes):null,l,r?r.__e:t.firstChild,o,_),Ze(l,e,_)}function ft(e,t,n){var o,r,l,_,s=L({},e.props);for(l in e.type&&e.type.defaultProps&&(_=e.type.defaultProps),t)l=="key"?o=t[l]:l=="ref"?r=t[l]:s[l]=t[l]===void 0&&_!==void 0?_[l]:t[l];return arguments.length>2&&(s.children=arguments.length>3?Q.call(arguments,2):n),G(e.type,s,o||e.key,r||e.ref,null)}Q=Ge.slice,m={__e:function(e,t,n,o){for(var r,l,_;t=t.__;)if((r=t.__c)&&!r.__)try{if((l=r.constructor)&&l.getDerivedStateFromError!=null&&(r.setState(l.getDerivedStateFromError(e)),_=r.__d),r.componentDidCatch!=null&&(r.componentDidCatch(e,o||{}),_=r.__d),_)return r.__E=r}catch(s){e=s}throw e}},ze=0,O.prototype.setState=function(e,t){var n;n=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=L({},this.state),typeof e=="function"&&(e=e(L({},n),this.props)),e&&L(n,e),e!=null&&this.__v&&(t&&this._sb.push(t),we(this))},O.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),we(this))},O.prototype.render=H,A=[],je=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,_e=function(e,t){return e.__v.__b-t.__v.__b},ne.__r=0,Ve=/(PointerCapture)$|Capture$/i,he=0,se=Ne(!1),ae=Ne(!0);var pt=0;function c(e,t,n,o,r,l){t||(t={});var _,s,a=t;if("ref"in a)for(s in a={},t)s=="ref"?_=t[s]:a[s]=t[s];var u={type:e,props:a,key:n,ref:_,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--pt,__i:-1,__u:0,__source:r,__self:l};if(typeof e=="function"&&(_=e.defaultProps))for(s in _)a[s]===void 0&&(a[s]=_[s]);return m.vnode&&m.vnode(u),u}const ht={acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv"},mt=typeof window<"u";let z=[];function Xe(e){return e.map(t=>t.children).filter(t=>!!t).reduce((t,n)=>t.concat(n),[]).reverse().filter(yt()).reverse().map(t=>{const n=(t.className?t.className+" ":"")+"preact-head";return ft(t,{className:n})})}function vt(e){const t={};e.forEach(o=>{const r=t[o.nodeName]||[];r.push(o),t[o.nodeName]=r}),wt(t.title?t.title[0]:null),["meta","base","link","style","script"].forEach(o=>{gt(o,t[o]||[])})}function gt(e,t){const n=document.getElementsByTagName("head")[0],o=Array.prototype.slice.call(n.querySelectorAll(e+".preact-head")),r=t.map(bt).filter(l=>{for(let _=0,s=o.length;_<s;_++)if(o[_].isEqualNode(l))return o.splice(_,1),!1;return!0});o.forEach(l=>l.parentNode.removeChild(l)),r.forEach(l=>n.appendChild(l))}function bt(e){const t=document.createElement(e.nodeName),n=e.attributes||{},o=e.children;for(const r in n){if(!n.hasOwnProperty(r)||r==="dangerouslySetInnerHTML")continue;const l=ht[r]||r.toLowerCase();t.setAttribute(l,n[r])}return n.dangerouslySetInnerHTML?t.innerHTML=n.dangerouslySetInnerHTML.__html||"":o&&(t.textContent=typeof o=="string"?o:o.join("")),t}const Ce=["name","httpEquiv","charSet","itemProp"];function yt(){const e=[],t=[],n={};return o=>{switch(o.nodeName){case"title":case"base":if(~e.indexOf(o.nodeName))return!1;e.push(o.nodeName);break;case"meta":for(let r=0,l=Ce.length;r<l;r++){const _=Ce[r];if(o.attributes.hasOwnProperty(_))if(_==="charSet"){if(~t.indexOf(_))return!1;t.push(_)}else{const s=o.attributes[_],a=n[_]||[];if(~a.indexOf(s))return!1;a.push(s),n[_]=a}}break}return!0}}function wt(e){let t;if(e){const{children:n}=e;t=typeof n=="string"?n:n.join("")}else t="";t!==document.title&&(document.title=t)}function le(){const e=Xe(z.map(t=>t.props));mt&&vt(e)}class kt extends O{static rewind(){const t=Xe(z.map(n=>n.props));return z=[],t}componentDidUpdate(){le()}componentWillMount(){z.push(this),le()}componentWillUnmount(){const t=z.indexOf(this);~t&&z.splice(t,1),le()}render(){return null}}var K,N,ce,Se,Y=0,et=[],C=m,$e=C.__b,Te=C.__r,xe=C.diffed,Pe=C.__c,De=C.unmount,Ee=C.__;function be(e,t){C.__h&&C.__h(N,e,Y||t),Y=0;var n=N.__H||(N.__H={__:[],__h:[]});return e>=n.__.length&&n.__.push({}),n.__[e]}function W(e){return Y=1,Nt(rt,e)}function Nt(e,t,n){var o=be(K++,2);if(o.t=e,!o.__c&&(o.__=[n?n(t):rt(void 0,t),function(s){var a=o.__N?o.__N[0]:o.__[0],u=o.t(a,s);a!==u&&(o.__N=[u,o.__[1]],o.__c.setState({}))}],o.__c=N,!N.u)){var r=function(s,a,u){if(!o.__c.__H)return!0;var f=o.__c.__H.__.filter(function(h){return!!h.__c});if(f.every(function(h){return!h.__N}))return!l||l.call(this,s,a,u);var i=o.__c.props!==s;return f.forEach(function(h){if(h.__N){var d=h.__[0];h.__=h.__N,h.__N=void 0,d!==h.__[0]&&(i=!0)}}),l&&l.call(this,s,a,u)||i};N.u=!0;var l=N.shouldComponentUpdate,_=N.componentWillUpdate;N.componentWillUpdate=function(s,a,u){if(this.__e){var f=l;l=void 0,r(s,a,u),l=f}_&&_.call(this,s,a,u)},N.shouldComponentUpdate=r}return o.__N||o.__}function Z(e,t){var n=be(K++,3);!C.__s&&nt(n.__H,t)&&(n.__=e,n.i=t,N.__H.__h.push(n))}function D(e){return Y=5,tt(function(){return{current:e}},[])}function tt(e,t){var n=be(K++,7);return nt(n.__H,t)&&(n.__=e(),n.__H=t,n.__h=e),n.__}function E(e,t){return Y=8,tt(function(){return e},t)}function Ct(){for(var e;e=et.shift();)if(e.__P&&e.__H)try{e.__H.__h.forEach(te),e.__H.__h.forEach(de),e.__H.__h=[]}catch(t){e.__H.__h=[],C.__e(t,e.__v)}}C.__b=function(e){N=null,$e&&$e(e)},C.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),Ee&&Ee(e,t)},C.__r=function(e){Te&&Te(e),K=0;var t=(N=e.__c).__H;t&&(ce===N?(t.__h=[],N.__h=[],t.__.forEach(function(n){n.__N&&(n.__=n.__N),n.i=n.__N=void 0})):(t.__h.forEach(te),t.__h.forEach(de),t.__h=[],K=0)),ce=N},C.diffed=function(e){xe&&xe(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(et.push(t)!==1&&Se===C.requestAnimationFrame||((Se=C.requestAnimationFrame)||St)(Ct)),t.__H.__.forEach(function(n){n.i&&(n.__H=n.i),n.i=void 0})),ce=N=null},C.__c=function(e,t){t.some(function(n){try{n.__h.forEach(te),n.__h=n.__h.filter(function(o){return!o.__||de(o)})}catch(o){t.some(function(r){r.__h&&(r.__h=[])}),t=[],C.__e(o,n.__v)}}),Pe&&Pe(e,t)},C.unmount=function(e){De&&De(e);var t,n=e.__c;n&&n.__H&&(n.__H.__.forEach(function(o){try{te(o)}catch(r){t=r}}),n.__H=void 0,t&&C.__e(t,n.__v))};var Me=typeof requestAnimationFrame=="function";function St(e){var t,n=function(){clearTimeout(o),Me&&cancelAnimationFrame(t),setTimeout(e)},o=setTimeout(n,100);Me&&(t=requestAnimationFrame(n))}function te(e){var t=N,n=e.__c;typeof n=="function"&&(e.__c=void 0,n()),N=t}function de(e){var t=N;e.__c=e.__(),N=t}function nt(e,t){return!e||e.length!==t.length||t.some(function(n,o){return n!==e[o]})}function rt(e,t){return typeof t=="function"?t(e):t}const R=1e3,fe=60*R,pe=60*fe,Oe=24*pe,$t=e=>{let t=e;const n=Math.floor(t/Oe);t-=n*Oe;const o=Math.floor(t/pe);t-=o*pe;const r=Math.floor(t/fe);t-=r*fe;const l=Math.floor(t/R);return t-=l*R,n?`${n}d${o?` ${o}h`:""}`:o?`${o}h${r?` ${r}m`:""}`:r?`${r}m${l?` ${l}s`:""}`:`${l}s`},Tt="_terminal_s62kk_4",xt="_topBar_s62kk_13",Pt="_hostConnection_s62kk_28",Dt="_connectionIndicator_s62kk_34",Et="_connected_s62kk_40",Mt="_levelInputs_s62kk_43",Ot="_logs_s62kk_54",Ht="_logLine_s62kk_66",It="_debug_s62kk_87",Lt="_info_s62kk_90",Ut="_warn_s62kk_93",Bt="_error_s62kk_96",At="_timestamp_s62kk_99",Wt="_message_s62kk_109",x={terminal:Tt,topBar:xt,hostConnection:Pt,connectionIndicator:Dt,connected:Et,levelInputs:Mt,logs:Ot,logLine:Ht,debug:It,info:Lt,warn:Ut,error:Bt,timestamp:At,message:Wt},He=250,Rt=()=>{var h;const[e,t]=W(0),n=D([]),o=D(),r=D(!1),l=D(),_=D(!1),s=D(),[a,u]=W({debug:!1,info:!0,warn:!0,error:!0}),f=E(()=>{s.current||(s.current=setTimeout(()=>{t(+new Date),s.current=void 0},300))},[t]),i=E(async()=>{r.current||(r.current=!0,await new Promise(d=>setTimeout(d,R)),o.current=new WebSocket(`ws://${window.deviceIp}/logs`),o.current.onmessage=d=>{const y=JSON.parse(d.data);n.current.unshift(y),n.current.length>He&&(n.current=n.current.slice(0,He)),f(),r.current=!1},o.current.onopen=()=>{l.current=+new Date},o.current.onclose=()=>{var d;l.current=void 0,(d=o.current)==null||d.close(),_.current||(i(),n.current.unshift({level:"error",timestamp:new Date().toISOString(),message:"Websocket closed, reconnecting..."}))},o.current.onerror=()=>{var d;l.current=void 0,(d=o.current)==null||d.close(),_.current||(i(),n.current.unshift({level:"error",timestamp:new Date().toISOString(),message:"Websocket error, reconnecting..."}))})},[f]);return Z(()=>(i(),()=>{var d;_.current=!0,(d=o.current)==null||d.close()}),[i]),c("div",{className:x.terminal,children:[c("div",{className:x.topBar,children:[c("div",{className:x.hostConnection,children:[c("div",{className:`${x.connectionIndicator} ${((h=o.current)==null?void 0:h.readyState)===WebSocket.OPEN?x.connected:""}`}),c("span",{className:x.host,children:["ws://",window.deviceIp,"/logs"]})]}),c("div",{className:x.levelInputs,children:[c("label",{children:[c("input",{type:"checkbox",checked:a.debug,onChange:d=>u({...a,debug:d.currentTarget.checked})}),"debug"]}),c("label",{children:[c("input",{type:"checkbox",checked:a.info,onChange:d=>u({...a,info:d.currentTarget.checked})}),"info"]}),c("label",{children:[c("input",{type:"checkbox",checked:a.warn,onChange:d=>u({...a,warn:d.currentTarget.checked})}),"warn"]}),c("label",{children:[c("input",{type:"checkbox",checked:a.error,onChange:d=>u({...a,error:d.currentTarget.checked})}),"error"]})]})]}),c("div",{className:x.logs,children:n.current.map(d=>a[d.level]&&c("pre",{className:`${x.logLine} ${x[d.level]}`,children:[c("span",{className:x.timestamp,children:d.timestamp.replace("T"," ").split(".")[0]}),c("span",{className:x.message,children:d.message})]},`${d.timestamp}:${d.message}`))})]})},Ft="_modal_1nw27_3",qt="_modalBackdrop_1nw27_15",zt="_title_1nw27_26",jt="_colour_1nw27_31",Vt="_label_1nw27_39",Gt="_value_1nw27_45",Jt="_bar_1nw27_51",Kt="_colourBox_1nw27_80",w={modal:Ft,modalBackdrop:qt,title:zt,colour:jt,label:Vt,value:Gt,bar:Jt,colourBox:Kt},Yt=({sourceId:e,setSourceId:t,setModalType:n})=>{const o=E(()=>{n(void 0),t(void 0)},[n,t]),r=E(l=>{fetch(`http://${window.deviceIp}/${e}`,{method:"POST",body:JSON.stringify({commandString:l,source:"tv"})})},[e]);return c(H,{children:[c("div",{className:w.modalBackdrop,onClick:o}),c("div",{className:w.modal,children:[c("div",{children:["IR Remote Sender: ",e]}),c("button",{onClick:()=>r("power"),children:"power"}),c("button",{onClick:()=>r("ok"),children:"ok"})," ",c("br",{}),c("button",{onClick:()=>r("up"),children:"up"}),c("button",{onClick:()=>r("down"),children:"down"}),c("button",{onClick:()=>r("left"),children:"left"}),c("button",{onClick:()=>r("right"),children:"right"})," ",c("br",{}),c("button",{onClick:()=>r("0"),children:"0"}),c("button",{onClick:()=>r("1"),children:"1"}),c("button",{onClick:()=>r("2"),children:"2"}),c("button",{onClick:()=>r("3"),children:"3"}),c("button",{onClick:()=>r("4"),children:"4"}),c("button",{onClick:()=>r("5"),children:"5"}),c("button",{onClick:()=>r("6"),children:"6"}),c("button",{onClick:()=>r("7"),children:"7"}),c("button",{onClick:()=>r("8"),children:"8"}),c("button",{onClick:()=>r("9"),children:"9"})," ",c("br",{}),c("button",{onClick:()=>r("guide"),children:"guide"}),c("button",{onClick:()=>r("mute"),children:"mute"}),c("button",{onClick:()=>r("home"),children:"home"}),c("button",{onClick:()=>r("source"),children:"source"}),c("button",{onClick:()=>r("back"),children:"back"}),c("button",{onClick:()=>r("settings"),children:"settings"})," ",c("br",{}),c("button",{onClick:()=>r("red-button"),children:"red-button"}),c("button",{onClick:()=>r("green-button"),children:"green-button"}),c("button",{onClick:()=>r("yellow-button"),children:"yellow-button"}),c("button",{onClick:()=>r("blue-button"),children:"blue-button"})," ",c("br",{}),c("button",{onClick:()=>r("netflix"),children:"netflix"}),c("button",{onClick:()=>r("prime"),children:"prime"}),c("button",{onClick:()=>r("disney"),children:"disney"}),c("button",{onClick:()=>r("raktuken"),children:"raktuken"}),c("button",{onClick:()=>r("lg-channels"),children:"lg-channels"})]})]})};function Zt(e,t){for(var n in t)e[n]=t[n];return e}function Ie(e,t){for(var n in e)if(n!=="__source"&&!(n in t))return!0;for(var o in t)if(o!=="__source"&&e[o]!==t[o])return!0;return!1}function Le(e,t){this.props=e,this.context=t}(Le.prototype=new O).isPureReactComponent=!0,Le.prototype.shouldComponentUpdate=function(e,t){return Ie(this.props,e)||Ie(this.state,t)};var Ue=m.__b;m.__b=function(e){e.type&&e.type.__f&&e.ref&&(e.props.ref=e.ref,e.ref=null),Ue&&Ue(e)};var Qt=m.__e;m.__e=function(e,t,n,o){if(e.then){for(var r,l=t;l=l.__;)if((r=l.__c)&&r.__c)return t.__e==null&&(t.__e=n.__e,t.__k=n.__k),r.__c(e,t)}Qt(e,t,n,o)};var Be=m.unmount;function ot(e,t,n){return e&&(e.__c&&e.__c.__H&&(e.__c.__H.__.forEach(function(o){typeof o.__c=="function"&&o.__c()}),e.__c.__H=null),(e=Zt({},e)).__c!=null&&(e.__c.__P===n&&(e.__c.__P=t),e.__c=null),e.__k=e.__k&&e.__k.map(function(o){return ot(o,t,n)})),e}function lt(e,t,n){return e&&n&&(e.__v=null,e.__k=e.__k&&e.__k.map(function(o){return lt(o,t,n)}),e.__c&&e.__c.__P===t&&(e.__e&&n.appendChild(e.__e),e.__c.__e=!0,e.__c.__P=n)),e}function ie(){this.__u=0,this.o=null,this.__b=null}function ct(e){var t=e.__.__c;return t&&t.__a&&t.__a(e)}function ee(){this.i=null,this.l=null}m.unmount=function(e){var t=e.__c;t&&t.__R&&t.__R(),t&&32&e.__u&&(e.type=null),Be&&Be(e)},(ie.prototype=new O).__c=function(e,t){var n=t.__c,o=this;o.o==null&&(o.o=[]),o.o.push(n);var r=ct(o.__v),l=!1,_=function(){l||(l=!0,n.__R=null,r?r(s):s())};n.__R=_;var s=function(){if(!--o.__u){if(o.state.__a){var a=o.state.__a;o.__v.__k[0]=lt(a,a.__c.__P,a.__c.__O)}var u;for(o.setState({__a:o.__b=null});u=o.o.pop();)u.forceUpdate()}};o.__u++||32&t.__u||o.setState({__a:o.__b=o.__v.__k[0]}),e.then(_,_)},ie.prototype.componentWillUnmount=function(){this.o=[]},ie.prototype.render=function(e,t){if(this.__b){if(this.__v.__k){var n=document.createElement("div"),o=this.__v.__k[0].__c;this.__v.__k[0]=ot(this.__b,n,o.__O=o.__P)}this.__b=null}var r=t.__a&&ue(H,null,e.fallback);return r&&(r.__u&=-33),[ue(H,null,t.__a?null:e.children),r]};var Ae=function(e,t,n){if(++n[1]===n[0]&&e.l.delete(t),e.props.revealOrder&&(e.props.revealOrder[0]!=="t"||!e.l.size))for(n=e.i;n;){for(;n.length>3;)n.pop()();if(n[1]<n[0])break;e.i=n=n[2]}};(ee.prototype=new O).__a=function(e){var t=this,n=ct(t.__v),o=t.l.get(e);return o[0]++,function(r){var l=function(){t.props.revealOrder?(o.push(r),Ae(t,e,o)):r()};n?n(l):l()}},ee.prototype.render=function(e){this.i=null,this.l=new Map;var t=re(e.children);e.revealOrder&&e.revealOrder[0]==="b"&&t.reverse();for(var n=t.length;n--;)this.l.set(t[n],this.i=[1,0,this.i]);return e.children},ee.prototype.componentDidUpdate=ee.prototype.componentDidMount=function(){var e=this;this.l.forEach(function(t,n){Ae(e,n,t)})};var Xt=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.element")||60103,en=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,tn=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,nn=/[A-Z0-9]/g,rn=typeof document<"u",on=function(e){return(typeof Symbol<"u"&&typeof Symbol()=="symbol"?/fil|che|rad/:/fil|che|ra/).test(e)};O.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(e){Object.defineProperty(O.prototype,e,{configurable:!0,get:function(){return this["UNSAFE_"+e]},set:function(t){Object.defineProperty(this,e,{configurable:!0,writable:!0,value:t})}})});var We=m.event;function ln(){}function cn(){return this.cancelBubble}function _n(){return this.defaultPrevented}m.event=function(e){return We&&(e=We(e)),e.persist=ln,e.isPropagationStopped=cn,e.isDefaultPrevented=_n,e.nativeEvent=e};var sn={enumerable:!1,configurable:!0,get:function(){return this.class}},Re=m.vnode;m.vnode=function(e){typeof e.type=="string"&&function(t){var n=t.props,o=t.type,r={},l=o.indexOf("-")===-1;for(var _ in n){var s=n[_];if(!(_==="value"&&"defaultValue"in n&&s==null||rn&&_==="children"&&o==="noscript"||_==="class"||_==="className")){var a=_.toLowerCase();_==="defaultValue"&&"value"in n&&n.value==null?_="value":_==="download"&&s===!0?s="":a==="translate"&&s==="no"?s=!1:a[0]==="o"&&a[1]==="n"?a==="ondoubleclick"?_="ondblclick":a!=="onchange"||o!=="input"&&o!=="textarea"||on(n.type)?a==="onfocus"?_="onfocusin":a==="onblur"?_="onfocusout":tn.test(_)&&(_=a):a=_="oninput":l&&en.test(_)?_=_.replace(nn,"-$&").toLowerCase():s===null&&(s=void 0),a==="oninput"&&r[_=a]&&(_="oninputCapture"),r[_]=s}}o=="select"&&r.multiple&&Array.isArray(r.value)&&(r.value=re(n.children).forEach(function(u){u.props.selected=r.value.indexOf(u.props.value)!=-1})),o=="select"&&r.defaultValue!=null&&(r.value=re(n.children).forEach(function(u){u.props.selected=r.multiple?r.defaultValue.indexOf(u.props.value)!=-1:r.defaultValue==u.props.value})),n.class&&!n.className?(r.class=n.class,Object.defineProperty(r,"className",sn)):(n.className&&!n.class||n.class&&n.className)&&(r.class=r.className=n.className),t.props=r}(e),e.$$typeof=Xt,Re&&Re(e)};var Fe=m.__r;m.__r=function(e){Fe&&Fe(e),e.__c};var qe=m.diffed;m.diffed=function(e){qe&&qe(e);var t=e.props,n=e.__e;n!=null&&e.type==="textarea"&&"value"in t&&t.value!==n.value&&(n.value=t.value==null?"":t.value)};const an=e=>e.type=="button",un=e=>e.type=="dht",dn=e=>e.type=="ir-send",V=e=>e.type=="neopixel",fn=e=>e.type=="ntp",pn=e=>e.type=="temt6000",hn=e=>e.type=="rotary-encoder",mn=e=>e.type=="wifi",vn=({sourceId:e,setSourceId:t,setModalType:n})=>{var a,u,f,i,h,d,y,S,k,g,b,U,P,B;const o=E(()=>{n(void 0),t(void 0)},[n,t]),[r,l]=W(window.sources[e]&&V(window.sources[e])?window.sources[e]:void 0),_=E((v,I)=>{if(r&&V(r)){const T={...r};T.colour=T.colour||{red:0,green:0,blue:0,white:0},T.colour[v]=parseInt(I),l(T)}},[r]),s=E(v=>{const I=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(v);if(!I)return;const T=parseInt(I[1],16),F=parseInt(I[2],16),q=parseInt(I[3],16);if(r&&V(r)){const $={...r},M=Math.min(T,F,q);$.colour={red:T-M,green:F-M,blue:q-M,white:M},l($)}},[r]);return Z(()=>{const v=setTimeout(()=>{r&&fetch(`http://${window.deviceIp}/${r.id}`,{method:"POST",body:JSON.stringify({colour:r.colour,duration:300})})},R/3);return()=>clearTimeout(v)},[r]),!r||!V(r)?"Failed to get source":c(H,{children:[c("div",{className:w.modalBackdrop,onClick:o}),c("div",{className:w.modal,children:[c("div",{className:w.title,children:["Update neopixels: ",e]}),c("div",{className:w.source,children:[c("span",{className:w.colour,children:[c("span",{className:w.label,onClick:()=>{var v;return _("red",(v=r==null?void 0:r.colour)!=null&&v.red?"0":"255")},children:"red"}),c("span",{className:w.value,children:((a=r.colour)==null?void 0:a.red)!=null?r.colour.red:"-"}),c("div",{className:w.bar,children:c("input",{type:"range",value:((u=r.colour)==null?void 0:u.red)||0,min:0,max:255,step:1,onInput:v=>_("red",v.currentTarget.value)})})]}),c("span",{className:w.colour,children:[c("span",{className:w.label,onClick:()=>{var v;return _("green",(v=r==null?void 0:r.colour)!=null&&v.green?"0":"255")},children:"green"}),c("span",{className:w.value,children:((f=r.colour)==null?void 0:f.green)!=null?r.colour.green:"-"}),c("div",{className:w.bar,children:c("input",{type:"range",value:((i=r.colour)==null?void 0:i.green)||0,min:0,max:255,step:1,onInput:v=>_("green",v.currentTarget.value)})})]}),c("span",{className:w.colour,children:[c("span",{className:w.label,onClick:()=>{var v;return _("blue",(v=r==null?void 0:r.colour)!=null&&v.blue?"0":"255")},children:"blue"}),c("span",{className:w.value,children:((h=r.colour)==null?void 0:h.blue)!=null?r.colour.blue:"-"}),c("div",{className:w.bar,children:c("input",{type:"range",value:((d=r.colour)==null?void 0:d.blue)||0,min:0,max:255,step:1,onInput:v=>_("blue",v.currentTarget.value)})})]}),c("span",{className:w.colour,children:[c("span",{className:w.label,onClick:()=>{var v;return _("white",(v=r==null?void 0:r.colour)!=null&&v.white?"0":"255")},children:"white"}),c("span",{className:w.value,children:((y=r.colour)==null?void 0:y.white)!=null?r.colour.white:"-"}),c("div",{className:w.bar,children:c("input",{type:"range",value:((S=r.colour)==null?void 0:S.white)||0,min:0,max:255,step:1,onInput:v=>_("white",v.currentTarget.value)})})]}),c("div",{className:w.colourBox,children:[c("input",{type:"color",value:`#${((((k=r.colour)==null?void 0:k.red)||0)+(((g=r.colour)==null?void 0:g.white)||0)).toString(16).padStart(2,"0")}${((((b=r.colour)==null?void 0:b.green)||0)+(((U=r.colour)==null?void 0:U.white)||0)).toString(16).padStart(2,"0")}${((((P=r.colour)==null?void 0:P.blue)||0)+(((B=r.colour)==null?void 0:B.white)||0)).toString(16).padStart(2,"0")}`,onInput:v=>s(v.currentTarget.value)}),c("button",{onClick:()=>s("#000000"),children:"Off"})]})]},r.id)]})]})},gn=({sourceId:e,modalType:t,setModalType:n,setSourceId:o})=>t==="neopixels"&&e?c(vn,{sourceId:e,setSourceId:o,setModalType:n}):t==="ir-sender"&&e?c(Yt,{sourceId:e,setSourceId:o,setModalType:n}):null,bn="_pageGrid_e9fqj_4",yn={pageGrid:bn},wn=({children:e})=>c("div",{className:yn.pageGrid,children:e}),kn="_sources_apwu0_4",Nn="_source_apwu0_4",Cn="_label_apwu0_36",Sn="_value_apwu0_40",$n="_colour_apwu0_45",Tn="_bar_apwu0_63",xn="_fill_apwu0_69",Pn="_irSender_apwu0_74",Dn="_wifi_apwu0_75",En="_ntp_apwu0_84",p={sources:kn,source:Nn,label:Cn,value:Sn,colour:$n,bar:Tn,fill:xn,irSender:Pn,wifi:Dn,ntp:En},Mn=({source:e})=>c("div",{className:p.source,children:e.id}),On=({source:e})=>c(H,{children:[c("div",{className:p.source,children:[c("span",{className:p.label,children:"temperature"}),c("span",{className:p.value,children:[e.temperature!=null?e.temperature:"- ","°c"]})]}),c("div",{className:p.source,children:[c("span",{className:p.label,children:"humidity"}),c("span",{className:p.value,children:[e.humidity!=null?e.humidity:"- ","%"]})]})]}),Hn=({source:e,setModalSourceId:t,setModalType:n})=>{const o=E(()=>{t(e.id),n("ir-sender")},[e.id,t,n]);return c("div",{className:`${p.source} ${p.irSender}`,onClick:o,children:c("svg",{viewBox:"0 0 24 24",children:c("path",{d:"M15 9H9c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1m-3 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2M7.05 6.05l1.41 1.41C9.37 6.56 10.62 6 12 6s2.63.56 3.54 1.46l1.41-1.41C15.68 4.78 13.93 4 12 4s-3.68.78-4.95 2.05M12 0C8.96 0 6.21 1.23 4.22 3.22l1.41 1.41C7.26 3.01 9.51 2 12 2s4.74 1.01 6.36 2.64l1.41-1.41C17.79 1.23 15.04 0 12 0"})})})},In=({source:e,setModalSourceId:t,setModalType:n})=>{var r,l,_,s,a,u,f,i;const o=E(()=>{t(e.id),n("neopixels")},[e.id,t,n]);return c("div",{className:p.source,onClick:o,children:[c("span",{className:p.colour,children:[c("span",{className:p.label,children:"red"}),c("span",{className:p.value,children:((r=e.colour)==null?void 0:r.red)!=null?e.colour.red:"-"}),c("div",{className:p.bar,children:c("div",{className:p.fill,style:{width:`${100*(((l=e.colour)==null?void 0:l.red)||0)/255}%`}})})]}),c("span",{className:p.colour,children:[c("span",{className:p.label,children:"green"}),c("span",{className:p.value,children:((_=e.colour)==null?void 0:_.green)!=null?e.colour.green:"-"}),c("div",{className:p.bar,children:c("div",{className:p.fill,style:{width:`${100*(((s=e.colour)==null?void 0:s.green)||0)/255}%`}})})]}),c("span",{className:p.colour,children:[c("span",{className:p.label,children:"blue"}),c("span",{className:p.value,children:((a=e.colour)==null?void 0:a.blue)!=null?e.colour.blue:"-"}),c("div",{className:p.bar,children:c("div",{className:p.fill,style:{width:`${100*(((u=e.colour)==null?void 0:u.blue)||0)/255}%`}})})]}),c("span",{className:p.colour,children:[c("span",{className:p.label,children:"white"}),c("span",{className:p.value,children:((f=e.colour)==null?void 0:f.white)!=null?e.colour.white:"-"}),c("div",{className:p.bar,children:c("div",{className:p.fill,style:{width:`${100*(((i=e.colour)==null?void 0:i.white)||0)/255}%`}})})]})]})},Ln=({source:e})=>{const[t,n]=W(0);return Z(()=>{const o=setInterval(()=>(n(+new Date),()=>clearInterval(o)),R)},[n]),c("div",{className:`${p.source} ${p.ntp}`,children:[c("span",{className:p.label,children:"Uptime"}),c("span",{className:p.value,children:e.startTimestamp&&e.startTimestampOffset?$t(+new Date-+new Date(e.startTimestamp)+e.startTimestampOffset):"-"})]})},Un=({source:e})=>c("div",{className:p.source,children:e.id}),Bn=({source:e})=>{var t,n;return c("div",{className:p.source,children:[c("span",{className:p.label,children:"Light Level"}),c("span",{className:p.value,children:[((n=(t=e.lux)==null?void 0:t.toFixed)==null?void 0:n.call(t,0))||"- ","lux"]})]})},An=({source:e})=>c("div",{className:`${p.source} ${p.wifi}`,children:e.strength=="excellent"?c("svg",{viewBox:"0 0 24 24",children:c("path",{d:"M12.01 21.49 23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01z"})}):e.strength=="good"?c("svg",{viewBox:"0 0 24 24",children:[c("path",{"fill-opacity":".3",d:"M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"}),c("path",{d:"M3.53 10.95l8.46 10.54.01.01.01-.01 8.46-10.54C20.04 10.62 16.81 8 12 8c-4.81 0-8.04 2.62-8.47 2.95z"})]}):e.strength=="medium"?c("svg",{viewBox:"0 0 24 24",children:[c("path",{"fill-opacity":".3",d:"M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"}),c("path",{d:"M4.79 12.52l7.2 8.98H12l.01-.01 7.2-8.98C18.85 12.24 16.1 10 12 10s-6.85 2.24-7.21 2.52z"})]}):e.strength=="weak"?c("svg",{viewBox:"0 0 24 24",children:[c("path",{"fill-opacity":".3",d:"M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"}),c("path",{d:"M6.67 14.86L12 21.49v.01l.01-.01 5.33-6.63C17.06 14.65 15.03 13 12 13s-5.06 1.65-5.33 1.86z"})]}):e.strength=="minimal"?c("svg",{viewBox:"0 0 24 24",children:[c("path",{"fill-opacity":".3",d:"M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"}),c("path",{d:"M6.67 14.86L12 21.49v.01l.01-.01 5.33-6.63C17.06 14.65 15.03 13 12 13s-5.06 1.65-5.33 1.86z"})]}):c("svg",{viewBox:"0 0 24 24",children:c("path",{d:"M12 6c3.33 0 6.49 1.08 9.08 3.07L12 18.17l-9.08-9.1C5.51 7.08 8.67 6 12 6m0-2C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4"})})}),Wn=({setModalSourceId:e,setModalType:t})=>{const[n,o]=W(0),r=D(),l=D(!1),_=D(),s=D(!1),a=D(),u=E(()=>{a.current||(a.current=setTimeout(()=>{o(+new Date),a.current=void 0},300))},[o]),f=E(async()=>{l.current||(l.current=!0,await new Promise(i=>setTimeout(i,R)),r.current=new WebSocket(`ws://${window.deviceIp}/reports`),r.current.onmessage=i=>{if(window.sources){const h=JSON.parse(i.data);window.sources[h.id]=h,u()}},r.current.onopen=()=>{_.current=+new Date,l.current=!1},r.current.onclose=()=>{var i;_.current=void 0,(i=r.current)==null||i.close(),s.current||f()},r.current.onerror=()=>{var i;_.current=void 0,(i=r.current)==null||i.close(),s.current||f()})},[u]);return Z(()=>(f(),()=>{var i;s.current=!0,(i=r.current)==null||i.close()}),[f]),Z(()=>{fetch(`http://${window.deviceIp}/sources`).then(i=>i.json()).then(i=>{window.sources=i,u()})},[u]),c("div",{className:p.sources,children:window.sources==null?c("div",{className:p.source,children:"loading..."}):Object.values(window.sources).map(i=>an(i)?c(Mn,{source:i}):un(i)?c(On,{source:i}):dn(i)?c(Hn,{source:i,setModalSourceId:e,setModalType:t}):V(i)?c(In,{source:i,setModalSourceId:e,setModalType:t}):fn(i)?c(Ln,{source:i}):pn(i)?c(Bn,{source:i}):hn(i)?c(Un,{source:i}):mn(i)?c(An,{source:i}):c("div",{className:p.source,children:i.id},i.id))})},Rn=()=>{window.deviceIp=window.location.host&&!window.location.host.includes("localhost")?window.location.host:"192.168.1.120";const[e,t]=W(),[n,o]=W();return c(H,{children:[c(kt,{children:c("title",{children:[window.deviceIp," - Device Page"]})}),c(wn,{children:[c(Wn,{setModalSourceId:t,setModalType:o}),c(Rt,{}),c(gn,{sourceId:e,setSourceId:t,modalType:n,setModalType:o})]})]})};dt(c(Rn,{}),document.getElementById("app"));
