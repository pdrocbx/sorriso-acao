(function () {
  let modalCleanup = null;
  let lastFocused = null;
  const I = (name, size = 20) => window.AntiScamIcons.icon(name, size);

  function showScreen(name) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(`screen-${name}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => target.querySelector('h1, h2, button')?.focus?.({ preventScroll: true }), 20);
    }
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.screen === name));
  }

  function updateHeader() {
    const state = window.AntiScamState.getState();
    const challenges = window.AntiScamState.CHALLENGES || [];
    document.getElementById('scoreValue').textContent = state.score;
    document.getElementById('challengeCounter').textContent = `${state.completed.length}/${challenges.length}`;
    challenges.forEach((id, index) => {
      document.getElementById(`progressDot${index + 1}`)?.classList.toggle('done', state.completed.includes(id));
    });
    document.getElementById('homeScore').textContent = state.score;
    document.getElementById('homeCompleted').textContent = state.completed.length;
    document.querySelectorAll('[data-challenge-card]').forEach(card => {
      const id = card.dataset.challengeCard;
      const completed = state.completed.includes(id);
      const started = state.challengeData[id]?.started;
      card.classList.toggle('completed', completed);
      const status = card.querySelector('.scenario-status');
      if (status) status.textContent = completed ? 'Concluído' : started ? 'Em andamento' : 'Não iniciado';
    });
  }

  function toast(message, icon = null) {
    const el = document.getElementById('toast');
    el.innerHTML = `${icon ? I(icon, 18) : ''}<span>${message}</span>`;
    el.classList.remove('hidden');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.add('hidden'), 2700);
  }

  function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    if (typeof modalCleanup === 'function') modalCleanup();
    modalCleanup = null;
    if (lastFocused?.focus) lastFocused.focus();
  }

  function showModal({ icon = 'info', title, html, actions = [], closable = true }) {
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    lastFocused = document.activeElement;
    document.getElementById('modalIcon').innerHTML = I(icon, 30);
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalText').innerHTML = html;
    closeBtn.classList.toggle('hidden', !closable);
    const actionRoot = document.getElementById('modalActions');
    actionRoot.innerHTML = '';
    actions.forEach(action => {
      const btn = document.createElement('button');
      btn.className = `btn ${action.className || 'btn-secondary'}`;
      btn.innerHTML = `${action.icon ? I(action.icon, 17) : ''}<span>${action.label}</span>`;
      btn.addEventListener('click', () => {
        if (action.close !== false) closeModal();
        if (typeof action.onClick === 'function') action.onClick();
      });
      actionRoot.appendChild(btn);
    });
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => (actionRoot.querySelector('button') || closeBtn).focus(), 10);

    const escapeHandler = event => { if (event.key === 'Escape' && closable) closeModal(); };
    document.addEventListener('keydown', escapeHandler);
    modalCleanup = () => document.removeEventListener('keydown', escapeHandler);
  }

  function feedback(type, title, text, onContinue) {
    const map = {
      safe: { icon: 'shield', defaultTitle: 'Boa escolha!' },
      risky: { icon: 'alert', defaultTitle: 'Cuidado!' },
      danger: { icon: 'shield-alert', defaultTitle: 'Você entrou na armadilha' },
      info: { icon: 'search', defaultTitle: 'Você encontrou uma pista' }
    };
    const cfg = map[type] || map.info;
    showModal({ icon: cfg.icon, title: title || cfg.defaultTitle, html: text, closable: false,
      actions: [{ label: 'Continuar', icon: 'arrow-right', className: 'btn-primary', onClick: onContinue }] });
  }

  function pointsToast(points) {
    if (!points) return;
    toast(`${points > 0 ? '+' : ''}${points} pontos`, points > 0 ? 'star' : 'alert');
    updateHeader();
  }

  function achievement(id, title) {
    if (!window.AntiScamState.unlockAchievement(id)) return;
    toast(`Conquista: ${title}`, 'badge');
  }

  function evidencePanel(challenge, items) {
    const found = window.AntiScamState.getEvidence(challenge);
    return `<aside class="evidence-panel" aria-label="Evidências encontradas">
      <div class="evidence-head"><span>${I('list-check', 18)}</span><div><strong>Evidências</strong><small>${found.length}/${items.length} encontradas</small></div></div>
      <div class="evidence-progress"><span style="width:${items.length ? (found.length/items.length)*100 : 0}%"></span></div>
      <div class="evidence-list">${items.map(item => `<div class="evidence-item ${found.includes(item.id) ? 'found' : ''}">${I(found.includes(item.id) ? 'circle-check' : 'search', 16)}<span>${found.includes(item.id) ? item.label : 'Ainda não investigada'}</span></div>`).join('')}</div>
    </aside>`;
  }

  function addEvidence(challenge, id, label) {
    const added = window.AntiScamState.addEvidence(challenge, id);
    if (added) {
      toast(`Evidência encontrada: ${label}`, 'search');
      const total = Object.values(window.AntiScamState.getState().challengeData).reduce((sum, data) => sum + (data.evidence?.length || 0), 0);
      if (total >= 3) achievement('olho-clinico', 'Olho Clínico');
    }
    return added;
  }


  function classificationPanel(challenge) {
    return `<div class="classification-box" aria-label="Classificação da situação">
      <div class="classification-copy"><strong>Sua conclusão</strong><small>Investigue o quanto quiser e classifique somente quando estiver pronto.</small></div>
      <div class="classification-actions">
        <button class="classification-btn" id="${challenge}ClassifyFraud">${I('shield-alert',17)} Parece golpe</button>
        <button class="classification-btn" id="${challenge}ClassifyLegit">${I('circle-check',17)} Parece legítimo</button>
      </div>
    </div>`;
  }

  function bindClassification({ challenge, actualType, onFinish, correctText = '', incorrectText = '' }) {
    const fraudBtn = document.getElementById(`${challenge}ClassifyFraud`);
    const legitBtn = document.getElementById(`${challenge}ClassifyLegit`);
    const decide = choice => {
      if (window.AntiScamState.isCompleted(challenge)) return;
      const evidenceCount = window.AntiScamState.getEvidence(challenge).length;
      const correct = choice === actualType;
      const points = correct ? Math.min(210, 75 + evidenceCount * 32) : -120;
      window.AntiScamState.recordDecision({
        challenge,
        action: `classification:${choice}`,
        label: choice === 'fraud' ? 'Classificou a situação como golpe' : 'Classificou a situação como legítima',
        severity: correct ? 'safe' : 'risky',
        points,
        trait: correct ? (evidenceCount >= 2 ? 'investigator' : 'cautious') : 'impulsive',
        meta: { classification: true, evidenceCount }
      });
      pointsToast(points);
      const base = correct
        ? `Sua conclusão combina com o cenário. Você encontrou <strong>${evidenceCount}</strong> evidência${evidenceCount === 1 ? '' : 's'} antes de decidir.`
        : `Sua conclusão não combina com o cenário desta rodada. Você encontrou <strong>${evidenceCount}</strong> evidência${evidenceCount === 1 ? '' : 's'} antes de decidir.`;
      feedback(correct ? 'safe' : 'risky', correct ? 'Classificação correta' : 'Revise as evidências', `${base}${correctText || incorrectText ? `<br><br>${correct ? correctText : incorrectText}` : ''}`, onFinish);
    };
    fraudBtn?.addEventListener('click', () => decide('fraud'));
    legitBtn?.addEventListener('click', () => decide('legit'));
  }

  function initTheme() {
    const saved = localStorage.getItem('desafioAntiGolpeTheme') || 'dark';
    document.documentElement.dataset.theme = saved;
    updateThemeButton(saved);
  }

  function updateThemeButton(theme) {
    const btn = document.getElementById('themeBtn');
    if (!btn) return;
    btn.innerHTML = theme === 'dark' ? I('sun', 18) : I('moon', 18);
    btn.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
    btn.title = theme === 'dark' ? 'Tema claro' : 'Tema escuro';
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('desafioAntiGolpeTheme', next);
    updateThemeButton(next);
  }

  function bindDefaultModalEvents() {
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', event => {
      if (event.target.id === 'modalOverlay' && !document.getElementById('modalClose').classList.contains('hidden')) closeModal();
    });
  }

  window.AntiScamUI = {
    showScreen, updateHeader, toast, showModal, closeModal, feedback, pointsToast,
    bindDefaultModalEvents, evidencePanel, addEvidence, achievement, classificationPanel, bindClassification, initTheme, toggleTheme
  };
})();
