
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(msg => {
                msg.style.display = 'none';
            });
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const userType = document.getElementById('userType').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            let isValid = true;
            
            if (!firstName.trim()) {
                document.getElementById('firstNameError').style.display = 'block';
                isValid = false;
            }
            
            if (!lastName.trim()) {
                document.getElementById('lastNameError').style.display = 'block';
                isValid = false;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            }
            
            if (!phone.trim()) {
                document.getElementById('phoneError').style.display = 'block';
                isValid = false;
            }
            
            if (!userType) {
                document.getElementById('userTypeError').style.display = 'block';
                isValid = false;
            }
            
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(password)) {
                document.getElementById('passwordError').style.display = 'block';
                isValid = false;
            }
            
            if (password !== confirmPassword) {
                document.getElementById('confirmPasswordError').style.display = 'block';
                isValid = false;
            }
            
            if (!terms) {
                document.getElementById('termsError').style.display = 'block';
                isValid = false;
            }
            
            if (isValid) {
                console.log('Form data:', {
                    firstName,
                    lastName,
                    email,
                    phone,
                    userType,
                    password
                });
                
                alert('Pendaftaran berhasil! (Ini hanya contoh)');
            }
        });
        
        document.getElementById('confirmPassword').addEventListener('input', function() {
            const password = document.getElementById('password').value;
            const confirmPassword = this.value;
            const errorElement = document.getElementById('confirmPasswordError');
            if (password !== confirmPassword && confirmPassword.length > 0) {
                errorElement.style.display = 'block';
            } else {
                errorElement.style.display = 'none';
            }
        });