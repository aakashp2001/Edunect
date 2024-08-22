import React from 'react'
import AdminNav from './AdminNav'
function Student() {
    return (
        <div class='h-screen'>
            <AdminNav />
            <div class='text-center p-6'>
                Student Data Coming Soon
                <div class="flex gap-3 bg-white border border-gray-300 rounded-xl overflow-hidden items-center justify-start">


                    <div class="flex flex-col gap-2 py-2">

                        <p class="text-xl font-bold">Post title</p>

                        <p class="text-gray-500">
                            Description of your post/article,
                            Description of your post/article,
                        </p>

                        <span class="flex items-center justify-start text-gray-500">
                            <svg class="w-4 h-4 mr-1 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"></path>
                            </svg>
                            <a href="amitpachange.com" target="_blank">amitpachange.com</a>
                        </span>

                    </div>

                </div>
            </div>
            <div class="p-4 flex items-center flex-wrap">
                <nav className='mx-auto'>
                    <ul class="inline-flex">
                        <li><button class="px-4 py-2 transition-colors duration-150 bg-white border border-r-0 border-black rounded-l-lg focus:shadow-outline hover:bg-green-100">Prev</button></li>
                        <li><button class="px-4 py-2 transition-colors duration-150 bg-white border border-r-0 border-black focus:shadow-outline">1</button></li>
                        <li><button class="px-4 py-2  transition-colors duration-150 border border-r-0 border-black focus:shadow-outline">2</button></li>
                        <li><button class="px-4 py-2 transition-colors duration-150 bg-white border border-r-0 border-black focus:shadow-outline hover:bg-green-100">3</button></li>
                        <li><button class="px-4 py-2 transition-colors duration-150 bg-white border border-black rounded-r-lg focus:shadow-outline hover:bg-green-100">Next</button></li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Student