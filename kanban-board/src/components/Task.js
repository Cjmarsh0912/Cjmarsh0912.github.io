import React from 'react';
import trash from '../images/delete.svg';

export default function Task(props) {
  const { id, task, header } = props.tasks;
  return (
    <>
      <div className='task'>
        <header>
          <h3>{header}</h3>
        </header>
        <img
          onClick={() => {
            props.clickHandler(id);
          }}
          src={trash}
          style={{ height: '20px', width: '20px' }}
          alt='delete icon'
        />
        {task !== '' && <p>{task}</p>}
      </div>
    </>
  );
}
