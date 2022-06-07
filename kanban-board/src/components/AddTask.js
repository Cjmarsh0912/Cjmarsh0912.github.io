import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

export default function AddTask({ addTask, handleClose, tasks }) {
  const [task, setTask] = useState('');
  const [header, setHeader] = useState('');
  const focus = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (header.length === 0) {
      alert('Task must have a name');
      focus.current.focus();
      return;
    }
    const newTask = {
      id: uuid(),
      task: task,
      header: header,
    };
    addTask([...tasks, newTask]);
    setTask('');
    setHeader('');
  };

  useEffect(() => {
    focus.current.focus();
  }, []);

  return (
    <>
      <div className='addTask'>
        <div className='box'>
          <h2>Add new task:</h2>
          <form
            className='taskForm'
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <label htmlFor='header'>*Task Name:</label>
            <label htmlFor='task'>Task Details:</label>
            <input
              ref={focus}
              type='text'
              name='header'
              id='header'
              autoComplete='off'
              placeholder='Task Name'
              value={header}
              onChange={(e) => setHeader(e.target.value)}
            />
            <input
              type='text'
              name='task'
              id='task'
              autoComplete='off'
              placeholder='Task Details'
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button className='submit' type='submit'>
              Add Task
            </button>
            <button onClick={handleClose}>Close</button>
          </form>
        </div>
      </div>
    </>
  );
}
