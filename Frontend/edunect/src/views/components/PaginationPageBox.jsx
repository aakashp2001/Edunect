import React from 'react'

function PaginationPageBox(props) {
  return (
    <button class="px-4 py-2 transition-colors duration-150 bg-white border border-1 border-black focus:shadow-outline hover:bg-green-100" value={props.pageNo} onClick={props.handler}>{props.pageNo}</button>
  )
}

export default PaginationPageBox