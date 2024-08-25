import React from 'react'

const Notification_Item = (props) => {
  return (
    <>
      <div className=" w-6/12 mx-auto">
        <div className='bg-white px-auto p-4 mx-2 my-5 rounded-lg'>
          <h1 className='text-3xl'>{props.notification_head}</h1>
          <p className="text-gray-600">{props.notification_body.split('\n').map(body => { return (<div>{body}<br /></div>) })}</p> <br/>
          <h6 className='text-xs pb-3'>{props.date}</h6>
          <p>{props.content}</p>
        </div>
      </div>
    </>
  )
}

export default Notification_Item