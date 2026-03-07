import{P as W}from"./PairSyllableRoundView-DgSJ6Rey.js";import"./jsx-runtime-DFAAy_2V.js";import"./index-Bc2G9s8g.js";import"./letters-DF6vHs0G.js";const e={type:"pairSyllable",syllables:["МА","НО","КУ"],targetFind:"МА"},_=[{id:"l1",letter:"М",position:{x:20,y:25}},{id:"l2",letter:"А",position:{x:55,y:20}},{id:"l3",letter:"Н",position:{x:30,y:50}},{id:"l4",letter:"О",position:{x:65,y:45}},{id:"l5",letter:"К",position:{x:45,y:70}},{id:"l6",letter:"У",position:{x:75,y:65}}],C=[{id:"s1",syllable:"МА"},{id:"s2",syllable:"НО"}],z={component:W,title:"tasks/PairSyllable/View",args:{round:e,onStart:()=>{},onDropOnLetter:()=>{},onChooseSyllable:()=>{}}},r={args:{round:e,phase:"pairing",letters:[],formedSyllables:[],hasStarted:!1,spoken:!1,wrongSyllableId:null}},s={args:{round:e,phase:"pairing",letters:_,formedSyllables:[],hasStarted:!0,spoken:!0,wrongSyllableId:null}},n={args:{round:e,phase:"pairing",letters:[{id:"l5",letter:"К",position:{x:45,y:70}},{id:"l6",letter:"У",position:{x:75,y:65}}],formedSyllables:C,hasStarted:!0,spoken:!0,wrongSyllableId:null}},l={args:{round:e,phase:"finding",letters:[],formedSyllables:[{id:"s1",syllable:"МА"},{id:"s2",syllable:"НО"},{id:"s3",syllable:"КУ"}],hasStarted:!0,spoken:!0,wrongSyllableId:null}},a={args:{round:e,phase:"finding",letters:[],formedSyllables:[{id:"s1",syllable:"МА"},{id:"s2",syllable:"НО"},{id:"s3",syllable:"КУ"}],hasStarted:!0,spoken:!0,wrongSyllableId:"s2"}};var t,o,d,i,p;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    round: defaultRound,
    phase: 'pairing',
    letters: [],
    formedSyllables: [],
    hasStarted: false,
    spoken: false,
    wrongSyllableId: null
  }
}`,...(d=(o=r.parameters)==null?void 0:o.docs)==null?void 0:d.source},description:{story:"Кнопка «Начать», раунд ещё не начат.",...(p=(i=r.parameters)==null?void 0:i.docs)==null?void 0:p.description}}};var u,c,y,m,g;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    round: defaultRound,
    phase: 'pairing',
    letters: sampleLetters,
    formedSyllables: [],
    hasStarted: true,
    spoken: true,
    wrongSyllableId: null
  }
}`,...(y=(c=s.parameters)==null?void 0:c.docs)==null?void 0:y.source},description:{story:"Раунд начат, фаза сборки: буквы разбросаны, можно перетаскивать.",...(g=(m=s.parameters)==null?void 0:m.docs)==null?void 0:g.description}}};var S,b,f,h,w;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    round: defaultRound,
    phase: 'pairing',
    letters: [{
      id: 'l5',
      letter: 'К',
      position: {
        x: 45,
        y: 70
      }
    }, {
      id: 'l6',
      letter: 'У',
      position: {
        x: 75,
        y: 65
      }
    }],
    formedSyllables: sampleFormed,
    hasStarted: true,
    spoken: true,
    wrongSyllableId: null
  }
}`,...(f=(b=n.parameters)==null?void 0:b.docs)==null?void 0:f.source},description:{story:"Частично собраны пары: два слога готовы, буквы К и У остались.",...(w=(h=n.parameters)==null?void 0:h.docs)==null?void 0:w.description}}};var x,k,I,P,F;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    round: defaultRound,
    phase: 'finding',
    letters: [],
    formedSyllables: [{
      id: 's1',
      syllable: 'МА'
    }, {
      id: 's2',
      syllable: 'НО'
    }, {
      id: 's3',
      syllable: 'КУ'
    }],
    hasStarted: true,
    spoken: true,
    wrongSyllableId: null
  }
}`,...(I=(k=l.parameters)==null?void 0:k.docs)==null?void 0:I.source},description:{story:"Фаза «Найди слог»: три собранных слога, нужно кликнуть на целевой.",...(F=(P=l.parameters)==null?void 0:P.docs)==null?void 0:F.description}}};var R,D,L,O,V;a.parameters={...a.parameters,docs:{...(R=a.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    round: defaultRound,
    phase: 'finding',
    letters: [],
    formedSyllables: [{
      id: 's1',
      syllable: 'МА'
    }, {
      id: 's2',
      syllable: 'НО'
    }, {
      id: 's3',
      syllable: 'КУ'
    }],
    hasStarted: true,
    spoken: true,
    wrongSyllableId: 's2'
  }
}`,...(L=(D=a.parameters)==null?void 0:D.docs)==null?void 0:L.source},description:{story:"Фаза finding после неверного клика (подсветка wrong).",...(V=(O=a.parameters)==null?void 0:O.docs)==null?void 0:V.description}}};const A=["Default","Pairing","PartialPairs","Finding","FindingWrong"];export{r as Default,l as Finding,a as FindingWrong,s as Pairing,n as PartialPairs,A as __namedExportsOrder,z as default};
