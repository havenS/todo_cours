// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import "./Todo.css";
import Todo from "./Todo";
import api from "./services/api";

const App = () => {
  const [folders, setFolders] = useState([]);
  const [todos, setTodos] = useState([
    { id: 1, content: "Todo 1", completed: false, folderId: 1 },
  ]);
  const [selectedFolderId, setSelectedFolderId] = useState();
  const [search, setSearch] = useState("");
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [showAddTodoModal, setShowAddTodoModal] = useState(false);
  const [newTodoContent, setNewTodoContent] = useState("");
  const [newTodoFolderId, setNewTodoFolderId] = useState("");

  const handleAddFolder = () => {
    api.createFolder({ name: newFolderName }).then((response) => {
      // Rechargez la liste des dossiers après avoir créé un nouveau dossier
      setFolders(response.data);
    });
    setNewFolderName("");
    setShowAddFolderModal(false);
  };

  const handleAddTodo = () => {
    setShowAddTodoModal(false);
    api
      .createTodo({ content: newTodoContent, folderId: newTodoFolderId })
      .then(() => {
        // Rechargez la liste des dossiers après avoir créé un nouveau dossier
        api.fetchTodos(newTodoFolderId).then((response) => {
          setTodos(response.data);
        });
      });
    setNewTodoContent("");
    setNewTodoFolderId("");
  };

  useEffect(() => {
    api.searchTodos("").then((response) => {
      setTodos(response.data);
    });
    api.fetchFolders().then((response) => {
      setFolders(response.data);
    });
  }, []);

  const handleFolderClick = (folderId) => {
    setSelectedFolderId(folderId);
    api.fetchTodos(folderId).then((response) => {
      setTodos(response.data);
    });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    api.searchTodos(e.target.value).then((response) => {
      setTodos(response.data);
    });
  };

  const onTodoUpdate = (id, data) => {
    api.updateTodoStatus(id, data).then((response) => {
      setTodos(response.data);
    });
  };
  const onTodoDelete = (id, data) => {
    api.deleteTodo(id).then((response) => {
      setTodos(response.data);
    });
  };

  return (
    <div className="App">
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <h2>Liste des dossiers</h2>
          <ul className="folder-list" style={{ listStyle: "initial" }}>
            {folders.map((folder) => (
              <li
                key={folder.id}
                onClick={() => handleFolderClick(folder.id)}
                className={folder.id === selectedFolderId ? "selected" : ""}
              >
                {folder.name}
              </li>
            ))}
          </ul>

          {/* Modale d'ajout de dossier */}
          {showAddFolderModal && (
            <div className="modal">
              <h2>Ajouter un dossier</h2>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nom du dossier"
              />
              <button onClick={handleAddFolder}>Ajouter</button>
              <button onClick={() => setShowAddFolderModal(false)}>
                Annuler
              </button>
            </div>
          )}
          <button onClick={() => setShowAddFolderModal(true)}>
            Ajouter un dossier
          </button>
        </div>

        <div style={{ flex: 2 }}>
          <h2>Liste des todos</h2>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            className="search-box"
          />
          {/* Bouton pour afficher la modale d'ajout de todo */}
          <button onClick={() => setShowAddTodoModal(true)}>
            Ajouter une todo
          </button>

          {/* Modale d'ajout de todo */}
          {showAddTodoModal && (
            <div className="modal">
              <h2>Ajouter une todo</h2>
              <input
                type="text"
                value={newTodoContent}
                onChange={(e) => setNewTodoContent(e.target.value)}
                placeholder="Contenu de la todo"
              />
              <select
                value={newTodoFolderId}
                onChange={(e) => setNewTodoFolderId(e.target.value)}
              >
                <option value="">Sélectionner un dossier</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
              <button onClick={handleAddTodo}>Ajouter</button>
              <button onClick={() => setShowAddTodoModal(false)}>
                Annuler
              </button>
            </div>
          )}

          {/* Liste des todos */}
          <ul className="todo-list">
            {todos.map((todo) => (
              <Todo
                key={todo.id}
                todo={todo}
                onUpdate={onTodoUpdate}
                onDelete={onTodoDelete}
                onComplete={onTodoUpdate}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
