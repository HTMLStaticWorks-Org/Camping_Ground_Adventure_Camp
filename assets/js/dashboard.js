document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Tab Switching
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Show corresponding section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Close mobile sidebar if open
            const sidebar = document.querySelector('.dashboard-sidebar');
            if (sidebar && window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Handle hash links from within pages (e.g. clicking "Complete Booking Check-In" button)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (hash) {
            const targetLink = document.querySelector(`.dashboard-nav a[href="${hash}"]`);
            if (targetLink) {
                targetLink.click();
            }
        }
    });

    // If page is loaded with a hash, click that tab
    if (window.location.hash) {
        const targetLink = document.querySelector(`.dashboard-nav a[href="${window.location.hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
});

// 2. Interactive Tent & Activity Booking / Safety Configurator
const quizzes = {
    tent: {
        title: "Alpine Ridge Tent Booking",
        reviewer: "Sarah Jenkins, WFR",
        topicKey: "gs",
        questions: [
            {
                q: "Where must all food and scented camp items be stored overnight at Pinewood Campsite?",
                o: ["Inside the steel bear-proof locker provided at your pitch", "Inside your backpack near the campfire", "Underneath the wooden tent deck", "Hanging from a low tent pole"],
                a: 0,
                r: "All food and scented items must be locked inside the steel bear-proof locker at your tent pitch."
            },
            {
                q: "What is the required protocol before leaving your campfire pit unattended or going to sleep?",
                o: ["Let the embers burn down on their own", "Cover the fire with dry pine needles", "Douse thoroughly with water, stir the ashes, and verify it is cold to the touch", "Move the firewood closer to the tent"],
                a: 2,
                r: "Always douse campfires with water, stir the embers, and ensure ashes are completely cold before leaving."
            },
            {
                q: "Which tent configuration and bedding setup do you confirm for Alpine Ridge Pitch #4?",
                o: ["4-Season Canvas Tent with Queen Memory-Foam Cot", "4-Season Canvas Tent with Twin Expedition Cots & Sub-Zero Bags", "Open Bivy Tarp Only", "Hammock Rigging Only"],
                a: 1,
                r: "Twin Expedition Cots & Sub-Zero Sleeping Bags are pre-staged for high-elevation comfort."
            },
            {
                q: "Under Leave-No-Trace wilderness rules, how should greywater and camp dishwashing be handled?",
                o: ["In the mountain creek", "At least 200 feet away from natural streams or at Basecamp wash stations", "Directly inside the fire ring", "On the main hiking trail"],
                a: 1,
                r: "Camp wash water must be disposed of at designated Basecamp stations or 200+ feet from any water source."
            }
        ]
    },
    kayak: {
        title: "Kayak & Zipline Activity Slot",
        reviewer: "David Chen, ACA",
        topicKey: "quant",
        questions: [
            {
                q: "Which Personal Flotation Device (PFD) and helmet standard is mandatory on Class III whitewater?",
                o: ["Type III/V Coast Guard Approved PFD & Whitewater Helmet fastened at all times", "Inflatable pool vest only", "No helmet needed in calm eddies", "Waist belt pack only"],
                a: 0,
                r: "A fastened Type III/V PFD and impact-rated whitewater helmet are mandatory throughout the river run."
            },
            {
                q: "If your kayak capsizes in swiftwater and you exit the boat, what is the safest defensive swimming position?",
                o: ["On your back, feet-first downstream and held up to avoid rocks", "Standing up immediately in fast current", "Swimming head-first against the rapids", "Tying the paddle rope around your wrist"],
                a: 0,
                r: "Float on your back with feet pointed downstream at the surface to fend off boulders until reaching an eddy."
            },
            {
                q: "Before stepping off the Canyon Canopy Zipline platform, what must be verified?",
                o: ["Dual-carabiner harness check & verbal 'Clear' signal from your Guide", "Taking off your gloves", "Loosening the chest strap for comfort", "Jumping before the trolley is clipped"],
                a: 0,
                r: "Never depart a platform until the guide completes a dual-point harness check and calls 'Track Clear'."
            },
            {
                q: "How do you regulate speed when approaching a Canyon Zipline landing deck?",
                o: ["Follow the guide's hand signals and place your leather-gloved hand behind the trolley on the cable", "Grab the bare steel cable in front of the pulley", "Unsnap your lanyard mid-span", "Swing sideways into the trees"],
                a: 0,
                r: "Always brake only behind the trolley using your reinforced leather braking glove as signaled by the guide."
            }
        ]
    },
    glamping: {
        title: "Starlight Glamping & Night Trek",
        reviewer: "David Chen, ACA",
        topicKey: "chem",
        questions: [
            {
                q: "Why are red-light headlamps used during the Starlight Astronomy & Night Trek?",
                o: ["To preserve natural night vision and avoid disturbing nocturnal wildlife", "Because red light reaches 5 miles farther", "To heat up the trail", "To signal emergency helicopters"],
                a: 0,
                r: "Red LED light preserves human rhodopsin (night vision) and prevents disorienting nocturnal forest wildlife."
            },
            {
                q: "When operating the wood-burning stove inside your Starlight Geodesic Dome, which safety check is required?",
                o: ["Close the flue damper completely while logs are roaring", "Keep the spark screen latched and verify the CO detector is active", "Stack extra firewood against the stove pipe", "Use gasoline to start the kindling"],
                a: 1,
                r: "Always keep the stove spark screen latched and ensure the dome's carbon monoxide sensor indicator is green."
            },
            {
                q: "Which clothing system is required for the 9:30 PM Alpine Ridge Astronomy Walk?",
                o: ["Moisture-wicking base layer, fleece mid-layer, and windproof outer shell", "Cotton t-shirt and sandals", "Wet swimwear from the river", "Denim jeans without a jacket"],
                a: 0,
                r: "Three-layer thermal insulation prevents rapid wind-chill cooling on exposed high-altitude observation ridges."
            },
            {
                q: "If you encounter wildlife such as elk or black bear along the evening trail, what is the proper response?",
                o: ["Approach closely for a flash photo", "Stay calm, group together with your Ranger, make your presence known, and give the animal wide space", "Run downhill as fast as possible", "Toss trail mix to distract it"],
                a: 1,
                r: "Never run or feed wildlife; stay grouped with your Ranger and maintain a respectful safety buffer."
            }
        ]
    }
};

let currentQuizKey = null;
let currentQuiz = null;
let currentQuestionIdx = 0;
let score = 0;

function startBookingFlow(quizKey) {
    currentQuizKey = quizKey;
    currentQuiz = quizzes[quizKey];
    currentQuestionIdx = 0;
    score = 0;

    document.getElementById('quizSelection').style.display = 'none';
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';

    renderQuestion();
}

function renderQuestion() {
    const qData = currentQuiz.questions[currentQuestionIdx];
    document.getElementById('questionTimer').innerText = `Step ${currentQuestionIdx + 1} of ${currentQuiz.questions.length}`;
    document.getElementById('quizTitle').innerText = currentQuiz.title;
    document.getElementById('quizQuestion').innerText = qData.q;

    const optionsDiv = document.getElementById('quizOptions');
    optionsDiv.innerHTML = '';

    qData.o.forEach((opt, idx) => {
        const optionLabel = document.createElement('label');
        optionLabel.style.display = 'flex';
        optionLabel.style.alignItems = 'center';
        optionLabel.style.gap = '12px';
        optionLabel.style.padding = '16px';
        optionLabel.style.border = '1px solid var(--border-color)';
        optionLabel.style.borderRadius = '12px';
        optionLabel.style.cursor = 'pointer';
        optionLabel.style.background = 'var(--card-bg)';
        optionLabel.style.fontWeight = '400';
        optionLabel.style.transition = 'var(--transition)';

        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'quizOption';
        radioInput.value = idx;
        radioInput.style.accentColor = 'var(--primary-accent)';

        optionLabel.appendChild(radioInput);
        optionLabel.appendChild(document.createTextNode(opt));

        // Add visual hover and selection classes
        optionLabel.addEventListener('click', () => {
            document.querySelectorAll('#quizOptions label').forEach(l => {
                l.style.borderColor = 'var(--border-color)';
                l.style.background = 'var(--card-bg)';
            });
            optionLabel.style.borderColor = 'var(--primary-accent)';
            optionLabel.style.background = 'rgba(27, 67, 50, 0.04)';
            radioInput.checked = true;
        });

        optionsDiv.appendChild(optionLabel);
    });

    const nextBtn = document.getElementById('nextQuestionBtn');
    if (currentQuestionIdx === currentQuiz.questions.length - 1) {
        nextBtn.innerText = "Complete Booking";
    } else {
        nextBtn.innerText = "Confirm Step";
    }
}

function submitAnswer() {
    const selectedInput = document.querySelector('input[name="quizOption"]:checked');
    if (!selectedInput) {
        alert("Please select an option before proceeding.");
        return;
    }

    const answerIdx = parseInt(selectedInput.value);
    const qData = currentQuiz.questions[currentQuestionIdx];

    if (answerIdx === qData.a) {
        score++;
    }

    currentQuestionIdx++;

    if (currentQuestionIdx < currentQuiz.questions.length) {
        renderQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const finalScorePercent = Math.round((score / currentQuiz.questions.length) * 100);
    document.getElementById('quizContainer').style.display = 'none';
    
    const quizResultDiv = document.getElementById('quizResult');
    quizResultDiv.style.display = 'block';

    const scoreText = document.getElementById('quizScoreText');
    scoreText.innerText = `Readiness: ${finalScorePercent}%`;

    const feedbackText = document.getElementById('quizFeedbackText');
    let feedback = "";
    let statusStr = "Confirmed";
    let statusClass = "var(--support-accent)";
    
    if (finalScorePercent >= 75) {
        feedback = "All wilderness safety checks and gear preferences verified! Your reservation is locked in.";
    } else if (finalScorePercent >= 50) {
        feedback = "Booking registered! Please review the trail safety guidelines with your Ranger at check-in.";
    } else {
        feedback = "Action Needed. Please review our Leave-No-Trace & Camp Safety guide before check-in.";
        statusStr = "Action Needed";
        statusClass = "#F59E0B";
    }
    feedbackText.innerText = feedback;

    // 3. Write record into Logs Table
    const tableBody = document.getElementById('quizLogsTableBody');
    if (tableBody) {
        const newRow = document.createElement('tr');
        newRow.style.borderBottom = '1px solid var(--border-color)';

        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeStr = `${hours}:${minutes} ${ampm}`;

        newRow.innerHTML = `
            <td style="padding: 16px;"><div style="font-weight: 500;">Just Now</div><div style="color: var(--text-secondary); font-size: 13px;">${timeStr}</div></td>
            <td style="padding: 16px;">${currentQuiz.reviewer}</td>
            <td style="padding: 16px;"><span style="background: rgba(27, 67, 50, 0.08); color: var(--primary-accent); padding: 4px 8px; border-radius: 4px; font-size: 13px;">Ready: ${finalScorePercent}%</span></td>
            <td style="padding: 16px; color: var(--text-secondary); font-size: 14px; max-width: 300px;">Updated ${currentQuiz.title}. ${feedback}</td>
            <td style="padding: 16px;"><span style="color: ${statusClass}; font-weight: 500;">${statusStr}</span></td>
        `;
        
        // Insert at top of table logs
        tableBody.insertBefore(newRow, tableBody.firstChild);
    }

    // 4. Update Adventure Readiness Metrics in Reports
    if (currentQuizKey === 'glamping' && finalScorePercent >= 75) {
        // Starlight Glamping & Night Trek was our pending alert. If the guest completes it, update UI!
        const chemAcc = document.getElementById('accuracyChem');
        const chemBar = document.getElementById('progressBarChem');
        const alertCard = document.getElementById('weakAreaAlertCard');
        const alertText = document.getElementById('weakAreaAlertText');

        if (chemAcc && chemBar) {
            chemAcc.innerText = `${finalScorePercent}%`;
            chemAcc.style.color = 'var(--secondary-accent)';
            chemBar.style.width = `${finalScorePercent}%`;
            chemBar.style.background = 'var(--secondary-accent)';
        }

        if (alertCard && alertText) {
            alertCard.style.background = 'rgba(5, 150, 105, 0.05)';
            alertCard.style.borderColor = 'rgba(5, 150, 105, 0.2)';
            alertCard.innerHTML = `
                <div style="width: 48px; height: 48px; background: rgba(16, 185, 129, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #10B981; margin-bottom: 20px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 style="color: #065F46; font-size: 20px; margin-bottom: 12px;">All Camp Gear &amp; Bookings Ready!</h3>
                <p style="color: #047857; font-size: 15px; line-height: 1.6; margin: 0;">Awesome! Your Starlight Glamping &amp; Night Trek check-in is at ${finalScorePercent}% readiness. Your red-light headlamps and dome stove briefing are confirmed!</p>
            `;
        }

        // Update overall readiness status
        const rank = document.getElementById('percentileRankText');
        if (rank) {
            rank.innerText = "100% Trail Ready";
        }
    } else {
        // Update general charts
        const key = currentQuiz.topicKey;
        if (key === 'gs') {
            const el = document.getElementById('accuracyGS');
            const bar = document.getElementById('progressBarGS');
            if (el && bar) {
                el.innerText = `${finalScorePercent}%`;
                bar.style.width = `${finalScorePercent}%`;
            }
        } else if (key === 'quant') {
            const el = document.getElementById('accuracyQuant');
            const bar = document.getElementById('progressBarQuant');
            if (el && bar) {
                el.innerText = `${finalScorePercent}%`;
                bar.style.width = `${finalScorePercent}%`;
            }
        }
    }
}

function exitQuiz() {
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('quizSelection').style.display = 'grid';
}

function resetQuizInterface() {
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizSelection').style.display = 'grid';
}

// 5. Download simulation
function triggerDownload(resourceName) {
    alert(`Success: Preparing "${resourceName}.pdf" for download. Your offline trail guide download has been started!`);
}
