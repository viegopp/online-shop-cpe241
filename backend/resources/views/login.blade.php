<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>

<body class="bg-gray-100">

    <div class="flex justify-center items-center h-screen">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 class="text-2xl font-bold text-center mb-6">Admin Login</h2>

            <!-- Start of the login form -->
            <form id="loginForm" method="POST" action="{{ route('admin.login') }}">

                <!-- Email input field -->
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email"
                        class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email" required>
                </div>

                <!-- Password input field -->
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" name="password"
                        class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password" required>
                </div>

                <!-- Submit button -->
                <div>
                    <button type="submit"
                        class="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">Login</button>
                </div>
            </form>
        </div>
    </div>
    
    <div id="response">
        <!-- Display Response Here -->
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        // Handle Login Form Submission
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();

            let email = document.getElementById('email').value;
            let password = document.getElementById('password').value;

            // Send Login Request
            axios.post('http://127.0.0.1:8000/api/admin/login', {
                    email: email,
                    password: password
                })
                .then(response => {
                    const token = response.data.token;

                    // After login success, make a request to the /admin/test route with the token
                    axios.get('http://127.0.0.1:8000/api/admin/test', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                        .then(testResponse => {
                            // Display response from /admin/test
                            document.getElementById('response').innerHTML = ` 
                        <h2>Test Route Response</h2>
                        <pre>${JSON.stringify(testResponse.data, null, 2)}</pre>
                    `;
                        })
                        .catch(error => {
                            document.getElementById('response').innerHTML = ` 
                        <h2>Error in Test Route</h2>
                        <pre>${JSON.stringify(error.response.data, null, 2)}</pre>
                    `;
                        });

                })
                .catch(error => {
                    // Handle login error
                    document.getElementById('response').innerHTML = `
                    <h2>Login Error</h2>
                    <pre>${JSON.stringify(error.response.data, null, 2)}</pre>
                `;
                });
        });
    </script>

</body>

</html>
