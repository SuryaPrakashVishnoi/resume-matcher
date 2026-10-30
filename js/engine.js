/* ==============================================
   RESUMATCH v2 — MATCHING ENGINE
   Robust parsing, scoring, evidence generation
   Fixed: handles all resume formats without crashing
   ============================================== */

class ResumeMatchEngine {
    constructor() {
        this.taxonomy = SKILL_TAXONOMY;
        this.jobs = JOB_DATABASE;
        this.companies = COMPANIES;
    }

    /** Main: analyze resume → structured results */
    analyze(resumeText) {
        try {
            const text = (resumeText || '').trim();
            if (text.length < 10) {
                return this._emptyResult('Please provide more resume content.');
            }

            const candidate = this._extractCandidate(text);
            const skills = this._extractSkills(text);
            const experience = this._extractExperience(text);

            const matches = this._matchJobs(skills, experience);
            const overallScore = this._overallScore(matches);

            // Generate evidence for each match
            matches.forEach(m => {
                m.evidence = this._buildEvidence(skills, experience, m);
            });

            return {
                candidate,
                skills,
                experience,
                matches,
                overallScore,
                error: null
            };
        } catch (err) {
            console.error('Engine error:', err);
            return this._emptyResult('Analysis encountered an issue. Try pasting text directly.');
        }
    }

    _emptyResult(msg) {
        return {
            candidate: { name: 'Candidate', title: 'Professional', initials: '?' },
            skills: [],
            experience: { years: 0, level: 'Entry-Level' },
            matches: [],
            overallScore: 0,
            error: msg
        };
    }

    /* ============ CANDIDATE EXTRACTION ============ */
    _extractCandidate(text) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        const info = { name: 'Candidate', title: '', initials: '?' };

        // Find name: first line that looks like a name
        for (let i = 0; i < Math.min(lines.length, 5); i++) {
            const line = lines[i];
            if (line.length > 60) continue;
            if (/@/.test(line)) continue;
            if (/^(PROFESSIONAL|SUMMARY|EXPERIENCE|EDUCATION|SKILLS|OBJECTIVE|RESUME|CURRICULUM|CAREER|CONTACT)/i.test(line)) continue;
            if (/^\d{10}/.test(line)) continue; // phone number line
            if (/^(http|www\.)/.test(line)) continue;

            // Looks like a name
            const cleaned = line.replace(/^(Name|NAME)\s*[:|\-–]\s*/i, '').trim();
            if (cleaned.length >= 2 && cleaned.length <= 50) {
                info.name = cleaned;
                break;
            }
        }

        // Find title from lines near the name
        const titlePatterns = [
            /(?:software|web|frontend|front-end|backend|back-end|full[- ]?stack)\s*(?:developer|engineer)/i,
            /data\s*(?:scientist|analyst|engineer)/i,
            /(?:devops|cloud|ml|machine learning|ai)\s*(?:engineer|architect)/i,
            /(?:ui|ux|ui\/ux|product)\s*(?:designer|manager)/i,
            /(?:project|program|technical)\s*(?:manager|lead)/i,
            /(?:system|network|security|qa|test)\s*(?:administrator|engineer|analyst|lead)/i,
            /(?:senior|junior|lead|principal|staff)\s*(?:developer|engineer|analyst|designer)/i,
            /(?:intern|trainee|fresher|graduate)/i
        ];

        for (let i = 0; i < Math.min(lines.length, 8); i++) {
            for (const pat of titlePatterns) {
                const match = lines[i].match(pat);
                if (match) {
                    info.title = match[0];
                    break;
                }
            }
            if (info.title) break;
        }

        // Generate initials
        const words = info.name.split(/\s+/).filter(w => w.length > 0);
        if (words.length >= 2) {
            info.initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
        } else if (words.length === 1 && words[0].length > 0) {
            info.initials = words[0][0].toUpperCase();
        }

