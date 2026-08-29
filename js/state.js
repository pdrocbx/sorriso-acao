(function () {
  const STORAGE_KEY = 'desafioAntiGolpeStateV4';
  const CHALLENGES = ['phishing','simswap','whatsapp','qrcode','support','marketplace','job','boleto'];
  const MAX_SCORE = 3000;

  const emptyChallenge = () => ({ started:false, completed:false, evidence:[], scenario:null, stage:null, startedAt:null, endedAt:null });
  const createInitialState = () => ({
    version: 4,
    score: 0,
    completed: [],
    decisions: [],
    hintsUsed: 0,
    achievements: [],
    startedAt: null,
    completedAt: null,
    lastChallenge: null,
    challengeData: Object.fromEntries(CHALLENGES.map(id => [id, emptyChallenge()]))
  });

  let state = createInitialState();

  function sanitizeState(candidate) {
    const base = createInitialState();
    if (!candidate || typeof candidate !== 'object') return base;
    return {
      ...base,
      ...candidate,
      version: 4,
      score: Number.isFinite(candidate.score) ? Math.max(0, Math.min(MAX_SCORE, candidate.score)) : 0,
      completed: Array.isArray(candidate.completed) ? [...new Set(candidate.completed.filter(id => CHALLENGES.includes(id)))] : [],
      decisions: Array.isArray(candidate.decisions) ? candidate.decisions.filter(d => CHALLENGES.includes(d.challenge)) : [],
      achievements: Array.isArray(candidate.achievements) ? [...new Set(candidate.achievements)] : [],
      challengeData: Object.fromEntries(CHALLENGES.map(id => [id, {
        ...base.challengeData[id],
        ...(candidate.challengeData?.[id] || {}),
        evidence: Array.isArray(candidate.challengeData?.[id]?.evidence) ? [...new Set(candidate.challengeData[id].evidence)] : []
      }]))
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      state = raw ? sanitizeState(JSON.parse(raw)) : createInitialState();
    } catch (error) {
      console.warn('Não foi possível carregar o progresso salvo.', error);
      state = createInitialState();
    }
    return state;
  }
  function save(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(error){ console.warn('Não foi possível salvar o progresso.',error); } }
  function ensureStarted(){ if(!state.startedAt) state.startedAt=Date.now(); }
  function startChallenge(challenge){ ensureStarted(); state.lastChallenge=challenge; const data=state.challengeData[challenge]; if(data){data.started=true;if(!data.startedAt)data.startedAt=Date.now();} save(); }
  function ensureScenario(challenge,options){ const data=state.challengeData[challenge]; if(!data)return options[0]; if(!data.scenario||!options.includes(data.scenario)){data.scenario=options[Math.floor(Math.random()*options.length)];save();} return data.scenario; }
  function recordDecision({challenge,action,label,severity='neutral',points=0,trait='cautious',meta={}}){ ensureStarted(); const decision={id:`${Date.now()}-${Math.random().toString(16).slice(2)}`,challenge,action,label,severity,points,trait,meta,at:Date.now()}; state.decisions.push(decision); state.score=Math.max(0,Math.min(MAX_SCORE,state.score+points)); save(); return decision; }
  function useHint(challenge,hintId){ const already=state.decisions.some(d=>d.challenge===challenge&&d.action===`hint:${hintId}`); if(already)return false; state.hintsUsed+=1; recordDecision({challenge,action:`hint:${hintId}`,label:'Usou uma pista',severity:'neutral',points:-35,trait:'cautious',meta:{hint:true}}); return true; }
  function addEvidence(challenge,evidenceId){ const data=state.challengeData[challenge]; if(!data||data.evidence.includes(evidenceId))return false; data.evidence.push(evidenceId); save(); return true; }
  function getEvidence(challenge){ return state.challengeData[challenge]?.evidence||[]; }
  function unlockAchievement(id){ if(state.achievements.includes(id))return false; state.achievements.push(id); save(); return true; }
  function setChallengeValue(challenge,key,value){ if(!state.challengeData[challenge])return; state.challengeData[challenge][key]=value; save(); }
  function getChallengeValue(challenge,key,fallback=null){ const value=state.challengeData[challenge]?.[key]; return typeof value==='undefined'?fallback:value; }
  function completeChallenge(challenge){ if(!state.completed.includes(challenge))state.completed.push(challenge); if(state.challengeData[challenge]){state.challengeData[challenge].completed=true;state.challengeData[challenge].endedAt=Date.now();} state.lastChallenge=challenge; if(state.completed.length===CHALLENGES.length&&!state.completedAt)state.completedAt=Date.now(); save(); }
  function reset(){ state=createInitialState(); try{localStorage.removeItem(STORAGE_KEY);}catch(_){} return state; }
  function getState(){return state;} function getDecisions(challenge){return state.decisions.filter(d=>!challenge||d.challenge===challenge);} function isCompleted(challenge){return state.completed.includes(challenge);}
  window.AntiScamState={load,save,reset,getState,getDecisions,isCompleted,startChallenge,ensureScenario,recordDecision,useHint,addEvidence,getEvidence,unlockAchievement,setChallengeValue,getChallengeValue,completeChallenge,CHALLENGES,MAX_SCORE};
})();
