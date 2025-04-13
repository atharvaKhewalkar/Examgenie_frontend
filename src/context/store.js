// src/context/store.js
import React, { createContext, useReducer } from 'react';

export const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  questions: [],
  generatedPapers: [],
  loading: false,
  error: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    case 'ADD_PAPER':
      return {
        ...state,
        generatedPapers: [action.payload, ...state.generatedPapers].slice(0, 20) // Keep last 20 papers
      };
    case 'UPDATE_USER_PREFERENCES':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};