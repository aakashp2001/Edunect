import React from 'react'
/**
 *
 * enrollment, email, full_name, branch, batch, roll_no
 */
function Register() {
  const signUp = () => {

  }
  return (
    <div className='container'>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign Up New Users
        </h2>

      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-100 py-8 px-4 shadow-lg rounded-lg sm:round-lg sm:px-10">
          <form method="POST" class="space-y-6" onSubmit={signUp}>
            <div>
              <h1 className='text-xl my-4 border-b-2 font-semibold'>Instructions:</h1>
              <p className='py-4'>
                Excel should have following rows: <br /><em className='bg-slate-200'>enrollment, email, full_name, branch, batch, roll_no</em> <br />(case sensitive)
              </p>
            </div>
            <div>

              <div class="mt-1">
                {/* <input id="signup_file" name="signup_file" type="file" required
                                    class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/> */}


                <label class="text-base font-semibold mb-2 block">Upload file</label>
                <input type="file"
                  class="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" accept='.xlsx,.xls,.csv,.xml' />
                <p class="text-xs text-gray-400 mt-2">xlsx, csv are Allowed.</p>
              </div>
              <div>
                <button type="submit" class="group relative w-full flex justify-center my-7 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Register