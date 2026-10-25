(function(root){
'use strict';
const sectors=[
 {name:'企业软件',from:1990,icon:'ES',desc:'给工厂和企业做财务、生产管理软件',edge:'经常性收入',risk:'实施周期长'},
 {name:'精密制造',from:1990,icon:'PM',desc:'做自动化设备和精密零件',edge:'技术壁垒',risk:'资本开支高'},
 {name:'消费品牌',from:1990,icon:'CB',desc:'把消费品卖进门店和经销渠道',edge:'渠道复购',risk:'库存占用资金'},
 {name:'通信设备',from:1990,icon:'TE',desc:'给运营商和企业供应通信设备',edge:'基础设施需求',risk:'客户集中'},
 {name:'互联网',from:1995,icon:'IN',desc:'替买卖双方搭建线上交易和服务平台',edge:'网络效应',risk:'盈利模式待验证'},
 {name:'生物科技',from:1998,icon:'BT',desc:'做检测试剂、诊断设备和生物工艺产品',edge:'知识产权',risk:'研发失败风险'},
 {name:'移动应用',from:2007,icon:'MA',desc:'在手机上做生活和企业服务',edge:'用户增长',risk:'获客成本攀升'},
 {name:'清洁能源',from:2005,icon:'CE',desc:'做储能设备和能源管理产品',edge:'能源转型',risk:'产能周期'},
 {name:'人工智能',from:2016,icon:'AI',desc:'用算法替企业处理文档、客服和生产业务',edge:'生产效率',risk:'算力成本与竞争'}
];
// The first horizon remains unchanged until the player explicitly continues.
function endYear(s){return isContinuous(s)||s.continuation?2050:2026;}
const futureEras=[
 {from:2027,to:2029,name:'智能化落地',headline:'试点结束，客户开始算投入产出。',text:'企业采购开始要求交付与回款。智能软件、工业自动化和诊断工具争取长期合同，试用热度逐渐让位于真实订单。',hot:['人工智能','企业软件','生物科技'],m:1.08,exit:.16},
 {from:2030,to:2032,name:'扩张与拥挤',headline:'同一张订单，桌上摆着更多报价。',text:'设备和算力项目加快扩产，融资估值走高。客户选择变多，降价、营销和设备投入也开始挤压现金。',hot:['人工智能','精密制造','通信设备'],m:1.2,exit:.19},
 {from:2033,to:2034,name:'投资退潮',headline:'新钱慢下来，旧账还要照付。',text:'扩产留下的开支还在，买方却开始压价。融资和退出窗口收窄，企业要靠经营回款撑过订单调整。',hot:['消费品牌','企业软件'],m:.63,exit:.04},
 {from:2035,to:2038,name:'制造与医疗升级',headline:'活下来的团队，重新拿到了订单。',text:'产线改造和诊断服务带来新需求。客户先核查交付和售后，再签长期采购；扩张仍要和周转能力相配。',hot:['精密制造','生物科技','企业软件'],m:1.07,exit:.16},
 {from:2039,to:2041,name:'能源系统重构',headline:'园区要更稳的电，也要更低的成本。',text:'储能、能源调度与通信设备迎来采购周期。项目建设和验收耗时，收入增长时也要盯住应收款与债务。',hot:['清洁能源','通信设备','精密制造'],m:1.16,exit:.18},
 {from:2042,to:2043,name:'信用与订单收缩',headline:'客户推迟采购，银行重新审视授信。',text:'设备订单和融资同时收紧，退出报价减少。过去加速扩张的公司承受更重的固定开支，现金储备开始决定选择。',hot:['消费品牌','移动应用'],m:.7,exit:.055},
 {from:2044,to:2047,name:'服务与效率复苏',headline:'采购恢复了，客户更挑剔了。',text:'软件、医疗和本地服务重新争取预算。复购、稳定毛利与交付效率成为竞争重点，留下来的企业也要持续改进。',hot:['企业软件','生物科技','移动应用'],m:1.05,exit:.15},
 {from:2048,to:2050,name:'成熟市场再平衡',headline:'增长放慢，分红与退出回到桌面。',text:'成熟市场仍有新团队，但客户不再为演示轻易付钱。股东更关心经营现金、持续分红和能真正成交的退出价格。',hot:['人工智能','清洁能源','消费品牌'],m:.97,exit:.12}
];
function era(year){
 const future=futureEras.find(e=>year>=e.from&&year<=e.to);if(future)return future;
 if(year>=2023)return {name:'智能化浪潮',headline:'做模型的团队来了，客户还在问能省多少钱。',text:'人工智能项目报来的估值不低。试用和演示很热闹，长期付费的订单仍要一笔笔谈。',hot:['人工智能','企业软件'],m:1.1,exit:.16};
 if(year>=2020)return {name:'重塑与分化',headline:'有的客户停了单，有的业务突然忙起来。',text:'远程办公、供应链变动和医疗需求，把企业拉向了不同方向。去年排好的扩张计划，今年得重新算一遍现金。',hot:['企业软件','生物科技','清洁能源'],m:.91,exit:.1};
 if(year>=2014)return {name:'平台与产业升级',headline:'客户没那么容易买单了。',text:'移动项目仍在找钱，企业客户则更关心效率和交付。软件、能源和新技术团队，陆续带着订单来谈融资。',hot:['人工智能','移动应用','清洁能源'],m:1.06,exit:.18};
 if(year>=2009)return {name:'移动互联',headline:'手机应用的融资材料，开始堆满桌面。',text:'做软件的人转去做应用，商家也在寻找新的获客渠道。项目增长很快，营销和人员开支也跟着涨。',hot:['移动应用','互联网'],m:1.13,exit:.18};
 if(year>=2008)return {name:'全球金融危机',headline:'买方还在，愿意出的价格却少了很多。',text:'2008 年，金融危机传到企业账上。融资更贵，退出更难谈，原先排好的扩张计划只能重新盘算。',hot:['消费品牌'],m:.56,exit:.025};
 if(year>=2003)return {name:'复苏与重建',headline:'能接到订单的企业，又有人愿意谈了。',text:'基金收到的材料里，多了交付记录和续约客户。软件、制造与互联网公司，陆续回来谈融资。',hot:['企业软件','互联网','清洁能源'],m:1.08,exit:.16};
 if(year>=2000)return {name:'互联网泡沫破裂',headline:'上一轮还在抢项目的人，开始压价了。',text:'2000 年，互联网泡沫破了。下一轮融资迟迟没来，股东也难以脱手，企业得靠订单和现金再撑一阵。',hot:['精密制造','消费品牌'],m:.67,exit:.045};
 if(year>=1995)return {name:'互联网兴起',headline:'做网站的人多了，报来的估值也高了。',text:'互联网和通信项目扎堆出现。有人已经接到订单，也有人还在讲用户会如何增长。创始人对价格都很有信心。',hot:['互联网','通信设备'],m:1.18,exit:.17};
 return {name:'产业数字化起步',headline:'工厂开始买软件，通信设备也有了新订单。',text:'创业团队带着样品来找钱，客户还在慢慢谈。软件、通信和制造的案子，陆续送到了基金。',hot:['企业软件','通信设备'],m:1.03,exit:.13};
}
const profiles={
 '企业软件':{cost:.22,rnd:.13,salary:1.8,multiple:4,wc:.06,capex:.015},
 '精密制造':{cost:.59,rnd:.06,salary:1.5,multiple:2.5,wc:.18,capex:.05},
 '消费品牌':{cost:.49,rnd:.02,salary:1.3,multiple:2.6,wc:.15,capex:.025},
 '通信设备':{cost:.48,rnd:.10,salary:1.7,multiple:3.2,wc:.14,capex:.04},
 '互联网':{cost:.25,rnd:.10,salary:1.9,multiple:4.6,wc:.05,capex:.015},
 '生物科技':{cost:.30,rnd:.23,salary:2.1,multiple:4.8,wc:.10,capex:.045},
 '移动应用':{cost:.23,rnd:.12,salary:1.9,multiple:4.5,wc:.04,capex:.015},
 '清洁能源':{cost:.53,rnd:.09,salary:1.7,multiple:3.2,wc:.17,capex:.05},
 '人工智能':{cost:.38,rnd:.18,salary:2.2,multiple:5,wc:.06,capex:.03}
};
const roles={
 research:{name:'行业研究员',code:'行业研究',salary:[0,8,16,30],entry:8,training:[0,0,15,30],description:'替基金跑行业、找项目。随资历提升，每年多带回 1 / 2 / 3 个案子，并附一份初步评分。'},
 diligence:{name:'尽调专家',code:'独立尽调',salary:[0,10,20,36],entry:10,training:[0,0,18,35],description:'核查创始人递来的材料。在岗期间的项目尽调已含薪酬，不另收费；已尽调项目可免费补全报告。晋升后判断更准，并逐级补充经营压力测算。'},
 operations:{name:'投后经理',code:'投后管理',salary:[0,14,28,48],entry:14,training:[0,0,22,40],description:'先去现金最紧的企业盯经营，按资历同时照看 3 / 6 / 10 家。能帮企业留客户、压成本，也能替并购后的整合分担一些麻烦。'},
 exit:{name:'退出顾问',code:'退出交易',salary:[0,12,24,42],entry:12,training:[0,0,20,36],description:'替基金找买方、谈价钱。有他跟进，退出更容易谈成，主动转让和到期处置也能少让一些价。'}
};
const strategies={balanced:{name:'均衡经营',growth:0,marketing:1,rnd:1,capex:1},expand:{name:'加速扩张',growth:.09,marketing:1.5,rnd:1.25,capex:1.4},defend:{name:'保现金',growth:-.08,marketing:.55,rnd:.65,capex:.65}};
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function rng(s){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296;}
function log(s,text,type='info'){s.logs.unshift({year:s.year,text,type});}
function emptyTeam(){return Object.fromEntries(Object.keys(roles).map(k=>[k,{level:0,active:false,years:0,paidYear:null}]));}
function level(s,key){const t=s.team[key];return t.active&&t.paidYear===s.year?t.level:0;}
function payroll(s){return Object.keys(roles).reduce((n,k)=>n+(s.team[k].active?roles[k].salary[s.team[k].level]:0),0);}
function expense(s,amount,category){s.cash=Math.max(0,s.cash-amount);s.expenses+=amount;s.expenseBreakdown[category]+=amount;}
function nav(s){return s.cash+s.portfolio.filter(c=>c.status==='active').reduce((n,c)=>n+c.value*c.equity,0);}
function record(s){const p={year:s.year,nav:nav(s),cash:s.cash};if(s.history.at(-1)?.year===s.year)s.history[s.history.length-1]=p;else s.history.push(p);}
function runway(c){c.runway=c.cashFlow<0?clamp(Math.floor(c.cash/(-c.cashFlow)*12),0,120):120;}
// New funds use economic rules 12. Absence of this marker preserves every old campaign.
function modern(c){return c.economyVersion===12;}
function deliveryLoad(c,revenue=c.revenue){return revenue/Math.max(1,c.team*(11+c.quality*9)*effectiveCapacity(c));}
function plannedTeam(c,revenue,strategy=c.strategy){
 if(!modern(c))return c.team;
 if(strategy==='expand')return Math.min(10000,c.team+Math.max(1,Math.ceil(c.team*.18)));
 if(strategy==='defend')return Math.max(3,Math.floor(c.team*.92));
 const needed=Math.ceil(revenue/Math.max(1,(11+c.quality*9)*effectiveCapacity(c)));
 return Math.min(10000,c.team+Math.max(0,Math.min(needed-c.team,Math.max(1,Math.ceil(c.team*.1)))));
}
function costs(c,revenue,support=0,supplyShock=0,teamOpening=c.team){
 const p=profiles[c.sector],st=strategies[c.strategy];
 const delivery=modern(c)?clamp(deliveryLoad(c,revenue)-1,0,2)*.12:0;
 const variableCost=revenue*clamp(c.costRate+delivery+capacityLoss(c)*.06-(c.technologyBonus||0)*.08-(c.mergerSynergy||0)+(c.competition-.4)*.12-support*.018+supplyShock,.12,.90);
 const coordination=modern(c)?clamp(Math.log(Math.max(1,c.team/25))*.14,0,.5):0;
 const hiring=modern(c)?Math.max(0,c.team-teamOpening)*p.salary*.6:0;
 const baseDeliveryRate=c.costRate+capacityLoss(c)*.06-(c.technologyBonus||0)*.08-(c.mergerSynergy||0)+(c.competition-.4)*.12-support*.018+supplyShock;
 const deliveryPremium=modern(c)?Math.max(0,variableCost-revenue*clamp(baseDeliveryRate,.12,.90)):0;
 const payrollCost=c.team*p.salary*(1+coordination)*(1-support*.035)+hiring;
 const marketing=revenue*(.06+c.competition*.09)*st.marketing;
 const rnd=revenue*p.rnd*st.rnd;
 const expansionOverhead=modern(c)?revenue*Math.min(.072,Math.max(0,(c.expansionStreak||0)-1)*.012)*(1.15-c.quality*.5):0;
 const scaleOverhead=modern(c)?revenue*clamp(Math.log(Math.max(1,revenue/300))*(.045+(1-c.quality)*.05),0,.22):0;
 const ventureBurn=c.ventureRisk?revenue*c.ventureRisk.burnRate*(c.strategy==='defend'?.55:c.strategy==='expand'?1.25:1)*(1-support*.05):0;
 const overhead=ventureBurn+scaleOverhead+expansionOverhead+(6+Math.sqrt(revenue)*.3)*(1-support*.04)*Math.min(1,(c.overheadRetention??1)+(c.rebuildOverhead||0))*(1-capacityLoss(c)*.15)+(c.rebuiltCapital||0)*.02;
 return {...(c.ventureRisk?{ventureBurn}:{}),variableCost,payrollCost,marketing,rnd,overhead,total:variableCost+payrollCost+marketing+rnd+overhead,...(modern(c)?{deliveryPremium,hiringCost:hiring,coordinationCost:c.team*p.salary*coordination*(1-support*.035),expansionOverhead,scaleOverhead}: {})};
}
function financials(c,year,legacy=false){
 const p=profiles[c.sector];c.strategy='balanced';c.competition=clamp(.45+(c.volatility-.55)*.6,.2,.8);c.costRate=clamp(p.cost+(.6-c.quality)*.07,.12,.85);
 const k=costs(c,c.revenue);c.costs=k.total;c.profit=c.revenue-c.costs;c.capex=c.revenue*p.capex;c.workingCapital=0;c.cashFlow=c.profit-c.capex;
 c.cash=Math.max(15,c.cashFlow<0?-c.cashFlow*Math.max(7,c.runway)/12:c.revenue*.35);c.profitYears=c.profit>0?1:0;c.ddLevel=c.dd?0:-1;
 c.financialHistory=[{year,revenue:c.revenue,...k,costs:c.costs,profit:c.profit,capex:c.capex,workingCapital:0,cashFlow:c.cashFlow,cashOpening:c.cash,cash:c.cash,financing:0,competition:c.competition,value:c.value,growth:c.growth,support:0,strategy:'balanced',opening:true,event:legacy?'旧档迁移期初估算，历史收益未改动':'融资前经营资料'}];runway(c);
}
function debtBalance(c){return (c.loans||[]).reduce((n,l)=>n+l.balance,0);}
function debtDue(c){return (c.loans||[]).reduce((n,l)=>n+(l.due||0),0);}
function debtService(c){return (c.loans||[]).filter(l=>!l.defaulted).reduce((n,l)=>n+l.balance*l.rate+l.balance/Math.max(1,l.remaining),0);}
function financeFields(c){c.loans=[];c.pendingLoanDrawdown=0;c.pendingEquityRaise=0;c.interestExpense=0;}
function workoutFields(c){c.distress=null;c.workouts=[];c.workoutYear=null;c.rescueYear=null;c.pendingRescueEquity=0;c.pendingWorkoutFee=0;c.pendingNoncashFee=0;c.pendingRescuePrincipal=0;c.pendingDebtConversion=0;}
function underPressure(c){return !!c.capital?.extension?.delisted||!!c.distress||c.cash<Math.max(20,Math.max(0,-c.cashFlow)*.5)+debtService(c)||debtDue(c)>1e-7;}
function workoutQuote(s,id,mode,amount=null){
 const c=s.portfolio.find(c=>c.id===id&&c.status==='active');if(!c||s.ended||s.year>=endYear(s))return {ok:false,reason:'这笔投资已结束，或已经到了清算年'};
 if(!['extend','convert','rescue'].includes(mode))return {ok:false,reason:'这份处置方案不能办理'};
 const debt=debtBalance(c),due=debtDue(c),buffer=Math.max(20,Math.max(0,-c.cashFlow)*.5)+debtService(c),pre=Math.max(1,c.value*.65),ceil=n=>Math.ceil(n*10)/10;
 let fee=0,raise=0,converted=0,afterDebt=debt,afterEquity=c.equity,afterCash=c.cash,service=debtService(c),changes=[],principal=0;
 const riskyRescue=quarterly(s)&&mode==='rescue'&&!!c.distress,successRate=riskyRescue?clamp(.08+c.quality*.18+level(s,'operations')*.015-Math.min(.08,debt/Math.max(1,c.revenue)*.02)-Math.min(.06,creditLeverage(c)*.005),.08,.30):null;
 const minimum=ceil(Math.max(0,buffer+due-c.cash)/(riskyRescue?.90:.98));
 let reason=!underPressure(c)?'企业现有现金能覆盖经营和下期本息，暂时用不着救助':mode!=='rescue'&&c.workoutYear===s.year?'今年已经谈过一次债务；若还缺钱，只能再由基金注资':mode==='rescue'&&c.rescueYear===s.year?'今年基金已经救助过一次，不能再追加':'';
 if(mode==='extend'){
  for(const l of c.loans){const remaining=Math.min(l.remaining+2,endYear(s)-s.year);if(l.balance>1e-7&&!l.defaulted&&!(l.extensions||0)&&remaining>l.remaining){const charge=ceil(l.balance*.02);changes.push({id:l.id,fee:charge,remaining,rate:Math.min(.24,l.rate+.02),maturity:s.year+remaining});fee+=charge;}}
  if(!changes.length&&!reason)reason=`没有还能展期的贷款了。每笔只能延一次，最迟到 ${endYear(s)} 年`;
  afterDebt+=fee;service=c.loans.reduce((n,l)=>{const v=changes.find(x=>x.id===l.id);return n+(v?(l.balance+v.fee)*(v.rate+1/v.remaining):l.defaulted?0:l.balance*(l.rate+1/Math.max(1,l.remaining)));},0);
 }else if(mode==='convert'){
  if(debt<=1e-7&&!reason)reason='企业已经没有贷款可转成股权';
  if(c.quality<.35&&!reason)reason='债权人看过企业的经营情况，不愿用债权换股权';
  fee=ceil(debt*.02);converted=debt;afterDebt=0;afterEquity=c.equity*pre/(pre+debt+fee);service=0;
 }else{
  raise=amount===null?minimum:amount;fee=raise*.02;principal=Math.min(due,Math.max(0,c.cash+raise-fee));afterCash=c.cash+raise-fee-(riskyRescue?raise*.08:0)-principal;afterDebt-=principal;afterEquity=(c.equity*pre+raise)/(pre+raise);
  if((!Number.isFinite(raise)||raise<=0||raise+1e-7<minimum)&&!reason)reason='这笔钱还不够还到期本金、付费用并留出周转金';
  if(raise>s.cash+1e-7&&!reason)reason='基金账上不够，接不下这笔救助';
  let toPay=principal;service=c.loans.reduce((n,l)=>{const paid=Math.min(l.due,toPay);toPay-=paid;return n+(l.defaulted?0:Math.max(0,l.balance-paid)*(l.rate+1/Math.max(1,l.remaining)));},0);
 }
 const remainingDue=mode==='extend'?c.loans.filter(l=>!changes.some(x=>x.id===l.id)).reduce((n,l)=>n+l.due,0):mode==='convert'?0:Math.max(0,due-principal);
 return {ok:!reason,reason,mode,id,fee,raise,...(riskyRescue?{riskyRescue:true,successRate,successCost:raise*.08,failureCost:raise*.5}:{}),converted,debt,afterDebt,due,principal,minimum,pre,afterEquity,equity:c.equity,cash:c.cash,afterCash,service,changes,remainingDue,resolves:afterCash>0&&remainingDue<=1e-7};
}
function workout(s,id,mode,amount=null){
 const q=workoutQuote(s,id,mode,amount);if(!q.ok)return false;const c=s.portfolio.find(c=>c.id===id),fundBefore=s.cash;
 if(mode==='extend')for(const v of q.changes){const l=c.loans.find(l=>l.id===v.id);l.balance+=v.fee;l.capitalizedFees=(l.capitalizedFees||0)+v.fee;l.remaining=v.remaining;l.term=v.maturity-l.originYear;l.rate=v.rate;l.extensions=1;l.due=0;if(quarterly(s)){const end=Math.min(2050*12,capitalClock(s)+v.remaining*12);l.monthly={start:capitalClock(s),end,installment:l.balance/Math.max(1,end-capitalClock(s))};}}
 if(mode==='convert')for(const l of c.loans){l.convertedPrincipal=(l.convertedPrincipal||0)+l.balance;l.balance=0;l.due=0;l.remaining=0;}
 if(mode==='rescue'){s.cash=Math.max(0,s.cash-q.raise);s.invested+=q.raise;c.invested+=q.raise;c.cash+=q.raise-q.fee;c.pendingRescueEquity+=q.raise;c.pendingRescuePrincipal+=payPrincipal(c);c.rescueYear=s.year;}
 else{c.workoutYear=s.year;c.pendingNoncashFee+=q.fee;}
 c.pendingWorkoutFee+=q.fee;c.pendingDebtConversion+=q.converted;if(c.capital?.public||c.capital?.extension){adjustLocks(c,mode==='rescue'?q.pre/(q.pre+q.raise):c.equity?q.afterEquity/c.equity:1);if(mode==='rescue')addPublicLock(c,q.raise/(q.pre+q.raise),Math.min(2050,s.year+1),expanded(s)?Math.min(2050*12,capitalClock(s)+12):null);}c.equity=q.afterEquity;c.round=null;
 let rescueSucceeded=null;
 if(q.riskyRescue){
  rescueSucceeded=marketRandom(s,c.id+':business-rescue:'+s.year)<q.successRate;
  const cost=rescueSucceeded?q.successCost:q.failureCost;c.cash-=cost;c.pendingWorkoutFee+=cost;
  if(rescueSucceeded){c.strategy='defend';c.team=Math.max(3,Math.min(c.team,Math.ceil(c.revenue/12)));c.expansionStreak=0;}
 }
 if(q.resolves&&rescueSucceeded!==false)c.distress=null;
 c.value=fundamental(c,era(s.year))*(c.integration?.9:1)*(c.distress?.5:1);runway(c);
 const entry={year:s.year,mode,fee:q.fee,raise:q.raise,converted:q.converted,principal:q.principal,debtBefore:q.debt,debtAfter:debtBalance(c),equityBefore:q.equity,equityAfter:c.equity,cashBefore:q.cash,cashAfter:c.cash,fundBefore,fundAfter:s.cash,resolved:!c.distress,changes:q.changes,...(q.riskyRescue?{month:capitalClock(s),successRate:q.successRate,success:rescueSucceeded,restructuringCost:rescueSucceeded?q.successCost:q.failureCost}: {})};c.workouts.push(entry);
 const text=`${c.name} · ${mode==='extend'?'贷款展期':mode==='convert'?'债转股':'基金救助'}：费用 ${q.fee.toFixed(1)} 万，追加 ${q.raise.toFixed(1)} 万，债转股 ${q.converted.toFixed(1)} 万；未偿本金 ${debtBalance(c).toFixed(1)} 万，基金持股 ${(c.equity*100).toFixed(1)}%${q.riskyRescue?(rescueSucceeded?'；抢救成功，转入收缩经营':'；抢救失败，将进入清算'):c.distress?'；钱还是不够，还得继续处理':'；眼前的资金缺口已解决'}。`;
 c.notes.push(`${s.year} 年 ${text}`);log(s,text,'warning');
 if(q.riskyRescue){
  expansionEvent(s,c,'rescue',rescueSucceeded?'追加投资抢救成功，已转入收缩经营；仍需继续控制成本和偿债。':'追加投资抢救失败，重整费用已支出，企业进入资产清算。');
  if(!rescueSucceeded){liquidate(s,id,'assets',null,true);record(s);return true;}
 }
 syncMarket(s,c);record(s);return true;
}

// One terminal disposal. Estimates are recovery values, not an audited asset balance sheet.


// Annual capital allocation: only earned, cash-backed profits may reach shareholders.
const allocationRates=[0,.25,.5,.75,1];
function dividendFields(c){c.dividends=[];c.dividendYear=null;c.dividendReceived=0;c.pendingDividend=0;c.pendingAllocationPrincipal=0;}
function capitalReserve(c,ratio=.5,budget=currentRebuild(c)?.budget||0,includeIntegration=false){
 const operatingReserve=Math.max(30,(c.capital?.extension?.quarterly?.recurringCosts??c.costs)*ratio),service=debtService(c),contingency=budget*.3;
 const integrationReserve=includeIntegration&&c.integration?(c.acquisitions.find(a=>a.targetId===c.integration.targetId)?.planned||0)/2*1.9*c.integration.remaining:0;
 return {operatingReserve,service,contingency,integrationReserve,reserve:operatingReserve+service+contingency+integrationReserve};
}
function dividendQuote(s,id,payout=.5,repay=0){
 const c=s.portfolio.find(x=>x.id===id&&x.status==='active');if(!c||s.ended)return {ok:false,reason:'这笔投资已结束，不能再安排分红'};
 if(!allocationRates.includes(payout)||!allocationRates.includes(repay)||payout+repay>1)return {ok:false,reason:'分红和还债要从同一笔钱里出，合计不能超过 100%'};
 const rows=c.financialHistory.filter(r=>!r.opening&&r.year>c.founded),recent=rows.slice(-2),distributed=(c.dividends||[]).reduce((n,a)=>n+a.dividend,0);
 const earnings=rows.reduce((n,r)=>n+r.profit,0)-distributed-(c.pendingRebuildExpense||0),stable=recent.length===2&&recent[0].year===s.year-1&&recent[1].year===s.year&&recent.every(r=>r.profit>0&&r.cashFlow>0)&&c.profit>0&&c.cashFlow>0;
 const repaymentOnly=payout===0&&repay>0,{operatingReserve,service,contingency,integrationReserve,reserve}=capitalReserve(c,.5,currentRebuild(c)?.budget||0,repaymentOnly);
 const stableCash=stable?Math.min(c.cashFlow,...recent.map(r=>r.cashFlow)):0,pool=Math.max(0,repaymentOnly?c.cash-reserve:Math.min(earnings,stableCash,c.cash-reserve)),dividend=pool*payout,principal=Math.min(debtBalance(c),pool*repay),retained=pool-dividend-principal;
 let reason=c.dividendYear===s.year?'今年的利润已经安排过了，下年再议':c.distress||debtDue(c)>1e-7?'先补上现金和到期本金的缺口':repaymentOnly?(debtBalance(c)<=1e-7?'贷款已经还清了':principal<=1e-7?'这些钱还得留给经营、还债和未完的项目，暂时动不了':''):!stable?'还没连续赚够两年。两年的利润和现金流都要为正，投资前的材料不算':c.integration?'并购还在整合，先把钱留在公司':c.round||c.financialHistory.at(-1)?.financing>0||c.acquisitions.some(a=>a.year===s.year)||c.workoutYear===s.year||c.rescueYear===s.year||c.divestYear===s.year?'今年刚办过融资、并购、重组、救助或出售，分红留到下一年再议':earnings<=1e-7?'过去亏掉的钱还没赚回来，暂时不能分红':pool<=1e-7?'这笔现金还得留着周转、还债和应付项目超支':'';
 return {ok:!reason,reason,id,payout,repay,repaymentOnly,earnings,stableCash,operatingReserve,service,contingency,integrationReserve,reserve,pool,dividend,principal,retained,equity:c.equity,fundProceeds:dividend*c.equity,otherProceeds:dividend*(1-c.equity),cashBefore:c.cash,cashAfter:c.cash-dividend-principal,debtBefore:debtBalance(c),debtAfter:debtBalance(c)-principal};
}
function distribute(s,id,payout=.5,repay=0){
 const q=dividendQuote(s,id,payout,repay);if(!q.ok)return false;const c=s.portfolio.find(x=>x.id===id),payments=repayDisposal(c,q.principal),valueBefore=c.value;
 c.cash-=q.dividend;c.pendingDividend+=q.dividend;c.pendingAllocationPrincipal+=q.principal;c.dividendReceived+=q.fundProceeds;c.dividendYear=s.year;
 // Cash leaves equity at par; keep any existing pricing premium/discount unchanged.
 c.value=Math.max(0,c.value-q.dividend);s.cash+=q.fundProceeds;s.returned+=q.fundProceeds;s.dividends+=q.fundProceeds;
 c.dividends.push({...q,year:s.year,payments,valueBefore,valueAfter:c.value});runway(c);syncMarket(s,c);
 const text=`${c.name} · 利润分配：全体股东分红 ${q.dividend.toFixed(1)} 万，基金按 ${(q.equity*100).toFixed(1)}% 持股收到 ${q.fundProceeds.toFixed(1)} 万；提前还本 ${q.principal.toFixed(1)} 万，可安排资金留存 ${q.retained.toFixed(1)} 万。企业剩余现金 ${c.cash.toFixed(1)} 万，持股不变。`;
 c.notes.push(`${s.year} 年 ${text}`);log(s,text,'success');record(s);return true;
}
function validDividends(c,year,deadline=2026){
 const near=(a,b)=>Math.abs(a-b)<1e-6*Math.max(1,Math.abs(a),Math.abs(b));
 if(!Array.isArray(c.dividends)||c.dividends.length>(c.capital?60:36)||!['dividendReceived','pendingDividend','pendingAllocationPrincipal'].every(k=>Number.isFinite(c[k])&&c[k]>=0)||!(c.dividendYear===null||Number.isInteger(c.dividendYear)&&c.dividendYear>=1990&&c.dividendYear<=year))return false;
 let prev=1989;for(const a of c.dividends){
  if(!a||!Number.isInteger(a.year)||a.year<=prev||a.year>Math.min(year,deadline-1)||!allocationRates.includes(a.payout)||!allocationRates.includes(a.repay)||a.payout+a.repay>1||!['stableCash','operatingReserve','service','contingency','reserve','pool','dividend','principal','retained','equity','fundProceeds','otherProceeds','cashBefore','cashAfter','debtBefore','debtAfter','valueBefore','valueAfter'].every(k=>Number.isFinite(a[k])&&a[k]>=0)||!Number.isFinite(a.earnings)||!(a.repaymentOnly===undefined||typeof a.repaymentOnly==='boolean')||a.repaymentOnly&&(a.payout!==0||a.repay<=0)||!a.repaymentOnly&&a.earnings<0||a.integrationReserve!==undefined&&(!Number.isFinite(a.integrationReserve)||a.integrationReserve<0)||a.equity>1||!Array.isArray(a.payments)||a.payments.length>18)return false;
  if(!near(a.reserve,a.operatingReserve+a.service+a.contingency+(a.integrationReserve||0))||!near(a.pool,Math.max(0,a.repaymentOnly?a.cashBefore-a.reserve:Math.min(a.earnings,a.stableCash,a.cashBefore-a.reserve)))||!near(a.dividend,a.pool*a.payout)||!near(a.principal,Math.min(a.debtBefore,a.pool*a.repay))||!near(a.pool,a.dividend+a.principal+a.retained)||!near(a.fundProceeds,a.dividend*a.equity)||!near(a.dividend,a.fundProceeds+a.otherProceeds)||!near(a.cashBefore,a.cashAfter+a.dividend+a.principal)||!near(a.debtBefore,a.debtAfter+a.principal)||!near(a.valueAfter,Math.max(0,a.valueBefore-a.dividend))||!a.payments.every(x=>x&&typeof x.id==='string'&&c.loans.some(l=>l.id===x.id)&&Number.isFinite(x.paid)&&x.paid>=0)||!near(a.principal,a.payments.reduce((n,x)=>n+x.paid,0)))return false;
  prev=a.year;
 }
 const last=c.dividends.at(-1);return c.dividendYear===(last?.year??null)&&near(c.dividendReceived,c.dividends.reduce((n,a)=>n+a.fundProceeds,0))&&near(c.pendingDividend,c.status==='active'&&last?.year===year?last.dividend:0)&&near(c.pendingAllocationPrincipal,c.status==='active'&&last?.year===year?last.principal:0);
}

const rebuildTypes={rnd:'研发升级',capacity:'产能重建',market:'客户拓展'};
function rebuildFields(c){c.rebuilds=[];c.rebuildYear=null;c.capacityRecovery=0;c.technologyBonus=0;c.marketReach=0;c.rebuiltCapital=0;c.rebuildOverhead=0;c.pendingRebuildExpense=0;c.pendingRebuildCapex=0;}
function effectiveCapacity(c){return Math.min(1.25,(c.assetRetention??1)+(c.capacityRecovery||0));}
function capacityLoss(c){return Math.max(0,1-effectiveCapacity(c));}
function currentRebuild(c){return (c.rebuilds||[]).find(x=>x.status==='进行中');}
function rebuildBudgets(s,c){
 const budgets=[20,50,100];if(!isContinuous(s))return budgets;
 const unit=Math.ceil(Math.max(150,c.revenue*.03)/50)*50;
 for(const amount of [unit,unit*2,unit*4]){const n=Math.min(5000,amount);if(n>100&&!budgets.includes(n))budgets.push(n);}return budgets.sort((a,b)=>a-b);
}
function rebuildQuote(s,id,type='capacity',budget=50){
 const c=s.portfolio.find(x=>x.id===id&&x.status==='active');if(!c||s.ended)return {ok:false,reason:'这笔投资已经结束，不能再开新项目'};
 if(!Object.hasOwn(rebuildTypes,type)||!rebuildBudgets(s,c).includes(budget))return {ok:false,reason:'请重新选一下项目和预算'};
 const scale=budget/Math.max(50,c.revenue*.5),remaining=type==='capacity'?Math.max(0,1.25-effectiveCapacity(c)):type==='rnd'?.15-c.technologyBonus:.4-c.marketReach;
 const gain=isContinuous(s)?Math.min(remaining,(type==='capacity'?.25:type==='rnd'?.08:.24)*(1-Math.exp(-budget/Math.max(80,c.revenue*.1)))):Math.min(remaining,clamp(scale*(type==='capacity'?.2:type==='rnd'?.04:.16),type==='rnd'?.008:.04,type==='rnd'?.08:.3));
 const baseRisk=clamp(.15+(1-c.quality)*.25+c.competition*.12+Math.min(2,debtBalance(c)/Math.max(1,c.revenue))*.06+(isContinuous(s)?Math.max(0,budget/Math.max(80,c.revenue*.1)-1)*.04:0),.08,.6),risk=clamp(baseRisk-rebuildSupport(s,c)*.04,.08,.6),protectDividend=(c.dividends||[]).some(a=>a.year===s.year&&a.dividend>0),reserve=capitalReserve(c,protectDividend?.5:.25,0).reserve,contingency=budget*.3;
 let reason=s.year>endYear(s)-2?`${endYear(s)-1} 年起不再立项，剩下的时间不够完成两年建设`:currentRebuild(c)?'公司还有一个项目没做完；做完或终止后再议':c.rebuildYear===s.year?'今年已经开过一个项目，下一年再议':c.distress||debtDue(c)>1e-7?'先把现金和逾期本金的缺口补上':c.cashFlow<=0?'最近一年还在消耗现金，先把经营稳住':c.divestYear===s.year||c.workoutYear===s.year||c.rescueYear===s.year?'今年刚卖过业务、资产或接受救助，先经营一年再议':c.cash<budget+reserve+contingency?'付完预算，就不够周转、还债和应付超支了':remaining<=1e-7?'这个方向已经做到当前能达到的上限，先看看经营效果':'';
 return {ok:!reason,reason,id,type,budget,gain,baseRisk,risk,reserve,contingency,protectDividend,cashBefore:c.cash,cashAfter:c.cash-budget,capacity:effectiveCapacity(c),technology:c.technologyBonus,reach:c.marketReach};
}
function rebuildSupport(s,c){return supportIds(s).includes(c.id)?level(s,'operations'):0;}
function reinvest(s,id,type='capacity',budget=50){
 const q=rebuildQuote(s,id,type,budget);if(!q.ok)return false;const c=s.portfolio.find(x=>x.id===id);
 c.cash-=budget;if(type==='capacity')c.pendingRebuildCapex+=budget;else c.pendingRebuildExpense+=budget;c.value=Math.max(0,c.value-budget);c.round=null;c.rebuildYear=s.year;
 c.rebuilds.push({year:s.year,type,budget,gain:q.gain,baseRisk:q.baseRisk,stage:0,attempts:0,spent:budget,status:'进行中',endYear:null,events:[]});
 log(s,`${c.name} 启动${rebuildTypes[type]}：企业投入 ${budget} 万，预计两次年度进展完成，最多尝试三年；现金 ${c.cash.toFixed(1)} 万，基金资金与持股不变。`,'investment');runway(c);syncMarket(s,c);record(s);return true;
}
function cancelRebuild(s,id){const c=s.portfolio.find(x=>x.id===id&&x.status==='active'),p=c&&currentRebuild(c);if(s.ended||!p)return false;p.status='主动终止';p.endYear=s.year;log(s,`${c.name} 终止${rebuildTypes[p.type]}，已投入 ${p.spent.toFixed(1)} 万不退回，已形成的能力保留。`,'warning');record(s);return true;}
function progressRebuilds(s,supported,opsLevel){
 for(const c of s.portfolio.filter(x=>x.status==='active')){
  c.rebuiltCapital*=.85;c.marketReach*=.92;const p=currentRebuild(c);if(!p){syncMarket(s,c);continue;}
  const risk=clamp(p.baseRisk-(supported.has(c.id)?opsLevel*.04:0),.08,.6),cashBlocked=c.cash<Math.max(20,debtService(c)),adverse=marketRandom(s,'rebuild:'+c.id+':'+p.year+':'+s.year)<risk;
  let extra=0,gain=0,employees=0,reason='阶段完成';p.attempts++;
  if(cashBlocked)reason='周转钱不够，这一阶段只能推迟';
  else if(adverse){reason='执行出了岔子，这一阶段要晚一年';const charge=p.budget*.1;if(c.cash>=charge+Math.max(20,debtService(c))){extra=charge;c.cash-=extra;p.spent+=extra;if(p.type==='capacity')c.pendingRebuildCapex+=extra;else c.pendingRebuildExpense+=extra;}else reason='项目出了岔子，又拿不出追加预算，只能延期';}
  else{
   p.stage++;gain=p.gain/2;
   if(p.type==='capacity'){gain=Math.min(gain,1.25-effectiveCapacity(c));c.capacityRecovery+=gain;c.rebuiltCapital+=p.budget/2;}
   else if(p.type==='rnd'){gain=Math.min(gain,.15-c.technologyBonus);c.technologyBonus+=gain;}
   else{gain=Math.min(gain,.4-c.marketReach);c.marketReach+=gain;employees=Math.min(10000-c.team,Math.max(1,Math.round(p.budget/40)));c.team+=employees;c.rebuildOverhead=Math.min(1-c.overheadRetention,c.rebuildOverhead+p.gain*.15);}
  }
  p.events.push({year:s.year,risk,adverse,cashBlocked,extra,gain,employees,reason});if(p.stage===2){p.status='已完成';p.endYear=s.year;}else if(p.attempts===3){p.status='受挫终止';p.endYear=s.year;}
  log(s,`${c.name} · ${rebuildTypes[p.type]}：${reason}，进展 ${p.stage}/2，追加支出 ${extra.toFixed(1)} 万${p.status==='受挫终止'?'；三次年度尝试后终止，已投入不退回':''}。`,gain?'success':'warning');syncMarket(s,c);
 }
}
function validRebuild(c,year,deadline=2026){
 const fields=['capacityRecovery','technologyBonus','marketReach','rebuiltCapital','rebuildOverhead','pendingRebuildExpense','pendingRebuildCapex'];if(!fields.every(k=>Number.isFinite(c[k])&&c[k]>=0)||effectiveCapacity(c)>1.25+1e-7||c.capacityRecovery>1.25-(c.assetRetention??1)+1e-7||c.technologyBonus>.15+1e-7||c.marketReach>.4+1e-7||c.rebuildOverhead>1-c.overheadRetention+1e-7||!Array.isArray(c.rebuilds)||c.rebuilds.length>35)return false;
 let prior=1989,active=0;for(const p of c.rebuilds){if(!p||!Number.isInteger(p.year)||p.year<=prior||p.year>Math.min(year,deadline-2)||!Object.hasOwn(rebuildTypes,p.type)||!([20,50,100].includes(p.budget)||c.capital&&Number.isInteger(p.budget)&&p.budget>=150&&p.budget<=5000&&p.budget%50===0)||!['gain','baseRisk','spent'].every(k=>Number.isFinite(p[k])&&p[k]>=0)||p.gain>.3||p.baseRisk<.08||p.baseRisk>.6||!Number.isInteger(p.stage)||p.stage<0||p.stage>2||!Number.isInteger(p.attempts)||p.attempts<0||p.attempts>3||!['进行中','已完成','主动终止','受挫终止','退出终止'].includes(p.status)||!Array.isArray(p.events)||p.events.length!==p.attempts)return false;
  let last=p.year,successful=0;for(const e of p.events){if(!e||!Number.isInteger(e.year)||e.year<=last||e.year>year||!['risk','extra','gain','employees'].every(k=>Number.isFinite(e[k])&&e[k]>=0)||e.risk<.08||e.risk>.6||typeof e.adverse!=='boolean'||typeof e.cashBlocked!=='boolean'||typeof e.reason!=='string'||e.gain>p.gain/2+1e-7||e.extra>p.budget*.1+1e-7)return false;if(!e.adverse&&!e.cashBlocked)successful++;last=e.year;}
  if(successful!==p.stage||Math.abs(p.spent-p.budget-p.events.reduce((n,e)=>n+e.extra,0))>1e-6)return false;
  if(p.status==='进行中'){active++;if(c.status!=='active'||p.endYear!==null||p.stage===2||p.attempts===3)return false;}else if(!Number.isInteger(p.endYear)||p.endYear<p.year||p.endYear>year||p.status==='已完成'&&p.stage!==2||p.status==='受挫终止'&&(p.attempts!==3||p.stage===2))return false;prior=p.year;
 }
 return active<=1&&c.rebuildYear===(c.rebuilds.at(-1)?.year??null);
}

function divestFields(c){c.divestments=[];c.divestYear=null;c.assetRetention=1;c.businessRetention=1;c.equipmentRetention=1;c.overheadRetention=1;c.pendingDivestPrice=0;c.pendingDivestFee=0;c.pendingDivestPrincipal=0;c.pendingDivestRevenue=0;}
function divestBuyers(s,id,fraction=.2,repay=true){const c=s.portfolio.find(x=>x.id===id&&x.status==='active');if(!c)return [];const excluded=new Set([...s.portfolio.filter(x=>x.status==='active'),...s.deals].map(x=>x.id));return s.markets[c.sector].members.filter(x=>!x.failed&&!x.acquiredBy&&!excluded.has(x.id)).map(x=>({...divestQuote(s,id,'business',fraction,x.id,repay),id:x.id,name:x.name}));}
function divestQuote(s,id,mode='assets',fraction=.2,buyerId=null,repay=true){
 const c=s.portfolio.find(x=>x.id===id&&x.status==='active');if(!c||s.ended||s.year>=endYear(s))return {ok:false,reason:`只有仍在经营的企业能出售，且必须赶在 ${endYear(s)} 年前`};
 if(!['assets','business'].includes(mode)||![.1,.2,.3].includes(fraction)||typeof repay!=='boolean')return {ok:false,reason:'这份出售方案不能成交'};
 const m=s.markets[c.sector],x=m.members.find(x=>x.id===id),assets=disposalAssets(c,s.year);let buyer=null,reason=currentRebuild(c)?'现有项目还没结束，做完或停下来才能出售':c.divestYear===s.year?'今年已经卖过一次，下一年再议':'',customers=0,transferred=0,employees=0,revenueSold=0;
 const assetAfter=mode==='assets'?c.assetRetention*(1-fraction):c.assetRetention,businessAfter=mode==='business'?c.businessRetention*(1-fraction):c.businessRetention;
 if(assetAfter<.6-1e-7)reason='再卖就低于原资产能力的 60%，剩下的要留给经营';if(businessAfter<.5-1e-7)reason='原有业务至少要留一半，不能再剥离了';
 let price=assets.reduce((n,a)=>n+a.proceeds,0)*fraction;
 if(mode==='business'){
  buyer=m.members.find(b=>b.id===buyerId&&!b.failed&&!b.acquiredBy);if(!buyer||s.deals.some(b=>b.id===buyerId)||s.portfolio.some(b=>b.id===buyerId&&b.status==='active'))return {ok:false,reason:'得找基金之外的同行来接，不能卖给自己的持仓'};
  customers=Math.floor(x.customers*fraction);transferred=Math.floor(customers*.9);employees=Math.min(Math.max(0,c.team-3),Math.floor(c.team*fraction));revenueSold=c.revenue*(customers/Math.max(1,x.customers));
  price=Math.round(enterpriseValue(c,era(s.year))*(customers/Math.max(1,x.customers))*(.6+buyer.quality*.15)*10)/10;
  if(customers<1||transferred<1)reason='这块业务太小，分不出一个完整的折算客户';
  else if(buyer.quality<.35||debtDue(buyer)>1e-7)reason='买方自己的经营和债务也吃紧，接不下这块业务';
  else if(buyer.cash<price+Math.max(20,-buyer.cashFlow*.5)+debtService(buyer))reason='买方付完价款，就没有自己的周转钱了';
 }
 if(price<=0)reason='目前没有能卖出的资产，也没有有效的业务报价';
 const fee=Math.min(price,Math.max(.5,price*(mode==='business'?.04:.06))),net=price-fee,afterReceipt=c.cash+net,mandatory=Math.min(debtDue(c),Math.max(0,afterReceipt));
 const principal=mandatory+(repay?Math.min(Math.max(0,debtBalance(c)-mandatory),Math.max(0,afterReceipt-mandatory-20),Math.max(0,net-mandatory)):0),afterCash=afterReceipt-principal;
 const overheadAfter=mode==='business'?c.overheadRetention*(1-fraction*.6):c.overheadRetention;
 const next={...c,team:c.team-employees,assetRetention:assetAfter,overheadRetention:overheadAfter,capacityRecovery:(c.capacityRecovery||0)*(mode==='assets'?1-fraction:1),rebuiltCapital:(c.rebuiltCapital||0)*(1-fraction),technologyBonus:(c.technologyBonus||0)*(mode==='business'?1-fraction:1),rebuildOverhead:(c.rebuildOverhead||0)*(mode==='business'?1-fraction:1)},revenueAfter=c.revenue-revenueSold,k=costs(next,revenueAfter),before=costs(c,c.revenue);
 return {ok:!reason,reason,id,mode,fraction,repay,buyerId:buyer?.id||null,buyerName:buyer?.name||null,price,fee,net,principal,mandatory,cashBefore:c.cash,cashAfter:afterCash,debtBefore:debtBalance(c),debtAfter:Math.max(0,debtBalance(c)-principal),remainingDue:Math.max(0,debtDue(c)-mandatory),customers,transferred,released:customers-transferred,employees,revenueSold,revenueAfter,costBefore:before.total,costAfter:k.total,operatingProfitAfter:revenueAfter-k.total,assetBefore:c.assetRetention,assetAfter,businessBefore:c.businessRetention,businessAfter,overheadAfter,assets,resolves:afterCash>0&&debtDue(c)-mandatory<=1e-7};
}
function repayDisposal(c,amount){let left=amount;const payments=[];const ordered=[...c.loans].sort((a,b)=>b.rate-a.rate||a.id.localeCompare(b.id));for(const overdue of [true,false])for(const l of ordered){if(l.defaulted)continue;const paid=Math.min(left,overdue?l.due:l.balance);if(paid<=0)continue;l.balance=Math.max(0,l.balance-paid);l.due=Math.max(0,l.due-paid);l.paidPrincipal+=paid;if(l.balance<=1e-7)l.remaining=0;left-=paid;const item=payments.find(x=>x.id===l.id);if(item)item.paid+=paid;else payments.push({id:l.id,paid});}c.cash-=amount-left;return payments;}
function divest(s,id,mode='assets',fraction=.2,buyerId=null,repay=true){
 const q=divestQuote(s,id,mode,fraction,buyerId,repay);if(!q.ok)return false;const c=s.portfolio.find(x=>x.id===id),m=s.markets[c.sector],x=m.members.find(x=>x.id===id);
 if(mode==='business'){
  const b=m.members.find(b=>b.id===buyerId),total=b.customers+q.transferred;b.basePrice=(b.basePrice*b.customers+x.basePrice*q.transferred)/total;b.product=(b.product*b.customers+x.product*q.transferred)/total;
  b.customers=total;b.team+=q.employees;b.cash-=q.price;b.pendingAcquisitionPrice=(b.pendingAcquisitionPrice||0)+q.price;b.acquisitionBaseRevenue=(b.acquisitionBaseRevenue||0)+q.revenueSold*q.transferred/q.customers;b.value=Math.max(0,b.value-q.price*.35);
  x.customers-=q.customers;x.product*=1-fraction*.15;m.unserved+=q.released;if(m.last)m.last.unserved=m.unserved;
  c.team-=q.employees;c.equipmentRetention*=1-fraction;if(c.integration)c.integration.cohort=Math.floor(c.integration.cohort*(1-fraction));
 }
 if(mode==='assets'){c.capacityRecovery=(c.capacityRecovery||0)*(1-fraction);c.rebuiltCapital=(c.rebuiltCapital||0)*(1-fraction);}else{c.rebuiltCapital=(c.rebuiltCapital||0)*(1-fraction);c.marketReach=(c.marketReach||0)*(1-fraction);c.technologyBonus=(c.technologyBonus||0)*(1-fraction);c.rebuildOverhead=(c.rebuildOverhead||0)*(1-fraction);}
 c.assetRetention=q.assetAfter;c.businessRetention=q.businessAfter;c.overheadRetention=q.overheadAfter;c.cash+=q.net;const payments=repayDisposal(c,q.principal);
 c.pendingDivestPrice+=q.price;c.pendingDivestFee+=q.fee;c.pendingDivestPrincipal+=q.principal;c.pendingDivestRevenue+=q.revenueSold;c.divestYear=s.year;c.round=null;
 if(q.resolves)c.distress=null;
 c.value=fundamental(c,era(s.year))*(c.integration?.9:1)*(c.distress?.5:1);runway(c);c.divestments.push({...q,year:s.year,payments});
 const text=`${c.name} · ${mode==='business'?'向 '+q.buyerName+' 剥离业务':'部分资产出售'} ${Math.round(fraction*100)}%：价款 ${q.price.toFixed(1)} 万、费用 ${q.fee.toFixed(1)} 万，还本 ${q.principal.toFixed(1)} 万，企业现金 ${c.cash.toFixed(1)} 万；基金现金和持股不变${c.distress?'，仍需继续救助':''}。`;
 c.notes.push(`${s.year} 年 ${text}`);log(s,text,'warning');syncMarket(s,c);record(s);return true;
}
function validDivest(c,year,deadline=2026){
 const positive=['pendingDivestPrice','pendingDivestFee','pendingDivestPrincipal','pendingDivestRevenue'];if(!positive.every(k=>Number.isFinite(c[k])&&c[k]>=0)||!['assetRetention','businessRetention','equipmentRetention','overheadRetention'].every(k=>Number.isFinite(c[k])&&c[k]>=0&&c[k]<=1)||c.assetRetention<.6-1e-7||c.businessRetention<.5-1e-7||c.pendingDivestFee>c.pendingDivestPrice+1e-7||!Array.isArray(c.divestments)||c.divestments.length>(c.capital?60:36))return false;
 if(c.divestYear!==null&&(!Number.isInteger(c.divestYear)||c.divestYear>year||c.divestYear<1990))return false;
 const near=(x,y)=>Math.abs(x-y)<1e-6*Math.max(1,Math.abs(x));let ar=1,br=1,er=1,oh=1,prev=1989;
 for(const a of c.divestments){if(!a||!Number.isInteger(a.year)||a.year<=prev||a.year>Math.min(year,deadline-1)||!['assets','business'].includes(a.mode)||![.1,.2,.3].includes(a.fraction)||typeof a.repay!=='boolean'||!['price','fee','net','principal','mandatory','debtBefore','debtAfter','customers','transferred','released','employees','revenueSold','revenueAfter','costBefore','costAfter','operatingProfitAfter','assetBefore','assetAfter','businessBefore','businessAfter','overheadAfter'].every(k=>Number.isFinite(a[k]))||!['price','fee','net','principal','mandatory','debtBefore','debtAfter','customers','transferred','released','employees','revenueSold','revenueAfter'].every(k=>a[k]>=0)||!Number.isFinite(a.cashBefore)||!Number.isFinite(a.cashAfter)||!Array.isArray(a.payments)||a.payments.length>18)return false;
  if(!a.payments.every(x=>x&&typeof x.id==='string'&&Number.isFinite(x.paid)&&x.paid>=0&&c.loans.some(l=>l.id===x.id))||!near(a.payments.reduce((n,x)=>n+x.paid,0),a.principal)||!near(a.price,a.fee+a.net)||!near(a.cashAfter,a.cashBefore+a.net-a.principal)||!near(a.debtBefore,a.debtAfter+a.principal)||a.mandatory>a.principal+1e-7||a.customers!==a.transferred+a.released||!near(a.assetBefore,ar)||!near(a.businessBefore,br))return false;
  if(a.mode==='business'){if(typeof a.buyerId!=='string'||typeof a.buyerName!=='string'||a.transferred!==Math.floor(a.customers*.9))return false;br*=1-a.fraction;er*=1-a.fraction;oh*=1-a.fraction*.6;}else{if(a.buyerId!==null||a.customers||a.employees||a.revenueSold)return false;ar*=1-a.fraction;}
  if(!near(a.assetAfter,ar)||!near(a.businessAfter,br)||!near(a.overheadAfter,oh))return false;prev=a.year;
 }
 return near(ar,c.assetRetention)&&near(br,c.businessRetention)&&near(er,c.equipmentRetention)&&near(oh,c.overheadRetention)&&c.divestYear===(c.divestments.at(-1)?.year??null);
}

function disposalAssets(c,year){
 const p=profiles[c.sector],rows=c.financialHistory,revenue=Math.max(0,c.revenue-(c.pendingDivestRevenue||0));
 const equipment=rows.reduce((n,r)=>n+Math.max(0,(r.capex||0)-(r.rebuildCapex||0))*Math.pow(.85,Math.max(0,year-r.year)),0);
 return [{name:'设备与资本投入',basis:equipment*(c.equipmentRetention??1)+(c.rebuiltCapital||0)/Math.max(.01,c.assetRetention??1),discount:.45},{name:'存货及营运资产',basis:revenue*p.wc,discount:.55},{name:'技术与知识产权',basis:revenue*p.rnd*(.5+c.quality),discount:.30}].map(x=>({...x,basis:x.basis*(c.assetRetention??1),proceeds:x.basis*x.discount*(c.assetRetention??1)}));
}
function liquidationBuyers(s,id){
 const c=s.portfolio.find(x=>x.id===id&&x.status==='active');if(!c)return [];
 const excluded=new Set([...s.portfolio.filter(x=>x.status==='active'),...s.deals].map(x=>x.id));
 return s.markets[c.sector].members.filter(x=>!x.failed&&!x.acquiredBy&&!excluded.has(x.id)).sort((a,b)=>a.id.localeCompare(b.id)).map(x=>({...liquidationQuote(s,id,'business',x.id),id:x.id,name:x.name}));
}
function liquidationQuote(s,id,mode='assets',buyerId=null){
 const c=s.portfolio.find(x=>x.id===id&&x.status==='active');
 if(!c||s.ended||c.liquidation)return {ok:false,reason:'这笔投资已经结清，不能再卖一次'};
 if(!['assets','business'].includes(mode))return {ok:false,reason:'这份清算方案不能办理'};
 const m=s.markets[c.sector],seller=m.members.find(x=>x.id===id),assets=disposalAssets(c,s.year);
 let reason=underPressure(c)?'':'企业还没有经营或偿债压力，暂不办理清算',buyer=null,price=assets.reduce((n,a)=>n+a.proceeds,0);
 if(mode==='business'){
  buyer=m.members.find(x=>x.id===buyerId);
  if(!buyer||buyer.failed||buyer.acquiredBy||s.deals.some(x=>x.id===buyerId)||s.portfolio.some(x=>x.id===buyerId&&x.status==='active'))return {ok:false,reason:'买方须是基金之外、还在正常经营的同行'};
  price=Math.round(enterpriseValue(c,era(s.year))*(.35+buyer.quality*.2+c.quality*.05)*10)/10;
  const reserve=Math.max(20,Math.max(0,-buyer.cashFlow)*.5)+debtService(buyer);
  if(buyer.quality<.35||debtDue(buyer)>1e-7)reason='买方自己的经营和债务也吃紧，接不下这门生意';
  else if(buyer.cash+1e-7<price+reserve)reason='买方付完价款，就不够自己经营和还债了';
  else if(price<=0)reason='这门生意目前还没有买方报价';
 }
 const cashAvailable=Math.max(0,c.cash)+creditNetAssets(c),operatingClaims=Math.max(0,-c.cash),loanClaims=debtBalance(c),claims=loanClaims+operatingClaims,grossPool=cashAvailable+price;
 const feeRate=mode==='assets'?.08:.05,fees=Math.min(grossPool,Math.max(2,price*feeRate)),creditorPaid=Math.min(Math.max(0,grossPool-fees),claims),ratio=claims?creditorPaid/claims:0;
 const creditors=(c.loans||[]).filter(l=>l.balance>0).map(l=>({id:l.id,name:'贷款 · '+l.targetName,claim:l.balance,paid:l.balance*ratio,unpaid:l.balance*(1-ratio)}));
 if(operatingClaims>0)creditors.push({id:'operating',name:'经营现金缺口',claim:operatingClaims,paid:operatingClaims*ratio,unpaid:operatingClaims*(1-ratio)});
 const equityResidual=Math.max(0,grossPool-fees-creditorPaid),fundProceeds=equityResidual*c.equity,customers=seller.customers,transferred=mode==='business'?Math.floor(customers*.85):0;
 return {ok:!reason,reason,mode,id,buyerId:buyer?.id||null,buyerName:buyer?.name||null,assets,price,feeRate,cashAvailable,...(creditNetAssets(c)>0?{creditRecovery:creditNetAssets(c)}:{}),operatingClaims,loanClaims,claims,grossPool,fees,creditorPaid,equityResidual,equity:c.equity,fundProceeds,otherEquity:equityResidual-fundProceeds,unpaid:claims-creditorPaid,creditors,customers,transferred,released:customers-transferred,employees:c.team};
}
function liquidate(s,id,mode='assets',buyerId=null,automatic=false){
 const q=liquidationQuote(s,id,mode,buyerId);if(!q.ok)return false;
 const c=s.portfolio.find(x=>x.id===id),m=s.markets[c.sector],seller=m.members.find(x=>x.id===id);
 if(mode==='business'){
  const b=m.members.find(x=>x.id===buyerId),total=b.customers+q.transferred;
  if(total){b.basePrice=(b.basePrice*b.customers+seller.basePrice*q.transferred)/total;b.product=(b.product*b.customers+seller.product*q.transferred)/total;}
  b.customers=total;b.team+=c.team;b.cash-=q.price;b.pendingAcquisitionPrice=(b.pendingAcquisitionPrice||0)+q.price;b.acquisitionBaseRevenue=(b.acquisitionBaseRevenue||0)+c.revenue;
  b.value=Math.max(0,b.value-q.price*.35);seller.acquiredBy=b.id;seller.acquiredYear=s.year;
 }
 m.unserved+=q.released;seller.customers=0;if(m.last)m.last.unserved=m.unserved;
 for(const l of c.loans){const item=q.creditors.find(x=>x.id===l.id);if(!item)continue;l.paidPrincipal+=item.paid;l.writtenOff=(l.writtenOff||0)+item.unpaid;l.defaulted=l.defaulted||item.unpaid>1e-7;l.balance=0;l.due=0;l.remaining=0;}
 c.liquidation={...q,year:s.year,automatic};if(c.capital?.extension?.credit)c.capital.extension.credit=null;c.cash=0;c.value=0;c.runway=0;
 realize(s,c,q.fundProceeds,'失败清算');
 log(s,`${c.name} · ${mode==='business'?'向 '+q.buyerName+' 出售业务':'资产拍卖'}：处置回款 ${q.price.toFixed(1)} 万，费用 ${q.fees.toFixed(1)} 万，债权获偿 ${q.creditorPaid.toFixed(1)} 万、未获偿 ${q.unpaid.toFixed(1)} 万；基金收回 ${q.fundProceeds.toFixed(1)} 万。`,'warning');
 c.notes.push(`${s.year} 年清偿顺序：处置费用 → 同顺位债权按比例受偿 → 剩余股权资金。${q.transferred} 客户转入买方，${q.released} 客户回到行业待匹配池。`);record(s);return true;
}
function validLiquidation(c,year){
 const a=c.liquidation;if(a===null)return true;if(!a||c.status!=='失败清算'||c.cash!==0||c.value!==0||!Number.isInteger(a.year)||a.year<1990||a.year>year||!['assets','business'].includes(a.mode)||typeof a.automatic!=='boolean')return false;
 const fields=['price','feeRate','cashAvailable','operatingClaims','loanClaims','claims','grossPool','fees','creditorPaid','equityResidual','equity','fundProceeds','otherEquity','unpaid','customers','transferred','released','employees'];
 if(!fields.every(k=>Number.isFinite(a[k])&&a[k]>=0)||a.equity>1||!['customers','transferred','released'].every(k=>Number.isInteger(a[k]))||!Array.isArray(a.creditors)||a.creditors.length>19||!Array.isArray(a.assets)||a.assets.length!==3)return false;
 const near=(x,y)=>Math.abs(x-y)<1e-6*Math.max(1,Math.abs(x));
 if(!a.creditors.every(x=>x&&typeof x.id==='string'&&typeof x.name==='string'&&['claim','paid','unpaid'].every(k=>Number.isFinite(x[k])&&x[k]>=0)&&near(x.claim,x.paid+x.unpaid))||new Set(a.creditors.map(x=>x.id)).size!==a.creditors.length)return false;
 if(!a.assets.every(x=>x&&typeof x.name==='string'&&['basis','discount','proceeds'].every(k=>Number.isFinite(x[k])&&x[k]>=0)&&x.discount<=1&&near(x.proceeds,x.basis*x.discount)))return false;
 if(a.mode==='business'?(typeof a.buyerId!=='string'||typeof a.buyerName!=='string'||a.transferred!==Math.floor(a.customers*.85)):(a.buyerId!==null||a.buyerName!==null||a.transferred!==0||!near(a.price,a.assets.reduce((n,x)=>n+x.proceeds,0))))return false;
 return near(a.grossPool,a.cashAvailable+a.price)&&near(a.fees,Math.min(a.grossPool,Math.max(2,a.price*(a.mode==='assets'?.08:.05))))&&near(a.claims,a.loanClaims+a.operatingClaims)&&near(a.creditorPaid,Math.min(a.grossPool-a.fees,a.claims))&&near(a.grossPool,a.fees+a.creditorPaid+a.equityResidual)&&near(a.claims,a.creditorPaid+a.unpaid)&&near(a.equityResidual,a.fundProceeds+a.otherEquity)&&near(a.fundProceeds,a.equityResidual*a.equity)&&near(c.equity,a.equity)&&near(c.proceeds,a.fundProceeds+(c.capital?.trades||[]).reduce((n,t)=>n+t.proceeds,0))&&a.customers===a.transferred+a.released&&near(a.creditors.reduce((n,x)=>n+x.claim,0),a.claims)&&near(a.creditors.reduce((n,x)=>n+x.paid,0),a.creditorPaid)&&a.creditors.every(x=>near(x.paid,a.claims?x.claim*a.creditorPaid/a.claims:0))&&debtBalance(c)===0;
}

// Interest is an expense; principal is a separate cash movement and reduces the liability.
function payPrincipal(c){let paid=0;for(const l of c.loans||[]){if(l.defaulted)continue;const n=Math.min(l.due,Math.max(0,c.cash));l.balance=Math.max(0,l.balance-n);l.due=Math.max(0,l.due-n);l.paidPrincipal+=n;c.cash-=n;paid+=n;}return paid;}
function markDefault(c){for(const l of c.loans||[])if(l.balance>1e-7)l.defaulted=true;}
function enterpriseValue(c,e){
 const revenue=Math.max(0,c.revenue-(c.pendingDivestRevenue||0)),operatingProfit=(c.pendingDivestPrice||0)>0?revenue-costs(c,revenue).total:c.profit+(c.interestExpense||0),margin=operatingProfit/Math.max(1,revenue),g=(c.organicGrowth??c.growth)/100;
 const enterprise=revenue*profiles[c.sector].multiple*clamp(1+g*1.5,.5,1.9)*clamp(.7+margin*1.4,.2,1.3)*(1-c.competition*.35)*e.m+Math.max(0,operatingProfit)*3;
 return enterprise;
}
function fundamental(c,e){return Math.max(0,enterpriseValue(c,e)+Math.max(0,c.cash)+creditNetAssets(c)-debtBalance(c));}
// Business discounts/premiums apply to operations, never to cash contributed by shareholders.
function exitValue(c,factor){if(c.capital?.extension&&c.capital.public)return c.value*c.equity*factor;const cash=Math.max(0,c.cash),debt=debtBalance(c);return modern(c)?Math.max(0,Math.max(0,c.value-cash+debt)*factor+cash-debt)*c.equity:c.value*c.equity*factor;}
function terminalFactor(s,adviser=level(s,'exit')){return s.ruleset===12?.45+adviser*.025:.7+adviser*.02;}
function strategyOutlook(c,strategy=c.strategy){
 const trial={...c,strategy,team:plannedTeam(c,c.revenue,strategy),expansionStreak:strategy==='expand'?Math.min(7,(c.expansionStreak||0)+1):Math.max(0,(c.expansionStreak||0)-(strategy==='defend'?2:1))};
 const k=costs(trial,c.revenue,0,0,c.team),capex=c.revenue*profiles[c.sector].capex*strategies[strategy].capex;
 return {strategy,team:trial.team,streak:trial.expansionStreak,costs:k.total,profit:c.revenue-k.total,cashFlow:c.revenue-k.total-capex,debtService:debtService(c),load:deliveryLoad(trial),...k};
}
function diligenceReport(c){
 if(!c.dd)return null;const precision=[.18,.12,.07,.03][Math.max(0,c.ddLevel)],low=Math.max(0,c.quality-precision),high=Math.min(1,c.quality+precision),base=strategyOutlook(c,'balanced'),expand=strategyOutlook(c,'expand');
 const stressed=revenue=>{const trial={...c,team:plannedTeam(c,revenue,'balanced'),strategy:'balanced'};return revenue-costs(trial,revenue,0,0,c.team).total-revenue*profiles[c.sector].capex;};
 return {referenceValue:fundamental(c,era((c.capital?c.financialHistory.at(-1)?.year:c.financialHistory[0]?.year)??1990)),qualityLow:low,qualityHigh:high,base,expand,stressCashFlow:stressed(c.revenue*.8),deliveryLow:c.revenue/Math.max(1,c.team*(11+high*9)*effectiveCapacity(c)),deliveryHigh:c.revenue/Math.max(1,c.team*(11+low*9)*effectiveCapacity(c)),askingRevenue:c.value/Math.max(1,c.revenue),retentionLow:.7+low*.18,retentionHigh:.7+high*.18};
}
function investmentOutlook(s,id,amount,mode="financial"){
 const c=s.deals.find(c=>c.id===id);if(!c)return null;const terms=investmentTerms(c,s);if(!terms.amounts.includes(amount))return null;
 const follow=s.portfolio.filter(x=>x.status==='active'&&x.round).reduce((n,x)=>n+x.round.cost,0),reserve=10+payroll(s)+follow;
 const equity=amount/(c.value+(c.capital?c.capital.roundTarget:amount)),p=scenarioProject(c),large=!!terms.scaled&&amount>200,resource=c.capital&&mode==='strategic'?resourceQuote(s,c,amount):null,fee=resource?.fee||0,shortfall=Math.max(0,reserve-s.cash+amount+fee);
 const concentration=c.capital&&amount>200&&amount>Math.min(nav(s)*.2,c.value*.5,c.capital.roundTarget)+1e-7;
 const reason=!['financial','strategic'].includes(mode)?'请选择财务投资或产业协同':resource&&!resource.ok?resource.reason:s.ended?'基金已结束':c.status!=='available'?'这笔机会已不在融资中':p&&s.year!==p.year?'本次融资窗口已经结束':equity>terms.maxEquity+1e-8?'超过本项目本轮持股上限':s.cash<amount+fee?'基金现金不足':concentration?'本笔超过基金净资产 20%、项目估值 50% 或整轮总额上限':large&&shortfall>1e-7?'大额认购后不足以覆盖已知跟投与下期运营储备':'';
 return {ok:!reason,reason,cashAfter:s.cash-amount-fee,reserve,follow,equity,cashShare:(amount+fee)/Math.max(1,s.cash),fundShare:amount/Math.max(1,nav(s)),shortfall,large,resource,mode};
}

// Shared industry customer pools. Market RNG is separate from fund RNG and iteration order.
const incumbentNames={
 '企业软件':['磐石软件','经纬信息','正元系统'],'精密制造':['恒准精工','立衡制造','东钧工业'],
 '消费品牌':['百川生活','嘉禾消费','瑞景商贸'],'通信设备':['海岳通信','通维网络','联峰设备'],
 '互联网':['天际互联','众联在线','海桥网络'],'生物科技':['康序生物','博辰医研','清禾诊断'],
 '移动应用':['轻舟移动','触点科技','掌域应用'],'清洁能源':['长青能源','源晟储能','清源电力'],
 '人工智能':['智序智能','深维计算','矩阵智研']
};
function hash(text){let h=2166136261;for(const ch of text)h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0;}
function marketRandom(s,key){return hash(s.marketSeed+':'+key+(quarterly(s)?':month:'+capitalClock(s):''))/4294967296;}
// Largest remainder allocation preserves integer customer totals, with stable ID tie breaks.
function allocate(total,items,weight){const sum=items.reduce((n,x)=>n+Math.max(0,weight(x)),0),out={};if(!items.length)return out;let used=0;const remainders=items.map(x=>{const raw=total*(sum?Math.max(0,weight(x))/sum:1/items.length),n=Math.floor(raw);out[x.id]=n;used+=n;return {id:x.id,remainder:raw-n};}).sort((a,b)=>b.remainder-a.remainder||a.id.localeCompare(b.id));for(let i=0;i<total-used;i++)out[remainders[i%remainders.length].id]++;return out;}
// In the mature continuation market, new suppliers need time to onboard orders.
// Capped allocation leaves unsatisfied new demand available; switching clients
// with no receiving capacity renew with their old supplier. All named bridges balance.
function allocateCapped(total,items,weight,capacity){
 const out=Object.fromEntries(items.map(x=>[x.id,0]));let remaining=total,eligible=items.filter(x=>capacity(x)>0);
 while(remaining>0&&eligible.length){const proposed=allocate(remaining,eligible,weight);let assigned=0;for(const x of eligible){const n=Math.min(proposed[x.id],Math.max(0,capacity(x)-out[x.id]));out[x.id]+=n;assigned+=n;}if(!assigned)break;remaining-=assigned;eligible=eligible.filter(x=>out[x.id]<capacity(x));}
 return {out,remaining};
}
const memberKeys=['quality','volatility','strategy','team','costRate','revenue','costs','profit','cash','cashFlow','runway','profitYears','value','growth','competition'];
function marketMember(c,customers,basePrice){return {id:c.id,name:c.name,sector:c.sector,customers,basePrice,unitPrice:c.revenue/customers,product:0,failed:false,...(c.ventureRisk?{...(c.realProject?{realProject:c.realProject}:{scenarioProject:c.scenarioProject}),ventureRisk:JSON.parse(JSON.stringify(c.ventureRisk))}:{}),...(modern(c)?{economyVersion:12,expansionStreak:c.expansionStreak||0}:{}),...Object.fromEntries(memberKeys.map(k=>[k,c[k]]))};}
function ensureMarket(s,sector){
 if(s.markets[sector])return s.markets[sector];
 const m={sector,year:s.year,total:6000,unserved:0,priceIndex:1,growth:0,members:[],last:null};s.markets[sector]=m;
 incumbentNames[sector].forEach((name,i)=>{const customers=[2700,2000,1300][i],p=profiles[sector],c={id:'inc-'+sectors.find(x=>x.name===sector).icon+'-'+i,name,sector,revenue:customers,quality:[.78,.65,.57][i],volatility:.4,team:Math.round(customers*.055),value:customers*3,growth:3,runway:24,dd:false};if(s.ruleset===12){c.economyVersion=12;c.expansionStreak=0;}financials(c,s.year);c.cash=customers*.65;m.members.push(marketMember(c,customers,1));});return m;
}
function registerMarket(s,c){
 const m=ensureMarket(s,c.sector);if(m.members.some(x=>x.id===c.id))return;
 // Preserve historical revenue; initial clients transfer from the unserved pool or existing suppliers.
 const owned=new Set(s.portfolio.filter(x=>x.status==='active').map(x=>x.id));let donors=m.members.filter(x=>!x.failed&&!x.acquiredBy&&!owned.has(x.id));if(!donors.length||s.ruleset===12&&m.unserved+donors.reduce((n,x)=>n+x.customers,0)<1)donors=m.members.filter(x=>!x.failed&&!x.acquiredBy);const available=m.unserved+donors.reduce((n,x)=>n+x.customers,0);
 const customers=Math.min(Math.max(1,Math.round(c.revenue)),isContinuous(s)?Math.max(1,Math.floor(m.total*.08)):Infinity,Math.max(1,available));
 const reserve=Math.min(m.unserved,customers);m.unserved-=reserve;
 const transfers=allocate(customers-reserve,donors,x=>x.customers);for(const d of donors)d.customers-=transfers[d.id]||0;
 m.members.push(marketMember(c,customers,c.revenue/customers/m.priceIndex));c.market={year:s.year,opening:true,customers,unitPrice:c.revenue/customers,total:m.total,share:customers/m.total,delta:0,won:0,lost:0,newDemand:0,contraction:0,from:[],to:[],pressure:c.competition,exitSignal:1,rank:0};
}
function initMarkets(s){s.marketSeed=hash('markets:'+s.seed);s.markets={};for(const sector of availableSectors(s))ensureMarket(s,sector.name);for(const c of [...s.portfolio.filter(x=>x.status==='active'),...s.deals])registerMarket(s,c);}
function exitOdds(c,e,adviser=0){const margin=c.profit/Math.max(1,c.revenue),signal=c.market?.exitSignal??1;return clamp(e.exit*clamp(.7+margin+(c.organicGrowth??c.growth)*.005-c.competition*.3,.15,1.4)*signal+adviser*.025,0,.5);}
function compete(s,e,supported=new Set(),opsLevel=0,period=1){
 const owned=new Map(s.portfolio.filter(c=>c.status==='active').map(c=>[c.id,c])),results={};
 for(const sector of availableSectors(s))ensureMarket(s,sector.name);
 for(const m of Object.values(s.markets)){
  const members=m.members.filter(x=>!x.failed&&!x.acquiredBy).sort((a,b)=>a.id.localeCompare(b.id));
  for(const x of members){const c=owned.get(x.id);if(c){for(const k of memberKeys)x[k]=c[k];if(modern(c))x.expansionStreak=c.expansionStreak||0;}else{x.rebuiltCapital=(x.rebuiltCapital||0)*Math.pow(.85,period);x.marketReach=(x.marketReach||0)*Math.pow(.92,period);x.strategy=x.cashFlow<0?'defend':marketRandom(s,x.id+':strategy:'+s.year)<.3?'expand':'balanced';}}
  const oldTotal=m.total,oldUnserved=m.unserved,hot=e.hot.includes(m.sector);
  m.growth=clamp(.025+(hot?.085:0)+(e.m-1)*.45+(marketRandom(s,m.sector+':demand:'+s.year)-.5)*.04,-.2,.18);
  m.total=Math.max(1000,Math.round(oldTotal*Math.pow(1+m.growth,period)));m.year=s.year;
  const change=m.total-oldTotal,contraction=allocate(Math.max(0,-change),[...members,{id:'unserved',customers:oldUnserved}],x=>x.customers);
  const aggressive=members.reduce((n,x)=>n+(x.strategy==='expand'?x.customers:0),0)/oldTotal;
  m.priceIndex=clamp(m.priceIndex*Math.pow(1.005-aggressive*.035,period),.45,1.2);
  const retained={},release={},strength={},flows={};
  for(const x of members){
   const support=supported.has(x.id)?opsLevel:0,st=strategies[x.strategy];
   x.product=clamp(x.product+profiles[x.sector].rnd*st.rnd*.035*period,0,.2);
   x.unitPrice=x.basePrice*m.priceIndex*(x.strategy==='expand'?.92:x.strategy==='defend'?1.04:1);
   const operatingStrain=modern(x)?clamp(deliveryLoad(x)-1,0,2)*.06+Math.max(0,(x.expansionStreak||0)-2)*.008:0;
   const remaining=x.customers-(contraction[x.id]||0),churn=clamp((modern(x)?.30-x.quality*.18:.24-x.quality*.09)+operatingStrain-support*.012+(x.cash<0?.08:0)+(x.integrationDrag||0)*.2+capacityLoss(x)*.08,.1,.35+capacityLoss(x)*.08);
   release[x.id]=Math.round(remaining*(period===1?churn:1-Math.pow(1-churn,period)));retained[x.id]=remaining-release[x.id];
   strength[x.id]=Math.pow(Math.max(1,x.customers),.9)*(.35+x.quality+x.product+(x.technologyBonus||0))*(1-(x.integrationDrag||0))*(1-capacityLoss(x)*.5)*(1+Math.max(0,effectiveCapacity(x)-1)*.3)*(1+(x.marketReach||0)+(owned.get(x.id)?.capital?.resource?.boost||0))*Math.sqrt(st.marketing)*(1+support*.08)/Math.pow(Math.max(.2,isContinuous(s)?x.unitPrice/(x.basePrice*m.priceIndex):x.unitPrice/m.priceIndex),1.4)*(x.cash<0?.65:1)*( .94+marketRandom(s,x.id+':sales:'+s.year)*.12);
   flows[x.id]={year:s.year,opening:false,customers:0,unitPrice:x.unitPrice,total:m.total,share:0,delta:0,won:0,lost:0,newDemand:0,contraction:contraction[x.id]||0,from:[],to:[],pressure:0,exitSignal:1,rank:0,oldCustomers:x.customers,retained:retained[x.id]};
  }
  const free=oldUnserved-(contraction.unserved||0)+Math.max(0,change);
  const mature=matureMarket(s)&&s.ruleset===12;
  const capacity=Object.fromEntries(members.map(x=>[x.id,Math.max(1,Math.ceil(x.customers*((x.strategy==='expand'?.6:x.strategy==='defend'?(mature?.3:.2):(mature?.45:.35))+(supported.has(x.id)?opsLevel*.03:0))*period))]));
  const incoming=matureMarket(s)?allocateCapped(free,members,x=>strength[x.id],x=>capacity[x.id]):null,newClients=incoming?incoming.out:allocate(free,members,x=>strength[x.id]);
  if(incoming)for(const x of members)capacity[x.id]-=newClients[x.id];
  // Route every switching cohort to a named destination; customers choosing the same supplier are renewals.
  for(const donor of members){const capped=matureMarket(s)?allocateCapped(release[donor.id],members,x=>strength[x.id],x=>x.id===donor.id?release[donor.id]:capacity[x.id]):null,destinations=capped?capped.out:allocate(release[donor.id],members,x=>strength[x.id]);if(capped)retained[donor.id]+=capped.remaining;for(const receiver of members){const n=destinations[receiver.id];if(!n)continue;if(receiver.id===donor.id){retained[donor.id]+=n;continue;}if(capped)capacity[receiver.id]-=n;flows[donor.id].lost+=n;flows[donor.id].to.push({id:receiver.id,name:receiver.name,count:n});flows[receiver.id].won+=n;flows[receiver.id].from.push({id:donor.id,name:donor.name,count:n});}}
  m.unserved=members.length?(incoming?.remaining||0):m.total;
  for(const x of members){const f=flows[x.id];f.newDemand=newClients[x.id];f.retained=retained[x.id];f.customers=retained[x.id]+f.won+f.newDemand;f.share=f.customers/m.total;f.delta=f.share-x.customers/oldTotal;x.customers=f.customers;}
  const ranked=[...members].sort((a,b)=>b.customers-a.customers||a.id.localeCompare(b.id));
  for(const x of members){const f=flows[x.id],top=ranked.find(y=>y.id!==x.id),relative=top?strength[top.id]/Math.max(1,strength[x.id]):0;
   f.rank=ranked.indexOf(x)+1;f.leaderName=ranked[0]?.name||x.name;f.leaderShare=(ranked[0]?.customers||0)/m.total;
   f.pressure=clamp(.18+aggressive*.3+Math.min(relative,3)*.12+Math.max(0,-f.delta)*3,.1,.95);
   f.exitSignal=clamp(.75+Math.min(.4,f.share*2)+clamp(f.delta*8,-.25,.25),.5,1.4);
   f.rivals=ranked.filter(y=>y.id!==x.id).slice(0,3).map(y=>({id:y.id,name:y.name,customers:y.customers,share:y.customers/m.total,strategy:y.strategy}));
   x.market=f;results[x.id]=f;
  }
  for(const x of members){const f=flows[x.id];if(!owned.has(x.id)){const shocks={growth:.5,competition:.5,event:marketRandom(s,x.id+':cost:'+s.year)};if(period===1)operate(x,e,0,shocks,f,null,s.year);else monthlyOperating(s,x,f,0);if(x.cash<=0||debtDue(x)>1e-7){markDefault(x);x.failed=true;m.unserved+=x.customers;x.customers=0;}}
  }
  m.last={year:s.year,openingTotal:oldTotal,total:m.total,newDemand:Math.max(0,change),contraction:Math.max(0,-change),transfers:Object.values(flows).reduce((n,f)=>n+f.won,0),unserved:m.unserved};
 }
 return results;
}
function syncMarket(s,c){const x=s.markets[c.sector]?.members.find(x=>x.id===c.id);if(!x)return;if(c.ventureRisk)x.ventureRisk=JSON.parse(JSON.stringify(c.ventureRisk));if(modern(c))x.expansionStreak=c.expansionStreak||0;for(const k of ['assetRetention','overheadRetention','capacityRecovery','technologyBonus','marketReach','rebuiltCapital','rebuildOverhead'])if(Number.isFinite(c[k]))x[k]=c[k];x.mergerSynergy=c.mergerSynergy||0;if(Number.isFinite(c.organicGrowth))x.organicGrowth=c.organicGrowth;else delete x.organicGrowth;x.loans=JSON.parse(JSON.stringify(c.loans||[]));x.interestExpense=c.interestExpense||0;for(const k of memberKeys)x[k]=c[k];if(c.status==='失败清算'&&!x.failed){const m=s.markets[c.sector];m.unserved+=x.customers;x.customers=0;x.failed=true;if(m.last)m.last.unserved=m.unserved;}}

function acquisitionFields(c){c.acquisitions=[];c.integration=null;c.pendingAcquisitionPrice=0;c.pendingAcquisitionFee=0;c.acquisitionBaseRevenue=0;c.mergerSynergy=0;}
function acquisitionQuote(s,buyerId,targetId,mode="cash"){
 const c=s.portfolio.find(x=>x.id===buyerId&&x.status==='active'),m=c&&s.markets[c.sector],b=m?.members.find(x=>x.id===buyerId),t=m?.members.find(x=>x.id===targetId);
 if(!['cash','debt','equity'].includes(mode))return {ok:false,reason:'这份融资方案不能办理'};
 if(!c||!b||!t||t.id===c.id||t.failed||t.acquiredBy||t.customers<=0||s.portfolio.some(x=>x.id===targetId&&x.status==='active'))return {ok:false,reason:'得找仍在经营的同行，基金自己的持仓不在收购名单里'};
 const enterprise=enterpriseValue(t,era(s.year));
 const price=Math.round(Math.max(25,t.revenue*.6,enterprise*.8)*10)/10,fee=Math.round(price*.03*10)/10,planned=Math.round(price*.06*10)/10*2,worst=Math.round(planned/2*1.9*10)/10*2;
 const ratio=t.customers/Math.max(1,b.customers),baseRisk=clamp(.18+Math.min(2,ratio)*.13+Math.abs(c.quality-t.quality)*.15,.18,.65);
 const due=price+fee,baseReserve=Math.max(20,Math.max(0,-c.cashFlow)*.5)+planned/2+debtService(c),gap=Math.max(0,due+baseReserve-c.cash);
 const preMoney=Math.max(1,c.value),term=Math.min(3,endYear(s)-s.year,quarterly(s)?Math.floor((endYear(s)*12-capitalClock(s))/12):Infinity),rate=clamp(.065+Math.max(0,1-era(s.year).m)*.12+(1-c.quality)*.04+debtBalance(c)/Math.max(1,enterpriseValue(c,era(s.year)))*.03,.06,.18);
 const capacity=Math.max(0,Math.min(price*.65,enterpriseValue(c,era(s.year))*.5+enterprise*.3-debtBalance(c)));
 const roundUp=n=>Math.max(0,Math.ceil((n-1e-9)*10)/10);
// Solve for a drawdown that also leaves cash for its first annual debt service.
 const loan=mode==='debt'?roundUp(gap/Math.max(.1,1-rate-1/Math.max(1,term))):0,equityRaise=mode==='equity'?roundUp(gap):0;
 const annualService=loan*(rate+1/Math.max(1,term)),reserve=baseReserve+annualService,remaining=c.cash+loan+equityRaise-due,equityAfter=equityRaise>0?c.equity*preMoney/(preMoney+equityRaise):c.equity;
 const risk=clamp(baseRisk+(loan?Math.min(.1,loan/Math.max(1,preMoney)*.08):0),.18,.65);
 const reason=s.ended?'基金已结束':s.year>endYear(s)-2?`${endYear(s)-1} 年起不再办新并购，要留够两年做整合`:currentRebuild(c)?'现有建设项目还没结束，暂不办新并购':c.distress?'先把到期的债处理好':c.workoutYear===s.year||c.rescueYear===s.year||c.divestYear===s.year?'今年刚办过救助或出售，先把手里的生意稳住':c.integration?'上一笔并购还没整合完':debtDue(c)>1e-7?'还有到期本金没还，不能再办并购':mode==='debt'&&loan>0&&term<2?'剩余经营期不足以完成两年贷款合同':mode==='debt'&&loan>capacity+1e-7?'银行不肯贷这么多，企业还得多拿一些自有资金':mode==='equity'&&equityRaise>preMoney*.8?'募集金额超过投前估值的 80%，这轮投资人不接':mode==='equity'&&equityRaise>0&&c.quality<.4?'这份经营成绩还说服不了外部投资人':remaining+1e-7<reserve?'付完收购款，就不够留给后面的整合了':'';
 return {ok:!reason,reason,buyerId,targetId,targetName:t.name,mode,loan,equityRaise,rate,term,annualService,capacity,preMoney,equityBefore:c.equity,equityAfter,price,fee,due,planned,worst,reserve,required:due+reserve,cash:c.cash,remaining,customers:t.customers,share:(b.customers+t.customers)/m.total,risk,employees:t.team,targetRevenue:t.revenue};
}
function acquisitionTargets(s,id){const c=s.portfolio.find(x=>x.id===id&&x.status==='active');if(!c)return [];return s.markets[c.sector].members.filter(x=>x.id!==id&&!x.failed&&!x.acquiredBy&&x.customers>0&&!s.portfolio.some(p=>p.id===x.id&&p.status==='active')).map(x=>acquisitionQuote(s,id,x.id)).sort((a,b)=>a.due-b.due||a.targetId.localeCompare(b.targetId));}
function acquire(s,buyerId,targetId,mode="cash"){
 const q=acquisitionQuote(s,buyerId,targetId,mode);if(!q.ok)return false;
 const c=s.portfolio.find(x=>x.id===buyerId),m=s.markets[c.sector],b=m.members.find(x=>x.id===buyerId),t=m.members.find(x=>x.id===targetId),before=b.customers;
 const transaction={targetId,targetName:t.name,year:s.year,price:q.price,fee:q.fee,customers:q.customers,employees:t.team,risk:q.risk,planned:q.planned,worst:q.worst,spent:0,lost:0,stage:0,status:'整合中',events:[],cashBefore:c.cash,cashAfter:q.remaining,financingMode:mode,loan:q.loan,equityRaise:q.equityRaise,equityBefore:c.equity,equityAfter:q.equityAfter,rate:q.rate,term:q.term};
 if(q.loan){c.loans.push({id:buyerId+':'+s.year+':'+c.acquisitions.length,targetName:t.name,original:q.loan,balance:q.loan,paidPrincipal:0,rate:q.rate,term:q.term,remaining:q.term,originYear:s.year,due:0,defaulted:false});c.pendingLoanDrawdown+=q.loan;}
 if(q.equityRaise){adjustLocks(c,c.equity?q.equityAfter/c.equity:1);c.equity=q.equityAfter;if(c.round)c.round.oldEquity*=q.preMoney/(q.preMoney+q.equityRaise);c.pendingEquityRaise+=q.equityRaise;}
 c.cash+=q.loan+q.equityRaise-q.due;c.pendingAcquisitionPrice+=q.price;c.pendingAcquisitionFee+=q.fee;c.acquisitionBaseRevenue+=t.revenue;
 c.team=Math.min(10000,c.team+t.team);c.acquisitions.push(transaction);c.integration={targetId,remaining:2,cohort:q.customers};
 // Operating assets and employees transfer. Target cash remains with its sellers; there is no duplicate cash windfall.
 b.basePrice=(b.basePrice*before+t.basePrice*t.customers)/(before+t.customers);b.product=(b.product*before+t.product*t.customers)/(before+t.customers);b.customers+=t.customers;
 t.customers=0;t.acquiredBy=c.id;t.acquiredYear=s.year;s.deals=s.deals.filter(x=>x.id!==targetId);
 // Record at a conservative acquisition value; synergy is only earned after integration.
 c.value=Math.max(0,c.value+q.equityRaise-q.due+q.price*.65);runway(c);syncMarket(s,c);
 c.notes.push(`${s.year} 年收购 ${t.name} 的经营业务：价款 ${q.price.toFixed(1)} 万、交易费 ${q.fee.toFixed(1)} 万，转入 ${q.customers} 客户与 ${q.employees} 名员工；整合期两年。`);
 log(s,`${c.name} 收购 ${t.name}，企业支付 ${q.due.toFixed(1)} 万；贷款 ${q.loan.toFixed(1)} 万，外部增资 ${q.equityRaise.toFixed(1)} 万，持股 ${(c.equity*100).toFixed(1)}%；基金现金不变。`,'investment');record(s);return true;
}
function integrate(s,supported,opsLevel){
 const result={};for(const m of Object.values(s.markets))for(const x of m.members)x.integrationDrag=0;
 for(const c of s.portfolio.filter(x=>x.status==='active'&&x.integration)){
  const m=s.markets[c.sector],b=m.members.find(x=>x.id===c.id),a=c.acquisitions.find(x=>x.targetId===c.integration.targetId),support=supported.has(c.id)?opsLevel:0;
  const risk=clamp(a.risk-support*.04,.06,.65),roll=marketRandom(s,`integration:${c.id}:${a.targetId}:${s.year}`),adverse=roll<risk;
  const fraction=adverse?.18+.16*marketRandom(s,`integration-loss:${c.id}:${s.year}`):.02+.04*marketRandom(s,`integration-loss:${c.id}:${s.year}`);
  const loss=Math.min(b.customers,Math.round(Math.min(c.integration.cohort,b.customers)*fraction)),cost=Math.round(a.planned/2*(adverse?1.9:1)*10)/10;
  b.customers-=loss;m.unserved+=loss;c.integration.cohort=Math.max(0,c.integration.cohort-loss);b.integrationDrag=adverse?.2:.05;
  a.stage++;a.spent+=cost;a.lost+=loss;a.events.push({year:s.year,cost,loss,adverse,support,risk});c.integration.remaining--;
  if(!c.integration.remaining){a.status=a.events.some(x=>x.adverse)?'整合受挫':'整合完成';if(a.status==='整合完成')c.mergerSynergy=Math.min(.06,c.mergerSynergy+.015);c.integration=null;}
  const event=`${a.targetName} 整合第 ${a.stage}/2 年：${adverse?'执行受挫':'进展正常'}，流失 ${loss} 客户，整合费用 ${cost.toFixed(1)} 万${a.stage===2?'；'+a.status:''}`;
  c.notes.push(`${s.year} 年 ${event}`);log(s,`${c.name} · ${event}`,adverse?'warning':'info');result[c.id]={cost,loss,event};
 }
 return result;
}

// Names use their own deterministic search; only the two legacy name draws consume campaign RNG.
const companyNameParts={
 '企业软件':[
  '知序 云章 数舟 企衡 码桥 经略 账云 序言 算筹 简策 企脉 信栈 维策 智账 云枢 数原 合账 章程 方略 企程 易序 明策 码原 信域 企川 云简 数衡 联策 文枢 序川 易衡 典策'.split(' '),
  '软件 信息 数科 系统 智软 数联 云科 企服 数据 科技 数智 信科'.split(' ')],
 '精密制造':[
  '钧衡 铸川 锐准 衡准 砺锋 百锻 天工 规矩 卓衡 恒铸 匠原 金准 立锋 精纬 铎山 力衡 鼎铸 卓钧 衡岳 锐衡 星铸 准元 磐工 砺川 元钧 钧石 衡工 铸岳 精原 轴心 齐工 准达'.split(' '),
  '精工 制造 智造 工控 机电 装备 精密 工业 传动 仪器 自动化 机械'.split(' ')],
 '消费品牌':[
  '禾里 麦田 南橘 青柚 谷雨 栖木 山集 初禾 柚白 本味 青屿 花序 橙光 林间 晨集 原野 拾光 春山 桐里 谷川 白露 暖原 良木 朴集 简禾 岚居 茶山 晴野 稻香 木白 川集 日和'.split(' '),
  '生活 优品 商贸 良品 消费 家品 精选 品牌 日用 物产 百货 实业'.split(' ')],
 '通信设备':[
  '星络 波导 讯川 光桥 频域 海缆 天络 云波 迅达 光程 信航 维讯 联潮 传星 讯峰 光岳 频川 瑞讯 通岳 海讯 光维 联衡 星通 拓频 讯原 天频 波澜 链星 讯达 光启 连山 脉络'.split(' '),
  '通信 通讯 光电 网络 互联 信通 联讯 通联 电子 设备 信科 联科'.split(' ')],
 '互联网':[
  '集川 万集 巷口 星集 桥市 见山 众桥 河图 联市 城集 四邻 易集 云渡 百舸 聚川 通途 千集 汇途 川流 合市 近邻 望桥 远集 千桥 海集 行舟 商渡 寻集 山海 汇桥 星渡 万桥'.split(' '),
  '互联 在线 网络 网联 商联 数网 云集 汇联 易联 云网 数联 网科'.split(' ')],
 '生物科技':[
  '澜序 康谱 禾因 微澜 基源 研序 澄谱 安序 森因 诺因 益谱 原序 清谱 博序 臻源 康因 微禾 谱元 复原 禾谱 同源 研禾 观微 原点 维康 和谱 序康 谱禾 新序 岚谱 知微 晨序'.split(' '),
  '生物 医研 诊断 生科 检验 医科 生研 医工 生命 医检 生技 医学'.split(' ')],
 '移动应用':[
  '轻点 随心 指间 掌禾 近点 小径 闪点 邻里 轻帆 即刻 触禾 一程 步点 简行 点舟 掌程 小满 微途 轻途 随步 近程 知行 微程 口袋 觅途 朝夕 拾步 轻邻 触达 即行 简途 点集'.split(' '),
  '移动 应用 掌讯 云服 互联 生活 数服 智联 轻应用 掌联 微服 随行'.split(' ')],
 '清洁能源':[
  '曜川 旭能 青电 沐光 晟源 绿川 碳原 光储 逐日 晨光 澄能 晴川 沃能 恒曜 昱川 清晖 原能 赫光 长曜 森电 新曜 启阳 光禾 曜原 碧源 晟川 星能 昱源 晴能 澄光 曦和 源川'.split(' '),
  '能源 储能 电力 新能 能科 绿能 清能 智电 能联 电科 电能 能创'.split(' ')],
 '人工智能':[
  '观澜 识微 语川 知元 矩元 深序 思衡 推源 识途 算域 语衡 元识 知澜 函数 启算 维知 明识 语原 推演 识原 知象 深知 算舟 元知 思原 语序 识川 知衡 神思 算原 凌知 维象'.split(' '),
  '智能 智研 计算 智算 算法 智科 认知 智联 数智 智感 智工 智云'.split(' ')]
};
function nameKey(name){return String(name).normalize('NFKC').trim().replace(/\s+\d+$/,'');}
function usedCompanyNames(s){
 const names=new Set(Object.values(incumbentNames).flat().map(nameKey));
 for(const c of [...s.deals,...s.portfolio,...Object.values(s.markets||{}).flatMap(m=>m.members)])names.add(nameKey(c.name));
 return names;
}
function companyName(s,sector,id,entropy,used){
 const [roots,tails]=companyNameParts[sector],size=roots.length*tails.length;
 const offset=hash(id+':'+sector+':'+entropy)%size;
 // Five is coprime to 384, so probing visits every ordinary name before the longer reserve.
 for(let tier=0;tier<=roots.length;tier++)for(let n=0;n<size;n++){
  const index=(offset+n*5)%size,name=roots[Math.floor(index/tails.length)]+(tier?roots[tier-1]:'')+tails[index%tails.length];
  if(!/(.)\1|(.{2})\2/.test(name)&&!used.has(nameKey(name))){used.add(nameKey(name));return name;}
 }
 throw Error('企业名称库已用完');
}
// Real names and founding years are historical; financing windows and all figures are game scenarios.
const historicalProjects=Object.freeze([
 Object.freeze({key:'kingsoft',name:'金山',year:1992,founded:1988,sector:'企业软件',founder:'求伯君与创始团队',product:'WPS 办公软件',story:'金山创立于 1988 年，从 WPS 办公软件起步。',risk:'软件兼容、市场竞争和持续研发投入',edge:'办公软件研发积累',amounts:Object.freeze([100,200,300]),maxEquity:.2,revenue:220,revenueRange:100,team:12,teamRange:6,minimumValue:1200}),
 Object.freeze({key:'tencent',name:'腾讯',year:1999,founded:1998,sector:'互联网',founder:'马化腾与创始团队',product:'即时通信软件',story:'腾讯于 1998 年在深圳创立，早期探索即时通信服务。',risk:'用户增长先消耗资金，商业化和竞争仍待验证',edge:'即时通信与用户连接',amounts:Object.freeze([200,400,600]),maxEquity:.15,revenue:450,revenueRange:200,team:25,teamRange:12,minimumValue:3400}),
 Object.freeze({key:'alibaba',name:'阿里巴巴',year:2000,founded:1999,sector:'互联网',founder:'马云与创始团队',product:'面向中小企业的 B2B 交易平台',story:'阿里巴巴由马云等 18 人于 1999 年在杭州创立，从服务中小企业的 B2B 平台起步。',risk:'互联网低潮、平台获客开支与付费转化',edge:'中小企业贸易连接',amounts:Object.freeze([300,600,900]),maxEquity:.1,revenue:850,revenueRange:350,team:42,teamRange:18,minimumValue:8100}),
 Object.freeze({"deliveryEfficiencyRange":0.12,"key":"byd","name":"比亚迪","year":1996,"founded":1995,"sector":"精密制造","founder":"比亚迪创始团队","product":"充电电池制造","story":"比亚迪创立于 1995 年，团队经营充电电池制造。","risk":"设备投入、订单集中与原材料价格","edge":"充电电池制造","amounts":[100,200,400],"maxEquity":0.2,"revenue":220,"revenueRange":120,"team":12,"teamRange":6,"minimumValue":1600}),
 Object.freeze({"key":"baidu","name":"百度","year":2001,"founded":2000,"sector":"互联网","founder":"百度创始团队","product":"中文搜索服务","story":"百度创立于 2000 年，团队经营中文搜索服务。","risk":"商业化转化、研发开支与竞争","edge":"中文搜索服务","amounts":[150,300,600],"maxEquity":0.15,"revenue":450,"revenueRange":180,"team":24,"teamRange":10,"minimumValue":3400}),
 Object.freeze({"key":"jd","name":"京东","year":2007,"founded":1998,"sector":"互联网","founder":"京东创始团队","product":"线上零售与仓储配送","story":"京东创立于 1998 年，团队经营线上零售与仓储配送。","risk":"库存周转、履约投入与持续融资需求","edge":"线上零售与仓储配送","amounts":[200,400,800],"maxEquity":0.15,"revenue":750,"revenueRange":300,"team":38,"teamRange":15,"minimumValue":4534}),
 Object.freeze({"key":"leshi","name":"乐视网","year":2008,"founded":2004,"sector":"互联网","founder":"乐视网创始团队","product":"在线视频服务","story":"乐视网创立于 2004 年，团队经营在线视频服务。","risk":"内容采购、回款质量与业务扩张","edge":"在线视频服务","amounts":[100,200,400],"maxEquity":0.2,"revenue":420,"revenueRange":168,"team":26,"teamRange":10,"minimumValue":1600,"crisisYear":2021,"crisisTitle":"财务披露处罚","crisisFact":"2021 年证监会对乐视网等主体作出行政处罚，涉及 IPO 文件及多年年报虚假记载。","source":"https://www.csrc.gov.cn/csrc/c101928/c490192772b7748f58f089887c76bb662/content.shtml"}),
 Object.freeze({"key":"xiaomi","name":"小米","year":2011,"founded":2010,"sector":"消费品牌","founder":"小米创始团队","product":"智能手机与消费电子","story":"小米创立于 2010 年，团队经营智能手机与消费电子。","risk":"供应链备货、库存跌价与渠道投入","edge":"智能手机与消费电子","amounts":[200,400,800],"maxEquity":0.15,"revenue":800,"revenueRange":320,"team":38,"teamRange":15,"minimumValue":4534}),
 Object.freeze({"key":"meituan","name":"美团","year":2011,"founded":2010,"sector":"移动应用","founder":"美团创始团队","product":"本地生活团购服务","story":"美团创立于 2010 年，团队经营本地生活团购服务。","risk":"补贴获客、商户结算与持续融资需求","edge":"本地生活团购服务","amounts":[150,300,600],"maxEquity":0.15,"revenue":500,"revenueRange":200,"team":30,"teamRange":12,"minimumValue":3400}),
 Object.freeze({"deliveryEfficiencyRange":0.12,"key":"catl","name":"宁德时代","year":2012,"founded":2011,"sector":"清洁能源","founder":"宁德时代创始团队","product":"动力电池研发与制造","story":"宁德时代创立于 2011 年，团队经营动力电池研发与制造。","risk":"产能投入、客户集中与回款账期","edge":"动力电池研发与制造","amounts":[300,600,900],"maxEquity":0.2,"revenue":600,"revenueRange":250,"team":24,"teamRange":10,"minimumValue":3600}),
 Object.freeze({"key":"bytedance","name":"字节跳动","year":2013,"founded":2012,"sector":"移动应用","founder":"字节跳动创始团队","product":"移动内容分发","story":"字节跳动创立于 2012 年，团队经营移动内容分发。","risk":"内容投入、流量成本与商业化转化","edge":"移动内容分发","amounts":[200,400,800],"maxEquity":0.12,"revenue":650,"revenueRange":260,"team":32,"teamRange":13,"minimumValue":5867}),
 Object.freeze({"key":"luckin","name":"瑞幸咖啡","year":2018,"founded":2017,"sector":"消费品牌","founder":"瑞幸咖啡创始团队","product":"咖啡零售","story":"瑞幸咖啡创立于 2017 年，团队经营咖啡零售。","risk":"门店扩张、营销投入与经营资料核查","edge":"咖啡零售","amounts":[150,300,600],"maxEquity":0.15,"revenue":650,"revenueRange":260,"team":42,"teamRange":17,"minimumValue":3400,"crisisYear":2020,"crisisTitle":"财务披露事件","crisisFact":"2020 年美国 SEC 对瑞幸提出会计欺诈指控，瑞幸同意支付和解罚款。","source":"https://www.sec.gov/enforcement-litigation/litigation-releases/lr-24987"})
]);
function historicalProject(c){return historicalProjects.find(p=>c?.realProject===p.key&&c.id===p.year+'-H-'+p.key)||null;}
// Fictional scenarios use the ordinary name generator, so a familiar label cannot identify a loser.
const fictionalProjects=Object.freeze([
 {key:'portal',year:1997,sector:'互联网',product:'行业门户与广告服务',risk:'流量投入、广告回款与续轮融资',edge:'行业信息服务',amounts:[50,100,200],maxEquity:.25,revenue:200,revenueRange:180,team:15,teamRange:14,minimumValue:600},
 {key:'retail',year:2006,sector:'消费品牌',product:'区域连锁零售',risk:'渠道扩张、结算账期与门店开支',edge:'连锁渠道',amounts:[100,200,400],maxEquity:.25,revenue:420,revenueRange:240,team:24,teamRange:18,minimumValue:1200},
 {deliveryEfficiencyRange:.16,key:'energy',year:2015,sector:'清洁能源',product:'储能设备与项目交付',risk:'垫资交付、设备投入与客户回款',edge:'能源项目交付',amounts:[150,300,600],maxEquity:.20,revenue:620,revenueRange:350,team:30,teamRange:20,minimumValue:2400},
 {key:'delivery',year:2021,sector:'移动应用',product:'本地配送与商户服务',risk:'补贴获客、商户结算与融资依赖',edge:'本地服务网络',amounts:[100,200,400],maxEquity:.20,revenue:460,revenueRange:300,team:28,teamRange:22,minimumValue:1600}
].map(p=>Object.freeze({...p,fictional:true,amounts:Object.freeze(p.amounts)})));
const scenarioProjects=Object.freeze([...historicalProjects,...fictionalProjects]);
const limits=Object.freeze({portfolio:252+scenarioProjects.length,deals:7+Math.max(...scenarioProjects.map(p=>scenarioProjects.filter(x=>x.year===p.year).length)),market:279+scenarioProjects.length});
function scenarioProject(c){return historicalProject(c)||fictionalProjects.find(p=>c?.scenarioProject===p.key&&c.id===p.year+'-P-'+p.key)||null;}
function riskBrief(c,asOfYear=Infinity){
 const p=scenarioProject(c),r=c.ventureRisk;if(!p||!r)return null;
 const warning=r.exposure>.7?'回款与持续开支压力偏高':r.exposure>.4?'需要留出回款和融资缓冲':'目前压力相对较轻，仍要看经营变化';
 return {days:r.collectionDays,burnRate:r.burnRate,annualBurn:c.revenue*r.burnRate,receivables:r.receivables,warning,events:r.events.filter(e=>e.year<=asOfYear)};
}
function settleVentureRisk(c,year,shocks,support){
 const p=scenarioProject(c),r=c.ventureRisk;if(!p||!r)return null;
 const last=r.events.at(-1),historical=p.crisisYear===year&&!r.events.some(e=>e.year===year),eligible=p.fictional&&year>=p.year+2&&(!last||year-last.year>=3)&&r.events.length<2;
 const triggered=historical||eligible&&shocks.event<.10+r.exposure*.42;
 const recovery=triggered?0:r.receivables*.5,defense=c.strategy==='defend'?.55:c.strategy==='expand'?1.35:1;
 const severity=triggered?(.35+r.exposure*1.4)*defense*(1-support*.09):0;
 const frozen=triggered?c.revenue*(.12+r.exposure*.45)*severity:0,expense=triggered?c.revenue*(.06+r.exposure*.18)*severity:0;
 r.receivables=Math.max(0,r.receivables+frozen-recovery);
 let event=null;
 if(triggered){const title=historical?p.crisisTitle:r.collectionDays>100?'回款延期与融资收紧':'扩张费用失控与融资收紧';event={year,title,historical,expense,frozen,severity,text:(historical?p.crisisFact+' ':'客户回款延期，同时需要追加渠道与核查费用。')+`额外费用 ${expense.toFixed(1)} 万，回款延期 ${frozen.toFixed(1)} 万。`};r.events.push(event);}
 return {expense,workingCapital:frozen-recovery,frozen,recovery,receivables:r.receivables,severity,event};
}
function validVentureRisk(c,year){
 const r=c.ventureRisk;if(r===undefined)return true;const p=scenarioProject(c);
 return !!p&&r.version===1&&Number.isFinite(r.exposure)&&r.exposure>=.05&&r.exposure<=.95&&Number.isInteger(r.collectionDays)&&r.collectionDays>=25&&r.collectionDays<=150&&Number.isFinite(r.burnRate)&&r.burnRate>=.015&&r.burnRate<=.18&&Number.isFinite(r.receivables)&&r.receivables>=0&&Array.isArray(r.events)&&r.events.length<=2&&new Set(r.events.map(e=>e?.year)).size===r.events.length&&r.events.every(e=>e&&Number.isInteger(e.year)&&e.year>p.year&&e.year<=year&&typeof e.title==='string'&&e.title.length<150&&typeof e.text==='string'&&e.text.length<600&&typeof e.historical==='boolean'&&['expense','frozen','severity'].every(k=>Number.isFinite(e[k])&&e[k]>=0)&&e.severity<=3&&(!e.historical||e.year===p.crisisYear))&&(c.financialHistory||[]).every(row=>['riskExpense','riskFrozen','riskRecovered','riskReceivables','riskSeverity'].every(k=>row[k]===undefined||Number.isFinite(row[k])&&row[k]>=0));
}

function investmentTerms(c,s){
 if(c.capital){const p=scenarioProject(c),spec=fundingStages[c.capital.stage],amounts=[...(p?.amounts||spec.tickets)],limit=s?Math.floor(Math.min(nav(s)*.2,c.value*.5,c.capital.roundTarget)/50)*50:0;
  if(limit>200)for(const f of [.25,.5,1]){const n=Math.floor(limit*f/50)*50;if(n>200&&!amounts.includes(n))amounts.push(n);}
  return {amounts:amounts.filter(n=>n<=c.capital.roundTarget).sort((a,b)=>a-b),minimum:amounts[0],maxEquity:p?.maxEquity||.35,scaled:!!s&&s.ruleset===12,largeLimit:limit,roundTarget:c.capital.roundTarget,stage:c.capital.stage};
 }
 const p=scenarioProject(c);if(p)return {amounts:[...p.amounts],minimum:p.amounts[0],maxEquity:p.maxEquity};
 const amounts=[50,100,200];if(!s||s.ruleset!==12)return {amounts,minimum:50,maxEquity:1};
 // Only new subscriptions change. Quotes never mutate projects, saved accounts or RNG.
 // Retain small tickets; larger ones use at most 20% of NAV and one third post-money ownership.
 const fundLimit=Math.max(0,nav(s))*.2,projectLimit=Math.max(0,c.value)*.5;
 const largeLimit=Math.floor(Math.min(fundLimit,projectLimit)/50)*50;
 if(largeLimit>200)for(const fraction of [.25,.5,1]){const n=Math.floor(largeLimit*fraction/50)*50;if(n>200&&!amounts.includes(n))amounts.push(n);}
 return {amounts,minimum:50,maxEquity:1,scaled:true,largeLimit,fundLimit,projectLimit};
}
function newDeals(s){
 const used=usedCompanyNames(s),deals=Array.from({length:4},(_,i)=>deal(s,i,used));
 if(s.ruleset===12)for(const p of scenarioProjects.filter(p=>p.year===s.year)){
  const id=p.year+(p.fictional?'-P-':'-H-')+p.key;
  if([...s.portfolio,...Object.values(s.markets||{}).flatMap(m=>m.members)].some(c=>c.id===id||c.name===p.name))continue;
  // A separate stream keeps the ordinary four projects and fund RNG unchanged.
  const local={...s,seed:hash(s.marketSeed+':historical:'+p.key),markets:undefined};
  const c=deal(local,7,used,p);registerMarket(s,c);deals.push(c);
 }
 return deals;
}
function scaleNewDeal(s,c,i){
 if(s.year<2000)return;
 const ceiling=s.year<2009?3:s.year<2017?6:s.year<2026?12:s.year<2038?20:28;
 // Independent deterministic selection: size must not consume the campaign RNG or imply quality.
 const salt=(s.marketSeed??s.seed)+':project-size:'+s.year,slot=(i+hash(salt)%4)%4;
 if(slot<2)return; // Keep two small opportunities alongside one growth and one larger business.
 // Supply grows with the fund, so a shrinking fund is not surrounded by unaffordable giants.
 const fundFactor=clamp(Math.sqrt(Math.max(0,nav(s))/25000),.05,2.5);
 const variation=.85+hash(salt+':'+i)/4294967296*.3;
 const wanted=1+(ceiling-1)*fundFactor*[0,0,.35,1][slot]*variation;
 const m=s.markets?.[c.sector],owned=new Set(s.portfolio.filter(x=>x.status==='active').map(x=>x.id));
 const available=m?m.unserved+m.members.filter(x=>!x.failed&&!x.acquiredBy&&!owned.has(x.id)).reduce((n,x)=>n+x.customers,0):0;
 // Larger entrants take existing orders; never create customers or drain an entire industry on arrival.
 const capacity=m?Math.max(c.revenue,Math.floor(Math.min(m.total*.06,available*.15))):c.revenue;
 const revenue=Math.max(c.revenue,Math.min(Math.round(c.revenue*wanted),capacity)),factor=revenue/c.revenue;
 c.revenue=revenue;c.team=Math.max(c.team,Math.round(c.team*Math.pow(factor,.85)));
 c.growth=Math.max(5,Math.round(c.growth/Math.pow(factor,.25)));
}
function deal(s,i,used=usedCompanyNames(s),historical=null){
 const available=availableSectors(s),sector=available[Math.floor(rng(s)*available.length)];
 const selected=historical?sectors.find(x=>x.name===historical.sector):sector;
 const entropy=Math.floor(rng(s)*4294967296)+':'+Math.floor(rng(s)*4294967296);
 const name=historical&&!historical.fictional?historical.name:companyName(s,selected.name,s.year+'-'+i,entropy,used);
 const c={id:historical?s.year+(historical.fictional?'-P-':'-H-')+historical.key:s.year+'-'+i,name,sector:selected.name,icon:selected.icon,desc:selected.desc,edge:selected.edge,risk:selected.risk,value:1,quality:.25+rng(s)*.7,volatility:.35+rng(s)*.45,revenue:Math.round(65+rng(s)*145),growth:Math.round(8+rng(s)*50),runway:Math.round(9+rng(s)*13),team:Math.round(6+rng(s)*20),dd:false,status:'available',age:0,invested:0,equity:0,round:null,proceeds:0,notes:[]};
 if(historical){Object.assign(c,{...(historical.fictional?{scenarioProject:historical.key}:{realProject:historical.key}),desc:historical.product,edge:historical.edge,risk:historical.risk,quality:.5+rng(s)*.38,volatility:.45+rng(s)*.3,revenue:Math.round(historical.revenue+rng(s)*historical.revenueRange),team:Math.round(historical.team+rng(s)*historical.teamRange),growth:Math.round(25+rng(s)*40)});const exposure=.05+rng(s)*.9;c.ventureRisk={version:1,exposure,collectionDays:Math.round(25+exposure*125),burnRate:.015+exposure*.07,receivables:0,events:[]};}
 if(s.ruleset===12&&!historical)scaleNewDeal(s,c,i);
 if(isContinuous(s))capitalFields(s,c,i,historical);
 if(s.ruleset===12){c.economyVersion=12;c.expansionStreak=0;}financials(c,s.year);if(historical){if(historical.deliveryEfficiencyRange)c.costRate=Math.max(.12,c.costRate-.04-rng(s)*historical.deliveryEfficiencyRange);c.cash+=c.revenue*(.1+rng(s)*.9);Object.assign(c.financialHistory[0],{cash:c.cash,cashOpening:c.cash});}acquisitionFields(c);financeFields(c);workoutFields(c);c.liquidation=null;divestFields(c);rebuildFields(c);dividendFields(c);c.competition=.2+rng(s)*.6;const k=costs(c,c.revenue);c.costs=k.total;c.profit=c.revenue-c.costs;c.cashFlow=c.profit-c.capex;c.profitYears=c.profit>0?1:0;runway(c);
 // Mature-market entry prices reflect slower growth; saved offers and the first act are never repriced.
 const continuationDiscount=matureMarket(s)&&s.ruleset===12?.75:1;
 const priceNoise=.9+rng(s)*.3,askingPremium=historical?.6+rng(s)*1.25:s.ruleset===12?1.8+c.growth*.02+c.quality*.8+(era(s.year).hot.includes(c.sector)?.4:0):1;c.value=Math.max(historical?historical.minimumValue:0,Math.round(historical?Math.max(0,fundamental(c,era(s.year))-c.cash)*priceNoise*askingPremium+c.cash:fundamental(c,era(s.year))*priceNoise*askingPremium*continuationDiscount));Object.assign(c.financialHistory[0],k,{costs:c.costs,profit:c.profit,cashFlow:c.cashFlow,competition:c.competition,value:c.value});if(expanded(s)){expansionFields(s,c);if(['b','c','preIPO'].includes(c.capital.stage)&&hash(c.id+':covenant')%5===0&&s.year<2048)c.capital.extension.covenant={dueYear:s.year+2,target:c.revenue*1.3,status:'active'};}if(isContinuous(s))finishCapitalOffer(s,c);if(expanded(s)&&c.capital.public){const p=c.capital.public;p.shares=1000000;p.issuePrice=c.value/1000000;p.issueValue=c.value;p.lastTradeMonth=null;c.capital.extension.founderUnlockMonth=capitalClock(s)+36;}if(s.markets)registerMarket(s,c);if(quarterly(s))startQuarterBook(s,c);return c;
}
function sourceDeals(s){if(s.ended)return;const wanted=level(s,'research');while(s.extraDeals<wanted){const i=4+s.extraDeals++;s.deals.push(deal(s,i));log(s,`行业研究员发现额外项目：${s.deals.at(-1).name}。`);}record(s);}
// A separate campaign marker keeps archived funds reproducible while the current game runs for sixty years.
function isContinuous(s){return s?.campaign?.version===1;}
function matureMarket(s){return !!s.continuation||isContinuous(s)&&s.year>=2026;}
const fundingStages=Object.freeze({
 angel:{name:'天使轮',purpose:'验证产品、完成样品与第一批交付',multiple:.55,minimum:120,tickets:[20,50,100],raise:.22},
 preA:{name:'Pre-A 轮',purpose:'补足验证资金，检验客户复购与单位经济',multiple:1,minimum:450,tickets:[50,100,200],raise:.20},
 a:{name:'A 轮',purpose:'复制已验证的业务，建立交付与销售体系',multiple:2,minimum:1200,tickets:[100,200,400],raise:.20},
 b:{name:'B 轮',purpose:'扩大成熟业务，建设产能与区域渠道',multiple:5,minimum:4000,tickets:[200,500,1000],raise:.18},
 c:{name:'C 轮及以后',purpose:'规模经营、行业整合与组织升级',multiple:12,minimum:12000,tickets:[500,1000,2000],raise:.16},
 preIPO:{name:'Pre-IPO',purpose:'规范治理、补足上市准备与经营资金',multiple:25,minimum:35000,tickets:[500,1000,3000],raise:.14},
 ipo:{name:'IPO 新股发行',purpose:'公开发行新股，为企业募集发展资金',multiple:35,minimum:60000,tickets:[100,300,1000],raise:.20}
});
const stageOrder=['angel','preA','a','b','c','preIPO'];
function classifyLegacy(c){const n=c.financialHistory?.[0]?.revenue??c.revenue;return n>=3000?'preIPO':n>=1000?'c':n>=400?'b':n>=150?'a':n>=70?'preA':'angel';}
function capitalFields(s,c,i=0,historical=null,legacy=false){
 if(c.capital)return;
 const salt=hash(c.id+':capital:'+s.marketSeed),slot=i%4;
 const named={kingsoft:'a',tencent:'angel',alibaba:'a',byd:'a',baidu:'a',jd:'b',leshi:'b',xiaomi:'a',meituan:'a',catl:'a',bytedance:'a',luckin:'b'};
 const stage=legacy?classifyLegacy(c):historical?(named[historical.key]||'a'):slot===0?'angel':slot===1?(salt%2?'preA':'a'):slot===2?(salt%2?'a':'b'):s.year>=1995?['b','c','preIPO','ipo'][salt%4]:'b';
 const spec=fundingStages[stage],technology=['企业软件','精密制造','通信设备','生物科技','清洁能源','人工智能','半导体','航空航天','农业科技','企业服务'].includes(c.sector);
 c.capital={version:1,stage,entryStage:stage,technology,observedYear:s.year,legacy,roundTarget:0,pendingExpense:0,lastYear:s.year,history:[],resource:null,public:null,application:null};
 if(!legacy&&!historical){const factor=spec.multiple;c.revenue=Math.max(15,Math.round(c.revenue*factor));c.team=Math.min(5000,Math.max(3,Math.round(c.team*Math.pow(factor,.8))));c.growth=Math.max(3,Math.round(c.growth/Math.pow(Math.max(1,factor),.3)));}
}
function issuerHistory(s,c){
 if(c.capital.legacy||scenarioProject(c)||!['preIPO','ipo'].includes(c.capital.stage))return;
 const original=c.cash,g=clamp(c.growth/100,.03,.2),rows=[];let cash=original;
 for(let ago=3;ago>=1;ago--){const revenue=c.revenue/Math.pow(1+g,ago),trial={...c,revenue,team:Math.max(3,Math.round(c.team/Math.pow(1+g,ago*.8)))},k=costs(trial,revenue),profit=revenue-k.total,capex=revenue*profiles[c.sector].capex,flow=profit-capex,opening=cash,financing=Math.max(0,original*.5-opening-flow);cash=opening+flow+financing;
  rows.push({year:s.year-ago,revenue,...k,costs:k.total,profit,capex,workingCapital:0,cashFlow:flow,cashOpening:opening,cash,financing,competition:c.competition,value:c.value,revenueSource:'issuer',growth:c.growth,support:0,strategy:'balanced',opening:false,event:financing>0?'发行材料历史记录：股东增资补足经营周转':'发行材料历史经营记录'});
 }
 c.cash=cash;c.value=Math.max(0,c.value+cash-original);Object.assign(c.financialHistory[0],{cash,cashOpening:cash,value:c.value});c.financialHistory=[...rows,...c.financialHistory];runway(c);
 const ready=rows.slice(-2).every(r=>r.profit>0&&r.cashFlow>0)||s.year>=2019&&c.capital.technology&&c.quality>=.7&&c.cash>c.costs;
 if(c.capital.stage==='ipo'&&!ready)c.capital.stage=c.capital.entryStage='preIPO';
}
function finishCapitalOffer(s,c){
 if(!c.capital)return;issuerHistory(s,c);const p=fundingStages[c.capital.stage],special=scenarioProject(c);
 if(!c.capital.legacy&&!special){
  if(c.capital.stage==='ipo'){const issueFactor=.88+marketRandom(s,c.id+':issue-price')*.4;c.value=Math.max(100,enterpriseValue({...c,growth:clamp(c.growth*.5,0,8)},era(s.year))*issueFactor+c.cash-debtBalance(c));for(const r of c.financialHistory.filter(r=>!r.opening))r.value=fundamental({...c,...r},era(r.year));}
  else c.value=Math.max(c.value,p.minimum);
 }
 if(expanded(s)&&c.capital.stage==='ipo')c.value=issuancePricing(s,c,s.year>=2019&&c.capital.technology?'star':s.year>=2009?'chinext':'main').preValue;
 c.capital.roundTarget=Math.ceil(Math.max(p.tickets.at(-1),special?.amounts.at(-1)||0,c.value*p.raise)/10)*10;
 if(c.capital.stage==='ipo')c.capital.public={year:s.year,venue:expanded(s)?(s.year>=2019&&c.capital.technology?'star':s.year>=2009?'chinext':'main'):listingVenues(s,c).at(-1)?.key||'main',locks:[],priceFactor:1,lastTradeYear:null,...(!c.capital.legacy?{offerGrowth:clamp(c.growth*.5,0,8)}:{})};
 c.financialHistory.at(-1).value=c.value;
}
function createCampaign(seed=Date.now()>>>0,ruleset=12){return fresh(seed,ruleset,{continuous:true});}
function campaignBackupKey(raw){return 'longview-vc-save-v1-before-continuous-'+hash(raw).toString(16)+'-'+raw.length;}
function toContinuous(input,original=JSON.stringify(input)){
 const s=migrate(input);if(isContinuous(s))return s;
 s.campaign={version:1,startYear:1990,endYear:2050,importedYear:s.year,legacySettlement:!!s.continuation||s.ended&&s.year===2026,backupKey:campaignBackupKey(original)};
 for(const c of [...s.deals,...s.portfolio])capitalFields(s,c,0,null,true);
 for(const c of s.deals)finishCapitalOffer(s,c);
 if(s.ended&&s.year===2026){s.ended=false;for(const t of Object.values(s.team))t.active=false;s.extraDeals=0;s.deals=newDeals(s);sourceDeals(s);}
 if(!valid(s))throw Error('旧档暂时无法接入连续经营，原件已保留');return s;
}
function resourceQuote(s,c,amount){
 const partners=s.portfolio.filter(x=>x.status==='active'&&x.id!==c.id&&x.sector===c.sector&&x.cashFlow>0).map(x=>x.id),available=partners.length>0;
 return {ok:available,partners,fee:Math.round((5+Math.min(25,amount*.02))*10)/10,reason:available?'':'需要可合作的同行业盈利持仓；投后经理可帮助协调，但不能凭空带来产业资源'};
}
function capitalTransaction(c,entry){c.capital.history.push(entry);c.capital.lastYear=entry.year;}
function investCapital(s,c,amount,thesis,mode='financial'){
 const q=investmentOutlook(s,c.id,amount,mode);if(!q?.ok)return false;if(quarterly(s))startQuarterBook(s,c,true);
 const pre=c.value,raise=c.capital.roundTarget,fee=c.capital.stage==='ipo'?raise*.035:0,opening=c.cash;
 s.cash-=amount;s.invested+=amount;if(mode==='strategic')expense(s,q.resource.fee,'operations');
 c.equity=amount/(pre+raise);c.cash+=raise-fee;c.value=pre+raise-fee;c.invested=amount;c.status='active';c.founded=s.year;c.capital.entryRevenue=c.revenue;
 if(thesis&&['cash','growth','product'].includes(thesis))c.thesis={kind:thesis,year:s.year,revenue:c.revenue,profit:c.profit,equity:c.equity};c.exitPolicy='review';
 if(c.capital.extension){const factor=pre/(pre+raise);c.capital.extension.founderStake*=factor;if(c.capital.public)c.capital.public.shares=(c.capital.public.shares||1000000)/factor;}
 if(c.capital.public&&mode==='strategic')addPublicLock(c,c.equity,Math.min(2050,s.year+1),expanded(s)?Math.min(2050*12,capitalClock(s)+12):null);
 if(mode==='strategic')c.capital.resource={year:s.year,until:s.year+3,partners:q.resource.partners,fee:q.resource.fee,boost:0};
 capitalTransaction(c,{year:s.year,kind:c.capital.stage==='ipo'?'ipo':'primary',stage:c.capital.stage,raise,fee,fundAmount:amount,preValue:pre,postValue:pre+raise,equityBefore:0,equityAfter:c.equity,cashBefore:opening,cashAfter:c.cash,purpose:fundingStages[c.capital.stage].purpose,mode});
 if(c.capital.extension&&c.capital.stage==='ipo'&&!c.capital.extension.achievement){const x=c.capital.extension,p=c.capital.public,v=exchangeRules[p.venue],change=(marketRandom(s,c.id+':subscription-day:'+capitalClock(s))*2-1)*v.swing;c.value*=1+change;x.achievement={month:capitalClock(s),venue:p.venue,title:'认购公开上市新股'};x.quotes.push({month:capitalClock(s),value:c.value,price:c.value/p.shares,change,event:'上市首日'});}
 c.notes.push(`${s.year} 年认购${fundingStages[c.capital.stage].name} ${amount} 万元，本轮共募集 ${raise.toFixed(1)} 万元，其他投资人认购 ${(raise-amount).toFixed(1)} 万元。`);
 s.portfolio.push(c);s.deals=s.deals.filter(x=>x.id!==c.id);runway(c);syncMarket(s,c);log(s,`${c.name} · ${fundingStages[c.capital.stage].name}交割，基金投入 ${amount.toFixed(1)} 万，持股 ${(c.equity*100).toFixed(2)}%。`,'investment');record(s);return true;
}
function nextFundingStage(c){
 const rows=c.financialHistory.filter(r=>!r.opening),index=stageOrder.indexOf(c.capital.stage);if(index<0||index>=stageOrder.length-1)return c.capital.stage;
 const base=c.financialHistory[0].revenue,observed=rows.length,positive=rows.slice(-2).length===2&&rows.slice(-2).every(r=>r.profit>0&&r.cashFlow>0);
 const ready=index<2?observed>=2&&c.revenue>=base*1.1:index<4?positive&&c.revenue>=base*(index===2?1.4:1.8):positive&&observed>=4;
 return ready?stageOrder[index+1]:c.capital.stage;
}
function growthFunding(c,year){return c.capital&&!c.capital.public&&c.capital.application?.status!=='review'&&year-c.capital.lastYear>=2&&nextFundingStage(c)!==c.capital.stage&&c.cash<c.costs*1.5;}
function addPublicLock(c,equity,unlockYear,unlockMonth=null){const p=c.capital?.public;if(!p||equity<=0)return;const existing=p.locks.find(x=>x.unlockYear===unlockYear&&(x.unlockMonth??null)===unlockMonth);if(existing)existing.equity+=equity;else p.locks.push({equity,unlockYear,...(unlockMonth!==null?{unlockMonth}:{})});}
function adjustLocks(c,factor){if(c.capital?.extension)c.capital.extension.founderStake=(c.capital.extension.founderStake||0)*factor;if(c.capital?.public){for(const lock of c.capital.public.locks)lock.equity*=factor;if(c.capital.extension)c.capital.public.shares=(c.capital.public.shares||1000000)/factor;}}
function capitalFunding(s,c,row,need,shock){
 const previous=c.capital.stage,stage=need?previous:nextFundingStage(c),pre=Math.max(1,c.value),plan=fundingPlan(c,row),gap=need?plan.gap:Math.max(20,c.costs*.75-c.cash),raise=Math.min(pre*.6,gap);
 if(raise<=1e-7)return false;
 const odds=clamp(.22+c.quality*.42+(c.profit/Math.max(1,c.revenue))*.2+(era(s.year).m-1)*.3-(row.riskSeverity||0)*.2,.05,.85);
 if(shock>=odds){if(need)row.event+='；本轮融资未完成';return false;}
 const previousPrice=c.capital.history.at(-1)?.postValue,pricing=previousPrice&&pre<previousPrice*.95?'down':'normal';const oldEquity=c.equity,opening=c.cash;c.cash+=raise;c.value+=raise;c.equity*=pre/(pre+raise);adjustLocks(c,pre/(pre+raise));
 c.round={cost:oldEquity*raise,oldEquity,raise,purpose:need?'补足经营周转缺口':fundingStages[stage].purpose,gap,stage,bridge:need,preValue:pre,postValue:pre+raise};
 c.capital.stage=stage;row.financing+=raise;row.fundingPlan={...plan,gap,purpose:c.round.purpose};
 capitalTransaction(c,{year:s.year,kind:c.capital.public?'placement':need?'bridge':'primary',stage,pricing,raise,fee:0,fundAmount:0,preValue:pre,postValue:pre+raise,equityBefore:oldEquity,equityAfter:c.equity,cashBefore:opening,cashAfter:c.cash,purpose:c.round.purpose,mode:'financial'});
 log(s,`${c.name} · ${need?'过桥融资':fundingStages[stage].name}完成 ${raise.toFixed(1)} 万；本年可按比例跟投，未跟投部分按实际增资稀释。`,'warning');return true;
}
function legacyListingVenues(s,c){
 const venues=[{key:'main',name:'主板',from:1990,technology:false}];if(s.year>=2009)venues.push({key:'chinext',name:'创业板',from:2009,technology:false});if(s.year>=2019&&c.capital?.technology)venues.push({key:'star',name:'科创板',from:2019,technology:true});return venues;
}
function legacyListingQuote(s,id,venue='main'){
 const c=s.portfolio.find(x=>x.id===id&&x.status==='active');if(!c||!c.capital)return {ok:false,reason:'这家企业不在当前持仓中'};
 const rows=c.financialHistory.filter(r=>!r.opening),recent=rows.slice(-2),v=listingVenues(s,c).find(x=>x.key===venue),profitable=recent.length===2&&recent.every(r=>r.profit>0&&r.cashFlow>0),science=venue==='star'&&c.capital.technology&&c.quality>=.7&&c.revenue>=1000&&c.cash>=Math.max(c.costs,Math.max(0,-c.cashFlow)*2);
 const fee=Math.max(2,Math.min(30,c.value*.001)),lockYears=c.equity>=.3?3:1;
 const reason=s.ended||s.year>2049-lockYears?'已接近 2050 年，来不及完成发行准备与约定锁定期':c.capital.public?'企业已经上市':!v?'当前年份或企业类型不适用这个市场':c.capital.application?.status==='review'?'已有申请正在推进':c.capital.application&&s.year-c.capital.application.year<2?'上次申请后仍需整改和更新材料':rows.length<3||c.age<4&&!['c','preIPO'].includes(c.capital.entryStage)?'企业需要三年完整经营材料，早期项目还需先验证并扩大业务':!['c','preIPO'].includes(c.capital.stage)&&!(c.revenue>=Math.max(500,c.financialHistory[0].revenue*3)&&rows.length>=4&&c.quality>=.65)?'先完成业务验证与规模经营，再考虑上市，不必依次完成所有融资轮次':!profitable&&!science?'财务与研发成果尚不足以支持发行准备':c.distress||c.integration||currentRebuild(c)||c.round?'先处理债务、融资或未完成的整合建设':c.cash<fee+Math.max(30,c.costs*.5)?'公司需要先留够申请费用和经营储备':'';
 return {ok:!reason,reason,venue,venueName:v?.name||'',fee,raise:Math.max(100,c.value*.2),lockYears,route:science?'科创成长路径':'持续经营路径'};
}
function legacyApplyListing(s,id,venue='main'){
 const q=listingQuote(s,id,venue);if(!q.ok)return false;const c=s.portfolio.find(x=>x.id===id);c.cash-=q.fee;c.capital.pendingExpense+=q.fee;c.value=Math.max(0,c.value-q.fee);c.capital.application={year:s.year,venue,status:'review',fee:q.fee,lockYears:q.lockYears};
 c.notes.push(`${s.year} 年启动${q.venueName}发行准备，公司支付资料、审计与治理准备费用 ${q.fee.toFixed(1)} 万；后续仍需审核和市场窗口。`);runway(c);syncMarket(s,c);record(s);return true;
}
function settleListing(s,c,row,shock){
 const a=c.capital.application;if(c.round||c.distress)return;if(!a||a.status!=='review'||s.year<=a.year)return;
 // Passing preparation is a simulation outcome, not a promise of approval or future price.
 const v=listingVenues(s,c).find(x=>x.key===a.venue),good=c.profit>0&&c.cashFlow>0||a.venue==='star'&&c.quality>=.7&&c.cash>c.costs;
 const unfinished=!!c.integration||!!currentRebuild(c);
 const reason=unfinished?'新增整合或建设尚未完成，需要更新发行材料':s.year+(a.lockYears||1)>2050?'剩余时间不足以完成发行及锁定安排':!v?'本次市场暂不适用':!good?'经营与现金材料尚未满足发行条件':era(s.year).m<.8?'市场窗口收紧':'本轮核查尚未通过';
 if(unfinished||s.year+(a.lockYears||1)>2050||!v||!good||era(s.year).m<.8||shock>.35+c.quality*.35){a.status='withdrawn';a.resultYear=s.year;a.reason=reason;c.notes.push(`${s.year} 年发行准备暂缓：${reason}；前期准备费 ${money(a.fee)} 万不退，需整改后再议。`);return;}
 const pre=Math.max(1,c.value),raise=Math.max(100,pre*.2),fee=raise*.035,old=c.equity,opening=c.cash;c.equity*=pre/(pre+raise);c.cash+=raise-fee;c.value=pre+raise-fee;
 c.capital.public={year:s.year,venue:a.venue,locks:[{equity:c.equity,unlockYear:s.year+(a.lockYears||1)}],priceFactor:1,lastTradeYear:null};c.capital.stage='ipo';a.status='listed';a.resultYear=s.year;c.round=null;row.financing+=raise-fee;
 capitalTransaction(c,{year:s.year,kind:'ipo',stage:'ipo',raise,fee,fundAmount:0,preValue:pre,postValue:pre+raise,equityBefore:old,equityAfter:c.equity,cashBefore:opening,cashAfter:c.cash,purpose:'公开发行新股募集发展资金',mode:'public'});
 log(s,`${c.name} 完成${v.name}发行，企业净募资 ${(raise-fee).toFixed(1)} 万；原有持股稀释并按本次条款锁定至 ${s.year+(a.lockYears||1)} 年，基金没有因此自动收到退出款。`,'success');
}
function legacyPublicQuote(s,id,fraction=1){
 const c=s.portfolio.find(x=>x.id===id&&x.status==='active'),p=c?.capital?.public;if(!p)return {ok:false,reason:'这不是上市持仓'};
 const locked=p.locks.filter(x=>x.unlockYear>s.year).reduce((n,x)=>n+x.equity,0),available=Math.max(0,c.equity-locked),liquidity=.005+marketRandom(s,c.id+':liquidity:'+s.year)*.025,tradable=Math.min(available,liquidity),sold=tradable*fraction,feeRate=.003,value=c.equity>0?exitValue(c,1)*sold/c.equity:0;
 const reason=s.ended?'基金已经结算':![.25,.5,1].includes(fraction)?'请选择可流通股份的四分之一、一半或全部':available<=0?(locked>0?'当前股份仍在锁定期':'当前没有可出售股份'):p.lastTradeYear===s.year?'今年已办理过一次减持，下一年再议':c.distress?'先处理偿债危机':'';
 return {ok:!reason,reason,fraction,locked,available,tradable,liquidity,sold,gross:value,fee:value*feeRate,proceeds:value*(1-feeRate),unlockYear:Math.max(s.year,...p.locks.filter(x=>x.unlockYear>s.year).map(x=>x.unlockYear))};
}
function legacySellPublic(s,id,fraction=1){
 const q=publicQuote(s,id,fraction);if(!q.ok)return false;const c=s.portfolio.find(x=>x.id===id),p=c.capital.public;
 if(q.sold>=c.equity*(1-1e-9)){p.lastTradeYear=s.year;realize(s,c,q.proceeds,'上市退出');}
 else{c.equity-=q.sold;c.proceeds+=q.proceeds;s.cash+=q.proceeds;s.returned+=q.proceeds;p.lastTradeYear=s.year;log(s,`${c.name} · 减持可流通股，扣除费用到账 ${q.proceeds.toFixed(1)} 万，剩余持股 ${(c.equity*100).toFixed(2)}%。`,'success');}
 (c.capital.trades??=[]).push({year:s.year,equity:q.sold,proceeds:q.proceeds,fee:q.fee});record(s);return true;
}
function prepareCapital(s,c){
 const r=c.capital?.resource;if(!r)return;
 r.boost=0;const partners=r.partners.some(id=>s.portfolio.some(x=>x.id===id&&x.status==='active'&&x.cashFlow>0));
 if(s.year<=r.until&&partners&&marketRandom(s,c.id+':resource:'+s.year)<Math.min(.85,.5+level(s,'operations')*.1)){r.boost=.04+level(s,'operations')*.01;r.lastResult='对接形成了可用渠道，订单仍参与市场竞争';}
 else r.lastResult=s.year>r.until?'约定协同期已结束':partners?'本期对接尚未转化为可用渠道':'合作方暂时无法继续提供资源';
}
function settleCapital(s,c,row,shock,priorPremium=1){
 if(expanded(s)&&c.capital?.extension){settleExpandedYear(s,c,row,priorPremium);return;}const p=c.capital?.public;if(p&&s.year>p.year){p.priceFactor=clamp(Math.pow(clamp(priorPremium,.4,4),.65)*(.8+marketRandom(s,c.id+':public:'+s.year)*.4+clamp((c.organicGrowth||0)*.004,-.2,.2)),.4,3);const cash=Math.max(0,c.cash),debt=debtBalance(c);c.value=Math.max(0,Math.max(0,c.value-cash+debt)*p.priceFactor+cash-debt);}
 if(c.capital&&!p)settleListing(s,c,row,shock);
}
function validCapital(c,year){
 const f=c.capital;if(f===undefined)return true;
 if(!f||f.version!==1||!Object.hasOwn(fundingStages,f.stage)||!Object.hasOwn(fundingStages,f.entryStage)||typeof f.technology!=='boolean'||typeof f.legacy!=='boolean'||!Number.isInteger(f.observedYear)||f.observedYear>year||!Number.isFinite(f.roundTarget)||f.roundTarget<0||!Number.isFinite(f.pendingExpense)||f.pendingExpense<0||!Number.isInteger(f.lastYear)||f.lastYear>year||!Array.isArray(f.history)||f.history.length>(f.extension?.quarterly?4096:f.extension?1024:128))return false;
 if(f.history.some(r=>!r||!Number.isInteger(r.year)||r.year>year||!Object.hasOwn(fundingStages,r.stage)||!['primary','bridge','ipo','placement','follow'].includes(r.kind)||!['raise','fee','fundAmount','preValue','postValue','equityBefore','equityAfter'].every(k=>Number.isFinite(r[k])&&r[k]>=0)||!['cashBefore','cashAfter'].every(k=>Number.isFinite(r[k]))||r.equityBefore>1||r.equityAfter>1||r.fee>r.raise||r.kind!=='follow'&&r.fundAmount>r.raise||Math.abs(r.postValue-r.preValue-r.raise)>.001||Math.abs(r.cashAfter-r.cashBefore-r.raise+r.fee)>.001))return false;
 if(f.resource&&(!Number.isInteger(f.resource.year)||f.resource.year>year||f.resource.until!==f.resource.year+3||!Array.isArray(f.resource.partners)||!f.resource.partners.every(x=>typeof x==='string')||!['fee','boost'].every(k=>Number.isFinite(f.resource[k])&&f.resource[k]>=0)||f.resource.boost>.1))return false;
 if(f.public){const p=f.public;if(f.stage!=='ipo')return false;if(!Number.isInteger(p.year)||p.year>year||!Object.hasOwn(exchangeRules,p.venue)||p.venue==='star'&&p.year<2019||p.venue==='chinext'&&p.year<2009||!Array.isArray(p.locks)||p.locks.length>(f.extension?720:64)||p.locks.some(x=>!x||!Number.isFinite(x.equity)||x.equity<0||!Number.isInteger(x.unlockYear)||x.unlockYear>2050)||!Number.isFinite(p.priceFactor)||p.priceFactor<(f.extension?.001:.4)||p.priceFactor>(f.extension?1000:3)||p.lastTradeYear!==null&&(!Number.isInteger(p.lastTradeYear)||p.lastTradeYear>year))return false;}
 if(f.public?.offerGrowth!==undefined&&(!Number.isFinite(f.public.offerGrowth)||f.public.offerGrowth<0||f.public.offerGrowth>8))return false;
 if(f.public&&c.status==='active'&&f.public.locks.filter(x=>x.unlockYear>year).reduce((n,x)=>n+x.equity,0)>c.equity+1e-7)return false;
 if(!f.public&&f.stage==='ipo')return false;
 if(f.application&&(!Number.isInteger(f.application.year)||f.application.year>year||!Object.hasOwn(exchangeRules,f.application.venue)||!['review','withdrawn','listed'].includes(f.application.status)||!Number.isFinite(f.application.fee)||f.application.fee<0||f.application.lockYears!==undefined&&![1,3].includes(f.application.lockYears)||f.application.resultYear!==undefined&&(!Number.isInteger(f.application.resultYear)||f.application.resultYear>year)||f.application.reason!==undefined&&(typeof f.application.reason!=='string'||f.application.reason.length>200)))return false;
 if(f.trades&&(!Array.isArray(f.trades)||f.trades.length>(f.extension?720:60)||f.trades.some(r=>!r||!Number.isInteger(r.year)||r.year>year||!['equity','proceeds','fee'].every(k=>Number.isFinite(r[k])&&r[k]>=0))))return false;
 return validExpansion(c,year);
}

function fresh(seed=Date.now()>>>0,ruleset=12,options={}){if(![11,12].includes(ruleset))throw Error('Unknown economic rules');const s={version:10,...(options.continuous?{campaign:{version:1,startYear:1990,endYear:2050,...(options.expanded?{expansion:1,month:0}:{})}}:{}),...(ruleset===12?{ruleset:12}:{}),dividends:0,seed:seed>>>0,year:1990,initial:1000,cash:1000,invested:0,returned:0,expenses:0,expenseBreakdown:{legacy:0,research:0,operations:0,payroll:0,recruiting:0,training:0},team:emptyTeam(),extraDeals:0,portfolio:[],deals:[],logs:[],history:[],ended:false};s.deals=newDeals(s);initMarkets(s);log(s,'远见资本成立，1,000 万元到账。第一批项目已经送来。');record(s);return s;}
function teamQuote(s,key,action){
 const r=roles[key],t=s.team[key];if(!r||!t||s.ended)return {ok:false,reason:'基金已结案，或没有这个岗位'};
 let target=t.level,fee=0,salary=0;
 if(action==='hire'){if(t.level)return {ok:false,reason:'这个岗位已经有人了'};target=1;fee=r.entry;salary=r.salary[1];}
 else if(action==='upgrade'){if(!t.active)return {ok:false,reason:'先请这位同事回来，再谈晋升'};if(t.level>=3)return {ok:false,reason:'这位同事已经能独当一面，不必再晋升'};const required=t.level===1?1:3;if(t.years<required)return {ok:false,reason:`需累计服务 ${required} 年，当前 ${t.years} 年`};target++;fee=r.training[target];salary=r.salary[target]-r.salary[t.level];}
 else if(action==='resume'){if(!t.level||t.active)return {ok:false,reason:'这位同事还在岗'};salary=t.paidYear===s.year?0:r.salary[t.level];}
 else if(action==='pause'){if(!t.active)return {ok:false,reason:'这个岗位目前没有人在跟进'};return {ok:true,cost:0,fee:0,salary:0,target};}
 else return {ok:false,reason:'这项安排暂时办不了'};
 const cost=fee+salary;return {ok:s.cash+1e-8>=cost,cost,fee,salary,target,annual:r.salary[target],reason:s.cash+1e-8<cost?'账上的钱不够':''};
}
function manageTeam(s,key,action){
 const q=teamQuote(s,key,action);if(!q.ok)return false;const t=s.team[key],r=roles[key];
 if(action==='pause'){t.active=false;log(s,`暂停 ${r.name} 的工作，本年已付的薪酬不退。`);record(s);return true;}
 if(q.fee)expense(s,q.fee,action==='hire'?'recruiting':'training');if(q.salary)expense(s,q.salary,'payroll');t.level=q.target;t.active=true;t.paidYear=s.year;
 log(s,`${r.name} ${action==='hire'?'入职':action==='upgrade'?'升级':'恢复服务'} · ${t.level} 级，支付 ${q.cost.toFixed(1)} 万元（含本期薪酬）。`);if(key==='research')sourceDeals(s);if(key==='diligence')supplementDiligence(s);record(s);return true;
}
function renewTeam(s){for(const key of Object.keys(roles)){const t=s.team[key];if(!t.active)continue;const due=roles[key].salary[t.level];if(s.cash+1e-8>=due){expense(s,due,'payroll');t.paidYear=s.year;log(s,`${roles[key].name} 续聘，预付本期薪酬 ${due} 万元。`);}else{t.active=false;log(s,`现金不足，${roles[key].name} 暂时停工，已有资历保留。`,'warning');}}}
function diligenceCost(s){return level(s,'diligence')>0?0:5;}
function supplementDiligence(s){
 const l=level(s,'diligence');if(!l)return;
 const updated=s.deals.filter(c=>c.status==='available'&&c.dd&&c.ddLevel<l);
 for(const c of updated)c.ddLevel=l;
 if(updated.length)log(s,`尽调专家免费补全 ${updated.length} 份已尽调报告至 ${l} 级：${updated.map(c=>c.name).join('、')}。已含本期薪酬，不另收项目费用。`);
}
function research(s,id){const c=s.deals.find(c=>c.id===id),l=level(s,'diligence'),fee=diligenceCost(s);if(s.ended||!c||c.status!=='available'||c.ddLevel>=l||s.cash<fee)return false;if(fee>0)expense(s,fee,'research');c.dd=true;c.ddLevel=l;log(s,`完成 ${c.name} 的${l?'专家 '+l+' 级':'基础'}尽调${fee>0?'，支出 '+fee+' 万元':'，已含本期专家薪酬，不另收项目费用'}。`);record(s);return true;}
function stressProfit(c){const revenue=c.revenue*.8;return revenue-costs(c,revenue).total;}
function score(c){return Math.round(clamp(50+c.growth*.3+(c.profit/Math.max(1,c.revenue))*45-c.competition*22+Math.min(c.runway,24)*.5,0,100));}
function invest(s,id,amount,thesis=null,mode='financial'){const c=s.deals.find(c=>c.id===id);if(c?.capital)return investCapital(s,c,amount,thesis,mode);if(!c||!investmentOutlook(s,id,amount)?.ok)return false;s.cash-=amount;s.invested+=amount;c.equity=amount/(c.value+amount);c.value+=amount;c.cash+=amount;runway(c);c.invested=amount;c.status='active';c.founded=s.year;if(thesis&&['cash','growth','product'].includes(thesis)){c.thesis={kind:thesis,year:s.year,revenue:c.revenue,profit:c.profit,equity:c.equity};c.exitPolicy='review';}c.notes.push(`${s.year} 年首次投资 ${amount} 万元，资金进入企业现金账户`);s.portfolio.push(c);s.deals=s.deals.filter(d=>d.id!==id);log(s,`投资 ${c.name} ${amount} 万元，获得 ${(c.equity*100).toFixed(1)}% 股权。`,'investment');record(s);return true;}
function followQuote(s,id){
 const c=s.portfolio.find(c=>c.id===id);if(s.ended||!c||c.status!=='active'||c.distress||!c.round)return {ok:false,reason:'当前没有可办理的跟投'};
 const r=c.round,h=r.transactionIndex!==undefined?c.capital?.history[r.transactionIndex]:c.capital?.history.filter(h=>h.year===(r.issuedYear??s.year)&&['primary','bridge','placement'].includes(h.kind)).at(-1);
 // Subscription rights are the incremental shares allotted at financing close. A sale never recreates sold shares.
 const delta=h&&h.equityBefore>0?Math.max(0,h.equityBefore-h.equityAfter)*r.oldEquity/h.equityBefore:Math.max(0,r.oldEquity-c.equity);
 const after=c.capital?c.equity+delta:r.oldEquity,reason=c.capital?.public&&!h?'本轮认购份额需要核对，暂不能跟投':!Number.isFinite(after)||after>1+1e-8?'本轮认购份额需要核对':s.cash+1e-8<r.cost?'基金现金不足':'';
 return {ok:!reason,reason,cost:r.cost,before:c.equity,delta,after:Math.min(1,after)};
}
function follow(s,id){
 const q=followQuote(s,id);if(!q.ok)return false;const c=s.portfolio.find(c=>c.id===id),cost=q.cost;
 if(c.capital){capitalTransaction(c,{year:s.year,kind:'follow',stage:c.round.stage||c.capital.stage,raise:0,fee:0,fundAmount:cost,preValue:c.value,postValue:c.value,equityBefore:c.equity,equityAfter:q.after,cashBefore:c.cash,cashAfter:c.cash,purpose:'承接本轮约定的新增股份；已售股份不恢复，企业融资不重复入账',mode:'financial'});if(c.capital.public&&q.delta>0)addPublicLock(c,q.delta,Math.min(2050,s.year+1),expanded(s)?Math.min(2050*12,capitalClock(s)+12):null);}
 s.cash=Math.max(0,s.cash-cost);s.invested+=cost;c.invested+=cost;c.equity=q.after;c.round=null;
 c.notes.push(c.capital?`${s.year} 年按本轮认购权跟投 ${money(cost)} 万元，持股达到 ${ownership(c.equity)}；此前减持的股份不恢复。`:`${s.year} 年按比例认购本轮份额 ${cost.toFixed(1)} 万元；本轮资金已经到账，这笔跟投只用于保住持股`);
 log(s,c.capital?`${c.name} 完成跟投 ${money(cost)} 万元，新增持股 ${ownership(q.delta)}，本轮认购后持股 ${ownership(q.after)}。`:`${c.name} 完成跟投 ${cost.toFixed(1)} 万元，维持融资前持股比例。`,'investment');record(s);return true;
}
function money(n){return n===0?'0.0':Math.abs(n)<.1?n.toFixed(4):n.toFixed(1);}
function ownership(n){const p=n*100;return p>0&&p<.0001?'<0.0001%':p.toFixed(p>0&&p<.1?4:2)+'%';}
function exitReceipt(c){
 const total=c.proceeds||0,settlement=c.exitSettlement;
 if(settlement)return {current:settlement.amount,prior:settlement.prior,total,dividends:c.dividendReceived||0};
 const trades=c.capital?.trades||[],prior=c.status==='上市退出'?trades.slice(0,-1).reduce((n,r)=>n+r.proceeds,0):trades.reduce((n,r)=>n+r.proceeds,0);
 return {current:Math.max(0,total-prior),prior,total,dividends:c.dividendReceived||0};
}
function setStrategy(s,id,strategy){const c=s.portfolio.find(c=>c.id===id);if(s.ended||!c||c.status!=='active'||!Object.hasOwn(strategies,strategy)||c.strategy===strategy)return false;c.strategy=strategy;log(s,`${c.name} 下一年度策略：${strategies[strategy].name}。`);return true;}
function realize(s,c,value,status){if(quarterly(s))quarterlyOnExit(s,c);const p=currentRebuild(c);if(p){p.status='退出终止';p.endYear=s.year;}c.distress=null;if(c.integration){const a=c.acquisitions.find(a=>a.targetId===c.integration.targetId);a.status='整合终止';c.integration=null;}c.pendingDividend=0;c.pendingAllocationPrincipal=0;c.exitOffer=null;const prior=c.proceeds,total=isContinuous(s)?prior+value:value;if(isContinuous(s))c.exitSettlement={version:1,year:s.year,amount:value,prior,total};c.exitReview=exitReview(c,s.year,total,status);c.proceeds=total;c.status=status;c.round=null;s.cash+=value;s.returned+=value;syncMarket(s,c);c.notes.push(`${s.year} 年${status}，回款 ${value.toFixed(1)} 万元`);log(s,`${c.name} · ${status}，回款 ${value.toFixed(1)} 万元（含历史分红总回款 ${(((isContinuous(s)?total:value)+(c.dividendReceived||0))/c.invested).toFixed(2)}×）。`,(isContinuous(s)?total:value)+(c.dividendReceived||0)>=c.invested?'success':'warning');}
function saleFactor(s){return (s.ruleset===12?.5:.65)+level(s,'exit')*.05;}
function sell(s,id){if(s.portfolio.find(c=>c.id===id)?.capital?.public)return sellPublic(s,id,1);const c=s.portfolio.find(c=>c.id===id);if(s.ended||!c||c.status!=='active'||c.age<2||c.integration||c.distress||c.workoutYear===s.year||c.rescueYear===s.year||c.divestYear===s.year||currentRebuild(c))return false;realize(s,c,exitValue(c,saleFactor(s)),'股权转让');record(s);return true;}
function supportIds(s){const l=level(s,'operations'),cap=[0,3,6,10][l];return s.portfolio.filter(c=>c.status==='active').sort((a,b)=>a.runway-b.runway||a.profit-b.profit||a.id.localeCompare(b.id)).slice(0,cap).map(c=>c.id);}
// Pure annual operating statement. Identical shocks allow causal comparisons in tests.
function operate(c,e,support,shocks,market=null,integration=null,year=null){
 const p=profiles[c.sector],st=strategies[c.strategy],oldRevenue=c.revenue,opening=c.cash,teamOpening=c.team,hot=e.hot.includes(c.sector);
 const publicBuyback=c.capital?.extension?.pendingBuyback||0;const preparationFee=c.capital?.pendingExpense||0;const paidPrice=c.pendingAcquisitionPrice||0,paidFee=c.pendingAcquisitionFee||0,acquiredRevenue=c.acquisitionBaseRevenue||0,loanDrawdown=c.pendingLoanDrawdown||0,acquisitionEquity=c.pendingEquityRaise||0,rescueEquity=c.pendingRescueEquity||0,workoutFee=c.pendingWorkoutFee||0,noncashFee=c.pendingNoncashFee||0,rescuePrincipal=c.pendingRescuePrincipal||0,debtConversion=c.pendingDebtConversion||0,divestPrice=c.pendingDivestPrice||0,divestFee=c.pendingDivestFee||0,divestPrincipal=c.pendingDivestPrincipal||0,divestRevenue=c.pendingDivestRevenue||0,rebuildExpense=c.pendingRebuildExpense||0,rebuildCapex=c.pendingRebuildCapex||0,dividend=c.pendingDividend||0,allocationPrincipal=c.pendingAllocationPrincipal||0;
 let interestExpense=0;for(const l of c.loans||[]){if(l.defaulted||l.balance<=1e-7)continue;interestExpense+=l.balance*l.rate;l.due=l.balance/Math.max(1,l.remaining);l.remaining=Math.max(0,l.remaining-1);}const principalDue=debtDue(c);c.interestExpense=interestExpense;
 let event='正常经营',supplyShock=0,demandShock=0;
 c.competition=market?market.pressure:clamp(c.competition+(hot?.025:-.008)+(shocks.competition-.5)*.09,.1,.95);
 if(market){event=market.won||market.lost?`客户竞争：赢得 ${market.won}，流失 ${market.lost}；份额 ${(market.share*100).toFixed(1)}%`:'客户续约与行业需求结算';if(shocks.event>=.08&&shocks.event<.13){supplyShock=.09;event+='；供应与交付成本上涨';}}
 else if(shocks.event<.08){c.competition=clamp(c.competition+.1,.1,.95);event='竞争对手降价，获客与毛利承压';}
 else if(shocks.event<.13){supplyShock=.09;event='供应与交付成本上涨';}
 else if(shocks.event<.18){demandShock=-.18;event='主要客户流失，收入承压';}
 const g=market?(market.customers*market.unitPrice/Math.max(.001,oldRevenue)-1):clamp(.04+(c.quality-.5)*.32+clamp(c.growth/100,-.5,.6)*.18+(hot?.12:0)+(e.m-1)*.55-(c.competition-.35)*.32+(shocks.growth-.5)*c.volatility*.45+st.growth+support*.02+demandShock,-.6,.65);
 c.revenue=market?market.customers*market.unitPrice:Math.max(1,oldRevenue*(1+g));if(market)c.market=market;c.growth=g*100;c.organicGrowth=(c.revenue/Math.max(.001,oldRevenue+acquiredRevenue-divestRevenue)-1)*100;
 if(modern(c)){c.team=plannedTeam(c,c.revenue);c.expansionStreak=c.strategy==='expand'?Math.min(7,(c.expansionStreak||0)+1):Math.max(0,(c.expansionStreak||0)-(c.strategy==='defend'?2:1));}
 else if(c.strategy==='expand')c.team=Math.min(10000,c.team+Math.max(1,Math.round(c.team*.08)));
 else if(c.strategy==='defend')c.team=Math.max(3,Math.floor(c.team*.92));
 else if(g>.18&&c.profit>0)c.team=Math.min(10000,c.team+Math.max(1,Math.round(c.team*.035)));
 const industryResult=industryYear(c,year??1990),creditResult=creditAnnual(c),closedCredit=c.capital?.extension?.closedCredit;if(closedCredit){for(const k of ['income','interest','loss'])creditResult[k]+=closedCredit[k];delete c.capital.extension.closedCredit;}
 const riskSettlement=settleVentureRisk(c,year??((c.financialHistory?.at(-1)?.year??1989)+1),shocks,support);
 const k=costs(c,c.revenue,support,supplyShock,teamOpening);if(creditResult.income||creditResult.interest||creditResult.loss){k.creditIncome=creditResult.income;k.creditInterest=creditResult.interest;k.creditWriteoff=creditResult.loss;}k.overhead+=industryResult.expense;k.total+=creditResult.interest+creditResult.loss+industryResult.expense;if(preparationFee){k.overhead+=preparationFee;k.total+=preparationFee;}if(riskSettlement?.expense){k.overhead+=riskSettlement.expense;k.total+=riskSettlement.expense;}const integrationCost=integration?.cost||0;k.total+=integrationCost+paidFee+interestExpense+workoutFee+divestFee+rebuildExpense;c.costs=k.total;c.profit=c.revenue+creditResult.income-c.costs;c.capex=c.revenue*p.capex*st.capex+rebuildCapex+industryResult.capex;c.workingCapital=Math.max(0,c.revenue-oldRevenue-acquiredRevenue+divestRevenue)*p.wc+(riskSettlement?.workingCapital||0)+industryResult.workingCapital;c.cashFlow=c.profit-c.capex-c.workingCapital+noncashFee+creditResult.loss;c.cash=opening+c.cashFlow+preparationFee+paidFee+workoutFee-noncashFee+divestFee+rebuildExpense+rebuildCapex;c.profitYears=c.profit>0?c.profitYears+1:0;const principalPaid=payPrincipal(c);runway(c);
 if(c.capital){c.capital.pendingExpense=0;if(c.capital.extension)c.capital.extension.pendingBuyback=0;}c.pendingDividend=0;c.pendingAllocationPrincipal=0;c.pendingRebuildExpense=0;c.pendingRebuildCapex=0;c.pendingDivestPrice=0;c.pendingDivestFee=0;c.pendingDivestPrincipal=0;c.pendingDivestRevenue=0;c.value=fundamental(c,e)*(c.integration?.9:1);if(divestPrice)event+=`；业务/资产出售 ${divestPrice.toFixed(1)} 万，费用 ${divestFee.toFixed(1)} 万，提前还本 ${divestPrincipal.toFixed(1)} 万`;if(integration)event+='；'+integration.event;if(industryResult.text)event+='；'+industryResult.text;if(riskSettlement?.event)event+='；'+riskSettlement.event.text;if(riskSettlement?.recovery>.01)event+=`；延期款回收 ${riskSettlement.recovery.toFixed(1)} 万`;c.pendingAcquisitionPrice=0;c.pendingAcquisitionFee=0;c.acquisitionBaseRevenue=0;c.pendingLoanDrawdown=0;c.pendingEquityRaise=0;c.pendingRescueEquity=0;c.pendingWorkoutFee=0;c.pendingNoncashFee=0;c.pendingRescuePrincipal=0;c.pendingDebtConversion=0;
 return {...(industryResult.text?{industry:industryResult}:{}),...(publicBuyback?{publicBuyback}:{}),...(preparationFee?{preparationFee}:{}),...(riskSettlement?{riskExpense:riskSettlement.expense,riskFrozen:riskSettlement.frozen,riskRecovered:riskSettlement.recovery,riskReceivables:riskSettlement.receivables,riskSeverity:riskSettlement.severity,...(riskSettlement.event?{riskEvent:riskSettlement.event}:{})}:{}),...(modern(c)?{staffOpening:teamOpening,staffClosing:c.team,expansionStreak:c.expansionStreak}:{}),dividend,allocationPrincipal,rebuildExpense,rebuildCapex,divestPrice,divestFee,divestPrincipal,divestRevenue,rescueEquity,workoutFee,noncashFee,debtConversion,interestExpense,principalDue:principalDue+rescuePrincipal,principalPaid:principalPaid+rescuePrincipal+divestPrincipal+allocationPrincipal,debtBalance:debtBalance(c),loanDrawdown,acquisitionEquity,revenue:c.revenue,...k,costs:c.costs,profit:c.profit,capex:c.capex,workingCapital:c.workingCapital,cashFlow:c.cashFlow,cashOpening:opening+publicBuyback+preparationFee+paidPrice+paidFee-loanDrawdown-acquisitionEquity-rescueEquity+workoutFee-noncashFee+rescuePrincipal-divestPrice+divestFee+divestPrincipal+rebuildExpense+rebuildCapex+dividend+allocationPrincipal,cash:c.cash,financing:0,acquisitionPaid:paidPrice,acquisitionFee:paidFee,integrationCost,integrationLost:integration?.loss||0,organicGrowth:c.organicGrowth,competition:c.competition,value:c.value,growth:c.growth,support,strategy:c.strategy,event,...(market?{market:JSON.parse(JSON.stringify(market))}:{})};
}
function advanceAnnual(s){
 if(s.ended)return false;for(const c of s.portfolio.filter(c=>c.status==='active'&&c.distress)){liquidate(s,c.id,'assets',null,true);}const opsLevel=level(s,'operations'),exitLevel=level(s,'exit'),supported=new Set(supportIds(s));
 for(const k of Object.keys(roles))if(level(s,k))s.team[k].years++;
 s.year++;const e=era(s.year),fee=Math.min(s.cash,10);expense(s,fee,'operations');log(s,`年度基金运营支出 ${fee.toFixed(1)} 万元。`);
 if(isContinuous(s))for(const c of s.portfolio.filter(c=>c.status==='active'))prepareCapital(s,c);
 const integrationResults=integrate(s,supported,opsLevel);progressRebuilds(s,supported,opsLevel);const marketResults=compete(s,e,supported,opsLevel);
 for(const c of s.portfolio.filter(c=>c.status==='active')){
  const publicState=c.capital?.public,pricingBasis=publicState?.year===s.year-1&&publicState.offerGrowth!==undefined?{...c,growth:publicState.offerGrowth,organicGrowth:publicState.offerGrowth}:c;
  const priorPremium=publicState?Math.max(0,c.value-Math.max(0,c.cash)+debtBalance(c))/Math.max(1,enterpriseValue(pricingBasis,era(s.year-1))):1;
  c.exitOffer=null;c.round=null;c.age++;const shocks={growth:rng(s),competition:rng(s),event:rng(s),funding:rng(s),exit:rng(s),ipo:rng(s)};
  const row=operate(c,e,supported.has(c.id)?opsLevel:0,shocks,marketResults[c.id],integrationResults[c.id],s.year);row.year=s.year;
  const margin=c.profit/Math.max(1,c.revenue),plan=fundingPlan(c,row),need=plan.gap>1e-7;
  if(c.capital&&s.year<endYear(s)&&(need||growthFunding(c,s.year)))capitalFunding(s,c,row,need,shocks.funding);
  else if(!c.capital&&need&&s.year<endYear(s)){
   const fundingOdds=clamp(.2+c.quality*.4+clamp(margin,-.5,.5)*.35+(c.organicGrowth??c.growth)*.002-c.competition*.14+(e.m-1)*.35-(row.riskSeverity||0)*.18,.04,.88);
   if(shocks.funding<fundingOdds){const pre=Math.max(1,c.value),raise=Math.min(pre*.8,plan.gap),oldEquity=c.equity;c.cash+=raise;c.value=pre+raise;c.equity*=pre/c.value;c.round={cost:oldEquity*raise,oldEquity,raise,purpose:plan.purpose,gap:plan.gap};row.financing=raise;row.fundingPlan=plan;log(s,`${c.name} 完成融资 ${raise.toFixed(1)} 万元，持股稀释至 ${(c.equity*100).toFixed(1)}%；本年可按比例认购。`,'warning');}
   else{row.event+='；这一轮没有募到钱';log(s,`${c.name} 这一轮没募到钱，接下来只能靠现有现金和经营回款。`,'warning');}
  }
  row.principalPaid+=payPrincipal(c);row.debtBalance=debtBalance(c);c.value=fundamental(c,e)*(c.integration?.9:1);
  if(row.interestExpense||row.principalDue)row.event+=`；利息 ${row.interestExpense.toFixed(1)} 万，还本 ${row.principalPaid.toFixed(1)} / ${row.principalDue.toFixed(1)} 万`;
  runway(c);Object.assign(row,{cash:c.cash,value:c.value,ownership:c.equity,invested:c.invested});row.story=operatingStory(c,row);row.event=row.story+'；'+row.event;c.financialHistory.push(row);
  c.notes.push(`${s.year} 年：收入 ${c.revenue.toFixed(1)}，成本 ${c.costs.toFixed(1)}，利润 ${c.profit.toFixed(1)}，净现金流 ${c.cashFlow.toFixed(1)} 万元；${row.event}${row.support?'；投后经理支持':''}`);
  if(c.cash<=0||debtDue(c)>1e-7){if(s.year<endYear(s)&&debtBalance(c)>1e-7){c.distress={year:s.year};c.round=null;c.value*=.5;row.value=c.value;row.exitChance=0;log(s,`${c.name} 有一笔债还不上。今年还能谈展期、转股或由基金救助；缺口留到明年，就只能清算。`,'warning');syncMarket(s,c);continue;}liquidate(s,c.id,'assets',null,true);continue;}
  if(c.capital){settleCapital(s,c,row,shocks.ipo,priorPremium);Object.assign(row,{cash:c.cash,value:c.value,ownership:c.equity});}
  syncMarket(s,c);const exitChance=exitOdds(c,e,exitLevel);row.exitChance=c.age>=4&&!c.integration&&!currentRebuild(c)?exitChance:0;
  if(!c.capital?.public&&c.capital?.application?.status!=='review'&&c.age>=4&&!c.integration&&!currentRebuild(c)&&shocks.exit<exitChance){const ipo=!c.capital&&c.profitYears>=2&&c.revenue>=180&&c.quality>.65&&c.market.share>=.025&&shocks.ipo>.45;const factor=ipo?1.25+exitLevel*.06:clamp(.95+margin*.3-c.competition*.08+exitLevel*.05,.65,1.25);const offer={year:s.year,factor,value:exitValue(c,factor),status:ipo?'上市退出':'并购退出'};if(c.exitPolicy==='review'){c.exitOffer=offer;log(s,`${c.name} 收到${offer.status}报价，基金可回收 ${offer.value.toFixed(1)} 万；本年可接受，也可继续持有。`,'success');}else realize(s,c,offer.value,offer.status);}
 }
 if(s.year>=endYear(s)){for(const c of s.portfolio.filter(c=>c.status==='active'))realize(s,c,exitValue(c,c.capital?.public?.985:terminalFactor(s,exitLevel)),'到期清算');s.deals=[];s.ended=true;log(s,`${isContinuous(s)?'2050 年终局结算：未上市经营业务按估值的 '+Math.round(terminalFactor(s,exitLevel)*100)+'% 处置；上市经营业务按参考市值的 98.5% 处置，现金按原额扣债后分配':('基金到期：'+(s.ruleset===12?'经营业务按估值的':'剩余股权按账面价值的')+' '+Math.round(terminalFactor(s,exitLevel)*100)+'% '+(s.ruleset===12?'处置，现金按原额扣除债务后分配':'变现'))}，薪酬停止续付。`,'success');}
 else{renewTeam(s);s.extraDeals=0;s.deals=newDeals(s);sourceDeals(s);log(s,`今年又送来 ${s.deals.length} 份项目材料。`);}
 record(s);return true;
}

// Forward-only additions: optional fields leave all historical v1-v10 records intact.
function fundingPlan(c,row=null){
 if(c.capital?.extension?.quarterly){const q=c.capital.extension.quarterly,overdue=debtDue(c),burn=Math.max(0,-q.recurringCashFlow),buffer=Math.max(20,burn*.75);return {cash:c.cash,overdue,buffer,gap:Math.max(0,overdue+buffer-c.cash),purpose:overdue>0?'偿还到期贷款和补足周转钱':burn>0?'补充实际经营所需周转资金':'保留日常经营储备'};}
 const recurringFlow=c.cashFlow+(modern(c)?row?.hiringCost||0:0)+(row?.rebuildExpense||0)+(row?.rebuildCapex||0)+(row?.acquisitionFee||0)+(row?.workoutFee||0)-(row?.noncashFee||0)+(row?.divestFee||0);
 const overdue=debtDue(c),burn=Math.max(0,-recurringFlow),buffer=burn>0?Math.max(20,burn*.75):20;
 const gap=Math.max(0,overdue+buffer-c.cash);
 return {cash:c.cash,overdue,buffer,gap,purpose:overdue>0?'偿还到期贷款和补足周转钱':burn>0?'支付未来九个月的经营开支':'补充日常周转资金'};
}
const products={
 '企业软件':['车间排产软件','经销商进销存系统','连锁门店财务系统'],
 '精密制造':['精密传动部件','工业视觉检测设备','小型自动化产线'],
 '消费品牌':['区域食品品牌','家庭清洁用品','户外日用品'],
 '通信设备':['园区通信设备','运营商传输模块','企业接入设备'],
 '互联网':['工业品交易平台','本地商户服务平台','垂直信息订阅服务'],
 '生物科技':['临床检测试剂','实验室诊断设备','生物工艺耗材'],
 '移动应用':['门店预约应用','移动协作工具','城市配送应用'],
 '清洁能源':['工商业储能控制器','电池检测设备','分布式能源管理系统'],
 '人工智能':['工业质检模型','文档处理工具','客服辅助系统']
};
const futureProducts={
 '企业软件':['多工厂协同排产系统','企业智能流程管理','跨区域供应链软件'],
 '精密制造':['柔性机器人工作站','高精度传感部件','自动化装配单元'],
 '消费品牌':['适老家庭用品','可循环日用消费品','个性化营养食品'],
 '通信设备':['工业边缘通信设备','低能耗传输模块','园区感知网络'],
 '互联网':['工业服务交易平台','再制造设备交易平台','专业服务协作平台'],
 '生物科技':['家庭检测设备','细胞工艺耗材','精准诊断试剂'],
 '移动应用':['居家照护协作应用','设备运维调度应用','社区服务应用'],
 '清洁能源':['园区微网调度系统','储能寿命管理设备','电池回收检测设备'],
 '人工智能':['机器人任务规划工具','工业设计辅助系统','企业智能体运维工具']
};
const founderBackgrounds={
 '企业软件':['曾负责工厂的信息化改造','做过多年的软件实施','带着原来的开发小组创业'],
 '精密制造':['从设备厂的研发部门出来创业','曾在生产线上负责工艺改进','和几位工程师一起办厂'],
 '消费品牌':['曾负责区域经销业务','从零售采购岗位出来创业','从自家小作坊起步'],
 '通信设备':['曾负责通信网络的现场交付','从设备研发部门出来创业','和原来的工程团队一起创业'],
 '互联网':['原来做行业信息服务','熟悉商家的采购和销售流程','从早期的行业网站起步'],
 '生物科技':['曾负责实验室检测研发','从诊断设备团队出来创业','与几位研究同事一起创业'],
 '移动应用':['曾做面向门店的软件服务','熟悉本地生活商家的运营','和几位移动开发者一起创业'],
 '清洁能源':['曾负责工厂的能源改造','从电力设备研发部门出来创业','做过多年储能项目交付'],
 '人工智能':['曾负责企业的数据产品','从工业软件团队出来创业','和几位算法工程师一起创业']
};
function companyIdentity(c){
 const p=historicalProject(c);if(p)return {product:p.product,founder:p.founder,story:p.story};
 const h=hash(c.id+':'+c.name),product=(Number(c.id.slice(0,4))>=2026?futureProducts:products)[c.sector][h%3],founder=['周','陈','林','许','沈','方','顾','陆','赵','秦','叶','宋'][Math.floor(h/3)%12]+['宁','远','悦','川','岚','衡','珂','舟','青','然','祎','卓'][Math.floor(h/37)%12],background=(founderBackgrounds[c.sector]||[])[Math.floor(h/149)%3];
 const customers={
  '企业软件':['本地工厂','经销商','连锁门店'],
  '精密制造':['设备厂','装配工厂','周边工厂'],
  '消费品牌':['社区门店','商超采购','户外用品经销商'],
  '通信设备':['园区企业','运营商的项目团队','网络集成商'],
  '互联网':['行业采购商','本地商户','行业客户'],
  '生物科技':['检测机构','实验室','生物实验室的采购人员'],
  '移动应用':['门店经营者','小型服务团队','本地配送商家'],
  '清洁能源':['设备集成商','电池厂','工商业园区'],
  '人工智能':['工厂的生产部门','企业里的文档处理部门','企业客服团队'],
 ...expansionCustomers}[c.sector][h%3];
 const story=[`${founder}${background}。团队做的是${product}，最早的客户来自${customers}。`,`${product}是这家公司的主业。${founder}${background}，最初的订单主要来自${customers}。`,`${founder}${background}，做的是${product}，主要接${customers}的订单。`][Math.floor(h/101)%3];
 const scenario=scenarioProject(c);return scenario?.fictional?{product:scenario.product,founder,story:`${founder}${background}，团队经营${scenario.product}。团队正在寻找新一轮资金。`}:{product,founder,story};
}
function companyCase(s,id){
 const c=s.portfolio.find(x=>x.id===id&&x.status==='active');if(!c||s.ended||c.distress||c.integration||currentRebuild(c)||s.year>=endYear(s)-1)return null;
 const last=c.boardCases?.at(-1),cycle=Math.floor((s.year-c.founded)/3),key=c.id+':case:'+cycle,offeredYear=Math.max(c.founded+cycle*3,c.founded+1,(last?.year??1987)+3);
 if(s.year<offeredYear||(c.boardCases||[]).some(x=>x.key===key))return null;
 const f=companyIdentity(c),growth=c.organicGrowth??c.growth,prev=c.financialHistory.at(-2),margin=c.profit/Math.max(1,c.revenue),cashRisk=c.cashFlow<0||c.cash<c.costs*.5;
 const needs={rnd:c.competition>.55||prev&&margin<prev.profit/Math.max(1,prev.revenue)-.04,capacity:growth>10,market:growth<10||prev?.market&&c.market?.share<prev.market.share*.95};
 const budget=isContinuous(s)?rebuildBudgets(s,c).find(n=>n>=clamp(c.revenue*.02,20,1000))||1000:20,quotes=Object.fromEntries(Object.keys(rebuildTypes).map(k=>[k,rebuildQuote(s,id,k,budget)]));
 const candidates=['rnd','capacity','market'].filter(k=>needs[k]&&quotes[k].gain>1e-7);
 const prior=last?.choice==='invest'?c.rebuilds.find(p=>p.year===(last.projectYear??last.year)):null;
 const preferred=growth>15&&effectiveCapacity(c)<1.1?'capacity':margin<.12?'rnd':growth<10?'market':'rnd';
 let kind=candidates.includes(preferred)?preferred:candidates[0]||last?.kind||'capacity';
 if(!cashRisk&&!candidates.length&&!prior)return null;
 let title,text,canInvest=!cashRisk&&candidates.includes(kind)&&quotes[kind].ok;
 const movement=growth>.05?'增长 '+growth.toFixed(1)+'%':growth<-.05?'减少 '+(-growth).toFixed(1)+'%':'与去年基本持平';
 const physical=['精密制造','消费品牌','通信设备','生物科技','清洁能源'].includes(c.sector);
 const capacityName=physical?'设备和产线':'交付团队和系统';
 if(cashRisk){title=c.cashFlow<0?'今年又动用了多少储备':'先把周转钱留下';text=c.cashFlow<0?`${f.founder}递来今年的账：经营消耗 ${(-c.cashFlow).toFixed(1)} 万现金，账上还剩 ${c.cash.toFixed(1)} 万。“新项目先缓一缓，眼前这摊生意还得继续做。”`:`公司账上还剩 ${c.cash.toFixed(1)} 万，半年经营开支约 ${Math.max(30,c.costs*.5).toFixed(1)} 万。${f.founder}想先留下这笔周转钱。`;}
 else if(!canInvest){title='先看看已有投入的回报';text=`${f.product}今年收入${movement}，净现金流 ${c.cashFlow.toFixed(1)} 万。现有投入暂时够用，${f.founder}这次没有报新的预算。`;}
 else if(kind==='rnd'){title=margin<.12?'订单有了，利润没跟上':'客户在比价，产品得再改改';text=`${f.product}今年每百元收入${margin>=0?'留下 '+(margin*100).toFixed(1)+' 元利润':'亏损 '+(-margin*100).toFixed(1)+' 元'}。${c.competition>.55?'客户正拿同行的报价来比价，':'订单还能接到，'}${f.founder}提议改一改产品和交付。新项目要花钱，也可以先按原计划经营。`;}
 else if(kind==='capacity'){title=physical?'订单多了，设备要不要跟上':'订单多了，交付要不要跟上';text=`${f.product}今年收入${movement}，交付能力相当于起步时的 ${(effectiveCapacity(c)*100).toFixed(1)}%。${f.founder}想补上${capacityName}：“能多接一点活，但以后的维护开支也得留出来。”`;}
 else{title='老客户之外，还要不要再跑一跑';text=`${f.product}今年收入${movement}，手里的客户占行业 ${(c.market.share*100).toFixed(1)}%。${f.founder}想让团队再去拓一批客户。渠道得花钱，新招来的人以后也要付工资。`;}
 if(prior){const outcome=prior.status==='已完成'?'已经做完':prior.status==='受挫终止'?'遇到困难后停了下来':prior.status;title=(prior.status==='已完成'?'上次项目做完了':'上次项目停了下来')+'，'+(canInvest?'这次还要不要投':cashRisk?'先留周转钱':'先看看经营');text=`你在 ${prior.year} 年批的${rebuildTypes[prior.type]}${outcome}，预算 ${prior.budget.toFixed(1)} 万，实际花费 ${prior.spent.toFixed(1)} 万。${text}`;}
 else if(last){const row=c.financialHistory.find(r=>r.year===last.year),baseline=last.baseline?.cash??row?.cash,delta=c.cash-baseline;title=`${last.year} 年的决定，${s.year-last.year} 年后再看`;text=`上次你决定${last.choice==='defend'?'先保现金':'先不追加投入'}。${Number.isFinite(baseline)?'这几年企业现金'+(Math.abs(delta)<.05?'基本没变':(delta>=0?'增加 ':'减少 ')+Math.abs(delta).toFixed(1)+' 万')+'。':''}${text}`;}
 const summary=canInvest?`${f.founder}报来一笔 ${budget} 万的${rebuildTypes[kind]}预算，等你决定要不要投。`:cashRisk?`${f.founder}想先留下周转钱，来信里列了今年的现金和开支。`:`${f.founder}带来了已有投入的账，这次先不加预算。`;
 const quote={...quotes[kind]};if(!canInvest){quote.ok=false;quote.reason=cashRisk?'这笔钱要留给经营和还债，这次先不加项目':!candidates.length?'现有设备和产品暂时够用，先看看今年的生意':quote.reason;}
 return {key,kind,title,text,summary,alternative:c.strategy==='defend'?'继续收紧开支':'先收紧开支',waitLabel:'先不投新项目，继续'+strategies[c.strategy].name,offeredYear,canInvest,quote};
}
function resolveCase(s,id,choice){
 const c=s.portfolio.find(x=>x.id===id),q=companyCase(s,id);if(!q||!['invest','wait','defend'].includes(choice))return false;
 if(choice==='invest'&&(!q.canInvest||!reinvest(s,id,q.kind,q.quote.budget)))return false;
 if(choice==='defend')setStrategy(s,id,'defend');
 (c.boardCases??=[]).push({key:q.key,year:s.year,kind:q.kind,choice,projectYear:choice==='invest'?s.year:null,baseline:{cash:c.cash,revenue:c.revenue,cashFlow:c.cashFlow,share:c.market.share}});
 c.notes.push(`${s.year} 年董事会：${q.title}；你选择${choice==='invest'?`投入 ${q.quote.budget} 万${rebuildTypes[q.kind]}`:choice==='defend'?'先收紧开支':'暂缓追加投入'}。`);record(s);return true;
}
function exitQuote(s,id){const c=s.portfolio.find(x=>x.id===id&&x.status==='active'),o=c?.exitOffer;return !s.ended&&o?.year===s.year&&!c.distress&&!c.integration&&!currentRebuild(c)&&c.workoutYear!==s.year&&c.rescueYear!==s.year&&c.divestYear!==s.year?{...o,value:exitValue(c,o.factor)}:null;}
function decideExit(s,id,accept){
 const c=s.portfolio.find(x=>x.id===id&&x.status==='active'),o=exitQuote(s,id);
 if(s.ended||!o||o.year!==s.year||c.distress||c.integration||currentRebuild(c)||typeof accept!=='boolean')return false;
 const cashBefore=s.cash;
 if(accept)realize(s,c,o.value,o.status);else{c.notes.push(`${s.year} 年你放弃 ${o.value.toFixed(1)} 万退出报价，选择继续持有，后续报价不保证更高。`);c.exitOffer=null;}
 (c.exitDecisions??=[]).push({year:s.year,accepted:accept,quote:o.value,dividends:c.dividendReceived,invested:c.invested,equity:c.equity,cashBefore,cashAfter:s.cash});record(s);return true;
}
function exitReview(c,year,proceeds=c.proceeds,status=c.status){
 const dividends=c.dividendReceived||0,years=Math.max(0,year-c.founded),rows=c.financialHistory.filter(r=>!r.opening&&r.year>c.founded),first=c.thesis?.revenue??c.capital?.entryRevenue??c.financialHistory[0]?.revenue??c.revenue;
 return {year,status,years,invested:c.invested,proceeds,dividends,total:proceeds+dividends,profit:proceeds+dividends-c.invested,multiple:(proceeds+dividends)/c.invested,revenueStart:first,revenueEnd:c.revenue,funding:rows.reduce((n,r)=>n+r.financing+(r.acquisitionEquity||0),0),thesis:c.thesis?.kind||null};
}

function rebuildProgress(p){return {'进行中':'还在推进','已完成':'已经做完','主动终止':'已经停项','受挫终止':'遇到困难停了下来','退出终止':'随退出停止'}[p.status]||p.status;}
// Presentation helpers read existing records; they do not consume RNG or write save fields.
function expansionRun(c,r=null){const rows=(c.financialHistory||[]).filter(x=>!x.opening&&(!r||x.year<r.year));let years=r?.strategy==='expand'?1:0;if(r&&r.strategy!=='expand')return 0;for(let i=rows.length-1;i>=0&&rows[i].strategy==='expand';i--)years++;return years;}
function followRecords(c,year=null){
 const recorded=(c.capital?.history||[]).filter(r=>r.kind==='follow'&&(year===null||r.year===year)).map(r=>({year:r.year}));
 const notes=(c.notes||[]).flatMap(n=>{const m=n.match(/^(\d{4}) 年按比例认购本轮份额 [\d.]+ 万元/);return m&&(year===null||Number(m[1])===year)&&!recorded.some(r=>r.year===Number(m[1]))?[{year:Number(m[1])}]:[];});return [...recorded,...notes];
}
function fundingRemainder(r){const gap=Math.max(0,(r.fundingPlan?.gap||0)-(r.financing||0));return gap>=.05?`离本轮原先测算的资金缺口，还差 ${gap.toFixed(1)} 万。`:'';}
function operatingStory(c,r,prev=c.financialHistory.at(-1)){
 const f=companyIdentity(c),margin=r.profit/Math.max(1,r.revenue),oldMargin=prev.profit/Math.max(1,prev.revenue),g=(r.revenue/Math.max(.001,prev.revenue)-1)*100;
 const last=prev.market?.share,share=r.market?.share;
 if(r.rebuildExpense||r.rebuildCapex){const p=c.rebuilds.find(p=>p.events?.some(e=>e.year===r.year)),amount=(r.rebuildExpense||0)+(r.rebuildCapex||0),extra=(p?.events||[]).filter(e=>e.year===r.year).reduce((n,e)=>n+e.extra,0);return `${f.founder}汇报${p?rebuildTypes[p.type]:'再投资'}：${amount<=extra+1e-7?'今年又追加 '+extra.toFixed(1)+' 万':'今年报表列入支出 '+amount.toFixed(1)+' 万'+(extra?'，其中追加 '+extra.toFixed(1)+' 万':'')}${p?'；计划至今花费 '+p.spent.toFixed(1)+' 万，'+rebuildProgress(p):''}`;}

 if(modern(c)&&r.strategy==='expand'){const years=expansionRun(c,r),move=Math.abs(g)<.05?'收入基本持平':g>0?'收入增长 '+g.toFixed(1)+'%':'收入回落 '+(-g).toFixed(1)+'%',staff=Number.isFinite(r.staffOpening)&&Number.isFinite(r.staffClosing)?(r.staffClosing===r.staffOpening?'团队仍为 '+r.staffClosing+' 人':'团队从 '+r.staffOpening+' 人'+(r.staffClosing>r.staffOpening?'增至':'减至')+' '+r.staffClosing+' 人'):'团队按扩张的安排经营',extra=(r.hiringCost||0)+(r.expansionOverhead||0);return [`${f.product}扩张的第 ${years} 年，${move}。${staff}，招聘与连续扩张的组织开支共 ${extra.toFixed(1)} 万，净现金流 ${r.cashFlow.toFixed(1)} 万`,`${f.founder}带来扩张后的账：${move}，${r.profit>=0?'利润':'亏损'} ${Math.abs(r.profit).toFixed(1)} 万。${r.cashFlow<0?'经营仍消耗 '+(-r.cashFlow).toFixed(1)+' 万现金':'经营留下 '+r.cashFlow.toFixed(1)+' 万现金'}；${staff}`,`${f.product}仍在扩张，${move}。今年招聘和连续扩张的组织开支 ${extra.toFixed(1)} 万，资本开支 ${r.capex.toFixed(1)} 万${r.workingCapital>0?'，新增周转占用 '+r.workingCapital.toFixed(1)+' 万':''}；年末净现金流 ${r.cashFlow.toFixed(1)} 万`][(hash(c.id)+r.year)%3];}
 if(r.strategy==='defend'&&r.cashFlow>prev.cashFlow){const cash=`净现金流从 ${prev.cashFlow.toFixed(1)} 万改善到 ${r.cashFlow.toFixed(1)} 万`;return [`${f.product}按保现金的安排经营，${cash}${g<-.05?'，同年收入回落 '+(-g).toFixed(1)+'%':''}`,`${f.founder}报来现金账：本年净现金流 ${r.cashFlow.toFixed(1)} 万，比去年多 ${(r.cashFlow-prev.cashFlow).toFixed(1)} 万；${Math.abs(g)<.05?'收入基本持平':g>0?'收入同时增长 '+g.toFixed(1)+'%':'收入同时减少 '+(-g).toFixed(1)+'%'}`,`${f.product}今年利润 ${r.profit.toFixed(1)} 万，资本开支 ${r.capex.toFixed(1)} 万。按保现金的安排，${cash}`][(hash(c.id)+r.year)%3];}
 if(r.strategy==='expand'&&g>0&&r.cashFlow<0)return `${f.founder}拿到了更多${f.product}订单，扩张投入却让企业消耗了 ${(-r.cashFlow).toFixed(1)} 万现金`;
 if(r.profit>0&&prev.profit<=0)return `${f.product}今年覆盖了经营成本，${f.founder}报来 ${r.profit.toFixed(1)} 万利润，${prev.profit<0?'去年还亏损 '+(-prev.profit).toFixed(1)+' 万':'去年刚好收支打平'}`;
 if(r.profit<=0&&prev.profit>0)return `${f.product}收入没能覆盖现有费用，今年由盈转亏，董事会需要重新评估投入节奏`;
 if(margin<oldMargin-.04)return `${f.product}每笔收入留下的钱变少了，利润率从 ${(oldMargin*100).toFixed(1)}% 降到 ${(margin*100).toFixed(1)}%`;
 if(share!==undefined&&last!==undefined&&share<last*.85)return `${f.product}的份额被同行挤压，${f.founder}得找一找客户流失的原因`;
 if(r.support&&margin>oldMargin+.015)return `投后经理参与了${f.product}的交付安排，本年利润率提高了 ${((margin-oldMargin)*100).toFixed(1)} 个百分点`;
 if(g>15&&r.profit>prev.profit)return [`${f.product}收入增长 ${g.toFixed(1)}%，利润从 ${prev.profit.toFixed(1)} 万增至 ${r.profit.toFixed(1)} 万`,`${f.product}${r.market?'今年有 '+r.market.customers+' 个折算客户，占行业 '+(r.market.share*100).toFixed(1)+'%':'今年收入 '+r.revenue.toFixed(1)+' 万'}。收入增长 ${g.toFixed(1)}%，净现金流 ${r.cashFlow.toFixed(1)} 万`,`${f.founder}报来 ${r.profit.toFixed(1)} 万利润，比去年多 ${(r.profit-prev.profit).toFixed(1)} 万；净现金流 ${r.cashFlow.toFixed(1)} 万${r.workingCapital>0?'，新增生意占用 '+r.workingCapital.toFixed(1)+' 万周转钱':''}`][(hash(c.id)+r.year)%3];
 if(g< -5)return `${f.product}的收入比去年少了 ${(-g).toFixed(1)}%，${r.cashFlow>=0?'现有现金流仍能支撑经营':'正在动用账上的储备'}`;
 if(r.workingCapital>r.profit*.5&&r.profit>0)return `${f.product}账面仍在赚钱，不过新增周转资金占用 ${r.workingCapital.toFixed(1)} 万，钱暂时压在周转里`;
 return `${f.founder}今年继续经营${f.product}，${r.cashFlow>0?'留下了 '+r.cashFlow.toFixed(1)+' 万现金':r.cashFlow<0?'消耗了 '+(-r.cashFlow).toFixed(1)+' 万现金':'经营现金收支平衡'}，${Math.abs(g)<.05?'收入与去年基本持平':g>0?'收入增长 '+g.toFixed(1)+'%':'收入回落 '+(-g).toFixed(1)+'%'}`;
}
function capitalMilestones(s){
 const items=[];for(const c of s.portfolio.filter(c=>c.status==='active'&&c.capital)){
  const f=c.capital,p=f.public,a=f.application;
  if(expanded(s)){const e=[...f.extension.events].reverse().find(e=>e.month>=capitalClock(s)-12&&['penalty','delisting','crash','suspension','covenant'].includes(e.kind));if(e)items.push({id:c.id,kind:'capitalRisk',priority:11.5,action:'capital',title:c.name+' · '+(f.extension.projectFailed?'上市后项目失败':'资本与监管事项'),text:e.text+'。剩余股份与已收回款分别记账，请评估后续安排。'});}
  if(p?.year===s.year){const h=f.history.filter(r=>r.kind==='ipo').at(-1),unlock=Math.max(s.year,...p.locks.map(r=>r.unlockYear));items.push({id:c.id,kind:'listing',priority:10.3,action:'capital',title:c.name+' · 完成上市发行',text:`公司净募资 ${money(h?h.raise-h.fee:0)} 万，基金现持股 ${ownership(c.equity)}。${unlock>s.year?'本次锁定股份按条款至 '+unlock+' 年解锁':'本次普通新股可按市场承接额度减持'}；募资留在公司，基金本次未收到退出款。`});}
  else if(a?.status==='withdrawn'&&a.resultYear===s.year)items.push({id:c.id,kind:'listing',priority:10.3,action:'capital',title:c.name+' · 发行准备暂缓',text:`${a.reason||'材料需要更新'}。已付准备费 ${money(a.fee)} 万不退，企业继续经营，整改后再议。`});
  else if(p?.locks.some(r=>r.equity>0&&(r.unlockMonth!==undefined?r.unlockMonth===capitalClock(s):r.unlockYear===s.year)))items.push({id:c.id,kind:'unlock',priority:9.5,action:'capital',title:c.name+' · 一批股份解除锁定',text:'约定锁定期已经届满，可结合经营和本年市场承接额度选择持有或减持；不会自动卖出。'});
 }return items;
}
function fundTasks(s){
 if(s.ended)return [];const rows=[];for(const c of s.portfolio.filter(c=>c.status==='active')){
  if(c.distress)rows.push({id:c.id,priority:100,action:'workout',kind:'debt',title:c.name+(quarterly(s)?' · 经营失败待处置':' · 偿债处置'),text:quarterly(s)?'可追加投资尝试低成功率抢救，也可出售资产；下一月经营前未处置将清算。':'缺口留到下一年将进入清算，请先核查现金与到期本金。'});
  if(c.round){const q=followQuote(s,c.id);rows.push({id:c.id,priority:80,action:'follow',kind:'follow',title:c.name+' · 本轮认购待决定',text:`约定认购款 ${money(c.round.cost)} 万，认购后持股 ${ownership(q.after??c.equity)}；不认购则保留已稀释股份。`});}
  const e=exitQuote(s,c.id);if(e)rows.push({id:c.id,priority:85,action:'offer',kind:'offer',title:c.name+' · 买方等本年答复',text:`当前报价可到账 ${money(e.value)} 万，跨年后失效。`});
  if(!c.distress&&!c.round){const q=dividendQuote(s,c.id,.5,0);if(q.ok&&q.fundProceeds>0)rows.push({id:c.id,priority:30,action:'dividend',kind:'dividend',title:c.name+' · 可以评估分红',text:`按可分配资金的一半试算，基金可收到 ${money(q.fundProceeds)} 万；比例与偿债安排仍由你决定。`});}
 }return rows.sort((a,b)=>b.priority-a.priority||a.id.localeCompare(b.id));
}
function annualReview(s){
 if(s.year===1990)return [];const items=capitalMilestones(s);
 for(const c of s.portfolio){if(s.continuation&&s.year===2026&&c.founded<2026)continue;const r=c.financialHistory.at(-1),prev=c.financialHistory.at(-2),identity=companyIdentity(c);
  if(c.status!=='active'){const x=c.exitReview;if(x?.year===s.year||c.liquidation?.year===s.year){const opening=c.status==='股权转让'?`持有 ${c.age} 年后，你提前转让了股权。`:c.status==='到期清算'?(isContinuous(s)?'2050 年终局结算，剩余股权按最终方案处置。':'基金期限到了，剩余股权按到期方案处置。'):c.status==='失败清算'?'这笔投资进入清算。':'这份退出报价已经成交。';items.push({id:c.id,priority:9,action:'record',kind:'exit',title:`${c.name} · ${c.status}`,text:`${opening}累计投入 ${c.invested.toFixed(1)} 万，退出收回 ${c.proceeds.toFixed(1)} 万，另有历年分红 ${(c.dividendReceived||0).toFixed(1)} 万。${c.proceeds+(c.dividendReceived||0)>=c.invested?'这笔投资已结清。':'本金没能全部收回，账目已经归档。'}`});}continue;}
  if(r?.riskEvent)items.push({id:c.id,priority:10.5,action:'record',kind:'risk',title:c.name+' · '+r.riskEvent.title,text:r.riskEvent.text+' 企业现金 '+c.cash.toFixed(1)+' 万，后续请结合资金缺口、经营策略及退出报价决定。'});
  if(exitQuote(s,c.id))items.push({id:c.id,priority:10,action:'offer',kind:'offer',title:`${c.name} · 有一笔退出报价`,text:`对方愿意让基金收回 ${exitQuote(s,c.id).value.toFixed(1)} 万。买方等着今年答复，明年得重新谈。`});
  if(c.distress)items.push({id:c.id,priority:11,action:'workout',kind:'distress',title:`${c.name} · 偿债需要你决定`,text:quarterly(s)?'这笔债还没安排好，下一月经营前仍有缺口将清算。':`这笔债还没安排好。若今年不补上缺口，明年就得清算。`});
  const firstDividend=c.dividends?.find(a=>a.fundProceeds>0);if(firstDividend?.year===s.year)items.push({id:c.id,priority:8,action:'record',kind:'milestone',title:`${c.name} · 第一笔分红到账`,text:`基金按当时持股收到 ${firstDividend.fundProceeds.toFixed(1)} 万。这笔钱已从公司账上转到基金，持股没有变。`});
  if(c.round)items.push({id:c.id,priority:8,action:'record',kind:'milestone',title:`${c.name} · ${c.capital?(c.round.bridge===false?'成长融资待认购':c.capital.public?'增发融资待认购':'周转融资待认购'):(c.round.purpose?'为周转缺口融资':'已有融资待跟投')}`,text:`${r.fundingPlan?'融资前企业现金 '+r.fundingPlan.cash.toFixed(1)+' 万，':''}${Number.isFinite(c.round.raise)?'本轮筹入 '+c.round.raise.toFixed(1)+' 万，用于'+(c.round.purpose||'原有融资安排'):'原有融资已经完成，旧档没有单列本轮总额'}。${fundingRemainder(r)}你可在今年按本轮认购权跟投 ${money(c.round.cost)} 万${c.capital?'，此前减持股份不会恢复':'，保留原持股'}。`});
  else if(r?.year===s.year&&r.financing>0&&followRecords(c,s.year).length)items.push({id:c.id,priority:8.5,action:'record',kind:'milestone',followed:true,title:`${c.name} · 你跟了这一轮`,text:`这轮已按原比例跟投。当前持股 ${(c.equity*100).toFixed(1)}%，累计投入 ${c.invested.toFixed(1)} 万。企业本轮筹入 ${r.financing.toFixed(1)} 万。${fundingRemainder(r)}`});
  const caseInfo=companyCase(s,c.id);if(caseInfo?.offeredYear===s.year)items.push({id:c.id,priority:7.2,action:'board',kind:'board',title:`${c.name} · ${caseInfo.title}`,text:caseInfo.summary});
  const firstDouble=c.financialHistory.find(x=>!x.opening&&Number.isFinite(x.ownership)&&x.value*x.ownership>=(x.invested??c.invested)*2);if(firstDouble?.year===s.year)items.push({id:c.id,priority:8,action:'record',kind:'milestone',title:`${c.name} · 股权账面达到两倍投入`,text:`按本年结算时的估值与持股，股权价值曾达到当时投入的 ${(firstDouble.value*firstDouble.ownership/(firstDouble.invested??c.invested)).toFixed(2)} 倍。这是股权估值，还没有退出变现。`});
  if(r?.year===s.year&&prev&&!r.opening){const growth=(r.revenue/Math.max(.001,prev.revenue)-1)*100;const decision=r.strategy!==prev.strategy?(r.strategy==='defend'?'这是你转向保现金后的第一年。':r.strategy==='expand'?'这是你转向扩张后的第一年。':'今年回到均衡经营。'):'';const project=(c.rebuilds||[]).find(p=>p.events?.some(e=>e.year===s.year));
   items.push({id:c.id,priority:r.cashFlow<0?7:Math.abs(growth)>10?6:2,action:'record',kind:'operating',title:`${c.name} · ${Math.abs(growth)<.05?'收入基本持平':(growth>=0?'收入增长 ':'收入回落 ')+Math.abs(growth).toFixed(1)+'%'}`,text:`${operatingStory(c,r,prev)}。${decision}${project&&!r.rebuildExpense&&!r.rebuildCapex?'你批准的'+rebuildTypes[project.type]+rebuildProgress(project)+'。':''}${r.market?.contraction?'今年行业需求也在收缩。':r.market?.lost>r.market?.won&&r.market?.to?.length?'今年走掉的客户，比新争取来的还多。':r.market?.won>(prev.market?.customers||Infinity)*.2&&r.market?.from?.length?'从 '+[...r.market.from].sort((a,b)=>b.count-a.count)[0].name+' 争到了 '+[...r.market.from].sort((a,b)=>b.count-a.count)[0].count+' 个客户。':''}`});}
 }
 const chosen=[],seen=new Set();let boards=0;for(const item of items.sort((a,b)=>b.priority-a.priority)){if(seen.has(item.id)||item.kind==='board'&&boards)continue;const operating=items.find(x=>x.id===item.id&&x.kind==='operating'),followed=items.find(x=>x.id===item.id&&x.followed);chosen.push({...item,text:[operating&&item!==operating?operating.text:'',followed&&item!==followed?followed.text:'',item.text].filter(Boolean).join(' ')});seen.add(item.id);if(item.kind==='board')boards++;if(chosen.length===4)break;}return chosen;
}
function validExperience(c,year){
 if(c.exitSettlement!==undefined){const a=c.exitSettlement;if(!a||a.version!==1||c.status==='active'||!Number.isInteger(a.year)||a.year>year||!['amount','prior','total'].every(k=>Number.isFinite(a[k])&&a[k]>=0)||Math.abs(a.total-a.amount-a.prior)>.001||Math.abs(a.total-c.proceeds)>.001)return false;}

 if(c.exitPolicy!==undefined&&!['review','automatic'].includes(c.exitPolicy))return false;
 if(c.thesis!==undefined&&(!c.thesis||!['cash','growth','product'].includes(c.thesis.kind)||!Number.isInteger(c.thesis.year)||c.thesis.year>year||!['revenue','profit','equity'].every(k=>Number.isFinite(c.thesis[k]))||c.thesis.equity<0||c.thesis.equity>1))return false;
 if(c.exitOffer!==undefined&&c.exitOffer!==null){const o=c.exitOffer;if(c.status!=='active'||o.year!==year||!Number.isFinite(o.value)||o.value<0||!Number.isFinite(o.factor)||o.factor<.65||o.factor>1.5||!['上市退出','并购退出'].includes(o.status))return false;}
 if(c.exitReview!==undefined&&(!c.exitReview||!['year','years','invested','proceeds','dividends','total','profit','multiple','revenueStart','revenueEnd','funding'].every(k=>Number.isFinite(c.exitReview[k]))||c.exitReview.year>year||c.exitReview.invested!==c.invested||c.exitReview.proceeds!==c.proceeds||c.exitReview.dividends!==(c.dividendReceived||0)||Math.abs(c.exitReview.profit-(c.proceeds+(c.dividendReceived||0)-c.invested))>1e-6||Math.abs(c.exitReview.multiple-(c.proceeds+(c.dividendReceived||0))/c.invested)>1e-6||Math.abs(c.exitReview.total-c.proceeds-(c.dividendReceived||0))>1e-6))return false;
 if(c.round&&c.round.purpose!==undefined&&(typeof c.round.purpose!=='string'||c.round.purpose.length>100||!Number.isFinite(c.round.gap)||c.round.gap<0||!Number.isFinite(c.round.raise)||c.round.raise<0))return false;
 if(c.financialHistory?.some(r=>['deliveryPremium','hiringCost','coordinationCost','expansionOverhead','scaleOverhead'].some(k=>r[k]!==undefined&&(!Number.isFinite(r[k])||r[k]<0))))return false;
 if(c.financialHistory?.some(r=>r.invested!==undefined&&(!Number.isFinite(r.invested)||r.invested<=0)||r.story!==undefined&&(typeof r.story!=='string'||r.story.length>700)||r.ownership!==undefined&&(!Number.isFinite(r.ownership)||r.ownership<0||r.ownership>1)||r.fundingPlan&&(!['cash','overdue','buffer','gap'].every(k=>Number.isFinite(r.fundingPlan[k]))||r.fundingPlan.overdue<0||r.fundingPlan.buffer<0||r.fundingPlan.gap<0||typeof r.fundingPlan.purpose!=='string'||r.fundingPlan.purpose.length>100)))return false;
 if(c.exitDecisions!==undefined&&(!Array.isArray(c.exitDecisions)||c.exitDecisions.length>(c.capital?60:36)||new Set(c.exitDecisions.map(d=>d?.year)).size!==c.exitDecisions.length||!c.exitDecisions.every(d=>d&&Number.isInteger(d.year)&&d.year<=year&&d.year>=c.founded&&typeof d.accepted==='boolean'&&['quote','dividends','invested','equity','cashBefore','cashAfter'].every(k=>Number.isFinite(d[k])&&d[k]>=0)&&d.equity<=1&&Math.abs(d.cashAfter-d.cashBefore-(d.accepted?d.quote:0))<1e-6)))return false;
 if(c.boardCases?.some(b=>b.baseline&&(!['cash','revenue','cashFlow','share'].every(k=>Number.isFinite(b.baseline[k]))||b.baseline.share<0||b.baseline.share>1)))return false;
 if(c.boardCases!==undefined&&(!Array.isArray(c.boardCases)||c.boardCases.length>(c.capital?21:13)||new Set(c.boardCases.map(x=>x?.key)).size!==c.boardCases.length||!c.boardCases.every(x=>x&&typeof x.key==='string'&&x.key.length<100&&Number.isInteger(x.year)&&x.year<=year&&Object.hasOwn(rebuildTypes,x.kind)&&['invest','wait','defend'].includes(x.choice))))return false;
 return true;
}

function validContinuation(s){
 const a=s.continuation;if(a===undefined)return true;
 if(a&&a.endingSeed!==undefined&&(!Number.isInteger(a.endingSeed)||a.endingSeed<0||a.endingSeed>4294967295))return false;
 if(s.version!==10||!a||a.version!==1||a.startYear!==2026||a.endYear!==2050||s.year<2026||a.initial!==1000||!['cash','invested','returned','expenses','dividends'].every(k=>Number.isFinite(a[k])&&a[k]>=0)||a.returned<a.dividends||Math.abs(a.cash-(a.initial-a.invested-a.expenses+a.returned))>.01||!Number.isInteger(a.projects)||a.projects<0||a.projects>limits.portfolio||a.projects>s.portfolio.length)return false;
 if(['invested','returned','expenses','dividends'].some(k=>s[k]+1e-6<a[k]))return false;
 const first=s.portfolio.slice(0,a.projects);if(first.some(c=>c.status==='active'||c.founded>2025)||s.portfolio.slice(a.projects).some(c=>c.founded<2026))return false;
 const near=(x,y)=>Math.abs(x-y)<.01;
 return near(first.reduce((n,c)=>n+c.invested,0),a.invested)&&near(first.reduce((n,c)=>n+c.proceeds+(c.dividendReceived||0),0),a.returned)&&near(first.reduce((n,c)=>n+(c.dividendReceived||0),0),a.dividends);
}
function continueCampaign(s){
 if(!valid(s)||s.version!==10||!s.ended||s.year!==2026||s.continuation)return false;
 s.continuation={version:1,startYear:2026,endYear:2050,endingSeed:s.seed,initial:s.initial,cash:s.cash,invested:s.invested,returned:s.returned,expenses:s.expenses,dividends:s.dividends,projects:s.portfolio.length};
 s.ended=false;renewTeam(s);s.extraDeals=0;s.deals=newDeals(s);sourceDeals(s);
 log(s,'2026 年结案成绩已封存。以结算资金继续经营，新的投资期到 2050 年结束。','success');record(s);return true;
}
function valid(s){
 if(s?.campaign?.quarterly!==undefined&&(s.campaign.quarterly!==1||!expanded(s)))return false;
 if(s?.campaign?.expansion!==undefined&&(s.campaign.expansion!==1||!Number.isInteger(s.campaign.month)||s.campaign.month<0||s.campaign.month>11))return false;
 if(!s||s.campaign!==undefined&&(!s.campaign||s.campaign.version!==1||s.campaign.startYear!==1990||s.campaign.endYear!==2050||s.campaign.importedYear!==undefined&&(!Number.isInteger(s.campaign.importedYear)||s.campaign.importedYear<1990||s.campaign.importedYear>2050))||s.ruleset!==undefined&&(s.ruleset!==12||s.version!==10)||![1,2,3,4,5,6,7,8,9,10].includes(s.version)||!Number.isInteger(s.year)||s.year<1990||s.year>endYear(s)||s.initial!==1000||typeof s.ended!=='boolean'||(s.year===endYear(s))!==s.ended||!Number.isInteger(s.seed)||s.seed<0||s.seed>4294967295)return false;
 if(s.campaign&&(s.campaign.backupKey!==undefined&&(typeof s.campaign.backupKey!=='string'||!/^longview-vc-save-v1-before-continuous-[0-9a-f]{1,8}-\d+$/.test(s.campaign.backupKey))||s.campaign.legacySettlement!==undefined&&typeof s.campaign.legacySettlement!=='boolean'))return false;
 if(s.campaign?.quarterBackupKey!==undefined&&(typeof s.campaign.quarterBackupKey!=='string'||!/^longview-vc-save-v1-before-quarterly-[0-9a-f]{1,8}-\d+$/.test(s.campaign.quarterBackupKey)))return false;
 if(s.campaign?.expansionBackupKey!==undefined&&(typeof s.campaign.expansionBackupKey!=='string'||!/^longview-vc-save-v1-before-continuous-[0-9a-f]{1,8}-\d+$/.test(s.campaign.expansionBackupKey)))return false;
 if(!validContinuation(s))return false;
 if(!['cash','invested','returned','expenses'].every(k=>Number.isFinite(s[k])&&s[k]>=0)||Math.abs(s.cash-(s.initial-s.invested-s.expenses+s.returned))>.01)return false;
 if(!Array.isArray(s.portfolio)||s.portfolio.length>limits.portfolio+(s.continuation||isContinuous(s)?168:0)||!Array.isArray(s.deals)||s.deals.length>limits.deals||!Array.isArray(s.logs)||s.logs.length>10000||!Array.isArray(s.history)||s.history.length>(s.continuation||isContinuous(s)?61:37))return false;
 if(!s.logs.every(l=>l&&Number.isInteger(l.year)&&typeof l.text==='string')||!s.history.every(h=>h&&['year','nav','cash'].every(k=>Number.isFinite(h[k]))))return false;
 const all=[...s.deals,...s.portfolio];if(quarterly(s)&&all.some(c=>!c?.capital?.extension?.quarterly))return false;
 if(expanded(s)&&all.some(c=>!c?.capital?.extension||c.status==='active'&&c.capital.public?.locks.filter(l=>lockActive(s,l)).reduce((n,l)=>n+l.equity,0)>c.equity+1e-7))return false;
 if(all.some(c=>!c||(s.ruleset===12?c.economyVersion!==12||!Number.isInteger(c.expansionStreak)||c.expansionStreak<0||c.expansionStreak>7:c.economyVersion!==undefined)))return false;if(new Set(all.map(c=>c?.id)).size!==all.length)return false;
 for(const c of all){
  if(!c||!['id','name','sector','icon','desc','edge','risk','status'].every(k=>typeof c[k]==='string'&&c[k].length<250)||!Object.hasOwn(profiles,c.sector)||!['available','active','股权转让','上市退出','并购退出','失败清算','到期清算'].includes(c.status))return false;
  if(!['value','quality','volatility','revenue','growth','runway','team','age','invested','equity','proceeds'].every(k=>Number.isFinite(c[k]))||c.value<0||c.revenue<0||c.equity<0||c.equity>1||c.quality<0||c.quality>1||!Array.isArray(c.notes)||!c.notes.every(n=>typeof n==='string'))return false;
  if(c.round&&(!['cost','oldEquity'].every(k=>Number.isFinite(c.round[k]))||c.round.cost<0||c.round.oldEquity<c.equity||c.round.oldEquity>1))return false;
  if(c.realProject!==undefined){const p=historicalProject(c);if(s.ruleset!==12||!p||c.name!==p.name||c.sector!==p.sector||s.year<p.year||c.status==='available'&&s.year!==p.year||c.founded!==undefined&&c.founded!==p.year)return false;}
  if(c.scenarioProject!==undefined){const p=scenarioProject(c);if(s.ruleset!==12||!p?.fictional||c.sector!==p.sector||s.year<p.year||c.status==='available'&&s.year!==p.year||c.founded!==undefined&&c.founded!==p.year)return false;}
  if(!validVentureRisk(c,s.year))return false;
  if(!validExperience(c,s.year)||!validCapital(c,s.year)||isContinuous(s)!==!!c.capital)return false;
  if(s.version>=2){if(!['costs','profit','cashFlow','cash','capex','workingCapital','costRate','competition'].every(k=>Number.isFinite(c[k]))||!Object.hasOwn(strategies,c.strategy)||c.competition<0||c.competition>1||!Number.isInteger(c.profitYears)||!Number.isInteger(c.ddLevel)||c.ddLevel< -1||c.ddLevel>3||!Array.isArray(c.financialHistory)||c.financialHistory.length>(isContinuous(s)?61:38))return false;
   if(!c.financialHistory.every(r=>r&&['year','revenue','costs','profit','cashFlow','cash','competition','value','variableCost','payrollCost','marketing','rnd','overhead','capex','workingCapital','financing','cashOpening'].every(k=>Number.isFinite(r[k]))&&typeof r.event==='string'))return false;
  }
 }
 if(s.deals.some(c=>c.status!=='available')||s.portfolio.some(c=>c.status==='available'||!Number.isInteger(c.founded)||c.invested<=0)||s.ended&&(s.deals.length||s.portfolio.some(c=>c.status==='active')))return false;
 if(s.version>=2){
  if(!s.team||!Object.keys(roles).every(k=>{const t=s.team[k];return t&&Number.isInteger(t.level)&&t.level>=0&&t.level<=3&&typeof t.active==='boolean'&&Number.isInteger(t.years)&&t.years>=0&&(t.paidYear===null||Number.isInteger(t.paidYear)&&t.paidYear<=s.year)&&(!t.active||t.level>0&&(t.paidYear===s.year||s.ended&&t.paidYear===endYear(s)-1));}))return false;
  if(!Number.isInteger(s.extraDeals)||s.extraDeals<0||s.extraDeals>3||!s.expenseBreakdown||!['legacy','research','operations','payroll','recruiting','training'].every(k=>Number.isFinite(s.expenseBreakdown[k])&&s.expenseBreakdown[k]>=0)||Math.abs(Object.values(s.expenseBreakdown).reduce((a,b)=>a+b,0)-s.expenses)>.01)return false;
 }
 if(s.version>=3){
  if((!Number.isInteger(s.marketSeed)||s.marketSeed<0||s.marketSeed>4294967295)||!s.markets||typeof s.markets!=='object'||Array.isArray(s.markets)||Object.keys(s.markets).length>(expanded(s)?15:9))return false;
  const ids=new Set();let count=0;
  for(const [sector,m] of Object.entries(s.markets)){
   if(!Object.hasOwn(profiles,sector)||m.sector!==sector||!Number.isInteger(m.year)||m.year>s.year||!Number.isFinite(m.growth)||!Number.isInteger(m.total)||m.total<1||m.total>1e10||!Number.isInteger(m.unserved)||m.unserved<0||!Number.isFinite(m.priceIndex)||m.priceIndex<=0||!Array.isArray(m.members)||m.members.length>limits.market+(s.continuation||isContinuous(s)?168:0))return false;
   let clients=m.unserved;
   for(const x of m.members){if(!x||(s.ruleset===12?x.economyVersion!==12||!Number.isInteger(x.expansionStreak)||x.expansionStreak<0||x.expansionStreak>7:x.economyVersion!==undefined))return false;count++;if(!x||typeof x.id!=='string'||ids.has(x.id)||typeof x.name!=='string'||x.name.length>250||x.sector!==sector||!Number.isInteger(x.customers)||x.customers<0||typeof x.failed!=='boolean'||(x.failed||x.acquiredBy)&&x.customers!==0||!Object.hasOwn(strategies,x.strategy)||!['unitPrice','basePrice','product',...memberKeys.filter(k=>k!=='strategy')].every(k=>Number.isFinite(x[k]))||x.unitPrice<=0||x.basePrice<=0||x.quality<0||x.quality>1)return false;if(!validVentureRisk(x,s.year))return false;ids.add(x.id);clients+=x.customers;}
   if(clients!==m.total)return false;
  }
  if(count>limits.market+(s.continuation||isContinuous(s)?168:0))return false;
  for(const c of [...s.deals,...s.portfolio.filter(c=>c.status==='active')]){const x=s.markets[c.sector]?.members.find(x=>x.id===c.id);if(!x||x.failed||x.acquiredBy||!validMarketReport(c.market,limits.market+(s.continuation||isContinuous(s)?168:0)))return false;}
  for(const c of all){if(c.market&&!validMarketReport(c.market,limits.market+(s.continuation||isContinuous(s)?168:0)))return false;for(const r of c.financialHistory)if(r.market&&!validMarketReport(r.market,limits.market+(s.continuation||isContinuous(s)?168:0)))return false;}
 }
 if(s.version>=4){
  for(const c of all){
   if(!Array.isArray(c.acquisitions)||c.acquisitions.length>18||!['pendingAcquisitionPrice','pendingAcquisitionFee','acquisitionBaseRevenue','mergerSynergy'].every(k=>Number.isFinite(c[k])&&c[k]>=0)||c.mergerSynergy>.06)return false;
   const targets=new Set();for(const a of c.acquisitions){if(!a||typeof a.targetId!=='string'||targets.has(a.targetId)||typeof a.targetName!=='string'||!['year','price','fee','customers','employees','risk','planned','worst','spent','lost','stage','cashBefore','cashAfter'].every(k=>Number.isFinite(a[k])&&a[k]>=0)||!Number.isInteger(a.stage)||a.stage>2||!['整合中','整合受挫','整合完成','整合终止'].includes(a.status)||!Array.isArray(a.events)||a.events.length!==a.stage||!a.events.every(e=>e&&['year','cost','loss','support','risk'].every(k=>Number.isFinite(e[k])&&e[k]>=0)&&typeof e.adverse==='boolean'))return false;targets.add(a.targetId);}
   if(c.integration&&(!Number.isInteger(c.integration.remaining)||c.integration.remaining<1||c.integration.remaining>2||!Number.isInteger(c.integration.cohort)||c.integration.cohort<0||!c.acquisitions.some(a=>a.targetId===c.integration.targetId&&a.status==='整合中'&&a.stage+c.integration.remaining===2)))return false;
   if(c.financialHistory.some(r=>['acquisitionPaid','acquisitionFee','integrationCost','integrationLost'].some(k=>r[k]!==undefined&&(!Number.isFinite(r[k])||r[k]<0))))return false;
  }
  for(const m of Object.values(s.markets))for(const x of m.members)if(x.acquiredBy&&(typeof x.acquiredBy!=='string'||x.acquiredBy===x.id||!m.members.some(y=>y.id===x.acquiredBy)||!Number.isInteger(x.acquiredYear)))return false;
 }
 if(s.version>=5){
  for(const c of all){if(!validLoans(c.loans,s.year,endYear(s))||!['pendingLoanDrawdown','pendingEquityRaise','interestExpense'].every(k=>Number.isFinite(c[k])&&c[k]>=0))return false;
   for(const r of c.financialHistory)if(['interestExpense','principalDue','principalPaid','debtBalance','loanDrawdown','acquisitionEquity'].some(k=>r[k]!==undefined&&(!Number.isFinite(r[k])||r[k]<0)))return false;
   for(const a of c.acquisitions)if(a.financingMode!==undefined&&(!['cash','debt','equity'].includes(a.financingMode)||!['loan','equityRaise','equityBefore','equityAfter','rate','term'].every(k=>Number.isFinite(a[k])&&a[k]>=0)||a.equityAfter>a.equityBefore||a.equityBefore>1))return false;
  }
  for(const m of Object.values(s.markets))for(const x of m.members)if(x.loans!==undefined&&!validLoans(x.loans,s.year,endYear(s)))return false;
 }
 if(s.version>=6)for(const c of all){
  if(!Array.isArray(c.workouts)||c.workouts.length>108||!['pendingRescueEquity','pendingWorkoutFee','pendingNoncashFee','pendingRescuePrincipal','pendingDebtConversion'].every(k=>Number.isFinite(c[k])&&c[k]>=0)||c.pendingNoncashFee>c.pendingWorkoutFee+1e-7)return false;
  if(!['workoutYear','rescueYear'].every(k=>c[k]===null||Number.isInteger(c[k])&&c[k]>=1990&&c[k]<=s.year))return false;
  if(c.distress&&(c.status!=='active'||s.ended||c.distress.year!==s.year||c.cash>0&&debtDue(c)<=1e-7))return false;
  for(const a of c.workouts)if(!a||!['extend','convert','rescue'].includes(a.mode)||!Number.isInteger(a.year)||a.year>s.year||!['fee','raise','converted','principal','debtBefore','debtAfter','equityBefore','equityAfter','fundBefore','fundAfter'].every(k=>Number.isFinite(a[k])&&a[k]>=0)||a.equityBefore>1||a.equityAfter>1||!Number.isFinite(a.cashBefore)||!Number.isFinite(a.cashAfter)||typeof a.resolved!=='boolean'||!Array.isArray(a.changes)||!a.changes.every(x=>x&&typeof x.id==='string'&&['fee','remaining','rate','maturity'].every(k=>Number.isFinite(x[k])&&x[k]>=0)))return false;
  for(const a of c.workouts)if(a.successRate!==undefined&&(!quarterly(s)||a.mode!=='rescue'||!Number.isInteger(a.month)||a.month<a.year*12||a.month>a.year*12+11||!Number.isFinite(a.successRate)||a.successRate<.08||a.successRate>.30||typeof a.success!=='boolean'||!Number.isFinite(a.restructuringCost)||Math.abs(a.restructuringCost-a.raise*(a.success?.08:.5))>1e-6||a.resolved!==a.success))return false;
  for(const r of c.financialHistory)if(['rescueEquity','workoutFee','noncashFee','debtConversion'].some(k=>r[k]!==undefined&&(!Number.isFinite(r[k])||r[k]<0)))return false;
 }
 if(s.version>=10){if(!Number.isFinite(s.dividends)||s.dividends<0||s.dividends>s.returned+1e-7||all.some(c=>!validDividends(c,s.year,endYear(s)))||Math.abs(s.dividends-s.portfolio.reduce((n,c)=>n+c.dividendReceived,0))>1e-6)return false;for(const c of all)for(const r of c.financialHistory)if(['dividend','allocationPrincipal'].some(k=>r[k]!==undefined&&(!Number.isFinite(r[k])||r[k]<0)))return false;}
 if(s.version>=9){if(all.some(c=>!validRebuild(c,s.year,endYear(s))))return false;for(const m of Object.values(s.markets))for(const x of m.members)if(['capacityRecovery','technologyBonus','marketReach','rebuiltCapital','rebuildOverhead'].some(k=>x[k]!==undefined&&(!Number.isFinite(x[k])||x[k]<0)))return false;for(const c of all)for(const r of c.financialHistory)if(['rebuildExpense','rebuildCapex'].some(k=>r[k]!==undefined&&(!Number.isFinite(r[k])||r[k]<0)))return false;}
 if(s.version>=8){if(all.some(c=>!validDivest(c,s.year,endYear(s))))return false;for(const m of Object.values(s.markets))for(const x of m.members)if(['assetRetention','overheadRetention'].some(k=>x[k]!==undefined&&(!Number.isFinite(x[k])||x[k]<0||x[k]>1)))return false;for(const c of all)for(const r of c.financialHistory)if(['divestPrice','divestFee','divestPrincipal','divestRevenue'].some(k=>r[k]!==undefined&&(!Number.isFinite(r[k])||r[k]<0)))return false;}
 if(s.version>=7&&all.some(c=>!validLiquidation(c,s.year)))return false;
 return true;
}
function validLoans(loans,year,deadline=2026){return Array.isArray(loans)&&loans.length<=18&&new Set(loans.map(l=>l?.id)).size===loans.length&&loans.every(l=>l&&typeof l.id==='string'&&typeof l.targetName==='string'&&['original','balance','paidPrincipal','rate','due'].every(k=>Number.isFinite(l[k])&&l[k]>=0)&&l.original>0&&l.rate<=.24&&['capitalizedFees','convertedPrincipal','writtenOff'].every(k=>l[k]===undefined||Number.isFinite(l[k])&&l[k]>=0)&&(l.extensions===undefined||l.extensions===1)&&Math.abs(l.original+(l.capitalizedFees||0)-l.balance-l.paidPrincipal-(l.convertedPrincipal||0)-(l.writtenOff||0))<1e-6&&l.due<=l.balance+1e-7&&Number.isInteger(l.term)&&l.term>=2&&l.term<=(l.extensions===1?7:5)&&Number.isInteger(l.remaining)&&l.remaining>=0&&l.remaining<=l.term&&Number.isInteger(l.originYear)&&l.originYear>=1990&&l.originYear<=Math.min(year,deadline-2)&&l.originYear+l.term<=deadline&&typeof l.defaulted==='boolean'&&(l.monthly===undefined||l.monthly&&Number.isInteger(l.monthly.start)&&l.monthly.start>=1990*12&&l.monthly.start<=year*12+11&&Number.isInteger(l.monthly.end)&&l.monthly.end>l.monthly.start&&l.monthly.end<=deadline*12&&Number.isFinite(l.monthly.installment)&&l.monthly.installment>0));}
function validMarketReport(f,capacity=limits.market){return !!f&&['year','customers','unitPrice','total','share','delta','won','lost','newDemand','contraction','pressure','exitSignal','rank'].every(k=>Number.isFinite(f[k]))&&f.customers>=0&&f.total>0&&f.share>=0&&f.share<=1&&(!f.rivals||Array.isArray(f.rivals)&&f.rivals.length<=3&&f.rivals.every(r=>typeof r.id==='string'&&typeof r.name==='string'&&Object.hasOwn(strategies,r.strategy)&&Number.isFinite(r.share)&&r.share>=0&&r.share<=1))&&['from','to'].every(k=>Array.isArray(f[k])&&f[k].length<=capacity&&f[k].every(x=>typeof x.id==='string'&&typeof x.name==='string'&&Number.isInteger(x.count)&&x.count>=0));}
function migrate(input){
 if(!valid(input))throw Error('这份档案的数据对不上');const s=JSON.parse(JSON.stringify(input));if(s.version===10)return s;
 const from=s.version;
 if(from===1){s.team=emptyTeam();s.extraDeals=0;s.expenseBreakdown={legacy:s.expenses,research:0,operations:0,payroll:0,recruiting:0,training:0};for(const c of [...s.deals,...s.portfolio])financials(c,s.year,true);}
 s.version=10;s.dividends=0;s.migratedFrom=from;if(from<3)initMarkets(s);for(const c of [...s.deals,...s.portfolio]){if(from<4)acquisitionFields(c);if(from<5)financeFields(c);if(from<6)workoutFields(c);if(from<7)c.liquidation=null;if(from<8)divestFields(c);if(from<9)rebuildFields(c);dividendFields(c);}
 if(!valid(s))throw Error('旧档案暂时接不上，原件已保留');return s;
}

// Capital expansion is opt-in. Historical engines and unconverted files retain their rules.
const exchangeRules=Object.freeze({
 main:{key:'main',name:'A股主板',from:1990,pe:22,swing:.15,liquidity:.032,offshore:false,technology:false},
 star:{key:'star',name:'科创板',from:2019,pe:35,swing:.35,liquidity:.022,offshore:false,technology:true},
 chinext:{key:'chinext',name:'创业板',from:2009,pe:30,swing:.30,liquidity:.024,offshore:false,technology:false},
 bse:{key:'bse',name:'北交所',from:2021,pe:18,swing:.20,liquidity:.009,offshore:false,technology:false},
 hk:{key:'hk',name:'港交所主板',from:1990,pe:28,swing:.45,liquidity:.020,offshore:true,technology:false},
 nasdaq:{key:'nasdaq',name:'纳斯达克',from:1990,pe:40,swing:.60,liquidity:.026,offshore:true,technology:false}
});
const structureNames={domestic:'境内直接持股',offshore:'境外直接持股',vie:'VIE 协议架构'};
function expanded(s){return s?.campaign?.expansion===1;}
function capitalClock(s){return s.year*12+(s.campaign?.month||0);}
function expansionFields(s,c){
 if(!c.capital||c.capital.extension)return;
 c.capital.extension={version:1,structure:c.capital.public&&exchangeRules[c.capital.public.venue]?.offshore?'offshore':'domestic',venue:c.capital.application?.venue||c.capital.public?.venue||null,lockUntil:0,regulatory:70,confidence:70,credit:null,events:[],actions:[],quotes:[],reports:[],achievement:null,delisted:false,founderStake:Math.min(.35,Math.max(0,1-c.equity)),founderProceeds:0};if(c.capital.public){const p=c.capital.public;p.shares=p.shares||1000000;p.issuePrice=p.issuePrice??c.value/p.shares;p.issueValue=p.issueValue??c.value;p.lastTradeMonth=p.lastTradeMonth??(p.lastTradeYear===s.year?capitalClock(s):null);}const a=c.capital.application;if(a?.status==='review'&&a.month===undefined){a.month=a.year*12;a.phase='申报受理';a.lockYears=a.lockYears||1;a.timeline=[{month:a.month,phase:'提交申报'}];c.capital.extension.lockUntil=a.month+6;}
}
function enableExpansion(s){
 if(!isContinuous(s)||expanded(s))return false;
 s.campaign.expansion=1;s.campaign.month=0;
 for(const c of [...s.deals,...s.portfolio])expansionFields(s,c);
 return true;
}
function createExpandedCampaign(seed){return fresh(seed,12,{continuous:true,expanded:true});}
function expansionEvent(s,c,kind,text,extra={}){const x=c.capital.extension;x.events.push({month:capitalClock(s),kind,text,...extra});if(x.events.length>240)x.events.shift();c.notes.push(`${s.year}年${(s.campaign.month||0)+1}月：${text}`);log(s,c.name+' · '+text,kind==='listing'?'success':'warning');}
function structureQuote(s,id,structure){
 const c=s.portfolio.find(c=>c.id===id&&c.status==='active'),x=c?.capital?.extension,fee=c?Math.max(5,Math.min(100,c.value*.002)):0;
 const reason=!expanded(s)||!x?'此档案尚未接入上市扩展':s.ended?'基金已结算':!Object.hasOwn(structureNames,structure)?'请选择有效架构':structure===x.structure?'当前已采用此架构':c.capital.public?'上市后不能直接更换控股架构':c.capital.application?.status==='review'?'请先撤回发行申请':capitalClock(s)<x.lockUntil?'板块与架构仍在六个月锁定期':c.distress||c.round||c.integration||currentRebuild(c)?'先处理偿债、融资或建设事项':c.cash<fee+Math.max(30,c.costs*.5)?'公司现金不足以支付重组费用并保留经营储备':'';
 return {ok:!reason,reason,fee,structure};
}
function setStructure(s,id,structure){const q=structureQuote(s,id,structure);if(!q.ok)return false;const c=s.portfolio.find(c=>c.id===id),x=c.capital.extension;c.cash-=q.fee;c.value=Math.max(0,c.value-q.fee);c.capital.pendingExpense+=q.fee;x.structure=structure;expansionEvent(s,c,'structure','完成'+structureNames[structure]+'调整，公司支付 '+money(q.fee)+' 万');runway(c);syncMarket(s,c);record(s);return true;}
function creditLeverage(c){const a=c.capital?.extension?.credit;return a?(a.capital>1e-6?a.assets/a.capital:a.assets>0?100:0):0;}
function issuancePricing(s,c,venue){
 const v=exchangeRules[venue],a=c.capital.extension.credit,lev=creditLeverage(c),share=a?.incomeShare||0;
 const leverageFactor=lev>=10?.45:lev>=3?clamp(1-(lev-2)*.055,.55,.95):1;
 const financeFactor=1-share*(venue==='bse'?.65:venue==='star'?.5:venue==='main'?.35:.15),mood=clamp(era(s.year).m,.55,1.35),pe=v.pe*mood*leverageFactor*financeFactor;
 const profit=c.financialHistory.filter(r=>!r.opening).slice(-2).reduce((n,r)=>n+Math.max(0,r.profit),0)/2;
 // Positive earnings use a simulated profit multiple. Loss makers use revenue, never negative PE.
 const basis=c.profit>0&&profit>0?'pe':'ps',multiple=basis==='pe'?pe:v.pe/8*mood*leverageFactor*financeFactor;
 const preValue=Math.max(1,(basis==='pe'?profit:c.revenue)*multiple);
 return {preValue,pe,basis,multiple,leverageFactor,financeFactor,mood};
}
function expandedListingQuote(s,id,venue='main'){
 const c=s.portfolio.find(c=>c.id===id&&c.status==='active');if(!c?.capital?.extension)return {ok:false,reason:'企业不在当前持仓中'};
 const f=c.capital,x=f.extension,v=exchangeRules[venue],rows=c.financialHistory.filter(r=>!r.opening),recent=rows.slice(-2),profitable=recent.length===2&&recent.every(r=>r.profit>0&&r.cashFlow>0),tech=f.technology&&c.quality>=.65&&c.revenue>=800&&c.cash>=Math.max(c.costs,Math.max(0,-c.cashFlow)*2),lev=creditLeverage(c);
 const fee=Math.max(2,Math.min(30,c.value*.001)),lockYears=c.equity>=.3?3:1;
 const reason=s.ended||s.year>2049-lockYears?'已接近2050年，剩余期限不足以完成发行和锁定':f.public?'企业已经上市':!v||v.from>s.year?'当前年份尚未开放此板块':v.technology&&!f.technology?'此板块需要科技属性':v.offshore&&x.structure!=='vie'?'境外申报须先调整为VIE架构':!v.offshore&&x.structure!=='domestic'?'境内板块需要境内直接持股架构':x.venue&&x.venue!==venue&&capitalClock(s)<x.lockUntil?'选板后六个月内不得更换板块':f.application?.status==='review'?'已有申请正在推进':f.application?.retryAfter>capitalClock(s)?'整改与材料更新期尚未结束':rows.length<3?'需要三年完整经营材料':!['c','preIPO'].includes(f.stage)&&!(c.revenue>=Math.max(500,c.financialHistory[0].revenue*3)&&rows.length>=4&&c.quality>=.65)?'先完成业务验证与规模经营':venue==='main'&&!profitable?'主板需要连续盈利与正经营现金流':venue==='star'&&!profitable&&!tech?'未盈利科技路径需要研发质量、收入和现金储备':venue==='chinext'&&!profitable&&!((tech||c.quality>=.75&&c.revenue>=1000&&c.cash>=Math.max(c.costs,-c.cashFlow*2))&&c.growth>=10)?'未盈利路径还需创新属性与增长验证':venue==='bse'&&(!profitable&&c.revenue<500||c.revenue<300)?'小型企业路径仍需收入或盈利验证':venue==='hk'&&!profitable&&!tech?'未盈利路径需要科技属性与充足经营储备':venue==='nasdaq'&&c.cash<Math.max(30,-c.cashFlow)?'未盈利企业需要至少一年的现金储备':c.distress||c.integration||currentRebuild(c)||c.round?'先处理债务、融资或未完成的整合建设':c.cash<fee+Math.max(30,c.costs*.5)?'公司须留够申请费用与经营储备':'';
 const pricing=v?issuancePricing(s,c,venue):{},hardReject=lev>=10&&['main','star'].includes(venue),disclosure=x.credit?.disclosed!==false;
 return {ok:!reason,reason,venue,venueName:v?.name||'',fee,lockYears,raise:Math.max(100,(pricing.preValue||0)*.2),route:profitable?'持续盈利路径':tech?'未盈利科技路径':'成长企业路径',...pricing,hardReject,warning:hardReject?'当前ABS杠杆达到10倍，提交将直接被否并损害监管记录与投资人信心':lev>=3?'高杠杆使本次发行估值折价；问询与整改风险增加':'',disclosure,requiresDisclosure:lev>=3,swing:v?.swing||0};
}
function expandedApplyListing(s,id,venue){
 const q=expandedListingQuote(s,id,venue);if(!q.ok)return false;const c=s.portfolio.find(c=>c.id===id),f=c.capital,x=f.extension;
 c.cash-=q.fee;f.pendingExpense+=q.fee;c.value=Math.max(0,c.value-q.fee);x.venue=venue;x.lockUntil=capitalClock(s)+6;
 f.application={year:s.year,month:capitalClock(s),venue,status:q.hardReject?'withdrawn':'review',phase:q.hardReject?'否决':'申报受理',fee:q.fee,lockYears:q.lockYears,timeline:[{month:capitalClock(s),phase:'提交申报'}],...(q.hardReject?{resultYear:s.year,retryAfter:capitalClock(s)+6,reason:'ABS杠杆达到10倍，终止IPO并退回Pre-IPO'}:{})};
 if(q.hardReject){f.stage='preIPO';x.regulatory=Math.max(0,x.regulatory-25);x.confidence=Math.max(0,x.confidence-30);expansionEvent(s,c,'rejection',f.application.reason);}else expansionEvent(s,c,'application','提交'+q.venueName+'申报，六个月内锁定板块；公司支付准备费 '+money(q.fee)+' 万');
 runway(c);syncMarket(s,c);record(s);return true;
}
function withdrawListing(s,id){const c=s.portfolio.find(c=>c.id===id&&c.status==='active'),a=c?.capital?.application;if(!expanded(s)||!a||a.status!=='review'||s.ended)return false;a.status='withdrawn';a.phase='主动撤回';a.resultYear=s.year;a.retryAfter=capitalClock(s)+3;a.reason='主动撤回，更新材料后再申请；原六个月选板锁定继续有效';c.capital.stage='preIPO';expansionEvent(s,c,'withdrawal',a.reason);record(s);return true;}
function failExpandedListing(s,c,reason,shrink=0){const a=c.capital.application,x=c.capital.extension;a.status='withdrawn';a.phase='发行暂缓';a.reason=reason;a.resultYear=s.year;a.retryAfter=capitalClock(s)+6;c.capital.stage='preIPO';x.confidence=Math.max(0,x.confidence-15);if(shrink)c.value*=1-shrink;expansionEvent(s,c,'suspension',reason+(shrink?'，估值缩水 '+Math.round(shrink*100)+'%':''));}
function completeExpandedListing(s,c){
 const f=c.capital,a=f.application,x=f.extension,q=issuancePricing(s,c,a.venue),v=exchangeRules[a.venue],pre=q.preValue,raise=Math.max(100,pre*.2),fee=raise*.035,old=c.equity,opening=c.cash,firstDay=(marketRandom(s,c.id+':first-day:'+capitalClock(s))*2-1)*v.swing;
 c.equity*=pre/(pre+raise);x.founderStake*=pre/(pre+raise);c.cash+=raise-fee;c.value=(pre+raise-fee)*(1+firstDay);f.stage='ipo';
 f.public={year:s.year,venue:a.venue,locks:[{equity:c.equity,unlockYear:s.year+a.lockYears,unlockMonth:capitalClock(s)+a.lockYears*12}],priceFactor:1+firstDay,lastTradeYear:null,shares:1000000*(1+raise/pre),issuePrice:pre/1000000,issueValue:pre+raise-fee,lastTradeMonth:null};
 x.founderUnlockMonth=capitalClock(s)+36;a.status='listed';a.phase='完成上市';a.resultYear=s.year;a.timeline.push({month:capitalClock(s),phase:'完成上市'});x.achievement={month:capitalClock(s),venue:a.venue,title:'完成公开上市'};
 capitalTransaction(c,{year:s.year,kind:'ipo',stage:'ipo',raise,fee,fundAmount:0,preValue:pre,postValue:pre+raise,equityBefore:old,equityAfter:c.equity,cashBefore:opening,cashAfter:c.cash,purpose:'公开发行新股募集发展资金',mode:'public'});
 x.quotes.push({month:capitalClock(s),value:c.value,price:c.value/f.public.shares,change:firstDay,event:'上市首日'});expansionEvent(s,c,'listing','完成'+v.name+'上市，首日'+(firstDay>=0?'上涨':'下跌')+Math.abs(firstDay*100).toFixed(1)+'%；募集款留在公司，基金尚未退出');
}
function listingMonth(s,c){
 const f=c.capital,a=f.application,x=f.extension;if(!a||a.status!=='review'||a.month===undefined)return;
 const elapsed=capitalClock(s)-a.month,lev=creditLeverage(c),v=exchangeRules[a.venue];
 if(c.distress||c.integration||currentRebuild(c)){failExpandedListing(s,c,'债务或新增建设事项需要更新发行材料');return;}
 if(lev>=10&&['main','star'].includes(a.venue)){x.regulatory=Math.max(0,x.regulatory-25);failExpandedListing(s,c,'极限ABS杠杆触发终止审核');return;}
 if(elapsed>=3&&a.phase==='申报受理'){a.phase='问询与聆讯';a.timeline.push({month:capitalClock(s),phase:a.phase});if(lev>=3)expansionEvent(s,c,'inquiry','发行问询：补充信贷资产、ABS结构与杠杆数据');}
 if(elapsed>=6&&a.phase==='问询与聆讯'){
  const actual=x.quarterly?.reports.filter(r=>!r.partial).slice(-2);if(a.venue==='main'&&actual?.length===2&&actual.every(r=>r.profit<=0)){failExpandedListing(s,c,'连续两份实际季度报表亏损，持续盈利条件需要重新核查');return;}
  if(x.credit&&!x.credit.disclosed){failExpandedListing(s,c,'信贷业务未完整披露，核查未通过');return;}
  if(a.venue==='hk'&&lev>=10&&marketRandom(s,c.id+':hearing:'+a.month)<.7){failExpandedListing(s,c,'高杠杆专项核查，IPO暂缓',.3+marketRandom(s,c.id+':shrink:'+a.month)*.2);return;}
  if(era(s.year).m<.8){failExpandedListing(s,c,'市场窗口收紧，暂缓招股');return;}
  if(marketRandom(s,c.id+':approval:'+a.month)>.4+c.quality*.5-(x.credit?.incomeShare||0)*.1-Math.max(0,70-x.regulatory)*.003){failExpandedListing(s,c,'治理与经营材料仍需整改');return;}
  a.phase='招股定价';a.timeline.push({month:capitalClock(s),phase:a.phase});
 }
 if(elapsed>=9&&a.phase==='招股定价'){
  if(a.venue==='hk'&&lev>=10&&marketRandom(s,c.id+':subscription:'+a.month)<.35){failExpandedListing(s,c,'招股期间触发专项核查',.3+marketRandom(s,c.id+':shrink2:'+a.month)*.2);return;}
  if(s.year+a.lockYears>2050){failExpandedListing(s,c,'剩余期限无法完成锁定安排');return;}completeExpandedListing(s,c);
 }
}
function advanceMonths(s,count=3){
 if(quarterly(s))return advanceQuarterMonths(s,count);
 if(!expanded(s)||s.ended||!Number.isInteger(count)||count<1||count>12)return false;
 for(let i=0;i<count&&!s.ended;i++){
  const closing=s.campaign.month===11;if(closing){for(const c of s.portfolio.filter(c=>c.status==='active'))accrueCreditIncome(c);s.campaign.month=0;advanceAnnual(s);}
  else s.campaign.month++;
  for(const c of s.portfolio.filter(c=>c.status==='active'&&c.capital?.extension)){listingMonth(s,c);creditMonth(s,c,!closing);if(c.capital.public)publicMonth(s,c);}
 }
 record(s);return true;
}
function publicMonth(s,c){
 const p=c.capital.public,x=c.capital.extension;if(!p||x.delisted)return;
 if(!p.shares){p.shares=1000000;p.issuePrice=c.value/p.shares;p.issueValue=c.value;p.lastTradeMonth=null;}
 if(x.quotes.at(-1)?.month===capitalClock(s))return;
 if(s.campaign.month===5&&marketRandom(s,c.sector+':policy:'+s.year)<.06){c.value*=p.venue==='nasdaq'?.75:p.venue==='hk'?.83:.9;expansionEvent(s,c,'policy','行业政策收紧，市场下调估值');}
 if(s.campaign.month===2&&c.capital.technology&&c.quality>.8&&!x.qualification&&marketRandom(s,c.id+':qualification:'+s.year)<.15){x.qualification=true;c.value*=1.08;expansionEvent(s,c,'qualification','获得模拟国家级技术资质，市场提高成长预期');}
 if(c.value/(p.shares||1000000)<(p.issuePrice||c.value/(p.shares||1000000))*.2&&!x.projectFailed){x.projectFailed=true;expansionEvent(s,c,'crash','市值较发行后基准下跌超过80%，项目判定失败；剩余股份仍按市价核算');}
 const oldPrice=x.quotes.at(-1)?.price||p.issuePrice||c.value/p.shares,v=exchangeRules[p.venue],noise=(marketRandom(s,c.id+':quote:'+capitalClock(s))-.5)*v.swing*.16,mood=(era(s.year).m-1)*.025,growth=clamp((c.organicGrowth??c.growth)/100,-.5,.5)*.015;
 c.value=Math.max(.01,c.value*(1+noise+mood+growth));
 x.quotes.push({month:capitalClock(s),value:c.value,price:c.value/p.shares,change:oldPrice>0?c.value/p.shares/oldPrice-1:0,event:x.events.filter(e=>e.month===capitalClock(s)&&['penalty','overdue','inquiry','deleverage','delisting','buyback','placement','sale','founder-sale','earnings','policy','qualification','covenant','crash'].includes(e.kind)).map(e=>e.text).join('；')||'市场交易'});if(x.quotes.length>240)x.quotes.shift();
 if(!quarterly(s)&&(s.campaign.month+1)%3===0){const r=c.financialHistory.filter(r=>!r.opening).at(-1);x.reports.push({month:capitalClock(s),year:s.year,quarter:(s.campaign.month+1)/3,annualYear:r?.year??s.year,annualRevenue:r?.revenue??c.revenue,annualProfit:r?.profit??c.profit,cash:c.cash,debt:debtBalance(c),value:c.value,leverage:creditLeverage(c)});if(x.reports.length>80)x.reports.shift();}
}
function settleExpandedYear(s,c,row,priorPremium){
 const x=c.capital.extension,p=c.capital.public,a=x.covenant;if(a?.status==='active'&&s.year>=a.dueYear){a.status=c.revenue>=a.target?'met':'failed';if(a.status==='failed'){x.confidence=Math.max(0,x.confidence-15);c.value*=.85;expansionEvent(s,c,'covenant','营收对赌未达标，投资人下调估值；不自动生成赔偿回款');}else expansionEvent(s,c,'covenant','营收对赌目标已达成');}if(!p)return;if(x.delisted){c.value*=.25;row.value=c.value;return;}
 // Annual operations retain one ledger. Monthly marks never create company cash or realized fund returns.
 const beat=x.expectedRevenue&&c.revenue>x.expectedRevenue*1.1,miss=x.expectedRevenue&&c.revenue<x.expectedRevenue*.85;x.expectedRevenue=c.revenue*(1+clamp((c.organicGrowth??c.growth)/100,0,.2));
 if(beat){expansionEvent(s,c,'earnings','年度营收超过此前预期，市场上调估值');}else if(miss){expansionEvent(s,c,'earnings','年度营收低于此前预期，市场下调估值');}
 const old=x.quotes.at(-1)?.value??c.value,pricing=issuancePricing(s,c,p.venue),fair=Math.max(1,pricing.preValue),premium=clamp(Math.pow(Math.max(.01,priorPremium),.5),.3,2);
 c.value=Math.max(.01,(old*.55+fair*premium*.45)*(beat?1.08:miss?.92:1)*(row.industry?.good?1.04:row.industry?.bad?.94:1)*(a?.status==='failed'&&a.dueYear===s.year?.85:1));x.lossReports=c.profit<0&&c.cashFlow<0?(x.lossReports||0)+1:0;if(row.industry?.good)expansionEvent(s,c,'qualification',row.industry.text+'，市场给予经营改善溢价');if(x.lossReports>=3){x.delisted=true;x.projectFailed=true;c.value*=.25;expansionEvent(s,c,'delisting','连续经营恶化触发模拟退市，项目判定失败；保留残余资产待处置');}p.priceFactor=clamp(c.value/Math.max(.001,(p.shares||1000000)*(p.issuePrice||fair/(p.shares||1000000))),.001,1000);row.value=c.value;
}
function validExpansion(c,year){
 const x=c.capital?.extension;if(x===undefined)return true;
 const n=(v,lo=0,hi=Infinity)=>Number.isFinite(v)&&v>=lo&&v<=hi;
 if(!x||x.version!==1||!Object.hasOwn(structureNames,x.structure)||x.venue!==null&&!Object.hasOwn(exchangeRules,x.venue)||!Number.isInteger(x.lockUntil)||x.lockUntil<0||!n(x.regulatory,0,100)||!n(x.confidence,0,100)||typeof x.delisted!=='boolean')return false;
 if(!Array.isArray(x.events)||x.events.length>240||x.events.some(e=>!e||!Number.isInteger(e.month)||e.month>(year+1)*12||typeof e.kind!=='string'||typeof e.text!=='string'||e.text.length>600))return false;
 if(!Array.isArray(x.quotes)||x.quotes.length>240||x.quotes.some(r=>!r||!Number.isInteger(r.month)||!n(r.value)||!n(r.price)||!Number.isFinite(r.change)))return false;
 if(!Array.isArray(x.reports)||x.reports.length>80||x.reports.some(r=>!r||!Number.isInteger(r.month)||!Number.isInteger(r.quarter)||r.quarter<1||r.quarter>4||!['annualRevenue','annualProfit','cash','debt','value','leverage'].every(k=>Number.isFinite(r[k]))))return false;
 if(x.covenant&&(!Number.isInteger(x.covenant.dueYear)||x.covenant.dueYear>2050||!n(x.covenant.target)||!['active','met','failed'].includes(x.covenant.status)))return false;
 if(!Array.isArray(x.actions)||x.actions.length>240||x.actions.some(a=>!a||!Number.isInteger(a.month)||a.month>year*12+11||!['placement','buyback','founder'].includes(a.kind)||!n(a.amount)||a.fee!==undefined&&!n(a.fee)||['equity','equityBefore','equityAfter'].some(k=>a[k]!==undefined&&!n(a[k],0,1))))return false;
 if(x.founderUnlockMonth!==undefined&&(!Number.isInteger(x.founderUnlockMonth)||x.founderUnlockMonth<0||x.founderUnlockMonth>2053*12))return false;
 if(!n(x.founderStake,0,1)||!n(x.founderProceeds)||c.status==='active'&&x.founderStake+c.equity>1+1e-7||['pendingBuyback','expectedRevenue'].some(k=>x[k]!==undefined&&!n(x[k]))||x.lossReports!==undefined&&(!Number.isInteger(x.lossReports)||x.lossReports<0)||x.totalPenalties!==undefined&&(!Number.isInteger(x.totalPenalties)||x.totalPenalties<0)||['projectFailed','qualification'].some(k=>x[k]!==undefined&&typeof x[k]!=='boolean'))return false;
 if(x.closedCredit&&(!['income','interest','loss'].every(k=>n(x.closedCredit[k]))))return false;
 if(x.achievement&&(!Number.isInteger(x.achievement.month)||x.achievement.month>year*12+11||!Object.hasOwn(exchangeRules,x.achievement.venue)||typeof x.achievement.title!=='string'))return false;
 const a=c.capital.application;if(a?.month!==undefined&&(!Number.isInteger(a.month)||a.month>year*12+11||!['申报受理','问询与聆讯','招股定价','完成上市','否决','发行暂缓','主动撤回'].includes(a.phase)||!Array.isArray(a.timeline)||a.timeline.length>8||a.timeline.some(t=>!t||!Number.isInteger(t.month)||typeof t.phase!=='string')||a.retryAfter!==undefined&&(!Number.isInteger(a.retryAfter)||a.retryAfter<a.month)))return false;
 return validQuarterlyBook(c,year)&&validCreditExpansion(x.credit,year)&&validPublicExpansion(c,year);
}

function validPublicExpansion(c,year){const p=c.capital.public;if(!p)return true;return p.locks.every(l=>l.unlockMonth===undefined||Number.isInteger(l.unlockMonth)&&l.unlockMonth<=2050*12&&Math.floor(l.unlockMonth/12)===l.unlockYear)&&exchangeRules[p.venue]?.from<=p.year&&(p.shares===undefined||Number.isFinite(p.shares)&&p.shares>0&&Number.isFinite(p.issuePrice)&&p.issuePrice>=0&&Number.isFinite(p.issueValue)&&p.issueValue>=0)&&(p.lastTradeMonth===undefined||p.lastTradeMonth===null||Number.isInteger(p.lastTradeMonth)&&p.lastTradeMonth<=year*12+11);}
function listingVenues(s,c){return expanded(s)?Object.values(exchangeRules).filter(v=>v.from<=s.year&&(!v.technology||c.capital?.technology)):legacyListingVenues(s,c);}
function listingQuote(s,id,venue='main'){return expanded(s)?expandedListingQuote(s,id,venue):legacyListingQuote(s,id,venue);}
function applyListing(s,id,venue='main'){return expanded(s)?expandedApplyListing(s,id,venue):legacyApplyListing(s,id,venue);}
function advance(s){return expanded(s)?advanceMonths(s,12):advanceAnnual(s);}

const creditEligible=['互联网','移动应用','企业软件','消费品牌','物流供应链','企业服务'];
function creditQuote(s,id,action='start',target=2){
 const c=s.portfolio.find(c=>c.id===id&&c.status==='active'),x=c?.capital?.extension,a=x?.credit,capital=c?Math.max(20,Math.min(500,c.cash*.08)):0,fee=action==='start'?5:action==='disclose'?2:0;
 const reason=!expanded(s)||!x?'此档案尚未接入金融业务':s.ended?'基金已结算':c.distress?'先处理偿债危机':c.cash<fee?'公司现金不足以支付准备费用':action==='start'?a?'信贷业务已经开办':!creditEligible.includes(c.sector)?'本项目不适合开展平台信贷业务':c.cash<capital+fee+Math.max(30,c.costs*.5)?'须留够信贷资本、准备费与主营业务储备':'':!a?'企业尚未开展信贷业务':action==='leverage'?![2,5,10,12].includes(target)?'请选择2、5、10或12倍档位':a.frozen?'信贷业务处于整改冻结状态':target<=creditLeverage(c)?'提高杠杆须选择高于当前的档位':a.capital<=1?'风险资本不足，先收缩或关闭业务':'':action==='deleverage'?creditLeverage(c)<=1.01?'已没有ABS融资可压降':'':action==='disclose'?a.disclosed?'当前披露已经完整':'':action==='close'?'':action==='conceal'?'':'请选择有效业务操作';
 return {ok:!reason,reason,capital,fee,target,leverage:c?creditLeverage(c):0};
}
function creditAction(s,id,action='start',target=2){
 const q=creditQuote(s,id,action,target);if(!q.ok)return false;const c=s.portfolio.find(c=>c.id===id),x=c.capital.extension;let a=x.credit;
 if(q.fee){c.cash-=q.fee;c.capital.pendingExpense+=q.fee;c.value=Math.max(0,c.value-q.fee);}
 if(action==='start'){
  c.cash-=q.capital;x.credit=a={version:1,capital:q.capital,assets:q.capital,absDebt:0,disclosed:true,incomeShare:0,overdue:.025,pendingIncome:0,pendingInterest:0,pendingLoss:0,totalLoss:0,creditorLoss:0,frozen:false,lastPenaltyMonth:null,penalties:0,lastAction:capitalClock(s),previousLeverage:1};
  expansionEvent(s,c,'credit','投入 '+money(q.capital)+' 万风险资本开办平台信贷；ABS融资只进入资产池，不进入公司可用现金');
 }else if(action==='leverage'){
  const before=creditLeverage(c);a.assets=a.capital*target;a.absDebt=a.assets-a.capital;a.previousLeverage=before;a.lastAction=capitalClock(s);if(target>=3){x.regulatory=Math.max(0,x.regulatory-3);x.confidence=Math.max(0,x.confidence-2);if(c.capital.public&&!x.delisted)c.value*=.95;}expansionEvent(s,c,'leverage','ABS资产池扩张至 '+money(a.assets)+' 万，杠杆 '+target+' 倍；尾部损失与发行折价增加');
 }else if(action==='deleverage'){
  const before=creditLeverage(c),next=Math.max(1,Math.min(2.5,before/2));a.assets=a.capital*next;a.absDebt=Math.max(0,a.assets-a.capital);a.frozen=false;a.previousLeverage=before;a.lastAction=capitalClock(s);if(before>=3&&next<3&&(a.lastRewardMonth===undefined||capitalClock(s)-a.lastRewardMonth>=12)){x.regulatory=Math.min(100,x.regulatory+5);x.confidence=Math.min(100,x.confidence+3);if(c.capital.public&&!x.delisted)c.value*=1.025;a.lastRewardMonth=capitalClock(s);}expansionEvent(s,c,'deleverage','收回信贷并偿还ABS，杠杆从 '+before.toFixed(2)+' 倍降至 '+next.toFixed(2)+' 倍');
 }else if(action==='disclose'){a.disclosed=true;expansionEvent(s,c,'disclosure','完成资产池、杠杆与逾期数据披露，公司支付准备费 '+money(q.fee)+' 万');}
 else if(action==='conceal'){a.disclosed=false;expansionEvent(s,c,'disclosure','暂停更新信贷披露，发行审核与监管风险上升');}
 else if(action==='close'){
  // Recover the pool, repay ABS first, and recognize the accumulated operating result once.
  settleCreditIncome(c);c.cash+=a.capital;x.credit=null;expansionEvent(s,c,'credit-close','收回剩余信贷资产并偿还ABS，返还风险资本 '+money(a.capital)+' 万至公司');
 }
 if(x.credit)x.credit.incomeShare=clamp(x.credit.assets*.14/Math.max(1,c.revenue+x.credit.assets*.14),0,1);runway(c);syncMarket(s,c);record(s);return true;
}
function creditNetAssets(c){const a=c.capital?.extension?.credit;return a?Math.max(0,a.assets-a.absDebt):0;}
function accrueCreditIncome(c){const a=c.capital?.extension?.credit;if(a&&a.capital>0){a.pendingIncome+=a.assets*.14/12;a.pendingInterest+=a.absDebt*.055/12;}}
function creditMonth(s,c,accrue=true){
 const x=c.capital.extension,a=x.credit;if(!a)return;const lev=creditLeverage(c),before=a.assets,stress=marketRandom(s,c.id+':credit-stress:'+capitalClock(s)),wave=stress<(lev>=10?.12:lev>=3?.035:.008),rate=wave?.025+marketRandom(s,c.id+':credit-loss:'+capitalClock(s))*.025:.00035+Math.max(0,lev-2)*.00008;
 if(accrue)accrueCreditIncome(c);
 const loss=Math.min(a.assets,a.assets*Math.min(.05,rate)),retainedLoss=Math.min(a.capital,loss);a.assets-=loss;a.pendingLoss+=retainedLoss;a.totalLoss+=retainedLoss;a.capital=Math.max(0,a.assets-a.absDebt);
 if(a.assets<a.absDebt){a.creditorLoss+=a.absDebt-a.assets;a.absDebt=a.assets;a.capital=0;a.frozen=true;}
 a.overdue=clamp(a.overdue+(wave?.025:-.001),.01,.5);a.incomeShare=clamp(a.assets*.14/Math.max(1,c.revenue+a.assets*.14),0,1);
 if(wave){expansionEvent(s,c,'overdue','信贷逾期潮，风险资本损失 '+money(retainedLoss)+' 万；逾期率 '+(a.overdue*100).toFixed(1)+'%');if(c.capital.public)c.value*=.90;}
 const penaltyEligible=a.lastPenaltyMonth===null||capitalClock(s)-a.lastPenaltyMonth>=12;
 if(penaltyEligible&&((lev>=10||!a.disclosed)&&marketRandom(s,c.id+':credit-regulator:'+capitalClock(s))<(a.disclosed?.045:.10))){creditPenalty(s,c);}
 else if(lev>=3&&marketRandom(s,c.id+':credit-inquiry:'+capitalClock(s))<.025){x.regulatory=Math.max(0,x.regulatory-3);if(c.capital.public)c.value*=.94;expansionEvent(s,c,'inquiry','监管问询杠杆结构与资产质量，需评估压降或补充披露');}
 if(a.capital<1)a.frozen=true;
}
function creditPenalty(s,c){
 const x=c.capital.extension,a=x.credit;if(!a)return false;a.lastPenaltyMonth=capitalClock(s);a.penalties++;x.totalPenalties=(x.totalPenalties||0)+1;a.frozen=true;x.regulatory=Math.max(0,x.regulatory-20);x.confidence=Math.max(0,x.confidence-20);
 const fine=Math.min(Math.max(0,c.cash),Math.max(5,a.assets*.015));c.cash-=fine;c.value=Math.max(0,c.value-fine);c.capital.pendingExpense+=fine;
 if(c.capital.application?.status==='review')failExpandedListing(s,c,'信贷业务收到行政处罚，暂停发行并整改',.3);
 const p=c.capital.public,drop=p?.venue==='nasdaq'?.4+marketRandom(s,c.id+':penalty-drop:'+capitalClock(s))*.2:p?.venue==='hk'?.3+marketRandom(s,c.id+':penalty-drop:'+capitalClock(s))*.2:.2;
 if(p)c.value*=1-drop;
 expansionEvent(s,c,'penalty','信贷业务收到行政处罚，公司支付 '+money(fine)+' 万；'+(p?'当月股价下跌 '+(drop*100).toFixed(1)+'%':'发行与业务进入整改'),{drop,fine});
 if(p&&x.totalPenalties>=3){x.delisted=true;x.projectFailed=true;c.value*=.25;expansionEvent(s,c,'delisting','多次重大处罚触发退市，项目判定失败；保留残余资产，仍可处置清算');}
 return true;
}
function creditAnnual(c){const a=c.capital?.extension?.credit;if(!a)return {income:0,interest:0,loss:0};const out={income:a.pendingIncome,interest:a.pendingInterest,loss:a.pendingLoss};a.pendingIncome=0;a.pendingInterest=0;a.pendingLoss=0;return out;}
function settleCreditIncome(c){const a=c.capital.extension.credit;if(!a)return;const income=a.pendingIncome,interest=a.pendingInterest,loss=a.pendingLoss;
 // Closing mid-year keeps cash income in the annual operating ledger, without a second cash payment.
 c.capital.extension.closedCredit={income,interest,loss,...(c.capital.extension.closedCredit?{income:income+c.capital.extension.closedCredit.income,interest:interest+c.capital.extension.closedCredit.interest,loss:loss+c.capital.extension.closedCredit.loss}:{})};
}
function validCreditExpansion(a,year){
 if(a===null)return true;if(!a||a.version!==1)return false;
 if(!['capital','assets','absDebt','incomeShare','overdue','pendingIncome','pendingInterest','pendingLoss','totalLoss','creditorLoss'].every(k=>Number.isFinite(a[k])&&a[k]>=0)||a.incomeShare>1||a.overdue>1||typeof a.disclosed!=='boolean'||typeof a.frozen!=='boolean'||!Number.isInteger(a.penalties)||a.penalties<0||!Number.isInteger(a.lastAction)||a.lastPenaltyMonth!==null&&!Number.isInteger(a.lastPenaltyMonth))return false;
 return Math.abs(a.assets-a.absDebt-a.capital)<1e-6*Math.max(1,a.assets)&&a.lastAction<(year+1)*12&&(a.lastRewardMonth===undefined||Number.isInteger(a.lastRewardMonth)&&a.lastRewardMonth<(year+1)*12);
}

function lockActive(s,lock){return lock.unlockMonth!==undefined?lock.unlockMonth>capitalClock(s):lock.unlockYear>s.year;}
function expandedPublicQuote(s,id,fraction=1){
 const c=s.portfolio.find(c=>c.id===id&&c.status==='active'),p=c?.capital?.public,x=c?.capital?.extension;if(!p||!x)return {ok:false,reason:'这不是上市持仓'};
 const locked=p.locks.filter(x=>lockActive(s,x)).reduce((n,x)=>n+x.equity,0),available=Math.max(0,c.equity-locked),v=exchangeRules[p.venue],liquidity=v.liquidity*(.75+marketRandom(s,c.id+':float:'+capitalClock(s))*.5),tradable=Math.min(available,liquidity),sold=tradable*fraction,impact=clamp(sold/Math.max(.001,liquidity)*.12,0,.12),gross=c.value*sold*(1-impact/2),fee=gross*.003;
 const reason=s.ended?'基金已经结算':x.delisted?'企业已经退市，公开市场无法减持':![.25,.5,1].includes(fraction)?'请选择可减持额度的四分之一、一半或全部':available<=0?(locked>0?'当前股份仍在锁定期':'没有可出售股份'):p.lastTradeMonth===capitalClock(s)?'本月已经办理过减持':c.distress?'先处理偿债危机':'';
 return {ok:!reason,reason,fraction,locked,available,tradable,liquidity,sold,gross,fee,proceeds:gross-fee,impact,unlockDate:p.locks.filter(x=>lockActive(s,x)).map(x=>x.unlockMonth!==undefined?Math.floor(x.unlockMonth/12)+'年'+(x.unlockMonth%12+1)+'月':x.unlockYear+'年').sort().at(-1)||'',unlockYear:Math.max(s.year,...p.locks.filter(x=>lockActive(s,x)).map(x=>x.unlockYear))};
}
function expandedSellPublic(s,id,fraction=1){
 const q=expandedPublicQuote(s,id,fraction);if(!q.ok)return false;const c=s.portfolio.find(c=>c.id===id),p=c.capital.public,x=c.capital.extension;p.lastTradeMonth=capitalClock(s);p.lastTradeYear=s.year;
 c.value*=1-q.impact;
 if(q.sold>=c.equity*(1-1e-9))realize(s,c,q.proceeds,'上市退出');else{c.equity-=q.sold;c.proceeds+=q.proceeds;s.cash+=q.proceeds;s.returned+=q.proceeds;}
 (c.capital.trades??=[]).push({year:s.year,month:capitalClock(s),equity:q.sold,proceeds:q.proceeds,fee:q.fee});
 expansionEvent(s,c,'sale','基金减持 '+ownership(q.sold)+'，净到账 '+money(q.proceeds)+' 万；公司现金不变，股价承压 '+(q.impact*100).toFixed(1)+'%');record(s);return true;
}
function publicActionQuote(s,id,kind='placement',rate=.05){
 const c=s.portfolio.find(c=>c.id===id&&c.status==='active'),p=c?.capital?.public,x=c?.capital?.extension;if(!p||!x)return {ok:false,reason:'只有上市企业可以办理'};
 const reserve=capitalReserve(c,.75,0,true).reserve,free=Math.max(0,c.cash-reserve),amount=kind==='buyback'?Math.min(c.value*rate,free,c.value*.05):c.value*rate,pre=c.value*.93,fee=amount*.02,factor=kind==='buyback'?1/(1-amount/Math.max(.01,c.value)):pre/(pre+amount),last=x.actions.filter(a=>a.kind===kind).at(-1);
 const reason=s.ended?'基金已经结算':x.delisted?'退市企业不再办理公开市场资本操作':!['placement','buyback','founder'].includes(kind)?'请选择有效资本操作':![.02,.05,.1].includes(rate)?'请选择2%、5%或10%的档位':c.distress||c.round||c.integration||currentRebuild(c)?'先处理债务、融资或未完成建设':last&&capitalClock(s)-last.month<3?'同类操作每季度最多办理一次':kind==='buyback'&&amount<1?'公司现金须先留够经营和偿债储备':kind==='buyback'&&amount/c.value>=1-c.equity-(x.founderStake||0)?'市场上可回购的其他流通股份不足':kind==='placement'&&(x.regulatory<30||c.cashFlow<0&&c.cash<c.costs*.25)?'监管记录或持续经营能力不足以支持增发':kind==='placement'&&marketRandom(s,c.id+':placement:'+capitalClock(s))>.65+c.quality*.25?'当前没有足够投资人承接，等待市场窗口':kind==='founder'&&x.founderUnlockMonth>capitalClock(s)?'创始人股份仍在锁定期':kind==='founder'&&(x.founderStake||0)<=0?'创始人没有剩余股份':'';
 return {ok:!reason,reason,kind,rate,amount,fee,pre,factor,reserve,free,equityBefore:c.equity,equityAfter:c.equity*factor,cashAfter:kind==='buyback'?c.cash-amount:c.cash+amount-fee};
}
function publicAction(s,id,kind='placement',rate=.05){
 const q=publicActionQuote(s,id,kind,rate);if(!q.ok)return false;const c=s.portfolio.find(c=>c.id===id),p=c.capital.public,x=c.capital.extension,opening=c.cash,old=c.equity;
 if(kind==='founder'){
  const sold=Math.min(x.founderStake*rate,.02),impact=clamp(sold/exchangeRules[p.venue].liquidity*.1,0,.15),proceeds=c.value*sold*(1-impact/2)*.997;x.founderStake-=sold;x.founderProceeds=(x.founderProceeds||0)+proceeds;c.value*=1-impact;
  x.actions.push({month:capitalClock(s),kind,amount:proceeds,equity:sold});expansionEvent(s,c,'founder-sale','创始人减持 '+ownership(sold)+'，所得 '+money(proceeds)+' 万归创始人，基金与公司均未收款');
 }else if(kind==='placement'){
  c.cash+=q.amount-q.fee;c.equity*=q.factor;adjustLocks(c,q.factor);c.value=(c.value+q.amount-q.fee)*.98;
  c.round={...(quarterly(s)?{issuedYear:s.year,transactionIndex:c.capital.history.length,deadlineMonth:capitalClock(s)+3}:{}),cost:old*q.amount,oldEquity:old,raise:q.amount,purpose:'上市后定向增发支持主营扩张',gap:0,stage:'ipo',bridge:false,preValue:q.pre,postValue:q.pre+q.amount};
  capitalTransaction(c,{year:s.year,kind:'placement',stage:'ipo',raise:q.amount,fee:q.fee,fundAmount:0,preValue:q.pre,postValue:q.pre+q.amount,equityBefore:old,equityAfter:c.equity,cashBefore:opening,cashAfter:c.cash,purpose:'定向增发新股，募集主营扩张资金',mode:'public'});
  x.actions.push({month:capitalClock(s),kind,amount:q.amount,fee:q.fee,equityBefore:old,equityAfter:c.equity});expansionEvent(s,c,'placement','定向增发 '+money(q.amount)+' 万，公司净得 '+money(q.amount-q.fee)+' 万；未认购股东被稀释，短期股价承压');
 }else{
  c.cash-=q.amount;c.equity*=q.factor;adjustLocks(c,q.factor);c.value=(c.value-q.amount)*(1+Math.min(.02,q.amount/Math.max(.01,c.value)*.25));
  // Capital return is outside operating profit and is bridged explicitly in the next annual statement.
  x.pendingBuyback=(x.pendingBuyback||0)+q.amount;x.actions.push({month:capitalClock(s),kind,amount:q.amount,equityBefore:old,equityAfter:c.equity});expansionEvent(s,c,'buyback','公司支付 '+money(q.amount)+' 万回购并注销其他流通股份；基金没有出售，持股比例升至 '+ownership(c.equity));
 }
 if(x.actions.length>240)x.actions.shift();runway(c);syncMarket(s,c);record(s);return true;
}
function publicQuote(s,id,fraction=1){return expanded(s)?expandedPublicQuote(s,id,fraction):legacyPublicQuote(s,id,fraction);}
function sellPublic(s,id,fraction=1){return expanded(s)?expandedSellPublic(s,id,fraction):legacySellPublic(s,id,fraction);}

const expansionSectors=[
 {name:'地产',from:1990,icon:'RE',expansion:true,desc:'建设住宅、园区和产业物业，按交付与运营取得收入',edge:'开发与运营能力',risk:'交付、销售回款与债务到期'},
 {name:'农业科技',from:1990,icon:'AT',expansion:true,desc:'研发种植技术、农业设备与智慧农场产品',edge:'农业技术与渠道',risk:'天气、病害与农产品周期'},
 {name:'航空航天',from:2000,icon:'AS',expansion:true,desc:'研发卫星部件、商业航天设备与航空系统',edge:'技术与认证壁垒',risk:'试验失败、认证延期与验收回款'},
 {name:'半导体',from:1990,icon:'SC',expansion:true,desc:'从事芯片设计、晶圆工艺或半导体设备研发',edge:'芯片与工艺积累',risk:'流片良率、设备投入与库存周期'},
 {name:'物流供应链',from:1995,icon:'LS',expansion:true,desc:'经营仓储配送、冷链和供应链履约网络',edge:'仓网效率与客户连接',risk:'运力闲置、燃料成本与回款账期'},
 {name:'企业服务',from:2000,icon:'BS',expansion:true,desc:'向企业提供外包服务、订阅工具与业务运营支持',edge:'合同续约与交付经验',risk:'销售周期、客户流失与项目验收'}
];
sectors.push(...expansionSectors);
Object.assign(profiles,{
 '地产':{cost:.52,rnd:.01,salary:1.5,multiple:2.2,wc:.32,capex:.12},
 '农业科技':{cost:.43,rnd:.12,salary:1.5,multiple:3,wc:.20,capex:.06},
 '航空航天':{cost:.36,rnd:.25,salary:2.4,multiple:5,wc:.24,capex:.09},
 '半导体':{cost:.38,rnd:.24,salary:2.3,multiple:4.8,wc:.19,capex:.08},
 '物流供应链':{cost:.48,rnd:.03,salary:1.4,multiple:2.5,wc:.22,capex:.065},
 '企业服务':{cost:.20,rnd:.10,salary:1.9,multiple:3.8,wc:.12,capex:.02}
});
Object.assign(incumbentNames,{'地产':['城岳置业','河岸产业园','筑原发展'],'农业科技':['沃田农科','丰序种业','禾野农业'],'航空航天':['天穹航宇','星轨空间','云翼航科'],'半导体':['硅原半导体','芯衡微电','晶序电子'],'物流供应链':['通原物流','仓海供应链','冷途配送'],'企业服务':['企序服务','商维企服','合章运营']});
Object.assign(companyNameParts,{
 '地产':['筑原 城岳 栖岸 云庭 澜岸 城樾 序园 森庭 岸城 禾筑 栖园 川庭'.split(' '),'置业 地产 园区 发展 物业 建设'.split(' ')],
 '农业科技':['沃田 禾野 丰序 稻原 青穗 苗川 农序 谷禾 丰壤 麦原 禾育 谷丰'.split(' '),'农科 种业 农业 智农 农技 育种'.split(' ')],
 '航空航天':['星轨 天穹 云翼 空原 星航 穹顶 星翼 航川 天轨 苍穹 云箭 星穹'.split(' '),'航宇 空间 航科 航天 飞控 卫星'.split(' ')],
 '半导体':['硅原 芯衡 晶序 芯原 晶川 硅衡 微芯 芯舟 晶域 芯途 硅光 晶微'.split(' '),'半导体 微电 芯片 电子 芯科 晶圆'.split(' ')],
 '物流供应链':['通原 仓海 冷途 运川 链舟 达仓 仓原 物衡 运序 通仓 运达 仓衡'.split(' '),'物流 供应链 冷链 仓储 配送 运联'.split(' ')],
 '企业服务':['企序 商维 合章 企舟 商序 合维 企原 商衡 服原 企络 商川 企域'.split(' '),'企服 服务 运营 商服 数服 咨询'.split(' ')]
});
Object.assign(products,{'地产':['住宅开发与交付','产业园建设运营','商业物业运营'],'农业科技':['智慧灌溉系统','作物育种技术','农场监测设备'],'航空航天':['卫星通信部件','商业航天推进系统','航空飞控设备'],'半导体':['工业控制芯片','芯片设计服务','半导体检测设备'],'物流供应链':['区域仓储配送','冷链履约服务','企业供应链管理'],'企业服务':['企业人事服务','订阅式业务工具','企业采购运营服务']});
Object.assign(futureProducts,{'地产':['绿色住宅改造','低碳产业园运营','适老物业服务'],'农业科技':['气候适应育种','无人农场系统','农业环境智能监测'],'航空航天':['低轨卫星载荷','可复用航天部件','航空自主飞控'],'半导体':['工业智能芯片','先进工艺设计服务','高精度芯片检测'],'物流供应链':['自动仓网配送','智慧冷链网络','跨区域供应链协同'],'企业服务':['企业流程托管','智能订阅工具','企业采购协作服务']});
Object.assign(founderBackgrounds,{'地产':['曾负责工程开发和项目交付','做过多年的园区运营','从物业建设团队出来创业'],'农业科技':['曾负责农业技术推广','从育种研发团队出来创业','和农场经营者一起创业'],'航空航天':['从航空研发团队出来创业','曾负责卫星系统的试验','带着工程团队开发商业航天设备'],'半导体':['曾负责芯片设计和验证','从半导体工艺团队出来创业','做过多年芯片设备研发'],'物流供应链':['曾负责仓储网络调度','熟悉区域运输和冷链交付','从企业供应链团队出来创业'],'企业服务':['熟悉企业采购和人事流程','带着交付团队开展企业服务','曾负责订阅产品的客户运营']});
const expansionCustomers={'地产':['购房家庭','园区企业','商业租户'],'农业科技':['农场经营者','种植合作社','农业设备经销商'],'航空航天':['卫星制造商','商业航天团队','航空系统集成商'],'半导体':['工业设备企业','芯片设计团队','晶圆制造企业'],'物流供应链':['区域商户','生鲜企业','制造业采购部门'],'企业服务':['企业人事部门','中小企业','集团采购部门']};
function availableSectors(s){return sectors.filter(x=>x.from<=s.year&&(!x.expansion||expanded(s)));}
function industryYear(c,year){
 const empty={expense:0,workingCapital:0,capex:0,text:''};if(!expansionSectors.some(x=>x.name===c.sector))return empty;
 const draw=hash(c.id+':industry:'+year)/4294967296,bad=draw<.16+(1-c.quality)*.08,good=draw>.88,scale=c.revenue,config={
  '地产':{metric:'按期交付率',value:clamp(.9+c.quality*.08-(bad?.2:0),.5,1),bad:'交付与回款延期，工程支出和资金占用增加',good:'园区交付完成，租售回款改善',expense:.04,wc:.10,capex:.025},
  '农业科技':{metric:'生产稳定度',value:clamp(.78+c.quality*.2-(bad?.22:0),.4,1),bad:'天气与病害影响试验和生产，补种与防治支出增加',good:'新品种通过示范验收，生产稳定性提升',expense:.09,wc:.04,capex:.01},
  '航空航天':{metric:'试验与验收完成率',value:clamp(.72+c.quality*.25-(bad?.3:0),.3,1),bad:'关键试验未通过，追加研发并延后验收回款',good:'关键系统通过认证，取得示范项目资质',expense:.14,wc:.09,capex:.035},
  '半导体':{metric:'工艺良率',value:clamp(.63+c.quality*.32-(bad?.18:0),.3,.99),bad:'流片良率不及预期，返工与库存占用增加',good:'工艺验证通过，量产良率改善',expense:.10,wc:.07,capex:.03},
  '物流供应链':{metric:'运力利用率',value:clamp(.65+c.quality*.25-(bad?.18:0),.3,.98),bad:'燃料成本上升与运力闲置，履约支出增加',good:'仓网调度优化，履约与运力效率提升',expense:.06,wc:.04,capex:.02},
  '企业服务':{metric:'合同续约率',value:clamp(.72+c.quality*.22-(bad?.2:0),.35,.99),bad:'大客户推迟续约和验收，获客支出与应收占用增加',good:'客户续约改善，形成长期服务合同',expense:.055,wc:.075,capex:.005}
 }[c.sector];
 const out={expense:bad?scale*config.expense:0,workingCapital:bad?scale*config.wc:0,capex:bad?scale*config.capex:0,text:bad?config.bad:good?config.good:'主营业务按计划交付',metric:config.metric,value:config.value,good,bad};
 c.industry={year,metric:config.metric,value:config.value,text:out.text};if(good)c.quality=Math.min(1,c.quality+.008);return out;
}

// Versioned monthly operating ledger. Legacy annual campaigns stay reproducible.
function quarterly(s){return s?.campaign?.quarterly===1;}
function quarterBackupKey(raw){return 'longview-vc-save-v1-before-quarterly-'+hash(raw).toString(16)+'-'+raw.length;}
const paidExpenseKeys=['pendingExpense','pendingAcquisitionFee','pendingWorkoutFee','pendingDivestFee','pendingRebuildExpense'];
function prepaidAmounts(c){return {expense:(c.capital?.pendingExpense||0)+(c.pendingAcquisitionFee||0)+(c.pendingWorkoutFee||0)-(c.pendingNoncashFee||0)+(c.pendingDivestFee||0)+(c.pendingRebuildExpense||0),capex:c.pendingRebuildCapex||0};}
function startQuarterBook(s,c,reset=false){
 if(!c.capital?.extension||!quarterly(s))return;
 if(c.capital.extension.quarterly&&!reset)return;
 const paid=prepaidAmounts(c);
 c.capital.extension.quarterly={version:1,adoptedMonth:capitalClock(s),startMonth:capitalClock(s),lastCash:c.cash,openingCash:c.cash,historyIndex:c.capital.history.length,prepaidOpening:paid,openingAccrual:{income:(c.capital.extension.credit?.pendingIncome||0)+(c.capital.extension.closedCredit?.income||0),interest:(c.capital.extension.credit?.pendingInterest||0)+(c.capital.extension.closedCredit?.interest||0),loss:(c.capital.extension.credit?.pendingLoss||0)+(c.capital.extension.closedCredit?.loss||0)},months:[],yearRows:[],reports:[],staffCarry:0,recurringCosts:c.costs,recurringCashFlow:c.cashFlow,expectedRevenue:c.revenue/4};
}
function enableQuarterly(s){
 if(!isContinuous(s)||quarterly(s))return false;
 if(!expanded(s))enableExpansion(s);
 s.campaign.quarterly=1;
 for(const c of [...s.deals,...s.portfolio]){startQuarterBook(s,c);if(c.distress&&c.distress.month===undefined)c.distress.month=capitalClock(s);}
 return true;
}
function createQuarterlyCampaign(seed){const s=createExpandedCampaign(seed);enableQuarterly(s);return s;}
function monthlyLoans(c,s){
 let interest=0;for(const l of c.loans||[]){
  if(l.defaulted||l.balance<=1e-8)continue;
  if(!l.monthly){const end=Math.min(2050*12,capitalClock(s)+Math.max(1,l.remaining*12));l.monthly={start:capitalClock(s),end,installment:l.balance/Math.max(1,end-capitalClock(s))};}
  interest+=l.balance*l.rate/12;
  const coupon=capitalClock(s)+1>=l.monthly.end?l.balance:Math.min(l.balance,l.monthly.installment);
  l.due=Math.min(l.balance,(l.due||0)+coupon);l.remaining=Math.min(l.term,Math.max(0,Math.ceil((l.monthly.end-capitalClock(s)-1)/12)));
 }return interest;
}
function monthlyOperating(s,c,market,support=0){
 const book=c.capital?.extension?.quarterly,p=profiles[c.sector],st=strategies[c.strategy],before=c.cash,oldRevenue=c.revenue,teamOpening=c.team,paid=prepaidAmounts(c),annualRevenue=market?market.customers*market.unitPrice:oldRevenue;
 const carried=book?.staffCarry??c.monthlyStaffCarry??0,target=plannedTeam(c,annualRevenue),adjustment=carried+(target-c.team)/12,hire=Math.trunc(adjustment);
 c.team=clamp(c.team+hire,3,10000);if(book)book.staffCarry=adjustment-hire;else c.monthlyStaffCarry=adjustment-hire;
 c.revenue=Math.max(0,annualRevenue);c.growth=oldRevenue>0?clamp((Math.pow(c.revenue/oldRevenue,12)-1)*100,-95,150):0;c.organicGrowth=c.growth;if(market){c.market=market;c.competition=market.pressure;}
 const eventDraw=marketRandom(s,c.id+':operating-cost'),supplyShock=eventDraw>=.08&&eventDraw<.13?.09:0,annual=costs(c,c.revenue,support,supplyShock,teamOpening),k={};
 for(const [key,value] of Object.entries(annual))if(Number.isFinite(value))k[key]=value/12;
 const hiring=annual.hiringCost||0;k.payrollCost+=(hiring-hiring/12);k.total+=(hiring-hiring/12);if(annual.hiringCost!==undefined)k.hiringCost=hiring;
 const industry=hash(c.sector+':event-month:'+s.year)%12===s.campaign.month?industryYear(c,s.year):{expense:0,workingCapital:0,capex:0,text:''};
 const risk=s.campaign.month===0?settleVentureRisk(c,s.year,{event:marketRandom(s,c.id+':venture-risk')},support):null;
 const credit=creditAnnual(c),closed=c.capital?.extension?.closedCredit;if(closed){for(const key of ['income','interest','loss'])credit[key]+=closed[key];delete c.capital.extension.closedCredit;}
 const priorAccrual=book?.openingAccrual||{income:0,interest:0,loss:0};for(const key of ['income','interest','loss'])credit[key]=Math.max(0,credit[key]-priorAccrual[key]);if(book)book.openingAccrual={income:0,interest:0,loss:0};
 const integration=book?.pendingIntegration||null,interest=monthlyLoans(c,s),pending={preparationFee:c.capital?.pendingExpense||0,acquisitionFee:c.pendingAcquisitionFee||0,workoutFee:c.pendingWorkoutFee||0,noncashFee:c.pendingNoncashFee||0,divestFee:c.pendingDivestFee||0,rebuildExpense:c.pendingRebuildExpense||0,rebuildCapex:c.pendingRebuildCapex||0,dividend:c.pendingDividend||0,publicBuyback:c.capital?.extension?.pendingBuyback||0,allocationPrincipal:c.pendingAllocationPrincipal||0,rescuePrincipal:c.pendingRescuePrincipal||0,divestPrincipal:c.pendingDivestPrincipal||0,loanDrawdown:c.pendingLoanDrawdown||0,acquisitionEquity:c.pendingEquityRaise||0,rescueEquity:c.pendingRescueEquity||0,acquisitionPaid:c.pendingAcquisitionPrice||0,divestPrice:c.pendingDivestPrice||0,debtConversion:c.pendingDebtConversion||0};
 k.overhead+=pending.preparationFee+(industry.expense||0)+(risk?.expense||0);
 k.total+=pending.preparationFee+pending.acquisitionFee+pending.workoutFee+pending.divestFee+pending.rebuildExpense+interest+credit.interest+credit.loss+(industry.expense||0)+(risk?.expense||0)+(integration?.cost||0);
 const revenue=c.revenue/12,profit=revenue+credit.income-k.total,capex=c.revenue*p.capex*st.capex/12+pending.rebuildCapex+(industry.capex||0),workingCapital=Math.max(0,c.revenue-oldRevenue-(c.acquisitionBaseRevenue||0)+(c.pendingDivestRevenue||0))*p.wc+(industry.workingCapital||0)+(risk?.workingCapital||0),cashFlow=profit-capex-workingCapital+pending.noncashFee+credit.loss,increment=cashFlow+paid.expense+paid.capex+priorAccrual.income-priorAccrual.interest;
 c.cash+=increment;const principalPaid=payPrincipal(c);
 c.costs=k.total*12;c.profit=profit*12;c.capex=(capex-pending.rebuildCapex-(industry.capex||0))*12;c.workingCapital=workingCapital;c.interestExpense=interest*12;
 const recurringFlow=revenue+credit.income-annual.total/12-credit.interest-interest-c.revenue*p.capex*st.capex/12-Math.max(0,c.revenue-oldRevenue)*p.wc;
 c.cashFlow=recurringFlow*12;if(book){book.recurringCashFlow=c.cashFlow;book.recurringCosts=annual.total-hiring+credit.interest*12+interest*12;delete book.pendingIntegration;}
 if(c.capital){c.capital.pendingExpense=0;if(c.capital.extension)c.capital.extension.pendingBuyback=0;}
 for(const key of ['pendingAcquisitionPrice','pendingAcquisitionFee','acquisitionBaseRevenue','pendingLoanDrawdown','pendingEquityRaise','pendingRescueEquity','pendingWorkoutFee','pendingNoncashFee','pendingRescuePrincipal','pendingDebtConversion','pendingDivestPrice','pendingDivestFee','pendingDivestPrincipal','pendingDivestRevenue','pendingRebuildExpense','pendingRebuildCapex','pendingDividend','pendingAllocationPrincipal'])if(c[key]!==undefined)c[key]=0;
 runway(c);
 return {year:s.year,fiscalYear:s.year,month:capitalClock(s),operatingMonths:1,revenue,...k,costs:k.total,profit,creditIncome:credit.income,creditInterest:credit.interest,creditWriteoff:credit.loss,capex,workingCapital,cashFlow,increment,priorAccrualCashFlow:priorAccrual.income-priorAccrual.interest,priorPeriodAdjustment:priorAccrual.income-priorAccrual.interest-priorAccrual.loss,paidExpense:paid.expense,paidCapex:paid.capex,...pending,interestExpense:interest,principalDue:debtDue(c)+principalPaid+pending.rescuePrincipal,principalPaid:principalPaid+pending.rescuePrincipal+pending.divestPrincipal+pending.allocationPrincipal,debtBalance:debtBalance(c),competition:c.competition,growth:c.growth,support,strategy:c.strategy,value:c.value,ownership:c.equity,invested:c.invested,cashBefore:before,event:[market?'客户与订单月度结算':'业务月度结算',supplyShock?'供应成本上涨':'',industry.text,risk?.event?.text,integration?.event].filter(Boolean).join('；'),...(risk?{riskExpense:risk.expense,riskFrozen:risk.frozen,riskRecovered:risk.recovery,riskReceivables:risk.receivables,riskSeverity:risk.severity,...(risk.event?{riskEvent:risk.event}:{})}:{}),...(industry.text?{industry}:{}),...(market?{market:JSON.parse(JSON.stringify(market))}:{})};
}
function finishMonthlyStatement(s,c,r){
 const b=c.capital.extension.quarterly,prior=b.prepaidOpening,transactions=c.capital.history.slice(b.historyIndex),financing=transactions.filter(h=>h.kind!=='follow').reduce((n,h)=>n+h.raise-h.fee,0),financingCashFlow=financing+r.loanDrawdown+r.acquisitionEquity+r.rescueEquity-r.principalPaid-r.dividend-r.publicBuyback+(r.liquidationFinancing||0);
 const external=c.cash-b.lastCash-r.increment,currentPaidExpense=r.paidExpense-prior.expense,currentPaidCapex=r.paidCapex-prior.capex;
 r.unfundedOpening=Math.max(0,-b.lastCash);r.unfundedClosing=Math.max(0,-c.cash);r.workingCapital-=r.unfundedClosing-r.unfundedOpening+(r.unfundedNoncashRelease||0);r.cashFlow=r.profit-r.capex-r.workingCapital+r.noncashFee+r.creditWriteoff;
 r.cashOpening=Math.max(0,b.lastCash);r.cash=Math.max(0,c.cash);r.financing=financing;r.operatingCashFlow=r.profit-r.workingCapital+r.noncashFee+r.creditWriteoff+prior.expense+(r.priorAccrualCashFlow||0);
 r.investingCashFlow=-r.capex+prior.capex+external+currentPaidExpense+currentPaidCapex-financingCashFlow-(r.unfundedNoncashRelease||0);r.financingCashFlow=financingCashFlow;r.priorPaidExpense=prior.expense;r.priorPaidCapex=prior.capex;
 r.value=c.value;r.ownership=c.equity;delete r.increment;delete r.cashBefore;delete r.paidExpense;delete r.paidCapex;
 b.months.push(r);b.lastMonth=r;b.lastCash=c.cash;b.historyIndex=c.capital.history.length;b.prepaidOpening={expense:0,capex:0};
}
const statementSumKeys=['revenue','costs','profit','variableCost','payrollCost','marketing','rnd','overhead','creditIncome','creditInterest','creditWriteoff','capex','workingCapital','cashFlow','operatingCashFlow','investingCashFlow','financingCashFlow','preparationFee','acquisitionFee','workoutFee','noncashFee','divestFee','rebuildExpense','rebuildCapex','dividend','publicBuyback','allocationPrincipal','rescuePrincipal','divestPrincipal','loanDrawdown','acquisitionEquity','rescueEquity','acquisitionPaid','divestPrice','debtConversion','interestExpense','principalDue','principalPaid','financing','priorPaidExpense','priorPaidCapex','priorAccrualCashFlow','priorPeriodAdjustment','unfundedNoncashRelease','liquidationFinancing','hiringCost','riskExpense','riskFrozen','riskRecovered'];
function sumStatements(rows){const first=rows[0],last=rows.at(-1),r=Object.fromEntries(statementSumKeys.map(k=>[k,rows.reduce((n,x)=>n+(x[k]||0),0)]));return {...r,cashOpening:first.cashOpening,cash:last.cash,unfundedOpening:first.unfundedOpening||0,unfundedClosing:last.unfundedClosing||0,debtBalance:last.debtBalance,competition:last.competition,value:last.value,ownership:last.ownership,invested:last.invested,growth:last.growth,support:last.support,strategy:last.strategy,...(last.market?{market:last.market}:{}),...(last.industry?{industry:last.industry}:{}),event:'按实际月度经营结算汇总',operatingMonths:rows.reduce((n,x)=>n+(x.operatingMonths||0),0)};}
function closeQuarterBook(s,c,endMonth,partial=false){
 const b=c.capital?.extension?.quarterly;if(!b||!b.months.length)return null;
 const rows=b.months,r={...sumStatements(rows),year:Math.floor(endMonth/12),quarter:Math.floor(endMonth%12/3)+1,startMonth:b.startMonth,endMonth,month:endMonth,partial:partial||rows.reduce((n,x)=>n+x.operatingMonths,0)<3,kind:'income',recognized:true};
 b.reports.push(r);if(b.reports.length>240)b.reports.shift();b.yearRows.push(r);b.months=[];b.startMonth=endMonth+1;b.openingCash=c.cash;b.expectedRevenue=c.revenue/4;
 return r;
}
function quarterlyOnExit(s,c){
 const b=c.capital?.extension?.quarterly;if(!quarterly(s)||!b)return;
 // A disposal may happen between month closes. Recognize paid one-off costs without inventing operating months.
 const paid=prepaidAmounts(c),liq=c.liquidation,liquidationFee=liq?.fees||0,operatingPaid=liq?.creditors.find(k=>k.id==='operating')?.paid||0,noncashRelease=liq?Math.max(0,liq.operatingClaims-operatingPaid):0,changed=Math.abs(c.cash-b.lastCash)>1e-7,hasPaid=paid.expense||paid.capex,noncashWorkout=c.pendingNoncashFee||0,totalExpense=paid.expense+noncashWorkout+liquidationFee;
 if(changed||hasPaid||liq||noncashWorkout){
  const r={...Object.fromEntries(statementSumKeys.map(k=>[k,0])),year:s.year,month:capitalClock(s),operatingMonths:0,revenue:0,costs:totalExpense,profit:totalExpense?-totalExpense:0,capex:paid.capex,cashFlow:paid.expense+paid.capex+liquidationFee?-(paid.expense+paid.capex+liquidationFee):0,unfundedNoncashRelease:noncashRelease,liquidationFinancing:liq?-(liq.creditorPaid-operatingPaid+liq.equityResidual)||0:0,debtBalance:debtBalance(c),increment:0,paidExpense:paid.expense+liquidationFee,paidCapex:paid.capex,noncashFee:noncashWorkout,creditWriteoff:0,workoutFee:c.pendingWorkoutFee||0,rescueEquity:c.pendingRescueEquity||0,rescuePrincipal:c.pendingRescuePrincipal||0,principalDue:c.pendingRescuePrincipal||0,principalPaid:c.pendingRescuePrincipal||0,competition:c.competition,value:c.value,ownership:c.equity,invested:c.invested,growth:0,support:0,strategy:c.strategy,event:'退出时结清已付款项与资本流量'};
  finishMonthlyStatement(s,c,r);if(c.capital)c.capital.pendingExpense=0;for(const k of ['pendingAcquisitionFee','pendingWorkoutFee','pendingDivestFee','pendingRebuildExpense','pendingRebuildCapex','pendingNoncashFee','pendingRescueEquity','pendingRescuePrincipal'])if(c[k]!==undefined)c[k]=0;
 }
 closeQuarterBook(s,c,Math.max(b.startMonth,b.months.at(-1)?.month??capitalClock(s)-1),true);
}
function settleQuarterPrice(s,c,r){
 const p=c.capital.public,x=c.capital.extension;if(!p)return;
 if(x.delisted){c.value=Math.max(0,fundamental(c,era(s.year))*.25);return;}
 const b=x.quarterly,history=b.reports.filter(q=>!q.partial).slice(-4),profit=history.length===4?history.reduce((n,q)=>n+q.profit,0):null,pricing=issuancePricing(s,c,p.venue),fair=profit!==null&&profit>0?profit*pricing.pe:pricing.preValue;
 const estimate=r.expectedRevenue||r.revenue,beat=r.revenue>estimate*1.1,miss=r.revenue<estimate*.85;
 c.value=Math.max(.01,(c.value*.75+Math.max(1,fair)*.25)*(beat?1.05:miss?.95:1));
 if(beat||miss)expansionEvent(s,c,'earnings',r.year+'年第'+r.quarter+'季度营收'+(beat?'超过':'低于')+'期初预期，市场调整估值');
}
function monthlyFundingAndDistress(s,c,r){
 const b=c.capital.extension.quarterly;
 if(c.round&&c.round.deadlineMonth!==undefined&&capitalClock(s)>=c.round.deadlineMonth){c.round=null;expansionEvent(s,c,'rights','本轮认购权到期，未认购部分保留实际稀释结果');}
 const plan=fundingPlan(c),need=plan.gap>1e-7;
 if(!c.round&&s.year<2050&&(need||growthFunding(c,s.year))){const index=c.capital.history.length;if(capitalFunding(s,c,r,need,marketRandom(s,c.id+':monthly-funding'))){c.round.issuedYear=s.year;c.round.transactionIndex=index;c.round.deadlineMonth=capitalClock(s)+3;}}
 r.principalPaid+=payPrincipal(c);r.debtBalance=debtBalance(c);
 if(c.cash<=0||debtDue(c)>1e-7){if(!c.distress){c.distress={year:s.year,month:capitalClock(s)};c.round=null;expansionEvent(s,c,'distress','本月资金或到期还款出现缺口，已暂停推进；下一月经营前仍未解决将进入清算');}}else if(c.distress)c.distress=null;
 if(!c.capital.public)c.value=fundamental(c,era(s.year))*(c.integration?.9:1)*(c.distress?.5:1);
}
function rolloverQuarterYear(s,closingYear){
 const exitLevel=level(s,'exit'),opsLevel=level(s,'operations'),supported=new Set(supportIds(s));
 for(const key of Object.keys(roles))if(level(s,key))s.team[key].years++;
 s.year++;s.campaign.month=0;
 for(const c of s.portfolio.filter(c=>c.status==='active')){
  const b=c.capital.extension.quarterly,rows=b.yearRows.filter(q=>q.year===closingYear);c.age++;c.exitOffer=null;if(c.distress)c.distress.year=s.year;
  if(rows.length){const r={...sumStatements(rows),year:s.year,fiscalYear:closingYear,quarterly:true,partial:rows.reduce((n,q)=>n+q.operatingMonths,0)<12,opening:false};r.event=(r.partial?'接续后的实际经营期间':'四个季度实际经营')+'汇总；'+r.event;c.financialHistory.push(r);c.profitYears=r.profit>0?c.profitYears+1:0;b.yearRows=[];
   const x=c.capital.extension,a=x.covenant;if(a?.status==='active'&&closingYear>=a.dueYear){a.status=r.revenue>=a.target?'met':'failed';if(a.status==='failed'){x.confidence=Math.max(0,x.confidence-15);c.value*=.85;expansionEvent(s,c,'covenant','财年营收对赌未达标，估值和投资人信心承压');}}
   if(c.capital.public){x.lossReports=r.profit<0&&r.cashFlow<0?(x.lossReports||0)+1:0;if(x.lossReports>=3&&!x.delisted){x.delisted=true;x.projectFailed=true;c.value*=.25;expansionEvent(s,c,'delisting','连续三份财年经营恶化，触发模拟退市；残余资产继续核算');}}
   const odds=exitOdds(c,era(s.year),exitLevel);r.exitChance=c.age>=4&&!c.integration&&!currentRebuild(c)?odds:0;
   if(!c.capital.public&&c.capital.application?.status!=='review'&&r.exitChance&&marketRandom(s,c.id+':annual-offer')<odds){const factor=clamp(.95+r.profit/Math.max(1,r.revenue)*.3-c.competition*.08+exitLevel*.05,.65,1.25);c.exitOffer={year:s.year,factor,value:exitValue(c,factor),status:'并购退出'};if(c.exitPolicy!=='review')realize(s,c,c.exitOffer.value,c.exitOffer.status);}
  }
  syncMarket(s,c);
 }
 for(const c of s.portfolio.filter(c=>c.status!=='active')){const b=c.capital.extension.quarterly,rows=b.yearRows.filter(q=>q.year===closingYear);if(rows.length){c.financialHistory.push({...sumStatements(rows),year:s.year,fiscalYear:closingYear,quarterly:true,partial:rows.reduce((n,q)=>n+q.operatingMonths,0)<12,opening:false,event:'退出持有期间实际季度损益汇总'});b.yearRows=[];}}
 const fee=Math.min(s.cash,10);expense(s,fee,'operations');log(s,'年度基金运营支出 '+money(fee)+' 万元。');
 if(s.year>=2050){for(const c of s.portfolio.filter(c=>c.status==='active'))realize(s,c,exitValue(c,c.capital.public?.985:terminalFactor(s,exitLevel)),'到期清算');s.deals=[];s.ended=true;log(s,'2050年统一结算，季度与年度经营损益已经完成勾稽。','success');return;}
 const integrations=integrate(s,supported,opsLevel);progressRebuilds(s,supported,opsLevel);
 for(const c of s.portfolio.filter(c=>c.status==='active')){prepareCapital(s,c);if(integrations[c.id])c.capital.extension.quarterly.pendingIntegration=integrations[c.id];c.expansionStreak=c.strategy==='expand'?Math.min(7,(c.expansionStreak||0)+1):Math.max(0,(c.expansionStreak||0)-(c.strategy==='defend'?2:1));}
 renewTeam(s);s.extraDeals=0;s.deals=newDeals(s);sourceDeals(s);log(s,'今年又送来 '+s.deals.length+' 份项目材料。');
}
function advanceQuarterMonths(s,count=3){
 if(!quarterly(s)||s.ended||!Number.isInteger(count)||count<1||count>12)return false;
 for(let step=0;step<count&&!s.ended;step++){
  const month=capitalClock(s),year=s.year,ops=level(s,'operations'),supported=new Set(supportIds(s));
  for(const c of s.portfolio.filter(c=>c.status==='active'&&c.distress&&c.distress.month!==undefined&&c.distress.month<month))liquidate(s,c.id,'assets',null,true);
  for(const c of s.portfolio.filter(c=>c.status==='active')){startQuarterBook(s,c);accrueCreditIncome(c);creditMonth(s,c,false);}
  const market=compete(s,era(s.year),supported,ops,1/12);
  s.deals=s.deals.filter(c=>{const x=s.markets[c.sector]?.members.find(x=>x.id===c.id);if(!x||x.failed||x.acquiredBy){log(s,c.name+'的融资机会已关闭，企业未能维持经营。','warning');return false;}for(const key of memberKeys)if(key!=='value')c[key]=x[key];c.market=x.market;return true;});
  for(const c of s.portfolio.filter(c=>c.status==='active')){
   const r=monthlyOperating(s,c,market[c.id],supported.has(c.id)?ops:0);monthlyFundingAndDistress(s,c,r);finishMonthlyStatement(s,c,r);syncMarket(s,c);
   if(s.year===2049&&s.campaign.month===11&&(c.distress||c.cash<=0||debtDue(c)>1e-7||c.capital.extension.delisted))liquidate(s,c.id,'assets',null,true);
  }
  const lastMonth=s.campaign.month===11;const quarterEnd=(s.campaign.month+1)%3===0;
  if(quarterEnd)for(const c of s.portfolio.filter(c=>c.status==='active')){const expectation=c.capital.extension.quarterly.expectedRevenue,r=closeQuarterBook(s,c,month);if(r){r.expectedRevenue=expectation*(r.operatingMonths/3);settleQuarterPrice(s,c,r);}}
  if(lastMonth)rolloverQuarterYear(s,year);else s.campaign.month++;
  if(!s.ended)for(const c of s.portfolio.filter(c=>c.status==='active')){listingMonth(s,c);if(c.capital.public)publicMonth(s,c);}
  record(s);if(s.portfolio.some(c=>c.status==='active'&&c.distress?.month===month))break;
 }
 record(s);return true;
}
function validQuarterlyBook(c,year){
 const b=c.capital?.extension?.quarterly;if(b===undefined)return true;
 const fin=x=>Number.isFinite(x),near=(a,b)=>Math.abs(a-b)<1e-6*Math.max(1,Math.abs(a),Math.abs(b));
 const statement=r=>r&&['revenue','costs','profit','creditIncome','creditWriteoff','capex','workingCapital','cashFlow','operatingCashFlow','investingCashFlow','financingCashFlow','cashOpening','cash'].every(k=>fin(r[k]))&&r.revenue>=0&&r.costs>=0&&r.creditIncome>=0&&r.creditWriteoff>=0&&r.capex>=0&&r.cash>=0&&r.cashOpening>=0&&Number.isInteger(r.operatingMonths)&&r.operatingMonths>=0&&r.operatingMonths<=12&&near(r.profit,r.revenue+r.creditIncome-r.costs)&&near(r.cashFlow,r.profit-r.capex-r.workingCapital+(r.noncashFee||0)+r.creditWriteoff)&&near(r.cash,r.cashOpening+r.operatingCashFlow+r.investingCashFlow+r.financingCashFlow);
 const period=r=>statement(r)&&Number.isInteger(r.year)&&r.year<=year&&Number.isInteger(r.quarter)&&r.quarter>=1&&r.quarter<=4&&Number.isInteger(r.startMonth)&&Number.isInteger(r.endMonth)&&r.startMonth>=b.adoptedMonth&&r.endMonth>=r.startMonth&&Math.floor(r.endMonth/12)===r.year&&Math.floor(r.endMonth%12/3)+1===r.quarter&&r.startMonth>=Math.floor(r.endMonth/3)*3&&r.operatingMonths<=r.endMonth-r.startMonth+1&&typeof r.partial==='boolean';
 if(!b||b.version!==1||!Number.isInteger(b.adoptedMonth)||!Number.isInteger(b.startMonth)||b.adoptedMonth>year*12+11||b.startMonth>year*12+12||!fin(b.lastCash)||!fin(b.openingCash)||!Number.isInteger(b.historyIndex)||b.historyIndex<0||b.historyIndex>c.capital.history.length||!b.prepaidOpening||!['expense','capex'].every(k=>fin(b.prepaidOpening[k])&&b.prepaidOpening[k]>=0)||!fin(b.staffCarry)||Math.abs(b.staffCarry)>=1||!fin(b.recurringCosts)||b.recurringCosts<0||!fin(b.recurringCashFlow)||!fin(b.expectedRevenue)||b.expectedRevenue<0)return false;
 if(b.openingAccrual!==undefined&&(!b.openingAccrual||!['income','interest','loss'].every(k=>fin(b.openingAccrual[k])&&b.openingAccrual[k]>=0)))return false;
 if(!Array.isArray(b.months)||b.months.length>3||!b.months.every(r=>statement(r)&&Number.isInteger(r.month)&&r.month<=year*12+11)||!Array.isArray(b.yearRows)||b.yearRows.length>4||!b.yearRows.every(period)||!Array.isArray(b.reports)||b.reports.length>240||!b.reports.every(period))return false;
 if(b.lastMonth!==undefined&&!statement(b.lastMonth))return false;
 for(let i=1;i<b.reports.length;i++)if(b.reports[i].startMonth<=b.reports[i-1].endMonth)return false;
 for(const r of c.financialHistory.filter(r=>r.quarterly)){const quarters=b.reports.filter(q=>q.year===r.fiscalYear);if(!statement(r)||!Number.isInteger(r.fiscalYear)||r.year!==r.fiscalYear+1||!quarters.length||r.operatingMonths!==quarters.reduce((n,q)=>n+q.operatingMonths,0))return false;for(const key of statementSumKeys)if(!near(r[key]||0,quarters.reduce((n,q)=>n+(q[key]||0),0)))return false;if(!near(r.cashOpening,quarters[0].cashOpening)||!near(r.cash,quarters.at(-1).cash))return false;}
 return true;
}

// Preserve the original static catalog for archive consumers; new clients use availableSectors(state).
const api={quarterly,quarterBackupKey,enableQuarterly,createQuarterlyCampaign,advanceQuarterMonths,expansionSectors,availableSectors,publicActionQuote,publicAction,creditQuote,creditAction,creditNetAssets,enableExpansion,createExpandedCampaign,exchangeRules,structureNames,capitalClock,structureQuote,setStructure,withdrawListing,advanceMonths,creditLeverage,issuancePricing,expanded,capitalMilestones,fundTasks,rebuildBudgets,followQuote,exitReceipt,isContinuous,createCampaign,toContinuous,campaignBackupKey,fundingStages,resourceQuote,listingVenues,listingQuote,applyListing,publicQuote,sellPublic,endYear,futureEras,continueCampaign,limits,fictionalProjects,scenarioProjects,scenarioProject,riskBrief,historicalProjects,historicalProject,investmentTerms,expansionRun,followRecords,exitValue,terminalFactor,strategyOutlook,diligenceReport,investmentOutlook,exitQuote,fundingPlan,companyIdentity,companyCase,resolveCase,decideExit,exitReview,annualReview,allocationRates,dividendQuote,distribute,rebuildTypes,rebuildQuote,reinvest,cancelRebuild,currentRebuild,effectiveCapacity,divestQuote,divestBuyers,divest,liquidationQuote,liquidationBuyers,liquidate,allSectors:sectors,sectors:sectors.filter(x=>!x.expansion),profiles,roles,strategies,era,fresh,nav,research,invest,follow,sell,advance,valid,migrate,level,payroll,teamQuote,manageTeam,diligenceCost,stressProfit,score,setStrategy,saleFactor,supportIds,operate,fundamental,debtBalance,debtService,underPressure,workoutQuote,workout,compete,exitOdds,allocate,acquisitionQuote,acquisitionTargets,acquire};if(typeof module!=='undefined')module.exports=api;else root.VC=api;
})(typeof window!=='undefined'?window:globalThis);
