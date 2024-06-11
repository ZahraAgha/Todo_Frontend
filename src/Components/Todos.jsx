import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './todo.css';

const Todos = () => {
    const todoRef = useRef();
    const [todos, setTodos] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            let title = todoRef.current.value.trim();
            const newTodo = { title };
            // if (!title) return;
            const response = await axios.post("/api/todos", newTodo);
            if (!title) {
                console.log(response.data);
                alert(response.data.message)
            }

            setTodos([...todos, response.data]);
            todoRef.current.value = "";
        } catch (error) {
            console.log(error);
        }
    }

    const getAllTodos = async () => {
        try {
            const response = await axios.get("/api/todos");
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }

    const deletetodo = async (id) => {
        try {
            await axios.delete(`/api/todos/${id}`);
            const response = todos.filter(todo => todo._id !== id);
            setTodos(response);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }

    const edittodo = async (id, title) => {
        try {
            todoRef.current.value = title;
            setEditingId(id);
        } catch (error) {
            console.error('Error editing todo:', error);
        }
    }

    const updateTodo = async (e) => {
        try {
            e.preventDefault()
            let title = todoRef.current.value.trim();
            if (!title) return;
            await axios.patch(`/api/todos/${editingId}`, { title });

            setTodos(todos => todos.map(todo => {
                return todo._id === editingId ? { ...todo, title } : todo;
            }));
            setEditingId(null);
            todoRef.current.value = "";
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    }

    useEffect(() => {
        getAllTodos();
    }, []);

    return (
        <div className="container">
            <div className="addTask">
                <form onSubmit={editingId ? updateTodo : handleFormSubmit}>
                    <input ref={todoRef} id="input" type="text" placeholder="Add your task" />
                    <button id="add" className="btn">{editingId ? "Update Task" : "Add Task"}</button>
                </form>
            </div>
            {todos.length>0 && (<>
                <div className="taskList">
                    <ul>
                        {todos && todos.map((todo, index) => (
                            <li key={index}>
                                <span>{todo.title}</span>
                                <div className="btn-actions">
                                    <button
                                        id="edit"
                                        className="btn"
                                        onClick={() => edittodo(todo._id, todo.title)}
                                    >
                                        Edit Task
                                    </button>
                                    <button
                                        id="delete"
                                        className="btn"
                                        onClick={() => deletetodo(todo._id)}
                                    >
                                        Delete Task
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </>)}
        </div>
    );
}

export default Todos;
