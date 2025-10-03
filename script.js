document.addEventListener('DOMContentLoaded', () => {

    // ===== ELEMENT SELECTORS =====
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const sideMenu = document.querySelector('aside');
    const menuBtn = document.querySelector('#menu-btn');
    const closeBtn = document.querySelector('#close-btn');
    const themeToggler = document.querySelector('.theme-toggler');
    const dropdown = document.querySelector('.dropdown');

    // ===== AUTH SYSTEM ELEMENTS =====
    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // ===== PROFILE DROPDOWN ELEMENTS =====
    const profileDropdownBtn = document.getElementById('profile-dropdown-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    const usernameDisplay = document.getElementById('username-display');
    const dropdownUsername = document.getElementById('dropdown-username');

    // ===== SINGLE PAGE APPLICATION (SPA) NAVIGATION =====
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;

            if (!targetId || targetId === '#') return;

            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            
            if(!link.closest('.dropdown-content')){
                let parentDropdown = link.closest('.dropdown');
                if(parentDropdown) parentDropdown.querySelector('a').classList.add('active');
            }

            contentSections.forEach(section => {
                section.classList.toggle('active', section.id === targetId);
            });

            if (targetId === 'beranda') {
                renderStatistikChart();
            }
            if(sideMenu.classList.contains('show')){
                sideMenu.classList.remove('show');
            }
        });
    });
    
    dropdown.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('open');
    });

    // ===== RESPONSIVE SIDEBAR =====
    menuBtn.addEventListener('click', () => {
        sideMenu.style.display = 'block';
        sideMenu.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
        sideMenu.classList.remove('show');
    });

    // ===== THEME TOGGLER =====
    themeToggler.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme-variables');
        themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
        themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

        if (document.body.classList.contains('dark-theme-variables')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        renderStatistikChart();
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme-variables');
        themeToggler.querySelector('span:nth-child(1)').classList.remove('active');
        themeToggler.querySelector('span:nth-child(2)').classList.add('active');
    }

    // ==========================================================
    // ===== DATA MANAGEMENT (CRUD) with LocalStorage =========
    // ==========================================================

    const getFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // ===== CRUD SISWA =====
    const formSiswa = document.getElementById('form-siswa');
    const tableBodySiswa = document.getElementById('table-body-siswa');
    let dataSiswa = getFromStorage('dataSiswa');
    let editingSiswaId = null;

    const renderSiswaTable = () => {
        tableBodySiswa.innerHTML = '';
        dataSiswa.forEach(siswa => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${siswa.nama}</td>
                <td>${siswa.umur}</td>
                <td>${siswa.hobi}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editSiswa(${siswa.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteSiswa(${siswa.id})">Hapus</button>
                </td>
            `;
            tableBodySiswa.appendChild(row);
        });
        updateDashboard();
    };

    formSiswa.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('siswa-nama').value;
        const umur = document.getElementById('siswa-umur').value;
        const hobi = document.getElementById('siswa-hobi').value;

        if (editingSiswaId) {
            dataSiswa = dataSiswa.map(s => s.id === editingSiswaId ? { ...s, nama, umur, hobi } : s);
            editingSiswaId = null;
            formSiswa.querySelector('button').textContent = 'Tambah Siswa';
        } else {
            const newSiswa = { id: Date.now(), nama, umur, hobi };
            dataSiswa.push(newSiswa);
        }
        
        saveToStorage('dataSiswa', dataSiswa);
        renderSiswaTable();
        formSiswa.reset();
    });

    window.editSiswa = (id) => {
        const siswa = dataSiswa.find(s => s.id === id);
        document.getElementById('siswa-id').value = siswa.id;
        document.getElementById('siswa-nama').value = siswa.nama;
        document.getElementById('siswa-umur').value = siswa.umur;
        document.getElementById('siswa-hobi').value = siswa.hobi;
        editingSiswaId = id;
        formSiswa.querySelector('button').textContent = 'Update Siswa';
    };

    window.deleteSiswa = (id) => {
        if(confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            dataSiswa = dataSiswa.filter(s => s.id !== id);
            saveToStorage('dataSiswa', dataSiswa);
            renderSiswaTable();
        }
    };

    // ===== CRUD DATA KAS =====
    const formDataKas = document.getElementById('form-data-kas');
    const tableBodyDataKas = document.getElementById('table-body-data-kas');
    let dataKas = getFromStorage('dataKas');
    let editingDataKasId = null;

    const renderDataKasTable = () => {
        tableBodyDataKas.innerHTML = '';
        dataKas.forEach(kas => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${kas.nama}</td>
                <td>${kas.kelas}</td>
                <td>${kas.umur}</td>
                <td>${formatRupiah(kas.uang)}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editDataKas(${kas.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteDataKas(${kas.id})">Hapus</button>
                </td>
            `;
            tableBodyDataKas.appendChild(row);
        });
        updateDashboard();
        populateTagihanNamaDropdown();
    };

    formDataKas.addEventListener('submit', e => {
        e.preventDefault();
        const nama = document.getElementById('datakas-nama').value;
        const kelas = document.getElementById('datakas-kelas').value;
        const umur = document.getElementById('datakas-umur').value;
        const uang = document.getElementById('datakas-uang').value;

        if (editingDataKasId) {
            dataKas = dataKas.map(k => k.id === editingDataKasId ? { ...k, nama, kelas, umur, uang } : k);
            editingDataKasId = null;
            formDataKas.querySelector('button').textContent = 'Tambah Data';
        } else {
            const newKas = { id: Date.now(), nama, kelas, umur, uang };
            dataKas.push(newKas);
        }

        saveToStorage('dataKas', dataKas);
        renderDataKasTable();
        formDataKas.reset();
    });

    window.editDataKas = (id) => {
        const kas = dataKas.find(k => k.id === id);
        document.getElementById('datakas-id').value = kas.id;
        document.getElementById('datakas-nama').value = kas.nama;
        document.getElementById('datakas-kelas').value = kas.kelas;
        document.getElementById('datakas-umur').value = kas.umur;
        document.getElementById('datakas-uang').value = kas.uang;
        editingDataKasId = id;
        formDataKas.querySelector('button').textContent = 'Update Data';
    };

    window.deleteDataKas = (id) => {
        if(confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            dataKas = dataKas.filter(k => k.id !== id);
            saveToStorage('dataKas', dataKas);
            renderDataKasTable();
        }
    };

    // ===== CRUD TAGIHAN =====
    const formTagihan = document.getElementById('form-tagihan');
    const tableBodyTagihan = document.getElementById('table-body-tagihan');
    const tagihanNamaSelect = document.getElementById('tagihan-nama');
    let dataTagihan = getFromStorage('dataTagihan');
    let editingTagihanId = null;

    const populateTagihanNamaDropdown = () => {
        tagihanNamaSelect.innerHTML = '<option value="" disabled selected>Pilih Nama Siswa dari Data Kas</option>';
        dataKas.forEach(kas => {
            const option = document.createElement('option');
            option.value = kas.nama;
            option.textContent = kas.nama;
            option.dataset.kelas = kas.kelas;
            option.dataset.umur = kas.umur;
            tagihanNamaSelect.appendChild(option);
        });
    };
    
    tagihanNamaSelect.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        document.getElementById('tagihan-kelas').value = selectedOption.dataset.kelas || '';
        document.getElementById('tagihan-umur').value = selectedOption.dataset.umur || '';
    });

    const renderTagihanTable = () => {
        tableBodyTagihan.innerHTML = '';
        dataTagihan.forEach(t => {
            const row = document.createElement('tr');
            if(t.lunas) row.classList.add('lunas');
            row.innerHTML = `
                <td>${t.nama}</td>
                <td>${t.kelas}</td>
                <td>${t.umur}</td>
                <td>${formatRupiah(t.tagihan)}</td>
                <td>${t.lunas ? 'Lunas' : 'Belum Lunas'}</td>
                <td>
                    <button class="action-btn lunas-btn" onclick="tandaiLunas(${t.id})" ${t.lunas ? 'disabled' : ''}>Lunas</button>
                    <button class="action-btn edit-btn" onclick="editTagihan(${t.id})" ${t.lunas ? 'disabled' : ''}>Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteTagihan(${t.id})">Hapus</button>
                </td>
            `;
            tableBodyTagihan.appendChild(row);
        });
        updateDashboard();
    };

    formTagihan.addEventListener('submit', e => {
        e.preventDefault();
        const nama = document.getElementById('tagihan-nama').value;
        const kelas = document.getElementById('tagihan-kelas').value;
        const umur = document.getElementById('tagihan-umur').value;
        const tagihan = document.getElementById('tagihan-uang').value;

        if(!nama) {
            alert('Silakan pilih nama siswa terlebih dahulu!');
            return;
        }

        if(editingTagihanId) {
            dataTagihan = dataTagihan.map(t => t.id === editingTagihanId ? {...t, nama, kelas, umur, tagihan} : t);
            editingTagihanId = null;
            formTagihan.querySelector('button').textContent = 'Tambah Tagihan';
        } else {
            const newTagihan = { id: Date.now(), nama, kelas, umur, tagihan, lunas: false };
            dataTagihan.push(newTagihan);
        }
        
        saveToStorage('dataTagihan', dataTagihan);
        renderTagihanTable();
        formTagihan.reset();
        document.getElementById('tagihan-kelas').value = '';
        document.getElementById('tagihan-umur').value = '';
    });
    
    window.tandaiLunas = (id) => {
        dataTagihan = dataTagihan.map(t => t.id === id ? { ...t, lunas: true } : t);
        saveToStorage('dataTagihan', dataTagihan);
        renderTagihanTable();
    };

    window.editTagihan = (id) => {
        const tagihan = dataTagihan.find(t => t.id === id);
        if(tagihan.lunas) return;
        document.getElementById('tagihan-id').value = tagihan.id;
        document.getElementById('tagihan-nama').value = tagihan.nama;
        document.getElementById('tagihan-kelas').value = tagihan.kelas;
        document.getElementById('tagihan-umur').value = tagihan.umur;
        document.getElementById('tagihan-uang').value = tagihan.tagihan;
        editingTagihanId = id;
        formTagihan.querySelector('button').textContent = 'Update Tagihan';
    };

    window.deleteTagihan = (id) => {
        if(confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            dataTagihan = dataTagihan.filter(t => t.id !== id);
            saveToStorage('dataTagihan', dataTagihan);
            renderTagihanTable();
        }
    };

    // ===== BERANDA DASHBOARD =====
    const updateDashboard = () => {
        document.getElementById('total-siswa').textContent = dataSiswa.length;
        
        const totalKas = dataKas.reduce((sum, item) => sum + parseFloat(item.uang), 0);
        document.getElementById('total-kas').textContent = formatRupiah(totalKas);

        const totalTagihan = dataTagihan.reduce((sum, item) => sum + parseFloat(item.tagihan), 0);
        document.getElementById('total-tagihan').textContent = formatRupiah(totalTagihan);
        
        // When dashboard updates, re-render the chart
        if (document.getElementById('beranda').classList.contains('active')) {
            renderStatistikChart();
        }
    };

    // ===== STATISTIK CHART =====
    let kasChart = null;
    const renderStatistikChart = () => {
        const ctx = document.getElementById('kasChart').getContext('2d');
        const isDarkMode = document.body.classList.contains('dark-theme-variables');
        const textColor = isDarkMode ? '#edeffd' : '#363949';

        // Calculate aggregate data for the flow chart
        const totalKasMasuk = dataKas.reduce((sum, item) => sum + parseFloat(item.uang), 0);
        const totalTagihanLunas = dataTagihan.filter(t => t.lunas).reduce((sum, t) => sum + parseFloat(t.tagihan), 0);
        const totalTagihanBelumLunas = dataTagihan.filter(t => !t.lunas).reduce((sum, t) => sum + parseFloat(t.tagihan), 0);

        if (kasChart) kasChart.destroy();
        
        kasChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Total Kas Masuk', 'Tagihan Lunas', 'Tagihan Belum Lunas'],
                datasets: [{
                    label: 'Flow Keuangan',
                    data: [totalKasMasuk, totalTagihanLunas, totalTagihanBelumLunas],
                    backgroundColor: [
                        'rgba(65, 241, 182, 0.7)',  // Success color
                        'rgba(115, 128, 236, 0.7)', // Primary color
                        'rgba(255, 119, 130, 0.7)'  // Danger color
                    ],
                    borderColor: [
                        '#41f1b6',
                        '#7380ec',
                        '#ff7782'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: textColor,
                            font: {
                                size: 14,
                                family: "'Poppins', sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += formatRupiah(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    };

    // ===== LOGIN & REGISTER SYSTEM =====
    const openModal = () => {
        authModal.style.display = 'flex';
        // Reset to login form when opening modal
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
    };

    const closeModal = () => {
        authModal.style.display = 'none';
    };

    // Show modal when page loads if not logged in
    const checkLoginStatus = () => {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            openModal();
        } else {
            updateUserDisplay();
        }
    };

    // Update user display
    const updateUserDisplay = () => {
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (loggedInUser) {
            usernameDisplay.textContent = loggedInUser;
            dropdownUsername.textContent = loggedInUser;
        } else {
            usernameDisplay.textContent = 'User';
            dropdownUsername.textContent = 'User';
        }
    };

    // Modal event listeners
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { 
        if (e.target === authModal) closeModal(); 
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });
    
    // Register form handler
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.querySelector('input[type="text"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        let users = getFromStorage('appUsers');
        
        if (!users) users = [];

        if (users.find(user => user.username === username)) {
            alert('Username sudah ada!');
            return;
        }

        users.push({ username, password });
        saveToStorage('appUsers', users);
        alert('Registrasi berhasil! Silakan login.');
        showLoginLink.click();
        registerForm.reset();
    });

    // Login form handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = e.target.querySelector('input[type="text"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        const users = getFromStorage('appUsers');
        
        if (!users || users.length === 0) {
            alert('Tidak ada pengguna terdaftar. Silakan register terlebih dahulu.');
            return;
        }

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            alert(`Login berhasil! Selamat datang, ${username}!`);
            sessionStorage.setItem('loggedInUser', username);
            updateUserDisplay();
            closeModal();
            loginForm.reset();
        } else {
            alert('Username atau password salah!');
        }
    });

    // ===== PROFILE DROPDOWN & LOGOUT FUNCTIONALITY =====
    profileDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target) && !profileDropdownBtn.contains(e.target)) {
            profileDropdown.classList.remove('show');
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            // Hapus data session
            sessionStorage.removeItem('loggedInUser');
            
            // Reset tampilan
            updateUserDisplay();
            
            // Tutup dropdown
            profileDropdown.classList.remove('show');
            
            // Tampilkan modal login
            openModal();
            
            // Tampilkan pesan logout berhasil
            setTimeout(() => {
                alert('Logout berhasil!');
            }, 300);
        }
    });

    // ===== UTILITY FUNCTIONS =====
    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    
    // ===== DUMMY DATA GENERATOR =====
    const generateDummyData = () => {
        const firstNames = ["Budi", "Ani", "Eko", "Citra", "Dewi", "Fajar", "Gita", "Hadi", "Indah", "Joko", "Kartika", "Lia", "Made", "Nina", "Oscar", "Putri", "Rian", "Sari", "Tono", "Umar"];
        const lastNames = ["Santoso", "Wijaya", "Kusuma", "Putra", "Lestari", "Nugroho", "Wati", "Pratama", "Halim", "Susanto"];
        const hobbies = ["Membaca", "Bermain Game", "Olahraga", "Menonton Film", "Musik", "Melukis", "Memasak", "Fotografi"];
        const classes = ["10 PPLG 1", "10 PPLG 2", "10 TJKT 1"];

        let dummySiswa = [], dummyKas = [], dummyTagihan = [];

        for (let i = 0; i < 20; i++) {
            const id = Date.now() + i;
            const fullName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
            const umur = Math.floor(Math.random() * 3) + 15;
            const hobi = hobbies[Math.floor(Math.random() * hobbies.length)];
            const kelas = classes[Math.floor(Math.random() * classes.length)];
            
            dummySiswa.push({ id, nama: fullName, umur, hobi });
            const uangKas = (Math.floor(Math.random() * 9) + 2) * 5000;
            dummyKas.push({ id, nama: fullName, kelas, umur, uang: uangKas });

            if (Math.random() < 0.4) {
                const tagihanUang = (Math.floor(Math.random() * 5) + 1) * 5000;
                const isLunas = Math.random() < 0.5;
                dummyTagihan.push({ id: Date.now() + 1000 + i, nama: fullName, kelas, umur, tagihan: tagihanUang, lunas: isLunas });
            }
        }

        saveToStorage('dataSiswa', dummySiswa);
        saveToStorage('dataKas', dummyKas);
        saveToStorage('dataTagihan', dummyTagihan);
    };

    // Create default admin user if not exists
    const createDefaultUser = () => {
        let users = getFromStorage('appUsers');
        if (!users || users.length === 0) {
            users = [{ username: 'admin', password: 'admin123' }];
            saveToStorage('appUsers', users);
        }
    };

    // ===== INITIALIZATION =====
    const initialize = () => {
        // Create default user
        createDefaultUser();
        
        // Check if data exists, if not generate dummy data
        if (getFromStorage('dataSiswa').length === 0) {
            generateDummyData();
        }

        // Load data
        dataSiswa = getFromStorage('dataSiswa');
        dataKas = getFromStorage('dataKas');
        dataTagihan = getFromStorage('dataTagihan');

        // Render tables
        renderSiswaTable();
        renderDataKasTable();
        renderTagihanTable();
        renderStatistikChart();

        // Check login status
        checkLoginStatus();
        updateUserDisplay();
    };

    initialize();
});