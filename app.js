'use strict';

const STORAGE_KEY = 'mythic-table-v1';
const initialState = { character: null, history: [], journal: [], theme: 'dark' };
let state = loadState();
let selectedDie = 20;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return structuredClone(initialState);
    return {
      character: saved.character && typeof saved.character === 'object' ? saved.character : null,
      history: Array.isArray(saved.history) ? saved.history.slice(0, 30) : [],
      journal: Array.isArray(saved.journal) ? saved.journal.slice(0, 100) : [],
      theme: saved.theme === 'light' ? 'light' : 'dark'
    };
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    toast('Kayıt yapılamadı. Tarayıcı depolamasını kontrol et.');
    return false;
  }
}

function $(id) { return document.getElementById(id); }

let toastTimeout;
function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('show'), 2400);
}

function applyTheme() {
  document.body.classList.toggle('light', state.theme === 'light');
  $('themeBtn').textContent = state.theme === 'light' ? '☾' : '☼';
  document.querySelector('meta[name="theme-color"]').content =
    state.theme === 'light' ? '#f4f0e8' : '#171923';
}

function renderCharacter() {
  const c = state.character;
  $('characterCard').classList.toggle('hidden', !c);
  if (!c) return;
  $('cardName').textContent = c.name;
  $('cardDetails').textContent = [c.ancestry, c.heroClass, c.background].filter(Boolean).join(' · ');
  $('cardHp').textContent = c.hp;
  $('cardArmor').textContent = c.armor;
  $('cardLevel').textContent = c.level;
}

function renderDiceHistory() {
  const list = $('diceHistory');
  list.replaceChildren();
  if (!state.history.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'Henüz zar atılmadı.';
    list.append(li);
    return;
  }
  state.history.forEach(item => {
    const li = document.createElement('li');
    const left = document.createElement('span');
    const right = document.createElement('span');
    left.textContent = `${item.die} · ${item.roll} ${item.modifier >= 0 ? '+' : '−'} ${Math.abs(item.modifier)}`;
    right.textContent = `Toplam ${item.total}`;
    li.append(left, right);
    list.append(li);
  });
}

function renderJournal() {
  const list = $('journalEntries');
  list.replaceChildren();
  if (!state.journal.length) {
    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = 'Günlük henüz boş. İlk maceranı kaydet.';
    list.append(p);
    return;
  }
  state.journal.forEach(entry => {
    const article = document.createElement('article');
    article.className = 'journal-entry';
    const title = document.createElement('h3');
    title.textContent = entry.title;
    const time = document.createElement('time');
    time.textContent = new Date(entry.createdAt).toLocaleString('tr-TR');
    const body = document.createElement('p');
    body.textContent = entry.text;
    const remove = document.createElement('button');
    remove.className = 'delete-entry';
    remove.textContent = 'Kaydı sil';
    remove.type = 'button';
    remove.addEventListener('click', () => {
      if (!confirm('Bu günlük kaydını silmek istiyor musun?')) return;
      state.journal = state.journal.filter(item => item.id !== entry.id);
      saveState();
      renderJournal();
      toast('Günlük kaydı silindi.');
    });
    article.append(title, time, body, remove);
    list.append(article);
  });
}

$('themeBtn').addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  saveState();
});

$('characterForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('heroName').value.trim();
  const level = Number($('level').value);
  const hp = Number($('hp').value);
  const armor = Number($('armor').value);
  if (!name || !Number.isInteger(level) || level < 1 || level > 20 ||
      !Number.isInteger(hp) || hp < 0 || !Number.isInteger(armor) || armor < 0) {
    $('characterStatus').textContent = 'Lütfen karakter bilgilerini kontrol et.';
    return;
  }
  state.character = {
    name, ancestry: $('ancestry').value, heroClass: $('heroClass').value,
    background: $('background').value.trim(), level, hp, armor
  };
  saveState();
  renderCharacter();
  $('characterStatus').textContent = 'Karakter bu cihazda kaydedildi.';
  toast('Karakter kaydedildi!');
});

$('editCharacter').addEventListener('click', () => {
  const c = state.character;
  if (!c) return;
  $('heroName').value = c.name;
  $('ancestry').value = c.ancestry;
  $('heroClass').value = c.heroClass;
  $('background').value = c.background;
  $('level').value = c.level;
  $('hp').value = c.hp;
  $('armor').value = c.armor;
  $('characterForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

$('diceGrid').addEventListener('click', event => {
  const button = event.target.closest('button[data-sides]');
  if (!button) return;
  selectedDie = Number(button.dataset.sides);
  document.querySelectorAll('.die').forEach(die =>
    die.classList.toggle('selected', die === button));
});

$('rollBtn').addEventListener('click', () => {
  const modifier = Number($('modifier').value);
  if (!Number.isInteger(modifier) || modifier < -100 || modifier > 100) {
    toast('Değiştirici -100 ile 100 arasında tam sayı olmalı.');
    return;
  }
  const roll = Math.floor(Math.random() * selectedDie) + 1;
  const total = roll + modifier;
  $('rollNumber').textContent = total;
  $('rollBreakdown').textContent = `D${selectedDie}: ${roll} ${modifier >= 0 ? '+' : '−'} ${Math.abs(modifier)} = ${total}`;
  state.history.unshift({ die: `D${selectedDie}`, roll, modifier, total, at: Date.now() });
  state.history = state.history.slice(0, 30);
  saveState();
  renderDiceHistory();
});

$('clearDice').addEventListener('click', () => {
  state.history = [];
  saveState();
  renderDiceHistory();
  $('rollNumber').textContent = '—';
  $('rollBreakdown').textContent = 'Bir zar seç ve at.';
});

$('journalForm').addEventListener('submit', event => {
  event.preventDefault();
  const title = $('entryTitle').value.trim();
  const text = $('entryText').value.trim();
  if (!title || !text) return;
  state.journal.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title, text, createdAt: new Date().toISOString()
  });
  state.journal = state.journal.slice(0, 100);
  saveState();
  renderJournal();
  $('journalForm').reset();
  toast('Macera günlüğe eklendi!');
});

$('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mythic-table-yedek-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast('Yedek dosyası hazırlandı.');
});

$('importFile').addEventListener('change', async event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 2_000_000) throw new Error('Dosya çok büyük.');
    const imported = JSON.parse(await file.text());
    if (!imported || typeof imported !== 'object' ||
        !Array.isArray(imported.history) || !Array.isArray(imported.journal)) {
      throw new Error('Yedek dosyası biçimi geçersiz.');
    }
    if (!confirm('Mevcut kayıtlar yedekteki verilerle değiştirilsin mi?')) return;
    state = {
      character: imported.character && typeof imported.character === 'object' ? imported.character : null,
      history: imported.history.slice(0, 30),
      journal: imported.journal.slice(0, 100),
      theme: imported.theme === 'light' ? 'light' : 'dark'
    };
    saveState();
    applyTheme();
    renderCharacter();
    renderDiceHistory();
    renderJournal();
    toast('Yedek içe aktarıldı!');
  } catch (error) {
    toast(error.message || 'Yedek okunamadı.');
  } finally {
    event.target.value = '';
  }
});

applyTheme();
renderCharacter();
renderDiceHistory();
renderJournal();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
