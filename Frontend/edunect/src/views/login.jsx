import React,{useState} from 'react'

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const performLogin = () => {
        fetch('http://127.0.0.1:8000/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.resp === 1) {
                console.log(data.message);
            } else {
                console.log(data.message);
            }
        });
        console.log("Login need to be done")
    }

    return (
        <div className='container'>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
      
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-100 py-8 px-4 shadow-lg rounded-lg sm:round-lg sm:px-10">
                    <form method="POST" class="space-y-6" onSubmit={performLogin}>
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div class="mt-1">
                                <input id="email" name="email" type="email" autocomplete="email" required
                                    class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your email address" onChange={(e)=>{setUsername(e.target.value)}} />
                            </div>
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div class="mt-1">
                                <input id="password" name="password" type="password" autocomplete="current-password" required
                                    class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your password" onChange={(e)=>{setPassword(e.target.value)}} />
                            </div>
                            <div>
                                <button type="submit" class="group relative w-full flex justify-center my-7 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={performLogin}>
                                    Sign in
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login