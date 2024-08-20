document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const passwordChoice = document.getElementById('passwordChoice');
    const manualPasswordFields = document.getElementById('manualPasswordFields');
    const autoPasswordFields = document.getElementById('autoPasswordFields');
    const generatePasswordButton = document.getElementById('generatePasswordButton');
    const generatedPasswordInput = document.getElementById('generatedPassword');
    const generateNicknameButton = document.getElementById('generateNickname');
    const nicknameInput = document.getElementById('nickname');
    const messageDiv = document.getElementById('message');
    const logoutButton = document.getElementById('logout');
    const signButton = document.getElementById('sign');
    const autButton = document.getElementById('aut');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const top100Passwords = ['123456', 'password'];
    let nicknameAttempts = 0;
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    // Функция проверки на сильный пароль
    function isPasswordStrong(password) {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
        return strongPasswordRegex.test(password) && !top100Passwords.includes(password);
    }

    // Функция генерации никнейма
    function generateNickname() {
        const randomNickname = 'User' + Math.floor(Math.random() * 10000);
        nicknameAttempts++;
        return randomNickname;
    }

    // Функция генерации пароля
    function generatePassword() {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let generatedPassword = '';
        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            generatedPassword += charset[randomIndex];
        }
        return generatedPassword;
    }

    // Функция проверки возраста
    function validateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        return age;
    }

    // Обработка переключения между режимами ручного ввода и автогенерации пароля
    if (passwordChoice) {
        passwordChoice.addEventListener('change', (event) => {
            if (event.target.value === 'manual') {
                manualPasswordFields.style.display = 'block';
                autoPasswordFields.style.display = 'none';
            } else {
                manualPasswordFields.style.display = 'none';
                autoPasswordFields.style.display = 'block';
                generatedPasswordInput.value = '';
            }
        });
    }

    // Обработка генерации пароля
    if (generatePasswordButton) {
        generatePasswordButton.addEventListener('click', () => {
            const generatedPassword = generatePassword();
            generatedPasswordInput.value = generatedPassword;
        });
    }

    // Обработка генерации никнейма
    if (generateNicknameButton) {
        generateNicknameButton.addEventListener('click', () => {
            if (nicknameAttempts < 5) {
                nicknameInput.value = generateNickname();
            } else {
                nicknameInput.removeAttribute('readonly');
                generateNicknameButton.disabled = true;
            }
        });
    }

    // Обработка формы регистрации
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const dob = document.getElementById('dob').value;
            const name = document.getElementById('name').value;
            const nickname = document.getElementById('nickname').value;
            const agreement = document.getElementById('agreement').checked;
            const role = document.getElementById('role').value;
            const password = passwordChoice.value === 'manual' ? passwordInput.value : generatedPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Валидация возраста
            if (validateAge(dob) < 16) {
                messageDiv.textContent = 'You must be at least 16 years old to register.';
                return;
            }

            // Валидация пароля
            if (passwordChoice.value === 'manual' && (!isPasswordStrong(password) || password !== confirmPassword)) {
                messageDiv.textContent = 'Password does not meet the criteria or passwords do not match.';
                return;
            }

            // Валидация согласия
            if (!agreement) {
                messageDiv.textContent = 'You must agree to the User Agreement.';
                return;
            }

            // Проверка на уникальность email
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const emailExists = users.some(user => user.email === email);
            if (emailExists) {
                messageDiv.textContent = 'Email is already registered.';
                return;
            }

            // Регистрация пользователя
            users.push({ phone, email, dob, password, name, nickname, role });
            localStorage.setItem('users', JSON.stringify(users));
            messageDiv.textContent = 'Registration successful!';
        });
    }

    // Обработка формы логина
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const loginEmail = document.getElementById('loginEmail').value;
            const loginPassword = document.getElementById('loginPassword').value;
            let users = JSON.parse(localStorage.getItem('users')) || [];

            const user = users.find(user => user.email === loginEmail && user.password === loginPassword);
            if (user) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                loggedInUser = user;
                displayContentBasedOnRole();
                window.location.href = '../glav/index.html'; // Перенаправление
            } else {
                messageDiv.textContent = 'Invalid email or password.';
            }
        });
    }

    // Отображение контента в зависимости от роли пользователя
    function displayContentBasedOnRole() {
        if (loggedInUser) {
            usernameDisplay.textContent = 'Welcome, ' + loggedInUser.nickname;
            usernameDisplay.style.display = 'inline';
            logoutButton.style.display = 'inline';
            signButton.style.display = 'none';
            autButton.style.display = 'none';

            // Показ/скрытие блоков для админов и пользователей
            const adminBlocks = document.querySelectorAll('.admin-only');
            const userBlocks = document.querySelectorAll('.user-only');

            if (loggedInUser.role === 'admin') {
                adminBlocks.forEach(block => block.style.display = 'block');
                userBlocks.forEach(block => block.style.display = 'none');
            } else if (loggedInUser.role === 'user') {
                adminBlocks.forEach(block => block.style.display = 'none');
                userBlocks.forEach(block => block.style.display = 'block');
            }
        }
    }

    // Обработка выхода из аккаунта
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('loggedInUser');
            usernameDisplay.style.display = 'none';
            logoutButton.style.display = 'none';
            signButton.style.display = 'inline';
            autButton.style.display = 'inline';
        });
    }

    // Проверка текущей сессии пользователя
    window.addEventListener('load', () => {
        displayContentBasedOnRole();
    });
});
