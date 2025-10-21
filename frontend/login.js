
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Di sini Anda bisa menambahkan logika autentikasi
            console.log('Email:', email);
            console.log('Password:', password);
            
            if (email && password) {
                alert('Login berhasil! (Ini hanya contoh)');
            } else {
                alert('Harap isi semua field!');
            }
        });