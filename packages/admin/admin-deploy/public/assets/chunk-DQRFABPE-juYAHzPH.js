import{aj as H,ak as M,r as T,j as _,ag as D,s as F}from"./index-CozdGtcA.js";import{l as O,R as Q}from"./quill.snow-CBY_r-Hi.js";var j={exports:{}};(function(v,C){(function(b,g){v.exports=g()})(H,function(){function b(i){if(!(typeof window>"u")){var t=document.createElement("style");return t.setAttribute("media","screen"),t.innerHTML=i,document.head.appendChild(t),i}}/*! *****************************************************************************
	    Copyright (c) Microsoft Corporation.

	    Permission to use, copy, modify, and/or distribute this software for any
	    purpose with or without fee is hereby granted.

	    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	    PERFORMANCE OF THIS SOFTWARE.
	    ***************************************************************************** */var g=function(i,t){return g=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,r){e.__proto__=r}||function(e,r){for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])},g(i,t)};function y(i,t){g(i,t);function e(){this.constructor=i}i.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}var p=function(){return p=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++){e=arguments[r];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}return t},p.apply(this,arguments)};b(`#editor-resizer {
  position: absolute;
  border: 1px dashed #fff;
  background-color: rgba(0, 0, 0, 0.5);
}
#editor-resizer .handler {
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 10px;
  height: 10px;
  border: 1px solid #333;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: nwse-resize;
  user-select: none;
}
#editor-resizer .toolbar {
  position: absolute;
  top: -5em;
  left: 50%;
  padding: 0.5em;
  border: 1px solid #fff;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  transform: translateX(-50%);
  width: 20em;
}
#editor-resizer .toolbar .group {
  display: flex;
  border: 1px solid #aaa;
  border-radius: 6px;
  white-space: nowrap;
  text-align: center;
  line-height: 2;
  color: rgba(0, 0, 0, 0.65);
}
#editor-resizer .toolbar .group:not(:first-child) {
  margin-top: 0.5em;
}
#editor-resizer .toolbar .group .btn {
  flex: 1 0 0;
  text-align: center;
  width: 25%;
  padding: 0 0.5rem;
  display: inline-block;
  vertical-align: top;
  user-select: none;
  color: inherit;
}
#editor-resizer .toolbar .group .btn:not(:last-child) {
  border-right: 1px solid #bbb;
}
#editor-resizer .toolbar .group .btn:not(.btn-group):active {
  background-color: rgba(0, 0, 0, 0.1);
}
#editor-resizer .toolbar .group .input-wrapper {
  width: 25%;
  border: 1px solid #eee;
  position: relative;
  border-right: 1px solid #bbb;
  min-width: 4em;
}
#editor-resizer .toolbar .group .input-wrapper::after {
  content: " ";
  position: absolute;
  height: 1px;
  background-color: #333;
  left: 0.5em;
  right: 1em;
  bottom: 0.2em;
}
#editor-resizer .toolbar .group .input-wrapper input {
  color: inherit;
  text-align: center;
  width: 100%;
  border: none;
  outline: none;
  padding: 0 0.5em;
  padding-right: 1.5em;
}
#editor-resizer .toolbar .group .input-wrapper input:focus ~ .tooltip {
  display: block;
}
#editor-resizer .toolbar .group .input-wrapper .suffix {
  position: absolute;
  right: 0.5em;
}
#editor-resizer .toolbar .group .input-wrapper .tooltip {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  font-size: small;
  background-color: #fff;
  box-shadow: 0 0 3px #a7a7a7;
  padding: 0 0.6em;
  border-radius: 5px;
  zoom: 0.85;
}
`);var k=function(){function i(t){this.config=p(p({},z),t)}return i.prototype.findLabel=function(t){return this.config?Reflect.get(this.config,t):null},i}(),z={floatLeft:"left",floatRight:"right",center:"center",restore:"restore",altTip:"Press and hold alt to lock ratio!",inputTip:"Press enter key to apply change!"};function w(i){for(var t=[],e=1;e<arguments.length;e++)t[e-1]=arguments[e];return i.replace(/\{(\d+)\}/g,function(r,n){return t.length>n?t[n]:""})}(function(i){y(t,i);function t(){var e=i!==null&&i.apply(this,arguments)||this;return e.originSize=null,e}return t})(HTMLElement);var E=`
<div class="handler" title="{0}"></div>
<div class="toolbar">
  <div class="group">
    <a class="btn" data-type="width" data-styles="width:100%">100%</a>
    <a class="btn" data-type="width" data-styles="width:50%">50%</a>
    <span class="input-wrapper"><input data-type="width" maxlength="3" /><span class="suffix">%</span><span class="tooltip">{5}</span></span>
    <a class="btn" data-type="width" data-styles="width:auto">{4}</a>
  </div>
  <div class="group">
    <a class="btn" data-type="align" data-styles="float:left">{1}</a>
    <a class="btn" data-type="align" data-styles="display:block;margin:auto;">{2}</a>
    <a class="btn" data-type="align" data-styles="float:right;">{3}</a>
    <a class="btn" data-type="align" data-styles="">{4}</a>
  </div>
</div>
`,x=function(){function i(t,e,r,n){this.resizer=null,this.startResizePosition=null,this.i18n=new k((n==null?void 0:n.locale)||z),this.options=n,this.resizeTarget=t,t.originSize||(t.originSize={width:t.clientWidth,height:t.clientHeight}),this.editor=r,this.container=e,this.initResizer(),this.positionResizerToTarget(t),this.resizing=this.resizing.bind(this),this.endResize=this.endResize.bind(this),this.startResize=this.startResize.bind(this),this.toolbarClick=this.toolbarClick.bind(this),this.toolbarInputChange=this.toolbarInputChange.bind(this),this.onScroll=this.onScroll.bind(this),this.bindEvents()}return i.prototype.initResizer=function(){var t=this.container.querySelector("#editor-resizer");t||(t=document.createElement("div"),t.setAttribute("id","editor-resizer"),t.innerHTML=w(E,this.i18n.findLabel("altTip"),this.i18n.findLabel("floatLeft"),this.i18n.findLabel("center"),this.i18n.findLabel("floatRight"),this.i18n.findLabel("restore"),this.i18n.findLabel("inputTip")),this.container.appendChild(t)),this.resizer=t},i.prototype.positionResizerToTarget=function(t){this.resizer!==null&&(this.resizer.style.setProperty("left",t.offsetLeft+"px"),this.resizer.style.setProperty("top",t.offsetTop-this.editor.scrollTop+"px"),this.resizer.style.setProperty("width",t.clientWidth+"px"),this.resizer.style.setProperty("height",t.clientHeight+"px"))},i.prototype.bindEvents=function(){this.resizer!==null&&(this.resizer.addEventListener("mousedown",this.startResize),this.resizer.addEventListener("click",this.toolbarClick),this.resizer.addEventListener("change",this.toolbarInputChange)),window.addEventListener("mouseup",this.endResize),window.addEventListener("mousemove",this.resizing),this.editor.addEventListener("scroll",this.onScroll)},i.prototype.onScroll=function(){this.positionResizerToTarget(this.resizeTarget)},i.prototype._setStylesForToolbar=function(t,e){var r,n="_styles_"+t,o=this.resizeTarget.style,l=this.resizeTarget[n];o.cssText=o.cssText.replaceAll(" ","").replace(l,"")+(";"+e),this.resizeTarget[n]=e,this.positionResizerToTarget(this.resizeTarget),(r=this.options)===null||r===void 0||r.onChange(this.resizeTarget)},i.prototype.toolbarInputChange=function(t){var e,r=t.target,n=(e=r==null?void 0:r.dataset)===null||e===void 0?void 0:e.type,o=r.value;n&&Number(o)&&this._setStylesForToolbar(n,"width: "+Number(o)+"%;")},i.prototype.toolbarClick=function(t){var e,r,n=t.target,o=(e=n==null?void 0:n.dataset)===null||e===void 0?void 0:e.type;o&&n.classList.contains("btn")&&this._setStylesForToolbar(o,(r=n==null?void 0:n.dataset)===null||r===void 0?void 0:r.styles)},i.prototype.startResize=function(t){var e=t.target;e.classList.contains("handler")&&t.which===1&&(this.startResizePosition={left:t.clientX,top:t.clientY,width:this.resizeTarget.clientWidth,height:this.resizeTarget.clientHeight})},i.prototype.endResize=function(){var t;this.startResizePosition=null,(t=this.options)===null||t===void 0||t.onChange(this.resizeTarget)},i.prototype.resizing=function(t){if(this.startResizePosition){var e=t.clientX-this.startResizePosition.left,r=t.clientY-this.startResizePosition.top,n=this.startResizePosition.width,o=this.startResizePosition.height;if(n+=e,o+=r,t.altKey){var l=this.resizeTarget.originSize,a=l.height/l.width;o=a*n}this.resizeTarget.style.setProperty("width",Math.max(n,30)+"px"),this.resizeTarget.style.setProperty("height",Math.max(o,30)+"px"),this.positionResizerToTarget(this.resizeTarget)}},i.prototype.destory=function(){this.container.removeChild(this.resizer),window.removeEventListener("mouseup",this.endResize),window.removeEventListener("mousemove",this.resizing),this.editor.removeEventListener("scroll",this.onScroll),this.resizer=null},i}(),s=function(){function i(t,e){this.element=t,this.cb=e,this.hasTracked=!1}return i}(),h=function(){function i(){}return i.track=function(t,e){this.iframes.push(new s(t,e)),this.interval||(this.interval=setInterval(function(){i.checkClick()},this.resolution))},i.checkClick=function(){if(document.activeElement){var t=document.activeElement;for(var e in this.iframes)t===this.iframes[e].element?this.iframes[e].hasTracked==!1&&(this.iframes[e].cb.apply(window,[]),this.iframes[e].hasTracked=!0):this.iframes[e].hasTracked=!1}},i.resolution=200,i.iframes=[],i.interval=null,i}();function d(i,t){var e=i.root,r,n;function o(){var l=i.getContents().constructor,a=new l().retain(1);i.updateContents(a)}e.addEventListener("click",function(l){var a=l.target;l.target&&["img","video"].includes(a.tagName.toLowerCase())&&(r=a,n=new x(a,e.parentElement,e,p(p({},t),{onChange:o})))}),i.on("text-change",function(l,a){e.querySelectorAll("iframe").forEach(function(c){h.track(c,function(){r=c,n=new x(c,e.parentElement,e,p(p({},t),{onChange:o}))})})}),document.addEventListener("mousedown",function(l){var a,c,u,f=l.target;f!==r&&!(!((c=(a=n==null?void 0:n.resizer)===null||a===void 0?void 0:a.contains)===null||c===void 0)&&c.call(a,f))&&((u=n==null?void 0:n.destory)===null||u===void 0||u.call(n),n=null,r=null)},{capture:!0})}return d})})(j);var U=j.exports;const W=M(U);O.Quill.register("modules/resize",W);var X=({label:v,value:C,onChange:b})=>{const g=T.useRef(null),[y,p]=T.useState([]),k=()=>{const s=document.createElement("input");s.setAttribute("type","file"),s.setAttribute("accept","image/*"),s.click(),s.onchange=async()=>{var t;const h=s.files?s.files[0]:null;if(!h)return;const d=(t=g.current)==null?void 0:t.getEditor(),i=d==null?void 0:d.getSelection();if(d&&i){const e=`uploading-${Date.now()}`;d.insertEmbed(i.index,"image",e);const r=new FileReader;r.onload=async()=>{const n=new Image;n.src=r.result,n.onload=async()=>{var P;const o=document.createElement("canvas"),l=800,a=600;let c=n.width,u=n.height;(c>l||u>a)&&(c>u?(u=u*l/c,c=l):(c=c*a/u,u=a)),o.width=c,o.height=u;const f=o.getContext("2d");if(f){f.drawImage(n,0,0,c,u);const A=o.toDataURL("image/jpeg",.7);d==null||d.getSelection();const L=d.root.querySelectorAll(`img[src="${e}"]`);L.forEach(R=>{R.src=A});try{const m=(P=(await F.admin.upload.create({files:[h]})).files)==null?void 0:P[0];if(m&&m.url){const S=m.url;L.forEach(I=>{I.src=S}),p(I=>[...I,S])}}catch(R){console.error("Image upload failed:",R),L.forEach(m=>{m.remove()})}}}},r.readAsDataURL(h)}}},z=s=>{y.filter(h=>!s.includes(h)),p(s)},w=()=>{var d;const s=(d=g.current)==null?void 0:d.getEditor();if(!s)return;console.log("quillObj",s);const h=Array.from(s.root.querySelectorAll("img")).map(i=>i.src);console.log("currentImages",h),z(h)};T.useEffect(()=>{var h;const s=(h=g.current)==null?void 0:h.getEditor();return s==null||s.on("text-change",w),()=>{s==null||s.off("text-change",w)}},[y]);const E=T.useMemo(()=>({toolbar:{container:[[{font:[]}],[{header:[1,2,3,4,5,6,!1]}],["bold","italic","underline"],[{color:[]},{background:[]}],[{list:"ordered"},{list:"bullet"}],[{indent:"-1"},{indent:"+1"}],[{align:[]}],["link","image"],["blockquote"]],handlers:{image:k}},resize:{locale:{}},clipboard:{matchVisual:!1},history:{delay:2e3,maxStack:500}}),[]),x=["font","header","bold","italic","underline","strike","color","background","script","list","indent","direction","align","link","image","video","blockquote","code-block"];return _.jsxs("div",{children:[v&&_.jsx(D,{children:v}),_.jsx(Q,{ref:g,theme:"snow",value:C,onChange:b,modules:E,formats:x})]})},$=X;export{$ as R};
