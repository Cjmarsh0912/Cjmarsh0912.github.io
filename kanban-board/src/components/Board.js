import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import AddTask from './AddTask';

export default function Board() {
  const [tasks, setTask] = useState(() => {
    return [];
  });
  const [columns, setColumns] = useState(() => {
    return {
      0: {
        name: 'tasks',
        items: [],
      },
      1: {
        name: 'inProgress',
        items: [],
      },
      2: {
        name: 'testing',
        items: [],
      },
      3: {
        name: 'done',
        items: [],
      },
    };
  });
  const [showCard, setShowCard] = useState(false);

  const addTask = (log) => {
    const newTask = log[log.length - 1];
    setTask(log);
    setColumns({
      ...columns,
      0: {
        name: 'tasks',
        items: [...columns[0].items, newTask],
      },
    });
  };

  function toggleCard() {
    return setShowCard(!showCard);
  }

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const deleteContact = (id) => {
    let newColumns = columns;
    let newTasks = tasks.filter((i) => {
      return i.id !== id;
    });

    for (let i = 0; i <= 3; i++) {
      newColumns[i].items = columns[i].items.filter((t) => {
        return t.id !== id;
      });
    }

    setTask(newTasks);
    setColumns(newColumns);
  };

  useEffect(() => {
    const retrieveColumns = JSON.parse(localStorage.getItem('columns'));
    const retrieveTasks = JSON.parse(localStorage.getItem('tasks'));
    if (retrieveColumns) {
      setTask(retrieveTasks);
      setColumns(retrieveColumns);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('columns', JSON.stringify(columns));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [columns, tasks]);

  return (
    <>
      <div className='board'>
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([id, column]) => {
            return (
              <Droppable key={id} droppableId={id}>
                {(provided, snapshot) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={column.name}
                      style={{
                        background: snapshot.isDraggingOver
                          ? 'lightgrey'
                          : 'white',
                      }}
                    >
                      {column.items.map((item, index) => {
                        return (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Task
                                    clickHandler={deleteContact}
                                    tasks={item}
                                  />
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
      <button onClick={toggleCard}>New Task</button>
      {showCard && (
        <AddTask tasks={tasks} addTask={addTask} handleClose={toggleCard} />
      )}
    </>
  );
}
