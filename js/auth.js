document.addEventListener('DOMContentLoaded', function() {

    // ---------- Register ----------
    const registerForm = document.getElementById('registerForm');

    if(registerForm){
        registerForm.addEventListener('submit', function(e){
            e.preventDefault();

            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const type = document.getElementById('role').value;

            let valid = true;

            // Reset errors
            const resetErrors = ['registerNameError','registerEmailError','registerPasswordError','confirmPasswordError','registerTypeError'];
            resetErrors.forEach(id=>{
                const el = document.getElementById(id);
                el.textContent = '';
                el.style.color = 'red'; 
            });

            document.getElementById('registerSuccess').textContent = '';
            document.getElementById('registerSuccess').style.color = 'green';

            // Name validation
            if(name.length < 3){ 
                document.getElementById('registerNameError').textContent = 'Name must be at least 3 characters';
                valid = false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                document.getElementById('registerEmailError').textContent = 'Invalid email';
                valid = false;
            }

            // Password validation using strong Regex
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
            if(!passwordRegex.test(password)){
                document.getElementById('registerPasswordError').textContent = 
                    'Password must be 8+ chars, include uppercase, lowercase, number & special (!@#$%^&*)';
                valid = false;
            }

            // Confirm password validation
            if(password !== confirmPassword){
                document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
                valid = false;
            }

            // Type validation
            if(!type){
                document.getElementById('registerTypeError').textContent = 'Please select user type';
                valid = false;
            }

            if(!valid) return;

            // Save user to Local Storage
            let users = JSON.parse(localStorage.getItem('users')) || [];
            if(users.some(u => u.email === email)){
                document.getElementById('registerEmailError').textContent = 'Email already exists';
                return;
            }

            const newUser = {
                id: 'u' + Date.now(),
                name,
                email,
                password,
                type
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            document.getElementById('registerSuccess').textContent = 'Registered successfully! You can login now.';
            registerForm.reset();
        });
    }

    // ---------- Login ----------
    const loginForm = document.getElementById('loginForm');

    if(loginForm){
        loginForm.addEventListener('submit', function(e){
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            // Reset messages
            document.getElementById('loginEmailError').textContent = '';
            document.getElementById('loginPasswordError').textContent = '';
            document.getElementById('loginSuccess').textContent = '';
            document.getElementById('loginEmailError').style.color = 'red';
            document.getElementById('loginPasswordError').style.color = 'red';

            if(!user){
                document.getElementById('loginPasswordError').textContent = 'Invalid email or password';
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify(user));
            document.getElementById('loginSuccess').textContent = 'Login successful! Redirecting...';
            document.getElementById('loginSuccess').style.color = 'green';

            setTimeout(()=>{
                if(user.type === 'admin') window.location.href = 'admin/dashboard.html';
                else window.location.href = 'student/dashboard.html';
            }, 1000);
        });
    }

});
