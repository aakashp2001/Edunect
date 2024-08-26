import React from 'react'

function StudentComponent(props) {
    console.log('component created')
  return (
    <div id={props.id}>
        <div className="mx-auto">
        <div className='bg-white p-4 mx-2 my-5 rounded-lg '>
          <h1 className='text-2xl text-center'>{props.full_name}</h1>
          <hr className="bg-gray-900"/>
          <div className='grid grid-cols-2 gap-4 text-center m-1 p-2'>
            <p>{props.username}</p>
          <p>Roll No: {props.roll_no}</p>
          <p>Batch: {props.batch}</p>
            <p>Branch: {props.branch}</p>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default StudentComponent