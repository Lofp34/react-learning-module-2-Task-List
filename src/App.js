import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, Plus, Trash2, Check, RotateCcw } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const EnhancedTodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [theme, setTheme] = useState("light");
  const [completedCount, setCompletedCount] = useState(0);
  const [deletedTodos, setDeletedTodos] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const bgColor = getRandomColor();
      const complementaryColor = getComplementaryColor(bgColor);
      document.body.style.background = `linear-gradient(${
        Math.random() * 360
      }deg, ${bgColor}, ${complementaryColor})`;
      document.querySelector(
        ".todo-card"
      ).style.background = `linear-gradient(${
        Math.random() * 360
      }deg, ${complementaryColor}, ${bgColor})`;
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRandomColor = () => {
    return `hsl(${Math.random() * 360}, 100%, 75%)`;
  };

  const getComplementaryColor = (color) => {
    const hsl = color.match(/\d+/g).map(Number);
    return `hsl(${(hsl[0] + 180) % 360}, ${hsl[1]}%, ${hsl[2]}%)`;
  };

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    const todo = todos.find((t) => t.id === id);
    if (!todo.completed) {
      setCompletedCount(completedCount + 1);
    } else {
      setCompletedCount(completedCount - 1);
    }
  };

  const removeTodo = (id) => {
    const removedTodo = todos.find((todo) => todo.id === id);
    setDeletedTodos([...deletedTodos, removedTodo]);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const undoDelete = () => {
    if (deletedTodos.length > 0) {
      const lastDeleted = deletedTodos[deletedTodos.length - 1];
      setTodos([...todos, lastDeleted]);
      setDeletedTodos(deletedTodos.slice(0, -1));
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  return (
    <div
      className={`todo-card p-6 max-w-md mx-auto rounded-xl shadow-md space-y-4 transition-colors duration-500 ${
        theme === "light" ? "text-gray-800" : "text-white"
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-6 animate-pulse">
        Todo List Améliorée
      </h1>

      <div className="flex items-center space-x-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-grow p-2 border rounded ${
            theme === "light"
              ? "text-gray-800 bg-white"
              : "text-white bg-gray-700"
          }`}
          placeholder="Nouvelle tâche..."
        />
        <button
          onClick={addTodo}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        >
          <Plus size={24} />
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {todos.map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={todo.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex items-center justify-between p-3 ${
                        theme === "light" ? "bg-gray-100" : "bg-gray-700"
                      } rounded mb-2 transition-all duration-300 transform hover:scale-105`}
                    >
                      <span
                        className={`flex-grow ${
                          todo.completed ? "line-through text-green-500" : ""
                        }`}
                      >
                        {todo.text}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className={`p-1 ${
                            todo.completed ? "bg-green-500" : "bg-yellow-500"
                          } text-white rounded transition-colors duration-300`}
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => removeTodo(todo.id)}
                          className="p-1 bg-red-500 text-white rounded transition-colors duration-300 hover:bg-red-600"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex justify-between items-center mt-6">
        <span>
          Tâches complétées: {completedCount}/{todos.length}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={undoDelete}
            disabled={deletedTodos.length === 0}
            className={`p-2 rounded-full ${
              deletedTodos.length > 0
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400"
            } text-white transition-colors duration-300`}
          >
            <RotateCcw size={24} />
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              theme === "light" ? "bg-gray-200" : "bg-gray-600"
            } transition-transform duration-300 hover:rotate-180`}
          >
            {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTodoList;
