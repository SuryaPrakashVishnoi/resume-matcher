/* ==============================================
   RESUMATCH v2 — APPLICATION
   UI interactions, smooth animations, company display
   Bug-fixed: no more stuck loading
   ============================================== */

(function(){
    'use strict';

    /* ---- State ---- */
    const S = {
        tab: 'upload',
        file: null,
        sample: null,
        text: '',
        results: null,
        theme: localStorage.getItem('rm-theme') || 'light'
    };

    const E = new ResumeMatchEngine();
    const q = s => document.querySelector(s);
    const qa = s => document.querySelectorAll(s);

    /* ---- Init ---- */
    function boot() {
        setTheme(S.theme);
        initNav();
        initTheme();
        initTabs();
        initDrop();
        initSamples();
        initAnalyze();
        initResultBtns();
        initScrollAnims();
        initCounters();
        initSmoothScroll();
    }

    /* ---- Theme ---- */
    function setTheme(t) {
        document.documentElement.setAttribute('data-theme', t);
        S.theme = t;
        localStorage.setItem('rm-theme', t);
    }
    function initTheme() {
        const b = q('#themeToggle');
        if (b) b.onclick = () => setTheme(S.theme === 'light' ? 'dark' : 'light');
    }

    /* ---- Navbar ---- */
    function initNav() {
        const nav = q('#navbar');
        const ham = q('#hamburger');
        const links = q('#navLinks');

        window.addEventListener('scroll', () => {
            nav.classList.toggle('pinned', window.scrollY > 40);
            // Active link
            let cur = '';
            ['home','process','matcher','about'].forEach(id => {
                const el = document.getElementById(id);
                if (el && el.offsetTop - 160 <= window.scrollY) cur = id;
            });
            qa('.nav-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
        });

        if (ham) {
            ham.onclick = () => {
                ham.classList.toggle('on');
                links.classList.toggle('open');
            };
            qa('.nav-link').forEach(l => l.addEventListener('click', () => {
                ham.classList.remove('on');
                links.classList.remove('open');
            }));
        }
    }

    /* ---- Tabs ---- */
    function initTabs() {
        qa('.m-tab').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.tab;
                qa('.m-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                qa('.m-panel').forEach(p => p.classList.remove('active'));
                const panel = q('#tab-' + id);
                if (panel) panel.classList.add('active');
                S.tab = id;
                checkBtn();
            };
        });
    }

    /* ---- Dropzone ---- */
    function initDrop() {
        const dz = q('#dropzone');
        const fi = q('#fileInput');
        const badge = q('#fileBadge');
        const rm = q('#removeFile');

        if (!dz) return;
        dz.onclick = () => fi.click();

        ['dragenter','dragover'].forEach(e => dz.addEventListener(e, ev => { ev.preventDefault(); dz.classList.add('over'); }));
        ['dragleave','drop'].forEach(e => dz.addEventListener(e, ev => { ev.preventDefault(); dz.classList.remove('over'); }));
        dz.addEventListener('drop', ev => { if (ev.dataTransfer.files[0]) pickFile(ev.dataTransfer.files[0]); });
        fi.addEventListener('change', ev => { if (ev.target.files[0]) pickFile(ev.target.files[0]); });

        if (rm) rm.onclick = () => {
            S.file = null; S.text = '';
            badge.style.display = 'none';
            dz.style.display = '';
            fi.value = '';
            checkBtn();
        };

        // Textarea
        const ta = q('#resumeText');
        if (ta) ta.oninput = () => { S.text = ta.value; checkBtn(); };
    }

    function pickFile(f) {
        const ext = '.' + f.name.split('.').pop().toLowerCase();
        if (!['.pdf','.txt','.doc','.docx'].includes(ext)) {
            toast('Upload a PDF, TXT, DOC or DOCX file.', 'err');
            return;
        }
        S.file = f;
        q('#fileName').textContent = f.name;
        q('#fileSize').textContent = fmtSize(f.size);
        q('#dropzone').style.display = 'none';
        q('#fileBadge').style.display = 'flex';

        if (ext === '.txt') {
            const r = new FileReader();
            r.onload = e => { S.text = e.target.result; checkBtn(); };
            r.readAsText(f);
        } else {
            // For non-txt, set a note but still allow analysis with filename
            S.text = `[Uploaded: ${f.name}]\nFor best results in this demo, use the Paste Text tab or a sample resume.\nPDF/DOC parsing needs a server-side component.`;
            toast('Tip: For best accuracy, paste your resume text directly.', 'inf');
            checkBtn();
        }
    }

    function fmtSize(b) {
        if (b < 1024) return b + ' B';
        if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
        return (b / 1048576).toFixed(1) + ' MB';
    }

    /* ---- Samples ---- */
    function initSamples() {
        const list = q('#sampleList');
        if (!list) return;

        SAMPLE_RESUMES.forEach(s => {
            const el = document.createElement('div');
            el.className = 'samp';
            el.dataset.id = s.id;
            el.innerHTML = `
                <div class="samp-dot" style="background:${s.color}">${s.name[0]}</div>
                <div class="samp-txt"><strong>${s.name}</strong><small>${s.title} · ${s.summary}</small></div>
                <div class="samp-chk">✓</div>
            `;
            el.onclick = () => {
                qa('.samp').forEach(x => x.classList.remove('picked'));
                el.classList.add('picked');
                S.sample = s;
                S.text = s.text;
                checkBtn();
            };
            list.appendChild(el);
        });
    }

    /* ---- Analyze ---- */
    function checkBtn() {
        const btn = q('#analyzeBtn');
        if (!btn) return;
        let ok = false;
        if (S.tab === 'upload' && S.file) ok = true;
        if (S.tab === 'paste' && S.text.trim().length > 15) ok = true;
        if (S.tab === 'sample' && S.sample) ok = true;
        btn.disabled = !ok;
    }

    function initAnalyze() {
        const btn = q('#analyzeBtn');
        if (!btn) return;
        btn.onclick = () => {
            if (!S.text || S.text.trim().length < 10) {
                toast('Please provide resume content first.', 'err');
                return;
            }
            runAnalysis();
        };
    }

    async function runAnalysis() {
        const box = q('#matcherBox');
        const loader = q('#loaderBox');
        const resultsSection = q('#results');

        // Hide matcher, show loader
        box.style.display = 'none';
        loader.style.display = 'block';

        // Reset loader steps
        qa('.ls').forEach(s => { s.classList.remove('active','done'); });

        const steps = ['extract','normalize','match','rank'];
        const titles = [
            ['Analyzing your resume...','Extracting skills and experience'],
            ['Processing data...','Normalizing and grouping skills'],
            ['Finding matches...','Comparing against jobs and companies'],
            ['Almost done...','Ranking results and building evidence']
        ];

        try {
            // Animate through steps
            for (let i = 0; i < steps.length; i++) {
                q('#loaderH').textContent = titles[i][0];
                q('#loaderP').textContent = titles[i][1];

                // Mark previous as done
                for (let j = 0; j < i; j++) {
                    const el = q(`.ls[data-s="${steps[j]}"]`);
                    if (el) { el.classList.remove('active'); el.classList.add('done'); }
                }
                // Current = active
                const cur = q(`.ls[data-s="${steps[i]}"]`);
                if (cur) cur.classList.add('active');

                await wait(500 + Math.random() * 300);
            }

            // Mark last done
            const last = q(`.ls[data-s="rank"]`);
            if (last) { last.classList.remove('active'); last.classList.add('done'); }

            await wait(250);

            // Run engine
            const result = E.analyze(S.text);
            S.results = result;

            if (result.error) {
                toast(result.error, 'err');
                loader.style.display = 'none';
                box.style.display = '';
                return;
            }

            if (result.matches.length === 0) {
                toast('No strong matches found. Try adding more details to the resume.', 'inf');
            }

            // Show results
            loader.style.display = 'none';
            renderResults(result);
            resultsSection.style.display = 'block';
            setTimeout(() => resultsSection.scrollIntoView({ behavior:'smooth', block:'start' }), 80);
            toast('Analysis complete! See your career matches below.', 'ok');

        } catch (err) {
            console.error('Analysis failed:', err);
            toast('Something went wrong. Please try again.', 'err');
            loader.style.display = 'none';
            box.style.display = '';
        }
    }

    /* ---- Render Results ---- */
    function renderResults(r) {
        try {
            // Candidate card
            const name = r.candidate.name || 'Candidate';
            q('#candName').textContent = name;
            q('#candTitle').textContent = r.candidate.title || r.experience.level + ' · ' + r.experience.years + ' yrs experience';
            q('#candAvatar').textContent = r.candidate.initials || '?';

            // Score ring
            const score = r.overallScore || 0;
            const circ = 2 * Math.PI * 52; // r=52
            const off = circ - (score / 100) * circ;
            setTimeout(() => {
                const ring = q('#ringFill');
                if (ring) ring.style.strokeDashoffset = off;
                animNum(q('#ringNum'), 0, score, 1200);
            }, 200);

            // Skills
            const sklBox = q('#candSkills');
            sklBox.innerHTML = '';
            const topHits = new Set();
            if (r.matches.length > 0) {
                (r.matches[0].hitReq || []).forEach(s => topHits.add(s));
                (r.matches[0].hitPref || []).forEach(s => topHits.add(s));
            }
            (r.skills || []).forEach(s => {
                const tag = document.createElement('span');
                tag.className = 'sk' + (topHits.has(s) ? ' hit' : '');
                tag.textContent = E.skillName(s);
                sklBox.appendChild(tag);
            });

            // Job cards
            const grid = q('#jobsGrid');
            grid.innerHTML = '';

            (r.matches || []).forEach(m => {
                const card = document.createElement('div');
                card.className = 'job-card';
                const sc = m.score >= 65 ? 'hi' : m.score >= 40 ? 'mid' : 'lo';
                const skillSet = new Set(r.skills);
                const allSk = [...(m.requiredSkills||[]),...(m.preferredSkills||[])];
                const companyObjs = E.getCompanies(m);

                card.innerHTML = `
                    <div class="jc-top">
                        <span class="jc-rank">#${m.rank}</span>
                        <span class="jc-score ${sc}">${m.score}%</span>
                    </div>
                    <div class="jc-title">${m.title}</div>
                    <div class="jc-meta">
                        <span>📊 ${m.level}</span>
                        <span>💰 ${m.salary}</span>
                        <span>📍 ${m.location}</span>
                    </div>
                    <div class="jc-skills">
                        ${allSk.slice(0,7).map(s => `<span class="jc-sk${skillSet.has(s)?' yes':''}">${skillSet.has(s)?'✓ ':''}${E.skillName(s)}</span>`).join('')}
                    </div>
                    <div class="jc-companies">
                        ${companyObjs.slice(0,4).map(c => `<span class="jc-company" title="Apply at ${c.name}">🏢 ${c.name}</span>`).join('')}
                        ${companyObjs.length > 4 ? `<span class="jc-company">+${companyObjs.length-4} more</span>` : ''}
                    </div>
                    <div class="jc-foot">
                        <span class="jc-ev">${(m.evidence||[]).length} evidence points · ${companyObjs.length} companies</span>
                        <span class="jc-cta">Details →</span>
                    </div>
                `;

                card.onclick = () => showEvidence(m, r);
                grid.appendChild(card);
            });

            // Results subtitle
            if (r.matches.length > 0) {
                const top = r.matches[0];
                const topComps = E.getCompanies(top);
                q('#resultsSub').textContent = `Best match: "${top.title}" at ${top.score}% fit. You can apply at ${topComps.length} companies including ${topComps.slice(0,3).map(c=>c.name).join(', ')}.`;
            }

        } catch (err) {
            console.error('Render error:', err);
            toast('Error displaying results. Try a different resume.', 'err');
        }
    }

    /* ---- Evidence Panel ---- */
    function showEvidence(match, result) {
        const panel = q('#evidencePanel');
        const body = q('#evBody');

        q('#evTitle').textContent = 'Evidence: ' + match.title;
        body.innerHTML = '';

        // Evidence items
        (match.evidence || []).forEach(ev => {
            const icon = ev.type === 'match' ? '✓' : ev.type === 'partial' ? '◐' : '✗';
            const div = document.createElement('div');
            div.className = 'ev-row';
            div.innerHTML = `
                <div class="ev-ico ${ev.type}">${icon}</div>
                <div class="ev-detail">
                    <h4>${ev.title}</h4>
                    <p>${ev.detail}</p>
                    <p class="ev-src">Source: ${ev.src}</p>
                </div>
            `;
            body.appendChild(div);
        });

        // Companies to apply at
        const comps = E.getCompanies(match);
        if (comps.length > 0) {
            const compDiv = document.createElement('div');
            compDiv.className = 'ev-row';
            compDiv.innerHTML = `
                <div class="ev-ico company">🏢</div>
                <div class="ev-detail">
                    <h4>Where to Apply — ${comps.length} Companies Hiring</h4>
                    <p>Click any company below to visit their careers page and search for "${match.title}" positions:</p>
                    <div class="ev-companies">
                        ${comps.map(c => `
                            <a href="${c.url}" target="_blank" rel="noopener" class="ev-company-link" title="Apply at ${c.name}">
                                <span class="ecl-logo" style="color:${c.color};border:1px solid ${c.color}30">${c.letter}</span>
                                ${c.name} ↗
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
            body.appendChild(compDiv);
        }

        panel.style.display = 'block';
        panel.scrollIntoView({ behavior:'smooth', block:'nearest' });

        q('#evClose').onclick = () => { panel.style.display = 'none'; };
    }

    /* ---- Result Actions ---- */
    function initResultBtns() {
        const newBtn = q('#btnNewAnalysis');
        const expBtn = q('#btnExport');

        if (newBtn) newBtn.onclick = () => {
            S.results = null; S.file = null; S.sample = null; S.text = '';
            q('#results').style.display = 'none';
            q('#loaderBox').style.display = 'none';
            q('#evidencePanel').style.display = 'none';
            const box = q('#matcherBox');
            box.style.display = '';
            // Reset file
            const fi = q('#fileInput');
            if (fi) fi.value = '';
            const badge = q('#fileBadge');
            if (badge) badge.style.display = 'none';
            const dz = q('#dropzone');
            if (dz) dz.style.display = '';
            const ta = q('#resumeText');
            if (ta) ta.value = '';
            qa('.samp').forEach(s => s.classList.remove('picked'));
            // Reset loader
            qa('.ls').forEach(s => { s.classList.remove('active','done'); });
            const firstStep = q('.ls[data-s="extract"]');
            if (firstStep) firstStep.classList.add('active');
            checkBtn();
            q('#matcher').scrollIntoView({ behavior:'smooth' });
        };

        if (expBtn) expBtn.onclick = () => {
            if (!S.results) return;
            exportReport(S.results);
        };
    }

    function exportReport(r) {
        let txt = 'RESUMATCH — CAREER MATCH REPORT\n';
        txt += '='.repeat(50) + '\n';
        txt += 'Generated: ' + new Date().toLocaleString() + '\n\n';
        txt += 'CANDIDATE: ' + (r.candidate.name || 'N/A') + '\n';
        txt += 'TITLE: ' + (r.candidate.title || 'N/A') + '\n';
        txt += 'EXPERIENCE: ' + r.experience.years + ' years (' + r.experience.level + ')\n';
        txt += 'OVERALL FIT: ' + r.overallScore + '%\n\n';
        txt += 'SKILLS: ' + r.skills.map(s => E.skillName(s)).join(', ') + '\n\n';
        txt += '='.repeat(50) + '\n';
        txt += 'TOP JOB MATCHES\n';
        txt += '='.repeat(50) + '\n\n';

        r.matches.forEach(m => {
            const comps = E.getCompanies(m);
            txt += `#${m.rank} — ${m.title} (${m.score}% match)\n`;
            txt += `   Level: ${m.level} | Salary: ${m.salary}\n`;
            txt += `   Location: ${m.location}\n`;
            txt += `   Matched: ${(m.hitReq||[]).concat(m.hitPref||[]).map(s => E.skillName(s)).join(', ')}\n`;
            txt += `   Gaps: ${(m.missReq||[]).map(s => E.skillName(s)).join(', ') || 'None'}\n`;
            txt += `   Companies: ${comps.map(c => c.name + ' (' + c.url + ')').join(', ')}\n\n`;
        });

        txt += '\nNote: This is a first-pass assessment. Final hiring decisions\nshould involve human review and equitable evaluation.\n';

        const blob = new Blob([txt], { type:'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ResuMatch-Report-' + (r.candidate.name || 'Report').replace(/\s+/g,'-') + '.txt';
        a.click();
        URL.revokeObjectURL(url);
        toast('Report downloaded!', 'ok');
    }

    /* ---- Scroll Animations ---- */
    function initScrollAnims() {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        qa('.anim-in,.anim-up').forEach(el => obs.observe(el));
    }

    /* ---- Counters ---- */
    function initCounters() {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const el = e.target;
                    const n = parseInt(el.dataset.count);
                    if (!isNaN(n)) animNum(el, 0, n, 1800);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        qa('[data-count]').forEach(el => obs.observe(el));
    }

    function animNum(el, from, to, dur) {
        if (!el) return;
        const start = performance.now();
        function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(from + (to - from) * eased).toLocaleString();
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    /* ---- Smooth Scroll ---- */
    function initSmoothScroll() {
        qa('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                const id = a.getAttribute('href').slice(1);
                const el = document.getElementById(id);
                if (el) {
                    const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top, behavior:'smooth' });
                }
            });
        });
    }

    /* ---- Toast ---- */
    function toast(msg, type) {
        const box = q('#toastBox');
        if (!box) return;
        const icons = { ok:'✓', err:'✗', inf:'ℹ' };
        const t = document.createElement('div');
        t.className = 'toast ' + (type || 'inf');
        t.innerHTML = `<span>${icons[type]||'ℹ'}</span><span class="toast-msg">${msg}</span><button class="toast-x">✕</button>`;
        t.querySelector('.toast-x').onclick = () => fade(t);
        box.appendChild(t);
        setTimeout(() => fade(t), 5000);
    }

    function fade(el) {
        if (!el || !el.parentNode) return;
        el.style.opacity = '0';
        el.style.transform = 'translateX(80px)';
        el.style.transition = 'all .3s';
        setTimeout(() => { if (el.parentNode) el.remove(); }, 300);
    }

    /* ---- Utility ---- */
    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

    /* ---- Boot ---- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
