webpackJsonp([1],{NHnr:function(s,t,e){"use strict";function n(s){e("w8GV")}Object.defineProperty(t,"__esModule",{value:!0});var i=e("7+uW"),o={data:function(){return{quiz:null,questionIndex:0,userResponses:null,isActive:!1}},filters:{charIndex:function(s){return String.fromCharCode(97+s)}},methods:{restart:function(){this.questionIndex=0,this.userResponses=Array(this.quiz.questions.length).fill(null)},selectOption:function(s){this.$set(this.userResponses,this.questionIndex,s)},next:function(){this.questionIndex<this.quiz.questions.length&&this.questionIndex++},prev:function(){this.quiz.questions.length>0&&this.questionIndex--},score:function(){for(var s=0,t=0;t<this.userResponses.length;t++)void 0!==this.quiz.questions[t].responses[this.userResponses[t]]&&this.quiz.questions[t].responses[this.userResponses[t]].correct&&(s+=1);return s}},created:function(){this.quiz=window.quiz,this.userResponses=Array(this.quiz.questions.length).fill(null)}},u=function(){var s=this,t=s.$createElement,e=s._self._c||t;return e("section",{staticClass:"container"},[e("div",{staticClass:"questionBox",attrs:{id:"app"}},[e("transition",{attrs:{duration:{enter:500,leave:300},"enter-active-class":"animated zoomIn","leave-active-class":"animated zoomOut",mode:"out-in"}},[s.questionIndex<s.quiz.questions.length?e("div",{key:s.questionIndex,staticClass:"questionContainer"},[e("header",[e("div",{staticClass:"progressContainer"},[e("progress",{staticClass:"progress is-info is-small",attrs:{max:"100"},domProps:{value:s.questionIndex/s.quiz.questions.length*100}},[s._v("\n              "+s._s(s.questionIndex/s.quiz.questions.length*100)+"%\n            ")]),s._v(" "),e("p",[s._v(s._s(s.questionIndex/s.quiz.questions.length*100)+"% аяқталды")])])]),s._v(" "),e("h2",{staticClass:"titleContainer title"},[s._v(s._s(s.quiz.questions[s.questionIndex].text))]),s._v(" "),e("div",{staticClass:"optionContainer"},s._l(s.quiz.questions[s.questionIndex].responses,function(t,n){return e("div",{key:n,staticClass:"option",class:{"is-selected":s.userResponses[s.questionIndex]==n},on:{click:function(t){return s.selectOption(n)}}},[s._v("\n            "+s._s(s._f("charIndex")(n))+". "+s._s(t.text)+"\n          ")])}),0),s._v(" "),e("footer",{staticClass:"questionFooter"},[e("nav",{staticClass:"pagination",attrs:{role:"navigation","aria-label":"pagination"}},[e("a",{staticClass:"button",attrs:{disabled:s.questionIndex<1},on:{click:function(t){return s.prev()}}},[s._v("\n              Артқа\n            ")]),s._v(" "),e("a",{staticClass:"button",class:null==s.userResponses[s.questionIndex]?"":"is-active",attrs:{disabled:s.questionIndex>=s.quiz.questions.length},on:{click:function(t){return s.next()}}},[s._v("\n              "+s._s(null==s.userResponses[s.questionIndex]?"Өткізіп жіберу":"Келесі")+"\n            ")])])])]):s._e(),s._v(" "),s.questionIndex>=s.quiz.questions.length?e("div",{key:s.questionIndex,staticClass:"quizCompleted has-text-centered"},[e("span",{staticClass:"icon"},[e("i",{staticClass:"fa",class:s.score()>3?"fa-check-circle-o is-active":"fa-times-circle"})]),s._v(" "),e("p",{staticClass:"subtitle"},[s._v("\n          Жалпы бағасы: "+s._s(s.score())+" / "+s._s(s.quiz.questions.length)+"\n        ")]),s._v(" "),e("br"),s._v(" "),e("a",{staticClass:"button",on:{click:function(t){return s.restart()}}},[s._v("қайтадан "),e("i",{staticClass:"fa fa-refresh"})])]):s._e()])],1)])},a=[],r={render:u,staticRenderFns:a},l=r,c=e("VU/8"),q=n,d=c(o,l,!1,q,null,null),p=d.exports;i.a.config.productionTip=!1,new i.a({el:"#app",template:"<App/>",components:{App:p}})},w8GV:function(s,t){}},["NHnr"]);
//# sourceMappingURL=app.8821189ebc73af9019c9.js.map