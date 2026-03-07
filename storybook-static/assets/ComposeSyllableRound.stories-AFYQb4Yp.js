import{C as w}from"./ComposeSyllableRoundView-DKtWF9Ry.js";import"./jsx-runtime-DFAAy_2V.js";import"./index-Bc2G9s8g.js";const o={type:"composeSyllable",target:"НО",letters:["О","Н"]},V={component:w,title:"tasks/ComposeSyllable/View",args:{round:o,onStart:()=>{},onDropToSlot:()=>{},onDropToPool:()=>{}}},e={args:{round:o,slots:[null,null],pool:["О","Н"],status:"idle",hasStarted:!1,spoken:!1}},s={args:{round:o,slots:[null,null],pool:["О","Н"],status:"idle",hasStarted:!0,spoken:!0}},t={args:{round:o,slots:["Н",null],pool:["О"],status:"idle",hasStarted:!0,spoken:!0}},r={args:{round:{type:"composeSyllable",target:"МА",letters:["М","А"]},slots:[null,null],pool:["М","А"],status:"idle",hasStarted:!0,spoken:!0}};var a,n,l,u,d;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    round: defaultRound,
    slots: [null, null],
    pool: ['О', 'Н'],
    status: 'idle',
    hasStarted: false,
    spoken: false
  }
}`,...(l=(n=e.parameters)==null?void 0:n.docs)==null?void 0:l.source},description:{story:"Кнопка «Начать», раунд ещё не начат.",...(d=(u=e.parameters)==null?void 0:u.docs)==null?void 0:d.description}}};var p,c,i,m,S;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    round: defaultRound,
    slots: [null, null],
    pool: ['О', 'Н'],
    status: 'idle',
    hasStarted: true,
    spoken: true
  }
}`,...(i=(c=s.parameters)==null?void 0:c.docs)==null?void 0:i.source},description:{story:"Раунд начат, слоты пустые, можно перетаскивать.",...(S=(m=s.parameters)==null?void 0:m.docs)==null?void 0:S.description}}};var g,f,y,k,h;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    round: defaultRound,
    slots: ['Н', null],
    pool: ['О'],
    status: 'idle',
    hasStarted: true,
    spoken: true
  }
}`,...(y=(f=t.parameters)==null?void 0:f.docs)==null?void 0:y.source},description:{story:"Частично собранный слог.",...(h=(k=t.parameters)==null?void 0:k.docs)==null?void 0:h.description}}};var b,R,D,C,P;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    round: {
      type: 'composeSyllable',
      target: 'МА',
      letters: ['М', 'А']
    },
    slots: [null, null],
    pool: ['М', 'А'],
    status: 'idle',
    hasStarted: true,
    spoken: true
  }
}`,...(D=(R=r.parameters)==null?void 0:R.docs)==null?void 0:D.source},description:{story:"Раунд «МА» с тремя буквами.",...(P=(C=r.parameters)==null?void 0:C.docs)==null?void 0:P.description}}};const _=["Default","Started","Partial","Ma"];export{e as Default,r as Ma,t as Partial,s as Started,_ as __namedExportsOrder,V as default};