        return info;
    }

    /* ============ SKILL EXTRACTION ============ */
    _extractSkills(text) {
        const lower = text.toLowerCase();
        const found = [];

        for (const [canonical, aliases] of Object.entries(this.taxonomy)) {
            let matched = false;
            for (const alias of aliases) {
                try {
                    // Escape regex special chars
                    const esc = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    // More lenient matching — allow common separators
                    const re = new RegExp('(?:^|[\\s,;:|/()\\[\\]•·\\-–—\\t])' + esc + '(?:[\\s,;:|/()\\[\\]•·\\-–—\\t.]|$)', 'i');
                    if (re.test(lower)) {
                        matched = true;
                        break;
                    }
                } catch (e) {
                    // If regex fails, try simple includes
                    if (lower.includes(alias.toLowerCase())) {
                        matched = true;
                        break;
                    }
                }
            }
            if (matched) {
                found.push(canonical);
            }
        }

        return found;
    }

    /* ============ EXPERIENCE EXTRACTION ============ */
    _extractExperience(text) {
        let years = 0;

        // Pattern 1: "X years of experience"
        const yrPat = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp|professional)?/gi);
        if (yrPat) {
            yrPat.forEach(m => {
                const n = parseInt(m.match(/\d+/)[0]);
                if (n > years && n < 40) years = n;
            });
        }

        // Pattern 2: date ranges "Month Year – Month Year / Present"
        const months = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
        const drPat = new RegExp('(?:' + months + ')\\s+(\\d{4})\\s*[–—\\-]\\s*(?:(?:' + months + ')\\s+(\\d{4})|Present|Current|Now|Ongoing)', 'gi');
        let dm;
        let earliestStart = 9999, latestEnd = 0;
        while ((dm = drPat.exec(text)) !== null) {
            const s = parseInt(dm[1]);
            const e = dm[2] ? parseInt(dm[2]) : new Date().getFullYear();
            if (s > 1990 && s < 2030 && e >= s) {
                earliestStart = Math.min(earliestStart, s);
                latestEnd = Math.max(latestEnd, e);
            }
        }
        if (latestEnd > earliestStart) {
            years = Math.max(years, latestEnd - earliestStart);
        }

        // Pattern 3: "(X years)" or "(X months)"
        const parenYr = text.match(/\((\d+)\s*years?\)/gi);
        if (parenYr) {
            let total = 0;
            parenYr.forEach(m => {
                const n = parseInt(m.match(/\d+/)[0]);
                if (n < 20) total += n;
            });
            years = Math.max(years, total);
        }
        const parenMo = text.match(/\((\d+)\s*months?\)/gi);
        if (parenMo) {
            let totalMo = 0;
            parenMo.forEach(m => {
                const n = parseInt(m.match(/\d+/)[0]);
                if (n < 120) totalMo += n;
            });
            years = Math.max(years, Math.round(totalMo / 12));
        }

        // Fallback: graduation year
        if (years === 0) {
            const gradYears = text.match(/\b(20\d{2})\b/g);
            if (gradYears) {
                const nums = gradYears.map(Number).filter(n => n >= 2010 && n <= 2026);
                if (nums.length > 0) {
                    const oldest = Math.min(...nums);
                    const est = new Date().getFullYear() - oldest;
                    if (est >= 0 && est < 20) years = est;
                }
            }
        }

        const level = years >= 7 ? 'Senior' : years >= 2 ? 'Mid-Level' : 'Entry-Level';
        return { years, level };
    }

    /* ============ JOB MATCHING ============ */
    _matchJobs(skills, experience) {
        const skillSet = new Set(skills);

        const scored = this.jobs.map(job => {
            // Required skills (65% weight)
            const hitReq = job.requiredSkills.filter(s => skillSet.has(s));
            const missReq = job.requiredSkills.filter(s => !skillSet.has(s));
            const reqRatio = job.requiredSkills.length > 0 ? hitReq.length / job.requiredSkills.length : 0;

            // Preferred skills (20% weight)
            const hitPref = job.preferredSkills.filter(s => skillSet.has(s));
            const missPref = job.preferredSkills.filter(s => !skillSet.has(s));
            const prefRatio = job.preferredSkills.length > 0 ? hitPref.length / job.preferredSkills.length : 0;

            // Experience (15% weight)
            let expScore = 0;
            const y = experience.years;
            if (y >= job.minExp && y <= job.maxExp) {
                expScore = 1;
            } else if (y >= job.minExp - 1 && y <= job.maxExp + 3) {
                expScore = 0.65;
            } else if (y > 0) {
                expScore = 0.25;
            } else {
                expScore = job.minExp === 0 ? 0.8 : 0.1;
            }

            const raw = (reqRatio * 65) + (prefRatio * 20) + (expScore * 15);
            const score = Math.min(Math.round(raw), 99);

            return {
                ...job,
                score,
                hitReq,
                hitPref,
                missReq,
                missPref,
                expScore: Math.round(expScore * 15)
            };
        });

        scored.sort((a, b) => b.score - a.score);
        scored.forEach((m, i) => m.rank = i + 1);

        return scored.slice(0, 8);
    }

    /* ============ OVERALL SCORE ============ */
    _overallScore(matches) {
        if (!matches || matches.length === 0) return 0;
        const top = matches.slice(0, 3);
        const w = [0.5, 0.3, 0.2];
        let sum = 0;
        top.forEach((m, i) => sum += m.score * (w[i] || 0));
        return Math.round(sum);
    }

    /* ============ EVIDENCE ============ */
    _buildEvidence(skills, experience, match) {
        const ev = [];

        // Matched required
        (match.hitReq || []).forEach(s => {
            ev.push({
                type: 'match',
                title: `${this.skillName(s)} — Required ✓`,
                detail: `Resume shows evidence of ${this.skillName(s)}, a required skill for this role.`,
                src: 'Skills / work experience'
            });
        });

        // Matched preferred
        (match.hitPref || []).forEach(s => {
            ev.push({
                type: 'match',
                title: `${this.skillName(s)} — Preferred ✓`,
                detail: `${this.skillName(s)} is a preferred qualification and was found in the resume.`,
                src: 'Skills section'
            });
        });

        // Missing required
        (match.missReq || []).forEach(s => {
            ev.push({
                type: 'missing',
                title: `${this.skillName(s)} — Required but missing`,
                detail: `This role requires ${this.skillName(s)}, but no clear evidence was found. It may be described differently or be a skill gap.`,
                src: 'Needs review'
            });
        });

        // Missing preferred (top 3 only)
        (match.missPref || []).slice(0, 3).forEach(s => {
            ev.push({
                type: 'partial',
                title: `${this.skillName(s)} — Nice-to-have`,
                detail: `${this.skillName(s)} would strengthen the application but isn't required.`,
                src: 'Optional'
            });
        });

        // Experience
        const y = experience.years;
        if (y >= match.minExp && y <= match.maxExp) {
            ev.push({
                type: 'match',
                title: `${y} years experience — Meets requirement ✓`,
                detail: `Role needs ${match.minExp}–${match.maxExp} years. Candidate has ${y}.`,
                src: 'Work history'
            });
        } else {
            ev.push({
                type: y > 0 ? 'partial' : 'missing',
                title: `${y} years — ${y < match.minExp ? 'Below' : 'Above'} range`,
                detail: `Role suggests ${match.minExp}–${match.maxExp} years. Candidate has ${y}.`,
                src: 'Work history'
            });
        }

        return ev;
    }

    /* ============ UTILS ============ */
    skillName(key) {
        const map = {
            python:'Python',javascript:'JavaScript',typescript:'TypeScript',java:'Java',
            csharp:'C#/.NET',cpp:'C++',c_lang:'C',ruby:'Ruby',go:'Go',rust:'Rust',
            swift:'Swift',kotlin:'Kotlin',php:'PHP',r_lang:'R',scala:'Scala',dart:'Dart/Flutter',
            html:'HTML5',css:'CSS/SCSS',react:'React',angular:'Angular',vue:'Vue.js',
            nextjs:'Next.js',nodejs:'Node.js',django:'Django',flask:'Flask/FastAPI',
            spring:'Spring Boot',rails:'Ruby on Rails',
            sql:'SQL/RDBMS',mongodb:'MongoDB',redis:'Redis',
            elasticsearch:'Elasticsearch',dynamodb:'DynamoDB',firebase:'Firebase',
            aws:'AWS',azure:'Azure',gcp:'Google Cloud',docker:'Docker',
            kubernetes:'Kubernetes',cicd:'CI/CD',terraform:'Terraform/IaC',
            linux:'Linux',git:'Git',
            machine_learning:'Machine Learning',data_science:'Data Science',
            nlp:'NLP',computer_vision:'Computer Vision',tensorflow:'TensorFlow',
            pytorch:'PyTorch',pandas:'Pandas/NumPy',spark:'Apache Spark',
            tableau:'Tableau/Power BI',statistics:'Statistics',
            project_management:'Project Management',leadership:'Leadership',
            communication:'Communication',problem_solving:'Problem Solving',
            cybersecurity:'Cybersecurity',network_security:'Network Security',
            ui_ux:'UI/UX Design',graphic_design:'Graphic Design',
            testing:'Testing/QA',api:'APIs/Microservices',mobile:'Mobile Development'
        };
        return map[key] || key.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase());
    }

    /** Get company info objects for a job */
    getCompanies(job) {
        if (!job.companies) return [];
        return job.companies
            .map(id => this.companies[id])
            .filter(Boolean);
    }
}

if(typeof window!=='undefined'){
    window.ResumeMatchEngine = ResumeMatchEngine;
}
