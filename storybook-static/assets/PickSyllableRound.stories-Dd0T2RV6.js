import{P as h}from"./PickSyllableRoundView-DMDABQJi.js";import"./jsx-runtime-DFAAy_2V.js";import"./index-Bc2G9s8g.js";const o={type:"pickSyllable",target:"НА",options:["НО","НА","КА","КУ","НУ"]},P={component:h,title:"tasks/PickSyllable/View",args:{round:o,onStart:()=>{},onChoose:()=>{}}},t={args:{round:o,options:o.options,status:"idle",hasStarted:!1,spoken:!1}},e={args:{round:o,options:o.options,status:"idle",hasStarted:!0,spoken:!0}},s={args:{round:{type:"pickSyllable",target:"МА",options:["МА","МО","МУ"]},options:["МА","МО","МУ"],status:"idle",hasStarted:!0,spoken:!0}};var r,a,n,p,d;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: {
    round: defaultRound,
    options: defaultRound.options,
    status: 'idle',
    hasStarted: false,
    spoken: false
  }
}`,...(n=(a=t.parameters)==null?void 0:a.docs)==null?void 0:n.source},description:{story:"Кнопка «Начать», раунд ещё не начат.",...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.description}}};var i,u,c,l,m;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    round: defaultRound,
    options: defaultRound.options,
    status: 'idle',
    hasStarted: true,
    spoken: true
  }
}`,...(c=(u=e.parameters)==null?void 0:u.docs)==null?void 0:c.source},description:{story:"Раунд начат, можно выбирать слог.",...(m=(l=e.parameters)==null?void 0:l.docs)==null?void 0:m.description}}};var S,f,g,k,y;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    round: {
      type: 'pickSyllable',
      target: 'МА',
      options: ['МА', 'МО', 'МУ']
    },
    options: ['МА', 'МО', 'МУ'],
    status: 'idle',
    hasStarted: true,
    spoken: true
  }
}`,...(g=(f=s.parameters)==null?void 0:f.docs)==null?void 0:g.source},description:{story:"Меньше вариантов (3).",...(y=(k=s.parameters)==null?void 0:k.docs)==null?void 0:y.description}}};const w=["Default","Started","ThreeOptions"];export{t as Default,e as Started,s as ThreeOptions,w as __namedExportsOrder,P as default};
