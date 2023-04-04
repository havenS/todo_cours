import React, { useState, useEffect } from "react";
import "./App.css";
import "./Todo.css";
import Todo from "./Todo";
import api from "./services/api";

const App = () => {
  const [folders, setFolders] = useState([]);
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [showAddTodoModal, setShowAddTodoModal] = useState(false);
  const [newTodoContent, setNewTodoContent] = useState("");
  const [newTodoFolderId, setNewTodoFolderId] = useState("");

  useEffect(() => {
    api.fetchFolders().then((response) => {
      setFolders(response.data);
    });
  }, []);

  const handleFolderClick = (folderId) => {
    api.fetchTodos(folderId).then((response) => {
      setTodos(response.data);
    });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search.trim() !== "") {
      api.searchTodos(search).then((response) => {
        setTodos(response.data);
      });
    } else {
      api.fetchTodos().then((response) => {
        setTodos(response.data);
      });
    }
  }, [search]);

  const handleAddFolder = () => {
    api.createFolder({ name: newFolderName }).then(() => {
      api.fetchFolders().then((response) => {
        setFolders(response.data);
      });
    });
    setNewFolderName("");
    setShowAddFolderModal(false);
  };

  const handleAddTodo = () => {
    setShowAddTodoModal(false);
    setNewTodoContent("");
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
      <button onClick={() => setShowAddFolderModal(true)}>
        Ajouter un dossier
      </button>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        className="search-box"
      />
      <h2>Liste des dossiers</h2>
      <ul className="folder-list">
        {folders.map((folder) => (
          <li key={folder.id} onClick={() => handleFolderClick(folder.id)}>
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
          <button onClick={() => setShowAddFolderModal(false)}>Annuler</button>
        </div>
      )}

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
          <button onClick={() => setShowAddTodoModal(false)}>Annuler</button>
        </div>
      )}

      {/* Liste des todos */}
      {Array.isArray(todos) && todos.length > 0 ? (
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
      ) : (
        <p>Pas de résultats.</p>
      )}
    </div>
  );
};

export default App;
