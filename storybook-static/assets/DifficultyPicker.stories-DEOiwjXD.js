import{j as l}from"./jsx-runtime-DFAAy_2V.js";import"./index-Bc2G9s8g.js";const h=[{value:3,label:"3 варианта"},{value:4,label:"4 варианта"},{value:5,label:"5 вариантов"},{value:6,label:"6 вариантов"}];function d({value:g,onChange:f}){return l.jsx("div",{className:"difficulty-picker",role:"group","aria-label":"Сложность",children:h.map(e=>l.jsx("button",{type:"button",className:e.value===g?"active":"",onClick:()=>f(e.value),children:e.label},e.value))})}d.__docgenInfo={description:"",methods:[],displayName:"DifficultyPicker",props:{value:{required:!0,tsType:{name:"union",raw:"3 | 4 | 5 | 6",elements:[{name:"literal",value:"3"},{name:"literal",value:"4"},{name:"literal",value:"5"},{name:"literal",value:"6"}]},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: DifficultyLevel) => void",signature:{arguments:[{type:{name:"union",raw:"3 | 4 | 5 | 6",elements:[{name:"literal",value:"3"},{name:"literal",value:"4"},{name:"literal",value:"5"},{name:"literal",value:"6"}]},name:"value"}],return:{name:"void"}}},description:""}}};const x={component:d,title:"DifficultyPicker"},a={args:{value:4,onChange:()=>{}}},r={args:{value:3,onChange:()=>{}}},n={args:{value:6,onChange:()=>{}}};var t,s,i;a.parameters={...a.parameters,docs:{...(t=a.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    value: 4,
    onChange: () => {}
  }
}`,...(i=(s=a.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};var o,u,c;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    value: 3,
    onChange: () => {}
  }
}`,...(c=(u=r.parameters)==null?void 0:u.docs)==null?void 0:c.source}}};var m,p,v;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    value: 6,
    onChange: () => {}
  }
}`,...(v=(p=n.parameters)==null?void 0:p.docs)==null?void 0:v.source}}};const C=["Default","ThreeOptions","SixOptions"];export{a as Default,n as SixOptions,r as ThreeOptions,C as __namedExportsOrder,x as default};
