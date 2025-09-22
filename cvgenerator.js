// Firebase SDK-ni import qilish
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// HTML-ni to'liq yuklagandan so'ng kodni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {

    // 1. Firebase sozlamalari
    const firebaseConfig = {
        apiKey: "AIzaSyA86zhSVi4FSw-GvFBdOZsCPaHMS67XA78",
        authDomain: "carrer-path-a5810.firebaseapp.com",
        projectId: "carrer-path-a5810",
        storageBucket: "carrer-path-a5810.firebasestorage.app",
        messagingSenderId: "693831778129",
        appId: "1:693831778129:web:911293c5c284eefe295d70"
    };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // 2. UI elementlarini ajratib olish
    const ui = {
        userEmailDisplay: document.getElementById('user-email-display'),
        logoutLink: document.getElementById('logout-link'),
        menuToggle: document.getElementById('menu-toggle'),
        sideNav: document.getElementById('side-nav'),
        mainContent: document.getElementById('main-content-container'),
        profileBtn: document.getElementById('profile-btn'),
        profileDropdown: document.getElementById('profile-dropdown'),
        cvForm: document.getElementById('cv-form'),
        photoInput: document.getElementById('photo'),
        exportPdfBtn: document.getElementById('export-pdf-btn'),
        exportPngBtn: document.getElementById('export-png-btn'),
        colorOptions: document.getElementById('color-options'),
        cvPreview: document.getElementById('cv-preview')
    };

    // CV ma'lumotlarini saqlash uchun global o'zgaruvchilar
    let cvData = {
        photo: '', fullname: '', dob: '', marital: '', nationality: '',
        email: '', phone: '', location: '', linkedin: '',
        skills: '', objective: '', education: '', project: '',
        achievement: '', languages: '', interests: '', activities: '', signature: ''
    };
    let photoDataUrl = '';

    // 3. Foydalanuvchi holatini tekshirish
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (ui.userEmailDisplay) {
                ui.userEmailDisplay.textContent = user.email || 'Foydalanuvchi';
            }
        } else {
            // Agar foydalanuvchi tizimga kirmagan bo'lsa, login sahifasiga yo'naltirish
            window.location.href = "login.html";
        }
    });

    // 4. Tizimdan chiqish funksiyasi
    if (ui.logoutLink) {
        ui.logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                window.location.href = "login.html";
            } catch (err) {
                console.error("Tizimdan chiqishda xatolik yuz berdi:", err);
            }
        });
    }

    // 5. Menyu va profil menyusi toggle logikasi
    if (ui.menuToggle && ui.sideNav && ui.mainContent) {
        ui.menuToggle.addEventListener('click', () => {
            ui.sideNav.classList.toggle('active');
            ui.mainContent.classList.toggle('menu-open');
            ui.menuToggle.classList.toggle('active');
        });
    }

    if (ui.profileBtn && ui.profileDropdown) {
        ui.profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ui.profileDropdown.style.display = ui.profileDropdown.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!ui.profileBtn.contains(e.target)) {
                ui.profileDropdown.style.display = 'none';
            }
        });
    }

    // 6. CV preview'ni yangilash funksiyasi
    function updateCVPreview() {
        // Ma'lumotlarni HTMLdan o'qib olish
        for (let key in cvData) {
            const inputElement = document.getElementById('input-' + key);
            if (inputElement) {
                cvData[key] = inputElement.value || '';
            }
        }

        // Yangi qatorlarni <br> tegi bilan almashtirish
        const formatText = (text) => text.replace(/\n/g, '<br>');

        const skills = formatText(cvData.skills);
        const education = formatText(cvData.education);
        const project = formatText(cvData.project);
        const achievement = formatText(cvData.achievement);
        const interests = formatText(cvData.interests);
        const activities = formatText(cvData.activities);

        // Profil rasmi uchun HTML yaratish
        const photoTag = photoDataUrl ?
            `<img class="cv-profile-img" src="${photoDataUrl}" alt="Profil rasmi">` :
            `<img class="cv-profile-img" src="./images/profile-placeholder.png" alt="Profil rasmi">`;

        // CV shablonini generatsiya qilish
        ui.cvPreview.innerHTML = `
            <div class="cv-main-container standard-template" id="cv-export-content">
                <div class="cv-left-panel">
                    ${photoTag}
                    <h2 class="cv-detail">Shaxsiy ma'lumotlar</h2>
                    <div class="cv-contact">
                        <p>Tug‘ilgan sana: ${cvData.dob}</p>
                        <p>Oilaviy holat: ${cvData.marital}</p>
                        <p>Millati: ${cvData.nationality}</p>
                    </div>
                    <h2 class="cv-detail">Skills</h2>
                    <div class="cv-skill">${skills}</div>
                    <h2 class="cv-detail">Kontakt</h2>
                    <div class="cv-contact">
                        <p>Email: ${cvData.email}</p>
                        <p>Telefon: ${cvData.phone}</p>
                        <p>Manzil: ${cvData.location}</p>
                        <p>LinkedIn: <a href="${cvData.linkedin}" target="_blank" style="color: #fff; text-decoration: underline;">Profil</a></p>
                    </div>
                </div>
                <div class="cv-right-panel">
                    <h1>${cvData.fullname}</h1>
                    <div class="cv-section">
                        <h3>OBJECTIVE</h3>
                        <p>${cvData.objective}</p>
                    </div>
                    <div class="cv-section">
                        <h3>EDUCATION</h3>
                        <p>${education}</p>
                    </div>
                    <div class="cv-section">
                        <h3>PROJECT</h3>
                        <p>${project}</p>
                    </div>
                    <div class="cv-section">
                        <h3>ACHIEVEMENT</h3>
                        <p>${achievement}</p>
                    </div>
                    <div class="cv-section">
                        <h3>LANGUAGES</h3>
                        <p>${cvData.languages}</p>
                    </div>
                    <div class="cv-section">
                        <h3>INTERESTS</h3>
                        <p>${interests}</p>
                    </div>
                    <div class="cv-section">
                        <h3>ACTIVITIES</h3>
                        <p>${activities}</p>
                    </div>
                    <div class="cv-signature">
                        ${cvData.signature}
                    </div>
                </div>
            </div>
        `;
        updateCVColors();
    }

    // 7. Ranglarni yangilash funksiyasi
    function updateCVColors() {
        const root = document.documentElement;
        const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
        const secondaryColor = getComputedStyle(root).getPropertyValue('--secondary-color').trim();
        
        const previewElement = ui.cvPreview;
        if (previewElement) {
            const leftPanel = previewElement.querySelector('.cv-left-panel');
            if(leftPanel) {
                leftPanel.style.background = primaryColor;
            }

            const rightPanel = previewElement.querySelector('.cv-right-panel');
            if(rightPanel) {
                rightPanel.style.background = '#fff';
            }
            
            previewElement.querySelectorAll('.cv-section h3').forEach(h3 => {
                h3.style.color = primaryColor;
                h3.style.borderBottomColor = secondaryColor;
            });

            previewElement.querySelectorAll('.cv-left-panel h2').forEach(h2 => {
                 h2.style.borderBottomColor = secondaryColor + '1A';
            });
            
            const linkedinLink = previewElement.querySelector('.cv-left-panel a');
            if(linkedinLink) {
                 linkedinLink.style.color = secondaryColor;
            }
        }
    }

    // 8. Event tinglovchilarni o'rnatish
    if (ui.cvForm) {
        ui.cvForm.addEventListener('input', updateCVPreview);
    }

    if (ui.photoInput) {
        ui.photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    photoDataUrl = ev.target.result;
                    updateCVPreview();
                };
                reader.readAsDataURL(file);
            } else {
                photoDataUrl = '';
                updateCVPreview();
            }
        });
    }

    // Rang tanlash funksiyasi
    if (ui.colorOptions) {
        ui.colorOptions.addEventListener('click', (e) => {
            const selectedColorBox = e.target.closest('.color-box');
            if (!selectedColorBox) return;

            document.querySelector('.color-box.selected')?.classList.remove('selected');
            selectedColorBox.classList.add('selected');

            const root = document.documentElement;
            root.style.setProperty('--primary-color', selectedColorBox.dataset.primary);
            root.style.setProperty('--secondary-color', selectedColorBox.dataset.secondary);
            
            // Rang o'zgarganda CVni qayta yangilash
            updateCVPreview();
        });
    }

    // 9. PDF/PNG eksport funksiyalari
    if (ui.exportPdfBtn) {
        ui.exportPdfBtn.onclick = () => {
            updateCVPreview();
            const element = document.getElementById('cv-export-content');
            
            html2canvas(element, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
                const imgProps= doc.getImageProperties(imgData);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                doc.save('cv.pdf');
            });
        };
    }

    if (ui.exportPngBtn) {
        ui.exportPngBtn.onclick = () => {
            updateCVPreview();
            const element = document.getElementById('cv-export-content');
            
            html2canvas(element, { scale: 2 }).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'cv.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        };
    }

    // 10. Sahifa yuklanganda boshlang'ich holatni o'rnatish
    const initialColorBox = document.querySelector('.color-box.selected');
    if (initialColorBox) {
        document.documentElement.style.setProperty('--primary-color', initialColorBox.dataset.primary);
        document.documentElement.style.setProperty('--secondary-color', initialColorBox.dataset.secondary);
    }
    updateCVPreview();
});
