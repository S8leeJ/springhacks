import React, { useState, useEffect } from 'react';

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [todoListName, setTodoListName] = useState('');
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    const fetchTodoList = async () => {
      const response = await fetch(`/api/todo-list/${todoListName}`);
      const data = await response.json();
      setTodoList(data);    
    };
    fetchTodoList();
  }, [todoListName]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { text: input, done: false }]);
  };


  const toggleDone = (idx) => {
    setTodos(todos.map((todo, i) =>
      i === idx ? { ...todo, done: !todo.done } : todo
    ));
  };

  const handleDelete = (idx) => {
    setTodos(todos.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-purple-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <div className="w-full flex items-center justify-center mb-6">
          <input
            type="text"
            value={typeof todoListName !== 'undefined' ? todoListName : ''}
            onChange={e => setTodoListName(e.target.value)}
            className="text-3xl font-extrabold text-center text-blue-700 tracking-tight drop-shadow bg-transparent border-b-2 border-blue-200 focus:outline-none focus:border-blue-400 transition w-full max-w-xs"
            style={{ background: 'none' }}
            aria-label="Todo List Name"
          />
        </div>
        <form onSubmit={handleAdd} className="flex w-full mb-6 gap-2">
          <input
            className="flex-1 border-2 border-blue-200 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a new todo"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-400 to-pink-400 text-white px-6 py-2 rounded-r-lg font-semibold shadow hover:from-blue-500 hover:to-pink-500 transition"
          >
            Add
          </button>
        </form>
        <ul className="w-full">
          {todos.length === 0 && (
            <li className="text-center text-gray-400 py-8">No todos yet. Add one!</li>
          )}
          {todos.map((todo, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between mb-3 bg-blue-50 rounded-lg px-4 py-2 shadow-sm hover:bg-blue-100 transition group"
            >
              <span
                onClick={() => toggleDone(idx)}
                className={`flex-1 cursor-pointer select-none transition text-lg ${todo.done ? 'line-through text-gray-400' : 'text-blue-900'} group-hover:scale-105`}
              >
                {todo.done ? (
                  <span className="inline-block align-middle mr-2 text-green-400 animate-bounce">✔</span>
                ) : (
                  <span className="inline-block align-middle mr-2 text-gray-300">○</span>
                )}
                {todo.text}
              </span>
              <button
                onClick={() => handleDelete(idx)}
                className="ml-4 text-pink-500 hover:text-pink-700 font-bold px-2 py-1 rounded transition"
                title="Delete"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}